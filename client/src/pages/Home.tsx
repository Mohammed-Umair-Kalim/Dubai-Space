import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DestinationCard from "@/components/DestinationCard";
import FeaturedExperience from "@/components/FeaturedExperience";
import PackageCard from "@/components/PackageCard";
import AccommodationCard from "@/components/AccommodationCard";
import DashboardPreview from "@/components/DashboardPreview";
import CTASection from "@/components/CTASection";
import { Destination, Package, Accommodation } from "@shared/schema";

export default function Home() {
  // Fetch destinations
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    queryFn: async () => {
      const res = await fetch('/api/destinations');
      if (!res.ok) return [];
      return await res.json();
    }
  });

  // Fetch packages
  const { data: packages } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    queryFn: async () => {
      const res = await fetch('/api/packages');
      if (!res.ok) return [];
      return await res.json();
    }
  });

  // Fetch accommodations
  const { data: accommodations } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
    queryFn: async () => {
      const res = await fetch('/api/accommodations');
      if (!res.ok) return [];
      return await res.json();
    }
  });

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <section id="destinations" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Popular <span className="text-[#1BFFFF]">Destinations</span></h2>
              <p className="max-w-2xl mx-auto text-[#D9D9D9]/70">Explore our most sought-after space destinations and begin your journey to the stars</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations?.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-transparent border border-[#6C3CB4] text-[#1BFFFF] hover:bg-[#6C3CB4] hover:text-white font-rajdhani font-medium py-3 px-8 rounded-lg transition duration-300">
                View All Destinations
              </button>
            </div>
          </div>
        </section>
        
        <FeaturedExperience />
        
        <section id="packages" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Travel <span className="text-[#1BFFFF]">Packages</span></h2>
              <p className="max-w-2xl mx-auto text-[#D9D9D9]/70">Choose from our carefully curated space travel packages designed for every kind of space explorer</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages?.map(pkg => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </div>
        </section>
        
        <section id="accommodations" className="py-20 px-4 bg-[#070918]">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Space <span className="text-[#1BFFFF]">Accommodations</span></h2>
              <p className="max-w-2xl mx-auto text-[#D9D9D9]/70">Choose your perfect space stay from our selection of futuristic accommodations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations?.map(accommodation => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-transparent border border-[#6C3CB4] text-[#1BFFFF] hover:bg-[#6C3CB4] hover:text-white font-rajdhani font-medium py-3 px-8 rounded-lg transition duration-300">
                View All Accommodations
              </button>
            </div>
          </div>
        </section>
        
        <DashboardPreview />
        
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
