// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSweets, searchSweets, purchaseSweet } from '../api/sweets';
import Swal from 'sweetalert2';
import { ShoppingCart } from 'lucide-react';

function DashboardPage() {
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSweets = async (params = {}) => {
    try {
      const { data } = Object.keys(params).length > 0 ? await searchSweets(params) : await getAllSweets();
      setSweets(data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
      Swal.fire({
        icon: 'error',
        title: 'Could Not Load Sweets',
        text: 'Please make sure you are logged in and try again.'
      });
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchSweets({ name: term });
  };

  const handlePurchase = async (sweetId) => {
    try {
      await purchaseSweet(sweetId);
      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful!',
        timer: 1500,
        showConfirmButton: false
      });
      fetchSweets(); // Refresh the list to show the new quantity
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Purchase Failed',
        text: error.response?.data?.msg || 'Something went wrong.'
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">Aniket-Sweets</h1>
        {/* We'll add a real logout button later */}
        <button className="text-gray-600 hover:text-pink-500">Logout</button>
      </header>

      <main className="p-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sweets.map((sweet) => (
            <div key={sweet._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{sweet.name}</h3>
                <p className="text-gray-600 mb-2">{sweet.category}</p>
                <p className="text-lg font-semibold text-pink-500 mb-4">₹{sweet.price}</p>
                <p className="text-sm text-gray-500">
                  {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
                </p>
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={() => handlePurchase(sweet._id)}
                  disabled={sweet.quantity === 0}
                  className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors disabled:bg-gray-400"
                >
                  <ShoppingCart size={18} />
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;