# Auctrix - Auction Management System 🏷️

Auctrix is a comprehensive Auction Management System built with the MERN Stack. It facilitates seamless auctioning of products by providing tailored experiences for different user roles — Sellers, Bidders and Admins. It supports real-time bidding, robust auction tracking, and insightful analytics.

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Others:** Axios, Chart libraries

---

## 📄 Functionality Overview (Admin Pannel)

### 🔐 Authentication Pages
- **Login & Register:** Secure sign up and sign in for Bidders, Sellers, and Admins with role-based navigation.

### 🧑‍💼 Admin Dashboard
- Overview of Total Active Auctions, Total Sellers, Total Bidders.
- Shows Recent Completed/Expired Auctions

### 👤 Profile Page
- Users can view and update profile info.
- Sellers can update their business details and images.

### 📦 Manage Sellers Page
- Shows all the active sellers with their username, email, and contact info.
- Admin can also remove the seller

### 📦 Manage Bidders Page
- Shows all the active bidders with their username, email, and contact info.
- Admin can also remove the bidder.

### ➕ Products Approval Page
- Lists all the pending products that are listed by sellers and are waiting to be approved by Admin for Auctioning.
- Admin will view the product details and can approve or decline the product for Auction.

### 🎯 Active Auctions Page
- Lists all ongoing auctions with filtering and search.
- Shows countdown timers, current bidder and bid amoint, and seller info.

### 📚 Auction History Page
- Displays completed and expired auctions.
- Users can search and filter past auctions.


### 📈 Admin Analytics Page
- Quick stats on total, successful, and expired auctions.
- Bid activity per Product category (bar chart).
- Top performing sellers (table).

