import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
          alt="Space background" 
          className="object-cover h-full w-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1026] via-[#0B1026]/90 to-[#0B1026]/80"></div>
      </div>
      
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-6">Begin Your <span className="text-[#1BFFFF] glow">Space Journey</span> Today</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-[#D9D9D9]/90">
          The cosmos awaits. Join the elite few who have experienced the majesty of space travel.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <Link href="/book">
            <Button 
              variant="teal"
              size="lg"
              className="shadow-lg"
            >
              BOOK YOUR JOURNEY
            </Button>
          </Link>
          <a href="#destinations">
            <Button 
              variant="outline"
              size="lg"
            >
              EXPLORE DESTINATIONS
            </Button>
          </a>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-rajdhani font-bold text-[#1BFFFF] mb-2">12+</div>
            <p className="text-sm text-[#D9D9D9]/80">Space Destinations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-rajdhani font-bold text-[#1BFFFF] mb-2">500+</div>
            <p className="text-sm text-[#D9D9D9]/80">Successful Journeys</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-rajdhani font-bold text-[#1BFFFF] mb-2">99.9%</div>
            <p className="text-sm text-[#D9D9D9]/80">Safety Record</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-rajdhani font-bold text-[#1BFFFF] mb-2">24/7</div>
            <p className="text-sm text-[#D9D9D9]/80">Support Team</p>
          </div>
        </div>
      </div>
    </section>
  );
}
