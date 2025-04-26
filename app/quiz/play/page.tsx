"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { generateQuestions } from "@/lib/quiz-generator"
import type { Question } from "../../../lib/types"

export default function PlayQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") || "general"
  const difficulty = searchParams.get("difficulty") || "medium"
  const count = Number.parseInt(searchParams.get("count") || "10", 10)
  const timeLimit = Number.parseInt(searchParams.get("time") || "60", 10)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true)
      try {
        const generatedQuestions = await generateQuestions(category, difficulty, count)
        setQuestions(generatedQuestions)
      } catch (error) {
        console.error("Failed to generate questions:", error)
        router.push("/quiz/new?error=failed_to_generate")
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [category, difficulty, count, router])

  // Timer effect
  useEffect(() => {
    if (loading || quizCompleted || !timeLimit) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!isAnswerSubmitted) {
            handleAnswerSubmit(null)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, quizCompleted, timeLimit, isAnswerSubmitted])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answer)
  }

  const handleAnswerSubmit = (answer: string | null) => {
    if (isAnswerSubmitted || !currentQuestion) return
    setIsSubmitting(true)

    const finalAnswer = answer || selectedAnswer
    const isCorrect = finalAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setIsAnswerSubmitted(true)

    // Move to next question after a delay
    setTimeout(() => {
      setIsSubmitting(false)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswerSubmitted(false)
        setTimeRemaining(timeLimit)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ExamDesk
                </h1>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6 py-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="animate-pulse flex flex-col items-center">
              <div className="relative">
                <Brain className="h-16 w-16 text-indigo-500 dark:text-indigo-400" />
                <div className="absolute -inset-4 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Preparing Your Quiz</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Our AI is crafting {count} {difficulty} questions about {category}
              </p>
              <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    const performanceLevel = percentage >= 90 ? "excellent" : 
                          percentage >= 70 ? "great" : 
                          percentage >= 50 ? "good" : "keep_learning"

    const performanceData = {
      excellent: {
        color: "from-emerald-500 to-teal-600",
        icon: <CheckCircle className="h-16 w-16 text-emerald-500" />,
        message: "Outstanding! You're a true expert!",
        badge: "Master"
      },
      great: {
        color: "from-blue-500 to-indigo-600",
        icon: <CheckCircle className="h-16 w-16 text-blue-500" />,
        message: "Great job! You know your stuff!",
        badge: "Pro"
      },
      good: {
        color: "from-amber-500 to-orange-600",
        icon: <Brain className="h-16 w-16 text-amber-500" />,
        message: "Good effort! Keep learning!",
        badge: "Learner"
      },
      keep_learning: {
        color: "from-rose-500 to-pink-600",
        icon: <Brain className="h-16 w-16 text-rose-500" />,
        message: "Keep practicing! You'll improve with time!",
        badge: "Beginner"
      }
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ExamDesk
                </h1>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Score Header */}
                <div className={`bg-gradient-to-r ${performanceData[performanceLevel].color} p-6 text-center`}>
                  <div className="inline-flex items-center justify-center bg-white/20 p-4 rounded-full">
                    {performanceData[performanceLevel].icon}
                  </div>
                  <h1 className="text-3xl font-bold text-white mt-4">Quiz Completed!</h1>
                  <Badge variant="secondary" className="mt-2 text-sm font-medium">
                    {performanceData[performanceLevel].badge}
                  </Badge>
                </div>

                {/* Score Content */}
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">Your Score</h3>
                    <p className="text-5xl font-bold my-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {score}<span className="text-gray-400">/</span>{questions.length}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${performanceData[performanceLevel].color} bg-gradient-to-r`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      {percentage}% correct • {performanceData[performanceLevel].message}
                    </p>
                  </div>

                  {/* Quiz Details */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      Quiz Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <Badge variant="outline" className="capitalize">
                          {category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                        <Badge variant="outline" className="capitalize">
                          {difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                        <span className="font-medium">{questions.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Time Limit:</span>
                        <span className="font-medium">{timeLimit ? `${timeLimit} seconds` : "No limit"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 py-6 text-lg" 
                      onClick={() => router.push("/quiz/new")}
                    >
                      Take New Quiz
                    </Button>
                    <Button 
                      className="flex-1 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => router.push("/")}
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ExamDesk
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5 capitalize">
                <Brain className="h-4 w-4" />
                {category}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Quiz Progress */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Question</h2>
                  <p className="text-2xl font-bold">
                    {currentQuestionIndex + 1} <span className="text-gray-400">/</span> {questions.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Score:</span>
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm font-semibold">
                      {score}
                    </Badge>
                  </div>
                  {timeLimit > 0 && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className={`font-mono text-sm font-medium ${timeRemaining < 10 ? "text-red-500 animate-pulse" : "text-gray-700 dark:text-gray-300"}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={(currentQuestionIndex / questions.length) * 100} 
                className="h-2 bg-gray-200 dark:bg-gray-800"
              />
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid gap-2 p-4">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option
                      const isCorrect = isAnswerSubmitted && option === currentQuestion.correctAnswer
                      const isWrong = isAnswerSubmitted && isSelected && option !== currentQuestion.correctAnswer

                      let buttonClass = "hover:bg-gray-50 dark:hover:bg-gray-800"
                      if (isSelected && !isAnswerSubmitted) {
                        buttonClass = "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700"
                      }
                      if (isCorrect) {
                        buttonClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
                      }
                      if (isWrong) {
                        buttonClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700"
                      }

                      return (
                        <button
                          key={option}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${buttonClass} ${
                            isAnswerSubmitted ? "cursor-default" : "cursor-pointer hover:shadow-sm"
                          }`}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={isAnswerSubmitted}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center ${
                              isCorrect 
                                ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                                : isWrong
                                  ? "bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                                  : isSelected
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            }`}>
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : isWrong ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs font-medium">
                                  {String.fromCharCode(65 + currentQuestion.options.indexOf(option))}
                                </span>
                              )}
                            </div>
                            <span className={`flex-1 ${
                              isCorrect 
                                ? "text-emerald-800 dark:text-emerald-200"
                                : isWrong
                                  ? "text-rose-800 dark:text-rose-200"
                                  : "text-gray-800 dark:text-gray-200"
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                  <Button
                    className="w-full py-6 text-lg gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={() => handleAnswerSubmit(selectedAnswer)}
                    disabled={!selectedAnswer || isAnswerSubmitted || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isAnswerSubmitted ? (
                      <>
                        Next Question
                        <ArrowRight className="h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}