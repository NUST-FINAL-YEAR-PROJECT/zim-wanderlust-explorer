
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking, updateBooking } from '@/models/Booking';
import { getPayment, updatePayment } from '@/models/Payment';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, FileDown, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch booking details
  const { data: booking, isLoading: bookingLoading, refetch: refetchBooking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id as string),
    enabled: !!id
  });

  // Fetch payment details when booking is loaded
  const { data: payment, isLoading: paymentLoading, refetch: refetchPayment } = useQuery({
    queryKey: ['payment', booking?.payment_id],
    queryFn: () => getPayment(booking?.payment_id as string),
    enabled: !!booking?.payment_id
  });

  const isLoading = bookingLoading || paymentLoading;

  // Log data for debugging
  useEffect(() => {
    if (booking) {
      console.log('Booking details:', booking);
    }
    if (payment) {
      console.log('Payment details:', payment);
    }
  }, [booking, payment]);

  // Get the payment URL from the booking record
  const getPaymentUrl = () => {
    try {
      // First try to get the payment URL from the booking details
      if (booking?.booking_details?.payment_url) {
        return booking.booking_details.payment_url;
      }
      
      // Then try to get the payment reference from the payment record
      if (payment?.payment_gateway_reference) {
        return payment.payment_gateway_reference;
      }
      
      // If there's a destination ID, we can use it to construct a URL to get the payment URL
      if (booking?.destination_id) {
        return `https://gduzxexxpbibimtiycur.supabase.co/rest/v1/destinations?id=eq.${booking.destination_id}&select=payment_url`;
      }
      
      // If there's an event ID, we can use it to construct a URL to get the payment URL
      if (booking?.event_id) {
        return `https://gduzxexxpbibimtiycur.supabase.co/rest/v1/events?id=eq.${booking.event_id}&select=payment_url`;
      }
      
      // If we couldn't find a payment URL, return null
      return null;
    } catch (error) {
      console.error('Error getting payment URL:', error);
      return null;
    }
  };

  const copyPaymentLink = () => {
    try {
      const paymentUrl = getPaymentUrl();
      if (paymentUrl) {
        navigator.clipboard.writeText(paymentUrl);
        toast.success("Payment link copied to clipboard!");
      } else {
        toast.error("Payment link not found. Please contact support.");
      }
    } catch (error) {
      console.error('Error copying payment link:', error);
      toast.error('Failed to copy payment link. Please try again.');
    }
  };

  const goToPayment = () => {
    try {
      const paymentUrl = getPaymentUrl();
      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
      } else {
        toast.error("Payment link not found. Please contact support.");
      }
    } catch (error) {
      console.error('Error navigating to payment:', error);
      toast.error('Failed to open payment page. Please try again.');
    }
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !booking) {
      toast.error('No file selected or booking information is missing.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${booking.id}-proof.${fileExt}`;
      const filePath = `payment_proofs/${fileName}`;

      // Create the storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('payment_proofs');
      
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket('payment_proofs', {
          public: false,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
          fileSizeLimit: 5242880, // 5MB
        });
      }
      
      // Upload file
      const { data, error } = await supabase.storage
        .from('payment_proofs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }

      const fileUrl = `${supabase.storageUrl}/object/public/payment_proofs/${fileName}`;
      
      // Update booking and payment records
      await updateBooking(booking.id, {
        payment_proof_url: fileUrl,
        payment_proof_uploaded_at: new Date().toISOString(),
      });

      await updatePayment(payment?.id as string, {
        status: 'processing',
        payment_details: {
          ...payment?.payment_details,
          proof_uploaded: true,
          proof_uploaded_at: new Date().toISOString()
        }
      });

      toast.success("Payment proof uploaded successfully!");
      
      // Refetch data
      refetchBooking();
      refetchPayment();
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast.error('Error uploading payment proof. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // For demo purposes - let's simulate payment completion
  const simulatePaymentCompletion = async () => {
    if (!booking || !payment) {
      toast.error('Booking or payment information is missing.');
      return;
    }
    
    try {
      toast.info("Processing payment...");
      
      // Update payment status to completed
      await updatePayment(payment.id, {
        status: 'completed',
        updated_at: new Date().toISOString(),
        payment_details: {
          ...payment.payment_details,
          completed_at: new Date().toISOString()
        }
      });
      
      // Update booking payment status
      await updateBooking(booking.id, {
        payment_status: 'completed'
      });
      
      toast.success("Payment completed successfully!");
      refetchBooking();
      refetchPayment();
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error('Error completing payment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking || !payment) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking or Payment Not Found</h2>
          <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/bookings')}>
            Back to My Bookings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/bookings')}
          >
            Back to Bookings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First card - booking summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>
                Booking #{booking?.id.slice(0, 8)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ... keep existing code (booking summary details) */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-medium">{booking?.booking_details?.destination_name || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date(booking?.preferred_date || "").toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of people:</span>
                  <span className="font-medium">{booking?.number_of_people}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-green-700">${booking?.total_price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Name:</span> {booking?.contact_name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {booking?.contact_email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {booking?.contact_phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Second card - payment status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>
                Payment #{payment?.id.slice(0, 8)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 border rounded-lg">
                <div className={`text-center ${payment?.status === 'completed' ? 'text-green-600' : payment?.status === 'processing' ? 'text-amber-600' : 'text-blue-600'}`}>
                  <div className="text-lg font-bold uppercase mb-1">
                    {payment?.status || 'pending'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payment?.status === 'completed' ? 
                      'Your payment has been processed successfully.' : 
                      payment?.status === 'processing' ? 
                      'Your payment is being processed.' : 
                      'Payment is pending. Please complete your payment.'}
                  </div>
                </div>
              </div>
              
              {payment?.status === 'pending' && (
                <div className="space-y-4 pt-2">
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="font-medium mb-2">Payment Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Click the "Go to Payment" button below to proceed with payment</li>
                      <li>Complete the payment on the provider's website</li>
                      <li>Upload your payment receipt or screenshot as proof</li>
                      <li>Wait for confirmation from our team</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={goToPayment}
                      disabled={!getPaymentUrl()}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Go to Payment
                    </Button>
                    
                    {/* For demo purposes - simulate payment completion */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={simulatePaymentCompletion}
                    >
                      <Check className="mr-2 h-4 w-4" /> Simulate Payment Completion
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={copyPaymentLink}
                        disabled={!getPaymentUrl()}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy Payment Link
                      </Button>
                      
                      <label className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled={isUploading}
                          onClick={() => document.getElementById('proof-upload')?.click()}
                        >
                          {isUploading ? "Uploading..." : "Upload Payment Proof"}
                        </Button>
                        <input 
                          type="file" 
                          id="proof-upload" 
                          accept="image/*,application/pdf" 
                          className="hidden" 
                          onChange={handleUploadProof}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {payment?.status === 'processing' && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="font-medium mb-2">Payment Verification</h3>
                  <p className="text-sm">
                    Your payment is currently being verified. We'll update your booking status once the payment has been confirmed.
                  </p>
                </div>
              )}
              
              {payment?.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium">Payment Verified</h3>
                  </div>
                  <p className="text-sm mb-3">
                    Your payment has been verified and your booking is confirmed. You can download your invoice below.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/invoice/${booking?.id}`)}
                  >
                    <FileDown className="mr-2 h-4 w-4" /> View Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
