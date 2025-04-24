"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiThMenuOutline } from "react-icons/ti";
import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  UserButton,
  useUser,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";

const navVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const linkVariants = {
  hover: { scale: 1.1, color: "#a78bfa" },
  tap: { scale: 0.95 },
};

const mobileMenuVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const mobileLinkVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem("userType");
    setUserType(storedType);
  }, []);

  useEffect(() => {
    if (isSignedIn && userType) {
      const redirectPath =
        userType === "student" ? "/student/exams" : "/teacher/dashboard";
      router.push(redirectPath);
    }
  }, [isSignedIn, userType, router]);

  const handleLogin = (type: string) => {
    localStorage.setItem("userType", type);
    setUserType(type);
  };

  const navItems = {
    student: [
      { href: "/", label: "Home" },
      { href: "/student/exams", label: "All Exams" },
      { href: "/student/dashboard", label: "Dashboard" },
    ],
    teacher: [
      { href: "/", label: "Home" },
      { href: "/teacher/dashboard", label: "Dashboard" },
      { href: "/teacher/create-exam", label: "Create Exam" },
    ],
    public: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  };

  const renderNavItems = (
    items: { href: string; label: string }[],
    isMobile = false
  ) => (
    <>
      {items.map((item, index) => (
        <motion.li
          key={item.href}
          variants={isMobile ? mobileLinkVariants : linkVariants}
          initial={isMobile ? "initial" : undefined}
          animate={isMobile ? "animate" : undefined}
          exit={isMobile ? "exit" : undefined}
          transition={{ duration: 0.2, delay: isMobile ? index * 0.05 : 0 }}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href={item.href}
            className={`${
              isMobile ? "block py-3 px-4" : "px-4 py-2"
            } text-gray-300 hover:text-indigo-400 rounded-md transition-colors`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            {item.label}
          </Link>
        </motion.li>
      ))}
    </>
  );

  if (!isLoaded) return null;

  return (
    <motion.nav
      className="bg-zinc-900/90 backdrop-blur-sm p-4 sticky top-0 z-50 shadow-md"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          <h2 className="text-2xl font-bold">
            <span className="text-blue-500">Exam</span>Desk
          </h2>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center">
          {isSignedIn
            ? renderNavItems(navItems[userType as keyof typeof navItems] || [])
            : renderNavItems(navItems.public)}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden md:flex gap-3 items-center">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  onClick={() => handleLogin("student")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
                >
                  Student Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  onClick={() => handleLogin("teacher")}
                  variant="outline"
                  className="text-indigo-400 border-indigo-400 hover:bg-indigo-700 hover:text-white rounded-md shadow-sm"
                >
                  Teacher Login
                </Button>
              </SignInButton>
            </>
          ) : (
            <div className="flex gap-3 items-center">
              <UserButton />
              <SignOutButton>
                <Button
                  variant="destructive"
                  className="rounded-md shadow-sm"
                  onClick={() => localStorage.removeItem("userType")}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </SignOutButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isOpen ? <X size={24} /> : <TiThMenuOutline size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden bg-zinc-900/90 backdrop-blur-sm overflow-hidden mt-2 rounded-md shadow-md"
        variants={mobileMenuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <ul className="py-2 px-4 space-y-2">
          {isSignedIn
            ? renderNavItems(
                navItems[userType as keyof typeof navItems] || [],
                true
              )
            : renderNavItems(navItems.public, true)}
        </ul>
        <div className="p-4 space-y-3">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm"
                  onClick={() => handleLogin("student")}
                >
                  Student Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  className="w-full text-indigo-400 border-indigo-400 hover:bg-indigo-700 hover:text-white rounded-md shadow-sm"
                  variant="outline"
                  onClick={() => handleLogin("teacher")}
                >
                  Teacher Login
                </Button>
              </SignInButton>
            </>
          ) : (
            <SignOutButton>
              <Button
                className="w-full variant-destructive rounded-md shadow-sm"
                onClick={() => localStorage.removeItem("userType")}
              >
                <LogOut className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Logout</span>
              </Button>
            </SignOutButton>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
