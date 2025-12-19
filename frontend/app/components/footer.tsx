// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col justify-between min-h-[200px]">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Left */}
          <div className="space-y-6 flex flex-col items-start text-[20px] text-white">
            <h4 className="text-[20px] font-semibold">Follow Us</h4>

            <div className="flex space-x-4">
              <Image src="/images/facebook.png" alt="Facebook" width={40} height={40} />
              <Image src="/images/twitter.png" alt="Twitter" width={40} height={40} />
              <Image src="/images/youtube.png" alt="Youtube" width={40} height={40} />
              <Image src="/images/instagram.png" alt="Instagram" width={40} height={40} />
            </div>
          </div>

          {/* Middle - Nav Links */}
          <div className="flex flex-col items-center justify-center space-y-6 relative">
            <div className="grid grid-cols-2 gap-4 text-[20px] text-white">
              <Link href="/" className="hover:text-[#EB7A2E] transition">About Us</Link>
              <Link href="/helpers" className="hover:text-[#EB7A2E] transition">Our Helpers</Link>

              {/* Middle Divider (only on md+) */}
              <div className="hidden md:block absolute left-1/2 top-0 h-full w-[1px]">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"></div>
              </div>

              <Link href="/services" className="hover:text-[#EB7A2E] transition">Services</Link>
            </div>
          </div>

          {/* Right - Logo + Email */}
          <div className="flex flex-col items-center md:items-end space-y-6">
            <Image src="/images/logo.png" alt="Logo" width={80} height={80} />

            <div className="text-center md:text-right">
              <p className="text-white text-[20px]">Email: info@servenow.com</p>
            </div>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-white text-sm">
          © {new Date().getFullYear()} ServeNow pvt. Ltd. All rights reserved | Powered by ServeNow.in
        </div>
      </div>
    </footer>
  );
}
