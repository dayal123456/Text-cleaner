import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, FileText, Check, Scissors, Type } from 'lucide-react';
import { processScript, getStats } from './utils';

export default function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Auto-process whenever input changes
  useEffect(() => {
    setOutputText(processScript(inputText));
  }, [inputText]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center space-y-4 pt-4 md:pt-8"
      >
        <div className="bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 border border-brand-200">
          <Scissors className="w-4 h-4" />
          Pro Filter Tool
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Clean Script <span className="text-brand-500">Extractor</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Paste your mixed script below. B-roll instructions will be erased, and pure narration text will remain.
        </p>
      </motion.header>

      {/* Main Content Workspace */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full flex-grow mt-4"
      >
        {/* Input Panel */}
        <div className="flex flex-col h-[500px] lg:h-[600px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 focus-within:shadow-md focus-within:border-brand-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
              <FileText className="w-5 h-5 text-slate-400" />
              Raw Script
            </h2>
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5" />{inputStats.words} words</span>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"Paste your raw text here...\n\nExample:\nNarration: Today we will learn about UI design.\nB-roll: Show a fast montage of typing on a keyboard.\nNarration: Make sure it's clean."}
            className="flex-grow w-full p-6 bg-transparent resize-none outline-none text-slate-700 leading-relaxed placeholder-slate-300 transition-colors"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col h-[500px] lg:h-[600px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
              <Scissors className="w-5 h-5 text-brand-500" />
              Filtered Narration
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5" />{outputStats.words} words</span>
              {/* Diff badge */}
              {inputStats.words > 0 && outputStats.words < inputStats.words && (
                <span className="bg-green-50 text-green-600 px-2 pl-1 py-0.5 rounded-full flex items-center gap-1">
                  ↓ {inputStats.words - outputStats.words} words removed
                </span>
              )}
            </div>
          </div>
          <div className="relative flex-grow h-full">
            <textarea
              readOnly
              value={outputText}
              placeholder="Your cleaned text will appear here automatically..."
              className="w-full h-full p-6 bg-transparent resize-none outline-none text-slate-800 leading-relaxed placeholder-slate-300"
            />
            
            {/* Elegant Copy Button Overlay */}
            {outputText && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="absolute bottom-6 right-6 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full shadow-lg transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
                <span className="font-medium text-sm">{isCopied ? "Copied!" : "Copy Text"}</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}

