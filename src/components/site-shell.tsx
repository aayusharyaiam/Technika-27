"use client";

import { usePathname } from "next/navigation";
import { Experience } from "./experience";
import { Footer } from "./footer";
import { Header } from "./header";
import { PageTransition } from "./page-transition";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const landingPage = usePathname() === "/";

  return <Experience skipLoading={landingPage} minimal={landingPage}>
    {!landingPage && <Header />}
    <main id="main-content" tabIndex={-1}><PageTransition minimal={landingPage}>{children}</PageTransition></main>
    {!landingPage && <Footer />}
  </Experience>;
}
