// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ShoppingCart, Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { getAllSweets, searchSweets, purchaseSweet, restockSweet, createSweet, updateSweet, deleteSweet } from '../api/sweets';

function DashboardPage() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
  const [editingSweet, setEditingSweet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.user.role === 'admin');
      } catch (e) {
        console.error("Failed to decode token:", e);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    fetchSweets();
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
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
        Swal.fire({ icon: 'success', title: 'Restock Successful!', timer: 1500, showConfirmButton: false });
        fetchSweets();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Restock Failed', text: error.response?.data?.msg || 'Something went wrong.' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAdminPanelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        await updateSweet(editingSweet._id, formData);
        Swal.fire('Updated!', 'Sweet has been updated.', 'success');
      } else {
        await createSweet(formData);
        Swal.fire('Created!', 'Sweet has been created.', 'success');
      }
      setFormData({ name: '', category: '', price: '', quantity: '' });
      setEditingSweet(null);
      fetchSweets();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Something went wrong.', 'error');
    }
  };

  const handleEditClick = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
    setShowAdminPanel(true);
  };

  const handleDelete = async (sweetId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSweet(sweetId);
          Swal.fire('Deleted!', 'Sweet has been deleted.', 'success');
          fetchSweets();
        } catch (error) {
          Swal.fire('Error', error.response?.data?.msg || 'Something went wrong.', 'error');
        }
      }
    });
  };

  if (loading) return <div className="text-center mt-8">Loading sweets...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">Aniket-Sweets</h1>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <Plus size={18} /> Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="text-gray-600 hover:text-pink-500">Logout</button>
        </div>
      </header>

      <main className="p-8">
        {showAdminPanel && isAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
            <form onSubmit={handleAdminPanelSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded-md" required />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="border p-2 rounded-md" required />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="border p-2 rounded-md" required />
                <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="border p-2 rounded-md" required />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                {editingSweet ? 'Update Sweet' : 'Add Sweet'}
              </button>
            </form>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Sweets</h2>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search sweets by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-64 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-1 focus:ring-pink-600"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {sweets.length === 0 ? (
          <p className="text-center text-gray-500">No sweets available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div key={sweet._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{sweet.name}</h3>
                <p className="text-gray-600 mb-2">Category: {sweet.category}</p>
                <p className="text-lg font-semibold text-pink-500 mb-4">₹{sweet.price}</p>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-sm text-gray-500">
                    {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePurchase(sweet._id)}
                      disabled={sweet.quantity === 0}
                      className="flex items-center justify-center gap-1 bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors disabled:bg-gray-400"
                    >
                      <ShoppingCart size={18} />
                      Purchase
                    </button>
                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => handleRestock(sweet._id)} 
                          className="flex items-center justify-center gap-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                          title="Restock"
                        >
                          <Package size={18} />
                        </button>
                        <button onClick={() => handleEditClick(sweet)} className="text-blue-500 hover:text-blue-700" title="Edit">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDelete(sweet._id)} className="text-red-500 hover:text-red-700" title="Delete">
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;