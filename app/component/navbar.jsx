"use client";
import Link from "next/link";
import { useState } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Get user type from Clerk metadata or localStorage
  const [userType, setUserType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userType') || null;
    }
    return null;
  });

  const studentNavItems = [
    { href: "/", label: "Home" },
    { href: "/student/exams", label: "All Exams" },
    { href: "/student/dashboard", label: "Dashboard" },
    { href: "/student/results", label: "Results" },
  ];

  const teacherNavItems = [
    { href: "/", label: "Home" },
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/teacher/create-exam", label: "Create Exam" },
    { href: "/teacher/manage-exams", label: "Manage Exams" },
  ];

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/component/about", label: "About Us" },
    { href: "/component/contact", label: "Contact Us" },
  ];

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const renderNavItems = (items, isMobile = false) => {
    return items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={`${
          isMobile
            ? "text-white font-bold hover:bg-white/20 px-4 py-2 rounded-full w-full text-center"
            : "px-4 py-2 text-white font-bold hover:bg-white/20 rounded-full transition-all duration-300 flex items-center group"
        }`}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <span className="group-hover:scale-105 transition-transform">{item.label}</span>
      </Link>
    ));
  };

  if (!isLoaded) {
    return null; // or loading spinner
  }

  return (
    <nav className="bg-zinc-800 rounded-b-lg shadow-lg p-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-white">
          <Link href="/" className="p-2 text-white font-bold">
            ExamDesk
          </Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {isSignedIn
            ? renderNavItems(userType === 'student' ? studentNavItems : teacherNavItems)
            : renderNavItems(publicNavItems)}
        </ul>

        {/* Login/Logout Section - Desktop */}
        <div className="relative hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <>
              <div className="flex items-center gap-2">
                <UserButton aftersigninurl="/" />
                <span className="text-white">
                  {userType === 'student' ? 'Student' : 'Teacher'} Dashboard
                </span>
              </div>
              <SignOutButton>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => localStorage.removeItem('userType')}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </SignOutButton>
            </>
          ) : (
            <>
              {!userType && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className={`text-white border-white hover:bg-white/10 ${userType === 'student' ? 'bg-blue-500' : ''}`}
                    onClick={() => handleUserTypeSelection('student')}
                  >
                    Student
                  </Button>
                  <Button
                    variant="outline"
                    className={`text-white border-white hover:bg-white/10 ${userType === 'teacher' ? 'bg-blue-500' : ''}`}
                    onClick={() => handleUserTypeSelection('teacher')}
                  >
                    Teacher
                  </Button>
                </div>
              )}
              
              {userType && (
                <>
                  <SignInButton 
                    mode="modal"
                    aftersigninurl={userType === 'student' ? '/student/dashboard' : '/teacher/dashboard'}
                  >
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Login as {userType}
                    </Button>
                  </SignInButton>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 hover:bg-white/20 rounded-full"
        >
          {isOpen ? <X size={24} /> : <TiThMenuOutline size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-600 md:hidden z-50">
          <ul className="flex flex-col items-center py-4 space-y-4 shadow-lg">
            {isSignedIn
              ? renderNavItems(userType === 'student' ? studentNavItems : teacherNavItems, true)
              : renderNavItems(publicNavItems, true)}

            <div className="w-full px-4 space-y-2">
              {isSignedIn ? (
                <>
                  <div className="flex justify-center">
                    <UserButton aftersigninurl="/" />
                  </div>
                  <SignOutButton>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => localStorage.removeItem('userType')}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </SignOutButton>
                </>
              ) : (
                <>
                  {!userType && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className={`flex-1 text-white border-white hover:bg-white/10 ${userType === 'student' ? 'bg-blue-500' : ''}`}
                        onClick={() => handleUserTypeSelection('student')}
                      >
                        Student
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 text-white border-white hover:bg-white/10 ${userType === 'teacher' ? 'bg-blue-500' : ''}`}
                        onClick={() => handleUserTypeSelection('teacher')}
                      >
                        Teacher
                      </Button>
                    </div>
                  )}
                  
                  {userType && (
                    <>
                      <SignInButton 
                        mode="modal"
                        aftersigninurl={userType === 'student' ? '/student/dashboard' : '/teacher/dashboard'}
                      >
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                          Login as {userType}
                        </Button>
                      </SignInButton>
                    </>
                  )}
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}