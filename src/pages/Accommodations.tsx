
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import WelcomeSplash from '@/components/WelcomeSplash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Bed, MapPin, Star, Users, Wifi, Car, Coffee, Waves } from 'lucide-react';
import AccommodationCard from '@/components/AccommodationCard';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Accommodations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch accommodations using react-query
  const { data: accommodations = [], isLoading } = useQuery({
    queryKey: ['accommodations', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('accommodations')
        .select('*')
        .order('name');

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {showSplash && (
        <WelcomeSplash 
          duration={2000}
          onComplete={() => setShowSplash(false)}
        />
      )}
      
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pb-8"
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 p-6 md:p-8 mb-8 shadow-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                Find Your Perfect Stay
              </h1>
              <p className="text-amber-100 text-lg mb-6 max-w-2xl">
                Discover comfortable accommodations across Zimbabwe's most beautiful destinations
              </p>

              <form onSubmit={handleSearchSubmit} className="max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-300" size={18} />
                  <Input
                    placeholder="Search accommodations..."
                    className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-amber-200 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </motion.div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-orange-500/30 blur-2xl"></div>
            <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/20 blur-3xl"></div>
          </div>

          {/* Accommodations Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : accommodations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {accommodations.map((accommodation, index) => (
                <motion.div
                  key={accommodation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <AccommodationCard accommodation={accommodation} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-amber-900/30 rounded-xl shadow-md border border-amber-100 dark:border-amber-800">
              <div className="mb-6 bg-amber-50 dark:bg-amber-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Bed className="h-10 w-10 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-medium text-amber-900 dark:text-amber-100 mb-3">No accommodations found</h3>
              <p className="text-amber-600 dark:text-amber-400 mb-8 max-w-md mx-auto">
                {searchQuery ? 'No accommodations match your search criteria.' : 'There are currently no accommodations available.'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </DashboardLayout>
    </>
  );
};

export default Accommodations;
