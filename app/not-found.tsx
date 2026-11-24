import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, LayoutDashboard } from "lucide-react";

export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              404 — Page Not Found
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              The requested incident resource or screen could not be located.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/en/app"
              className="w-full py-3 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Go to Command Center · الانتقال إلى مركز القيادة</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
