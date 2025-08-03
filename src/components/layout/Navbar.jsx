import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logout } from "../../utils/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bulk Upload", path: "/bulk-upload" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/Sitehivelogofav.PNG" alt="SiteHive Logo" className="h-12 mx-2" />
          <span className="text-2xl font-bold text-green-700">SiteHive Admin</span>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className="hidden md:flex flex-grow justify-center space-x-8">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition ${
                location.pathname === path ? "bg-green-100 text-green-700" : "hover:text-green-600"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center">
          <Link
              to="/sign-up"
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition ${
                location.pathname === "/sign-up" ? "bg-green-100 text-green-700" : "hover:text-green-600"
              }`}
            >
              Sign Up
            </Link>
          <Link 
              to="/login"
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition ${
                location.pathname === "/login" ? "bg-green-100 text-green-700" : "hover:text-green-600"
              }`}
            >
              Login
            </Link>
          <Link onClick={() => logout()}
              to="/login"
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition`}
            >
              Logout
            </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-full py-4 text-center space-y-4">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`block py-3 text-lg font-semibold ${
                location.pathname === path ? "bg-green-100 text-green-700" : "hover:text-green-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
