import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Check, X, ThumbsDown } from "lucide-react"

const ProductDetailsModal = ({ isOpen, product, onClose, onApprove, onDecline }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0); // Reset image index when modal opens
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const images = product.images || [];

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto">
            <div className="bg-white w-[60%] sm:w-[400px] md:w-[45%] h-[70vh] mt-12 mt-20 md:mt-12 sm:mt-14 rounded-lg shadow-lg transform transition-all duration-1000 ease-in-out animate-slideDown overflow-hidden">
                <div className="h-full overflow-y-auto p-6">
    
                    {/* Product Image Carousel */}
                    <div className="relative h-44 sm:h-64 md:h-80 mb-6 flex items-center justify-center rounded-lg bg-gray-100">
                        {images.length > 0 && (
                            <img
                                src={images[currentImageIndex]}
                                alt={`Product ${currentImageIndex + 1}`}
                                className="max-h-full max-w-full object-contain transition-all duration-500" />
                        )}
    
                        {/* Left Arrow */}
                        {images.length > 1 && (
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
    
                        {/* Right Arrow */}
                        {images.length > 1 && (
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
    
                    {/* Product Details */}
                    <p className="text-gray-600 mb-2"><strong>Category:</strong> {product.category}</p>
                    <p className="text-gray-700 mb-6"><strong>Seller:</strong> {product.seller_id?.username || "N/A"}</p>
    
                    {/* Buttons */}
                    <div className="flex justify-between sm:justify-end gap-4 mt-4 flex-wrap">
                        <button
                            onClick={() => onApprove(product._id)}
                            className="bg-green-500 text-white px-3 py-1 font-semibold rounded-lg text-md hover:bg-green-600 transition w-full sm:w-auto mb-2 sm:mb-0">
                            Approve
                        </button>
                        <button
                            onClick={() => onDecline(product._id)}
                            className="bg-red-500 text-white px-3 py-1 font-semibold rounded-lg text-md hover:bg-red-600 transition w-full sm:w-auto mb-2 sm:mb-0">
                            Decline
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-3 py-1  font-semibold rounded-lg text-md hover:bg-gray-600 transition w-full sm:w-auto">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
