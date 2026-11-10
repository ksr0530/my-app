"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Approval = {
  name: string;
  email: string;
  restaurantName: string;
  businessNumber: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

const statusCopy = {
  PENDING: { label: "승인 대기 중", className: "owner-status-pending", message: "관리자 검토 후 3일 이내에 승인 결과를 안내해드릴게요." },
  APPROVED: { label: "승인 완료", className: "owner-status-approved", message: "회원가입 승인이 완료되었습니다. 이제 사장님 기능을 이용할 수 있어요." },
  REJECTED: { label: "승인 반려", className: "owner-status-rejected", message: "가입 정보를 다시 확인한 후 관리자 안내에 따라 수정해주세요." },
};

export default function OwnerStatusPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [approval, setApproval] = useState<Approval | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryName = params.get("name") ?? "";
    const queryEmail = params.get("email") ?? "";
    setName(queryName);
    setEmail(queryEmail);
    if (queryName && queryEmail) void lookup(queryName, queryEmail);
  }, []);

  async function lookup(targetName = name, targetEmail = email) {
    if (!targetName.trim() || !targetEmail.trim()) {
      setMessage("이름과 이메일을 입력해주세요.");
      setApproval(null);
      return;
    }
    setLoading(true);
    setMessage("");
    const response = await fetch(`/api/owner/status?name=${encodeURIComponent(targetName.trim())}&email=${encodeURIComponent(targetEmail.trim())}`);
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setApproval(null);
      setMessage(data.message ?? "승인 결과를 찾을 수 없습니다.");
      return;
    }
    setApproval(data.application);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup();
  }

  const copy = approval ? statusCopy[approval.status] : null;

  return (
    <section className="page page-pad owner-status-page">
      <header className="subpage-header">
        <Link href="/login" aria-label="로그인으로 돌아가기">‹</Link>
        <h1>회원가입 승인 결과 조회</h1>
        <span />
      </header>

      <p className="owner-status-intro">가입 요청 시 입력한 이름과 이메일로 승인 결과를 확인해주세요.</p>
      <form className="owner-status-form" onSubmit={submit}>
        <label>이름<input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름" /></label>
        <label>이메일<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일" /></label>
        <button className="primary-wide" disabled={loading}>{loading ? "조회 중..." : "조회"}</button>
      </form>

      <section className="owner-result-panel" aria-live="polite">
        <h2>승인 결과</h2>
        {!approval && !message && <p className="owner-result-empty">조회 버튼을 누르면 승인 결과가 표시됩니다.</p>}
        {!approval && message && <p className="form-message">{message}</p>}
        {approval && copy && (
          <article className="owner-result-card">
            <div className={`owner-status-badge ${copy.className}`}>{copy.label}</div>
            <dl>
              <div><dt>이름</dt><dd>{approval.name}</dd></div>
              <div><dt>이메일</dt><dd>{approval.email}</dd></div>
              <div><dt>식당명</dt><dd>{approval.restaurantName}</dd></div>
              <div><dt>신청일</dt><dd>{new Date(approval.createdAt).toLocaleDateString("ko-KR")}</dd></div>
              {approval.reviewedAt && <div><dt>처리일</dt><dd>{new Date(approval.reviewedAt).toLocaleDateString("ko-KR")}</dd></div>}
            </dl>
            <p className="owner-result-message">{copy.message}</p>
            {approval.status === "REJECTED" && approval.rejectReason && <p className="owner-reject-reason">반려 사유: {approval.rejectReason}</p>}
            {approval.status === "APPROVED" && <Link className="primary-wide owner-result-link" href="/owner/mypage">사장님 페이지로 이동</Link>}
          </article>
        )}
      </section>
    </section>
  );
}
