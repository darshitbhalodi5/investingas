"use client";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
