import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  id: string | null;
  name: string | null;
  email: string | null;
  university: string | null;
  role: "USER" | "OWNER" | "ADMIN";
  isStudentVerified: boolean;
  setUser: (user: { id: string; name: string; email: string; university: string; isStudentVerified: boolean; role?: "USER" | "OWNER" | "ADMIN" }) => void;
  setStudentVerified: (verified: boolean) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(persist((set) => ({
  id: null,
  name: null,
  email: null,
  university: null,
  role: "USER",
  isStudentVerified: false,
  setUser: (user) => set({ ...user, role: user.role ?? "USER" }),
  setStudentVerified: (isStudentVerified) => set({ isStudentVerified }),
  clearUser: () => set({ id: null, name: null, email: null, university: null, role: "USER", isStudentVerified: false }),
}), { name: "jjeopjjeop-user" }));
