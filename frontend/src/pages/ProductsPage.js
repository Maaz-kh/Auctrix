import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Filter, 
  Search, 
  MoreVertical,
  X,
  Upload
} from 'lucide-react';
import Sidebar from '../sellerComponents/Sidebar';

// Product Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Expired': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

// Product Action Dropdown
const ProductActionDropdown = ({ product, onEdit, onDelete, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      icon: Edit2, 
      label: 'Edit Product', 
      onClick: () => onEdit(product) 
    },
    { 
      icon: product.status === 'Active' ? EyeOff : Eye, 
      label: product.status === 'Active' ? 'Deactivate' : 'Activate', 
      onClick: () => onChangeStatus(product, product.status === 'Active' ? 'Inactive' : 'Active') 
    },
    { 
      icon: Trash2, 
      label: 'Delete Product', 
      onClick: () => onDelete(product) 
    }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-gray-100 rounded-full p-2"
      >
        <MoreVertical size={20} className="text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-48 bg-white shadow-lg rounded-lg border">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <action.icon className="mr-3 text-gray-500" size={16} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Product Modal Component
const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    'Vintage Clothing', 
    'Collectibles', 
    'Music', 
    'Electronics', 
    'Art', 
    'Jewelry', 
    'Antiques'
  ];

  const handleImageUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    const validImageFiles = newFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 
    );
    setImages(prevImages => [...prevImages, ...validImageFiles]);
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !startingPrice || !category) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: Date.now(),
      title,
      description,
      startingPrice: `Rs${startingPrice}`,
      currentBid: `Rs${startingPrice}`,
      status: 'Active',
      category,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      images: images.map(file => URL.createObjectURL(file))
    };

    onAddProduct(newProduct);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartingPrice('');
    setCategory('');
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Starting Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
              <input 
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="Enter starting price"
                min="0"
                step="0.01"
                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Product Images
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex justify-center mb-4">
                <Upload className="text-gray-400" size={48} />
              </div>
              <p className="text-gray-500">
                Drag and drop images or <span className="text-blue-600 cursor-pointer">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Maximum 5 images, each up to 5MB
              </p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Upload ${index + 1}`} 
                      className="w-full h-20 object-cover rounded"
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 mr-4"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Products Page Component
const ProductsPage = () => {
    const [products, setProducts] = useState([
      {
        id: 1,
        title: 'Vintage Leather Motorcycle Jacket',
        description: 'Authentic 1970s leather jacket, perfect for collectors',
        startingPrice: '250',
        currentBid: '450',
        status: 'Active',
        category: 'Vintage Clothing',
        endDate: '2024-12-20'
      },
      {
        id: 2,
        title: 'Rare Coin Collection',
        description: 'Comprehensive collection of late 19th-century coins',
        startingPrice: '1000',
        currentBid: '2500',
        status: 'Completed',
        category: 'Collectibles',
        endDate: '2024-11-15'
      },
      {
        id: 3,
        title: 'Classic Vinyl Record Collection',
        description: 'Pristine collection of jazz and rock vinyl records',
        startingPrice: '300',
        currentBid: '750',
        status: 'Expired',
        category: 'Music',
        endDate: '2024-10-30'
      }
    ]);
  
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
    useEffect(() => {
      // Fetch products from API or database here
    }, []);
  
    const handleAddProduct = (newProduct) => {
      setProducts([...products, newProduct]);
    };
  
    const handleEditProduct = (product) => {
      console.log('Edit product', product);
      // Add edit functionality here
    };
  
    const handleDeleteProduct = (product) => {
      setProducts(products.filter(p => p.id !== product.id));
    };
  
    const handleChangeStatus = (product, status) => {
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, status } : p
      ));
    };

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
  
    // Filter options
    const filterOptions = ['All', 'Active', 'Inactive', 'Completed', 'Expired'];
  
    // Filter and search logic
    const filteredProducts = products.filter(product => 
      (filter === 'All' || product.status === filter) &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="flex">
        <Sidebar selectedItem="Products" />
        <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
              <button 
              onClick={() => setIsAddProductModalOpen(true)} 
                className="
                  flex items-center 
                  bg-blue-600 text-white 
                  px-4 py-2 rounded-lg 
                  hover:bg-blue-700 
                  transition-colors
                "
              >
                <Plus className="mr-2" size={20} />
                Add New Product
              </button>
            </div>
  
            {/* Filters and Search */}
            <div className="flex justify-between mb-6">
              <div className="flex space-x-2">
                {filterOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`
                      px-4 py-2 rounded-lg text-sm 
                      ${filter === option 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    pl-10 pr-4 py-2 w-64 
                    border border-gray-300 
                    rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500
                  "
                />
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
              </div>
            </div>
  
            {/* Products Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.startingPrice}</div>
                        <div className="text-sm text-gray-500">Current: {product.currentBid}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.endDate}</td>
                      <td className="px-6 py-4 text-right">
                        <ProductActionDropdown 
                          product={product}
                          onEdit={handleEditProduct}
                          onDelete={handleDeleteProduct}
                          onChangeStatus={handleChangeStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
          <AddProductModal 
          isOpen={isAddProductModalOpen} 
          onClose={() => setIsAddProductModalOpen(false)} 
          onAddProduct={handleAddProduct}
        />
        </div>
      </div>
    );
  };
  
  export default ProductsPage;
