import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Notice — Auramind",
  description:
    "How Auramind collects, uses, discloses and retains personal data submitted through auramind.cloud, and how to exercise your rights under the Personal Data Protection Act 2010 (Malaysia).",
};

const CONTACT_EMAIL = "info@auramind.cloud";
const LAST_UPDATED = "9 October 2026";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-auramind-secondary pt-[calc(var(--nav-height)+2rem)] pb-[var(--space-section)]">
        <div className="page-shell">
          <article className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-auramind-black/50">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-auramind-black sm:text-4xl">
              Privacy Notice
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-auramind-black/65 sm:text-base">
              This notice explains how Auramind (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;) handles personal data collected through{" "}
              <strong className="font-semibold">auramind.cloud</strong>. It is
              issued under the Personal Data Protection Act 2010
              (&ldquo;PDPA&rdquo;).
            </p>
            <p className="mt-2 text-xs text-auramind-black/45">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="mt-10 space-y-9 text-sm leading-relaxed text-auramind-black/75 sm:text-base">
              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  1. What we collect
                </h2>
                <p className="mt-2">
                  When you submit the project enquiry form we collect: your
                  name, company name, work email address, the project type and
                  engagement options you select, your budget range and expected
                  timeline, and the free-text description you provide.
                </p>
                <p className="mt-2">
                  Our hosting and anti-abuse providers also process limited
                  technical data needed to deliver and protect the site, such as
                  your IP address and browser information.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  2. Why we collect it
                </h2>
                <p className="mt-2">
                  We use your personal data to respond to your enquiry, assess
                  whether and how we can support your project, prepare any
                  follow-up proposal you request, and keep a record of the
                  enquiry for business and compliance purposes.
                </p>
                <p className="mt-2">
                  We rely on your consent, which you give by ticking the
                  acknowledgement on the enquiry form, and on our legitimate
                  business interest in responding to business-to-business
                  enquiries.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  3. Who we share it with
                </h2>
                <p className="mt-2">
                  We do not sell personal data. We share it only with service
                  providers who help us operate the site and handle enquiries,
                  and only to the extent needed:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>
                    Email delivery providers that transmit your enquiry to our
                    team.
                  </li>
                  <li>
                    Cloud hosting and anti-abuse providers that serve the site
                    and verify that a submission is not automated.
                  </li>
                </ul>
                <p className="mt-2">
                  Those providers may process data outside Malaysia. Where that
                  happens we take reasonable steps to ensure the data receives a
                  comparable level of protection.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  4. How long we keep it
                </h2>
                <p className="mt-2">
                  We keep enquiry records only as long as needed for the purpose
                  above and for any applicable legal, accounting or reporting
                  requirement, after which we delete or anonymise them.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  5. Your rights
                </h2>
                <p className="mt-2">
                  Under the PDPA you may request access to the personal data we
                  hold about you, request a correction, withdraw your consent,
                  limit how we process it, or ask us to stop using it for
                  direct marketing. You may also lodge a complaint with the
                  Personal Data Protection Commissioner.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  6. Security
                </h2>
                <p className="mt-2">
                  We apply reasonable technical and organisational measures to
                  protect personal data against loss, misuse and unauthorised
                  access. No method of transmission or storage is completely
                  secure, so we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-auramind-black">
                  7. Contact us
                </h2>
                <p className="mt-2">
                  To exercise any right above, or to ask a question about this
                  notice, contact{" "}
                  <a
                    className="font-medium text-auramind-black underline underline-offset-2"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
