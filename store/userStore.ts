import { create } from "zustand";

type UserState = {
  name: string | null;
  isStudentVerified: boolean;

  setUser: (name: string, isStudentVerified: boolean) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  // 처음에는 로그인한 사용자 정보가 없어요.
  name: null,
  isStudentVerified: false,

  // 로그인 후 사용자 정보를 저장해요.
  setUser: (name, isStudentVerified) =>
    set({ name, isStudentVerified }),

  // 로그아웃하면 사용자 정보를 비워요.
  clearUser: () =>
    set({
      name: null,
      isStudentVerified: false,
    }),
}));
