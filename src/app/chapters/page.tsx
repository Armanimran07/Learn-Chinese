"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Lock, PlayCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  description: string;
  status: string;
  vocabCount: number;
  grammarCount: number;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChapters() {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('chapter_number', { ascending: true });
        
      if (error) {
        console.error("Error fetching chapters:", error);
      } else if (data) {
        const mappedChapters = data.map(ch => ({
          ...ch,
          // Hardcode for now until user progress logic is built
          status: 'completed', 
          vocabCount: 20, // Approx count based on our upload
          grammarCount: 0,
        }));
        setChapters(mappedChapters);
      }
      setIsLoading(false);
    }
    fetchChapters();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modern Chinese Textbook 1</h1>
          <p className="text-muted-foreground mt-1">Select a chapter to continue learning</p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="space-y-6 relative"
      >
        {/* Vertical line connecting chapters */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border -z-10 hidden md:block" />

        {chapters.map((chapter) => {
          const isCompleted = chapter.status === "completed";
          const isInProgress = chapter.status === "in-progress";
          const isLocked = chapter.status === "locked";

          return (
            <motion.div variants={itemVariants} key={chapter.id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="hidden md:flex flex-col items-center pt-6">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full border-4 flex items-center justify-center bg-background shadow-lg transition-colors",
                    isCompleted ? "border-green-500 text-green-500" :
                    isInProgress ? "border-primary text-primary shadow-primary/20" :
                    "border-muted text-muted-foreground"
                  )}
                >
                  <span className="font-bold text-xl">{chapter.chapter_number}</span>
                </div>
              </div>

              <Card
                className={cn(
                  "flex-1 transition-all duration-300",
                  isInProgress ? "ring-2 ring-primary shadow-lg shadow-primary/5" :
                  isLocked ? "opacity-75 grayscale-[0.2]" : ""
                )}
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden font-bold text-primary">Ch. {chapter.chapter_number}</span>
                      <h2 className="text-xl font-bold">{chapter.title}</h2>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
                      {isLocked && <Lock className="w-4 h-4 text-muted-foreground ml-2" />}
                    </div>
                    <p className="text-muted-foreground">{chapter.description}</p>
                    
                    <div className="flex gap-4 pt-2">
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                        {chapter.vocabCount} Words
                      </span>
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                        {chapter.grammarCount} Grammar Points
                      </span>
                    </div>
                  </div>

                  {!isLocked ? (
                    <Link href={`/learn/${chapter.id}`} className="w-full sm:w-auto mt-4 sm:mt-0">
                      <Button variant={isInProgress ? "primary" : "outline"} className="w-full sm:w-auto">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {isCompleted ? "Review" : "Start Learning"}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="ghost" disabled className="w-full sm:w-auto mt-4 sm:mt-0">
                      Locked
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
