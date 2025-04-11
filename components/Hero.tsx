import Image from "next/image";

interface HeroProps {
  onAuth: (mode: 'login' | 'signup') => void;
}

export default function Hero({ onAuth }: HeroProps) {
  return (
    <div className="text-white w-full max-w-4xl mx-auto px-4 relative">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      {/* Main content with enhanced styling */}
      <div className="relative">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-xl"></div>
            <Image
              src="/astrogenielogo.png" 
              alt="AstroGenie Logo"
              width={220}
              height={220}
              className="relative logo-bounce drop-shadow-2xl"
            />
          </div>
        </div>
        
        <h1 className="logo-text text-6xl md:text-8xl font-bold font-comfortaa text-center mb-3 slide-in drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            Astro<span className="text-[#cd5301]">Genie</span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-center mb-10 slide-in slide-in-delay-1 text-white/90 max-w-2xl mx-auto font-questrial tracking-wide">
          Your personalized AI-powered cosmic guide and companion for navigating life's journey through the stars
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={() => onAuth('signup')}
            className="bg-gradient-to-r from-primary to-primary/90 text-white px-10 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 slide-in slide-in-delay-2 font-medium border border-white/10"
          >
            Join today for FREE!
          </button>
          <button 
            onClick={() => onAuth('login')}
            className="bg-white/10 backdrop-blur-md text-white px-10 py-3.5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/20 slide-in slide-in-delay-3 border border-white/20"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
