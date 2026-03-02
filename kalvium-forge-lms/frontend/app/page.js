"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MessageSquare, RefreshCw, Shield } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Interface",
    description:
      "Interact with your LMS using simple conversational commands. No more digging through complex menus.",
  },
  {
    icon: RefreshCw,
    title: "Real-Time Sync",
    description:
      "All your updates are reflected across the platform instantly. Stay aligned with your team and your goals effortlessly.",
  },
  {
    icon: Shield,
    title: "Secure Data",
    description:
      "Enterprise-grade security and encryption to keep your learning data safe and compliant at all times.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="w-full min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="w-full bg-[#F4F7FB]">
        <div className="max-w-5xl mx-auto px-8 pt-28 pb-28 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight text-center mb-6 leading-tight">
            Your Learning,
            <br />
            <span className="text-indigo-600">Supercharged</span> by AI
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage your profile and update records in real-time using our intelligent
            natural language assistant. The next generation of learning management is here.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => router.push("/login")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-8 py-24">
          {/* Left-aligned header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for the Future
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl">
            Experience the next generation of Learning Management Systems powered by
            advanced intelligence and real-time connectivity.
          </p>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[#F4F7FB] rounded-2xl p-8 border border-gray-100/50 hover:shadow-md transition-all"
              >
                {/* Icon badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mt-6 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA Card ── */}
      <section className="w-full bg-white px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0B1120] rounded-3xl p-16 flex flex-col items-center text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your learning experience?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed">
              Join thousands of organizations already accelerating their growth with
              Kalvium Forge&apos;s intelligent platform.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 py-8 px-8 flex justify-between items-center text-sm text-gray-500">
        {/* Left — Brand */}
        <span className="font-semibold text-gray-700">Kalvium Forge</span>

        {/* Center — Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Contact
          </a>
        </div>

        {/* Right — Copyright */}
        <span>© 2026 Kalvium Labs</span>
      </footer>
    </main>
  );
}
