"use client";

import { useEffect, useState } from "react";

// Phone header button: "Get stamped" until the quiz is done, then it takes her back to her visa.
export default function HeaderCta({ className }: { className: string }) {
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    const on = () => setStamped(true);
    window.addEventListener("path:match", on);
    return () => window.removeEventListener("path:match", on);
  }, []);
  return (
    <a href={stamped ? "#visas" : "#quiz"} className={className}>
      {stamped ? "Your visa" : "Get stamped"}
    </a>
  );
}
