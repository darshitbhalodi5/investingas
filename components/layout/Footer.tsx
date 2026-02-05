import { Zap } from "lucide-react";

export function Footer() {
    return (
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
    );
}
