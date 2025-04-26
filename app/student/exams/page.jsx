"use client";
import React, { useState, useEffect } from "react";
import { Search, Clock, BookOpen, ChevronDown, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';

// Define the Exam interface in a separate file or at the top of this file
import PropTypes from "prop-types";

const ExamPropTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
  totalQuestions: PropTypes.number.isRequired,
  availableUntil: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// Mock Exam Data (for demonstration)
const mockExams = [
  {
    id: 1,
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    duration: 60,
    difficulty: "Medium",
    totalQuestions: 30,
    availableUntil: "2024-12-31",
    description: "Covers all topics from Algebra to Calculus",
  },
  {
    id: 2,
    title: "Science Midterm",
    subject: "Science",
    duration: 45,
    difficulty: "Easy",
    totalQuestions: 20,
    availableUntil: "2024-11-15",
    description: "Basic concepts of Physics and Chemistry",
  },
  {
    id: 3,
    title: "History of the World",
    subject: "History",
    duration: 90,
    difficulty: "Hard",
    totalQuestions: 40,
    availableUntil: "2024-12-20",
    description: "Covers major events from ancient to modern times.",
  },
  {
    id: 4,
    title: "English Literature",
    subject: "Literature",
    duration: 75,
    difficulty: "Medium",
    totalQuestions: 25,
    availableUntil: "2025-01-10",
    description: "Analysis of classic and contemporary English literature.",
  },
  {
    id: 5,
    title: "Computer Science Basics",
    subject: "Computer Science",
    duration: 60,
    difficulty: "Easy",
    totalQuestions: 30,
    availableUntil: "2024-11-30",
    description: "Introduction to programming and computer architecture.",
  },
  {
    id: 6,
    title: "Advanced Calculus",
    subject: "Mathematics",
    duration: 120,
    difficulty: "Hard",
    totalQuestions: 50,
    availableUntil: "2025-02-15",
    description: "Detailed study of multivariable calculus and differential equations.",
  },
  {
    id: 7,
    title: "Biology Fundamentals",
    subject: "Science",
    duration: 60,
    difficulty: "Easy",
    totalQuestions: 25,
    availableUntil: "2024-12-01",
    description: "Covers the basic concepts of Biology.",
  },
  {
    id: 8,
    title: "American History",
    subject: "History",
    duration: 90,
    difficulty: "Medium",
    totalQuestions: 35,
    availableUntil: "2025-01-01",
    description: "Covers the history of the United States",
  },
];

// Animation Variants
const examCardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// Sub-Components
const ExamCardComponent = ({ exam }) => {
  return (
    <motion.div
      variants={examCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="bg-green-200 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{exam.title}</CardTitle>
          <CardDescription className="text-gray-500 line-clamp-2">{exam.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              <BookOpen className="mr-1 h-3 w-3 inline-block" /> {exam.subject}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
              <Clock className="mr-1 h-3 w-3 inline-block" /> {exam.duration} min
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "text-white text-xs",
                exam.difficulty === "Easy" && "bg-green-500",
                exam.difficulty === "Medium" && "bg-yellow-500",
                exam.difficulty === "Hard" && "bg-red-500"
              )}
            >
              {exam.difficulty}
            </Badge>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Questions:</span>{" "}
            <span className="text-gray-900">{exam.totalQuestions}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Available Until:</span>{" "}
            <span className="text-gray-900">
              {new Date(exam.availableUntil).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ExamFilterComponent = ({ filters, setFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const uniqueSubjects = ["Mathematics", "Science", "History", "Literature", "Computer Science"];
  const durations = ["30", "45", "60", "90", "120"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleClearFilters = () => {
    setFilters({ subject: "", duration: "", difficulty: "" });
    setIsFilterOpen(false); // Close filter on clear
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full flex items-center justify-between text-gray-700"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span>Filters</span>
        {isFilterOpen ? <XCircle className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 bg-gradient-to-bl from-blue-400 to bg-green-300 p-2 border-2 rounded-2xl"
          >
            <div className="space-y-1 ">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <Select
                onValueChange={(value) => setFilters({ ...filters, subject: value })}
                value={filters.subject}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Subject" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="text-sm bg-gray-900 text-white ">
                  {uniqueSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className =" hover:bg-amber-500">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <Select
                onValueChange={(value) => setFilters({ ...filters, duration: value })}
                value={filters.duration}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Duration" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="text-sm bg-gray-900 text-white ">
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration} className =" hover:bg-amber-500">
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <Select
                onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                value={filters.difficulty}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Difficulty" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="text-sm bg-gray-900 text-white">
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}className =" hover:bg-amber-500">
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="w-full text-gray-700 hover:bg-gray-100 text-sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AllExams() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    duration: "",
    difficulty: "",
  });
  const router = useRouter();

  // Fetch exams from the database
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/exams'); // Replace with actual API endpoint
        const data = await response.json();
        setExams(data);
        setFilteredExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  // Apply search and filters
  useEffect(() => {
    let results = exams;

    // Apply search
    if (searchTerm) {
      results = results.filter((exam) =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.subject) {
      results = results.filter((exam) => exam.subject === filters.subject);
    }
    if (filters.duration) {
      results = results.filter((exam) => exam.duration <= parseInt(filters.duration));
    }
    if (filters.difficulty) {
      results = results.filter((exam) => exam.difficulty === filters.difficulty);
    }

    setFilteredExams(results);
  }, [searchTerm, filters, exams]);

  const handleStartExam = (examId) => {
    router.push(`/student/exams/take/${examId}`); // Redirect to the exam-taking page
  };

  return (
    <div className="container mx-auto px-4 py-8 border-y-indigo-400">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Available Exams</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search exams..."
            className="pl-8 pr-4 py-2 w-full bg-white border border-gray-300 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ExamFilterComponent filters={filters} setFilters={setFilters} />
        </div>

        <div className="lg:w-3/4">
          <AnimatePresence>
            {filteredExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredExams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    variants={examCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Card className="bg-green-200 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{exam.title}</CardTitle>
                        <CardDescription className="text-gray-500 line-clamp-2">{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            <BookOpen className="mr-1 h-3 w-3 inline-block" /> {exam.subject}
                          </Badge>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            <Clock className="mr-1 h-3 w-3 inline-block" /> {exam.duration} min
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-white text-xs",
                              exam.difficulty === "Easy" && "bg-green-500",
                              exam.difficulty === "Medium" && "bg-yellow-500",
                              exam.difficulty === "Hard" && "bg-red-500"
                            )}
                          >
                            {exam.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Questions:</span>{" "}
                          <span className="text-gray-900">{exam.totalQuestions}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Available Until:</span>{" "}
                          <span className="text-gray-900">
                            {new Date(exam.availableUntil).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full text-gray-700 hover:bg-gray-100 text-sm"
                          onClick={() => handleStartExam(exam.id)}
                        >
                          Start Exam
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-md shadow-sm">
                <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No exams found</h3>
                <p className="mt-1 text-gray-500 text-sm">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  className="mt-4 text-gray-700 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ subject: "", duration: "", difficulty: "" });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

