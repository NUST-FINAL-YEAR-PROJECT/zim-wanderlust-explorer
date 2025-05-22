
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createItinerary } from '@/models/Itinerary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { DestinationSelector } from './DestinationSelector';

const ItineraryForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ title: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors = { title: '' };
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    if (newErrors.title) return;
    
    if (!user) {
      toast.error("Authentication error", {
        description: "You must be logged in to create an itinerary"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const itinerary = await createItinerary(user.id, title, description);
      
      if (itinerary) {
        toast.success("Success!", {
          description: "Your itinerary has been created. Now you can add destinations."
        });
        navigate(`/itineraries/${itinerary.id}`);
      } else {
        throw new Error("Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast.error("Error creating itinerary", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Itinerary</CardTitle>
        <CardDescription>
          Plan your perfect Zimbabwe adventure by creating a custom itinerary.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
              Itinerary Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Weekend in Victoria Falls"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your travel plans"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(checked) => setIsPublic(!!checked)} />
            <Label htmlFor="isPublic" className="text-sm cursor-pointer">
              Make this itinerary public (others can view it)
            </Label>
          </div>

          {/* Preview of Destinations - will be added later after creation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">After creation, you'll be able to:</h3>
            <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
              <li>Add destinations to your itinerary</li>
              <li>Arrange them in the order you want to visit</li>
              <li>Add notes and travel dates for each destination</li>
              <li>Share your itinerary with others</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/itineraries')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Itinerary"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ItineraryForm;
