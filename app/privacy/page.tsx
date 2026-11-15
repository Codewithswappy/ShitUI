import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for ShitUI: no accounts, no tracking cookies, and transparent developer privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavigation />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <header className="mb-10 space-y-2">
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
            Privacy
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Last updated: November 2026 •{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              1. What ShitUI Is
            </h2>
            <p>
              ShitUI (formerly RareUI) is an open-source React component library created and
              maintained by Swapnil Kalambe (@swappy) at{' '}
              <Link href="https://shitui.in" className="text-primary hover:underline">
                https://shitui.in
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              2. Privacy by Default
            </h2>
            <p>
              You do not need to create an account or sign in to browse the site, copy code, or
              install components. We do not use third-party advertising cookies, we do not track you
              across other websites, and we never sell your data to anyone.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              3. Information We Handle
            </h2>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong className="text-foreground font-medium">Sponsorship Details:</strong> When you
                purchase a sponsorship, billing is handled directly by Dodo Payments. We only receive
                the brand name, email address, chosen tier, and active status required to publish your
                logo and link. We never see or store your payment card numbers.
              </li>
              <li>
                <strong className="text-foreground font-medium">Sponsor Brand Assets:</strong> The logo
                and link URL you email us for publication on the site and README.
              </li>
              <li>
                <strong className="text-foreground font-medium">Direct Messages:</strong> Any
                information you share when emailing us directly or messaging on X.
              </li>
              <li>
                <strong className="text-foreground font-medium">Theme Setting:</strong> Your dark or
                light mode preference is stored strictly in your browser&apos;s local storage on your
                device and is never sent to our servers.
              </li>
              <li>
                <strong className="text-foreground font-medium">CLI Installs:</strong> Fetching
                components with the shadcn CLI downloads static registry files from our repository. It
                does not send us any information about your computer, project, or private code.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              4. Third-Party Services
            </h2>
            <p>
              We only use services essential to running the project:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>
                <strong className="text-foreground font-medium">Dodo Payments:</strong> Handles payment
                processing, invoicing, and subscription billing as Merchant of Record.
              </li>
              <li>
                <strong className="text-foreground font-medium">GitHub:</strong> Hosts our open-source
                code, component files, and public issues.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              5. Data Retention & Your Rights
            </h2>
            <p>
              Sponsorship transaction records are retained for accounting and tax compliance. Support
              emails are kept only as long as needed to assist you. You can ask us to review, update,
              or delete any information we hold about you by emailing{' '}
              <a
                href="mailto:useshit.ui@gmail.com"
                className="text-primary hover:underline font-mono"
              >
                useshit.ui@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-2 pt-2">
            <h2 className="text-base font-medium text-foreground tracking-tight">
              6. Contact
            </h2>
            <p>
              If you have any questions about this policy, reach out at{' '}
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
