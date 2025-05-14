
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { Destination } from "@/models/Destination";
import { events } from "@/lib/data";

// Map the mock data to match the Destination type
const destinations: Destination[] = [
  {
    id: "1",
    name: "Victoria Falls",
    description: "One of the Seven Natural Wonders of the World, Victoria Falls is a spectacular waterfall on the Zambezi River.",
    location: "Matabeleland North",
    price: 45,
    image_url: "/victoria-falls.jpg",
    activities: ["Bungee jumping", "White water rafting", "Helicopter tours"],
    best_time_to_visit: "February to May",
    duration_recommended: "2-3 days",
    difficulty_level: "Easy",
    amenities: ["Guided tours", "Restaurants", "Viewpoints"],
    what_to_bring: ["Camera", "Raincoat", "Comfortable shoes"],
    highlights: ["Devil's Pool", "Lunar Rainbow", "Knife-edge Bridge"],
    weather_info: "The falls are at their fullest from February to May after the summer rains.",
    getting_there: "Fly into Victoria Falls Airport, then take a shuttle to the falls.",
    categories: ["Natural Wonder", "Adventure"],
    additional_images: ["/victoria-falls.jpg"],
    is_featured: true,
    payment_url: null,
    created_at: "",
    updated_at: "",
    additional_costs: null
  },
  {
    id: "2",
    name: "Great Zimbabwe",
    description: "Ancient stone ruins and UNESCO World Heritage site dating back to the 11th century.",
    location: "Masvingo",
    price: 20,
    image_url: "/great-zimbabwe.jpg",
    activities: ["Guided tours", "Archaeological exploration"],
    best_time_to_visit: "May to October",
    duration_recommended: "1 day",
    difficulty_level: "Easy",
    amenities: ["Museum", "Gift shop", "Guides"],
    what_to_bring: ["Hat", "Sunscreen", "Water"],
    highlights: ["Great Enclosure", "Hill Complex", "Valley Ruins"],
    weather_info: "Dry and sunny during May to October, making exploration comfortable.",
    getting_there: "Drive from Harare (4 hours) or Bulawayo (3 hours).",
    categories: ["Historical", "Cultural"],
    additional_images: ["/great-zimbabwe.jpg"],
    is_featured: true,
    payment_url: null,
    created_at: "",
    updated_at: "",
    additional_costs: null
  },
  {
    id: "3",
    name: "Hwange National Park",
    description: "Zimbabwe's largest national park, home to over 100 mammal species and 400 bird species.",
    location: "Matabeleland North",
    price: 30,
    image_url: "/hwange.jpg",
    activities: ["Game drives", "Bird watching", "Walking safaris"],
    best_time_to_visit: "July to October",
    duration_recommended: "3-4 days",
    difficulty_level: "Moderate",
    amenities: ["Lodges", "Camping sites", "Guides"],
    what_to_bring: ["Binoculars", "Camera", "Safari clothing"],
    highlights: ["Elephant herds", "Lion prides", "Painted dogs"],
    weather_info: "Dry season (July to October) is best for wildlife viewing as animals gather around water holes.",
    getting_there: "Drive from Bulawayo (4 hours) or Victoria Falls (2 hours).",
    categories: ["Wildlife", "Safari"],
    additional_images: ["/hwange.jpg"],
    is_featured: true,
    payment_url: null,
    created_at: "",
    updated_at: "",
    additional_costs: null
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("destinations");
  const navigate = useNavigate();
  
  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExploreMore = () => {
    // Navigate to the destinations or events page
    navigate(activeTab === "destinations" ? "/destinations" : "/events");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">Discover Zimbabwe</h2>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <Tabs defaultValue="destinations" className="mb-12" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="space-y-6">
            {searchQuery && filteredDestinations.length === 0 ? (
              <p className="text-center text-muted-foreground">No destinations found matching "{searchQuery}"</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery ? filteredDestinations : destinations.slice(0, 3)).map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                  ))}
                </div>
                {!searchQuery && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={handleExploreMore}
                    >
                      View All Destinations
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            {searchQuery && filteredEvents.length === 0 ? (
              <p className="text-center text-muted-foreground">No events found matching "{searchQuery}"</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery ? filteredEvents : events.slice(0, 3)).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                {!searchQuery && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={handleExploreMore}
                    >
                      View All Events
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <section className="bg-amber-50 p-6 md:p-10 rounded-xl border border-amber-100 mb-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Zimbabwe Adventure?</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to book your perfect trip, save favorites, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => navigate("/auth")}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                className="border-green-700 text-green-700 hover:bg-green-50"
                onClick={() => navigate("/auth?mode=login")}
              >
                Already a Member? Log In
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
