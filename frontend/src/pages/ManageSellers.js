import React, { useEffect, useState } from "react";
import { deleteRequest, getRequest } from "../axios";
import { toast, ToastContainer } from "react-toastify";
import { Trash2 } from "lucide-react";
import Loading from "../components/Loading";

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sellers when the component mounts
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await getRequest("http://localhost:5000/api/admin/get-all-sellers");
        setSellers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // Delete a seller
  const handleDelete = async (sellerId) => {
    try {
      const response = await deleteRequest(`http://localhost:5000/api/admin/deleteUser/${sellerId}`);
      console.log(response)

      if (response.success) {
        setSellers((prevSellers) => prevSellers.filter((seller) => seller._id !== sellerId));
        toast.success("Seller deleted Successfully!");
      } else {
        console.error("Error deleting seller:");
        toast.error("Error while deleting Seller!");
      }
    } catch (error) {
      console.error("Error deleting seller:", error);
      toast.error("Error while deleting Seller!");
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="pt-14 md:p-4">
      <ToastContainer />
      {/* Header Section */}

      <h1 className="text-2xl md:text-3xl font-bold text-[#0a5274] mb-8">Manage Sellers</h1>

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
              {sellers.length > 0 ? (
                sellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50 transition">
                     <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {seller.username}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      {seller.contactNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs sm:text-base">
                      <button
                        onClick={() => handleDelete(seller._id)}
                        className="text-white text-center bg-red-500 hover:bg-red-600 text-md px-2 py-1 rounded-lg transition flex items-center">
                        <Trash2 className="mr-2" size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-600 text-lg">
                    No sellers found.
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

export default ManageSellers;
