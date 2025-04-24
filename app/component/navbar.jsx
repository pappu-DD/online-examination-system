"use client";
import React, { useEffect, useState, useRef } from "react"; // Import React and the specific hooks you use
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiThMenuOutline } from "react-icons/ti";
import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const navVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

const linkVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const mobileMenuVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const mobileAuthVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" } },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeInOut" } },
};

export default function Navbar({ children }) { // Make sure you're accepting the children prop if this is a layout
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [userType, setUserType] = useState(null);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null); // Use useRef from React

  useEffect(() => {
    const storedType = localStorage.getItem("userType");
    setUserType(storedType);
  }, []);

  useEffect(() => {
    if (isSignedIn && userType) {
      const redirectPath = userType === "student" ? "/student/dashboard" : "/teacher/dashboard";
      router.push(redirectPath);
    }
  }, [isSignedIn, userType, router]);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  const handleLogin = (type) => {
    localStorage.setItem("userType", type);
    setUserType(type);
    // Clerk modal opens here; after login, `useEffect` above redirects
  };

  const navItems = {
    student: [
      { href: "/", label: "Home" },
      { href: "/student/exams", label: "All Exams" },
      { href: "/student/dashboard", label: "Dashboard" },
      { href: "/student/results", label: "Results" },
    ],
    teacher: [
      { href: "/", label: "Home" },
      { href: "/teacher/dashboard", label: "Dashboard" },
      { href: "/teacher/create-exam", label: "Create Exam" },
      { href: "/teacher/manage-exams", label: "Manage Exams" },
    ],
    public: [
      { href: "/", label: "Home" },
      { href: "/component/about", label: "About" },
      { href: "/component/contact", label: "Contact" },
    ],
  };

  const renderNavItems = (items, isMobile = false) =>
    items.map((item) => (
      <motion.li
        key={item.href}
        variants={linkVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Link
          href={item.href}
          className={`${
            isMobile
              ? "block text-white font-semibold py-3 px-4 rounded-md hover:bg-zinc-700 transition duration-200"
              : "px-4 py-2 text-white font-semibold rounded-md hover:bg-zinc-700 transition duration-200"
          }`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          {item.label}
        </Link>
      </motion.li>
    ));

  if (!isLoaded) return null;

  return (
    <>
      <motion.nav
        ref={navRef}
        className="bg-zinc-900 p-4 rounded-b-xl shadow-md sticky top-0 left-0 right-0 z-50"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-extrabold text-indigo-400 tracking-tight">
            ExamDesk
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 items-center">
            {isSignedIn
              ? renderNavItems(navItems[userType] || [])
              : renderNavItems(navItems.public)}
          </ul>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-200"
                    onClick={() => handleLogin("student")}
                  >
                    Login as Student
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    className="bg-transparent hover:bg-indigo-500 text-white font-semibold rounded-md shadow-sm transition duration-200 border border-indigo-500"
                    variant="outline"
                    onClick={() => handleLogin("teacher")}
                  >
                    Login as Teacher
                  </Button>
                </SignInButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <UserButton />
                <SignOutButton>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-sm transition duration-200 flex items-center"
                    onClick={() => localStorage.removeItem("userType")}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-zinc-800 rounded-md transition duration-200"
          >
            {isOpen ? <X size={24} /> : <TiThMenuOutline size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 shadow-md rounded-b-xl overflow-hidden"
          variants={mobileMenuVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          <ul className="py-4 px-6 space-y-2">
            {isSignedIn
              ? renderNavItems(navItems[userType] || [], true)
              : renderNavItems(navItems.public, true)}
          </ul>

          <motion.div
            className="py-4 px-6 space-y-3"
            variants={mobileAuthVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-200"
                    onClick={() => handleLogin("student")}
                  >
                    Login as Student
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    className="w-full bg-transparent hover:bg-indigo-500 text-white font-semibold rounded-md shadow-sm transition duration-200 border border-indigo-500"
                    variant="outline"
                    onClick={() => handleLogin("teacher")}
                  >
                    Login as Teacher
                  </Button>
                </SignInButton>
              </>
            ) : (
              <div className="space-y-3">
                <UserButton />
                <SignOutButton>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-sm transition duration-200 flex items-center justify-center"
                    onClick={() => localStorage.removeItem("userType")}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Add top padding to the first child below the Navbar */}
      <div style={{ paddingTop: `${navHeight}px` }}>
        {children}
      </div>
    </>
  );
}