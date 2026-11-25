import Link from "next/link";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { Divider, Eyebrow } from "@/components/ornaments";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/privacy-policy");

export default function PrivacyPolicyPage() {
  return (
    <div className="inner-page legal-page">
      <BreadcrumbsSchema path="/privacy-policy" />
      <div className="shell legal-shell">
        <section className="inner-hero centered">
          <Eyebrow>The keeper of secrets</Eyebrow>
          <h1>
            Privacy
            <br />
            <em>Policy</em>
          </h1>
          <p>
            How Technika &apos;27 collects, uses, and protects your personal
            information.
          </p>
        </section>
        <article className="legal-card parchment-sheet">
          <p className="legal-updated">Last updated: November 26, 2026</p>

          <h2>Introduction</h2>
          <p>
            Technika &apos;27 (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
            is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website and participate in our
            festival events.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>Name and contact information (email, phone number)</li>
            <li>College/institution details and student information</li>
            <li>Account credentials and authentication data</li>
            <li>Festival registration and participation details</li>
            <li>Merchandise preferences and size information</li>
            <li>Messages and communications you send us</li>
          </ul>
          <p>
            We also automatically collect certain information about your device
            and usage patterns:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>IP address and browser information</li>
            <li>Pages visited and time spent on the website</li>
            <li>Referral source and navigation patterns</li>
            <li>Device type, operating system, and unique identifiers</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>Processing your registration and event participation</li>
            <li>Communicating with you about festivals, events, and updates</li>
            <li>Authenticating your account and verifying your identity</li>
            <li>Personalizing your experience on the website</li>
            <li>Processing merchandise orders and shipments</li>
            <li>Responding to your inquiries and support requests</li>
            <li>Analyzing usage patterns to improve our services</li>
            <li>Complying with legal obligations and resolving disputes</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            Our website uses cookies and similar tracking technologies to enhance
            your experience. These may include:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>
              <strong>Essential Cookies:</strong> Required for account
              authentication and session management
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your house assignment,
              theme preferences, and language settings
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how you use
              the website to improve functionality
            </li>
          </ul>
          <p>
            You can control cookie settings through your browser preferences. Note
            that disabling certain cookies may limit your ability to use some
            features of the website.
          </p>

          <h2>Data Sharing and Third Parties</h2>
          <p>
            We do not sell your personal information to third parties. We may
            share your information with:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>
              <strong>Service Providers:</strong> Third-party services that help
              us operate the website (payment processors, email services, analytics
              providers)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect the rights, safety, and property of Technika &apos;27, our
              users, and the public
            </li>
            <li>
              <strong>Event Partners:</strong> Colleges and organizations involved
              in Technika &apos;27 events (for registration purposes only)
            </li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            provide our services and fulfill the purposes outlined in this
            policy. For festival participants, we retain registration data for
            the current and one subsequent festival cycle. You may request
            deletion of your data at any time, subject to legal obligations.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet or electronic storage is completely
            secure. We cannot guarantee absolute security of your information.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have the following rights:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>
              <strong>Access:</strong> Request access to the personal information
              we hold about you
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data
              (subject to certain exceptions)
            </li>
            <li>
              <strong>Opt-out:</strong> Opt out of marketing communications and
              certain data processing activities
            </li>
            <li>
              <strong>Data Portability:</strong> Request a copy of your data in a
              structured, commonly used format
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the
            information provided below.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Technika &apos;27 is intended for college and university students
            (typically 18 years or older). We do not knowingly collect personal
            information from children under 13 years of age. If we become aware
            of such collection, we will take steps to delete the information and
            notify the appropriate parties.
          </p>

          <h2>International Transfers</h2>
          <p>
            Your information may be transferred to, stored in, and processed in
            countries other than your country of residence. These countries may
            have data protection laws that differ from your home country. By
            using our website and providing your information, you consent to such
            transfers.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our practices, technology, legal requirements, and other factors.
            We will notify you of any material changes by posting the updated
            policy on this page with a new &quot;Last updated&quot; date. Your
            continued use of the website following the posting of changes
            constitutes your acceptance of the updated Privacy Policy.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy or our privacy practices, please contact us:
          </p>
          <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
            <li>
              <strong>Email:</strong>{" "}
              <Link href="/contact">Send a message via our contact form</Link>
            </li>
            <li>
              <strong>Address:</strong> Birla Institute of Technology, Patna,
              Bihar 800014, India
            </li>
            <li>
              <strong>Subject Line:</strong> Please include &quot;Privacy
              Inquiry&quot; in your message
            </li>
          </ul>

          <Divider />
          <p className="legal-contact">
            Related: <Link href="/terms-conditions">Terms &amp; Conditions</Link>
          </p>
        </article>
      </div>
    </div>
  );
}
