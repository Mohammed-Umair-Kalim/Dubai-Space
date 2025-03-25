import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";
import { UserContext } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function DashboardPreview() {
  const { user } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  
  // Query user bookings if user is logged in
  const { data: bookings } = useQuery({
    queryKey: ['/api/bookings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const res = await fetch(`/api/bookings?userId=${user.id}`);
      if (!res.ok) return null;
      return await res.json();
    },
    enabled: !!user
  });

  // Get the next booking (first in the list)
  const nextBooking = bookings && bookings.length > 0 ? bookings[0] : null;
  
  return (
    <section id="dashboard" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Your Space <span className="text-[#1BFFFF]">Dashboard</span></h2>
          <p className="max-w-2xl mx-auto text-[#D9D9D9]/70">Manage your space journeys and get personalized recommendations with our advanced dashboard</p>
        </div>
        
        <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Profile */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block rounded-full border-4 border-[#6C3CB4] p-1 mb-4">
                  <div className="bg-[#6C3CB4] rounded-full h-24 w-24 flex items-center justify-center">
                    <i className="ri-user-3-line text-white text-4xl"></i>
                  </div>
                </div>
                <h3 className="font-orbitron text-xl font-bold">{user ? user.fullName : "Space Explorer"}</h3>
                <p className="text-[#D9D9D9]/70 text-sm">{user ? user.membershipLevel : "Platinum"} Member</p>
              </div>
              
              <div className="bg-[#0B1026] rounded-lg p-4">
                <h4 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Space Travel Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Journeys Completed</span>
                    <span className="font-rajdhani">{user ? user.journeysCompleted : 3}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Destinations Visited</span>
                    <span className="font-rajdhani">{user ? user.destinationsVisited : 5}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Days in Space</span>
                    <span className="font-rajdhani">{user ? user.totalDaysInSpace : 22}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Loyalty Points</span>
                    <span className="font-rajdhani text-[#1BFFFF]">{user ? user.loyaltyPoints : 248500}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0B1026] rounded-lg p-4">
                <h4 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Recommended For You</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <i className="ri-planet-line text-[#6C3CB4] text-lg mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium">Europa Ice Diving Expedition</p>
                      <p className="text-xs text-[#D9D9D9]/60">Based on your previous journeys</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="ri-hotel-line text-[#6C3CB4] text-lg mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium">Lunar Dome Suite Upgrade</p>
                      <p className="text-xs text-[#D9D9D9]/60">Special offer for platinum members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Upcoming Journeys */}
            <div className="space-y-6">
              <div className="bg-[#0B1026] rounded-lg p-4">
                <h4 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Your Next Journey</h4>
                {nextBooking ? (
                  <div className="relative border border-[#6C3CB4]/30 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h5 className="font-orbitron font-bold">Lunar Resort Alpha</h5>
                        <p className="text-sm text-[#D9D9D9]/70">Luxury Suite • 5 Nights</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#D9D9D9]/70">Confirmation</span>
                        <p className="font-rajdhani font-medium text-[#1BFFFF]">{nextBooking.confirmationCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-[#0B1026] flex items-center justify-center border border-[#6C3CB4]">
                          <i className="ri-rocket-line text-[#6C3CB4]"></i>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#D9D9D9]/70">Departure</p>
                          <p className="font-medium">Dubai Spaceport</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 border-t border-dashed border-[#6C3CB4]/50 mx-2 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#1BFFFF]"></div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-[#0B1026] flex items-center justify-center border border-[#6C3CB4]">
                          <i className="ri-moon-line text-[#6C3CB4]"></i>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#D9D9D9]/70">Arrival</p>
                          <p className="font-medium">Lunar Port Alpha</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <CountdownTimer targetDate={new Date(nextBooking.departureDate)} />
                        <p className="text-center text-xs text-[#D9D9D9]/70">Until Launch</p>
                      </div>
                      
                      <Button variant="default" size="sm" className="bg-[#6C3CB4] hover:bg-[#1BFFFF] hover:text-[#0B1026] text-white font-rajdhani">
                        Manage Booking
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#6C3CB4]/30 rounded-lg p-4 mb-4 text-center">
                    <p className="mb-4 text-[#D9D9D9]/70">You don't have any upcoming journeys</p>
                    <Link href="/book">
                      <Button variant="outline" className="border border-[#6C3CB4] text-[#1BFFFF]">
                        Book Your First Trip
                      </Button>
                    </Link>
                  </div>
                )}
                
                <h4 className="font-rajdhani font-medium text-[#D9D9D9] mb-3">Preparation Checklist</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      onChange={() => {}}
                    />
                    <span className="ml-2 text-sm">Complete medical screening</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      onChange={() => {}}
                    />
                    <span className="ml-2 text-sm">Zero-G training session</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={false} 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      onChange={() => {}}
                    />
                    <span className="ml-2 text-sm">Pack approved personal items</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={false} 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      onChange={() => {}}
                    />
                    <span className="ml-2 text-sm">Review safety procedures</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - AI Travel Tips */}
            <div className="space-y-6">
              <div className="bg-[#0B1026] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-rajdhani font-medium text-[#1BFFFF]">AI Travel Assistant</h4>
                  <span className="bg-[#6C3CB4]/20 text-[#1BFFFF] text-xs py-1 px-2 rounded-full">Active</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#6C3CB4]/10 rounded-lg p-3 border-l-2 border-[#6C3CB4]">
                    <h5 className="font-medium text-sm mb-2">Preparation for Lunar Gravity</h5>
                    <p className="text-xs text-[#D9D9D9]/80">For your upcoming lunar trip, I recommend daily leg strength exercises. Lunar gravity is 1/6 of Earth's, and strong legs will help you adapt to the unique gravitational environment.</p>
                  </div>
                  
                  <div className="bg-[#6C3CB4]/10 rounded-lg p-3 border-l-2 border-[#6C3CB4]">
                    <h5 className="font-medium text-sm mb-2">Suggested Items for Lunar Resort</h5>
                    <p className="text-xs text-[#D9D9D9]/80">While most necessities are provided, consider bringing: a favorite small memento (under 100g), prescription medications, and specialized skincare for the controlled lunar environment.</p>
                  </div>
                  
                  <div className="bg-[#1BFFFF]/10 rounded-lg p-3 border-l-2 border-[#1BFFFF]">
                    <h5 className="font-medium text-sm mb-2">Photography on the Moon</h5>
                    <p className="text-xs text-[#D9D9D9]/80">The lunar resort provides specialized cameras, but if bringing your own, use settings for high contrast environments. The Earth-rise over Mare Imbrium is visible from your suite on days 2-3 of your stay.</p>
                  </div>
                </div>
                
                <div className="mt-4 relative">
                  <input 
                    type="text" 
                    placeholder="Ask about your upcoming journey..." 
                    className="w-full bg-[#070918] border border-[#6C3CB4]/40 rounded-lg p-3 pr-10 text-white text-sm focus:border-[#1BFFFF] focus:ring-1 focus:ring-[#1BFFFF] outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1BFFFF]">
                    <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0B1026] rounded-lg p-4">
                <h4 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Weather Conditions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#070918] p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Lunar Resort Alpha</span>
                      <i className="ri-moon-clear-fill text-[#1BFFFF]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">-180°C / +120°C</span>
                      <p className="text-xs text-[#D9D9D9]/60">14-day cycle</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#070918] p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Mars Colony One</span>
                      <i className="ri-sun-fill text-[#6C3CB4]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">-60°C / Calm</span>
                      <p className="text-xs text-[#D9D9D9]/60">Clear skies</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#070918] p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Orbital Hotel</span>
                      <i className="ri-earth-fill text-[#1BFFFF]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">21°C / Stable</span>
                      <p className="text-xs text-[#D9D9D9]/60">Solar activity: Low</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#070918] p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Europa Station</span>
                      <i className="ri-snowy-fill text-[#6C3CB4]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">-220°C / Ice</span>
                      <p className="text-xs text-[#D9D9D9]/60">Jupiter visible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
