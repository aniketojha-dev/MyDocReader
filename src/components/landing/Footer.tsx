"use client";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} MyDocReader. All rights reserved.
          </p>
          <p className="text-sm font-medium text-slate-600">
            Build By Aniket Ojha
          </p>
        </div>
      </div>
    </footer>
  );
}
