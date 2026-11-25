"use client";

import { useState } from "react";
import { Mail, Send, AlertCircle, CheckCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.category) {
      setError("Please select an enquiry category");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Please enter your message");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setState("submitting");

    try {
      const client = getSupabase();
      if (!client) throw new Error("Supabase client not available");

      const { error: insertError } = await client
        .from("contact_submissions")
        .insert({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          message: formData.message,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      setState("success");
      setFormData({ name: "", email: "", category: "", message: "" });

      // Reset success state after 4 seconds
      setTimeout(() => setState("idle"), 4000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
      setState("error");
    }
  };

  return (
    <form
      className="contact-form parchment-sheet"
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
    >
      <div className="form-heading">
        <Mail size={24} strokeWidth={1} aria-hidden="true" />
        <h2 id="contact-form-title">Send us an owl</h2>
        <p>We read every message and will respond via email.</p>
      </div>

      {error && (
        <div className="form-message error-message" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {state === "success" && (
        <div className="form-message success-message" role="status">
          <CheckCircle size={16} />
          <span>Message sent! We&apos;ll be in touch shortly.</span>
        </div>
      )}

      <fieldset disabled={state === "submitting"} className="form-fields">
        <div className="form-field">
          <label htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="As you would sign a letter"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="For our owl post reply"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-category">Enquiry Category</label>
          <select
            id="contact-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">— Choose a category —</option>
            <option value="participation">Event Participation</option>
            <option value="college-delegation">College Delegation</option>
            <option value="partnership">Partnership & Sponsorship</option>
            <option value="visit">Campus Visit</option>
            <option value="other">Other Enquiry</option>
          </select>
        </div>

        <div className="form-field full-field">
          <label htmlFor="contact-message">Your Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what's on your mind..."
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          className="button button-gold"
          disabled={state === "submitting" || state === "success"}
          aria-busy={state === "submitting"}
        >
          {state === "submitting" ? (
            <>Sending...</>
          ) : state === "success" ? (
            <>Message sent ✓</>
          ) : (
            <>
              <Send size={16} /> Send Message
            </>
          )}
        </button>
      </fieldset>

      <p className="form-privacy">
        Your message will be stored securely and used only to respond to your
        enquiry.
      </p>
    </form>
  );
}
