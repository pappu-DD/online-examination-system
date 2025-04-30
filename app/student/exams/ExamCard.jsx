"use client";
import { Clock, BookOpen, BarChart2, Calendar, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ExamCard({ exam }) {
  const router = useRouter();
  
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800"
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
          <Badge className={difficultyColors[exam.difficulty]}>
            {exam.difficulty}
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-4">{exam.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{exam.subject}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{exam.duration} mins</span>
          </div>
          <div className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{exam.totalQuestions} questions</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">Until {exam.availableUntil}</span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => router.push(`/student/exams/${exam.id}`)}
        >
          Start Exam
        </Button>
      </div>
      <Calculator/>
    </div>
  );
}