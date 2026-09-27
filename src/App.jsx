import React, { useState, useEffect } from "react";
import { 
  Smile, Frown, Meh, Send, Trash2, Download, 
  History, Sparkles, RefreshCw, Moon, Sun, ShieldAlert, Heart, Cpu, Calendar, Clock, BarChart, Zap, CheckCircle2, Menu, X
} from "lucide-react";
import { analyzeSentiment, getHistory, deleteHistoryItem, getDatasetExportUrl, getHistoryExportUrl } from "./services/api";

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("analyze");
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      const historyData = Array.isArray(res) ? res : (res.data || res.history || []);
      setHistory(historyData);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await analyzeSentiment(text);
      const record = response.data || response;

      const analysisData = {
        sentiment: record.sentiment || "Neutral",
        score: record.score !== undefined ? record.score : 0,
        confidence: record.confidence || 0.85,
        text: record.text || text,
        createdAt: record.createdAt || new Date().toISOString()
      };

      setResult(analysisData);
      setText("");
      fetchHistory(); 
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Error analyzing text. Please check backend server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      fetchHistory();
      showToast("Record deleted successfully!");
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const getSentimentDetails = (sentiment) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes('pos')) {
      return {
        label: 'Positive',
        icon: <Smile className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 animate-bounce drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />,
        cardBg: darkMode ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-950 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-300 shadow-xl',
        textColor: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      };
    } else if (s.includes('neg')) {
      return {
        label: 'Negative',
        icon: <Frown className="w-8 h-8 md:w-10 md:h-10 text-rose-400 animate-pulse drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]" />,
        cardBg: darkMode ? 'bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-slate-950 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-300 shadow-xl',
        textColor: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      };
    } else {
      return {
        label: 'Neutral',
        icon: <Meh className="w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-spin drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" style={{ animationDuration: '12s' }} />,
        cardBg: darkMode ? 'bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-slate-950 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 shadow-xl',
        textColor: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      };
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'} font-['Inter',sans-serif] selection:bg-indigo-500 selection:text-white relative overflow-x-hidden`}>
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-20 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-emerald-400 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl animate-bounce transition-all duration-300 max-w-xs md:max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-black tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* 1. RESPONSIVE NAVBAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${darkMode ? 'bg-[#0b0f19]/80 border-slate-800/80' : 'bg-white/80 border-slate-200'} px-4 md:px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab("analyze")}>
            <div className="p-2 md:p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <span className="text-lg md:text-xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SENTIFI AI
              </span>
              <span className="block text-[8px] md:text-[9px] tracking-widest font-bold uppercase text-indigo-400/80">
                Neural Sentiment Hub
              </span>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-500/10 border border-slate-500/10 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab("analyze")} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 ${activeTab === 'analyze' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' : 'hover:text-indigo-400 opacity-70 hover:opacity-100'}`}
            >
              Workspace & Analyzer
            </button>
            <button 
              onClick={() => setActiveTab("history")} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-300 ${activeTab === 'history' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' : 'hover:text-indigo-400 opacity-70 hover:opacity-100'}`}
            >
              History & Logs ({history.length})
            </button>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 md:p-3 rounded-2xl border transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-slate-900/90 border-slate-700 text-amber-400 hover:bg-slate-800 shadow-lg shadow-black/40' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-md'}`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Transition */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-48 opacity-100 mt-4 pt-2 border-t border-slate-700/50' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-2 pb-2">
            <button 
              onClick={() => { setActiveTab("analyze"); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-black text-left transition-all duration-300 ${activeTab === 'analyze' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'opacity-80 hover:bg-slate-500/10'}`}
            >
              Workspace & Analyzer
            </button>
            <button 
              onClick={() => { setActiveTab("history"); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-black text-left transition-all duration-300 ${activeTab === 'history' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'opacity-80 hover:bg-slate-500/10'}`}
            >
              History & Logs ({history.length})
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 md:py-12 z-10">
        
        {/* HERO HEADER */}
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-inner animate-bounce">
            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-400" /> Powered by AFINN NLP Engine
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight ${darkMode ? 'bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent' : 'text-slate-900'}`}>
            Smart Sentiment Intelligence
          </h1>
          <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed px-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Analyze customer feedback, social reviews, or notes instantly with deep polarity scoring and classification.
          </p>
        </div>

        {activeTab === "analyze" ? (
          <div className="space-y-6 md:space-y-8 animate-fadeIn">
            
            {/* INPUT CARD */}
            <div className={`p-5 sm:p-6 md:p-8 rounded-3xl border shadow-2xl transition-all duration-500 backdrop-blur-xl ${darkMode ? 'bg-slate-900/70 border-slate-800/80 shadow-indigo-950/20' : 'bg-white/80 border-slate-200 shadow-xl'}`}>
              <form onSubmit={handleAnalyze} className="space-y-4 md:space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] md:text-xs font-black uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" /> Enter Text / Review
                    </label>
                    <span className="text-[11px] md:text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {text.length} chars
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your text here... (e.g., 'This platform is extraordinarily fast and intuitive!')"
                    className={`w-full p-4 md:p-5 rounded-2xl border outline-none transition-all duration-300 resize-none text-xs sm:text-sm md:text-base font-semibold ${
                      darkMode 
                        ? 'bg-slate-950/80 border-slate-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-1 gap-1 text-[11px] md:text-xs">
                    <span className="font-bold opacity-60 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Secure SSL Connection
                    </span>
                    <span className="font-bold text-purple-400 animate-pulse">Ready for NLP Processing</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="w-full sm:w-auto px-6 md:px-9 py-3.5 md:py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs md:text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        Analyzing Sentiment...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        Run Sentiment Analysis
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* RESULT CARD */}
            {result ? (
              <div className={`p-5 sm:p-6 md:p-8 rounded-3xl border shadow-2xl transition-all duration-500 transform hover:scale-[1.01] ${getSentimentDetails(result.sentiment).cardBg}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`p-3.5 md:p-4 rounded-2xl border backdrop-blur-md shadow-lg ${darkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'}`}>
                      {getSentimentDetails(result.sentiment).icon}
                    </div>
                    <div>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70">Analysis Result</span>
                      <h2 className={`text-2xl md:text-3xl font-black capitalize tracking-wider mt-0.5 ${getSentimentDetails(result.sentiment).textColor}`}>
                        {getSentimentDetails(result.sentiment).label}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end">
                    <div className={`px-5 py-3 md:px-6 md:py-3.5 rounded-2xl border text-center flex-1 sm:flex-none backdrop-blur-md ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                      <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-wider opacity-60">Polarity Score</span>
                      <span className="text-xl md:text-2xl font-black text-indigo-400">{typeof result.score === 'number' ? result.score.toFixed(2) : result.score}</span>
                    </div>
                  </div>

                </div>

                <div className={`mt-5 md:mt-6 pt-4 md:pt-5 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'} space-y-3`}>
                  <div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60 block mb-1.5">Evaluated Text:</span>
                    <p className="text-xs sm:text-sm md:text-base font-semibold italic opacity-95 bg-black/10 dark:bg-white/5 p-3.5 md:p-4 rounded-2xl border border-inherit backdrop-blur-sm break-words">
                      "{result.text}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] md:text-xs font-bold opacity-75">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
                      Analyzed At: {new Date(result.createdAt || Date.now()).toLocaleTimeString()} ({new Date(result.createdAt || Date.now()).toLocaleDateString()})
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-8 md:p-10 rounded-3xl border border-dashed text-center transition-all duration-300 ${darkMode ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-indigo-500/50' : 'border-slate-300 bg-white/50 text-slate-500 hover:border-indigo-500/50'}`}>
                <BarChart className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 opacity-40 text-indigo-500 animate-pulse" />
                <p className="text-xs md:text-sm font-bold">No analysis result generated yet.</p>
                <p className="text-[11px] md:text-xs opacity-70 mt-1">Type text above and click "Run Sentiment Analysis" to view metrics.</p>
              </div>
            )}

          </div>
        ) : (
          /* HISTORY & DATASETS TAB */
          <div className="space-y-6 animate-fadeIn">
            
            {/* EXPORT CARD */}
            <div className={`p-5 sm:p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-5 backdrop-blur-xl ${darkMode ? 'bg-slate-900/70 border-slate-800 shadow-2xl shadow-indigo-950/20' : 'bg-white border-slate-200 shadow-xl'}`}>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-black flex items-center gap-2">
                  <Download className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 animate-bounce" /> Export Datasets & Logs
                </h3>
                <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Download professional CSV format datasets or complete historical logs instantly.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href={getDatasetExportUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-4 h-4" /> Dataset CSV
                </a>
                <a
                  href={getHistoryExportUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4.5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-4 h-4" /> History CSV
                </a>
              </div>
            </div>

            {/* HISTORY RECORDS LIST */}
            <div className={`rounded-3xl border overflow-hidden shadow-2xl backdrop-blur-xl ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-4 md:p-5 border-b border-inherit font-black text-xs md:text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" /> Previous Analysis Records ({history.length})
                </div>
                <button onClick={fetchHistory} className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {history.length === 0 ? (
                <div className="p-12 md:p-16 text-center text-xs md:text-sm font-bold opacity-50 space-y-2">
                  <p>No previous records found in history.</p>
                  <p className="text-[11px] md:text-xs">Try analyzing text in the workspace tab first!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/30 max-h-[550px] overflow-y-auto">
                  {history.map((item, index) => {
                    const sentimentInfo = getSentimentDetails(item.sentiment);
                    return (
                      <div key={item._id || index} className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-indigo-500/5 transition-all duration-300">
                        <div className="space-y-1.5 overflow-hidden pr-2 w-full sm:w-auto flex-grow">
                          <p className="text-xs sm:text-sm font-black truncate max-w-full sm:max-w-md md:max-w-lg">
                            "{item.text}"
                          </p>
                          <div className="flex flex-wrap items-center gap-2.5 text-[11px] md:text-xs">
                            <span className={`px-2.5 py-0.5 rounded-full uppercase font-black border text-[9px] md:text-[10px] ${sentimentInfo.badge}`}>
                              {item.sentiment || 'Neutral'}
                            </span>
                            <span className="font-bold opacity-70">
                              Score: {item.score !== undefined ? Number(item.score).toFixed(2) : 'N/A'}
                            </span>
                            <span className="opacity-50 flex items-center gap-1 font-semibold text-[10px] md:text-xs">
                              <Calendar className="w-3 h-3" /> {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:scale-110 transition-all duration-300 self-end sm:self-center flex-shrink-0"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* 3. RESPONSIVE FOOTER */}
      <footer className={`mt-16 md:mt-20 border-t py-6 md:py-8 px-6 text-center text-xs font-bold backdrop-blur-md ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black tracking-wider text-indigo-400">SENTIFI AI</span>
            <span>— Advanced Neural Sentiment Platform</span>
          </div>
          <div className="flex items-center gap-1 opacity-80 text-[11px] md:text-xs">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 animate-pulse" /> for Natural Language Intelligence
          </div>
        </div>
      </footer>

    </div>
  );
}