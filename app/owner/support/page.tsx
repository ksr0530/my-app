"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function OwnerSupportPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ from: "admin", text: "안녕하세요. 쩝쩝대 관리자 상담센터입니다.", time: "오늘 10:20" }]);
  function submit(event: FormEvent) { event.preventDefault(); if (!message.trim()) return; setMessages((current) => [...current, { from: "owner", text: message.trim(), time: "방금 전" }]); setMessage(""); }
  return <section className="page page-pad chat-page"><header className="subpage-header"><Link href="/owner/mypage">‹</Link><h1>관리자 상담</h1><span /></header><p className="chat-intro">리뷰 정정 요청이나 식당 정보 변경을 관리자에게 문의하세요.</p><div className="chat-thread">{messages.map((item, index) => <div className={`chat-bubble-row ${item.from}`} key={`${item.time}-${index}`}><div className="chat-bubble"><small>{item.from === "admin" ? "관리자" : "나"} · {item.time}</small><p>{item.text}</p></div></div>)}</div><form className="chat-form" onSubmit={submit}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="문의 내용을 입력해주세요" /><button>전송</button></form></section>;
}
