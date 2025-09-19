// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSweets, searchSweets, purchaseSweet, restockSweet } from '../api/sweets';
import Swal from 'sweetalert2';
import { ShoppingCart, Search } from 'lucide-react'; // Import Search icon
import { jwtDecode } from "jwt-decode";


function DashboardPage() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.user.role === 'admin');
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSweets = async (params = {}) => {
    try {
      setLoading(true);
      const { data } = Object.keys(params).length > 0 ? await searchSweets(params) : await getAllSweets();
      setSweets(data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
      Swal.fire({
        icon: 'error',
        title: 'Could Not Load Sweets',
        text: 'Please make sure you are logged in and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // Update this function to only change the state
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Add this new function to handle the search button click
  const handleSearchSubmit = () => {
    fetchSweets({ name: searchTerm });
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

  const handleRestock = async (sweetId) => {
    const { value: amount } = await Swal.fire({
      title: 'Restock Sweet',
      input: 'number',
      inputLabel: 'Amount to restock',
      inputPlaceholder: 'Enter amount',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return 'Please enter a valid amount!';
        }
      }
    });

    if (amount) {
      try {
        await restockSweet(sweetId, Number(amount));
        Swal.fire({
          icon: 'success',
          title: 'Restock Successful!',
          timer: 1500,
          showConfirmButton: false
        });
        fetchSweets();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Restock Failed',
          text: error.response?.data?.msg || 'Something went wrong.'
        });
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-8">Loading sweets...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">Aniket-Sweets</h1>
        <button onClick={handleLogout} className="text-gray-600 hover:text-pink-500">Logout</button>
      </header>

      <main className="p-8">
        <div className="mb-6 flex">
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            <Search size={20} />
          </button>
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
                  className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors disabled:bg-gray-400 mb-2"
                >
                  <ShoppingCart size={18} />
                  Purchase
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleRestock(sweet._id)}
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Restock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;