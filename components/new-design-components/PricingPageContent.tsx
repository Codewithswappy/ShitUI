'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PricingCard,
  BillingCycleToggle,
} from '@/components/new-design-components/SponsorPricing';
import {
  PRICING_TIERS,
  SPONSOR_LINK,
  getSponsorUrl,
  type BillingCycle,
} from '@/components/new-design-components/sponsors-data';
import { useCurrency } from '@/lib/currency';
import { CurrencySelector } from '@/components/new-design-components/CurrencySelector';
import { IconBrandX } from '@tabler/icons-react';

export function PricingPageContent() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const currency = useCurrency();

  const liteTier = PRICING_TIERS.find((t) => t.id === 'lite') || PRICING_TIERS[0];
  const coreTier = PRICING_TIERS.find((t) => t.id === 'core') || PRICING_TIERS[1];
  const maxTier = PRICING_TIERS.find((t) => t.id === 'max') || PRICING_TIERS[2];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading & Sub Heading + Billing & Currency Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div className="flex max-w-2xl flex-col space-y-2 text-left">
          <h1 className="text-xl font-medium tracking-tight text-foreground leading-snug sm:text-2xl">
            Sponsorship Tiers & Details. <br />
            Transparent Pricing. Real Visibility.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Put your brand in front of thousands of active front-end builders and support independent open-source craft. Simple English, no hidden catches.
          </p>
        </div>

        {/* Monthly vs. Yearly Toggle & Local Currency Selector */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          <BillingCycleToggle cycle={cycle} onChange={setCycle} />
          <CurrencySelector
            currencyCode={currency.currencyCode}
            onChange={currency.changeCurrency}
          />
        </div>
      </div>

      {/* =================================================================== */}
      {/* TIER 1: LITE SPONSORSHIP                                            */}
      {/* =================================================================== */}
      <section className="py-10 sm:py-14 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Lite Pricing Card */}
          <div className="lg:col-span-5 w-full max-w-[340px] sm:max-w-[360px] mx-auto lg:mx-0 shrink-0">
            <PricingCard tier={liteTier} cycle={cycle} currencyState={currency} />
          </div>

          {/* Right: Pure Text Only */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground/80">
                Tier 01 — Lite
              </span>
              <h2 className="text-lg sm:text-xl font-medium tracking-tight text-foreground mt-1">
                Lightweight Support for Creators & Indie Makers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                The Lite tier is designed for solo founders, small projects, and passionate developers who want verified visibility on GitHub and in our directory without a huge marketing budget.
              </p>
            </div>

            {/* Pure Text Explanations */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Logo in the GitHub README
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Your logo and a direct link to your website will be added to the official ShitUI GitHub repository README. Every developer who stars, forks, or clones the repository sees your brand right in the repo.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Listed on the Sponsors Page with a Backlink
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  A permanent listing on our dedicated <Link href="/sponsors" className="text-primary hover:underline">/sponsors</Link> directory page. This gives your website direct referral traffic and a strong backlink from an active developer domain.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Name in the Release Notes
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Every time we release new components or publish a major update, your name or project is highlighted in our public changelog as an official backer of the library.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* TIER 2: CORE SPONSORSHIP (MOST POPULAR)                             */}
      {/* =================================================================== */}
      <section className="py-10 sm:py-14 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Core Pricing Card */}
          <div className="lg:col-span-5 w-full max-w-[340px] sm:max-w-[360px] mx-auto lg:mx-0 shrink-0">
            <PricingCard tier={coreTier} cycle={cycle} currencyState={currency} />
          </div>

          {/* Right: Pure Text Only */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-primary">
                Tier 02 — Core
              </span>
              <h2 className="text-lg sm:text-xl font-medium tracking-tight text-foreground mt-1">
                Direct Homepage & Documentation Exposure
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                Our most popular tier. Perfect for growing SaaS products, developer tools, and design studios seeking consistent, high-intent traffic from front-end engineers building real production apps.
              </p>
            </div>

            {/* Pure Text Explanations */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Logo on the Home Page & Sponsors Page
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Your official brand logo, name, and verified link are displayed on the ShitUI homepage bento grid and sponsors directory. This puts you directly in front of thousands of monthly visitors the moment they land on the site.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Logo on Documentation (Docs)
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Your brand is featured inside our documentation sidebar and preview stages across all component pages. Developers spend most of their time here copying code and testing interactive components.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Larger Logo in the GitHub README
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  An upgraded, prominent brand card in the GitHub README file. Stays visible to developers, open-source contributors, and teams reviewing our code.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Dedicated Shoutout on X (@heyyswap)
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  We post a personalized shoutout on X introducing your tool or company to thousands of active designers, engineers, and tech founders.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Your Issues & Requests Answered First
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Whenever you need a bug fixed, a component adjusted, or advice on integrating ShitUI into your stack, your GitHub issues and messages receive top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* TIER 3: MAX SPONSORSHIP                                             */}
      {/* =================================================================== */}
      <section className="py-10 sm:py-14 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Max Pricing Card */}
          <div className="lg:col-span-5 w-full max-w-[340px] sm:max-w-[360px] mx-auto lg:mx-0 shrink-0">
            <PricingCard tier={maxTier} cycle={cycle} currencyState={currency} />
          </div>

          {/* Right: Pure Text Only */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground/80">
                Tier 03 — Max
              </span>
              <h2 className="text-lg sm:text-xl font-medium tracking-tight text-foreground mt-1">
                Hero Placement, Custom Engineering & Social Partnership
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                The ultimate tier for established brands and developer platforms who want premier visibility across the entire site, bespoke React components created specifically for their needs, and active social backing.
              </p>
            </div>

            {/* Pure Text Explanations */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Largest Logo on Home Page, Docs & Sponsors Page
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Enjoy double-sized hero placement across all pages. Your logo is the very first brand every developer and tech leader sees when opening ShitUI.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Your Top Feature Request Gets Built First
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  Need a custom interactive animation, a complex navigation bar, or a specialized Tailwind UI element for your own web application? Tell us what you need and we build it for you with first priority.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Shoutout on Both X and LinkedIn
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  We share in-depth announcements across both X and LinkedIn highlighting your product, value proposition, and tech features to founders, CTOs, and developers.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Follow on X (@heyyswap)
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  We follow your official account or personal profile back on X, actively engaging with your updates, announcements, and product milestones.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  Direct Line for Feedback and Requests
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  A direct 1-on-1 communication channel with the creator via private messaging and email. No ticketing delays — fast advice, quick feedback, and dedicated collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* BILLING DISCLOSURE, GUARANTEE & REFUND POLICY NOTICE                */}
      {/* =================================================================== */}
      <div className="mt-10 pt-6 border-t border-border/40 text-left text-xs text-muted-foreground/85 leading-relaxed">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>
            Billed {cycle === 'monthly' ? 'monthly' : 'annually'} in USD until you cancel.
          </span>
          <span>Payments by</span>
          <a
            href="https://dodopayments.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://app.dodopayments.com/favicon.ico"
              alt="Dodo Payments"
              className="w-3.5 h-3.5 shrink-0 rounded-xs inline-block"
            />
            <span>Dodo Payments</span>
          </a>
          <span>(our merchant of record).</span>
          <Link
            href="/terms#cancellation-and-refund-policy"
            className="text-primary hover:underline font-medium"
          >
            Cancellation and refunds
          </Link>
        </p>
      </div>

      {/* =================================================================== */}
      {/* FOOTER CONTACT & INQUIRIES                                         */}
      {/* =================================================================== */}
      <section className="mt-12 sm:mt-16 pt-8 border-t border-border/40 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-xl">
            <h4 className="text-sm font-medium text-foreground">
              Have questions or need custom arrangements?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We support custom invoicing, annual commitments with discounts, and custom engineering partnerships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://x.com/heyyswap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs hover:opacity-90 transition-opacity"
            >
              <IconBrandX className="h-3.5 w-3.5" />
              <span>Message on X</span>
            </a>

            <a
              href={getSponsorUrl(SPONSOR_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow-pill-glow hover:opacity-95 transition-opacity"
            >
              <span>GitHub Sponsors →</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
