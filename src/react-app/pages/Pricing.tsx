import React, { useState } from "react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";

const features = [
  "AI-generated celebrity-quality video",
  "Full HD export",
  "Commercial license",
  "Priority rendering (Pro+)",
  "Team seats and roles (Enterprise)",
];

export default function Pricing(): JSX.Element {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const price = (monthly: number) => (billingCycle === 'monthly' ? `$${monthly}/mo` : `$${monthly * 10}/yr`);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-1">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-600">Choose a plan that fits your needs — from hobby projects to large teams and agencies.</p>

          <div className="mt-6 inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              aria-pressed={billingCycle === 'monthly'}
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>
              Monthly
            </button>
            <button
              aria-pressed={billingCycle === 'yearly'}
              onClick={() => setBillingCycle('yearly')}
              className={`ml-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>
              Yearly (save 2 months)
            </button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="text-sm text-gray-500 mt-1">Great for testing and evaluation</p>

              <div className="mt-6 mb-6">
                <div className="text-3xl font-bold text-gray-900">{billingCycle === 'monthly' ? '$0' : '$0'}</div>
                <div className="text-sm text-gray-500">Includes 5 free credits</div>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>Community support</li>
                <li>Watermarked preview</li>
                <li>Basic templates</li>
              </ul>
            </div>

            <div className="mt-6">
              <a href="/signup" className="block w-full text-center py-2 px-4 rounded-full bg-gray-100 text-gray-800 font-semibold">Get started</a>
            </div>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-white to-indigo-50 border-2 border-indigo-600 rounded-2xl p-6 transform scale-100 md:scale-100">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">Most popular</div>
                <h3 className="text-2xl font-extrabold mt-4">Pro</h3>
                <p className="text-sm text-gray-600 mt-1">For creators & small teams</p>

                <div className="mt-6">
                  <div className="text-4xl font-bold text-gray-900">{price(29)}</div>
                  <div className="text-sm text-gray-500">Up to 50 renders / month</div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  <li>All Free features</li>
                  <li>Faster render queue</li>
                  <li>Commercial license</li>
                  <li>Priority email support</li>
                </ul>
              </div>

              <div className="mt-6">
                <a href="/signup?plan=pro" className="block w-full text-center py-3 rounded-full bg-indigo-600 text-white font-semibold shadow">Choose Pro</a>
              </div>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <p className="text-sm text-gray-500 mt-1">Custom plans for growing teams</p>

              <div className="mt-6 mb-6">
                <div className="text-3xl font-bold text-gray-900">Contact us</div>
                <div className="text-sm text-gray-500">Custom volume pricing</div>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>Dedicated account manager</li>
                <li>SSO & team management</li>
                <li>Service level agreements</li>
              </ul>
            </div>

            <div className="mt-6">
              <a href="/contact" className="block w-full text-center py-2 px-4 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold">Contact sales</a>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold mb-4">What's included</h4>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-sm text-gray-700">
              {features.map((f) => (
                <li key={f} className="flex items-start">
                  <span className="mr-3 text-indigo-600">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold mb-4">Frequently asked questions</h4>
            <div className="space-y-3">
              <details className="p-4 bg-white border rounded-md">
                <summary className="font-medium">Can I change plans later?</summary>
                <div className="mt-2 text-sm text-gray-600">Yes — you can upgrade or downgrade at any time from your account settings. Billing will be prorated when applicable.</div>
              </details>
              <details className="p-4 bg-white border rounded-md">
                <summary className="font-medium">Do you provide invoices?</summary>
                <div className="mt-2 text-sm text-gray-600">Yes. All paid plans include monthly invoices. Enterprise customers can request custom billing.</div>
              </details>
              <details className="p-4 bg-white border rounded-md">
                <summary className="font-medium">Is there a free trial?</summary>
                <div className="mt-2 text-sm text-gray-600">The Free tier comes with a small number of credits that you can use to test rendering and features.</div>
              </details>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
