
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CityGroupViewProps {
  letter: string;
  cities: string[];
}

const CityGroupView = ({ letter, cities }: CityGroupViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800 pb-2">
        {letter}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map(city => (
          <Card 
            key={city}
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500 hover:border-l-indigo-600"
            onClick={() => navigate(`/destinations?city=${encodeURIComponent(city)}`)}
          >
            <CardContent className="p-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-indigo-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{city}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CityGroupView;
