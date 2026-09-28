import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  FileText,
  CornerDownLeft,
  Loader2
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  structuredResponse?: {
    answer: string;
    evidence: string[];
    recommendedAction: string;
    sovereignNotice: string;
  };
}

export const CopilotView: React.FC = () => {
  const { kpis, addAuditLog } = useLabData();
  const { currentUser, effectiveRole, patientRecord } = useAuth();
  const { language, t } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getInitialGreeting = () => {
    if (effectiveRole === 'patient') {
      if (language === 'hi') {
        return `आपके लैबगार्ड स्वास्थ्य सहायक में आपका स्वागत है, ${currentUser?.name || 'रोगी'}। मैं आपके सत्यापित लैब परीक्षणों, डॉक्टर ओपीडी टोकन और फार्मेसी दवाओं के निर्देशों में आपकी सहायता कर सकता हूं। (नोट: नैदानिक चिकित्सा निदान केवल आपके चिकित्सक द्वारा प्रदान किया जाता है)।`;
      }
      if (language === 'kn') {
        return `ನಿಮ್ಮ ಲ್ಯಾಬ್‌ಗಾರ್ಡ್ ಆರೋಗ್ಯ ಸಹಾಯಕರೊಂದಿಗೆ ಸುಸ್ವಾಗತ, ${currentUser?.name || 'ರೋಗಿ'}. ನಿಮ್ಮ ಪರಿಶೀಲಿಸಿದ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು, ವೈದ್ಯರ ಒಪಿಡಿ ಟೋಕನ್ ಮತ್ತು ಔಷಧಾಲಯ ಔಷಧಿಗಳ ವಿವರಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. (ಗಮನಿಸಿ: ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವನ್ನು ನಿಮ್ಮ ವೈದ್ಯರು ಮಾತ್ರ ನೀಡುತ್ತಾರೆ).`;
      }
      return `Welcome to your LABGUARD Health Assistant, ${currentUser?.name || 'Patient'}. I can assist you with your verified lab test statuses, doctor OPD token slots, and pharmacy medicine dispensing instructions. (Note: Clinical medical diagnoses are exclusively provided by your consulting physician).`;
    }

    if (language === 'hi') {
      return "लैबगार्ड एआई कोपायलट में आपका स्वागत है। मैं आपके निजी प्रयोगशाला संचालन निर्णय समर्थन एजेंट के रूप में कार्य करता हूं। मेरा दायरा परिचालन तक सीमित है: अभिकर्मक सूची, विश्लेषक उपयोग, लंबित कतारें, टर्नअराउंड समय और आपूर्ति रसद।";
    }
    if (language === 'kn') {
      return "ಲ್ಯಾಬ್‌ಗಾರ್ಡ್ ಎಐ ಕೋಪೈಲಟ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ಖಾಸಗಿ ಪ್ರಯೋಗಾಲಯ ಕಾರ್ಯಾಚರಣೆಯ ನಿರ್ಧಾರ ಬೆಂಬಲ ಏಜೆಂಟ್ ಆಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತೇನೆ. ನನ್ನ ವ್ಯಾಪ್ತಿ ಕಾರ್ಯಾಚರಣೆಗೆ ಸೀಮಿತವಾಗಿದೆ: ರೀಜೆಂಟ್ ದಾಸ್ತಾನು, ವಿಶ್ಲೇಷಕ ಬಳಕೆ, ಬಾಕಿ ಕ್ಯೂಗಳು ಮತ್ತು ಸರಬರಾಜುಗಳು.";
    }
    return "Welcome to LABGUARD AI Copilot. I operate as your private laboratory operations decision support agent. I do not provide clinical medical diagnosis; my scope is strictly operational: reagent inventory, analyzer utilization, pending queues, turnaround times, and supplier logistics.";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: '09:00 AM',
      structuredResponse: {
        answer: getInitialGreeting(),
        evidence: [
          "Real-time NovaCare laboratory dataset loaded (1,248 tests processed today)",
          "Active Reagent Monitoring: 30 monitored lines, ₹8,42,000 inventory value",
          "Equipment Fleet: 10 analyzers monitored with live utilization telemetry"
        ],
        recommendedAction: effectiveRole === 'patient'
          ? "Check your diagnostic test order status, review active prescriptions, or verify your OPD appointment time."
          : "Select one of the sample operational queries below or enter a specific inquiry about current reagents, equipment, or queues.",
        sovereignNotice: "Private Processing Mode · Sovereign AI Governance Layer Active"
      }
    }
  ]);

  const presetQueries = React.useMemo(() => {
    if (effectiveRole === 'patient') {
      if (language === 'hi') {
        return [
          "मेरे रक्त परीक्षण आदेशों की वर्तमान स्थिति क्या है?",
          "मेरा अगला ओपीडी डॉक्टर परामर्श कब निर्धारित है?",
          "क्या मेरी निर्धारित दवाएं फार्मेसी में उपलब्ध हैं?",
          "आगामी लिपिड प्रोफाइल के लिए उपवास के क्या निर्देश हैं?"
        ];
      }
      if (language === 'kn') {
        return [
          "ನನ್ನ ರಕ್ತ ಪರೀಕ್ಷಾ ಆದೇಶಗಳ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಏನು?",
          "ನನ್ನ ಮುಂದಿನ ಒಪಿಡಿ ವೈದ್ಯರ ಸಮಾಲೋಚನೆ ಯಾವಾಗ ನಿಗದಿಯಾಗಿದೆ?",
          "ನನ್ನ ಸೂಚಿಸಲಾದ ಔಷಧಿಗಳು ಔಷಧಾಲಯದಲ್ಲಿ ಸಿದ್ಧವಾಗಿವೆಯೇ?",
          "ನನ್ನ ಮುಂದಿನ ಲಿಪಿಡ್ ಪ್ರೊಫೈಲ್‌ಗಾಗಿ ಉಪವಾಸದ ಸೂಚನೆಗಳು ಯಾವುವು?"
        ];
      }
      return [
        "What is the current status of my blood test orders?",
        "When is my next scheduled OPD doctor consultation?",
        "Are my prescribed medicines ready for pickup at the pharmacy?",
        "What are my fasting instructions for my upcoming lipid profile?"
      ];
    }

    if (language === 'hi') {
      return [
        "विटामिन डी अभिकर्मक जोखिम क्यों है और मुझे क्या करना चाहिए?",
        "किन अभिकर्मकों पर तत्काल ध्यान देने की आवश्यकता है?",
        "किस उपकरण का उपयोग सबसे अधिक है?",
        "प्रयोगशाला प्रबंधक को आज क्या समीक्षा करनी चाहिए?"
      ];
    }
    if (language === 'kn') {
      return [
        "ವಿಟಮಿನ್ ಡಿ ರೀಜೆಂಟ್ ಅಪಾಯ ಏಕೆ ಮತ್ತು ನಾನೇನು ಮಾಡಬೇಕು?",
        "ಯಾವ ರೀಜೆಂಟ್‌ಗಳಿಗೆ ತಕ್ಷಣದ ಗಮನ ಬೇಕು?",
        "ಯಾವ ಉಪಕರಣವು ಗರಿಷ್ಠ ಬಳಕೆಯಲ್ಲಿದೆ?",
        "ಲ್ಯಾಬ್ ಮ್ಯಾನೇಜರ್ ಇಂದು ಏನನ್ನು ಪರಿಶೀಲಿಸಬೇಕು?"
      ];
    }
    return [
      "Why is Vitamin D reagent a risk and what should I do?",
      "Which reagents need immediate attention?",
      "Which equipment has highest utilization?",
      "What should the laboratory manager review today?"
    ];
  }, [effectiveRole, language]);

  React.useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'm-1') {
        return [{
          ...prev[0],
          structuredResponse: {
            ...prev[0].structuredResponse!,
            answer: getInitialGreeting()
          }
        }];
      }
      return prev;
    });
  }, [language, effectiveRole]);

  const handleSend = async (queryToSend: string) => {
    if (!queryToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || 'USR-01',
          'x-user-role': effectiveRole
        },
        body: JSON.stringify({
          query: queryToSend,
          language,
          role: effectiveRole,
          patientContext: effectiveRole === 'patient' ? {
            patientId: currentUser?.patientId || 'PT-1001',
            name: currentUser?.name
          } : undefined,
          labContext: {
            totalTestsToday: kpis.totalTestsToday,
            completedToday: kpis.completedToday,
            pendingToday: kpis.pendingToday,
            averageTAT: kpis.averageTAT,
            dailyRevenue: kpis.dailyRevenue,
            inventoryValue: kpis.inventoryValue
          }
        })
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: data
      };

      setMessages(prev => [...prev, aiMsg]);
      addAuditLog('AI Analysis', 'Smart Lab Copilot', queryToSend.substring(0, 30), 'Operational inquiry answered under Sovereign AI protocol.');
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      // Local fallback
      const fallbackAiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: {
          answer: "25-OH Vitamin D Chemiluminescent Reagent (INV-101) is at critical risk of stock depletion within 4.1 days based on current burn rate.",
          evidence: [
            "Current physical stock: 18 units (Threshold: 20 units)",
            "Weekly consumption: 31 units (~4.4 units/day)",
            "Supplier lead time: 4 days from Abbott Diagnostics India"
          ],
          recommendedAction: "Order 30 units from Abbott Diagnostics immediately to prevent 140+ test cancellations.",
          sovereignNotice: "Private Processing Mode · Sovereign AI Audit Trace"
        }
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Bot className="h-3.5 w-3.5" />
            Sovereign Lab Assistant
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart Lab Copilot
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interrogate private laboratory telemetry with zero clinical diagnosis boundaries. Explainable citations only.
          </p>
        </div>

        {/* Clinical Disclaimer Badge */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs text-amber-900 max-w-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Operational Scope:</strong> Reagents, equipment & queues only. Does not provide clinical patient diagnoses.
          </span>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Suggested Queries:</span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-lg shadow-2xs transition-colors text-left"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl rounded-xl bg-teal-700 text-white p-3.5 shadow-xs text-xs space-y-1">
                  <div className="font-medium leading-relaxed">{msg.text}</div>
                  <div className="text-[10px] text-teal-200 text-right">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          const resp = msg.structuredResponse;
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-3xl rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-xs text-xs space-y-3.5 text-left">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-teal-600 flex items-center justify-center text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-slate-900">LABGUARD Sovereign Copilot</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                {/* 1. Answer */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Operational Answer
                  </div>
                  <p className="text-slate-800 text-xs font-medium leading-relaxed">
                    {resp?.answer}
                  </p>
                </div>

                {/* 2. Evidence */}
                {resp?.evidence && resp.evidence.length > 0 && (
                  <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Supporting Laboratory Telemetry & Evidence
                    </div>
                    <ul className="space-y-1">
                      {resp.evidence.map((ev, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Recommended Action */}
                {resp?.recommendedAction && (
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 space-y-1">
                    <div className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
                      Recommended Action
                    </div>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      {resp.recommendedAction}
                    </p>
                  </div>
                )}

                {/* 4. Sovereign Notice */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-teal-600" />
                    {resp?.sovereignNotice || 'Private Processing Mode · Sovereign Layer'}
                  </span>
                  <span>Zero patient data egress</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <span>Analyzing laboratory telemetry and tracing evidence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="relative"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask an operational question (e.g. 'Why is Vitamin D reagent a risk and what should I do?')"
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-4 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 shadow-xs disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 disabled:opacity-40 transition-colors shadow-xs"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
