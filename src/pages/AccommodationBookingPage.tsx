
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import AccommodationBookingForm from '@/components/AccommodationBookingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccommodationBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { data: accommodation, isLoading } = useQuery({
    queryKey: ['accommodation', id],
    queryFn: async () => {
      if (!id) throw new Error('No accommodation ID provided');
      
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!accommodation) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Accommodation not found
          </h1>
          <Button onClick={() => navigate('/accommodations')}>
            Back to Accommodations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/accommodations')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Accommodations
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book {accommodation.name}
          </h1>
        </div>

        <AccommodationBookingForm 
          accommodationId={id!} 
          accommodationDetails={accommodation} 
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default AccommodationBookingPage;
