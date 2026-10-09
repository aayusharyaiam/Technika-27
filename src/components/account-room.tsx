"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, LogOut, Save, ShieldCheck } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useHouse } from "./house-provider";
import { HouseSelector } from "./house-selector";
import { HouseBanners } from "./house-banners";

export function AccountRoom({ name, email }: { name: string; email: string }) {
  const { house, theme } = useHouse();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const save = async () => {
    setBusy(true); setFeedback("");
    try {
      const client = getSupabase();
      if (!client) throw new Error("The account service is unavailable.");
      const { error } = await client.auth.updateUser({ data: { house } });
      if (error) throw error;
      setFeedback("Your house choice has been saved to your account.");
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Your preference could not be saved. Please try again."); }
    finally { setBusy(false); }
  };
  const logout = async () => {
    setBusy(true);
    const client = getSupabase();
    if (!client) { setBusy(false); return; }
    const { error } = await client.auth.signOut();
    if (error) { setFeedback(error.message); setBusy(false); return; }
    router.replace("/login"); router.refresh();
  };
  return <section className="common-room shell"><div className="common-room-heading"><HouseBanners/><span className="eyebrow"><ShieldCheck size={13}/>Your verified common room</span><h1>Welcome home,<br /><em>{name}.</em></h1><p>{theme.motto}</p><span className="account-email">{email}</span></div><div className="account-parchment parchment-sheet"><span className="notebook-overline">A note from the Sorting Hat</span><h2>Your colours tell <em>your story.</em></h2><p>Switch houses whenever curiosity calls. Save your preference to take your colours with you when you sign in on another device.</p><HouseSelector/><div className="account-actions"><button type="button" className="button button-gold" disabled={busy} onClick={save}><Save size={14}/>{busy ? "Saving…" : "Save my house"}</button><button type="button" className="account-signout" disabled={busy} onClick={logout}><LogOut size={14}/>Sign out</button></div>{feedback && <p className="account-feedback" role="status">{feedback}</p>}</div><Link className="button button-glass" href="/">Return to the festival <ArrowUpRight size={15}/></Link></section>;
}
