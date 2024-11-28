"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand/auth';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const { user } = useAuthStore(); // Access user state from Zustand
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if the user is already logged in
    if (user) {
      router.push('/dashboard'); // Adjust the path as necessary
    }
  }, [user, router]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target as HTMLFormElement);

  //   try {
  //     const resp = await login({
  //       email: formData.get('email') as string,
  //       password: formData.get('password') as string,
  //     });
  //     console.log(resp)
  //     // No need to redirect here; useEffect will handle it
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     // Optionally handle UI feedback for login failure
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
        await login({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });
        
        // No need to directly handle the token here if using cookies
    } catch (error) {
        console.error('Login failed:', error);
        // Optionally handle UI feedback for login failure
    }
};

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 bg-blue-600 text-white flex-col justify-center items-center p-10 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-700 opacity-20"></div>
        <div className="z-10 text-center">
          <h1>Here is the illustration image</h1>
          <h2 className="text-2xl font-bold mt-8">New Scheduling And Routing Options</h2>
          <p className="mt-4">We also updated the format of podcasts and rewards.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-6">
        <div className="max-w-md w-full">
          <div className="text-center">
            <h1>Here is the logo</h1>
            <h2 className="text-2xl font-bold">Hello Again!</h2>
            <p className="text-gray-500 mt-2">
              Aliquam consectetur et tincidunt praesent enim massa pellentesque velit odio neque
            </p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-blue-500">Recovery Password</a>
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-500 text-center">{error.message}</p>}
          </form>
          <p className="text-center text-sm mt-4">
            Don’t have an account yet?{' '}
            <Link href="/register" className="text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};