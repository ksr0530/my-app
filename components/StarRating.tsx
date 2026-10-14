"use client";

import { useState } from "react";

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClass = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const displayedValue = hovered || value;

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? "img" : "radiogroup"} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => onChange?.(star)}
          className={`${sizeClass[size]} leading-none transition-transform ${readOnly ? "cursor-default" : "hover:scale-110"} ${star <= displayedValue ? "text-slate-900" : "text-slate-300"}`}
          aria-label={`${star}점`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
