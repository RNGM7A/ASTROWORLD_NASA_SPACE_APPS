import { Link } from "react-router";
import { ArrowRight, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen starfield">
      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Video Background - Only in hero section */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/data/Black and White Cyberpunk Coming Soon Teaser Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-left">
              {/* Futuristic Graphic Element */}
              <div className="mb-8">
                <div className="w-32 h-1 bg-gradient-to-r from-[#7c5cff] to-[#00e0ff] rounded-full mb-4"></div>
                <div className="w-24 h-0.5 bg-[#00e0ff]/60 rounded-full"></div>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide leading-tight">
                NASA
                <span className="block space-gradient">
                  Explorer
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                A NEW EXPERIENCE IS ON ITS WAY.
              </p>
              
              {/* CTA Button */}
              <div className="mb-12">
                <Link 
                  to="/nasa" 
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#7c5cff] to-[#00e0ff] text-white font-bold text-lg rounded-lg hover:from-[#7c5cff]/90 hover:to-[#00e0ff]/90 transition-all duration-300 shadow-2xl hover:shadow-[#00e0ff]/25 hover:scale-105 backdrop-blur-sm border border-[#00e0ff]/30"
                >
                  <Rocket className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                  Launch Explorer
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              
              {/* Bottom Futuristic Graphic Element */}
              <div className="w-40 h-1 bg-gradient-to-r from-[#7c5cff] to-[#00e0ff] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* What the Dashboard Does Section */}
      <div className="relative z-20 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What It Does
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore NASA's space biology research with interactive tools and real-time data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-[#0e1a2f]/40 p-8 rounded-xl border border-[#1d2a44]/50 hover:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:bg-[#0e1a2f]/60">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7c5cff] to-[#00e0ff] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00e0ff] transition-colors duration-300">
                Research Explorer
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                Browse through NASA's space biology publications with advanced filtering and search capabilities
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#0e1a2f]/40 p-8 rounded-xl border border-[#1d2a44]/50 hover:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:bg-[#0e1a2f]/60">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7c5cff] to-[#00e0ff] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00e0ff] transition-colors duration-300">
                Interactive Simulations
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                Run virtual experiments with mice in space environments and see real-time biological changes
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#0e1a2f]/40 p-8 rounded-xl border border-[#1d2a44]/50 hover:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:bg-[#0e1a2f]/60">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7c5cff] to-[#00e0ff] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00e0ff] transition-colors duration-300">
                AI Assistant
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                Ask questions about research papers and get intelligent answers powered by AI technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}