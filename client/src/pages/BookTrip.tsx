import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { UserContext } from "@/App";
import { formatPrice, daysBetween } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Extend the insertBookingSchema with validation
const bookingFormSchema = insertBookingSchema.extend({
  departureDate: z.coerce.date().min(new Date(), {
    message: "Departure date must be in the future",
  }),
  returnDate: z.coerce.date(),
}).refine((data) => {
  return data.returnDate > data.departureDate;
}, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookTrip() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  
  // Extract initial values from URL params
  const initialDestination = searchParams.get('destination') || "";
  const initialPackage = searchParams.get('package') || "";
  const initialAccommodation = searchParams.get('accommodation') || "";
  const initialDate = searchParams.get('date') || "";
  const initialTravelers = Number(searchParams.get('travelers')?.split(' ')[0]) || 1;

  const [selectedPackage, setSelectedPackage] = useState<number | null>(initialPackage ? Number(initialPackage) : null);
  const [selectedDestination, setSelectedDestination] = useState<number | null>(initialDestination ? Number(initialDestination) : null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<number | null>(initialAccommodation ? Number(initialAccommodation) : null);
  const [bookingStep, setBookingStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch destinations
  const { data: destinations, isLoading: destinationsLoading } = useQuery({
    queryKey: ['/api/destinations'],
    queryFn: async () => {
      const res = await fetch('/api/destinations');
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return await res.json();
    },
  });

  // Fetch packages
  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['/api/packages'],
    queryFn: async () => {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      return await res.json();
    },
  });

  // Fetch accommodations
  const { data: accommodations, isLoading: accommodationsLoading } = useQuery({
    queryKey: ['/api/accommodations'],
    queryFn: async () => {
      const res = await fetch('/api/accommodations');
      if (!res.ok) throw new Error('Failed to fetch accommodations');
      return await res.json();
    },
  });

  // Set up form with initial values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      userId: user?.id || 0,
      destinationId: initialDestination ? Number(initialDestination) : 0,
      packageId: initialPackage ? Number(initialPackage) : 0,
      accommodationId: initialAccommodation ? Number(initialAccommodation) : undefined,
      departureDate: initialDate ? new Date(initialDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week in the future
      returnDate: initialDate ? new Date(new Date(initialDate).getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks in the future
      travelers: initialTravelers,
      totalPrice: 0,
      status: "confirmed",
    },
  });

  // Calculate total price whenever form values change
  useEffect(() => {
    if (!destinations || !packages || !accommodations) return;

    const values = form.getValues();
    const destination = destinations.find(d => d.id === values.destinationId);
    const pkg = packages.find(p => p.id === values.packageId);
    const accommodation = values.accommodationId 
      ? accommodations.find(a => a.id === values.accommodationId)
      : null;

    let price = 0;
    
    if (destination) {
      price += destination.basePrice;
    }
    
    if (pkg) {
      price += pkg.price;
    }
    
    if (accommodation) {
      const nights = daysBetween(values.departureDate, values.returnDate);
      price += accommodation.pricePerNight * nights;
    }
    
    // Multiply by number of travelers
    price *= values.travelers;
    
    setTotalPrice(price);
    form.setValue('totalPrice', price);
  }, [form, destinations, packages, accommodations]);

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return apiRequest('POST', '/api/bookings', data);
    },
    onSuccess: async (res) => {
      const booking = await res.json();
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: "Booking confirmed!",
        description: `Your journey to the stars awaits. Confirmation code: ${booking.confirmationCode}`,
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: BookingFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your booking",
        variant: "destructive",
      });
      return;
    }
    
    data.userId = user.id;
    createBooking.mutate(data);
  };

  // Update form values when selections change
  useEffect(() => {
    if (selectedDestination !== null) {
      form.setValue('destinationId', selectedDestination);
    }
    if (selectedPackage !== null) {
      form.setValue('packageId', selectedPackage);
    }
    if (selectedAccommodation !== null) {
      form.setValue('accommodationId', selectedAccommodation);
    }
  }, [selectedDestination, selectedPackage, selectedAccommodation, form]);

  // Handle step navigation
  const nextStep = () => {
    if (bookingStep === 1 && !selectedDestination) {
      toast({
        title: "Destination required",
        description: "Please select a destination to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (bookingStep === 2 && !selectedPackage) {
      toast({
        title: "Package required",
        description: "Please select a travel package to continue",
        variant: "destructive",
      });
      return;
    }
    
    setBookingStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const isLoading = destinationsLoading || packagesLoading || accommodationsLoading;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Book Your <span className="text-[#1BFFFF]">Space Journey</span></h1>
            <p className="max-w-2xl mx-auto text-[#D9D9D9]/70">Select your destination, package, and travel details to embark on an unforgettable adventure to the stars</p>
          </div>

          {/* Booking Steps Indicator */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${bookingStep >= 1 ? 'text-[#1BFFFF]' : 'text-[#D9D9D9]/50'}`}>
                <div className={`h-10 w-10 rounded-full ${bookingStep >= 1 ? 'bg-[#1BFFFF] text-[#0B1026]' : 'bg-[#0B1026] text-[#D9D9D9]/50 border border-[#D9D9D9]/30'} flex items-center justify-center font-rajdhani font-bold`}>
                  1
                </div>
                <span className="mt-2 text-sm font-rajdhani">Destination</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${bookingStep >= 2 ? 'bg-[#1BFFFF]' : 'bg-[#D9D9D9]/20'}`}></div>
              
              <div className={`flex flex-col items-center ${bookingStep >= 2 ? 'text-[#1BFFFF]' : 'text-[#D9D9D9]/50'}`}>
                <div className={`h-10 w-10 rounded-full ${bookingStep >= 2 ? 'bg-[#1BFFFF] text-[#0B1026]' : 'bg-[#0B1026] text-[#D9D9D9]/50 border border-[#D9D9D9]/30'} flex items-center justify-center font-rajdhani font-bold`}>
                  2
                </div>
                <span className="mt-2 text-sm font-rajdhani">Package</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${bookingStep >= 3 ? 'bg-[#1BFFFF]' : 'bg-[#D9D9D9]/20'}`}></div>
              
              <div className={`flex flex-col items-center ${bookingStep >= 3 ? 'text-[#1BFFFF]' : 'text-[#D9D9D9]/50'}`}>
                <div className={`h-10 w-10 rounded-full ${bookingStep >= 3 ? 'bg-[#1BFFFF] text-[#0B1026]' : 'bg-[#0B1026] text-[#D9D9D9]/50 border border-[#D9D9D9]/30'} flex items-center justify-center font-rajdhani font-bold`}>
                  3
                </div>
                <span className="mt-2 text-sm font-rajdhani">Accommodation</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${bookingStep >= 4 ? 'bg-[#1BFFFF]' : 'bg-[#D9D9D9]/20'}`}></div>
              
              <div className={`flex flex-col items-center ${bookingStep >= 4 ? 'text-[#1BFFFF]' : 'text-[#D9D9D9]/50'}`}>
                <div className={`h-10 w-10 rounded-full ${bookingStep >= 4 ? 'bg-[#1BFFFF] text-[#0B1026]' : 'bg-[#0B1026] text-[#D9D9D9]/50 border border-[#D9D9D9]/30'} flex items-center justify-center font-rajdhani font-bold`}>
                  4
                </div>
                <span className="mt-2 text-sm font-rajdhani">Confirm</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1BFFFF]"></div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                {/* Step 1: Destination Selection */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-orbitron text-2xl font-bold">Select Your Destination</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {destinations?.map((destination) => (
                        <Card 
                          key={destination.id}
                          className={`cursor-pointer overflow-hidden transition-all duration-300 ${selectedDestination === destination.id 
                            ? 'border-[#1BFFFF] bg-[#0B1026]/80' 
                            : 'border-[#6C3CB4]/30 bg-[#070918] hover:border-[#6C3CB4]'
                          }`}
                          onClick={() => setSelectedDestination(destination.id)}
                        >
                          <div className="relative h-36">
                            <img
                              src={destination.imageUrl}
                              alt={destination.name}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-[#6C3CB4]/80 text-white text-xs py-1 px-2 rounded font-rajdhani">
                                {destination.location}
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-orbitron text-lg font-bold mb-2">{destination.name}</h3>
                            <p className="text-[#D9D9D9]/70 text-sm mb-3 line-clamp-2">{destination.description}</p>
                            <div className="font-rajdhani text-[#1BFFFF] font-bold">
                              From {formatPrice(destination.basePrice)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-8">
                      <Button type="button" onClick={nextStep} disabled={!selectedDestination}>
                        Continue to Packages
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Package Selection */}
                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-orbitron text-2xl font-bold">Choose Your Travel Package</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {packages?.map((pkg) => (
                        <Card 
                          key={pkg.id}
                          className={`cursor-pointer transition-all duration-300 ${selectedPackage === pkg.id 
                            ? 'border-[#1BFFFF] bg-[#0B1026]/80' 
                            : 'border-[#6C3CB4]/30 bg-[#070918] hover:border-[#6C3CB4]'
                          } relative ${pkg.isPremium ? 'md:transform md:scale-105' : ''}`}
                          onClick={() => setSelectedPackage(pkg.id)}
                        >
                          {pkg.isPopular && (
                            <div className="absolute top-4 right-4 bg-[#6C3CB4] text-white text-xs py-1 px-3 rounded-full font-rajdhani">
                              POPULAR
                            </div>
                          )}
                          
                          {pkg.isPremium && (
                            <div className="absolute top-0 left-0 right-0 bg-[#1BFFFF] text-[#0B1026] text-xs py-2 font-rajdhani font-bold text-center">
                              PREMIUM EXPERIENCE
                            </div>
                          )}
                          
                          <CardContent className={`p-6 ${pkg.isPremium ? 'pt-12' : ''}`}>
                            <h3 className="font-orbitron text-xl font-bold mb-2">{pkg.name}</h3>
                            <div className="font-rajdhani font-bold text-[#1BFFFF] text-2xl mb-4">{formatPrice(pkg.price)}</div>
                            
                            <div className="space-y-3 mb-6">
                              {pkg.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-3 text-sm">
                                  <i className="ri-check-line text-[#1BFFFF] text-base mt-0.5"></i>
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back to Destinations
                      </Button>
                      <Button type="button" onClick={nextStep} disabled={!selectedPackage}>
                        Continue to Accommodations
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Accommodation Selection */}
                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-orbitron text-2xl font-bold">Select Your Accommodation</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {accommodations?.filter(acc => {
                        const destination = destinations?.find(d => d.id === selectedDestination);
                        return destination && acc.location.includes(destination.location);
                      }).map((accommodation) => (
                        <Card 
                          key={accommodation.id}
                          className={`cursor-pointer overflow-hidden transition-all duration-300 ${selectedAccommodation === accommodation.id 
                            ? 'border-[#1BFFFF] bg-[#0B1026]/80' 
                            : 'border-[#6C3CB4]/30 bg-[#070918] hover:border-[#6C3CB4]'
                          }`}
                          onClick={() => setSelectedAccommodation(accommodation.id)}
                        >
                          <div className="relative h-48">
                            <img
                              src={accommodation.imageUrl}
                              alt={accommodation.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent"></div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-orbitron text-lg font-bold mb-2">{accommodation.name}</h3>
                            <p className="text-[#D9D9D9]/70 text-sm mb-3">{accommodation.description}</p>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <i className="ri-user-line text-[#6C3CB4]"></i>
                                <span className="text-sm">{accommodation.capacity}</span>
                              </div>
                              {accommodation.amenities.slice(0, 2).map((amenity, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                  <i className="ri-star-line text-[#6C3CB4]"></i>
                                  <span className="text-sm">{amenity}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div>
                              <span className="text-[#D9D9D9]/50 text-xs">per night</span>
                              <div className="font-rajdhani font-bold text-[#1BFFFF] text-lg">
                                {formatPrice(accommodation.pricePerNight)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Card 
                        className={`cursor-pointer transition-all duration-300 ${selectedAccommodation === null 
                          ? 'border-[#1BFFFF] bg-[#0B1026]/80' 
                          : 'border-[#6C3CB4]/30 bg-[#070918] hover:border-[#6C3CB4]'
                        }`}
                        onClick={() => setSelectedAccommodation(null)}
                      >
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                          <i className="ri-hotel-bed-line text-4xl text-[#6C3CB4] mb-4"></i>
                          <h3 className="font-orbitron text-lg font-bold mb-2">No Accommodation</h3>
                          <p className="text-[#D9D9D9]/70 text-sm text-center mb-4">
                            Skip accommodation selection if it's included in your package or not needed.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back to Packages
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Continue to Booking Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Booking Details and Confirmation */}
                {bookingStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-orbitron text-2xl font-bold">Confirm Your Booking</h2>
                    
                    <Card className="bg-[#070918] border-[#6C3CB4]/30">
                      <CardHeader>
                        <CardTitle>Travel Details</CardTitle>
                        <CardDescription>Review and finalize your space journey</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departure Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                                    className="bg-[#0B1026] border-[#6C3CB4]/40"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Return Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                    className="bg-[#0B1026] border-[#6C3CB4]/40"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="travelers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Travelers</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-[#0B1026] border-[#6C3CB4]/40">
                                    <SelectValue placeholder="Select number of travelers" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 Passenger</SelectItem>
                                  <SelectItem value="2">2 Passengers</SelectItem>
                                  <SelectItem value="3">3 Passengers</SelectItem>
                                  <SelectItem value="4">4 Passengers</SelectItem>
                                  <SelectItem value="5">5 Passengers</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator className="border-[#6C3CB4]/30" />
                        
                        <div className="space-y-4">
                          <h3 className="font-orbitron text-lg font-medium">Booking Summary</h3>
                          
                          <div className="bg-[#0B1026] rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span>Destination:</span>
                              <span className="font-medium">
                                {destinations?.find(d => d.id === selectedDestination)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Package:</span>
                              <span className="font-medium">
                                {packages?.find(p => p.id === selectedPackage)?.name}
                              </span>
                            </div>
                            {selectedAccommodation && (
                              <div className="flex justify-between">
                                <span>Accommodation:</span>
                                <span className="font-medium">
                                  {accommodations?.find(a => a.id === selectedAccommodation)?.name}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">
                                {daysBetween(form.getValues().departureDate, form.getValues().returnDate)} days
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Travelers:</span>
                              <span className="font-medium">{form.getValues().travelers}</span>
                            </div>
                            
                            <Separator className="border-[#6C3CB4]/30" />
                            
                            <div className="flex justify-between font-bold">
                              <span>Total Price:</span>
                              <span className="text-[#1BFFFF] text-xl">{formatPrice(totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Back to Accommodations
                        </Button>
                        <Button 
                          type="submit"
                          variant="teal"
                          disabled={createBooking.isPending || !user}
                        >
                          {createBooking.isPending ? (
                            <>
                              <span className="animate-spin mr-2">
                                <i className="ri-loader-4-line"></i>
                              </span>
                              Processing...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {!user && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                        <p className="text-red-400 mb-2">You need to sign in to complete your booking</p>
                        <Button variant="default" size="sm">
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </Form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
