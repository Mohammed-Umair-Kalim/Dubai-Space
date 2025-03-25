import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Destination } from "@shared/schema";
import { Link } from "wouter";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { name, location, description, imageUrl, basePrice } = destination;
  
  return (
    <div className="planet-card bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 transition duration-300 hover:shadow-lg hover:shadow-[#6C3CB4]/20 group">
      <div className="overflow-hidden h-52">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover planet-img"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-orbitron text-xl font-bold">{name}</h3>
          <span className="text-[#1BFFFF] font-rajdhani font-medium">{location}</span>
        </div>
        <p className="text-[#D9D9D9]/70 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[#D9D9D9]/50 text-sm">Starting from</span>
            <div className="font-rajdhani font-bold text-[#1BFFFF] text-xl">{formatPrice(basePrice)}</div>
          </div>
          <Link href={`/book?destination=${destination.id}`}>
            <Button variant="purple">
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
