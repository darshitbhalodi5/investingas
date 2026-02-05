import { Zap } from "lucide-react";
import { Typography } from "@/components/ui/Typography";

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12 bg-black/50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <Typography variant="bodyLarge" className="font-bold">InvestingAs</Typography>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition"><Typography variant="bodySmall">Docs</Typography></a>
                        <a href="#" className="hover:text-white transition"><Typography variant="bodySmall">GitHub</Typography></a>
                        <a href="#" className="hover:text-white transition"><Typography variant="bodySmall">Twitter</Typography></a>
                        <a href="#" className="hover:text-white transition"><Typography variant="bodySmall">Discord</Typography></a>
                    </div>
                    <Typography variant="bodySmall" className="text-white/30">
                        © 2026 InvestingAs. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
}
