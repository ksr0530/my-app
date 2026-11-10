import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserRole = "USER" | "OWNER" | "ADMIN";
type OwnerApprovalStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

type UserState = {
  id: string | null;
  name: string | null;
  email: string | null;
  university: string | null;
  role: UserRole;
  ownerApprovalStatus: OwnerApprovalStatus;
  isStudentVerified: boolean;
  setUser: (user: { id: string; name: string; email: string; university: string; isStudentVerified: boolean; role?: UserRole; ownerApprovalStatus?: OwnerApprovalStatus }) => void;
  setStudentVerified: (verified: boolean) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      university: null,
      role: "USER",
      ownerApprovalStatus: "NONE",
      isStudentVerified: false,
      setUser: (user) => set({ ...user, role: user.role ?? "USER", ownerApprovalStatus: user.ownerApprovalStatus ?? "NONE" }),
      setStudentVerified: (isStudentVerified) => set({ isStudentVerified }),
      clearUser: () => set({ id: null, name: null, email: null, university: null, role: "USER", ownerApprovalStatus: "NONE", isStudentVerified: false }),
    }),
    { name: "jjeopjjeop-user" },
  ),
);
