"use client";

import { Navbar } from "./components/Navbar";
import { GasTicker } from "./components/GasTicker";
import { ArrowRight, Shield, Zap, TrendingDown, Clock, Wallet, BarChart3, ArrowUpRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Gas Price Ticker */}
      <div className="pt-24">
        <GasTicker />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/70">Now live on Ethereum, Base, Arbitrum & Polygon</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Buy Tomorrow&apos;s Gas
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">at Today&apos;s Prices</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Lock in current gas prices for future blockchain transactions.
            Save up to <span className="text-green-400 font-semibold">90%</span> when gas spikes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/buy" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5">
              Start Saving
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.05] text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-16">
            <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">$2.1M</div>
              <div className="text-sm text-white/50">Total Saved</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">12.5K</div>
              <div className="text-sm text-white/50">Users</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-1">98%</div>
              <div className="text-sm text-white/50">Avg Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-3xl p-8 md:p-12 max-w-5xl mx-auto overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                See Your Potential <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Savings</span>
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Gas prices fluctuate wildly. Lock in low prices now and use them when prices spike.
              </p>

              {/* Example Calculation */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-white/60">You lock in at</span>
                  <span className="font-bold text-green-400 text-lg">5 gwei</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-white/60">Gas spikes to</span>
                  <span className="font-bold text-red-400 text-lg">50 gwei</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-white/60">You save</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">$18.50 per tx</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              {/* Visual representation */}
              <div className="aspect-square w-64 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">90%</div>
                  <div className="text-white/60 text-sm tracking-wider uppercase font-medium">Maximum Savings</div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white/[0.05] border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-[bounce_3s_infinite]">
                  <TrendingDown className="w-8 h-8 text-green-400" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white/[0.05] border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-[bounce_4s_infinite]">
                  <Wallet className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">InvestingAs</span>?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            The first decentralized gas futures marketplace built for DeFi users, protocols, and enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-indigo-500/20 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Price Protection</h3>
            <p className="text-white/60 leading-relaxed">
              Lock in today&apos;s gas prices for 7-90 days. Never worry about gas spikes again.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-cyan-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Redemption</h3>
            <p className="text-white/60 leading-relaxed">
              Redeem your credits instantly when gas prices spike. No waiting, no hassle.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-pink-500/20 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Savings</h3>
            <p className="text-white/60 leading-relaxed">
              Beautiful analytics dashboard shows exactly how much you&apos;ve saved over time.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-green-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Flexible Expiry</h3>
            <p className="text-white/60 leading-relaxed">
              Choose expiry from 7 to 90 days. Transfer credits to other users anytime.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent pointer-events-none" />

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Three simple steps to start saving on gas fees
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Buy Gas Credits</h3>
            <p className="text-white/60 leading-relaxed px-4">
              Deposit USDC when gas prices are low. We lock in that price for you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl shadow-purple-500/20">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Wait for Spike</h3>
            <p className="text-white/60 leading-relaxed px-4">
              When gas prices spike due to NFT drops, market volatility, or high demand...
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl shadow-pink-500/20">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Redeem & Save</h3>
            <p className="text-white/60 leading-relaxed px-4">
              Use your credits at the locked-in price. Keep the difference as savings!
            </p>
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-10 md:p-14 rounded-[2rem] text-center">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Supported <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Chains</span>
            </h2>
            <p className="text-white/60">
              Buy credits for any of these networks and redeem across chains
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Ethereum", color: "#627eea" },
              { name: "Base", color: "#0052ff" },
              { name: "Arbitrum", color: "#28a0f0" },
              { name: "Polygon", color: "#8247e5" },
              { name: "Optimism", color: "#ff0420" },
            ].map((chain) => (
              <div
                key={chain.name}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] border border-white/[0.05] hover:bg-white/[0.1] hover:border-white/[0.1] transition-all"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chain.color }}
                />
                <span className="font-medium text-lg">{chain.name}</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Stop <span className="text-red-400">Overpaying</span>?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join thousands of DeFi users who are saving money on gas fees every day.
          </p>
          <Link href="/dashboard/buy" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transform hover:-translate-y-1">
            Get Started Now
            <ArrowUpRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">InvestingAs</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-white transition">Docs</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">Discord</a>
            </div>
            <p className="text-sm text-white/30">
              © 2026 InvestingAs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
