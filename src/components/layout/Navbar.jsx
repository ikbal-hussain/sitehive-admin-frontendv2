import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 mb-26">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/Sitehivelogofav.PNG"
            alt="SiteHive Logo"
            className="h-12 mx-2"
          />
          <span className="text-2xl font-bold text-blue-700">SiteHive</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition">
          Dashboard
          </Link>
          <Link to="/blogs" className="hover:text-blue-600 transition">
            Blogs
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-full py-4 space-y-4 text-center">
          <Link
            to="/"
            className="block py-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="block py-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/blogs"
            className="block py-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
