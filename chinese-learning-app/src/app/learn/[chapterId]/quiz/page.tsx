"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock quiz data
const questions = [
  { id: 1, type: "multiple_choice", prompt: "What does '你好' mean?", options: ["Goodbye", "Hello", "Thank you", "Sorry"], answer: "Hello" },
  { id: 2, type: "multiple_choice", prompt: "Which pinyin is correct for '谢谢'?", options: ["xīxiè", "xièxie", "xiexíe", "xiéxié"], answer: "xièxie" },
  { id: 3, type: "multiple_choice", prompt: "Translate: 'How are you?'", options: ["你好吗？", "谢谢。", "你贵姓？", "再见。"], answer: "你好吗？" },
];

export default function QuizPage() {
  const params = useParams();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === questions[currentQ].answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">Quiz Completed!</h1>
        <Card className="p-10 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-primary">{Math.round((score / questions.length) * 100)}%</span>
          </div>
          <p className="text-lg mb-6">You got {score} out of {questions.length} correct.</p>
          <Link href={`/learn/${params.chapterId}`}>
            <Button>Back to Chapter</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto h-full flex flex-col min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <span className="font-semibold text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
        <div className="flex-1 max-w-xs mx-4 bg-secondary h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">{q.prompt}</h2>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt) => {
              const isSelected = selected === opt;
              const isRightAnswer = isSelected && isCorrect;
              const isWrongAnswer = isSelected && !isCorrect;

              return (
                <Card
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`p-5 cursor-pointer text-center text-lg font-medium transition-all ${
                    selected ? "pointer-events-none" : "hover:border-primary/50"
                  } ${
                    isRightAnswer ? "border-green-500 bg-green-500/10 text-green-500" :
                    isWrongAnswer ? "border-destructive bg-destructive/10 text-destructive" : ""
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isRightAnswer && <CheckCircle2 className="w-5 h-5" />}
                    {isWrongAnswer && <XCircle className="w-5 h-5" />}
                    {opt}
                  </div>
                </Card>
              );
            })}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto pt-8 flex flex-col items-center gap-4"
            >
              <div className={`p-4 rounded-xl w-full font-medium flex items-center justify-between ${
                isCorrect ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"
              }`}>
                <span>{isCorrect ? "Excellent!" : `Correct answer: ${q.answer}`}</span>
                <Button variant={isCorrect ? "primary" : "outline"} onClick={nextQuestion}>
                  {currentQ < questions.length - 1 ? "Next Question" : "Finish"}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
