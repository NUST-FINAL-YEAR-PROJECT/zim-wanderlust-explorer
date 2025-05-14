
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Zimbabwe Tourism</h3>
            <p className="text-white/90 mb-4">
              Discover the beauty of Zimbabwe - from majestic Victoria Falls to stunning wildlife and rich cultural heritage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Destinations</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Events</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">About Zimbabwe</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Victoria Falls</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Hwange National Park</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Great Zimbabwe</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Matobo Hills</a></li>
              <li><a href="#" className="text-white/90 hover:text-accent transition-colors duration-300">Lake Kariba</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">123 Tourism Road, Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span className="text-white/90">+263 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span className="text-white/90">info@zimbabwetourism.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/70">
          <p>&copy; {new Date().getFullYear()} Zimbabwe Tourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
