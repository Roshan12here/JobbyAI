"use client";

import { useState } from "react";
import { getCareerGuidance } from "@/app/lib/jonsearches";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, BookOpen, DollarSign, LineChart, HelpCircle, Sparkles } from 'lucide-react';

export default function CareerGuidanceSection() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobs, setJobs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryType, setQueryType] = useState("roadmap");
  const [specificQuery, setSpecificQuery] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getCareerGuidance(
        jobTitle, 
        queryType, 
        queryType === "all" ? specificQuery : ""
      );
      setJobs(result);
    } catch (err) {
      setError("Failed to fetch career information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const queryTypes = [
    { id: "roadmap", Icon: BookOpen, label: "Career Roadmap" },
    { id: "salary", Icon: DollarSign, label: "Salary Insights" },
    { id: "learning_curve", Icon: LineChart, label: "Learning Path" },
    { id: "all", Icon: HelpCircle, label: "Ask Anything" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[80%] max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            AI Career Explorer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Discover your perfect career path with AI-powered insights
          </motion.p>
        </div>

        {/* Main Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800" />
          <div className="relative p-8 space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  className="h-16 px-6 text-lg rounded-xl bg-black/50 border-2 border-gray-800 focus:border-[#00FF00]/30 transition-all duration-300 pl-14 text-white placeholder:text-gray-500"
                  placeholder="Enter your dream job title..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading || !jobTitle.trim() || (queryType === "all" && !specificQuery.trim())}
                className="h-16 px-8 text-lg rounded-xl bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 transition-all duration-300 shadow-lg shadow-[#00FF00]/10"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore
                  </>
                )}
              </Button>
            </div>

            {/* Query Type Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {queryTypes.map(({ id, Icon, label }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQueryType(id)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                    queryType === id 
                      ? 'bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 shadow-lg shadow-[#00FF00]/10'
                      : 'bg-black/50 hover:bg-black/70 text-gray-300 border border-gray-800'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Specific Query Input */}
            <AnimatePresence>
              {queryType === "all" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    placeholder="Ask any specific question about this career path..."
                    value={specificQuery}
                    onChange={(e) => setSpecificQuery(e.target.value)}
                    className="min-h-[120px] rounded-xl bg-black/50 border-2 border-gray-800 focus:border-[#00FF00]/30 transition-all duration-300 text-white placeholder:text-gray-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-900/20 border border-red-800/50 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {jobs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800" />
              <div className="relative p-8 rounded-2xl">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mb-6"
                >
                  {(() => {
                    const TypeIcon = queryTypes.find(t => t.id === queryType)?.Icon;
                    return TypeIcon && <TypeIcon className="h-6 w-6 text-[#00FF00]" />;
                  })()}
                  <h2 className="text-xl font-semibold text-white">
                    {queryTypes.find(t => t.id === queryType)?.label}
                  </h2>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap rounded-xl bg-black/50 p-6 border border-gray-800">
                    {jobs}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
