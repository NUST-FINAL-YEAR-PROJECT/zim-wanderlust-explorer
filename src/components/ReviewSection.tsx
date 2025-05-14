
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDestinationReviews, getUserReviewForDestination, createReview, updateReview, deleteReview, Review } from "@/models/Review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingDisplay } from "@/components/RatingDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon, Edit, Trash2, Check, X } from "lucide-react";
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
import { format } from "date-fns";

interface ReviewSectionProps {
  destinationId: string;
}

export function ReviewSection({ destinationId }: ReviewSectionProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all reviews for this destination
        const reviewsData = await getDestinationReviews(destinationId);
        setReviews(reviewsData || []);
        
        // If user is logged in, check if they have already reviewed
        if (user) {
          const userReviewData = await getUserReviewForDestination(user.id, destinationId);
          setUserReview(userReviewData);
          
          if (userReviewData) {
            setRating(userReviewData.rating);
            setComment(userReviewData.comment || "");
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [destinationId, user]);

  const handleSubmitReview = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && userReview) {
        // Update existing review
        const updated = await updateReview(userReview.id, {
          rating,
          comment: comment.trim() || null,
        });
        
        if (updated) {
          setUserReview(updated);
          setReviews(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
          setFormOpen(false);
          setIsEditing(false);
        }
      } else {
        // Create new review
        const newReview = await createReview({
          user_id: user.id,
          destination_id: destinationId,
          rating,
          comment: comment.trim() || null,
        });
        
        if (newReview) {
          setUserReview(newReview);
          // Add profile information to the new review for display purposes
          const reviewWithProfile = {
            ...newReview,
            profiles: {
              first_name: profile?.first_name || "",
              last_name: profile?.last_name || "",
              avatar_url: profile?.avatar_url || null
            }
          };
          setReviews(prev => [reviewWithProfile, ...prev]);
          setFormOpen(false);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    const success = await deleteReview(userReview.id);
    
    if (success) {
      setUserReview(null);
      setReviews(prev => prev.filter(r => r.id !== userReview.id));
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleRatingClick(value)}
            className="p-0 w-10 h-10"
          >
            <StarIcon 
              className={`h-8 w-8 ${value <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
            />
          </Button>
        ))}
      </div>
    );
  };

  const getInitials = (review: any) => {
    if (review.profiles) {
      const { first_name, last_name } = review.profiles;
      if (first_name && last_name) return `${first_name[0]}${last_name[0]}`.toUpperCase();
      if (first_name) return first_name[0].toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderForm = () => {
    if (!formOpen) return null;
    
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitReview(); }}>
            <h3 className="font-medium mb-2">
              {isEditing ? "Edit your review" : "Write a review"}
            </h3>
            
            {renderStarRating()}
            
            <Textarea
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  setIsEditing(false);
                  if (userReview) {
                    setRating(userReview.rating);
                    setComment(userReview.comment || "");
                  } else {
                    setRating(0);
                    setComment("");
                  }
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={rating === 0 || isSubmitting}
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderReviewActions = (review: Review) => {
    if (!user || user.id !== review.user_id) return null;
    
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(true);
            setFormOpen(true);
          }}
          className="p-1 h-auto"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete review?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Your review will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteReview}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        
        {user && !formOpen && !loading && (
          <Button
            onClick={() => {
              setFormOpen(true);
              setIsEditing(!!userReview);
            }}
            variant="outline"
          >
            {userReview ? "Edit Review" : "Write a Review"}
          </Button>
        )}
      </div>

      {renderForm()}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.profiles?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(review)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">
                          {review.profiles?.first_name && review.profiles?.last_name
                            ? `${review.profiles.first_name} ${review.profiles.last_name}`
                            : "Anonymous User"}
                        </div>
                        <div className="flex items-center">
                          <RatingDisplay rating={review.rating} />
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {renderReviewActions(review)}
                    </div>
                    
                    {review.comment && (
                      <div className="mt-2 text-sm">{review.comment}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {(!user && !loading) && (
        <div className="text-center py-4 border rounded-md">
          <p className="text-muted-foreground mb-2">Log in to share your review</p>
          <Button
            onClick={() => window.location.href = '/auth'}
            variant="outline"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
