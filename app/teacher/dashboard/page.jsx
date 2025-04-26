"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
        const response = await axios.get('/api/create-exam'); // Corrected endpoint
        setExams(response.data);
        setLoading(false); // Update loading state
    } catch (error) {
        console.error('Error fetching exams:', error);
        setError('Failed to fetch exams.'); // Set error state
        setLoading(false); // Ensure loading is stopped even on error
    }
  };

  const handleDeleteExam = async (examId) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await axios.delete(`/api/exams?id=${examId}`);
        fetchExams(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete exam:', err);
      }
    }
  };

  if (loading) return <div className="flex justify-center py-8">Loading exams...</div>;
  if (error) return <div className="text-red-500 py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Exams</h1>
        <Link href="/teacher/exams/create">
          <Button>Create New Exam</Button>
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No exams created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{exam.subject}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {exam.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{exam.questions?.length || 0} questions</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/teacher/exams/${exam.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Link href={`/teacher/exams/preview/${exam.id}`}>
                  <Button>Preview Exam</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}