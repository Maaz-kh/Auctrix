import React, { useState, useEffect } from "react";
import Sidebar from "../sellerComponents/Sidebar";
import {
  Clock,
  Tag,
  MapPin,
  Info,
  ArrowRight,
  Gavel,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Sample Listings Data
const initialListings = [
  {
    id: 1,
    title: "Vintage 1965 Mustang Convertible",
    description:
      "Original V8 engine, fully restored classic car with matching numbers. Perfect for collectors and enthusiasts.",
    startBid: 45000,
    currentBid: 65000,
    highestBidder: "John D.",
    category: "Vintage Cars",
    condition: "Excellent",
    location: "California, USA",
    images: [
      "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Ford-Mustang-Exterior-126883.jpg?wm=0&q=80",
      "https://i0.shbdn.com/photos/54/17/17/x5_121054171740e.jpg",
      "https://i.ytimg.com/vi/5oFP0YgSoDM/maxresdefault.jpg",
    ],
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    seller: "Classic Auto Restorations",
    offers: [
      {
        bidder: "John D.",
        amount: 65000,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "Mike S.",
        amount: 60000,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "Sarah L.",
        amount: 55000,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 2,
    title: "Rare First Edition Harry Potter Book",
    description:
      "First edition, first print of Harry Potter and the Philosopher's Stone. Includes original dust jacket in near mint condition.",
    startBid: 15000,
    currentBid: 22000,
    highestBidder: "Emily R.",
    category: "Collectible Books",
    condition: "Near Mint",
    location: "London, UK",
    images: [
      "https://example.com/harrypotter1.jpg",
      "https://example.com/harrypotter2.jpg",
    ],
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    seller: "Rare Books Emporium",
    offers: [
      {
        bidder: "Emily R.",
        amount: 22000,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "David K.",
        amount: 20000,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

// Time Remaining Component
const TimeRemaining = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Auction Ended");
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center text-sm text-gray-600">
      <Clock className="mr-2 w-4 h-4" />
      {timeLeft}
    </div>
  );
};

// Listing Card Component
const ListingCard = ({ listing, onClick }) => {
  return (
    <div
      onClick={() => onClick(listing)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded">
          <TimeRemaining endTime={listing.endTime} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{listing.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-sm text-gray-600 flex items-center">
              <Tag className="mr-2 w-4 h-4" />
              Start Bid: ${listing.startBid.toLocaleString()}
            </div>
            <div className="text-blue-600 font-bold">
              Current Bid: ${listing.currentBid.toLocaleString()}
            </div>
          </div>
          <ArrowRight className="text-gray-500" />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-2 w-4 h-4" />
          {listing.location}
        </div>
      </div>
    </div>
  );
};

// Listing Details Modal
const ListingDetailsModal = ({ listing, onClose, onPlaceBid }) => {
  const [bidAmount, setBidAmount] = useState("");

  const handlePlaceBid = () => {
    const numericBid = parseFloat(bidAmount);
    if (numericBid > listing.currentBid) {
      onPlaceBid(listing.id, numericBid);
      setBidAmount("");
    } else {
      alert("Bid must be higher than current bid");
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Navigate to the previous image
  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  // Navigate to the next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center">
      <div className="bg-white w-full max-w-4xl mx-4 my-8 rounded-xl shadow-xl">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Full-Screen Image Gallery */}
          <div className="relative">
            {/* Image */}
            <img
              src={listing.images[currentImageIndex]}
              alt={`${listing.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded"
            />

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Listing Details */}
          <div>
            <button
              onClick={onClose}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="mr-2" /> Back to Listings
            </button>

            <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
            <div className="flex justify-between items-center mb-4">
              <TimeRemaining endTime={listing.endTime} />
              <div className="text-sm text-gray-600 flex items-center">
                <Info className="mr-2 w-4 h-4" />
                {listing.category}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-700">{listing.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold">Start Bid</h4>
                <p className="text-gray-700">
                  ${listing.startBid.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Current Bid</h4>
                <p className="text-blue-600 font-bold">
                  ${listing.currentBid.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Condition</h4>
                <p className="text-gray-700">{listing.condition}</p>
              </div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-gray-700">{listing.location}</p>
              </div>
            </div>

            {/* Bid Placement */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Place a Bid</h3>
              <div className="flex">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum $${listing.currentBid + 1}`}
                  className="flex-1 p-2 border rounded-l"
                />
                <button
                  onClick={handlePlaceBid}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r flex items-center"
                >
                  <Gavel className="mr-2" /> Bid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div className="bg-gray-50 p-6">
          <h3 className="font-semibold mb-4">Bid History</h3>
          <div className="space-y-2">
            {listing.offers.map((offer, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded shadow-sm flex justify-between"
              >
                <div>
                  <span className="font-medium">{offer.bidder}</span>
                  <span className="text-gray-500 ml-2 text-sm">
                    {offer.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <span className="font-bold text-blue-600">
                  ${offer.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [listings, setListings] = useState(initialListings);
  const [selectedListing, setSelectedListing] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter categories
  const categories = [
    "All",
    "Vintage Cars",
    "Collectible Books",
    "Art",
    "Jewelry",
  ];

  // Filter and search logic
  const filteredListings = listings.filter(
    (listing) =>
      (filter === "All" || listing.category === filter) &&
      listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bid placement handler
  const handlePlaceBid = (listingId, bidAmount) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === listingId
          ? {
              ...listing,
              currentBid: bidAmount,
              highestBidder: "Current User",
              offers: [
                {
                  bidder: "Current User",
                  amount: bidAmount,
                  timestamp: new Date(),
                },
                ...listing.offers,
              ],
            }
          : listing
      )
    );
  };

  return (
    <div className="flex">
      <Sidebar selectedItem="Listings" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 py-8 flex-1">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  Active Auctions
                </h1>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="md:hidden bg-white shadow-md p-2 rounded-full"
                >
                  <Filter className="text-gray-600" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 flex space-x-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                  w-full pl-10 pr-4 py-3 
                  border border-gray-200 
                  rounded-lg 
                  focus:outline-none 
                  focus:ring-2 focus:ring-blue-500
                  bg-white
                  shadow-sm
                "
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X
                        className="text-gray-400 hover:text-gray-600"
                        size={20}
                      />
                    </button>
                  )}
                </div>

                {/* Category Filters (Desktop) */}
                <div className="hidden md:flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      filter === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }
                  `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Filters Dropdown */}
              {mobileFiltersOpen && (
                <div className="md:hidden mb-4 bg-white rounded-lg shadow-md p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setFilter(category);
                          setMobileFiltersOpen(false);
                        }}
                        className={`
                      w-full py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        filter === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Listings Grid */}
              {filteredListings.length > 0 ? (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onClick={setSelectedListing}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    No auctions found
                  </h2>
                  <p className="text-gray-500">
                    Try adjusting your search or filter
                  </p>
                </div>
              )}
            </div>

            {/* Listing Details Modal */}
            {selectedListing && (
              <ListingDetailsModal
                listing={selectedListing}
                onClose={() => setSelectedListing(null)}
                onPlaceBid={handlePlaceBid}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
