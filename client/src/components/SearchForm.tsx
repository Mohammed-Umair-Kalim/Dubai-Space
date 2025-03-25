import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function SearchForm() {
  const [, setLocation] = useLocation();
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [travelers, setTravelers] = useState("1 Passenger");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/book?destination=${destination}&date=${departureDate}&travelers=${travelers}`);
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#070918]/80 backdrop-blur-lg p-6 rounded-xl border border-[#6C3CB4]/30 glow-border">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-left text-[#1BFFFF] font-rajdhani text-sm">Destination</label>
            <select 
              className="w-full bg-[#0B1026] border border-[#6C3CB4]/40 rounded-lg p-3 text-white focus:border-[#1BFFFF] focus:ring-1 focus:ring-[#1BFFFF] outline-none"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="">Select Destination</option>
              <option value="lunar-resort-alpha">Lunar Resort Alpha</option>
              <option value="mars-colony-one">Mars Colony One</option>
              <option value="orbital-hotel-zenith">Orbital Hotel Zenith</option>
              <option value="europa-research-station">Europa Research Station</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-left text-[#1BFFFF] font-rajdhani text-sm">Departure Date</label>
            <input 
              type="date" 
              className="w-full bg-[#0B1026] border border-[#6C3CB4]/40 rounded-lg p-3 text-white focus:border-[#1BFFFF] focus:ring-1 focus:ring-[#1BFFFF] outline-none"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-left text-[#1BFFFF] font-rajdhani text-sm">Travelers</label>
            <select 
              className="w-full bg-[#0B1026] border border-[#6C3CB4]/40 rounded-lg p-3 text-white focus:border-[#1BFFFF] focus:ring-1 focus:ring-[#1BFFFF] outline-none"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              <option>1 Passenger</option>
              <option>2 Passengers</option>
              <option>3 Passengers</option>
              <option>4+ Passengers</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            type="submit"
            variant="default" 
            size="lg"
            className="w-full md:w-auto bg-[#6C3CB4] hover:bg-[#1BFFFF] hover:text-[#0B1026] text-white font-rajdhani font-bold py-3 px-8 rounded-lg transition duration-300 text-lg shadow-lg shadow-[#6C3CB4]/20"
          >
            FIND YOUR JOURNEY
          </Button>
        </div>
      </form>
    </div>
  );
}
