import { Button } from "@/components/ui/button";

export default function FeaturedExperience() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80" 
          alt="Space background" 
          className="object-cover h-full w-full opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1026] via-[#0B1026]/90 to-[#0B1026]/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="float">
            <img 
              src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
              alt="Zero Gravity Experience" 
              className="rounded-xl shadow-2xl shadow-[#6C3CB4]/20"
            />
          </div>
          
          <div>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">Experience <span className="text-[#1BFFFF]">Zero Gravity</span></h2>
            <p className="text-[#D9D9D9]/90 mb-6">
              Our exclusive zero-gravity lounges offer an unparalleled experience where you can float freely while witnessing the majesty of space. Professional trainers ensure your safety as you experience the freedom of weightlessness.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <i className="ri-check-line text-[#1BFFFF] text-xl"></i>
                <span>Expert guidance from certified zero-gravity instructors</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-check-line text-[#1BFFFF] text-xl"></i>
                <span>Specialized photography services to capture your experience</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-check-line text-[#1BFFFF] text-xl"></i>
                <span>Customizable session lengths from 30 minutes to 3 hours</span>
              </div>
            </div>
            
            <Button
              variant="default"
              size="lg"
              className="bg-[#6C3CB4] hover:bg-[#1BFFFF] hover:text-[#0B1026] text-white font-rajdhani font-bold py-3 px-8 rounded-lg transition duration-300 text-lg shadow-lg shadow-[#6C3CB4]/20"
            >
              BOOK ZERO-G EXPERIENCE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
