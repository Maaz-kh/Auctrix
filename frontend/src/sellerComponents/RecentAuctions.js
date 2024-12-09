// Recent Auctions Component
const RecentAuctions = () => {
  const auctions = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      status: "Active",
      currentBid: "$450",
      endDate: "12/20/2024",
    },
    {
      id: 2,
      title: "Classic Motorcycle",
      status: "Pending",
      currentBid: "$2,500",
      endDate: "12/25/2024",
    },
    {
      id: 3,
      title: "Rare Coin Collection",
      status: "Completed",
      currentBid: "$1,200",
      endDate: "12/10/2024",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Auctions</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="flex justify-between items-center border-b pb-3 last:border-b-0"
          >
            <div>
              <h3 className="font-medium text-gray-700">{auction.title}</h3>
              <span
                className={`
                    text-xs px-2 py-1 rounded-full 
                    ${
                      auction.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : auction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
              >
                {auction.status}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                {auction.currentBid}
              </p>
              <p className="text-sm text-gray-500">Ends {auction.endDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAuctions;