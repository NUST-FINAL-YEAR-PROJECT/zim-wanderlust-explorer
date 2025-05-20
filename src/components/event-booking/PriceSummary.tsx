
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
      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">Price Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-800">
          <span className="font-medium text-blue-700 dark:text-blue-300">Ticket Price:</span>
          <span className="text-blue-800 dark:text-blue-200">${ticketPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-800">
          <span className="font-medium text-blue-700 dark:text-blue-300">Number of People:</span>
          <span className="text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
            {numberOfPeople}
          </span>
        </div>

        <motion.div 
          className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span className="text-lg font-bold text-blue-900 dark:text-white">Total Amount:</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-300">${totalPrice.toFixed(2)}</span>
        </motion.div>
        
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-xs text-blue-500 dark:text-blue-400">
          <p>* Prices include all applicable taxes and fees</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSummary;
