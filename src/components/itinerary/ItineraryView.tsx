
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Share, Calendar, Pencil, Trash, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getItinerary, deleteItinerary, updateItinerary } from '@/models/Itinerary';
import { Itinerary, ItineraryDestination } from '@/models/Itinerary';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';

interface ItineraryViewProps {
  itineraryId: string;
}

export function ItineraryView({ itineraryId }: ItineraryViewProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadItinerary = async () => {
      setIsLoading(true);
      const data = await getItinerary(itineraryId);
      setItinerary(data);
      setIsPublic(data?.isPublic || false);
      if (data?.isPublic && data?.shareCode) {
        setShareUrl(`${window.location.origin}/itinerary/shared/${data.shareCode}`);
      }
      setIsLoading(false);
    };

    loadItinerary();
  }, [itineraryId]);

  const handleTogglePublic = async () => {
    if (!itinerary) return;

    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    
    const success = await updateItinerary(itinerary.id, itinerary.title, itinerary.description, newIsPublic);
    
    if (success) {
      if (newIsPublic) {
        // Refresh itinerary to get the new share code
        const updatedItinerary = await getItinerary(itineraryId);
        if (updatedItinerary?.shareCode) {
          setShareUrl(`${window.location.origin}/itinerary/shared/${updatedItinerary.shareCode}`);
        }
        toast({
          title: "Itinerary is now public",
          description: "Anyone with the link can view this itinerary.",
        });
      } else {
        setShareUrl('');
        toast({
          title: "Itinerary is now private",
          description: "Only you can view this itinerary.",
        });
      }
    } else {
      // Revert if failed
      setIsPublic(!newIsPublic);
      toast({
        title: "Error",
        description: "Failed to update sharing settings.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleDelete = async () => {
    if (!itinerary) return;
    
    const success = await deleteItinerary(itinerary.id);
    
    if (success) {
      toast({
        title: "Itinerary deleted",
        description: "Your itinerary has been permanently deleted.",
      });
      navigate('/itineraries');
    } else {
      toast({
        title: "Error",
        description: "Failed to delete itinerary.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Loading itinerary...</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Itinerary not found</div>
      </div>
    );
  }

  const totalDays = itinerary.destinations.length > 0
    ? differenceInDays(
        parseISO(itinerary.destinations[itinerary.destinations.length - 1].endDate),
        parseISO(itinerary.destinations[0].startDate)
      ) + 1
    : 0;

  const isOwner = user?.id === itinerary.userId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{itinerary.title}</h1>
          {itinerary.description && (
            <p className="text-muted-foreground mt-1">{itinerary.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{totalDays} days</span>
            <span>•</span>
            <span>{itinerary.destinations.length} destinations</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/itinerary/${itineraryId}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-6">
        {itinerary.destinations.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No destinations in this itinerary.</p>
          </div>
        ) : (
          itinerary.destinations.map((destination, index) => (
            <ItineraryDestinationCard 
              key={destination.id} 
              destination={destination} 
              index={index}
            />
          ))
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Itinerary</DialogTitle>
            <DialogDescription>
              Make your itinerary public to share it with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isPublic} 
                onCheckedChange={handleTogglePublic}
                id="public-itinerary"
              />
              <Label htmlFor="public-itinerary">Make itinerary public</Label>
            </div>
            
            {isPublic && shareUrl && (
              <div className="space-y-2">
                <Label htmlFor="share-link">Share link</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleCopyLink}>Copy</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Itinerary</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ItineraryDestinationCardProps {
  destination: ItineraryDestination;
  index: number;
}

function ItineraryDestinationCard({ destination, index }: ItineraryDestinationCardProps) {
  const startDate = parseISO(destination.startDate);
  const endDate = parseISO(destination.endDate);
  const days = differenceInDays(endDate, startDate) + 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm font-medium">
                {index + 1}
              </span>
              {destination.name}
            </CardTitle>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Destination ID: {destination.destinationId}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{days} {days === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">From:</span>{' '}
              <span className="font-medium">{format(startDate, 'MMM d, yyyy')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">To:</span>{' '}
              <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {destination.notes && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm whitespace-pre-line">{destination.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
