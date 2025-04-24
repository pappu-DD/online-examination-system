"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Shield, BookOpen, Clock, Users, BarChart2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from './component/footer';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Military-grade encryption to protect your exams and data"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Management",
      description: "Built-in timers and automatic submission"
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Instant Analytics",
      description: "Real-time results and performance analytics"
    }
  ];

  const testimonials = [
    {
      quote: "ExamDesk revolutionized how we conduct assessments. The platform is intuitive and reliable.",
      author: "Dr. Sarah Johnson",
      role: "University Professor"
    },
    {
      quote: "As a student, I find ExamDesk's interface clean and easy to use, even during timed exams.",
      author: "Michael Chen",
      role: "Computer Science Student"
    },
    {
      quote: "The anti-cheating features give us confidence in the integrity of our online exams.",
      author: "Lisa Rodriguez",
      role: "School Administrator"
    }
  ];

  const steps = [
    {
      title: "Create Account",
      description: "Sign up as a teacher or student in minutes"
    },
    {
      title: "Setup Exams",
      description: "Teachers can create exams with various question types"
    },
    {
      title: "Take Assessments",
      description: "Students complete exams in a secure environment"
    },
    {
      title: "Get Results",
      description: "Instant grading and detailed performance reports"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            The Future of Online Examinations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          >
            Secure, reliable, and easy-to-use examination platform for educators and students
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/sign-up?role=teacher">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                I'm an Educator <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/sign-up?role=student">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                I'm a Student <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose ExamDesk?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md text-center"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How ExamDesk Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                      <BookOpen className="h-10 w-10 text-blue-600 mb-4" />
                      <p className="text-xl italic mb-6">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow-md"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow-md"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Examination Process?</h2>
          <p className="text-xl mb-10">Join thousands of educators and students using ExamDesk today</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Get Started Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}