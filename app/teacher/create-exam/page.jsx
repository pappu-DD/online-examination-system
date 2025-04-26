'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PlusCircle, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function CreateExam() {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        numOfQuestions: 1,
        duration: 30,
        difficulty: 'easy',
        description: '',
        questions: [{ question: '', options: ['', '', '', ''], correctOption: 0 }],
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleQuestionChange = (index, key, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };

        if (key === 'correctOption') {
            if (value < 0 || value >= updatedQuestions[index].options.length) {
                setError(`Correct option for Question ${index + 1} is invalid.`);
                return;
            }
        }
        setFormData({ ...formData, questions: updatedQuestions });
        setError(null);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setFormData({ ...formData, questions: updatedQuestions });
        setError(null);
    };

    const addQuestion = () => {
        if (formData.questions.length >= 10) {
            setError("Maximum 10 questions allowed.");
            return;
        }
        setFormData({
            ...formData,
            questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctOption: 0 }],
            numOfQuestions: formData.numOfQuestions + 1,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.subject.trim() || !formData.description.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
            setError("Please fill in all question and option fields.");
            return;
        }

        if (formData.questions.some(q => q.correctOption < 0 || q.correctOption >= q.options.length)) {
            setError("Please select a valid correct option for each question.");
            return;
        }

        if (formData.numOfQuestions !== formData.questions.length) {
            setError("Number of questions does not match the actual number of questions.");
            return;
        }

        try {
            const res = await fetch('/api/create-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const responseData = await res.json(); // Parse the response JSON

            if (res.ok) {
                setSuccess(true);
                setFormData({
                    title: '',
                    subject: '',
                    numOfQuestions: 1,
                    duration: 30,
                    difficulty: 'easy',
                    description: '',
                    questions: [{ question: '', options: ['', '', '', ''], correctOption: 0 }],
                });
                setError(null);
            } else {
                console.error('API Error:', responseData); // Log the API error response
                setError(responseData.error || 'Failed to create exam. Please try again.');
            }
        } catch (err) {
            console.error('Unexpected Error:', err); // Log unexpected errors
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800">Create Exam</h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Exam Title <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter exam title"
                        required
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        required
                        className="w-full"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="numOfQuestions" className="block text-sm font-medium text-gray-700">Number of Questions <span className="text-red-500">*</span></label>
                        <Input
                            type="number"
                            id="numOfQuestions"
                            name="numOfQuestions"
                            value={formData.numOfQuestions}
                            onChange={handleChange}
                            placeholder="Enter number of questions"
                            min="1"
                            max="10"
                            required
                            className="w-full"
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes) <span className="text-red-500">*</span></label>
                        <Input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Enter duration"
                            min="1"
                            required
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty <span className="text-red-500">*</span></label>
                    <Select
                        onValueChange={(value) => handleSelectChange(value)}
                        value={formData.difficulty}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Exam Description <span className="text-red-500">*</span></label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter exam description"
                        rows={3}
                        required
                        className="w-full"
                    />
                </div>

                <h2 className="text-xl font-semibold mt-6 text-gray-800">MCQ Questions</h2>
                {formData.questions.map((q, index) => (
                    <div key={index} className="bg-white rounded-md shadow-sm p-4 border mb-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Question {index + 1}</h3>
                            {formData.questions.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
                                        setFormData({
                                            ...formData,
                                            questions: updatedQuestions,
                                            numOfQuestions: formData.numOfQuestions - 1,
                                        });
                                    }}
                                    className="self-start"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2 mb-4">
                            <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700">Question <span className="text-red-500">*</span></label>
                            <Input
                                type="text"
                                id={`question-${index}`}
                                name="question"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                placeholder={`Enter question ${index + 1}`}
                                required
                                className="w-full"
                            />
                        </div>
                        {q.options.map((opt, i) => (
                            <div key={i} className="space-y-2 mb-2">
                                <label htmlFor={`option-${index}-${i}`} className="block text-sm font-medium text-gray-700">Option {String.fromCharCode(65 + i)} <span className="text-red-500">*</span></label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="text"
                                        id={`option-${index}-${i}`}
                                        name={`option-${i}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, i, e.target.value)}
                                        placeholder={`Enter option ${String.fromCharCode(65 + i)}`}
                                        required
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="space-y-2">
                            <label htmlFor={`correctOption-${index}`} className="block text-sm font-medium text-gray-700">Correct Option <span className="text-red-500">*</span></label>
                            <Select
                                onValueChange={(value) => handleQuestionChange(index, 'correctOption', parseInt(value, 10))}
                                value={q.correctOption.toString()}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select correct option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {q.options.map((_, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                            Option {String.fromCharCode(65 + i)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
                <Button type="button" onClick={addQuestion} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Question
                </Button>

                <Button type="submit" className="w-full p-3 bg-green-400">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Exam
                </Button>
            </form>

            {success && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
                    <strong className="font-bold">Success! </strong>
                    <span className="block sm:inline">Exam created successfully.</span>
                </div>
            )}
            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                    <AlertCircle className="inline h-6 w-6 mr-2" />
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
        </div>
    );
  function handleSelectChange(value) {
    setFormData({ ...formData, difficulty: value });
  }
}

