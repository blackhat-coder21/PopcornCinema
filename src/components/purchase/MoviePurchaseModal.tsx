import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet, DollarSign, Users, Check } from 'lucide-react';
import { Movie } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency, formatDuration } from '../../lib/utils';
import { motion } from 'framer-motion';

interface MoviePurchaseModalProps {
  movie: Movie;
  onClose: () => void;
  onPurchase: (paymentMethod: string, splitPayment: boolean) => void;
}

export const MoviePurchaseModal: React.FC<MoviePurchaseModalProps> = ({
  movie,
  onClose,
  onPurchase,
}) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [splitPayment, setSplitPayment] = useState(false);
  
  const handleContinue = () => {
    if (step === 1 && paymentMethod) {
      setStep(2);
    } else if (step === 2) {
      onPurchase(paymentMethod, splitPayment);
    }
  };
  
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard size={24} /> },
    { id: 'upi', name: 'UPI', icon: <Smartphone size={24} /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet size={24} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-100 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="relative">
          <img 
            src={movie.thumbnailUrl} 
            alt={movie.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
            <div className="flex items-center text-gray-300 text-sm mt-1">
              <span>{movie.releaseYear}</span>
              <span className="mx-2">•</span>
              <span>{formatDuration(movie.duration)}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.rating}
              </span>
            </div>
          </div>
        </div>
        
        {/* Purchase Form */}
        <div className="p-6">
          {step === 1 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Select Payment Method
                </h4>
                <span className="text-xl font-bold text-accent-600 dark:text-accent-400 flex items-center">
                  <DollarSign size={18} />
                  {formatCurrency(movie.price || 0)}
                </span>
              </div>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                      paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                    }`}
                  >
                    <div className={`text-${paymentMethod === method.id ? 'primary' : 'gray'}-600 dark:text-${paymentMethod === method.id ? 'primary' : 'gray'}-400`}>
                      {method.icon}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {method.name}
                    </span>
                    {paymentMethod === method.id && (
                      <Check size={20} className="ml-auto text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Purchase Options
              </h4>
              
              <div className="space-y-4">
                <div
                  onClick={() => setSplitPayment(false)}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between transition-colors ${
                    !splitPayment
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                  }`}
                >
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-white">
                      Regular Purchase
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Buy just for yourself
                    </p>
                  </div>
                  <div className="text-lg font-bold text-accent-600 dark:text-accent-400">
                    {formatCurrency(movie.price || 0)}
                  </div>
                </div>
                
                <div
                  onClick={() => setSplitPayment(true)}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between transition-colors ${
                    splitPayment
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Users size={20} className="text-secondary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-white">
                        Split Payment
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Share cost with room members
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency((movie.price || 0) / 3)} <span className="text-xs">/person</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-100 dark:bg-dark-200 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {splitPayment 
                    ? "Room members will receive a payment request. The movie will be available to watch once all payments are complete."
                    : "Your purchase will be available to watch immediately and can be found in your library."}
                </p>
              </div>
            </>
          )}
          
          <div className="mt-6 flex gap-3">
            {step === 2 && (
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                fullWidth
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleContinue}
              disabled={step === 1 && !paymentMethod}
              fullWidth
            >
              {step === 1 ? 'Continue' : 'Complete Purchase'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};