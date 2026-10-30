import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = text(body.name, 80);
    const email = text(body.email, 254).toLowerCase();
    const topic = text(body.topic, 40) || "general";
    const message = text(body.message, 4000);
    const company = text(body.company, 120);

    if (company) return NextResponse.json({ message: "Your message has been received." });
    if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ message: "Please complete your name, email, and message before sending." }, { status: 400 });
    }

    const webhook = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (webhook) {
      const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, topic, message, source: "website", createdAt: new Date().toISOString() }), cache: "no-store" });
      if (!response.ok) throw new Error("The contact delivery service rejected the message.");
    } else {
      const supabase = await getServerSupabase();
      if (!supabase) return NextResponse.json({ message: "The Owlery is not configured yet. Please email the festival team directly." }, { status: 503 });
      const { error } = await supabase.from("contact_messages").insert({ name, email, topic, message, source: "website" });
      if (error) return NextResponse.json({ message: "The contact inbox is not configured yet. Apply the contact_messages migration or set CONTACT_FORM_WEBHOOK_URL." }, { status: 503 });
    }

    return NextResponse.json({ message: "Your message is on its way. The Technika team will reply as soon as an owl returns." });
  } catch {
    return NextResponse.json({ message: "The owlery is momentarily unavailable. Please try again in a little while." }, { status: 500 });
  }
}
