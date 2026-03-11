import { BookOpen, Link } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4 py-12"
      suppressHydrationWarning
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center">
              <BookOpen size={20} color="white" />
            </div>
            <span
              className="text-2xl font-bold text-amber-900"
              style={{ fontFamily: "Lora, serif" }}
            >
              Bechne
            </span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
