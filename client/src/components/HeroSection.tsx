import { Link } from "wouter";
import SearchForm from "./SearchForm";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" 
          alt="Space background" 
          className="object-cover h-full w-full opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1026]/70 via-[#0B1026]/50 to-[#0B1026]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
          <span className="block">Experience the</span>
          <span className="text-[#1BFFFF] glow">Ultimate Space Journey</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-[#D9D9D9]/90">
          Book your trip to the stars, lunar resorts, and orbital stations with Dubai's premier space travel agency
        </p>
        
        <SearchForm />
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#destinations" className="text-[#1BFFFF]">
            <i className="ri-arrow-down-line text-3xl"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
