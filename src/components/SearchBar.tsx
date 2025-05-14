
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
            placeholder="Where would you like to explore?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6 text-base w-full shadow-sm border-gray-100 focus-visible:ring-amber-500 rounded-xl"
          />
        </div>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-6 rounded-xl">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
