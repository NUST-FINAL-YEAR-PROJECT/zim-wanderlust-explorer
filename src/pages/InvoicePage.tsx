
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking } from '@/models/Booking';
import { getPaymentByBookingId } from '@/models/Payment';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  
  // Fetch booking details
  const { data: booking, isLoading: bookingLoading, error: bookingError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id as string),
    enabled: !!id
  });

  // Fetch payment details using booking ID instead of payment_id
  const { data: payment, isLoading: paymentLoading, error: paymentError } = useQuery({
    queryKey: ['payment-by-booking', id],
    queryFn: () => getPaymentByBookingId(id as string),
    enabled: !!id
  });

  const isLoading = bookingLoading || paymentLoading;

  useEffect(() => {
    // Show console logs to debug
    console.log('Booking ID from params:', id);
    if (booking) {
      console.log('Booking data:', booking);
    }
    if (payment) {
      console.log('Payment data:', payment);
    }
    if (bookingError) {
      console.error('Booking error:', bookingError);
    }
    if (paymentError) {
      console.error('Payment error:', paymentError);
    }
  }, [id, booking, payment, bookingError, paymentError]);

  const downloadAsPDF = async () => {
    if (!invoiceRef.current) {
      toast.error("Cannot find invoice content to download");
      return;
    }

    setDownloadingPdf(true);
    toast.info("Preparing PDF download...");
    
    try {
      // Use scale of 2 for better quality
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${booking?.id.slice(0, 8)}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const downloadAsImage = async () => {
    if (!invoiceRef.current) {
      toast.error("Cannot find invoice content to download");
      return;
    }

    setDownloadingImage(true);
    toast.info("Preparing image download...");
    
    try {
      // Use scale of 2 for better quality
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `invoice-${booking?.id ? booking.id.slice(0, 8) : 'download'}.png`;
      document.body.appendChild(link); // This is important for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setDownloadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[600px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The booking you're looking for doesn't exist or has been removed.
            {bookingError && (
              <span className="block text-sm mt-2 text-red-600">
                Error: {bookingError.message || 'Failed to load booking'}
              </span>
            )}
          </p>
          <Button onClick={() => navigate('/bookings')}>
            Back to My Bookings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Create a default payment object if payment is not found
  const defaultPayment = {
    id: 'pending',
    status: 'pending',
    payment_method: 'Online Payment',
    updated_at: booking.created_at
  };

  const paymentData = payment || defaultPayment;

  const bookingDate = booking.preferred_date 
    ? new Date(booking.preferred_date).toLocaleDateString() 
    : 'Not specified';

  const createdDate = booking.created_at
    ? new Date(booking.created_at).toLocaleDateString()
    : new Date().toLocaleDateString();

  const paymentDate = paymentData.updated_at 
    ? new Date(paymentData.updated_at).toLocaleDateString() 
    : 'Pending';

  // Helper function to get destination/event name
  const getBookingName = () => {
    if (booking.booking_details?.destination_name) {
      return booking.booking_details.destination_name;
    }
    if (booking.booking_details?.event_name) {
      return booking.booking_details.event_name;
    }
    if (booking.destination_id) {
      return "Destination Booking";
    }
    if (booking.event_id) {
      return "Event Booking";
    }
    return "Travel Booking";
  };

  // Helper function to get location
  const getBookingLocation = () => {
    if (booking.booking_details?.destination_location) {
      return booking.booking_details.destination_location;
    }
    if (booking.booking_details?.event_location) {
      return booking.booking_details.event_location;
    }
    return "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Invoice</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              Back to Bookings
            </Button>
            <Button 
              variant="outline"
              onClick={downloadAsImage}
              disabled={downloadingImage}
            >
              <FileDown className="mr-2 h-4 w-4" /> 
              {downloadingImage ? "Downloading..." : "Download as Image"}
            </Button>
            <Button 
              onClick={downloadAsPDF}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={downloadingPdf}
            >
              <FileDown className="mr-2 h-4 w-4" /> 
              {downloadingPdf ? "Downloading..." : "Download as PDF"}
            </Button>
          </div>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-8">
            <div ref={invoiceRef} className="bg-white p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Travel Adventures</h2>
                  <p className="text-muted-foreground">123 Adventure Street, Travel City</p>
                  <p className="text-muted-foreground">contact@traveladventures.com</p>
                  <p className="text-muted-foreground">+1 234-567-8901</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">INVOICE</h3>
                  <p className="text-muted-foreground">#{booking.id.slice(0, 8)}</p>
                  <p className="text-muted-foreground">Date: {createdDate}</p>
                </div>
              </div>

              <div className="border-t border-b py-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold">Bill To:</h3>
                    <p>{booking.contact_name}</p>
                    <p>{booking.contact_email}</p>
                    <p>{booking.contact_phone}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold">Payment Status:</h3>
                    <p className={`uppercase font-medium ${
                      paymentData.status === 'completed' ? 'text-green-600' : 
                      paymentData.status === 'processing' ? 'text-amber-600' : 
                      'text-blue-600'
                    }`}>
                      {paymentData.status}
                    </p>
                    <p>Payment Date: {paymentDate}</p>
                  </div>
                </div>

                <h3 className="font-bold mb-2">Booking Details:</h3>
                <p>{getBookingName()}</p>
                {getBookingLocation() && (
                  <p className="text-muted-foreground">{getBookingLocation()}</p>
                )}
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">
                      {getBookingName()}
                      <div className="text-sm text-muted-foreground">
                        Travel Date: {bookingDate}
                      </div>
                    </td>
                    <td className="text-right py-2">{booking.number_of_people}</td>
                    <td className="text-right py-2">
                      $
                      {booking.booking_details?.price_per_person || 
                        (booking.total_price / booking.number_of_people).toFixed(2)}
                    </td>
                    <td className="text-right py-2">${booking.total_price.toFixed(2)}</td>
                  </tr>
                  
                  <tr className="font-bold">
                    <td colSpan={3} className="text-right py-4">Total</td>
                    <td className="text-right py-4">${booking.total_price.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Payment Information:</h3>
                  <p>Payment Method: {paymentData.payment_method}</p>
                  <p>Payment ID: {paymentData.id === 'pending' ? 'Pending' : paymentData.id.slice(0, 8)}</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Notes:</h3>
                  <p className="text-sm">
                    Thank you for choosing Travel Adventures! For any questions regarding this invoice, 
                    please contact our customer support team.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoicePage;
