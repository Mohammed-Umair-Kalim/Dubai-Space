import { Button } from "@/components/ui/button";
import { Package } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const { name, price, features, isPopular, isPremium } = pkg;
  
  return (
    <div 
      className={`
        bg-[#070918] rounded-xl overflow-hidden 
        ${isPremium 
          ? 'border border-[#1BFFFF]/50 transition duration-300 hover:shadow-lg hover:shadow-[#1BFFFF]/20 relative transform scale-105' 
          : 'border border-[#6C3CB4]/30 transition duration-300 hover:shadow-lg hover:shadow-[#6C3CB4]/20 relative'
        }
      `}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 bg-[#6C3CB4] text-white text-sm py-1 px-3 rounded-full font-rajdhani">
          POPULAR
        </div>
      )}
      
      {isPremium && (
        <div className="absolute top-0 left-0 right-0 bg-[#1BFFFF] text-[#0B1026] text-sm py-2 font-rajdhani font-bold text-center">
          PREMIUM EXPERIENCE
        </div>
      )}
      
      <div className={`p-6 ${isPremium ? 'pt-12' : ''}`}>
        <h3 className="font-orbitron text-2xl font-bold mb-2">{name}</h3>
        <div className="font-rajdhani font-bold text-[#1BFFFF] text-3xl mb-6">{formatPrice(price)}</div>
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <i className={`ri-${getFeatureIcon(feature)} text-${isPremium ? '[#1BFFFF]' : '[#6C3CB4]'} text-xl`}></i>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Link href={`/book?package=${pkg.id}`}>
          <Button 
            className={`w-full ${isPremium 
              ? 'bg-[#1BFFFF] text-[#0B1026] hover:bg-white' 
              : 'bg-[#6C3CB4] hover:bg-[#1BFFFF] hover:text-[#0B1026] text-white'
            } font-rajdhani font-bold py-3 rounded-lg transition duration-300`}
          >
            SELECT PACKAGE
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Helper function to determine icon based on feature text
function getFeatureIcon(feature: string): string {
  if (feature.toLowerCase().includes('transport') || feature.toLowerCase().includes('spacecraft')) {
    return 'rocket-line';
  }
  if (feature.toLowerCase().includes('accommodation') || feature.toLowerCase().includes('nights') || feature.toLowerCase().includes('suite')) {
    return 'hotel-line';
  }
  if (feature.toLowerCase().includes('dining') || feature.toLowerCase().includes('chef') || feature.toLowerCase().includes('menu') || feature.toLowerCase().includes('food')) {
    return 'restaurant-line';
  }
  if (feature.toLowerCase().includes('space walk') || feature.toLowerCase().includes('activities')) {
    return 'space-ship-line';
  }
  if (feature.toLowerCase().includes('spa') || feature.toLowerCase().includes('recreation') || feature.toLowerCase().includes('vip')) {
    return 'vip-crown-line';
  }
  if (feature.toLowerCase().includes('photo') || feature.toLowerCase().includes('film')) {
    return 'camera-line';
  }
  if (feature.toLowerCase().includes('lunar') || feature.toLowerCase().includes('moon')) {
    return 'moon-line';
  }
  if (feature.toLowerCase().includes('concierge') || feature.toLowerCase().includes('service')) {
    return 'service-line';
  }
  // Default icon if no match
  return 'checkbox-circle-line';
}
