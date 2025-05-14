
import { Mountain, Heart, Users, Camera, Compass } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const reasons = [
  {
    icon: <Mountain size={36} />,
    title: "Natural Wonders",
    description: "From Victoria Falls to Mana Pools, Zimbabwe's diverse landscapes offer breathtaking experiences",
    hoverContent: "Zimbabwe is home to five UNESCO World Heritage sites, including Victoria Falls, one of the Seven Natural Wonders of the World. The country's varied landscapes range from lush forests to expansive savannahs."
  },
  {
    icon: <Camera size={36} />,
    title: "Rich Culture",
    description: "Immerse yourself in Zimbabwe's vibrant traditions, music, art, and historical sites",
    hoverContent: "Explore Great Zimbabwe, ancient stone ruins dating back to the 11th century. Experience traditional Shona and Ndebele art, vibrant dance performances, and authentic cultural ceremonies."
  },
  {
    icon: <Compass size={36} />,
    title: "Wildlife Safari",
    description: "Encounter the Big Five and hundreds of bird species in our pristine national parks",
    hoverContent: "Zimbabwe's national parks like Hwange and Mana Pools offer some of Africa's best wildlife viewing opportunities with lower crowds than other safari destinations. Home to over 350 mammal species and 500+ bird species."
  },
  {
    icon: <Users size={36} />,
    title: "Warm Hospitality",
    description: "Experience the legendary friendliness and welcoming spirit of Zimbabweans",
    hoverContent: "Zimbabwe is known for its exceptionally friendly people. Locals take pride in sharing their culture and ensuring visitors have an unforgettable experience with genuine warmth and hospitality."
  },
  {
    icon: <Heart size={36} />,
    title: "Authentic Experiences",
    description: "Enjoy off-the-beaten-path adventures that create lasting memories",
    hoverContent: "From canoeing the Zambezi River to walking safaris with expert guides, Zimbabwe offers authentic experiences that connect you directly with nature and local communities without the crowds."
  }
];

const WhyZimbabwe = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Why Visit Zimbabwe?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zimbabwe offers unique experiences that will capture your heart and create memories to last a lifetime
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {reasons.map((reason, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
                    {reason.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm">{reason.description}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{reason.title}</h4>
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
