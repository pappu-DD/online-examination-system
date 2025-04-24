"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function TakeExam() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch exam data (mock data for example)
  useEffect(() => {
    // Replace with actual API call
    const fetchExam = async () => {
      const mockExam = {
        id: id,
        title: "Mathematics Final Exam",
        duration: 60,
        totalQuestions: 5
      };
      
      const mockQuestions = [
        {
          id: 1,
          text: "What is the value of π (pi) to two decimal places?",
          options: ["3.14", "3.16", "3.12", "3.18"],
          correctAnswer: 0
        },
        {
          id: 2,
          text: "Solve for x: 2x + 5 = 15",
          options: ["5", "10", "7.5", "3"],
          correctAnswer: 0
        },
        // Add more questions...
      ];
      
      setExam(mockExam);
      setQuestions(mockQuestions);
      setTimeLeft(mockExam.duration * 60); // Convert to seconds
    };
    
    fetchExam();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // In a real app, submit answers to backend
    console.log("Submitted answers:", answers);
  };

  if (!exam || questions.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading exam...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Exam Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 bg-red-50 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 text-red-500 mr-2" />
            <span className="font-medium text-red-700">
              Time Left: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progress} className="h-2 mb-6" />
        
        {/* Question Card */}
        <div className="border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              
              return (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isSubmitted
                      ? isCorrect
                        ? "bg-green-50 border-green-200"
                        : isSelected && !isCorrect
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                      : isSelected
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => !isSubmitted && handleAnswerSelect(currentQuestion.id, index)}
                  disabled={isSubmitted}
                >
                  <div className="flex items-center">
                    {isSubmitted && (
                      <span className="mr-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : isSelected ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </span>
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>Next</Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={isSubmitted ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isSubmitted ? "Submitted" : "Submit Exam"}
            </Button>
          )}
        </div>
        
        {/* Results (shown after submission) */}
        {isSubmitted && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Exam Submitted!</h3>
            <p className="mb-2">
              You answered {Object.keys(answers).length} out of {questions.length} questions.
            </p>
            <Button 
              className="mt-4"
              onClick={() => router.push("/student/results")}
            >
              View Detailed Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}