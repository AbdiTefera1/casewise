/* eslint-disable @typescript-eslint/no-explicit-any */
// zustand/auth.ts
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import {User} from '@/lib/api/users'

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {set({ user, token })},
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);




// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { User } from '@/lib/api/users';
// // import JwtDecode from 'jwt-decode'; 'jwt-decode';
// import { jwtDecode } from 'jwt-decode';

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   setAuth: (user: User, token: string) => void;
//   clearAuth: () => void;
//   hydrateAuth: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       setAuth: (user, token) => {
//         set({ user, token });
//       },
//       clearAuth: () => set({ user: null, token: null }),
//       hydrateAuth: () => {
//         try {
//           const storedToken = localStorage.getItem('auth-storage');

//           if (storedToken) {
//             const decodedToken: any = jwtDecode(storedToken);
//             console.log("Decoded token: ", decodedToken);

//             const user: User = {
//               id: decodedToken.userId,
//               email: decodedToken.email,
//               name: decodedToken.name, // Default or fetch
//               role: decodedToken.role,
//               avator: undefined, // Default or fetch
//               organizationId: decodedToken.organizationId,
//               createdAt: new Date(), // Default or fetch
//               updatedAt: new Date(), // Default or fetch
//             };

//             set({
//               user,
//               token: storedToken,
//             });
//           }
//         } catch (error) {
//           console.error("Error decoding the JWT:", error);
//           localStorage.removeItem('auth-storage');
//         }
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

