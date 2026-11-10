"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUserStore } from "../store/userStore";

const initialForm = {
  id: "",
  name: "",
  email: "",
  password: "",
  university: "",
  accountType: "" as "" | "USER" | "OWNER",
  restaurantName: "",
  businessNumber: "",
};

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState(mode === "login" ? { ...initialForm, id: "demo-user", email: "demo@jjupjjupdae.test", password: "demo1234" } : initialForm);
  const [idChecked, setIdChecked] = useState(false);
  const [idMessage, setIdMessage] = useState("");
  const [businessVerified, setBusinessVerified] = useState(false);
  const [businessCertificate, setBusinessCertificate] = useState("");
  const [terms, setTerms] = useState({ service: false, privacy: false });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ownerComplete, setOwnerComplete] = useState(false);

  async function checkId() {
    if (!form.id.trim()) { setIdMessage("아이디를 입력해주세요."); return; }
    const response = await fetch(`/api/auth/check-id?id=${encodeURIComponent(form.id.trim())}`);
    const data = await response.json();
    setIdChecked(Boolean(data.available));
    setIdMessage(data.message);
  }

  function verifyBusinessNumber() {
    if (form.businessNumber.trim().length < 8) {
      setMessage("사업자등록번호를 입력해주세요.");
      return;
    }
    setBusinessVerified(true);
    setMessage("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    if (mode === "signup") {
      if (!form.accountType) { setMessage("계정 유형을 선택해주세요."); setLoading(false); return; }
      if (!idChecked || !terms.service || !terms.privacy) { setMessage("아이디 중복확인과 약관 동의를 완료해주세요."); setLoading(false); return; }
      if (form.accountType === "USER" && !form.university.trim()) { setMessage("대학교를 선택해주세요."); setLoading(false); return; }
      if (form.accountType === "OWNER" && (!form.restaurantName.trim() || !form.businessNumber.trim() || !businessVerified || !businessCertificate)) { setMessage("식당 정보와 사장님 인증을 완료해주세요."); setLoading(false); return; }
    }

    const payload = { ...form, university: form.accountType === "OWNER" ? "" : form.university };
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage(data.message ?? "요청에 실패했습니다."); return; }

    if (mode === "signup" && form.accountType === "OWNER") {
      setOwnerComplete(true);
      return;
    }
    setUser(data.user);
    const destination = data.user?.role === "ADMIN" ? "/admin/owners" : data.user?.role === "OWNER" ? "/owner/mypage" : "/home";
    router.push(destination);
    router.refresh();
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "id") setIdChecked(false);
    if (key === "businessNumber") setBusinessVerified(false);
  }

  return (
    <section className="auth-page page">
      <div className="auth-brand"><Image src="/assets/jjeopjjeop-logo.png" alt="쩝쩝대 로고" width={76} height={76} className="auth-logo" /><p>우리 학교 밥친구</p><h1>쩝쩝대</h1></div>
      <div className="auth-card">
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
        <p className="auth-subtitle">{mode === "login" ? "다시 만나서 반가워요." : "학교 주변 밥친구를 시작해보세요."}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && <label>아이디<div className="input-with-button"><input value={form.id} onChange={(event) => update("id", event.target.value)} placeholder="아이디를 입력하세요" required /><button type="button" onClick={checkId}>중복확인</button></div>{idMessage && <small className={idChecked ? "id-ok" : "id-error"}>{idMessage}</small>}</label>}
          {mode === "signup" && <label>이름<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="이름을 입력하세요" required /></label>}
          {mode === "signup" && <label>계정 유형<select value={form.accountType} onChange={(event) => update("accountType", event.target.value as "" | "USER" | "OWNER")} required><option value="" disabled>계정 유형을 선택해주세요</option><option value="USER">일반 사용자</option><option value="OWNER">식당 사장님</option></select></label>}
          {mode === "signup" && form.accountType === "OWNER" && <>
            <label>식당명<input value={form.restaurantName} onChange={(event) => update("restaurantName", event.target.value)} placeholder="운영 중인 식당명" required /></label>
            <div className="owner-verification-box"><strong>사장님 인증</strong><p>사업자등록번호와 사업자등록증을 등록해주세요.</p><label>사업자등록번호<div className="input-with-button"><input value={form.businessNumber} onChange={(event) => update("businessNumber", event.target.value)} placeholder="000-00-00000" required /><button type="button" onClick={verifyBusinessNumber}>{businessVerified ? "인증완료" : "인증"}</button></div></label><label>사업자등록증<input type="file" accept="image/*,.pdf" onChange={(event) => setBusinessCertificate(event.target.files?.[0]?.name ?? "")} required /><small>{businessCertificate || "파일을 첨부해주세요."}</small></label>{businessVerified && <div className="verification-complete">사업자등록번호 인증이 완료되었습니다.</div>}</div>
          </>}
          <label>{mode === "login" ? "아이디 또는 이메일" : "이메일"}<input type={mode === "login" ? "text" : "email"} value={mode === "login" ? form.id : form.email} onChange={(event) => update(mode === "login" ? "id" : "email", event.target.value)} placeholder={mode === "login" ? "아이디 또는 이메일을 입력하세요" : "이메일을 입력하세요"} required /></label>
          <label>비밀번호<input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="비밀번호를 입력하세요" required /></label>
          {mode === "signup" && form.accountType === "USER" && <label>대학교<input value={form.university} onChange={(event) => update("university", event.target.value)} placeholder="학교명을 입력하세요" required /></label>}
          {mode === "signup" && <div className="terms-box"><label className="check-row"><input type="checkbox" checked={terms.service} onChange={(event) => setTerms({ ...terms, service: event.target.checked })} /><span>이용약관에 동의합니다.</span></label><label className="check-row"><input type="checkbox" checked={terms.privacy} onChange={(event) => setTerms({ ...terms, privacy: event.target.checked })} /><span>개인정보 수집 및 이용에 동의합니다.</span></label></div>}
          {message && <p className="auth-error">{message}</p>}
          <button className="auth-submit" disabled={loading}>{loading ? "처리 중..." : mode === "login" ? "로그인" : form.accountType === "OWNER" ? "가입 요청하기" : "가입하기"}</button>
        </form>
        {mode === "login" && <p className="demo-login-note">일반 시연 계정: <strong>demo-user / demo1234</strong><br />관리자 시연 계정: <strong>admin / admin1234</strong></p>}
        <p className="auth-switch">{mode === "login" ? "아직 회원이 아니신가요?" : "이미 회원이신가요?"} <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "회원가입" : "로그인"}</Link></p>
      </div>
      {ownerComplete && <div className="owner-complete-backdrop"><div className="owner-complete-modal"><div className="verification-icon verified">✓</div><h2>가입 요청이 완료되었습니다!</h2><p>관리자 검토 후 3일 이내에 가입 승인 결과를 안내해드릴게요.</p><div className="confirm-actions"><button type="button" onClick={() => router.push("/login")}>로그인 화면으로 돌아가기</button><button type="button" onClick={() => router.push(`/owner/status?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`)}>승인 결과 조회하기</button></div></div></div>}
    </section>
  );
}
