"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For App Router
import { useAuthStore } from '@/zustand/auth'; 
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/api/users';
import Link from 'next/link';

const RegisterPage = () => {
  const { register, isLoading, error } = useAuth();
  const { user } = useAuthStore(); 
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      router.push('/login'); // Adjust the path as necessary
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await register({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: UserRole.ADMIN,
        name: formData.get("FullName") as string
      });
      
      // The user will be redirected by the useEffect after registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 bg-blue-600 text-white flex-col justify-center items-center p-10 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-700 opacity-20"></div>
        <div className="z-10 text-center">
          <h1>Welcome to Our Service</h1>
          <h2 className="text-2xl font-bold mt-8">Join Us Today!</h2>
          <p className="mt-4">Sign up for amazing features and updates.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-6">
        <div className="max-w-md w-full">
          <div className="text-center">
            <h1>Register</h1>
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="text-gray-500 mt-2">
              Fill in your details to create an account.
            </p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                name="name"
                type="text"
                placeholder="FullName"
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <span className="absolute top-3 right-4 text-gray-400">👤</span>
            </div>
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <span className="absolute top-3 right-4 text-gray-400">📧</span>
            </div>
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <span className="absolute top-3 right-4 text-gray-400">🔒</span>
            </div>
            {/* Add more fields as necessary, e.g., username, confirm password */}
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            {error && <p className="text-red-500 text-center">{error.message}</p>}
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;