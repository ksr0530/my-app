"use client";

import { useUserStore } from "../store/userStore";

export default function StudentVerificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const verified = useUserStore((state) => state.isStudentVerified);
  const setStudentVerified = useUserStore((state) => state.setStudentVerified);
  if (!open) return null;
  function completeDemoVerification() { setStudentVerified(true); onClose(); }
  return <div className="verification-backdrop" role="presentation" onClick={onClose}><div className="verification-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button type="button" className="verification-close" onClick={onClose}>×</button><div className={`verification-icon ${verified ? "verified" : ""}`}>{verified ? "✓" : "✦"}</div><h2>재학생 인증</h2>{verified ? <><p>재학생 인증이 완료된 계정이에요.</p><div className="verification-complete">✓ 인증 완료</div></> : <><p>재학생 인증을 완료한 사용자만 리뷰를 작성할 수 있어요.</p><button type="button" className="verification-button" onClick={completeDemoVerification}>인증하기</button></>}</div></div>;
}
