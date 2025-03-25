import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#070918] px-4 py-12 border-t border-[#6C3CB4]/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-[#1BFFFF] font-orbitron font-bold text-2xl">
                DUBAI<span className="text-white">SPACE</span>
              </span>
            </Link>
            <p className="text-[#D9D9D9]/70 text-sm mb-4">
              Leading the way in luxury space travel and exploration since 2030.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#D9D9D9] hover:text-[#1BFFFF] transition">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-[#D9D9D9] hover:text-[#1BFFFF] transition">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-[#D9D9D9] hover:text-[#1BFFFF] transition">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-[#D9D9D9] hover:text-[#1BFFFF] transition">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-medium text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#destinations" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Destinations</a></li>
              <li><a href="#packages" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Travel Packages</a></li>
              <li><a href="#accommodations" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Accommodations</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Experiences</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Training Programs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Space Travel Guide</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Preparation Tips</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Safety Measures</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">FAQ</a></li>
              <li><a href="#" className="text-[#D9D9D9]/70 hover:text-[#1BFFFF] transition">Travel Insurance</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-medium text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <i className="ri-map-pin-line text-[#1BFFFF] mt-1"></i>
                <span className="text-[#D9D9D9]/70">Dubai Future District, UAE</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-mail-line text-[#1BFFFF] mt-1"></i>
                <span className="text-[#D9D9D9]/70">info@dubaispace.ae</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-phone-line text-[#1BFFFF] mt-1"></i>
                <span className="text-[#D9D9D9]/70">+971 800 SPACE</span>
              </li>
            </ul>
            
            <div className="mt-4">
              <button className="bg-[#6C3CB4]/20 hover:bg-[#6C3CB4] text-[#1BFFFF] hover:text-white px-4 py-2 rounded-lg transition duration-300 text-sm font-rajdhani">
                Newsletter Signup
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-[#6C3CB4]/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#D9D9D9]/50 text-sm">© 2030 Dubai Space. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-[#D9D9D9]/50 hover:text-[#1BFFFF] text-sm transition">Privacy Policy</a>
            <a href="#" className="text-[#D9D9D9]/50 hover:text-[#1BFFFF] text-sm transition">Terms of Service</a>
            <a href="#" className="text-[#D9D9D9]/50 hover:text-[#1BFFFF] text-sm transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
