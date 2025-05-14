
import React from 'react';

interface PriceSummaryProps {
  ticketPrice: number;
  numberOfPeople: number;
  totalPrice: number;
}

const PriceSummary = ({ ticketPrice, numberOfPeople, totalPrice }: PriceSummaryProps) => {
  return (
    <div className="bg-[#F1F0FB]/60 p-4 rounded-lg border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-2 font-body">
        <span className="font-medium text-[#6366F1]">Ticket Price:</span>
        <span>${ticketPrice.toFixed(2)} × {numberOfPeople}</span>
      </div>
      <div className="flex justify-between items-center font-bold text-lg">
        <span className="text-[#6366F1] font-display">Total Amount:</span>
        <span className="text-[#4ADE80] font-display">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
