"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, Save, BookOpen, Clock, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateExamPage = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState([{
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        difficulty: 'Medium'
    }]);

    const [examDetails, setExamDetails] = useState({
        duration: 60,
        subject: '',
        description: '',
        title: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExamDetailsChange = (e) => {
        const { name, value } = e.target;
        setExamDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            text: '',
            options: ['', '', '', ''],
            correctOption: 0,
            difficulty: 'Medium'
        }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(index, 1);
            setQuestions(updatedQuestions);
            toast.success('Question removed');
        } else {
            toast.error('You must have at least one question');
        }
    };

    const validateForm = () => {
        if (!examDetails.title || !examDetails.subject) {
            toast.error('Please fill in all required fields (Title and Subject)');
            return false;
        }

        for (const question of questions) {
            if (!question.text.trim()) {
                toast.error(`Question ${questions.indexOf(question) + 1} text is required`);
                return false;
            }

            for (const option of question.options) {
                if (!option.trim()) {
                    toast.error(`All options must be filled for Question ${questions.indexOf(question) + 1}`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/create-exam', {
                examDetails,
                questions,
            });

            if (response.data.success) {
                toast.success('Exam created successfully!');
                setExamDetails({
                    duration: 60,
                    subject: '',
                    description: '',
                    title: ''
                });
                setQuestions([{
                    text: '',
                    options: ['', '', '', ''],
                    correctOption: 0,
                    difficulty: 'Medium'
                }]);
                router.push('/teacher/dashboard');
            } else {
                toast.error(response.data.message || 'Failed to create exam');
            }
        } catch (error) {
            console.error('Error submitting exam:', error);
            toast.error('An error occurred while creating the exam');
        } finally {
            setIsSubmitting(false);
        }
    };

    const difficultyColors = {
        Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 dark:bg-indigo-800 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BookOpen className="h-8 w-8 text-white mr-3" />
                                <h1 className="text-2xl font-bold text-white">Create New Exam</h1>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Exam Details */}
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-500" />
                                Exam Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Exam Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={examDetails.title}
                                        onChange={handleExamDetailsChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Science Quiz - Chapter 1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={examDetails.subject}
                                        onChange={handleExamDetailsChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Physics, History"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Duration (minutes)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            id="duration"
                                            name="duration"
                                            min="1"
                                            value={examDetails.duration}
                                            onChange={handleExamDetailsChange}
                                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={examDetails.description}
                                        onChange={handleExamDetailsChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Provide any instructions or details about the exam."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                    Questions
                                </h2>
                                <button
                                    onClick={addQuestion}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Question
                                </button>
                            </div>

                            <div className="space-y-6">
                                {questions.map((question, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                                            <h3 className="font-medium text-gray-800 dark:text-white">Question {index + 1}</h3>
                                            <button
                                                onClick={() => removeQuestion(index)}
                                                className={`p-2 rounded-full ${questions.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-gray-600'}`}
                                                disabled={questions.length <= 1}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-4">
                                                <label htmlFor={`question-text-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Question Text <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id={`question-text-${index}`}
                                                    value={question.text}
                                                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                                    rows={3}
                                                    placeholder="Enter the question..."
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Options <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {question.options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className="flex items-center">
                                                            <div className={`flex-shrink-0 h-6 w-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                                question.correctOption === optionIndex
                                                                    ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
                                                                    : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                                            }`}>
                                                                {String.fromCharCode(65 + optionIndex)}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                                required
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor={`correct-answer-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Correct Answer <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id={`correct-answer-${index}`}
                                                        value={question.correctOption}
                                                        onChange={(e) => handleQuestionChange(index, 'correctOption', parseInt(e.target.value))}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        {question.options.map((_, optionIndex) => (
                                                            <option key={optionIndex} value={optionIndex}>
                                                                {String.fromCharCode(65 + optionIndex)}: {question.options[optionIndex] || `Option ${optionIndex + 1}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor={`difficulty-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Difficulty Level
                                                    </label>
                                                    <select
                                                        id={`difficulty-${index}`}
                                                        value={question.difficulty}
                                                        onChange={(e) => handleQuestionChange(index, 'difficulty', e.target.value)}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${difficultyColors[question.difficulty]}`}
                                                    >
                                                        <option value="Easy" className={difficultyColors.Easy}>Easy</option>
                                                        <option value="Medium" className={difficultyColors.Medium}>Medium</option>
                                                        <option value="Hard" className={difficultyColors.Hard}>Hard</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer with Submit Button */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Exam...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Create Exam
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExamPage;