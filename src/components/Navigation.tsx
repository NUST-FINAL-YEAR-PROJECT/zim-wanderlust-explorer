
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, LogIn } from "lucide-react";

const Navigation = () => {
  const { user } = useAuth();
  
  return (
    <div className="absolute top-0 left-0 right-0 z-30 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">
          Discover Zimbabwe
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                <UserCircle size={20} />
                <span className="hidden md:inline">My Account</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                <LogIn size={20} />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
