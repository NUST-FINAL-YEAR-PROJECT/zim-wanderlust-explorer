
import React from 'react';

interface PriceSummaryProps {
  ticketPrice: number;
  numberOfPeople: number;
  totalPrice: number;
}

const PriceSummary = ({ ticketPrice, numberOfPeople, totalPrice }: PriceSummaryProps) => {
  return (
    <div className="bg-secondary p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Ticket Price:</span>
        <span>${ticketPrice.toFixed(2)} × {numberOfPeople}</span>
      </div>
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total Amount:</span>
        <span className="text-primary">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
