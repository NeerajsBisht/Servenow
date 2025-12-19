"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();    
  const router = useRouter();    

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Navbar links
  const links = [
    { name: "About Us", href: "/" },
  ];

  // 🟢 Handle Profile Button Click
  const handleProfileClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/profiles/${user.id}`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: show ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-8 py-3 max-w-8xl mx-auto">
          
          {/* Left: Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="h-20 w-20 object-contain"
            />
            <span className="sm:text-[30px] text-black font-semibold">
              ServeNow
            </span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center space-x-8">
            
            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 text-black font-medium text-[20px]">
              {links.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-6">

              {/* Helpers Page */}
              <Link
                href="/profiles"
                className="px-6 py-2 rounded-lg bg-[#EB7A2E] text-white sm:text-[20px] hover:bg-orange-600 font-semibold transition"
              >
                Helpers
              </Link>

              {/* 🟢 Profile Button with Picture */}
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition"
              >
                {/* Profile Picture */}
                <Image
                  src={user?.profileImage || "/images/default-user.png"}
                  alt="User"
                  width={34}
                  height={34}
                  className="rounded-full border border-white object-cover"
                />
                <span className="hidden sm:block">
                  {user ? user.name.split(" ")[0] : "Profile"}
                </span>
              </button>

            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-3/4 bg-black/50 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8 text-white text-xl"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/profiles"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 rounded-lg bg-[#EB7A2E] hover:bg-orange-700 text-white font-semibold transition"
            >
              Helpers
            </Link>

            {/* 🟢 Mobile Profile Button */}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleProfileClick();
              }}
              className="flex items-center gap-3 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition"
            >
              <Image
                src={user?.profileImage || "/images/default-user.png"}
                alt="User"
                width={34}
                height={34}
                className="rounded-full"
              />
              {user ? user.name.split(" ")[0] : "Profile"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
