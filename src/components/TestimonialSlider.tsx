
import { useState, useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    country: "United Kingdom",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    flag: "🇬🇧",
    stars: 5,
    text: "Victoria Falls was breathtaking! My guide was knowledgeable and the whole experience was perfect. Zimbabwe has stolen my heart, I'll definitely be back."
  },
  {
    name: "Michael Zhang",
    country: "China",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    flag: "🇨🇳",
    stars: 5,
    text: "The safari at Hwange National Park exceeded all expectations. We saw elephants, lions, and so many other animals. Truly a once-in-a-lifetime experience!"
  },
  {
    name: "Priya Patel",
    country: "India",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    flag: "🇮🇳",
    stars: 5,
    text: "Great Zimbabwe ruins were fascinating! Our guide shared incredible stories about the history and culture. The local food was also amazing."
  },
  {
    name: "Carlos Rodriguez",
    country: "Spain",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
    flag: "🇪🇸",
    stars: 5,
    text: "Mana Pools National Park was an unforgettable adventure. Canoeing alongside hippos and elephants was surreal. Zimbabwe is a true gem!"
  },
  {
    name: "Olivia Williams",
    country: "Australia",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    flag: "🇦🇺",
    stars: 5,
    text: "The Matobo Hills were magical. The rock formations are spectacular and learning about the local culture was fascinating. Highly recommend!"
  }
];

const TestimonialSlider = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap() + 1);
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Traveler Experiences</h2>
        <p className="text-center text-muted-foreground mb-12">Hear from visitors who have experienced Zimbabwe's beauty</p>
        
        <Carousel setApi={setApi} className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-2">
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-4" 
                        />
                        <span className="absolute bottom-3 right-0 text-2xl">{testimonial.flag}</span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      
                      <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                      
                      <div className="mt-auto">
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center mt-8 gap-2">
            <CarouselPrevious className="static transform-none" />
            <span className="text-sm text-muted-foreground">
              {current} / {testimonials.length}
            </span>
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialSlider;
