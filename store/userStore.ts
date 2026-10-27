import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  id: string | null;
  name: string | null;
  email: string | null;
  university: string | null;
  isStudentVerified: boolean;
  setUser: (user: { id: string; name: string; email: string; university: string; isStudentVerified: boolean }) => void;
  setStudentVerified: (verified: boolean) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(persist((set) => ({
  id: null,
  name: null,
  email: null,
  university: null,
  isStudentVerified: false,
  setUser: (user) => set(user),
  setStudentVerified: (isStudentVerified) => set({ isStudentVerified }),
  clearUser: () => set({ id: null, name: null, email: null, university: null, isStudentVerified: false }),
}), { name: "jjeopjjeop-user" }));
