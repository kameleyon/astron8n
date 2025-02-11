import Image from "next/image";

interface HeroProps {
  onAuth: (mode: 'login' | 'signup') => void;
}

export default function Hero({ onAuth }: HeroProps) {
  return (
    <div className="text-white w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-center mb-2">
        <Image
          src="/astrogenielogo.png" 
          alt="AstroGenie Logo"
          width={200}
          height={200}
          className="mb-4 logo-bounce"
        />
      </div>
      <h1 className="logo-text text-6xl md:text-8xl font-bold text-center mb-2 slide-in">AstroGenie</h1>
      <p className="text-lg md:text-xl text-center mb-8 slide-in slide-in-delay-1">Personalized AI-Powered Guide and Companion</p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={() => onAuth('signup')}
          className="bg-primary text-white px-8 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 hover:bg-opacity-90 slide-in slide-in-delay-2"
        >
          Join today for FREE!
        </button>
        <button 
          onClick={() => onAuth('login')}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 hover:bg-white/30 slide-in slide-in-delay-3"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}
