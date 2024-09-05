import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2g shadow-2g w-12ssssssssssss/12 md:w-2/4 lg:w-2/2 p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="overflow-auto max-h-96">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
