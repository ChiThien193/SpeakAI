import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
                    <img
                    src={logo}
                    alt="SpeakAI Logo"
                    className="h-14 w-auto object-contain"
                    />
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                    SpeakAI
                    </span>
          </Link>

          <nav className="flex items-center gap-5">
            
            <Link to="/privacy-policy" className="text-sm font-medium text-slate-600 hover:text-blue-800">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Last updated: December 22, 2025
            </p>
          </div>

          <div className="space-y-8 leading-7 text-slate-700">
            <section>
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your use of
                Inflection AI, Inc. (&quot;Inflection AI&quot;, &quot;we&quot;,
                &quot;us&quot;) products and services including our website and
                conversational AIs (&quot;Services&quot;).
              </p>
              <p className="mt-3">
                Your use of the Services in any manner means that you agree to
                the Terms. If you do not agree with these Terms, you may not
                access or use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Our Services
              </h2>
              <p className="mt-3">
                As part of the Services, you may submit text and other materials
                (&quot;Inputs&quot;) to generate conversational outputs and other
                responses (&quot;Outputs&quot;).
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  You may only use our Services in accordance with our
                  Acceptable Use policy.
                </li>
                <li>
                  Outputs may not always be accurate or trustworthy and should be
                  carefully reviewed.
                </li>
                <li>
                  Our Services are not a substitute for medical, legal,
                  financial, or professional advice.
                </li>
                <li>
                  Our Services are not intended for minors under the age of 18.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Registering for Our Services
              </h2>
              <p className="mt-3">
                You must provide complete and accurate registration information,
                maintain the security of your account, and not impersonate
                another person.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Acceptable Use
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>You must use the Services lawfully.</li>
                <li>You may not generate harmful or manipulative content.</li>
                <li>You may not generate hateful, discriminatory, or abusive content.</li>
                <li>You may not infringe the rights of others.</li>
                <li>You may not bypass security or moderation systems.</li>
                <li>You may not reverse engineer or scrape the Services.</li>
                <li>You may not use the Services for mass surveillance or social scoring.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Content</h2>
              <p className="mt-3">
                As between you and Inflection AI, you own your Inputs and Outputs
                (collectively, your &quot;Content&quot;). You grant Inflection AI
                a license to use Content for operating, improving, and developing
                Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Intellectual Property
              </h2>
              <p className="mt-3">
                These Terms do not provide you ownership rights in the Services,
                trademarks, or other intellectual property of Inflection AI.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Limitation of Liability
              </h2>
              <p className="mt-3">
                To the maximum extent permitted by law, Inflection AI will not be
                liable for indirect, incidental, special, exemplary,
                consequential, or punitive damages, or for aggregate direct
                damages exceeding USD $100.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">No Warranties</h2>
              <p className="mt-3">
                The Services are provided on an &quot;as is&quot; and &quot;as
                available&quot; basis without warranties of any kind, whether
                express, implied, or statutory.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Third-Party Services
              </h2>
              <p className="mt-3">
                The Services may provide links or access to third-party services.
                Inflection AI is not responsible for such services or their
                privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Terminating Your Account
              </h2>
              <p className="mt-3">
                Inflection AI may suspend or terminate access to the Services at
                any time and for any reason. You may terminate these Terms by
                closing your account and ceasing use of the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Changes to the Services and Terms
              </h2>
              <p className="mt-3">
                Inflection AI may modify or discontinue the Services and may
                update these Terms from time to time by posting revised Terms and
                updating the last updated date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Dispute Resolution; Binding Arbitration
              </h2>
              <p className="mt-3">
                Most disputes must be resolved through binding arbitration on an
                individual basis, not as a class action, representative
                proceeding, or jury trial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Miscellaneous Terms
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Violations</li>
                <li>Indemnification</li>
                <li>Assignment</li>
                <li>Choice of law</li>
                <li>Jurisdiction and venue</li>
                <li>Waiver</li>
                <li>Severability</li>
                <li>Entire agreement</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}