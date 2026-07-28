"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Star, ChevronLeft, ChevronRight, PenTool, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  part_of_speech: string;
  example_sentence: string;
}

export default function LearnPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  
  const [activeTab, setActiveTab] = useState<"vocab" | "flashcards" | "stroke">("vocab");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch chapter details
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('title, chapter_number')
        .eq('id', chapterId)
        .single();
        
      if (chapterData) {
        setChapterTitle(`Chapter ${chapterData.chapter_number}: ${chapterData.title}`);
      }
      
      // Fetch vocabulary
      const { data: vocabData, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('order_index', { ascending: true });
        
      if (!error && vocabData) {
        setVocabulary(vocabData);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [chapterId, supabase]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % vocabulary.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto flex flex-col h-full min-h-[85vh]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{chapterTitle || "Chapter Vocabulary"}</h1>
        <p className="text-muted-foreground">Master the vocabulary for this chapter.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-secondary p-1 rounded-xl w-full max-w-md mx-auto mb-8">
        {[
          { id: "vocab", label: "Vocabulary" },
          { id: "flashcards", label: "Flashcards" },
          { id: "stroke", label: "Stroke Order" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative ${
              activeTab === tab.id ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="learn-tab"
                className="absolute inset-0 bg-background rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "vocab" && (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {vocabulary.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>No vocabulary found for this chapter.</p>
              </div>
            ) : (
              vocabulary.map((word) => (
              <Card key={word.id} className="flex flex-col p-5 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-4xl font-bold block mb-2">{word.hanzi}</span>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {word.pinyin}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-yellow-500">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{word.part_of_speech}</span>
                    <span className="text-sm font-medium">{word.meaning}</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{word.example_sentence}</p>
                </div>
              </Card>
              ))
            )}
          </motion.div>
        )}

        {activeTab === "flashcards" && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto"
          >
            {vocabulary.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground w-full">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>No flashcards available.</p>
              </div>
            ) : (
              <>
                <div className="w-full h-72 md:h-80 perspective-1000 relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                  <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {/* Front */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-card rounded-3xl shadow-sm border border-border group-hover:shadow-md transition-shadow"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="absolute inset-4 border border-dashed border-border/50 rounded-2xl pointer-events-none" />
                      <span className="text-7xl md:text-8xl font-black text-foreground tracking-widest drop-shadow-sm mb-2">{vocabulary[flashcardIndex]?.hanzi}</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-auto absolute bottom-8">
                        Tap to flip
                      </span>
                    </div>

                    {/* Back */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl shadow-sm"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
                        <span className="text-4xl font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">{vocabulary[flashcardIndex]?.pinyin}</span>
                        <span className="text-2xl font-medium mt-4">{vocabulary[flashcardIndex]?.meaning}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-widest absolute bottom-8">
                        Tap to flip back
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between w-full mt-8">
                  <Button variant="outline" size="icon" onClick={handlePrevCard}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    {flashcardIndex + 1} / {vocabulary.length}
                  </span>
                  <Button variant="outline" size="icon" onClick={handleNextCard}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "stroke" && (
          <motion.div
            key="stroke"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 text-center"
          >
            <Card className="p-10 flex flex-col items-center justify-center max-w-sm w-full mb-6">
              <div className="w-48 h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-secondary/50 mb-6 relative">
                {/* Cross-hairs for practice area */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-full h-px bg-foreground" />
                  <div className="absolute h-full w-px bg-foreground" />
                  <div className="absolute w-full h-full border-t border-l transform rotate-45 scale-150 border-foreground" />
                </div>
                <PenTool className="h-12 w-12 text-muted-foreground opacity-20" />
                <span className="absolute bottom-4 text-xs text-muted-foreground uppercase font-semibold">
                  Hanzi Writer Canvas Here
                </span>
              </div>
              <div className="flex gap-4 w-full">
                <Button variant="outline" className="flex-1">Animate</Button>
                <Button variant="primary" className="flex-1">Practice</Button>
              </div>
            </Card>
            <p className="text-muted-foreground text-sm max-w-md">
              (Note: To complete stroke order, we will integrate `hanzi-writer` which requires an additional DOM node setup inside a useEffect).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
