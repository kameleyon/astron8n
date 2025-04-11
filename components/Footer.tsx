export default function Footer() {
  return (
    <footer className="w-full text-white/90 py-5 px-6 text-sm border-t border-white/20 bg-gradient-to-r from-secondary to-accent relative font-jost">
      <div className="absolute inset-0 dot-pattern bg-black opacity-10"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
          <div className="flex items-center">
            <p className="font-medium">© 2025 AstroGenie. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors duration-300">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors duration-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
