import React, { useEffect, useState } from 'react';
import { getRequest, putRequest } from '../axios';
import { toast, ToastContainer } from 'react-toastify';
import Loading from "../components/Loading"
import { Search } from 'lucide-react';
import ProductDetailsModal from '../components/ProductDetailsModal';

const ProductsApproval = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/products/get-pending-products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        toast.error('Error fetching products');
        console.error('Error Fetching Products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let updatedProducts = [...products];

    // Apply Search
    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply Filter
    if (filterStatus !== 'All') {
      updatedProducts = updatedProducts.filter(product => product.approval_status === filterStatus);
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, filterStatus, products]);

  const handleApprove = async (productId) => {
    try {
      console.log(productId)
      await putRequest(`http://localhost:5000/api/admin/products/approve/${productId}`);
      toast.success('Product Approved ');
      setProducts(products.map(product =>
        product._id === productId ? { ...product, approval_status: 'Approved' } : product
      ));
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Error approving product');
    }
  };

  const handleDecline = async (productId) => {
    try {
      await putRequest(`http://localhost:5000/api/admin/products/decline/${productId}`);
      toast.warn('Product Declined!');
      setProducts(products.map(product =>
        product._id === productId ? { ...product, approval_status: 'Rejected' } : product
      ));
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Error declining product');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pt-14 md:p-4">
      <ToastContainer />
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a5274] mb-4 md:mb-6">Products Approval</h1>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
        <div className="relative w-full md:w-1/2 shadow-md">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 border rounded w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <select
          className="border p-2 rounded-md w-full md:w-1/4 shadow-md"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          
          <option value="All">All Products</option>
          <option value="Pending">Pending Products</option>
          <option value="Approved">Approved Products</option>
          <option value="Rejected">Rejected Products</option>
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredProducts.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md flex flex-col justify-between transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
              {/* Product Image */}
              {product.images?.length > 0 && (
                <img
                  src={product.images[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}

              {/* Product Name */}
              <h2 className="text-lg font-bold mb-2">{product.name}</h2>

              {/* Category */}
              <p className="text-sm font-medium mb-2">
                Category: <span className='text-gray-600'>{product.category}</span>
              </p>

              {/* Seller Name */}
              <p className="text-md font-medium mb-2">
                Seller: <span className="text-gray-600">{product?.seller_id?.username || 'N/A'}</span>
              </p>

              {/* Approval and Listing Status */}
              <div className="flex gap-2 mb-6 w-fit">
                
                <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex 
                    ${product.approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    product.approval_status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                  {product.approval_status}
                </span>

                <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex 
                     ${product.listing_status === 'Inauction' ? 'bg-green-100 text-green-700'
                    : product.listing_status === 'Listed' ? 'bg-yellow-100 text-yellow-800'
                      : ''}`}>
                  {product.listing_status}
                </span>
              </div>

              {/* View Details Button */}
              <button onClick={() => setSelectedProduct(product)}
                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>No products found.</div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}/>
      )}
    </div>
  );
};

export default ProductsApproval;
