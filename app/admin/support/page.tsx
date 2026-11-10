"use client";

import Link from "next/link";

const conversations = [
  { name: "청춘 치킨 사장님", preview: "리뷰 정정 요청을 확인해주세요.", time: "오늘 10:20", unread: true },
  { name: "캠퍼스 김밥 사장님", preview: "식당 소개글을 수정하고 싶습니다.", time: "어제", unread: false },
];

export default function AdminSupportPage() {
  return <section className="page page-pad admin-page"><header className="admin-header"><div><p className="kicker">쩝쩝대 관리센터</p><h1>사장님 상담</h1></div><span>♛ 관리자</span></header><p className="chat-intro">사장님이 보낸 문의와 리뷰 정정 요청을 확인하세요.</p><div className="conversation-list">{conversations.map((conversation) => <button className="conversation-card" key={conversation.name}><span className="owner-icon">♟</span><span className="conversation-copy"><strong>{conversation.name}</strong><small>{conversation.preview}</small></span><span className="conversation-meta">{conversation.time}{conversation.unread && <i>새 문의</i>}</span></button>)}</div><Link href="/admin/owners" className="admin-secondary-link">사장님 가입 승인으로 이동 ›</Link></section>;
}
