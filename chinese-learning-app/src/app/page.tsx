"use client";

import { motion } from "framer-motion";
import { Flame, Play, Trophy, Sparkles, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ni hao, Student! 👋</h1>
            <p className="text-muted-foreground mt-1 text-lg">Ready to master Chinese today?</p>
          </div>
          <Card className="hidden sm:flex items-center gap-3 py-2 px-4 bg-orange-500/10 border-orange-500/20 text-orange-500">
            <Flame className="w-5 h-5 fill-current" />
            <span className="font-bold text-lg">12 Day Streak</span>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="h-full relative overflow-hidden bg-gradient-to-br from-primary to-purple-600 text-white border-none p-8">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                <ProgressRing progress={65} size={100} strokeWidth={8} color="#ffffff" className="shrink-0" />
                <div className="flex-1 text-center sm:text-left">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                    Chapter 4
                  </span>
                  <h2 className="text-2xl font-bold mt-3 mb-1">Shopping & Prices</h2>
                  <p className="text-white/80 text-sm mb-6">You are 65% through this chapter.</p>
                  <Link href="/learn/chapter-4">
                    <Button variant="glass" className="w-full sm:w-auto">
                      <Play className="w-4 h-4 mr-2 fill-current" />
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Daily Goal */}
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col justify-center items-center text-center p-8 glass">
              <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold">Daily Goal</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">Earn 50 XP to keep your streak</p>
              <div className="w-full bg-secondary rounded-full h-3 mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-yellow-500 h-full rounded-full"
                />
              </div>
              <span className="text-xs font-semibold text-yellow-500">35 / 50 XP</span>
            </Card>
          </motion.div>
        </div>

        {/* Quick Review */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Review
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { hanzi: "你好", pinyin: "nǐ hǎo", en: "Hello" },
              { hanzi: "谢谢", pinyin: "xièxie", en: "Thank you" },
              { hanzi: "再见", pinyin: "zàijiàn", en: "Goodbye" },
              { hanzi: "书", pinyin: "shū", en: "Book" },
            ].map((word, i) => (
              <Card key={i} className="flex flex-col items-center justify-center py-6 hover:border-primary/50 transition-colors cursor-pointer group">
                <span className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">{word.hanzi}</span>
                <span className="text-sm text-muted-foreground">{word.pinyin}</span>
                <span className="text-xs font-medium text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  {word.en}
                </span>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* Course Progress */}
        <motion.div variants={itemVariants}>
           <Card className="p-6">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                 <BookOpen className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                 <h3 className="font-bold">Modern Chinese Textbook 1</h3>
                 <p className="text-sm text-muted-foreground">3 / 15 Chapters Completed</p>
               </div>
             </div>
             <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "20%" }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="bg-blue-500 h-full rounded-full"
                />
              </div>
           </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
