"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditExam({ params }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`/api/exams?id=${params.id}`);
        setExam(response.data);
      } catch (err) {
        console.error('Failed to fetch exam:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [params.id]);

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/exams?id=${params.id}`, formData);
      router.push('/teacher/dashboard');
    } catch (err) {
      console.error('Failed to update exam:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Exam</h1>
      <ExamForm 
        initialData={{
          title: exam.title,
          subject: exam.subject,
          description: exam.description,
          duration: exam.duration,
          questions: exam.questions
        }} 
        onSubmit={handleSubmit}
      />
    </div>
  );
}