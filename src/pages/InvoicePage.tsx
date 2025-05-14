
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking } from '@/models/Booking';
import { getPayment } from '@/models/Payment';
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
  
  // Fetch booking details
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id as string),
    enabled: !!id
  });

  // Fetch payment details when booking is loaded
  const { data: payment, isLoading: paymentLoading } = useQuery({
    queryKey: ['payment', booking?.payment_id],
    queryFn: () => getPayment(booking?.payment_id as string),
    enabled: !!booking?.payment_id
  });

  const isLoading = bookingLoading || paymentLoading;

  const downloadAsPDF = async () => {
    if (!invoiceRef.current) {
      toast.error("Cannot find invoice content to download");
      return;
    }

    toast.info("Preparing PDF download...");
    
    try {
      // Use scale of 2 for better quality
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        logging: true,
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
    }
  };

  const downloadAsImage = async () => {
    if (!invoiceRef.current) {
      toast.error("Cannot find invoice content to download");
      return;
    }

    toast.info("Preparing image download...");
    
    try {
      // Use scale of 2 for better quality
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `invoice-${booking?.id.slice(0, 8)}.png`;
      document.body.appendChild(link); // This is important for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate image. Please try again.");
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
          <h1 className="text-3xl font-bold">Invoice</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              Back to Bookings
            </Button>
            <Button 
              variant="outline"
              onClick={downloadAsImage}
            >
              <FileDown className="mr-2 h-4 w-4" /> Download as Image
            </Button>
            <Button 
              onClick={downloadAsPDF}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <FileDown className="mr-2 h-4 w-4" /> Download as PDF
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
                  <p className="text-muted-foreground">Date: {new Date(booking.created_at).toLocaleDateString()}</p>
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
                      payment.status === 'completed' ? 'text-green-600' : 
                      payment.status === 'processing' ? 'text-amber-600' : 
                      'text-blue-600'
                    }`}>
                      {payment.status}
                    </p>
                    <p>Payment Date: {payment.updated_at ? new Date(payment.updated_at).toLocaleDateString() : 'Pending'}</p>
                  </div>
                </div>

                <h3 className="font-bold mb-2">Destination:</h3>
                <p>{booking.booking_details?.destination_name || "Not specified"}</p>
                <p className="text-muted-foreground">{booking.booking_details?.destination_location || ""}</p>
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
                      {booking.booking_details?.destination_name || "Destination Booking"}
                      <div className="text-sm text-muted-foreground">
                        Travel Date: {new Date(booking.preferred_date || "").toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-right py-2">{booking.number_of_people}</td>
                    <td className="text-right py-2">${booking.booking_details?.price_per_person || (booking.total_price / booking.number_of_people).toFixed(2)}</td>
                    <td className="text-right py-2">${booking.total_price.toFixed(2)}</td>
                  </tr>
                  
                  {/* Add any additional costs here if needed */}
                  
                  <tr className="font-bold">
                    <td colSpan={3} className="text-right py-4">Total</td>
                    <td className="text-right py-4">${booking.total_price.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Payment Information:</h3>
                  <p>Payment Method: {payment.payment_method || "Online Payment"}</p>
                  <p>Payment ID: {payment.id.slice(0, 8)}</p>
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
