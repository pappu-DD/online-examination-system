'use client'; // Add this if using Next.js App Router

import { motion } from 'framer-motion';
import Head from 'next/head';

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <Head>
                <title>About ExamDesk - Online Examination System</title>
                <meta name="description" content="Learn about ExamDesk, the modern online examination platform" />
            </Head>

            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        About <span className="text-blue-600">ExamDesk</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Revolutionizing the way examinations are conducted
                    </p>
                </motion.div>

                <div className="space-y-8">
                    <motion.section 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600">
                            ExamDesk aims to provide a seamless, secure, and scalable online examination platform 
                            that empowers educational institutions and organizations to conduct tests with 
                            integrity and efficiency.
                        </p>
                    </motion.section>

                    <motion.section 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Secure browser with anti-cheating measures</li>
                            <li>Real-time monitoring and proctoring</li>
                            <li>Automated grading and instant results</li>
                            <li>Question bank with multiple question types</li>
                            <li>Detailed analytics and performance reports</li>
                            <li>Accessible from any device</li>
                        </ul>
                    </motion.section>

                    <motion.section 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose ExamDesk?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">For Institutions</h3>
                                <p className="text-gray-600">
                                    Reduce administrative workload, cut costs on paper-based exams, 
                                    and gain valuable insights into student performance.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">For Students</h3>
                                <p className="text-gray-600">
                                    Take exams anytime, anywhere with a user-friendly interface 
                                    and get immediate feedback on your performance.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Transform Your Examination Process?</h2>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
                            Get Started Today
                        </button>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
}