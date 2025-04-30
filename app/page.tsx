"use client";
import { Brain, Zap, Trophy, BarChart3 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  BookOpen,
  Clock,
  Users,
  BarChart2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Footer from "./component/footer";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Military-grade encryption to protect your exams and data",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Management",
      description: "Built-in timers and automatic submission",
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Instant Analytics",
      description: "Real-time results and performance analytics",
    },
  ];

  const testimonials = [
    {
      quote:
        "ExamDesk revolutionized how we conduct assessments. The platform is intuitive and reliable.",
      author: "Dr. Sarah Johnson",
      role: "University Professor",
      image: "./image.png",
    },
    {
      quote:
        "As a student, I find ExamDesk's interface clean and easy to use, even during timed exams.",
      author: "Michael Chen",
      role: "Computer Science Student",
      image: "./image.png",
    },
    {
      quote:
        "The anti-cheating features give us confidence in the integrity of our impressive online exams.",
      author: "Lisa Rodriguez",
      role: "School Administrator",
      image: "./image.png",
    },
  ];

  const steps = [
    {
      title: "Create Account",
      description: "Sign up as a teacher or student in minutes",
    },
    {
      title: "Setup Exams",
      description: "Teachers can create exams with various question types",
    },
    {
      title: "Take Assessments",
      description: "Students complete exams in a secure environment",
    },
    {
      title: "Get Results",
      description: "Instant grading and detailed performance reports",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-24 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="./image copy.png" // Replace with a more relevant image URL
            alt="Online Examination"
            className="w-full h-full object-cover opacity-20"
            loading="lazy" // Improves performance
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>{" "}
          {/* Gradient Overlay */}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-white bg-clip-text"
          >
            Elevate Your Examinations with{" "}
            <span className="text-blue-700 rounded-lg bg-yellow-400 ">
              Exam
            </span>
            Desk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto text-gray-200"
          >
            Experience the future of secure, reliable, and intuitive online
            examinations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/quiz/new" passHref>
              <Button
                size="lg"
                className="px-8 py-3 sm:py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white
                     hover:from-red-600 hover:to-orange-600 rounded-full shadow-lg
                     transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                onClick={() => console.log("Start Quiz button clicked")}
              >
                <Zap className="h-6 w-6" />
                Start quick Exam
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <section className="py-20 px-6 bg-gradient-to-bl from-green-500 to-blue-500">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Our Exam Solutions
      </h1>
      <h2 className="text-2xl text-white max-w-2xl mx-auto">
        Comprehensive digital examination solutions tailored for modern educational needs
      </h2>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Card 1: Semester Exam Solution */}
      <div className="group bg-blue-300 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="flex flex-col md:flex-row h-full">
          <div className="p-8 flex-1 order-2 md:order-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Semester Exam Solution
              </h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Conduct virtual semester exams with our robust platform featuring automated proctoring, question randomization, and real-time analytics.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Secure browser lockdown
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                AI-powered cheating prevention
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Seamless grade integration
              </li>
            </ul>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Learn More
            </button>
          </div>
          <div className="md:w-2/5 order-1 md:order-2 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Semester Exam"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-blue-600/30"></div>
          </div>
        </div>
      </div>

      {/* Card 2: Entrance Exam Solution */}
      <div className="group bg-blue-300 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="flex flex-col md:flex-row h-full">
          <div className="p-8 flex-1 order-2 md:order-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Entrance Exam Solution
              </h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Scale your entrance examinations with our high-capacity platform featuring advanced proctoring, multi-level authentication, and comprehensive reporting.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                High-volume candidate management
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Biometric verification
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Customizable test patterns
              </li>
            </ul>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
              Learn More
            </button>
          </div>
          <div className="md:w-2/5 order-1 md:order-2 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Entrance Exam"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-green-600/30"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      {/* Colorful Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800">
            Why Choose <span className="text-green-600">ExamDesk</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const colors = [
                "from-pink-400 to-pink-600",
                "from-blue-400 to-blue-600",
                "from-green-400 to-green-600",
                "from-yellow-400 to-yellow-600",
                "from-purple-400 to-purple-600",
                "from-red-400 to-red-600",
              ];
              const gradient = colors[index % colors.length];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-yellow-200 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 
                        transition-all duration-300 text-center border-t-4 ${gradient.replace(
                          "to-",
                          "border-"
                        )}`}
                >
                  <div
                    className={`bg-gradient-to-br ${gradient} w-16 h-16 rounded-full 
                            flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-md`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Unlock Your Potential with Premium Exam Test Series
            </h2>
            <p className="text-lg text-gray-300">
              Elevate your preparation and achieve your goals with our
              comprehensive, subscription-based test series.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Test Series Cards - Replace with your actual data */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40">
                <div className="bg-gradient-to-br from-blue-800 to-purple-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Basic Plan
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Access to foundational tests and resources.
                  </p>
                  <p className="text-2xl font-bold text-white mb-4">
                    ₹99/month
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-200">
                    <li>10+ Mock Tests</li>
                    <li>Basic Performance Analysis</li>
                    <li>Limited Subject Coverage</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
                    Subscribe Now
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40 transform hover:shadow-xl">
                <div className="bg-gradient-to-br from-purple-800 to-pink-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Standard Plan
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Comprehensive test series with detailed analytics.
                  </p>
                  <p className="text-2xl font-bold text-white mb-4">
                    ₹299/month
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-200">
                    <li>30+ Mock Tests</li>
                    <li>Detailed Performance Analysis</li>
                    <li>Full Subject Coverage</li>
                    <li>Personalized Recommendations</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                    Subscribe Now
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40">
                <div className="bg-gradient-to-br from-pink-800 to-red-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Premium Plan
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Intensive preparation with expert guidance and priority
                    support.
                  </p>
                  <p className="text-2xl font-bold text-white mb-4">
                    ₹599/month
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-200">
                    <li>Unlimited Mock Tests</li>
                    <li>In-depth Performance Analysis</li>
                    <li>All Subject Coverage</li>
                    <li>Doubt Clearing Sessions</li>
                    <li>Priority Support</li>
                    <li>Exclusive Webinars</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600">
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-white via-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800">
            How <span className="text-green-600">ExamDesk</span> Works
          </h2>

          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((step, index) => {
              const colors = [
                "from-green-400 to-green-600",
                "from-blue-400 to-blue-600",
                "from-purple-400 to-purple-600",
                "from-pink-400 to-pink-600",
              ];
              const gradient = colors[index % colors.length];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300"
                >
                  <div
                    className={`bg-gradient-to-br ${gradient} text-white w-14 h-14 rounded-full 
                            flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-200 to-pink-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-blue-700">
            What Our Users Say
          </h2>
          <div className="relative">
            <div className="overflow-hidden rounded-xl shadow-xl">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-300"
                      />
                      <BookOpen className="h-8 w-8 text-purple-500 mb-4" />
                      <p className="text-xl italic mb-6 text-gray-800">
                        "{testimonial.quote}"
                      </p>
                      <div className="text-center">
                        <p className="font-semibold text-blue-700">
                          {testimonial.author}
                        </p>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 bg-purple-500/20 text-purple-700 p-3 rounded-full shadow-md hover:bg-purple-500/30 transition-colors"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 bg-purple-500/20 text-purple-700 p-3 rounded-full shadow-md hover:bg-purple-500/30 transition-colors"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index
                      ? "bg-purple-600"
                      : "bg-purple-300 hover:bg-purple-400 transition-colors"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
