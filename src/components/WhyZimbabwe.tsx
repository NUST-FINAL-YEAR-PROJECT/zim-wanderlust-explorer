
import { Tent, Binoculars, Flag, MapPin, Drum, TentTree } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: <TentTree size={36} />,
    title: "Natural Wonders",
    description: "From Victoria Falls to Mana Pools, Zimbabwe's diverse landscapes offer breathtaking experiences",
    hoverContent: "Zimbabwe is home to five UNESCO World Heritage sites, including Victoria Falls, one of the Seven Natural Wonders of the World. The country's varied landscapes range from lush forests to expansive savannahs.",
    gradient: "water-gradient"
  },
  {
    icon: <Drum size={36} />,
    title: "Rich Culture",
    description: "Immerse yourself in Zimbabwe's vibrant traditions, music, art, and historical sites",
    hoverContent: "Explore Great Zimbabwe, ancient stone ruins dating back to the 11th century. Experience traditional Shona and Ndebele art, vibrant dance performances, and authentic cultural ceremonies.",
    gradient: "sunset-gradient"
  },
  {
    icon: <Binoculars size={36} />,
    title: "Wildlife Safari",
    description: "Encounter the Big Five and hundreds of bird species in our pristine national parks",
    hoverContent: "Zimbabwe's national parks like Hwange and Mana Pools offer some of Africa's best wildlife viewing opportunities with lower crowds than other safari destinations. Home to over 350 mammal species and 500+ bird species.",
    gradient: "safari-gradient"
  },
  {
    icon: <Flag size={36} />,
    title: "Warm Hospitality",
    description: "Experience the legendary friendliness and welcoming spirit of Zimbabweans",
    hoverContent: "Zimbabwe is known for its exceptionally friendly people. Locals take pride in sharing their culture and ensuring visitors have an unforgettable experience with genuine warmth and hospitality.",
    gradient: "savanna-gradient"
  },
  {
    icon: <Tent size={36} />,
    title: "Authentic Experiences",
    description: "Enjoy off-the-beaten-path adventures that create lasting memories",
    hoverContent: "From canoeing the Zambezi River to walking safaris with expert guides, Zimbabwe offers authentic experiences that connect you directly with nature and local communities without the crowds.",
    gradient: "forest-gradient"
  }
];

const WhyZimbabwe = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-savanna-light/20 to-safari-light/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="section-title">Why Visit Zimbabwe?</h2>
          <p className="section-subtitle">
            Zimbabwe offers unique experiences that will capture your heart and create memories to last a lifetime
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {reasons.map((reason, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div className="luxury-card group h-full">
                  <div className={cn(
                    "p-6 rounded-t-xl flex items-center justify-center h-32",
                    reason.gradient
                  )}>
                    <div className="text-white transform transition-transform group-hover:scale-110 duration-300">
                      {reason.icon}
                    </div>
                  </div>
                  <div className="p-6 text-center flex flex-col h-[calc(100%-8rem)]">
                    <h3 className="text-lg font-bold mb-2 text-safari-dark">{reason.title}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{reason.description}</p>
                    <div className="mt-4 text-xs text-primary opacity-70 font-medium">
                      Hover to learn more
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-5 luxury-card">
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-safari-dark">{reason.title}</h4>
                  <p className="text-sm">{reason.hoverContent}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyZimbabwe;
