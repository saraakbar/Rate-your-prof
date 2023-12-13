import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import '../styles/NavTab.css';
import DeleteAccount from './DeleteAccount'; // Update the path to match the actual location of your DeleteAccount component

const NavTab = ({ activeTab, handleTabClick }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const onDelete = async (password) => {
    try {
      // Replace '/api/delete-account' with your actual backend endpoint
      const response = await axios.delete('/api/delete-account', {
        data: { password }, // Send password as data in the request body
      });

      // Handle the response as needed
      console.log('Account deleted successfully', response.data);

      // Close the modal
      setDeleteModalOpen(false);
    } catch (error) {
      // Handle errors, e.g., display an error message
      console.error('Error deleting account:', error.message);
    }
  };

  return (
    <>
      <div className="mb-4 border-b nav-border">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="me-2" role="presentation">
            <NavLink
              to="/settings"
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'settings' ? 'nav-active' : 'border-transparent text-gray-700 dark:text-gray-300'}`}
              onClick={() => handleTabClick('settings')}
            >
              Settings
            </NavLink>
          </li>
          <li className="me-2" role="presentation">
            <NavLink
              to="/change-password"
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'change-password' ? 'nav-active' : 'border-transparent text-gray-700 dark:text-gray-300'}`}
              onClick={() => handleTabClick('change-password')}
            >
              Change Password
            </NavLink>
          </li>
        <button
          className="inline-block p-4 border-b-2 text-red-500"
          onClick={openDeleteModal}
        >
          Delete Account
        </button>
        </ul>
      </div>

      {/* Add the DeleteAccount component with the isOpen prop */}
      <DeleteAccount
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={(password) => onDelete(password)}
      />
    </>
  );
};

export default NavTab;
