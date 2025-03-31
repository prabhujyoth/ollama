import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav className="bg-[#171717] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* <a href="/" className="text-2xl font-bold text-blue-500">
                The Art Of Making Money
              </a> */}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                LLM
              </Link>
              <Link
                to="/sip"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                SIP
              </Link>
              <Link
                to="/swp"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                SWP
              </Link>
              <Link
                to="/stocks"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                Stocks
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-500 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#1e1e1e] border-t border-gray-600">
            <div className="flex flex-col space-y-2 p-4">
              <Link
                to="/"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                LLM
              </Link>
              <Link
                to="/sip"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                SIP
              </Link>
              <Link
                to="/swp"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                SWP
              </Link>
              <Link
                to="/stocks"
                className="text-gray-600 font-semibold hover:text-blue-500"
              >
                Stocks
              </Link>
              {/* <Link to="/aboutUs" className="text-gray-600 hover:text-blue-500">
                About Us
              </Link> */}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
