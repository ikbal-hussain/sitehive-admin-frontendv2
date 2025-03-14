
import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="mb-4 text-sm md:text-base">
          &copy; {new Date().getFullYear()} SiteHive. All rights reserved.
        </p>

        {/* Social Media Links */}
        <nav aria-label="Social Media Links">
          <div className="flex justify-center space-x-6 mb-4">
            <a
              href="https://x.com/SiteHiveX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition-colors duration-300"
              aria-label="Follow SiteHive on Twitter"
            >
              <FaTwitter size={24} />
            </a>

            <a
              href="https://www.facebook.com/people/SiteHive/61573025155436/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition-colors duration-300"
              aria-label="Follow SiteHive on Facebook"
            >
              <FaFacebook size={24} />
            </a>

            <a
              href="https://www.instagram.com/sitehiveofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 transition-colors duration-300"
              aria-label="Follow SiteHive on Instagram"
            >
              <FaInstagram size={24} />
            </a>

            <a
              href="https://www.youtube.com/@sitehiveofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition-colors duration-300"
              aria-label="Subscribe to SiteHive on YouTube"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </nav>

        <p className="text-sm md:text-base">
          Follow us on social media for the latest updates and news.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
