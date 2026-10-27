"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUserStore } from "../store/userStore";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({ name: "", email: "", password: "", university: "부천대학교" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage(data.message ?? "요청에 실패했습니다."); return; }
    setUser(data.user); router.push("/"); router.refresh();
  }

  return <section className="auth-page page">
    <div className="auth-brand"><span className="auth-mark">쩝</span><p>우리 학교 밥친구</p><h1>쩝쩝대</h1></div>
    <div className="auth-card"><h2>{mode === "login" ? "로그인" : "회원가입"}</h2><p className="auth-subtitle">{mode === "login" ? "다시 만나서 반가워요." : "부천대 밥친구를 시작해보세요."}</p>
      <form onSubmit={submit} className="auth-form">
        {mode === "signup" && <label>이름<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="이름을 입력하세요" required /></label>}
        <label>이메일<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="이메일을 입력하세요" required /></label>
        <label>비밀번호<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="비밀번호를 입력하세요" required /></label>
        {mode === "signup" && <label>학교<input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} required /></label>}
        {message && <p className="auth-error">{message}</p>}
        <button className="auth-submit" disabled={loading}>{loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}</button>
      </form>
      <p className="auth-switch">{mode === "login" ? "아직 회원이 아니신가요?" : "이미 회원이신가요?"} <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "회원가입" : "로그인"}</Link></p>
    </div>
  </section>;
}
