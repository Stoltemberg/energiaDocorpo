"use client";

import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";

export function MobileStickyCta({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-plans-cta");
    if (!heroCta) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting);
    });

    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className={`mobile-sticky ${visible ? "is-visible" : ""}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      Conheça nossos planos <ArrowUpRightIcon className="plan-arrow" />
    </a>
  );
}
