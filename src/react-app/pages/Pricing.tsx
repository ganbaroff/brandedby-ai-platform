import React from "react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-4">Pricing</h1>
        <p className="mb-6 text-gray-600">Flexible pricing for everyone. Start free and upgrade as you grow.</p>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="text-gray-500">Starter tier — limited credits</p>
          </div>
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-xl font-semibold">Pro</h2>
            <p className="text-gray-500">Most popular — monthly subscription</p>
          </div>
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-xl font-semibold">Enterprise</h2>
            <p className="text-gray-500">Custom plans for teams</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
