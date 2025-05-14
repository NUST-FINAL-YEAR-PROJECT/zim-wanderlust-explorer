
import React from 'react';

interface PriceSummaryProps {
  ticketPrice: number;
  numberOfPeople: number;
  totalPrice: number;
}

const PriceSummary = ({ ticketPrice, numberOfPeople, totalPrice }: PriceSummaryProps) => {
  return (
    <div className="bg-[#F4EBE2]/60 p-4 rounded-lg border border-[#D0A676]/20">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-[#8B5E34]">Ticket Price:</span>
        <span>${ticketPrice.toFixed(2)} × {numberOfPeople}</span>
      </div>
      <div className="flex justify-between items-center font-bold text-lg">
        <span className="text-[#8B5E34]">Total Amount:</span>
        <span className="text-[#6B8E23]">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
