import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logout } from "../../utils/auth"; 
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "Categories", path: "/categories" },
    { name: "Tags", path: "/tags" },
    { name: "Bulk Upload", path: "/tools/bulk-upload" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/Sitehivelogofav.PNG" alt="SiteHive Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-green-800 tracking-tight">SiteHive Admin</span>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className="hidden lg:flex flex-grow justify-center space-x-10">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-4 py-2 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
                location.pathname === path
                  ? "text-green-800 bg-green-100"
                  : "hover:text-green-800 hover:bg-green-50"
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-800 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                location.pathname === path ? "after:scale-x-100" : ""
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            to="/sign-up"
            className={`px-5 py-2 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
              location.pathname === "/sign-up"
                ? "text-green-800 bg-green-100"
                : "hover:text-green-800 hover:bg-green-50"
            }`}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className={`px-5 py-2 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
              location.pathname === "/login"
                ? "text-green-800 bg-green-100"
                : "hover:text-green-800 hover:bg-green-50"
            }`}
          >
            Login
          </Link>
          <button
            onClick={() => {
              navigate("/login");
              logout();
            }}
            className="px-5 py-2 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 transition-all duration-300 ease-in-out cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-green-800 transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-xl absolute w-full left-0 top-full py-6 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center space-y-4">
            {navItems.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`w-full text-center py-3 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
                  location.pathname === path
                    ? "text-green-800 bg-green-100"
                    : "hover:text-green-800 hover:bg-green-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {name}
              </Link>
            ))}
            <Link
              to="/sign-up"
              className={`w-full text-center py-3 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
                location.pathname === "/sign-up"
                  ? "text-green-800 bg-green-100"
                  : "hover:text-green-800 hover:bg-green-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={`w-full text-center py-3 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 ease-in-out ${
                location.pathname === "/login"
                  ? "text-green-800 bg-green-100"
                  : "hover:text-green-800 hover:bg-green-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-center py-3 text-base font-medium text-white bg-green-800 rounded-lg hover:bg-green-900 transition-all duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;