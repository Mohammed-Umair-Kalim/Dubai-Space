import { Button } from "@/components/ui/button";
import { Accommodation } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const { name, location, description, imageUrl, pricePerNight, capacity, amenities } = accommodation;
  
  return (
    <div className="bg-[#0B1026] rounded-xl overflow-hidden border border-[#6C3CB4]/30 transition duration-300 hover:shadow-lg hover:shadow-[#6C3CB4]/20 group">
      <div className="relative overflow-hidden h-56">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className={`${location.includes('LUNAR') || location.includes('MARS') ? 'bg-[#1BFFFF]/80 text-[#0B1026]' : 'bg-[#6C3CB4]/80 text-white'} text-xs py-1 px-2 rounded font-rajdhani`}>
            {location}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-2">{name}</h3>
        <p className="text-[#D9D9D9]/70 text-sm mb-4">{description}</p>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <i className="ri-user-line text-[#6C3CB4]"></i>
            <span className="text-sm">{capacity}</span>
          </div>
          {amenities.slice(0, 2).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1">
              <i className={`ri-${getAmenityIcon(amenity)} text-[#6C3CB4]`}></i>
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[#D9D9D9]/50 text-xs">per night</span>
            <div className="font-rajdhani font-bold text-[#1BFFFF] text-lg">{formatPrice(pricePerNight)}</div>
          </div>
          <Link href={`/book?accommodation=${accommodation.id}`}>
            <Button variant="purple" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine icon based on amenity text
function getAmenityIcon(amenity: string): string {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes('wifi') || amenityLower.includes('space-fi')) {
    return 'wifi-line';
  }
  if (amenityLower.includes('dining')) {
    return 'restaurant-line';
  }
  if (amenityLower.includes('bar')) {
    return 'goblet-line';
  }
  if (amenityLower.includes('private')) {
    return 'home-smile-line';
  }
  if (amenityLower.includes('earth-view') || amenityLower.includes('window')) {
    return 'earth-line';
  }
  if (amenityLower.includes('zero-g') || amenityLower.includes('sleeping')) {
    return 'moon-clear-line';
  }
  if (amenityLower.includes('garden')) {
    return 'plant-line';
  }
  // Default icon if no match
  return 'star-line';
}
