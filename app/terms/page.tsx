import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service, usage rights, Dodo Payments billing, and cancellation & refund policy for ShitUI sponsorships.',
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
          {/* 1. Overview */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              1. Overview
            </h2>
            <p>
              ShitUI (accessible at{' '}
              <Link href="https://shitui.in" className="text-primary hover:underline">
                https://shitui.in
              </Link>
              ) is an open-source React component library crafted and maintained by Swapnil Kalambe.
              By accessing the website, copying component code, using the CLI registry, or purchasing a
              sponsorship, you agree to these terms.
            </p>
          </section>

          {/* 2. License & Code Usage */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              2. License & Code Usage
            </h2>
            <p>
              All components in the ShitUI registry are free and open source under the MIT License.
              You are free to use, modify, adapt, and ship them in any project — including commercial
              software, client deliverables, personal projects, and SaaS applications. Once you copy or
              install a component into your project, you own and control that code.
            </p>
            <p>
              You may not scrape, repackage, or resell the raw ShitUI registry as a competing component
              library, paid template kit, or UI registry. The ShitUI brand name, logo, and design
              system are the exclusive intellectual property of Swapnil Kalambe.
            </p>
          </section>

          {/* 3. Sponsorships */}
          <section id="sponsorships" className="space-y-2 scroll-mt-24">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              3. Sponsorship Tiers & Billing Cycles
            </h2>
            <p>
              Sponsorships fund the ongoing creation, hosting, and maintenance of free UI components
              for the developer community. We offer two billing cycles: <strong>Monthly</strong> and{' '}
              <strong>Yearly (with an upfront 20% discount)</strong> across three sponsorship tiers:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong className="text-foreground font-medium">Lite:</strong>{' '}
                <span className="font-mono">$120/mo</span> or{' '}
                <span className="font-mono">$96/mo billed annually ($1,152/yr)</span>. Includes logo
                placement in the GitHub README, listing with a verified backlink on the sponsors page,
                and your name highlighted in release changelogs.
              </li>
              <li>
                <strong className="text-foreground font-medium">Core:</strong>{' '}
                <span className="font-mono">$250/mo</span> or{' '}
                <span className="font-mono">$200/mo billed annually ($2,400/yr)</span>. Includes logo
                on the homepage bento grid and sponsors directory, documentation sidebar presence, a
                larger README logo, and a dedicated shoutout on X.
              </li>
              <li>
                <strong className="text-foreground font-medium">Max:</strong>{' '}
                <span className="font-mono">$399/mo</span> or{' '}
                <span className="font-mono">$319/mo billed annually ($3,828/yr)</span>. Includes premier
                hero logo placement across all pages, priority building for your top feature or component
                request, shoutouts across both X and LinkedIn, a personal follow-back on X, and a direct
                communication channel with the founder.
              </li>
            </ul>
            <p>
              Sponsorship represents an advertising and promotional placement. It does not confer
              equity, governance rights, or ownership of ShitUI.
            </p>
          </section>

          {/* 4. Billing & Dodo Payments */}
          <section id="billing" className="space-y-2 scroll-mt-24">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              4. Payment Processing & Dodo Payments
            </h2>
            <p>
              Payments for all ShitUI sponsorships are securely processed by{' '}
              <strong className="text-foreground font-medium">Dodo Payments Inc.</strong>, our authorized
              Merchant of Record.
            </p>
            <p>
              Dodo Payments handles checkout compliance, local currency conversions, and applicable
              sales tax or VAT calculation. Automated, tax-compliant PDF invoices and receipts are
              delivered to your email immediately upon payment. Each receipt includes a link to your
              self-service customer billing portal to manage payment cards or cancel recurring renewals.
              Active sponsors are price-locked: your rate will never increase for as long as your
              subscription runs without interruption.
            </p>
          </section>

          {/* 5. Asset Delivery */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              5. Asset Delivery & Setup
            </h2>
            <p>
              After checkout, email your logo assets (SVG or high-resolution PNG with light and dark
              mode variants), your destination link, and any tagline to{' '}
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
              . Placements are deployed to the live website and GitHub repository within 24 to 48 hours
              of receiving your assets.
            </p>
          </section>

          {/* 6. Cancellation & Refund Policy */}
          <section id="cancellation-and-refund-policy" className="space-y-2 scroll-mt-24">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              6. Cancellation & Refund Policy
            </h2>
            <p>
              You can cancel your sponsorship subscription at any time. Every receipt email sent by Dodo
              Payments contains a &quot;Manage Subscription&quot; link where you can cancel auto-renewal in
              one click with zero penalty or hassle. Cancelling stops future charges, and your sponsorship
              remains active until the end of your paid billing period.
            </p>
            <p>
              <strong className="text-foreground font-medium">7-Day Money-Back Guarantee:</strong> If you
              are not satisfied with your sponsorship, email us within <strong>7 days of your first payment</strong>,
              and we will issue a 100% full refund through Dodo Payments. Upon refund, your logo and links
              will be removed from the website and repository.
            </p>
            <p>
              <strong className="text-foreground font-medium">Monthly Renewals:</strong> After the initial 7
              days have passed, and on all ongoing monthly renewals, charges are non-refundable because site
              placement, impressions, and backlinks have already been delivered and reserved for that month.
            </p>
            <p>
              <strong className="text-foreground font-medium">Yearly Plans:</strong> Annual plans receive an
              upfront 20% discount in exchange for a 12-month commitment and include substantial upfront
              marketing work. Annual plans are eligible for a 100% refund within the first 7 days of initial
              purchase. After 7 days, annual plans are non-refundable (no pro-rated or partial refunds). When
              you cancel auto-renewal on an annual plan, you retain all sponsorship perks for the full 12
              months you paid for, and it will not renew for year two.
            </p>
            <p>
              <strong className="text-foreground font-medium">How to Request a Refund:</strong> To request a
              refund within the 7-day window, simply email Swapnil at{' '}
              <a
                href="mailto:useshit.ui@gmail.com?subject=Refund%20Request%20-%20ShitUI%20Sponsorship"
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
              </a>{' '}
              with your brand name or invoice number. We will issue the refund in Dodo Payments within 24
              hours, and funds return to your card within 3 to 5 business days.
            </p>
            <p>
              We reserve the right to decline or remove any sponsorship placement (with an immediate full or
              pro-rata refund) if a brand promotes scams, malware, illegal activities, or hate speech.
            </p>
          </section>

          {/* 7. Disclaimer & Limitation of Liability */}
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

          {/* 8. Contact */}
          <section className="space-y-2 pt-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              8. Contact
            </h2>
            <p>
              For any questions, billing help, or sponsorship queries, reach out directly at{' '}
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
