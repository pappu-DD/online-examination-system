import Image from "next/image";
import Link from "next/link";
import Footer from "./component/footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-100 text-gray-800 px-6 py-12">
        <section className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            Welcome to ExamDesk
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your all-in-one platform for taking and managing online exams.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/all-exams"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Browse Exams
            </Link>
            <Link
              href="/about"
              className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-12">
            <Image
              src="/exam-illustration.png" // Replace with a real image in your public folder
              alt="Online Exam Illustration"
              width={600}
              height={400}
              className="mx-auto"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
