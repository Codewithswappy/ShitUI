import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for ShitUI: MIT component license, usage rights, and sponsorship billing.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavigation />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <header className="mb-10 space-y-2">
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
            Legal & Terms
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Last updated: November 2026 •{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              1. Overview
            </h2>
            <p>
              ShitUI (accessible at{' '}
              <Link href="https://shitui.in" className="text-primary hover:underline">
                https://shitui.in
              </Link>
              ) is an open-source React component library built and maintained by Swapnil Kalambe.
              By using the website, copying component code, installing components through the CLI,
              or purchasing a sponsorship, you agree to these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              2. License & Code Usage
            </h2>
            <p>
              All components in the ShitUI registry are free and open source under the MIT License.
              You are free to use, modify, and ship them in any project — including commercial
              applications, client work, SaaS products, and closed-source software. Once you copy or
              install a component into your project, you own and control that code.
            </p>
            <p>
              You do not have permission to repackage or redistribute the raw ShitUI registry as a
              competing component library or paid UI kit. The ShitUI brand name, logo, and website
              design belong to Swapnil Kalambe.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              3. Sponsorships
            </h2>
            <p>
              Sponsorships fund the ongoing creation, hosting, and maintenance of free UI components.
              We offer three tiers:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong className="text-foreground font-medium">Lite ($120/mo):</strong> Logo in the
                GitHub README, listing with a link on the sponsors page, and mention in release notes.
              </li>
              <li>
                <strong className="text-foreground font-medium">Core ($250/mo):</strong> Logo on the
                homepage and sponsors page, larger README logo, and social shoutout on X.
              </li>
              <li>
                <strong className="text-foreground font-medium">Max ($399/mo):</strong> Largest logo
                on the homepage, sponsors page, and README, direct channel for feedback and requests,
                and social shoutouts.
              </li>
            </ul>
            <p>
              Sponsorship represents an advertising placement on our site and repository. It does not
              confer equity, influence over library roadmap, custom on-demand engineering, or
              priority consulting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              4. Billing & Dodo Payments
            </h2>
            <p>
              Sponsorship prices are listed in USD and renew automatically each month until cancelled.
              Payments are processed by Dodo Payments, our Merchant of Record, which handles checkout,
              computes any applicable taxes, and emails your invoices. Active sponsors keep their
              original monthly price for as long as their subscription runs without interruption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              5. Asset Delivery
            </h2>
            <p>
              After checkout, email your logo (SVG or high-res PNG with light and dark versions) and
              your destination link to{' '}
              <a
                href="mailto:useshit.ui@gmail.com"
                className="text-primary hover:underline font-mono"
              >
                useshit.ui@gmail.com
              </a>
              . Placements are published on the website and README within 2 to 3 business days of
              receiving your assets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              6. Cancellation & Refunds
            </h2>
            <p>
              You can cancel your subscription at any time using the link in your receipt or by
              emailing{' '}
              <a
                href="mailto:useshit.ui@gmail.com"
                className="text-primary hover:underline font-mono"
              >
                useshit.ui@gmail.com
              </a>
              . Cancelling stops future charges, and your placement remains active until the end of
              the current paid monthly period.
            </p>
            <p>
              If you cancel within 14 days of your initial payment, we will issue a full refund upon
              request. Ongoing monthly renewal payments are non-refundable once the monthly billing
              period has begun and the placement has been delivered.
            </p>
            <p>
              We reserve the right to decline or remove any sponsorship placement (with a pro-rata
              refund) if the brand promotes malware, scams, illegal activity, or hateful content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              7. Disclaimer & Limitation of Liability
            </h2>
            <p>
              ShitUI components and website are provided &quot;as is&quot;, without warranty of any
              kind. You are responsible for auditing and testing components within your own codebase.
              Our total liability for any claim related to the site or a sponsorship is limited to the
              amount you paid us in the previous 12 months, or zero ($0.00 USD) if you only used the
              free components.
            </p>
          </section>

          <section className="space-y-2 pt-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              8. Contact
            </h2>
            <p>
              For any questions, billing help, or sponsorship queries, reach out at{' '}
              <a
                href="mailto:useshit.ui@gmail.com"
                className="text-primary hover:underline font-mono"
              >
                useshit.ui@gmail.com
              </a>{' '}
              or message{' '}
              <a
                href="https://x.com/heyyswap"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                @heyyswap on X
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <NewFooter />
    </div>
  );
}
