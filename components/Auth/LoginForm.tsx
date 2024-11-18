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
    <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-1/5 bg-white text-black p-10'>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};