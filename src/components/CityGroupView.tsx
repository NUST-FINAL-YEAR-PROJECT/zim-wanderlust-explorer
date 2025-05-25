
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CityGroupViewProps {
  letter: string;
  cities: string[];
}

const CityGroupView = ({ letter, cities }: CityGroupViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg">
          <span className="text-xl font-bold">{letter}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
            {letter}
          </h3>
          <div className="h-px bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 mt-2" />
        </div>
        <Badge variant="secondary" className="ml-auto">
          {cities.length} {cities.length === 1 ? 'city' : 'cities'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cities.map((city, index) => (
          <motion.div
            key={city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-indigo-500 hover:border-l-indigo-600 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20 overflow-hidden"
              onClick={() => navigate(`/destinations?city=${encodeURIComponent(city)}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors flex-shrink-0">
                      <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors truncate">
                        {city}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Explore destinations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CityGroupView;
