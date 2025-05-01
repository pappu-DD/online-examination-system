"use client";

import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import { useState, FormEvent } from 'react';

export default function Footer() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState(''); // For newsletter subscription
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feedback }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
        setFeedback('');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            <span className="text-blue-500">Exam</span>Desk
          </h2>
          <p className="text-gray-400">
            Your trusted platform for seamless online examinations. Secure, reliable, and easy-to-use for both students and educators.
          </p>
         
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/component/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
            <li><Link href="/features" className="text-gray-400 hover:text-white transition">Features</Link></li>
            <li><Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-gray-400">amit@examdesk.com</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-gray-400">+91 6200960195</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-gray-400">Ranchi, Jharkhand</span>
            </li>
          </ul>
          
          {/* Social Media */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-700 transition">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition">
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div>
      <h3 className="text-lg font-semibold mb-4">Send Feedback</h3>
      {submitted ? (
        <div className="bg-green-900/50 text-green-400 p-3 rounded">
          Thanks for your feedback! We appreciate it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email..."
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Email input"
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            className="w-full p-3 rounded bg-gray-800 text-white resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Feedback input"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium transition-all"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
      </div>

      {/* Copyright and Legal */}
      <div className="border-t border-gray-800 mt-8 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ExamDesk. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}