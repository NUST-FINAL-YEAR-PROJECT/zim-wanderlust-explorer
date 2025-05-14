
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { destinations, events } from "@/lib/data";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("destinations");
  
  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">Discover Zimbabwe</h2>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <Tabs defaultValue="destinations" className="mb-16" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="destinations" className="space-y-8">
            {searchQuery && filteredDestinations.length === 0 ? (
              <p className="text-center text-muted-foreground">No destinations found matching "{searchQuery}"</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery ? filteredDestinations : destinations.slice(0, 6)).map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                  ))}
                </div>
                {!searchQuery && (
                  <div className="flex justify-center mt-8">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">View All Destinations</Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-8">
            {searchQuery && filteredEvents.length === 0 ? (
              <p className="text-center text-muted-foreground">No events found matching "{searchQuery}"</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery ? filteredEvents : events.slice(0, 6)).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                {!searchQuery && (
                  <div className="flex justify-center mt-8">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">View All Events</Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Book Your Zimbabwe Adventure</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-neutral-100">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium mb-1">I'm interested in...</label>
                  <select id="interest" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select an option</option>
                    <option value="wildlife">Wildlife Safari</option>
                    <option value="culture">Cultural Tour</option>
                    <option value="adventure">Adventure Activities</option>
                    <option value="events">Cultural Events</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dates" className="block text-sm font-medium mb-1">Preferred Dates</label>
                  <Input id="dates" type="text" placeholder="When are you planning to visit?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Additional Information</label>
                  <textarea
                    id="message"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Tell us more about your trip..."
                  ></textarea>
                </div>
              </div>
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white">Request Booking Information</Button>
            </form>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
