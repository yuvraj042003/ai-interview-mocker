"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-5 bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="text-center max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">AI Interview Mocker</h1>
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Welcome to AI Interview Mocker
        </p>
        <p className="text-gray-500 mb-8">
          Create and start your AI Mockup Interview with ease. Enhance your interview skills and get valuable feedback.
        </p>
        {user ? (
          <h2 className="text-gray-600 text-lg mb-4">You are logged in!</h2>
        ) : (
          <div>
            <p className="text-gray-600 text-lg mb-4">Please login to practice interview questions</p>
            <Button 
              size="lg" 
              variant="primary" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
