import Link from "next/link";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { Divider, Eyebrow } from "@/components/ornaments";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/terms-conditions");

export default function TermsConditionsPage() {
  return (
    <div className="inner-page legal-page">
      <BreadcrumbsSchema path="/terms-conditions" />
      <div className="shell legal-shell">
        <section className="inner-hero centered">
          <Eyebrow>The binding scroll</Eyebrow>
          <h1>
            Terms &amp;
            <br />
            <em>Conditions</em>
          </h1>
          <p>
            The rules of engagement for all wizards and witches entering the
            halls of Technika &apos;27.
          </p>
        </section>
        <article className="legal-card parchment-sheet">
          <p className="legal-updated">Last updated: October 25, 2026</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the Technika &apos;27 website and
            participating in the festival, you agree to be bound by these Terms
            and Conditions. If you do not agree with any part of these terms,
            please do not use the website or participate in the event.
          </p>

          <h2>Festival Participation</h2>
          <p>
            Participation in Technika &apos;27 events, competitions, and
            activities is subject to the specific rules and guidelines
            established for each event. Participants must comply with all
            applicable rules, follow the instructions of event organizers, and
            conduct themselves in a respectful manner.
          </p>

          <h2>Registration &amp; Accounts</h2>
          <p>
            When creating an account, you agree to provide accurate and complete
            information. You are responsible for maintaining the confidentiality
            of your account credentials and for all activities that occur under
            your account. The organizing team reserves the right to suspend or
            terminate accounts that violate these terms.
          </p>

          <h2>Code of Conduct</h2>
          <p>
            All participants, attendees, and visitors are expected to maintain
            respectful and professional behavior. Harassment, discrimination, or
            any form of misconduct will not be tolerated. The organizing
            committee reserves the right to remove any individual who violates
            the code of conduct without refund.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            images, is the property of Technika &apos;27 and BIT Patna or their
            respective owners. Unauthorized use, reproduction, or distribution
            of this content is prohibited without prior written consent.
          </p>

          <h2>Photography &amp; Media</h2>
          <p>
            By participating in Technika &apos;27, you consent to being
            photographed, filmed, or recorded. These materials may be used for
            promotional purposes, social media, and documentation of the event.
            If you have concerns, please contact the organizing team.
          </p>

          <h2>Liability &amp; Disclaimer</h2>
          <p>
            Technika &apos;27 and BIT Patna are not responsible for any personal
            injury, loss, or damage to property during the festival. Attendees
            participate at their own risk. The organizing committee makes no
            warranties regarding the accuracy or completeness of information on
            this website.
          </p>

          <h2>Refund Policy</h2>
          <p>
            Registration fees and payments are generally non-refundable unless
            otherwise specified. In exceptional circumstances, refund requests
            may be considered on a case-by-case basis at the discretion of the
            organizing committee.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            The organizing committee reserves the right to modify these Terms
            and Conditions at any time. Changes will be posted on this page with
            an updated revision date. Continued use of the website or
            participation in the festival constitutes acceptance of the modified
            terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of India. Any disputes arising from these
            terms shall be subject to the exclusive jurisdiction of the courts
            in Bihar, India.
          </p>

          <Divider />
          <p className="legal-contact">
            Questions about these terms?{" "}
            <Link href="/contact">Send an owl to the Technika team.</Link>
          </p>
        </article>
      </div>
    </div>
  );
}
