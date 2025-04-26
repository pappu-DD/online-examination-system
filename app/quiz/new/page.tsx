"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowRight, Clock, BarChart3, HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categoryColors = {
  javascript: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300",
  python: "bg-green-100 hover:bg-green-200 text-green-800 border-green-300",
  java: "bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300",
  csharp: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300",
  cpp: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300",
  ruby: "bg-red-100 hover:bg-red-200 text-red-800 border-red-300",
  go: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-300",
  typescript: "bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300",
};

const difficultyColors = {
  easy: "bg-lime-100 hover:bg-lime-200 text-lime-800 border-lime-300",
  medium: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300",
  hard: "bg-red-100 hover:bg-red-200 text-red-800 border-red-300",
  adaptive: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-300",
};

const countColors = {
  5: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-300",
  10: "bg-violet-100 hover:bg-violet-200 text-violet-800 border-violet-300",
  15: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-300",
  20: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300",
};

const timeColors = {
  30: "bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300",
  60: "bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300",
  90: "bg-lime-100 hover:bg-lime-200 text-lime-800 border-lime-300",
  120: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300",
  0: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300",
};

export default function NewQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryColors | "">(preselectedCategory as keyof typeof categoryColors || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState(preselectedCategory ? "medium" : "adaptive");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(60);

  const categories = [
    { id: "javascript", name: "JavaScript", icon: "JS", description: "Web development language" },
    { id: "python", name: "Python", icon: "PY", description: "General-purpose programming" },
    { id: "java", name: "Java", icon: "JV", description: "Enterprise applications" },
    { id: "csharp", name: "C#", icon: "C#", description: ".NET framework language" },
    { id: "cpp", name: "C++", icon: "C++", description: "System/Game development" },
    { id: "ruby", name: "Ruby", icon: "RB", description: "Web development with Rails" },
    { id: "go", name: "Go", icon: "GO", description: "Cloud-native applications" },
    { id: "typescript", name: "TypeScript", icon: "TS", description: "Typed JavaScript superset" },
  ];

  const difficulties = [
    { id: "easy", name: "Easy", description: "Basic language concepts and syntax" },
    { id: "medium", name: "Medium", description: "Intermediate programming challenges" },
    { id: "hard", name: "Hard", description: "Advanced concepts and problem-solving" },
    { id: "adaptive", name: "Adaptive", description: "Adjusts difficulty based on your performance" },
  ];

  const questionCounts = [5, 10, 15, 20];
  const timeLimits = [30, 60, 90, 120, 0]; // 0 means no time limit

  const startQuiz = () => {
    if (!selectedCategory) {
      alert("Please select a programming language before starting the quiz");
      return;
    }

    router.push(
      `/quiz/play?category=${selectedCategory}&difficulty=${selectedDifficulty}&count=${selectedQuestionCount}&time=${selectedTimeLimit}`,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
              <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Custom Quiz
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select your preferences to start a personalized coding challenge
            </p>
          </div>

          {/* Quiz Options Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Category Selection */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-red-200 to to-blue-200">
              <div className="flex items-center justify-between mb-4 ">
                <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Programming Language
                </Label>
                {!selectedCategory && (
                  <span className="text-sm text-red-500">* Required</span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 hover:text-red-500">
                {categories.map((category) => (
                  <TooltipProvider key={category.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                            selectedCategory === category.id 
                              ? `${categoryColors[category.id as keyof typeof categoryColors]} border-2 scale-[0.98] shadow-inner` 
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                          onClick={() => setSelectedCategory(category.id as keyof typeof categoryColors)}
                        >
                          <span className="text-xl font-bold mb-1">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px] text-white text-center p-2 bg-amber-700">
                        {category.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 block">
                Difficulty Level
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedDifficulty === difficulty.id 
                        ? `${difficultyColors[difficulty.id as keyof typeof difficultyColors]} border-2 scale-[0.98] shadow-inner` 
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{difficulty.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            {difficulty.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {difficulty.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Count and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 p-6">
              {/* Question Count */}
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <CardTitle className="text-lg">Question Count</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {questionCounts.map((count) => (
                      <button
                        key={count}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedQuestionCount === count 
                            ? `${countColors[count as keyof typeof countColors]} border-transparent scale-[0.96]` 
                            : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                        onClick={() => setSelectedQuestionCount(count)}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Limit */}
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-lg">Time Limit</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {timeLimits.map((time) => (
                      <button
                        key={time}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedTimeLimit === time 
                            ? `${timeColors[time as keyof typeof timeColors]} border-transparent scale-[0.96]` 
                            : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                        onClick={() => setSelectedTimeLimit(time)}
                      >
                        {time === 0 ? "No Limit" : `${time} seconds`}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Start Button */}
            <div className="px-6 pb-6 pt-2">
              <Button 
                size="lg" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all hover:scale-[1.01]"
                onClick={startQuiz} 
                disabled={!selectedCategory}
              >
                Start Quiz Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              {!selectedCategory && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Please select a programming language to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">ExamDesk</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Enhance your coding skills with personalized quizzes tailored to your preferences.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-4">
              &copy; {new Date().getFullYear()} ExamDesk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}