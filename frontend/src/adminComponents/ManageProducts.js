import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3020/api/admin/products/get-pending-products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error Fetching Products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update product status in state
  const updateProductStatus = (productId, status) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.product_id._id === productId
          ? { ...product, approval_status: status }
          : product
      )
    );
  };

  // Approve product
  const handleApprove = async (productId) => {
    try {
      await axios.put(`http://localhost:3020/api/admin/products/approve/${productId}`);
      alert('Product Approved for Auction Successfully!');
      updateProductStatus(productId, 'approved');
    } catch (error) {
      console.error('Error Approving Product:', error);
      alert('Error Approving Product.');
    }
  };

  // Decline product
  const handleDecline = async (productId) => {
    try {
      await axios.get(`http://localhost:3020/api/admin/products/decline/${productId}`);
      alert('Product Declined!');
      updateProductStatus(productId, 'rejected');
    } catch (error) {
      console.error('Error Declining Product:', error);
      alert('Error Declining Product.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-12">Approve or Decline Products for Auction</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.product_id._id}
              className="border p-4 rounded shadow-lg h-96 flex flex-col justify-between hover:shadow-xl hover:scale-105 transition-transform"
            >
              {/* Product Image */}
              {product.product_id.images?.length > 0 && (
                <img
                  src={product.product_id.images[0] || 'https://via.placeholder.com/150'}
                  alt={product.product_id.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}

              {/* Product Details */}
              <div className="flex-grow">
                <h2 className="text-lg font-bold mb-2">{product.product_id.name}</h2>
                <p className="text-sm text-gray-600 mb-2">Category: {product.product_id.category}</p>
                <p className="text-sm text-gray-500 mb-4 truncate">{product.product_id.description}</p>
                <p className="text-sm font-medium mb-4">
                  Seller: <span className="text-gray-700">{product.bidder_id?.username || 'N/A'}</span>
                </p>
                <p className="text-sm text-blue-600 mb-2">
                  Status: <strong>{product.approval_status}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-auto">
                <button
                  onClick={() => handleApprove(product.product_id._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(product.product_id._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No pending or rejected products found.</div>
      )}
    </div>
  );
};

export default ManageProducts;
