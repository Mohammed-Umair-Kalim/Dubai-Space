import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { User, Booking, TravelTip } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { UserContext } from "@/App";
import { formatPrice, getTimeRemaining } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, setLocation, toast]);

  // Fetch user bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/bookings?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return await res.json();
    },
    enabled: !!user,
  });

  // Fetch travel tips
  const { data: travelTips, isLoading: tipsLoading } = useQuery<TravelTip[]>({
    queryKey: ['/api/travel-tips'],
    queryFn: async () => {
      const res = await fetch('/api/travel-tips');
      if (!res.ok) throw new Error('Failed to fetch travel tips');
      return await res.json();
    },
  });

  // Fetch destinations, packages, and accommodations for bookings display
  const { data: destinations } = useQuery({
    queryKey: ['/api/destinations'],
    queryFn: async () => {
      const res = await fetch('/api/destinations');
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return await res.json();
    },
  });

  const { data: packages } = useQuery({
    queryKey: ['/api/packages'],
    queryFn: async () => {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      return await res.json();
    },
  });

  const { data: accommodations } = useQuery({
    queryKey: ['/api/accommodations'],
    queryFn: async () => {
      const res = await fetch('/api/accommodations');
      if (!res.ok) throw new Error('Failed to fetch accommodations');
      return await res.json();
    },
  });

  // Helper functions for getting booking details
  const getDestinationName = (destinationId: number) => {
    return destinations?.find(d => d.id === destinationId)?.name || 'Unknown Destination';
  };

  const getPackageName = (packageId: number) => {
    return packages?.find(p => p.id === packageId)?.name || 'Unknown Package';
  };

  const getAccommodationName = (accommodationId?: number) => {
    if (!accommodationId) return 'No accommodation';
    return accommodations?.find(a => a.id === accommodationId)?.name || 'Unknown Accommodation';
  };

  if (!user) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">Space Dashboard</h1>
              <p className="text-[#D9D9D9]/70">Welcome back, <span className="text-[#1BFFFF]">{user.fullName}</span></p>
            </div>
            <Link href="/book">
              <Button variant="teal" size="lg" className="mt-4 md:mt-0">
                Book New Journey
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Column */}
            <div className="space-y-6">
              <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="rounded-full border-4 border-[#6C3CB4] p-1 mb-4">
                    <div className="bg-[#6C3CB4] rounded-full h-24 w-24 flex items-center justify-center">
                      <i className="ri-user-3-line text-white text-4xl"></i>
                    </div>
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">{user.fullName}</h2>
                  <p className="text-[#D9D9D9]/70 text-sm">{user.membershipLevel} Member</p>
                </div>

                <div className="bg-[#0B1026] rounded-lg p-4 mb-6">
                  <h3 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Account Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Username</span>
                      <span className="font-rajdhani">{user.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email</span>
                      <span className="font-rajdhani">{user.email || "Not provided"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B1026] rounded-lg p-4">
                  <h3 className="font-rajdhani font-medium text-[#1BFFFF] mb-3">Space Travel Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Journeys Completed</span>
                      <span className="font-rajdhani">{user.journeysCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Destinations Visited</span>
                      <span className="font-rajdhani">{user.destinationsVisited}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Days in Space</span>
                      <span className="font-rajdhani">{user.totalDaysInSpace}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Loyalty Points</span>
                      <span className="font-rajdhani text-[#1BFFFF]">{user.loyaltyPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6">
                <h3 className="font-orbitron text-xl font-bold mb-4">Weather Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-[#0B1026] p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Lunar Resort Alpha</span>
                      <i className="ri-moon-clear-fill text-[#1BFFFF]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">-180°C / +120°C</span>
                      <p className="text-xs text-[#D9D9D9]/60">14-day cycle</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0B1026] p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Mars Colony One</span>
                      <i className="ri-sun-fill text-[#6C3CB4]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">-60°C / Calm</span>
                      <p className="text-xs text-[#D9D9D9]/60">Clear skies</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0B1026] p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Orbital Hotel Zenith</span>
                      <i className="ri-earth-fill text-[#1BFFFF]"></i>
                    </div>
                    <div className="mt-1">
                      <span className="font-rajdhani font-bold text-sm">21°C / Stable</span>
                      <p className="text-xs text-[#D9D9D9]/60">Solar activity: Low</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0B1026] p-3 rounded-lg">
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

            {/* Upcoming Journeys Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6">
                <h3 className="font-orbitron text-xl font-bold mb-4">Your Upcoming Journeys</h3>
                
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1BFFFF]"></div>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-[#6C3CB4]/30 rounded-lg p-4">
                        <div className="flex justify-between mb-3">
                          <div>
                            <h4 className="font-orbitron font-bold">{getDestinationName(booking.destinationId)}</h4>
                            <p className="text-sm text-[#D9D9D9]/70">
                              {getPackageName(booking.packageId)} • {booking.travelers} {booking.travelers === 1 ? 'Traveler' : 'Travelers'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-[#D9D9D9]/70">Confirmation</span>
                            <p className="font-rajdhani font-medium text-[#1BFFFF]">{booking.confirmationCode}</p>
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
                              <p className="text-[#D9D9D9]/60">{new Date(booking.departureDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 border-t border-dashed border-[#6C3CB4]/50 mx-2 relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#1BFFFF]"></div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-[#0B1026] flex items-center justify-center border border-[#6C3CB4]">
                              <i className="ri-planet-line text-[#6C3CB4]"></i>
                            </div>
                            <div className="text-xs">
                              <p className="text-[#D9D9D9]/70">Return</p>
                              <p className="font-medium">{getDestinationName(booking.destinationId)}</p>
                              <p className="text-[#D9D9D9]/60">{new Date(booking.returnDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[#D9D9D9]/70">Accommodation</p>
                            <p className="font-medium text-sm">{getAccommodationName(booking.accommodationId)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#D9D9D9]/70">Total Price</p>
                            <p className="font-rajdhani font-bold text-[#1BFFFF] text-lg">{formatPrice(booking.totalPrice)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between border-t border-[#6C3CB4]/30 pt-4">
                          <div className="flex-1 max-w-[140px]">
                            <CountdownTimer targetDate={new Date(booking.departureDate)} />
                            <p className="text-center text-xs text-[#D9D9D9]/70">Until Launch</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="purple" size="sm">Manage Booking</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-[#6C3CB4]/30 rounded-lg">
                    <i className="ri-rocket-line text-[#6C3CB4] text-4xl mb-2"></i>
                    <h4 className="font-orbitron text-lg mb-2">No Upcoming Journeys</h4>
                    <p className="text-[#D9D9D9]/70 mb-4">You don't have any space trips booked yet.</p>
                    <Link href="/book">
                      <Button variant="teal">Book Your First Journey</Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-orbitron text-xl font-bold">AI Travel Assistant</h3>
                  <span className="bg-[#6C3CB4]/20 text-[#1BFFFF] text-xs py-1 px-2 rounded-full">Active</span>
                </div>

                {tipsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1BFFFF]"></div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {travelTips?.map((tip, index) => (
                      <div 
                        key={tip.id} 
                        className={`bg-${index === 2 ? '[#1BFFFF]' : '[#6C3CB4]'}/10 rounded-lg p-3 border-l-2 border-${index === 2 ? '[#1BFFFF]' : '[#6C3CB4]'}`}
                      >
                        <h5 className="font-medium text-sm mb-2">{tip.title}</h5>
                        <p className="text-xs text-[#D9D9D9]/80">{tip.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask about your upcoming journey..." 
                    className="w-full bg-[#0B1026] border border-[#6C3CB4]/40 rounded-lg p-3 pr-10 text-white text-sm focus:border-[#1BFFFF] focus:ring-1 focus:ring-[#1BFFFF] outline-none"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1BFFFF]">
                    <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </div>

              <div className="bg-[#070918] rounded-xl overflow-hidden border border-[#6C3CB4]/30 p-6">
                <h3 className="font-orbitron text-xl font-bold mb-4">Pre-Flight Checklist</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-[#0B1026] rounded-lg">
                    <input 
                      type="checkbox" 
                      id="medical" 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      defaultChecked
                    />
                    <label htmlFor="medical" className="ml-2 flex-1">
                      <span className="font-medium">Complete medical screening</span>
                      <p className="text-xs text-[#D9D9D9]/60">Required 30 days before departure</p>
                    </label>
                    <span className="text-xs bg-green-500/20 text-green-400 py-1 px-2 rounded">Completed</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-[#0B1026] rounded-lg">
                    <input 
                      type="checkbox" 
                      id="training" 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                      defaultChecked
                    />
                    <label htmlFor="training" className="ml-2 flex-1">
                      <span className="font-medium">Zero-G training session</span>
                      <p className="text-xs text-[#D9D9D9]/60">Required 14 days before departure</p>
                    </label>
                    <span className="text-xs bg-green-500/20 text-green-400 py-1 px-2 rounded">Completed</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-[#0B1026] rounded-lg">
                    <input 
                      type="checkbox" 
                      id="packing" 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                    />
                    <label htmlFor="packing" className="ml-2 flex-1">
                      <span className="font-medium">Pack approved personal items</span>
                      <p className="text-xs text-[#D9D9D9]/60">Required 2 days before departure</p>
                    </label>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 py-1 px-2 rounded">Pending</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-[#0B1026] rounded-lg">
                    <input 
                      type="checkbox" 
                      id="safety" 
                      className="h-4 w-4 rounded border-[#6C3CB4] text-[#1BFFFF] focus:ring-[#1BFFFF]" 
                    />
                    <label htmlFor="safety" className="ml-2 flex-1">
                      <span className="font-medium">Review safety procedures</span>
                      <p className="text-xs text-[#D9D9D9]/60">Required 1 day before departure</p>
                    </label>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 py-1 px-2 rounded">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
