
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Itinerary, getItinerary, updateItinerary, removeDestinationFromItinerary } from '@/models/Itinerary';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  MapPin,
  Calendar as CalendarIcon,
  Route,
  CalendarDays,
  ClipboardCopy,
  Share2,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Globe,
  Lock,
  LockOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface ItineraryViewProps {
  id: string;
  onEdit?: () => void;
  isSharedView?: boolean;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ id, onEdit, isSharedView }) => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingDestinationId, setDeletingDestinationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const data = await getItinerary(id);
      if (data) {
        setItinerary(data);
        setEditTitle(data.title);
        setEditDescription(data.description || '');
        setEditIsPublic(data.isPublic);
        
        if (data.isPublic && data.shareCode) {
          const baseUrl = window.location.origin;
          setShareUrl(`${baseUrl}/shared-itinerary/${data.shareCode}`);
        }
      } else {
        setError('Itinerary not found');
      }
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const handleEditSubmit = async () => {
    if (!itinerary) return;
    
    try {
      const success = await updateItinerary(
        itinerary.id,
        editTitle,
        editDescription,
        editIsPublic
      );
      
      if (success) {
        toast({
          title: "Itinerary updated",
          description: "Your changes have been saved successfully.",
        });
        fetchItinerary();
        setIsEditDialogOpen(false);
        if (onEdit) onEdit();
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
      toast({
        title: "Update failed",
        description: "Failed to update itinerary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDestination = async () => {
    if (!deletingDestinationId) return;
    
    try {
      const success = await removeDestinationFromItinerary(deletingDestinationId);
      
      if (success) {
        toast({
          title: "Destination removed",
          description: "The destination has been removed from your itinerary.",
        });
        fetchItinerary();
      }
    } catch (error) {
      console.error("Error removing destination:", error);
      toast({
        title: "Error",
        description: "Failed to remove destination. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingDestinationId(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    }
  };

  const isOwner = user && itinerary && user.id === itinerary.userId;
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-60 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            <div className="h-5 w-40 mt-2 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          </div>
          <div className="h-10 w-20 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        </div>
        <div className="h-40 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          <div className="h-32 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load itinerary</h3>
        <p className="text-muted-foreground mb-6">{error || "Itinerary not found"}</p>
        <Button onClick={() => navigate('/itineraries')}>Back to Itineraries</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex gap-2 items-center">
            <Route className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">{itinerary.title}</h1>
            {itinerary.isPublic ? (
              <Badge variant="outline" className="ml-2 border-green-200 bg-green-100 text-green-800">
                <Globe className="h-3 w-3 mr-1" /> Public
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-100 text-amber-800">
                <Lock className="h-3 w-3 mr-1" /> Private
              </Badge>
            )}
          </div>
          {itinerary.description && (
            <p className="text-muted-foreground mt-1">{itinerary.description}</p>
          )}
        </div>
        {isOwner && !isSharedView && (
          <div className="flex flex-wrap gap-2 self-start">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/itineraries/${itinerary.id}/add-destination`)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Destination
            </Button>

            {itinerary.isPublic && itinerary.shareCode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={copyShareLink}
              >
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Timeline view */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" /> 
            Itinerary Timeline
          </CardTitle>
          <CardDescription>
            {itinerary.destinations.length === 0 
              ? "No destinations have been added to this itinerary yet." 
              : `This itinerary includes ${itinerary.destinations.length} ${itinerary.destinations.length === 1 ? 'destination' : 'destinations'}.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {itinerary.destinations.length === 0 ? (
            <div className="text-center py-12">
              <Route className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No destinations yet</h3>
              <p className="text-muted-foreground mb-6">
                {isOwner && !isSharedView 
                  ? "Start by adding destinations to your itinerary." 
                  : "This itinerary doesn't have any destinations yet."
                }
              </p>
              {isOwner && !isSharedView && (
                <Button 
                  onClick={() => navigate(`/itineraries/${itinerary.id}/add-destination`)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add First Destination
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900"></div>
                <div className="space-y-8">
                  {itinerary.destinations.map((destination, index) => (
                    <div key={destination.id} className="relative ml-7">
                      {/* Timeline dot */}
                      <div className="absolute -left-[28px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                        {index + 1}
                      </div>
                      
                      {/* Destination card */}
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex items-center border-b border-gray-100 dark:border-gray-800">
                          <Link 
                            to={`/destinations/${destination.destinationId}`}
                            className="flex-grow p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-lg hover:text-blue-600 dark:hover:text-blue-400">
                                {destination.name}
                              </h3>
                              {isOwner && !isSharedView && (
                                <button 
                                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDeletingDestinationId(destination.id);
                                    setIsDeleteConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            {destination.startDate && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>
                                  {format(new Date(destination.startDate), "MMM d, yyyy")}
                                  {destination.endDate && ` - ${format(new Date(destination.endDate), "MMM d, yyyy")}`}
                                </span>
                              </div>
                            )}
                          </Link>
                        </div>
                        
                        {destination.notes && (
                          <CardContent className="p-4 bg-gray-50 dark:bg-gray-900/30">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {destination.notes}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Itinerary</DialogTitle>
            <DialogDescription>
              Update your itinerary details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="isPublic" 
                checked={editIsPublic} 
                onCheckedChange={setEditIsPublic}
              />
              <Label htmlFor="isPublic">Make itinerary public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this destination from your itinerary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDestination}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryView;
