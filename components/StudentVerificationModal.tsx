"use client";

import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function StudentVerificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const verified = useUserStore((state) => state.isStudentVerified);
  const userId = useUserStore((state) => state.id);
  const setStudentVerified = useUserStore((state) => state.setStudentVerified);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  if (!open) return null;

  async function completeDemoVerification() {
    setSaving(true);
    setMessage("");
    if (userId) {
      try {
        const response = await fetch("/api/auth/verify-student", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
        if (!response.ok) {
          const data = await response.json().catch(() => null) as { message?: string } | null;
          setMessage(data?.message ?? "인증 상태를 저장하지 못했습니다.");
          setSaving(false);
          return;
        }
      } catch {
        setMessage("서버 연결을 확인해주세요.");
        setSaving(false);
        return;
      }
    }
    setStudentVerified(true);
    setSaving(false);
    onClose();
  }

  return <div className="verification-backdrop" role="presentation" onClick={onClose}><div className="verification-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button type="button" className="verification-close" onClick={onClose}>×</button><div className={`verification-icon ${verified ? "verified" : ""}`}>{verified ? "✓" : "✦"}</div><h2>재학생 인증</h2>{verified ? <><p>재학생 인증이 완료된 계정이에요.</p><div className="verification-complete">✓ 인증 완료</div></> : <><p>재학생 인증을 완료한 사용자만 리뷰를 작성할 수 있어요.</p>{message && <p className="review-form-message">{message}</p>}<button type="button" className="verification-button" onClick={completeDemoVerification} disabled={saving}>{saving ? "저장 중..." : "인증하기"}</button></>}</div></div>;
}
