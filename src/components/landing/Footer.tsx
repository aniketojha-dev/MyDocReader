"use client";

export function Footer() {
  return (
    <footer className="border-t border-[#e5ded7] bg-[#faf7f3] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-[#9c9590]">
            &copy; {new Date().getFullYear()} MyDocReader. All rights reserved.
          </p>
          <p className="text-sm font-medium text-[#6b6560]">
            Build By Aniket Ojha
          </p>
        </div>
      </div>
    </footer>
  );
}
