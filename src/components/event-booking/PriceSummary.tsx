
import React from 'react';
import { motion } from 'framer-motion';

interface PriceSummaryProps {
  ticketPrice: number;
  numberOfPeople: number;
  totalPrice: number;
}

const PriceSummary = ({ ticketPrice, numberOfPeople, totalPrice }: PriceSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-5"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-blue-700 dark:text-blue-300">Ticket Price:</span>
        <span className="text-blue-800 dark:text-blue-200">${ticketPrice.toFixed(2)} × {numberOfPeople}</span>
      </div>

      <motion.div 
        className="flex justify-between items-center font-bold text-lg pt-3 border-t border-blue-200 dark:border-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <span className="text-blue-900 dark:text-white">Total Amount:</span>
        <span className="text-blue-600 dark:text-blue-300">${totalPrice.toFixed(2)}</span>
      </motion.div>
    </motion.div>
  );
};

export default PriceSummary;
