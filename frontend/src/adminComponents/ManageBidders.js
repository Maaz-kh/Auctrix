import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ManageBidders = () => {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bidders when the component mounts
  useEffect(() => {
    const fetchBidders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/get-all-bidders');
        
        const data = response.data.data;
        console.log(data);

        setBidders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bidders:', error);
        setLoading(false);
      }
    };

    fetchBidders();
  }, []);

  // Delete a bidder
  const handleDelete = async (bidderId) => {
    try {
      console.log(bidderId);
      const response = await axios.delete(`http://localhost:3020/api/admin/deleteUser/${bidderId}`);

      if (response.status === 200) {
        setBidders((prevBidders) => prevBidders.filter((bidder) => bidder._id !== bidderId));
      } else {
        console.error('Error deleting bidder:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting bidder:', error);
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
            Manage Bidders
          </h1>
        </div>

        {bidders.length > 0 ? (
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
                {bidders.map((bidder) => (
                  <tr 
                    key={bidder._id} 
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-md font-medium text-gray-900">{bidder.username}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-md text-gray-500">{bidder.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-md text-gray-500">{bidder.contactNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(bidder._id)}
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
            <p className="text-gray-500 text-lg">No bidders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBidders;
