'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const FloatingMessage = ({ message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0 && message.type !== 'error') {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, message.type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4";
    switch (message.type) {
      case 'success':
        return `${baseStyles} border-l-green-500 bg-green-50 text-green-800`;
      case 'error':
        return `${baseStyles} border-l-red-500 bg-red-50 text-red-800`;
      case 'warning':
        return `${baseStyles} border-l-yellow-500 bg-yellow-50 text-yellow-800`;
      default:
        return `${baseStyles} border-l-blue-500 bg-blue-50 text-blue-800`;
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          ${getStyles()}
          rounded-lg shadow-lg p-4 flex items-start gap-3
          backdrop-blur-sm
        `}
        style={{
          boxShadow: 'var(--dropShadow)',
          borderRadius: 'var(--radius)'
        }}
      >
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {message.title && (
            <h4 className="font-medium text-sm mb-1">
              {message.title}
            </h4>
          )}
          <p className="text-sm opacity-90">
            {message.description || message.message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FloatingMessage;