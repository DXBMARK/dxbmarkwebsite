"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

/**
 * PaymentTrustStrip
 *
 * Compact inline trust element embedded in the footer floor.
 * Sits between the main footer columns and the bottom social/copyright bar.
 * No heavy card frame — blends naturally with the footer background.
 *
 * Design tokens: DXBMARK globals.css
 * All SVGs: /public/assets/payment/
 */

const paymentMethods = [
  {
    name: "Visa",
    src: "/assets/payment/visa.svg",
    className: "payment-method-logo--visa",
  },
  {
    name: "Mastercard",
    src: "/assets/payment/mastercard.svg",
    className: "payment-method-logo--mastercard",
  },
  {
    name: "Apple Pay",
    src: "/assets/payment/apple-pay.svg",
    className: "payment-method-logo--apple-pay",
  },
  {
    name: "Google Pay",
    src: "/assets/payment/google-pay.svg",
    className: "payment-method-logo--google-pay",
  },
  {
    name: "Link",
    src: "/assets/payment/link-stripe.svg",
    className: "payment-method-logo--link",
  },
];

export function PaymentTrustStrip() {
  return (
    <section
      className="footer-payment-strip"
      aria-label="Payment security and accepted payment methods"
    >
      <div className="footer-payment-inner">

        {/* Headline: shield + text + separator + Stripe logo */}
        <div className="footer-payment-heading">
          <ShieldCheck className="footer-payment-shield" aria-hidden="true" />
          <span>Safe &amp; secure payments, Powered by</span>
          <span className="footer-payment-sep" aria-hidden="true">|</span>
          <Image
            src="/assets/payment/stripe.svg"
            alt="Stripe"
            width={52}
            height={22}
            className="footer-payment-stripe-logo"
          />
        </div>

        {/* Extended security note */}
        <p className="footer-payment-note">
          DXBMARK does not store full card numbers or CVV details. Payments are processed securely through trusted providers including Stripe.
        </p>

        {/* Accepted Payment Methods label */}
        <p className="footer-payment-methods-label" aria-hidden="true">
          Accepted Payment Methods
        </p>

        {/* Payment method pills */}
        <div
          className="footer-payment-methods"
          aria-label="Accepted payment methods"
        >
          {paymentMethods.map((method) => (
            <span className="payment-method-pill" key={method.name}>
              <Image
                src={method.src}
                alt={method.name}
                width={80}
                height={28}
                className={`payment-method-logo ${method.className}`}
              />
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
