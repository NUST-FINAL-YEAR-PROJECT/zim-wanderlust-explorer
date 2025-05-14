
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#6366F1] text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Zimbabwe Tourism</h3>
            <p className="text-[#F1F0FB] mb-4 font-body">
              Discover the beauty of Zimbabwe - from majestic Victoria Falls to stunning wildlife and rich cultural heritage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#8B5CF6] transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#8B5CF6] transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#8B5CF6] transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Quick Links</h3>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Destinations</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Events</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">About Zimbabwe</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Popular Destinations</h3>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Victoria Falls</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Hwange National Park</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Great Zimbabwe</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Matobo Hills</a></li>
              <li><a href="#" className="text-[#F1F0FB] hover:text-white transition-colors duration-300">Lake Kariba</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Contact Us</h3>
            <ul className="space-y-3 font-body">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-[#F1F0FB]">123 Tourism Road, Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span className="text-[#F1F0FB]">+263 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span className="text-[#F1F0FB]">info@zimbabwetourism.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#818CF8] mt-12 pt-6 text-center text-[#F1F0FB]">
          <p className="font-body">&copy; {new Date().getFullYear()} Zimbabwe Tourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
