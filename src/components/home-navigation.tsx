"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "@/app/home.module.css";

const links = [["#explore", "探索课程"], ["#method", "学习方式"], ["#about", "关于全民舞"]] as const;

export default function HomeNavigation() {
  const menu = useRef<HTMLDetailsElement>(null);
  function close() { menu.current?.removeAttribute("open"); }
  return <>
    <nav className={styles.desktopNav} aria-label="主导航">
      {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      <span className={styles.demoBadge}>平台演示版</span>
    </nav>
    <details className={styles.mobileMenu} ref={menu} onKeyDown={(event) => { if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); } }}>
      <summary aria-label="打开或关闭导航菜单"><span aria-hidden="true">☰</span></summary>
      <nav aria-label="手机导航" onClick={close}>
        {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        <Link href="/progress">本机学习进度</Link>
        <span className={styles.demoBadge}>平台演示版</span>
      </nav>
    </details>
  </>;
}
