import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/App";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useContext(UserContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0B1026]/80 backdrop-blur-md z-50 px-4 py-4 border-b border-[#6C3CB4]/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-[#1BFFFF] font-orbitron font-bold text-2xl">
            DUBAI<span className="text-white">SPACE</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#destinations" className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition">
            Destinations
          </a>
          <a href="#packages" className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition">
            Packages
          </a>
          <a href="#accommodations" className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition">
            Accommodations
          </a>
          {user ? (
            <Link href="/dashboard" className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition">
              Dashboard
            </Link>
          ) : (
            <a href="#dashboard" className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition">
              Dashboard
            </a>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-white font-rajdhani">{user.fullName}</span>
              <Button onClick={logout} variant="outline">Sign Out</Button>
            </div>
          ) : (
            <Button className="hidden md:block">Sign In</Button>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#070918] absolute top-full left-0 right-0 p-4 border-b border-[#6C3CB4]/30`}>
        <div className="flex flex-col space-y-4">
          <a 
            href="#destinations" 
            className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition py-2"
            onClick={closeMobileMenu}
          >
            Destinations
          </a>
          <a 
            href="#packages" 
            className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition py-2"
            onClick={closeMobileMenu}
          >
            Packages
          </a>
          <a 
            href="#accommodations" 
            className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition py-2"
            onClick={closeMobileMenu}
          >
            Accommodations
          </a>
          {user ? (
            <Link 
              href="/dashboard" 
              className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition py-2"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
          ) : (
            <a 
              href="#dashboard" 
              className="font-rajdhani text-md uppercase tracking-wider hover:text-[#1BFFFF] transition py-2"
              onClick={closeMobileMenu}
            >
              Dashboard
            </a>
          )}
          
          {user ? (
            <>
              <div className="py-2 text-white font-rajdhani">{user.fullName}</div>
              <Button onClick={() => { logout(); closeMobileMenu(); }} variant="outline" className="w-full">
                Sign Out
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={closeMobileMenu}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
