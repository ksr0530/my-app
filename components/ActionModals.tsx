"use client";
import { useState } from "react";
import { useUserStore } from "../store/userStore";

export function ReportModal({ open, targetType, targetId, onClose }: { open: boolean; targetType: "REVIEW" | "COMMUNITY"; targetId: string; onClose: () => void }) {
  const userId = useUserStore((s) => s.id) ?? "demo-user";
  const [reason, setReason] = useState("부적절한 내용");
  const [done, setDone] = useState(false);
  if (!open) return null;
  async function submit() { await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reporterId: userId, targetType, targetId, reason }) }); setDone(true); }
  return <div className="action-modal-backdrop"><div className="action-modal">{done ? <><div className="action-modal-icon">✓</div><h2>신고가 접수되었어요</h2><p>관리자가 내용을 확인한 후 처리할게요.</p><button onClick={onClose} className="primary-action">확인</button></> : <><h2>신고하기</h2><p>신고 사유를 선택해주세요.</p><select value={reason} onChange={(e) => setReason(e.target.value)}><option>부적절한 내용</option><option>광고·홍보성 글</option><option>욕설·비방</option><option>허위 정보</option><option>기타</option></select><div className="modal-actions"><button onClick={onClose}>취소</button><button onClick={submit} className="primary-action">신고하기</button></div></>}</div></div>;
}

export function DeleteModal({ open, label, onClose, onConfirm }: { open: boolean; label: string; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="action-modal-backdrop"><div className="action-modal"><div className="action-modal-icon danger">!</div><h2>{label}을 삭제할까요?</h2><p>삭제한 내용은 다시 복구할 수 없어요.</p><div className="modal-actions"><button onClick={onClose}>취소</button><button onClick={onConfirm} className="danger-action">삭제하기</button></div></div></div>;
}

export function LogoutModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="action-modal-backdrop"><div className="action-modal"><div className="action-modal-icon">↪</div><h2>로그아웃할까요?</h2><p>다음에 다시 로그인할 수 있어요.</p><div className="modal-actions"><button onClick={onClose}>취소</button><button onClick={onConfirm} className="primary-action">로그아웃</button></div></div></div>;
}
