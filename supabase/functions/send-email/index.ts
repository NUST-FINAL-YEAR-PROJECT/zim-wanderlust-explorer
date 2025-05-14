
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded content
  }>;
}

const emailTemplates = {
  bookingConfirmation: (booking: any) => ({
    subject: "Your Booking Has Been Confirmed - DiscoverZim",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Booking Confirmation</h1>
        </div>
        <div style="margin-bottom: 20px;">
          <p>Dear ${booking.contact_name},</p>
          <p>We're pleased to confirm your booking with DiscoverZim!</p>
          <p>Your booking reference is: <strong>${booking.id.substring(0, 8).toUpperCase()}</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-top: 0;">Booking Details:</h2>
          <p><strong>Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString()}</p>
          <p><strong>Number of People:</strong> ${booking.number_of_people}</p>
          <p><strong>Total Amount:</strong> $${booking.total_price.toFixed(2)}</p>
          ${booking.destination_id ? `<p><strong>Destination:</strong> ${booking.booking_details?.destination_name || 'Not specified'}</p>` : ''}
          ${booking.event_id ? `<p><strong>Event:</strong> ${booking.booking_details?.event_name || 'Not specified'}</p>` : ''}
        </div>
        <div style="margin-bottom: 20px;">
          <p>Thank you for choosing DiscoverZim. If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>The DiscoverZim Team</p>
        </div>
        <div style="font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    `,
    text: `
      Booking Confirmation
      
      Dear ${booking.contact_name},
      
      We're pleased to confirm your booking with DiscoverZim!
      
      Your booking reference is: ${booking.id.substring(0, 8).toUpperCase()}
      
      Booking Details:
      Date: ${new Date(booking.preferred_date).toLocaleDateString()}
      Number of People: ${booking.number_of_people}
      Total Amount: $${booking.total_price.toFixed(2)}
      ${booking.destination_id ? `Destination: ${booking.booking_details?.destination_name || 'Not specified'}` : ''}
      ${booking.event_id ? `Event: ${booking.booking_details?.event_name || 'Not specified'}` : ''}
      
      Thank you for choosing DiscoverZim. If you have any questions, please don't hesitate to contact us.
      
      Best regards,
      The DiscoverZim Team
      
      This is an automated email, please do not reply.
    `
  }),
  paymentConfirmation: (booking: any) => ({
    subject: "Payment Confirmation - DiscoverZim",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Payment Confirmation</h1>
        </div>
        <div style="margin-bottom: 20px;">
          <p>Dear ${booking.contact_name},</p>
          <p>We've received your payment for booking reference: <strong>${booking.id.substring(0, 8).toUpperCase()}</strong></p>
          <p>Thank you for completing your payment. Your booking is now confirmed.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-top: 0;">Payment Details:</h2>
          <p><strong>Amount Paid:</strong> $${booking.total_price.toFixed(2)}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> Completed</p>
        </div>
        <div style="margin-bottom: 20px;">
          <p>We look forward to providing you with a memorable experience.</p>
          <p>Best regards,</p>
          <p>The DiscoverZim Team</p>
        </div>
        <div style="font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    `,
    text: `
      Payment Confirmation
      
      Dear ${booking.contact_name},
      
      We've received your payment for booking reference: ${booking.id.substring(0, 8).toUpperCase()}
      
      Thank you for completing your payment. Your booking is now confirmed.
      
      Payment Details:
      Amount Paid: $${booking.total_price.toFixed(2)}
      Payment Date: ${new Date().toLocaleDateString()}
      Payment Status: Completed
      
      We look forward to providing you with a memorable experience.
      
      Best regards,
      The DiscoverZim Team
      
      This is an automated email, please do not reply.
    `
  }),
  bookingCancellation: (booking: any) => ({
    subject: "Booking Cancellation - DiscoverZim",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Booking Cancellation</h1>
        </div>
        <div style="margin-bottom: 20px;">
          <p>Dear ${booking.contact_name},</p>
          <p>Your booking with reference <strong>${booking.id.substring(0, 8).toUpperCase()}</strong> has been cancelled.</p>
          ${booking.cancellation_reason ? `<p><strong>Reason:</strong> ${booking.cancellation_reason}</p>` : ''}
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-top: 0;">Booking Details:</h2>
          <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Original Booking Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString()}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <p>If you have any questions about this cancellation or would like to make a new booking, please don't hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>The DiscoverZim Team</p>
        </div>
        <div style="font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    `,
    text: `
      Booking Cancellation
      
      Dear ${booking.contact_name},
      
      Your booking with reference ${booking.id.substring(0, 8).toUpperCase()} has been cancelled.
      ${booking.cancellation_reason ? `Reason: ${booking.cancellation_reason}` : ''}
      
      Booking Details:
      Cancellation Date: ${new Date().toLocaleDateString()}
      Original Booking Date: ${new Date(booking.preferred_date).toLocaleDateString()}
      
      If you have any questions about this cancellation or would like to make a new booking, please don't hesitate to contact us.
      
      Best regards,
      The DiscoverZim Team
      
      This is an automated email, please do not reply.
    `
  })
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create SMTP client
    const client = new SmtpClient();

    // Configure SMTP connection
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("GMAIL_EMAIL_USER") || "",
      password: Deno.env.get("GMAIL_APP_PASSWORD") || "",
    });

    // Parse request body
    const { templateType, bookingData, customEmail } = await req.json();
    
    let emailContent: { subject: string; html: string; text?: string };
    
    // Determine which template to use
    if (customEmail) {
      // Use custom email content
      emailContent = {
        subject: customEmail.subject,
        html: customEmail.html,
        text: customEmail.text
      };
    } else if (templateType && bookingData) {
      // Use predefined template
      switch (templateType) {
        case "bookingConfirmation":
          emailContent = emailTemplates.bookingConfirmation(bookingData);
          break;
        case "paymentConfirmation":
          emailContent = emailTemplates.paymentConfirmation(bookingData);
          break;
        case "bookingCancellation":
          emailContent = emailTemplates.bookingCancellation(bookingData);
          break;
        default:
          throw new Error("Invalid template type");
      }
    } else {
      throw new Error("Invalid request - missing template type or booking data");
    }

    // Send email
    await client.send({
      from: Deno.env.get("GMAIL_EMAIL_USER") || "",
      to: bookingData.contact_email,
      subject: emailContent.subject,
      content: emailContent.text || "",
      html: emailContent.html,
    });

    await client.close();

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send email",
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
