"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUserStore } from "../store/userStore";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({ id: mode === "login" ? "demo-user" : "", name: "", email: mode === "login" ? "demo@jjupjjupdae.test" : "", password: mode === "login" ? "demo1234" : "", university: "" });
  const [idChecked, setIdChecked] = useState(false);
  const [idMessage, setIdMessage] = useState("");
  const [terms, setTerms] = useState({ service: false, privacy: false });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkId() {
    if (!form.id.trim()) { setIdMessage("아이디를 입력해주세요."); return; }
    const response = await fetch(`/api/auth/check-id?id=${encodeURIComponent(form.id.trim())}`);
    const data = await response.json(); setIdChecked(Boolean(data.available)); setIdMessage(data.message);
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    if (mode === "signup" && (!idChecked || !terms.service || !terms.privacy)) { setMessage("아이디 중복확인과 약관 동의를 완료해주세요."); setLoading(false); return; }
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) { setMessage(data.message ?? "요청에 실패했습니다."); return; }
    setUser(data.user); router.push("/home"); router.refresh();
  }

  return <section className="auth-page page">
    <div className="auth-brand"><Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대 로고" width={76} height={76} className="auth-logo" /><p>우리 학교 밥친구</p><h1>쩝쩝대</h1></div>
    <div className="auth-card"><h2>{mode === "login" ? "로그인" : "회원가입"}</h2><p className="auth-subtitle">{mode === "login" ? "다시 만나서 반가워요." : "학교 주변 밥친구를 시작해보세요."}</p>
      <form onSubmit={submit} className="auth-form">
        {mode === "signup" && <label>아이디<div className="input-with-button"><input value={form.id} onChange={(e) => { setForm({ ...form, id: e.target.value }); setIdChecked(false); }} placeholder="아이디를 입력하세요" required /><button type="button" onClick={checkId}>중복확인</button></div>{idMessage && <small className={idChecked ? "id-ok" : "id-error"}>{idMessage}</small>}</label>}
        {mode === "signup" && <label>이름<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="이름을 입력하세요" required /></label>}
        <label>{mode === "login" ? "아이디 또는 이메일" : "이메일"}<input type={mode === "login" ? "text" : "email"} value={mode === "login" ? form.id : form.email} onChange={(e) => setForm({ ...form, ...(mode === "login" ? { id: e.target.value, email: e.target.value.includes("@") ? e.target.value : form.email } : { email: e.target.value }) })} placeholder={mode === "login" ? "아이디 또는 이메일을 입력하세요" : "이메일을 입력하세요"} required /></label>
        <label>비밀번호<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="비밀번호를 입력하세요" required /></label>
        {mode === "signup" && <label>학교<input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} placeholder="학교명을 입력하세요" required /></label>}
        {mode === "signup" && <div className="terms-box"><label className="check-row"><input type="checkbox" checked={terms.service} onChange={(e) => setTerms({ ...terms, service: e.target.checked })} /><span>이용약관에 동의합니다.</span></label><label className="check-row"><input type="checkbox" checked={terms.privacy} onChange={(e) => setTerms({ ...terms, privacy: e.target.checked })} /><span>개인정보 수집 및 이용에 동의합니다.</span></label></div>}
        {message && <p className="auth-error">{message}</p>}
        <button className="auth-submit" disabled={loading}>{loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}</button>
      </form>
      {mode === "login" && <p className="demo-login-note">발표용 계정: <strong>demo-user / demo1234</strong></p>}
      <p className="auth-switch">{mode === "login" ? "아직 회원이 아니신가요?" : "이미 회원이신가요?"} <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "회원가입" : "로그인"}</Link></p>
    </div>
  </section>;
}
