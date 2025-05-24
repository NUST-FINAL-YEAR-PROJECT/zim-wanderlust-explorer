
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserItineraries, deleteItinerary } from "@/models/Itinerary";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Calendar, MapPin, Users, Share2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ItinerariesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: itineraries = [], isLoading, error } = useQuery({
    queryKey: ['user-itineraries', user?.id],
    queryFn: () => getUserItineraries(user?.id || ''),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItinerary,
    onSuccess: () => {
      toast.success("Itinerary deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['user-itineraries', user?.id] });
    },
    onError: (error) => {
      console.error('Error deleting itinerary:', error);
      toast.error("Failed to delete itinerary");
    }
  });

  const filteredItineraries = itineraries.filter(itinerary => {
    const matchesSearch = !searchQuery || 
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const now = new Date();
    // Extract dates from destinations
    const dates = itinerary.destinations.map(dest => ({
      start: dest.startDate ? new Date(dest.startDate) : null,
      end: dest.endDate ? new Date(dest.endDate) : null
    }));
    
    const startDate = dates.length > 0 ? dates[0]?.start : null;
    const endDate = dates.length > 0 ? dates[dates.length - 1]?.end : null;
    
    let matchesTab = true;
    if (activeTab === "upcoming") {
      matchesTab = startDate ? startDate > now : true;
    } else if (activeTab === "past") {
      matchesTab = endDate ? endDate < now : false;
    }
    
    return matchesSearch && matchesTab;
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleShare = async (itinerary: any) => {
    if (itinerary.shareCode) {
      const shareUrl = `${window.location.origin}/share/${itinerary.shareCode}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center p-12">
          <h2 className="text-xl font-medium text-destructive">Error loading itineraries</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Itineraries</h1>
          <p className="text-muted-foreground">Plan and manage your travel adventures</p>
        </div>
        <Button onClick={() => navigate('/itinerary/create')} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Itinerary
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search itineraries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Itineraries</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItineraries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {searchQuery ? "No itineraries found" : "No itineraries yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first itinerary to start planning your adventure"
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/itinerary/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Itinerary
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => {
                // Extract dates from destinations
                const dates = itinerary.destinations.map(dest => ({
                  start: dest.startDate ? new Date(dest.startDate) : null,
                  end: dest.endDate ? new Date(dest.endDate) : null
                }));
                
                const startDate = dates.length > 0 ? dates[0]?.start : null;
                const endDate = dates.length > 0 ? dates[dates.length - 1]?.end : null;

                return (
                  <Card key={itinerary.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{itinerary.title}</CardTitle>
                          {itinerary.description && (
                            <CardDescription className="line-clamp-2">
                              {itinerary.description}
                            </CardDescription>
                          )}
                        </div>
                        {itinerary.isPublic && (
                          <Badge variant="secondary" className="ml-2">Public</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {(startDate || endDate) && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>
                              {startDate && format(startDate, 'MMM d, yyyy')}
                              {startDate && endDate && ' - '}
                              {endDate && format(endDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/itineraries/${itinerary.id}`)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                            
                            {itinerary.shareCode && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShare(itinerary)}
                              >
                                <Share2 className="mr-1 h-4 w-4" />
                                Share
                              </Button>
                            )}
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Itinerary</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{itinerary.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(itinerary.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
