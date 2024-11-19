// components/LoginForm.tsx
"use client"
import { useLogin } from '@/lib/api/user';
import { useAuthStore } from '@/hooks/useAuth';

export const LoginForm = () => {
  const login = useLogin();
  const setUser = useAuthStore((state) => state.setUser);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const result = await login.mutateAsync({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 bg-blue-600 text-white flex-col justify-center items-center p-10 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-700 opacity-20"></div>
        <div className="z-10 text-center">
          {/* <img
            src="/illustration.png"
            alt="Illustration"
            className="mx-auto w-3/4 max-w-sm"
          /> */}
          <h1>Here is the illustration image</h1>
          <h2 className="text-2xl font-bold mt-8">
            New Scheduling And Routing Options
          </h2>
          <p className="mt-4">
            We also updated the format of podcasts and rewards.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-6">
        <div className="max-w-md w-full">
          <div className="text-center">
            {/* <img
              src="/logo.png"
              alt="Logo"
              className="mx-auto w-16 mb-6"
            /> */}
            <h1>Here is the logo</h1>
            <h2 className="text-2xl font-bold">Hello Again!</h2>
            <p className="text-gray-500 mt-2">
              Aliquam consectetur et tincidunt praesent enim massa pellentesque
              velit odio neque
            </p>
          </div>
          <form className="mt-8 space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute top-3 right-4 text-gray-400">
                📧
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute top-3 right-4 text-gray-400">
                🔒
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-blue-500">
                Recovery Password
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full border text-gray-600 py-2 rounded-lg flex items-center justify-center space-x-2 mt-4 hover:bg-gray-100 transition"
            >
              {/* <img
                src="/google-icon.png"
                alt="Google"
                className="w-5 h-5"
              /> */}
              <h1>Here is google logo</h1>
              <span>Sign in with Google</span>
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don’t have an account yet?{' '}
            <a href="#" className="text-blue-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};