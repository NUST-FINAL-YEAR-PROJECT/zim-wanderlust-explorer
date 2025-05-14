
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const HomepageSearchBar = () => {
  const [activeTab, setActiveTab] = useState("stay");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = () => {
    navigate(`/browse?search=${encodeURIComponent(searchText)}&tab=${activeTab === "stay" ? "destinations" : "events"}`);
  };
  
  return (
    <div className="w-full flex flex-col md:flex-row rounded-full overflow-hidden">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1"
      >
        <TabsList className="w-full justify-start h-auto bg-transparent gap-2 p-2">
          <TabsTrigger 
            value="stay" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full"
          >
            <span className="text-sm font-medium">Stay</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full"
          >
            <span className="text-sm font-medium">Experience</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex-1 flex items-center">
        <div className="w-full flex items-center">
          <input
            type="text"
            placeholder={activeTab === "stay" ? "Where do you want to go?" : "What do you want to experience?"}
            className="w-full py-3 px-6 outline-none text-gray-800 placeholder-gray-500 text-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white h-12 w-12 rounded-full mr-2"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomepageSearchBar;
