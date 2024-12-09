import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ManageSellers = () => {
  
    const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sellers when the component mounts
  useEffect(() => {
    
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/get-all-sellers');
        
        const data = response.data.data;
        console.log(data);

        setSellers(data); 
        setLoading(false);
      } catch (error) {
        
        console.error('Error fetching sellers:', error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // Delete a seller
  const handleDelete = async (sellerId) => {
    try {
        console.log(sellerId);
      const response = await axios.delete(`http://localhost:3020/api/admin/deleteUser/${sellerId}`);

      if (response.status === 200) {
        
        setSellers((prevSellers) => prevSellers.filter((seller) => seller._id !== sellerId));
      } else {
        
        console.error('Error deleting seller:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
    return (
      <div className="container mx-auto px-4 py-12 mt-10">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <CheckCircle className="mr-3" size={32} />
              Manage Sellers
            </h1>
          </div>
          
          {sellers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {['Username', 'Email', 'Contact', 'Actions'].map((header, index) => (
                      <th 
                        key={index} 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sellers.map((seller) => (
                    <tr 
                      key={seller._id} 
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-md font-medium text-gray-900">{seller.username}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-md text-gray-500">{seller.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-md text-gray-500">{seller.contactNumber || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(seller._id)}
                          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition flex items-center"
                        >
                          <Trash2 className="mr-2" size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No sellers found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
export default ManageSellers;
