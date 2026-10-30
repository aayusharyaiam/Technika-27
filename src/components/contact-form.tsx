"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "The owl could not carry your message.");
      setState("success");
      setMessage(result.message || "Your message has been sent.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The owl could not carry your message.");
    }
  }

  return <form className="contact-form" onSubmit={submit} aria-busy={state === "sending"}>
    <div className="contact-form-grid">
      <label htmlFor="contact-name">Your name<input id="contact-name" name="name" required maxLength={80} autoComplete="name" placeholder="The name on your letter" /></label>
      <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@your-college.ac.in" /></label>
    </div>
    <label htmlFor="contact-topic">What can we help with?<select id="contact-topic" name="topic" defaultValue="general"><option value="general">General enquiry</option><option value="delegate">College delegation</option><option value="partnership">Partnership or sponsorship</option><option value="alumni">Alumni and community</option><option value="technical">Website or technical issue</option></select></label>
    <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={10} maxLength={4000} rows={6} placeholder="Write your message to the Order of Technika..." /></label>
    <input className="contact-honeypot" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button type="submit" className="button button-gold" disabled={state === "sending"}>{state === "sending" ? <><LoaderCircle size={16} className="spin" />Sending the owl</> : <><Send size={16} />Send your message</>}</button>
    {message && <p className={`contact-form-message ${state === "success" ? "success" : "error"}`} role={state === "success" ? "status" : "alert"}>{state === "success" && <CheckCircle2 size={16} />}{message}</p>}
  </form>;
}
