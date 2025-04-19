import React, { useEffect, useState } from "react";
import { deleteRequest, getRequest } from "../axios";
import { toast, ToastContainer } from "react-toastify";
import { Trash2 } from "lucide-react";
import Loading from "../components/Loading";

const ManageBidders = () => {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bidders when the component mounts
  useEffect(() => {
    const fetchBidders = async () => {
      try {
        const response = await getRequest('http://localhost:5000/api/admin/get-all-bidders');

        setBidders(response.data);
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
      const response = await deleteRequest(`http://localhost:5000/api/admin/deleteUser/${bidderId}`);

      if (response.success) {
        setBidders((prevBidders) => prevBidders.filter((bidder) => bidder._id !== bidderId));
        toast.success("Bidder deleted Successfully!");
      } else {
        console.error('Error deleting bidder:', response.data.message);
        toast.error("Error while deleting Bidder!");
      }
    } catch (error) {
      console.error('Error deleting bidder:', error);
      toast.error("Error while deleting Bidder!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pt-14 md:p-4">
      <ToastContainer />
      {/* Header Section */}

      <h1 className="text-2xl md:text-3xl font-bold text-[#0a5274] mb-8">Manage Bidders</h1>

      {/* Table Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full border-collapse">

            {/* Table Header */}
            <thead className="bg-gray-100 border-b">
              <tr>
                {["Username", "Email", "Contact", "Actions"].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-lg text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-300">
              {bidders.length > 0 ? (
                bidders.map((bidder) => (
                  <tr key={bidder._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {bidder.username}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {bidder.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {bidder.contactNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      <button
                        onClick={() => handleDelete(bidder._id)}
                        className="text-white text-center bg-red-500 hover:bg-red-600 text-md px-2 py-1 rounded-lg transition flex items-center">
                        <Trash2 className="mr-2" size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-600 text-lg">
                    No bidders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBidders;
