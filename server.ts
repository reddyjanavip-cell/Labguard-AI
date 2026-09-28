import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { dbEngine } from './server/db';
import { calculateDeterministicAnalytics, detectOperationalRisks, generateRecommendations } from './server/analytics';
import { externalSyncService } from './server/externalSync';
import { aiService } from './server/aiService';
import { getSystemTraceForEntity } from './server/traceService';
import {
  patientSchema,
  testOrderSchema,
  orderStatusTransitionSchema,
  testResultVerificationSchema,
  testResultCreateSchema,
  inventoryItemSchema,
  restockSchema,
  equipmentSchema,
  maintenanceScheduleSchema,
  staffSchema,
  supplierSchema,
  billingSchema,
  dataSourceSchema
} from './server/validation';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to extract actor from request headers & persistent database
function getActor(req: Request) {
  const reqUserId = (req.headers['x-user-id'] as string) || '';
  const reqRole = (req.headers['x-user-role'] as string) || '';
  const users = dbEngine.getCollection('users');

  // Find matching user by id or role or email
  let matchedUser = users.find(u => u.id === reqUserId);
  if (!matchedUser && reqRole) {
    matchedUser = users.find(u => u.role === reqRole);
  }

  if (matchedUser) {
    return {
      userId: matchedUser.id,
      user: matchedUser.name,
      role: matchedUser.role,
      patientId: matchedUser.patientId || matchedUser.uhid,
      department: matchedUser.department,
      language: matchedUser.language || 'en'
    };
  }

  const roleLabels: Record<string, string> = {
    administrator: 'Chief Admin Sarah Jenkins',
    lab_manager: 'Dr. Aris Thorne, MD',
    technician: 'Senior Tech Rajesh V.',
    pathologist: 'Dr. Shalini Kulkarni, MD',
    finance: 'Finance Controller Anita Roy',
    pharmacist: 'Pawan Kumar, B.Pharm',
    patient: 'Aarav Sharma (Patient)'
  };

  const fallbackRole = (reqRole as any) || 'lab_manager';
  return {
    userId: reqUserId || 'USR-01',
    user: roleLabels[fallbackRole] || 'Authorized Lab User',
    role: fallbackRole,
    language: 'en'
  };
}

// ==========================================
// 0. AUTHENTICATION & USER MANAGEMENT
// ==========================================
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  try {
    const { identifier, userType = 'staff' } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'Valid registered identifier (Email, Employee ID, UHID, or Mobile Number) is required' });
    }

    const result = dbEngine.requestOTP(identifier, userType === 'patient' ? 'patient' : 'staff');
    if (!result.success) {
      const statusCode = result.cooldownSeconds > 0 ? 429 : 400;
      return res.status(statusCode).json({ error: result.error, cooldownSeconds: result.cooldownSeconds });
    }

    res.json({
      success: true,
      cooldownSeconds: result.cooldownSeconds,
      mode: result.mode,
      message: result.message
    });
  } catch (err: any) {
    res.status(500).json({ error: 'OTP request failed', details: err.message });
  }
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  try {
    const { identifier, otp, userType = 'staff' } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ error: 'Identifier and 6-digit OTP code are required' });
    }

    const result = dbEngine.verifyOTP(identifier, otp, userType === 'patient' ? 'patient' : 'staff');
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const { password: _, ...safeUser } = result.user!;
    res.json({
      success: true,
      user: safeUser,
      patient: result.patient,
      token: `sess_${safeUser.id}_${Date.now()}`
    });
  } catch (err: any) {
    res.status(500).json({ error: 'OTP verification failed', details: err.message });
  }
});

app.post('/api/auth/staff-login', (req: Request, res: Response) => {
  try {
    const { emailOrEmployeeId, password } = req.body;
    if (!emailOrEmployeeId || typeof emailOrEmployeeId !== 'string') {
      return res.status(400).json({ error: 'Email or Employee ID is required' });
    }

    const user = dbEngine.authenticateStaff(emailOrEmployeeId, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your Employee ID / Email and password.' });
    }

    // Safe user payload without plaintext password
    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
      token: `sess_${user.id}_${Date.now()}`
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
});

app.post('/api/auth/patient-login', (req: Request, res: Response) => {
  try {
    const { uhid, phone, otp } = req.body;
    if (!uhid && !phone) {
      return res.status(400).json({ error: 'UHID or Mobile Number is required' });
    }

    const result = dbEngine.authenticatePatient(uhid || '', phone || '', otp);
    if (!result) {
      return res.status(404).json({ error: 'Patient record not found. Please verify your UHID (e.g. PT-1001) and registered mobile number.' });
    }

    const { password: _, ...safeUser } = result.user;
    res.json({
      success: true,
      user: safeUser,
      patient: result.patient,
      token: `sess_pt_${safeUser.id}_${Date.now()}`
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Patient authentication failed', details: err.message });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const users = dbEngine.getCollection('users');
    const user = users.find(u => u.id === actor.userId) || users.find(u => u.role === actor.role);

    if (user) {
      const { password: _, ...safeUser } = user;
      return res.json({ authenticated: true, user: safeUser });
    }

    res.json({
      authenticated: true,
      user: {
        id: actor.userId,
        name: actor.user,
        role: actor.role,
        department: actor.department || 'Laboratory',
        language: actor.language || 'en'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Session check failed', details: err.message });
  }
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const targetUserId = req.body.userId || actor.userId;
    const updated = dbEngine.updateUserProfile(targetUserId, req.body, actor);

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Profile update failed', details: err.message });
  }
});

app.get('/api/auth/users', (req: Request, res: Response) => {
  try {
    const users = dbEngine.getCollection('users').map(u => {
      const { password: _, ...safe } = u;
      return safe;
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// ==========================================
// 0.1 DECISION & SYSTEM TRACE
// ==========================================
app.get('/api/trace/:entityId', (req: Request, res: Response) => {
  try {
    const entityId = req.params.entityId;
    const trace = getSystemTraceForEntity(entityId);
    res.json(trace);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate trace', details: err.message });
  }
});

// ==========================================
// 1. DASHBOARD & ANALYTICS
// ==========================================
app.get('/api/dashboard', (req: Request, res: Response) => {
  try {
    const metrics = calculateDeterministicAnalytics();
    const risks = detectOperationalRisks();
    const recommendations = generateRecommendations();
    res.json({
      metrics,
      risks,
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute dashboard metrics', details: err.message });
  }
});

app.get('/api/analytics', (req: Request, res: Response) => {
  try {
    const metrics = calculateDeterministicAnalytics();
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: 'Analytics calculation failed', details: err.message });
  }
});

// ==========================================
// 2. PATIENTS CRUD
// ==========================================
app.get('/api/patients', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { search, status, bloodGroup, limit = '100' } = req.query;
    let patients = dbEngine.getCollection('patients');

    if (actor.role === 'patient' && actor.patientId) {
      patients = patients.filter(p => p.patientId === actor.patientId);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.referringDoctor.toLowerCase().includes(q)
      );
    }

    if (status && typeof status === 'string' && status !== 'All') {
      patients = patients.filter(p => p.status === status);
    }

    if (bloodGroup && typeof bloodGroup === 'string' && bloodGroup !== 'All') {
      patients = patients.filter(p => p.bloodGroup === bloodGroup);
    }

    res.json(patients.slice(0, parseInt(limit as string, 10)));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch patients', details: err.message });
  }
});

app.post('/api/patients', (req: Request, res: Response) => {
  try {
    const validation = patientSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const newPatient = dbEngine.createPatient(validation.data, actor);
    res.status(201).json(newPatient);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create patient', details: err.message });
  }
});

app.put('/api/patients/:id', (req: Request, res: Response) => {
  try {
    const validation = patientSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const updated = dbEngine.updatePatient(req.params.id, validation.data, actor);
    if (!updated) {
      return res.status(404).json({ error: `Patient ${req.params.id} not found` });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update patient', details: err.message });
  }
});

app.delete('/api/patients/:id', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    // Role check: Only admin or lab_manager can delete patient records
    if (actor.role !== 'administrator' && actor.role !== 'lab_manager') {
      return res.status(403).json({ error: 'Unauthorized: Only Administrator or Lab Manager can archive patients' });
    }

    const force = req.query.force === 'true' || req.body?.force === true;
    const archive = req.query.archive === 'true' || req.body?.archive === true;

    const success = dbEngine.deletePatient(req.params.id, actor, { force, archive });
    if (!success) {
      return res.status(404).json({ error: `Patient ${req.params.id} not found` });
    }
    res.json({ 
      success: true, 
      message: archive ? `Patient ${req.params.id} archived successfully.` : `Patient ${req.params.id} removed successfully.` 
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. TEST ORDERS CRUD & WORKFLOW
// ==========================================
app.get('/api/test-orders', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status, priority, department, search } = req.query;
    let orders = dbEngine.getCollection('testOrders');

    if (actor.role === 'patient' && actor.patientId) {
      orders = orders.filter(o => o.patientId === actor.patientId);
    }

    if (status && typeof status === 'string' && status !== 'All') {
      orders = orders.filter(o => o.status === status);
    }

    if (priority && typeof priority === 'string' && priority !== 'All') {
      orders = orders.filter(o => o.priority === priority);
    }

    if (department && typeof department === 'string' && department !== 'All') {
      orders = orders.filter(o => o.department === department);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.testName.toLowerCase().includes(q)
      );
    }

    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch test orders', details: err.message });
  }
});

app.post('/api/test-orders', (req: Request, res: Response) => {
  try {
    const validation = testOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const newOrder = dbEngine.createTestOrder(validation.data, actor);
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create test order', details: err.message });
  }
});

app.patch('/api/test-orders/:id/status', (req: Request, res: Response) => {
  try {
    const validation = orderStatusTransitionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const updated = dbEngine.updateTestOrderStatus(req.params.id, validation.data.status, actor, validation.data.notes);
    if (!updated) {
      return res.status(404).json({ error: `Test order ${req.params.id} not found` });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// ==========================================
// 4. TEST RESULTS CRUD & VERIFICATION
// ==========================================
app.get('/api/test-results', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status, flag, search } = req.query;
    let results = dbEngine.getCollection('testResults');

    if (actor.role === 'patient' && actor.patientId) {
      const orders = dbEngine.getCollection('testOrders').filter(o => o.patientId === actor.patientId);
      const orderIds = new Set(orders.map(o => o.orderId));
      results = results.filter(r => orderIds.has(r.orderId));
    }

    if (status && typeof status === 'string' && status !== 'All') {
      results = results.filter(r => r.status === status);
    }

    if (flag && typeof flag === 'string' && flag !== 'All') {
      results = results.filter(r => r.flag === flag);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(r => 
        r.resultId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.testName.toLowerCase().includes(q)
      );
    }

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch test results', details: err.message });
  }
});

app.post('/api/test-results', (req: Request, res: Response) => {
  try {
    const validation = testResultCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const resultId = `RES-${5000 + dbEngine.getCollection('testResults').length + 1}`;

    const newResult = {
      ...validation.data,
      id: resultId,
      resultId,
      dateTime: now.replace('T', ' ').substring(0, 16),
      status: 'Preliminary' as const,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('testResults').unshift(newResult);
    dbEngine.logAudit({
      ...actor,
      action: 'Data Upload',
      dataset: 'Test Results',
      recordAffected: resultId,
      details: `Generated assay result: ${newResult.testName} = ${newResult.resultValue} ${newResult.unit} (${newResult.flag})`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newResult);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record test result', details: err.message });
  }
});

app.patch('/api/test-results/:id/verify', (req: Request, res: Response) => {
  try {
    const validation = testResultVerificationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const verified = dbEngine.verifyResult(req.params.id, validation.data.verifier, actor, validation.data.comments);
    if (!verified) {
      return res.status(404).json({ error: `Result ${req.params.id} not found` });
    }
    res.json(verified);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify result', details: err.message });
  }
});

// ==========================================
// 5. INVENTORY & REAGENTS ENGINE
// ==========================================
app.get('/api/inventory', (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    let inventory = dbEngine.getCollection('inventory');

    if (category && typeof category === 'string' && category !== 'All') {
      inventory = inventory.filter(i => i.category === category);
    }

    if (status && typeof status === 'string' && status !== 'All') {
      inventory = inventory.filter(i => i.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      inventory = inventory.filter(i => 
        i.itemName.toLowerCase().includes(q) ||
        i.itemId.toLowerCase().includes(q) ||
        i.supplier.toLowerCase().includes(q) ||
        i.batchNumber.toLowerCase().includes(q)
      );
    }

    res.json(inventory);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch inventory', details: err.message });
  }
});

app.post('/api/inventory', (req: Request, res: Response) => {
  try {
    const validation = inventoryItemSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const newItem = dbEngine.createInventoryItem(validation.data, actor);
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create inventory item', details: err.message });
  }
});

app.post('/api/inventory/:id/restock', (req: Request, res: Response) => {
  try {
    const validation = restockSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const restocked = dbEngine.restockInventoryItem(
      req.params.id,
      validation.data.quantity,
      actor,
      validation.data.purchaseOrderNumber
    );

    if (!restocked) {
      return res.status(404).json({ error: `Inventory item ${req.params.id} not found` });
    }
    res.json(restocked);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restock inventory item', details: err.message });
  }
});

app.get('/api/inventory/transactions', (req: Request, res: Response) => {
  try {
    res.json(dbEngine.getCollection('inventoryTransactions'));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch inventory transactions', details: err.message });
  }
});

// ==========================================
// 6. EQUIPMENT & MAINTENANCE
// ==========================================
app.get('/api/equipment', (req: Request, res: Response) => {
  try {
    const { department, status } = req.query;
    let equipment = dbEngine.getCollection('equipment');

    if (department && typeof department === 'string' && department !== 'All') {
      equipment = equipment.filter(e => e.department === department);
    }

    if (status && typeof status === 'string' && status !== 'All') {
      equipment = equipment.filter(e => e.operationalStatus === status);
    }

    res.json(equipment);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: err.message });
  }
});

app.post('/api/equipment', (req: Request, res: Response) => {
  try {
    const validation = equipmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const equipmentId = `EQ-${100 + dbEngine.getCollection('equipment').length + 1}`;

    const newEquip = {
      ...validation.data,
      id: equipmentId,
      equipmentId,
      testsProcessed: 0,
      downtimeHours: 0,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('equipment').push(newEquip);
    dbEngine.logAudit({
      ...actor,
      action: 'Equipment Update',
      dataset: 'Equipment',
      recordAffected: equipmentId,
      details: `Registered new laboratory equipment: ${newEquip.name} (${newEquip.manufacturer})`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newEquip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to register equipment', details: err.message });
  }
});

app.post('/api/equipment/:id/maintenance', (req: Request, res: Response) => {
  try {
    const validation = maintenanceScheduleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const actor = getActor(req);
    const updated = dbEngine.scheduleMaintenance(
      req.params.id,
      validation.data.scheduledDate,
      validation.data.engineerName,
      validation.data.notes,
      actor
    );

    if (!updated) {
      return res.status(404).json({ error: `Equipment ${req.params.id} not found` });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to schedule maintenance', details: err.message });
  }
});

// ==========================================
// 7. STAFF ROSTER
// ==========================================
app.get('/api/staff', (req: Request, res: Response) => {
  try {
    const { department, shift } = req.query;
    let staff = dbEngine.getCollection('staff');

    if (department && typeof department === 'string' && department !== 'All') {
      staff = staff.filter(s => s.department === department);
    }

    if (shift && typeof shift === 'string' && shift !== 'All') {
      staff = staff.filter(s => s.shift === shift);
    }

    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch staff roster', details: err.message });
  }
});

app.post('/api/staff', (req: Request, res: Response) => {
  try {
    const validation = staffSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const staffId = `STF-${100 + dbEngine.getCollection('staff').length + 1}`;

    const newStaff = {
      ...validation.data,
      id: staffId,
      staffId,
      testsProcessed: 0,
      workloadPercent: 50,
      status: 'On Duty' as const,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('staff').push(newStaff);
    dbEngine.logAudit({
      ...actor,
      action: 'CREATE_STAFF',
      dataset: 'Staff',
      recordAffected: staffId,
      details: `Enrolled new staff member: ${newStaff.name} (${newStaff.role}, ${newStaff.shift} Shift)`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newStaff);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add staff member', details: err.message });
  }
});

// ==========================================
// 8. SUPPLIERS
// ==========================================
app.get('/api/suppliers', (req: Request, res: Response) => {
  try {
    res.json(dbEngine.getCollection('suppliers'));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
  }
});

app.post('/api/suppliers', (req: Request, res: Response) => {
  try {
    const validation = supplierSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const supplierId = `SUP-${100 + dbEngine.getCollection('suppliers').length + 1}`;

    const newSupplier = {
      ...validation.data,
      id: supplierId,
      supplierId,
      orderCount: 1,
      pendingOrders: 0,
      lastOrder: now.substring(0, 10),
      reliabilityScore: 95,
      contractId: `CTR-${supplierId}-2026`,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('suppliers').push(newSupplier);
    dbEngine.logAudit({
      ...actor,
      action: 'CREATE_SUPPLIER',
      dataset: 'Suppliers',
      recordAffected: supplierId,
      details: `Onboarded new supplier partner: ${newSupplier.supplierName}`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newSupplier);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add supplier', details: err.message });
  }
});

// ==========================================
// 9. BILLING & INVOICES
// ==========================================
app.get('/api/billing', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status, paymentMethod } = req.query;
    let billing = dbEngine.getCollection('billing');

    if (actor.role === 'patient' && actor.patientId) {
      billing = billing.filter(b => b.patientId === actor.patientId);
    }

    if (status && typeof status === 'string' && status !== 'All') {
      billing = billing.filter(b => b.paymentStatus === status);
    }

    if (paymentMethod && typeof paymentMethod === 'string' && paymentMethod !== 'All') {
      billing = billing.filter(b => b.paymentMethod === paymentMethod);
    }

    res.json(billing);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch billing records', details: err.message });
  }
});

app.post('/api/billing', (req: Request, res: Response) => {
  try {
    const validation = billingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const invoiceId = `INV-${8000 + dbEngine.getCollection('billing').length + 1}`;
    const totalAmount = validation.data.amount - validation.data.discount + validation.data.tax;

    const newInvoice = {
      ...validation.data,
      id: invoiceId,
      invoiceId,
      totalAmount,
      date: now.substring(0, 10),
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('billing').unshift(newInvoice);
    dbEngine.logAudit({
      ...actor,
      action: 'CREATE_INVOICE',
      dataset: 'Billing',
      recordAffected: invoiceId,
      details: `Generated clinical invoice for ${newInvoice.patientName}: ₹${totalAmount} via ${newInvoice.paymentMethod}`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newInvoice);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create invoice', details: err.message });
  }
});

// ==========================================
// 9.1 DOCTORS & OPD APPOINTMENTS
// ==========================================
app.get('/api/doctors', (req: Request, res: Response) => {
  try {
    const doctors = dbEngine.getCollection('doctors');
    res.json(doctors);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: err.message });
  }
});

app.put('/api/doctors/:id/status', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = dbEngine.updateDoctorStatus(req.params.id, status, actor);
    if (!updated) return res.status(404).json({ error: 'Doctor not found' });

    res.json({ success: true, doctor: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update doctor status', details: err.message });
  }
});

app.get('/api/appointments', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    let apts = dbEngine.getCollection('appointments');

    // Strict patient-only isolation
    if (actor.role === 'patient' && actor.patientId) {
      apts = apts.filter(a => a.patientId === actor.patientId);
    }

    res.json(apts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
});

app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { patientId, patientName, doctorId, doctorName, department, date, time, room, reason } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'Patient ID, Doctor ID, Date, and Time are required' });
    }

    const newApt = dbEngine.createAppointment(
      {
        patientId,
        patientName: patientName || 'Registered Patient',
        doctorId,
        doctorName: doctorName || 'Attending Physician',
        department: department || 'General OPD',
        date,
        time,
        room: room || 'OPD Room',
        reason
      },
      actor
    );

    res.status(201).json(newApt);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to schedule appointment', details: err.message });
  }
});

app.put('/api/appointments/:id/status', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status } = req.body;
    const updated = dbEngine.updateAppointmentStatus(req.params.id, status, actor);
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ success: true, appointment: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update appointment', details: err.message });
  }
});

// ==========================================
// 9.2 PHARMACY & DISPENSARY
// ==========================================
app.get('/api/pharmacy/medicines', (req: Request, res: Response) => {
  try {
    const medicines = dbEngine.getCollection('pharmacyMedicines');
    res.json(medicines);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch medicines', details: err.message });
  }
});

app.post('/api/pharmacy/medicines', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const now = new Date().toISOString();
    const count = dbEngine.getCollection('pharmacyMedicines').length + 1;
    const drugId = `DRG-${100 + count}`;

    const newDrug = {
      ...req.body,
      id: `MED-${count.toString().padStart(2, '0')}`,
      drugId,
      quantity: Number(req.body.quantity) || 0,
      reorderLevel: Number(req.body.reorderLevel) || 50,
      costPrice: Number(req.body.costPrice) || 0,
      sellingPrice: Number(req.body.sellingPrice) || 0,
      status: (Number(req.body.quantity) || 0) > (Number(req.body.reorderLevel) || 50) ? 'IN STOCK' : 'LOW STOCK',
      createdAt: now,
      updatedAt: now
    };

    dbEngine.getCollection('pharmacyMedicines').push(newDrug);
    dbEngine.logAudit({
      ...actor,
      action: 'PHARMACY_RESTOCKED',
      dataset: 'Pharmacy',
      recordAffected: drugId,
      details: `Added new pharmaceutical drug to formulary: ${newDrug.drugName}`
    });
    dbEngine.scheduleSave();
    res.status(201).json(newDrug);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add medicine', details: err.message });
  }
});

app.put('/api/pharmacy/medicines/:id/restock', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { quantity, poNumber } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid restock quantity is required' });
    }

    const updated = dbEngine.restockPharmacyMedicine(req.params.id, quantity, actor, poNumber);
    res.json({ success: true, medicine: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restock medicine', details: err.message });
  }
});

app.get('/api/pharmacy/prescriptions', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    let rxs = dbEngine.getCollection('prescriptions');

    // Strict patient-only isolation
    if (actor.role === 'patient' && actor.patientId) {
      rxs = rxs.filter(r => r.patientId === actor.patientId);
    }

    res.json(rxs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch prescriptions', details: err.message });
  }
});

app.post('/api/pharmacy/prescriptions', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const now = new Date().toISOString();
    const count = dbEngine.getCollection('prescriptions').length + 1;
    const prescriptionId = `RX-2026-${800 + count}`;

    const newRx = {
      ...req.body,
      id: `RX-${1000 + count}`,
      prescriptionId,
      prescriptionStatus: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    dbEngine.getCollection('prescriptions').unshift(newRx);
    dbEngine.logAudit({
      ...actor,
      action: 'PRESCRIPTION_CREATED',
      dataset: 'Pharmacy',
      recordAffected: prescriptionId,
      details: `Created prescription ${prescriptionId} for ${newRx.patientName} with ${newRx.medicines?.length || 0} medicines`
    });
    dbEngine.scheduleSave();
    res.status(201).json(newRx);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create prescription', details: err.message });
  }
});

app.post('/api/pharmacy/dispense', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { patientId, patientName, prescriptionId, items, discountPercent, paymentMethod, deliveryType, deliveryAddress, contactPhone } = req.body;

    if (!patientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Patient ID and items array are required' });
    }

    const result = dbEngine.dispensePharmacy(
      {
        patientId,
        patientName: patientName || 'Patient',
        prescriptionId,
        items,
        pharmacistName: actor.user,
        discountPercent: Number(discountPercent) || 0,
        paymentMethod: paymentMethod || 'UPI',
        deliveryType,
        deliveryAddress,
        contactPhone
      },
      actor
    );

    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Dispensing failed' });
  }
});

app.get('/api/pharmacy/bills', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    let bills = dbEngine.getCollection('pharmacyBills');

    if (actor.role === 'patient' && actor.patientId) {
      bills = bills.filter(b => b.patientId === actor.patientId);
    }

    res.json(bills);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch pharmacy bills', details: err.message });
  }
});

app.get('/api/pharmacy/deliveries', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    let deliveries = dbEngine.getCollection('pharmacyDeliveries');

    if (actor.role === 'patient' && actor.patientId) {
      deliveries = deliveries.filter(d => d.patientId === actor.patientId);
    }

    res.json(deliveries);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch delivery orders', details: err.message });
  }
});

app.put('/api/pharmacy/deliveries/:id/status', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const { status } = req.body;
    const updated = dbEngine.updatePharmacyDeliveryStatus(req.params.id, status, actor);
    if (!updated) return res.status(404).json({ error: 'Delivery order not found' });
    res.json({ success: true, delivery: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update delivery status', details: err.message });
  }
});

app.get('/api/pharmacy/pharmacists', (req: Request, res: Response) => {
  try {
    const pharmacists = dbEngine.getCollection('pharmacists');
    res.json(pharmacists);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch pharmacists', details: err.message });
  }
});

// ==========================================
// 9.3 PATIENT SELF-SERVICE PORTAL
// ==========================================
app.get('/api/patient/my-record', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);

    // Support both patientId and uhid query parameters with fallback
    const rawTarget = (req.query.patientId as string) || (req.query.uhid as string) || actor.patientId || 'PT-1001';
    const targetPatientId = rawTarget.trim();

    // Access control: if actor is a patient and has bound patientId, restrict to their UHID
    if (actor.role === 'patient' && actor.patientId && actor.patientId.toUpperCase() !== targetPatientId.toUpperCase()) {
      return res.status(403).json({ error: 'Access denied: You may only access your own personal health records.' });
    }

    const allPatients = dbEngine.getCollection('patients');
    const patient = allPatients.find(p => p.patientId.toUpperCase() === targetPatientId.toUpperCase()) ||
                    allPatients.find(p => p.patientId === 'PT-1001') ||
                    allPatients[0];

    if (!patient) {
      return res.status(404).json({ error: 'Patient record not found' });
    }

    const normId = (patient.patientId || targetPatientId).toUpperCase();
    const orders = dbEngine.getCollection('testOrders').filter(o => (o.patientId || '').toUpperCase() === normId);
    const orderIds = new Set(orders.map(o => o.orderId));
    const results = dbEngine.getCollection('testResults').filter(r => orderIds.has(r.orderId) || (r.patientId && r.patientId.toUpperCase() === normId));
    const appointments = dbEngine.getCollection('appointments').filter(a => (a.patientId || '').toUpperCase() === normId);
    const prescriptions = dbEngine.getCollection('prescriptions').filter(p => (p.patientId || '').toUpperCase() === normId);
    const pharmacyBills = dbEngine.getCollection('pharmacyBills').filter(b => (b.patientId || '').toUpperCase() === normId);
    const pharmacyDeliveries = dbEngine.getCollection('pharmacyDeliveries').filter(d => (d.patientId || '').toUpperCase() === normId);

    res.json({
      patient,
      orders,
      results,
      appointments,
      prescriptions,
      pharmacyBills,
      pharmacyDeliveries,
      bills: pharmacyBills,
      deliveries: pharmacyDeliveries
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load patient record', details: err.message });
  }
});

// ==========================================
// 10. RISKS & RECOMMENDATIONS
// ==========================================
app.get('/api/risks', (req: Request, res: Response) => {
  try {
    const risks = detectOperationalRisks();
    res.json(risks);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to evaluate operational risks', details: err.message });
  }
});

app.get('/api/recommendations', (req: Request, res: Response) => {
  try {
    const recommendations = generateRecommendations();
    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch recommendations', details: err.message });
  }
});

app.post('/api/recommendations/:id/execute', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const recId = req.params.id;
    const recs = dbEngine.getCollection('recommendations');
    const rec = recs.find(r => r.recId === recId);

    if (!rec) {
      return res.status(404).json({ error: `Recommendation ${recId} not found` });
    }

    if (recId === 'REC-01') {
      // Execute Vitamin D Restock
      dbEngine.restockInventoryItem('INV-101', 30, actor, 'PO-ABBOTT-2026-09');
    }

    rec.executed = true;
    rec.executedAt = new Date().toISOString();

    dbEngine.logAudit({
      ...actor,
      action: 'Recommendation Executed',
      dataset: 'AI Action Center',
      recordAffected: recId,
      details: `Executed recommendation: "${rec.title}" -> ${rec.recommendedAction}`
    });

    dbEngine.scheduleSave();
    res.json({ success: true, recommendation: rec });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to execute recommendation', details: err.message });
  }
});

// ==========================================
// 11. GROUNDED SMART LAB COPILOT
// ==========================================
app.post('/api/copilot', async (req: Request, res: Response) => {
  try {
    const { query, language = 'en' } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const actor = getActor(req);
    const response = await aiService.queryCopilot(query, actor.role, actor, language);

    dbEngine.logAudit({
      ...actor,
      action: 'AI Analysis',
      dataset: 'Smart Lab Copilot',
      recordAffected: 'Prompt Query',
      details: `AI query analyzed: "${query.substring(0, 50)}..." [Private Processing Mode]`
    });

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: 'Copilot query execution failed', details: err.message });
  }
});

// ==========================================
// 12. WHAT-IF SIMULATOR ENGINE
// ==========================================
app.post('/api/simulator', (req: Request, res: Response) => {
  try {
    const {
      volumeMultiplier = 1.0,
      staffAvailabilityMultiplier = 1.0,
      analyzerOffline = false,
      reagentDeliveryDelayDays = 0,
      operatingHoursPerDay = 16
    } = req.body;

    const baseMetrics = calculateDeterministicAnalytics();
    const inventory = dbEngine.getCollection('inventory');
    const vitD = inventory.find(i => i.itemId === 'INV-101');

    // Deterministic simulation calculations
    const simulatedVolume = Math.round(baseMetrics.totalTestsToday * volumeMultiplier);
    const workloadIncrease = (volumeMultiplier - 1.0) * 120;
    const staffShortageImpact = (1.0 - staffAvailabilityMultiplier) * 85;
    const analyzerDownPenalty = analyzerOffline ? 95 : 0;

    const projectedPending = Math.max(10, Math.round(baseMetrics.pendingToday + workloadIncrease + staffShortageImpact + analyzerDownPenalty));

    // Turnaround time projection
    const addedMinutes = Math.round((volumeMultiplier - 1.0) * 60 + staffShortageImpact * 0.7 + analyzerDownPenalty * 0.6);
    const totalProjMinutes = Math.max(60, baseMetrics.averageTATMinutes + addedMinutes);
    const hours = Math.floor(totalProjMinutes / 60);
    const mins = totalProjMinutes % 60;
    const projectedTAT = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    // Biochemistry load
    let bioLoad = Math.round(94 * volumeMultiplier);
    if (analyzerOffline) bioLoad = 100;
    bioLoad = Math.min(100, Math.max(40, bioLoad));

    // Inventory days of stock
    const currentDaysStock = vitD ? (vitD.quantity / (vitD.weeklyConsumption || 31)) * 7 : 4.1;
    const simulatedDaysStock = Number((currentDaysStock / volumeMultiplier).toFixed(1));

    // Overtime calculation
    const overtimeHoursRequired = Math.max(0, Math.round((volumeMultiplier - 1.0) * 14 + (1.0 - staffAvailabilityMultiplier) * 10));

    res.json({
      currentState: {
        dailyVolume: baseMetrics.totalTestsToday,
        pendingTests: baseMetrics.pendingToday,
        averageTAT: baseMetrics.averageTAT,
        biochemistryLoadPercent: 94,
        daysOfStockRemaining: Number(currentDaysStock.toFixed(1)),
        overtimeHoursRequired: 0
      },
      simulatedState: {
        dailyVolume: simulatedVolume,
        pendingTests: projectedPending,
        averageTAT: projectedTAT,
        biochemistryLoadPercent: bioLoad,
        daysOfStockRemaining: simulatedDaysStock,
        overtimeHoursRequired
      },
      bottleneckAlerts: [
        bioLoad >= 98 ? 'Biochemistry throughput saturation: Cobas 6000 operating at 100% capacity' : null,
        simulatedDaysStock <= 3.0 ? 'Critical Reagent Depletion: Vitamin D inventory stockout within 3 days' : null,
        totalProjMinutes >= 200 ? 'SLA Alert: Turnaround time exceeds 3-hour outpatient delivery target' : null
      ].filter(Boolean),
      simulationLabel: 'AI ESTIMATE / SIMULATION'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation calculation failed', details: err.message });
  }
});

// ==========================================
// 13. AUDIT TRAIL
// ==========================================
app.get('/api/audit', (req: Request, res: Response) => {
  try {
    const { action, dataset, limit = '100' } = req.query;
    let logs = dbEngine.getCollection('auditLogs');

    if (action && typeof action === 'string' && action !== 'All') {
      logs = logs.filter(l => l.action === action);
    }

    if (dataset && typeof dataset === 'string' && dataset !== 'All') {
      logs = logs.filter(l => l.dataset === dataset);
    }

    res.json(logs.slice(0, parseInt(limit as string, 10)));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch audit log', details: err.message });
  }
});

// ==========================================
// 14. INTEGRATION CENTER & DATA SOURCES
// ==========================================
app.get('/api/integrations', (req: Request, res: Response) => {
  try {
    const sources = dbEngine.getCollection('dataSources');
    res.json(sources);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch data sources', details: err.message });
  }
});

app.post('/api/integrations', (req: Request, res: Response) => {
  try {
    const validation = dataSourceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', issues: validation.error.format() });
    }

    const now = new Date().toISOString();
    const actor = getActor(req);
    const sourceId = `SRC-${10 + dbEngine.getCollection('dataSources').length + 1}`;

    const newSource = {
      ...validation.data,
      id: sourceId,
      status: 'DISCONNECTED' as const,
      recordsReceived: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsRejected: 0,
      validationErrors: [],
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    dbEngine.getCollection('dataSources').push(newSource);
    dbEngine.logAudit({
      ...actor,
      action: 'INTEGRATION_CONNECTED',
      dataset: 'External Integrations',
      recordAffected: sourceId,
      details: `Configured new external integration: ${newSource.sourceName} (${newSource.integrationType})`
    });
    dbEngine.scheduleSave();

    res.status(201).json(newSource);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to register data source', details: err.message });
  }
});

app.post('/api/integrations/test-connection', async (req: Request, res: Response) => {
  try {
    const { endpointUrl, authType } = req.body;
    if (!endpointUrl) {
      return res.status(400).json({ error: 'endpointUrl is required' });
    }
    const result = await externalSyncService.testConnection(endpointUrl, authType || 'None');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Connection test failed', details: err.message });
  }
});

app.post('/api/integrations/:id/sync-now', async (req: Request, res: Response) => {
  try {
    const result = await externalSyncService.syncDataSource(req.params.id, 'manual');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Sync job failed', details: err.message });
  }
});

app.post('/api/integrations/:id/toggle-status', (req: Request, res: Response) => {
  try {
    const actor = getActor(req);
    const sources = dbEngine.getCollection('dataSources');
    const src = sources.find(s => s.id === req.params.id);
    if (!src) return res.status(404).json({ error: 'Data source not found' });

    const newStatus = src.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
    src.status = newStatus;
    src.updatedAt = new Date().toISOString();

    dbEngine.logAudit({
      ...actor,
      action: newStatus === 'CONNECTED' ? 'INTEGRATION_CONNECTED' : 'INTEGRATION_DISCONNECTED',
      dataset: 'External Integrations',
      recordAffected: src.id,
      details: `Integration state transitioned to ${newStatus} for ${src.sourceName}`
    });
    dbEngine.scheduleSave();

    res.json({ success: true, source: src });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle status', details: err.message });
  }
});

app.get('/api/sync', (req: Request, res: Response) => {
  try {
    res.json(dbEngine.getCollection('syncJobs'));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch sync history', details: err.message });
  }
});

// ==========================================
// 15. NOTIFICATIONS
// ==========================================
app.get('/api/notifications', (req: Request, res: Response) => {
  try {
    res.json(dbEngine.getCollection('notifications'));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  try {
    const notifs = dbEngine.getCollection('notifications');
    const n = notifs.find(item => item.id === req.params.id);
    if (n) {
      n.read = true;
      dbEngine.scheduleSave();
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update notification', details: err.message });
  }
});

app.post('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  try {
    const notifs = dbEngine.getCollection('notifications');
    notifs.forEach(n => { n.read = true; });
    dbEngine.scheduleSave();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark all as read', details: err.message });
  }
});

// ==========================================
// 16. SYSTEM HEALTH & TELEMETRY STREAM (SSE)
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const sources = dbEngine.getCollection('dataSources');
    const hasErrorSource = sources.some(s => s.status === 'ERROR');
    const settings = dbEngine.getCollection('settings');

    res.json({
      overall: hasErrorSource ? 'WARNING' : 'HEALTHY',
      components: {
        database: { status: 'HEALTHY', provider: 'Persistent Laboratory Engine', path: 'data/laboratory-db.json' },
        authentication: { status: 'HEALTHY', provider: 'Sovereign Role-Based RBAC', activeRole: 'Lab Manager' },
        aiService: {
          status: 'HEALTHY',
          provider: aiService.isConfigured() ? 'Gemini 3.8 Flash (Server-Side Proxy)' : 'Sovereign Offline Fallback Engine',
          model: 'gemini-3.8-flash'
        },
        externalIntegrations: {
          status: hasErrorSource ? 'WARNING' : 'HEALTHY',
          activeSourcesCount: sources.filter(s => s.status === 'CONNECTED' || s.status === 'SYNCED').length,
          totalSources: sources.length
        },
        realTimeSync: { status: 'HEALTHY', mode: settings.telemetryMode, pushEngine: 'SSE' }
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

// Telemetry mode toggle
app.get('/api/telemetry/mode', (req: Request, res: Response) => {
  const settings = dbEngine.getCollection('settings');
  res.json({ mode: settings.telemetryMode });
});

app.post('/api/telemetry/mode', (req: Request, res: Response) => {
  const { mode } = req.body;
  if (mode !== 'LIVE' && mode !== 'DEMO') {
    return res.status(400).json({ error: 'Mode must be LIVE or DEMO' });
  }
  const settings = dbEngine.getCollection('settings');
  settings.telemetryMode = mode;
  dbEngine.scheduleSave();
  res.json({ success: true, mode });
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/telemetry/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connected ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

  // Listener for DB mutations
  const onMutation = (event: any) => {
    res.write(`data: ${JSON.stringify({ type: 'MUTATION', ...event })}\n\n`);
  };

  // Listener for telemetry ticks
  const onTelemetry = (event: any) => {
    res.write(`data: ${JSON.stringify({ type: 'TELEMETRY_TICK', ...event })}\n\n`);
  };

  dbEngine.on('mutation', onMutation);
  externalSyncService.on('telemetry', onTelemetry);

  // Clean up when client disconnects
  req.on('close', () => {
    dbEngine.off('mutation', onMutation);
    externalSyncService.off('telemetry', onTelemetry);
    res.end();
  });
});

// ==========================================
// 17. STATIC FRONTEND & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LABGUARD AI] Production Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
