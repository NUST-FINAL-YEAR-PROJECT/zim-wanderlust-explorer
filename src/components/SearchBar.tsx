
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search destinations or events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6 text-base w-full shadow-sm border-green-100 focus-visible:ring-green-500"
          />
        </div>
        <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 py-6">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
