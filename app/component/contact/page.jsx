'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Head from 'next/head';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Head>
        <title>Contact Us | ExamDesk</title>
        <meta name="description" content="Get in touch with ExamDesk support team" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4"
          >
            Contact <span className="text-blue-600">ExamDesk</span>
          </motion.h1>
          <p className="text-xl text-gray-600">
            We're here to help with any questions about our online examination system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600">amit@examdesk.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-600">+91 6002349872</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">
                  sector 21<br />
                  Ranchi , jharkhand
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="p-3 bg-green-100 text-green-700 rounded-md">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">
                  Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}