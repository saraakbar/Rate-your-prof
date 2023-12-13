import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/NavTab.css';

const DeleteAccount = ({ isOpen, onClose, onDelete }) => {
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleDelete = () => {
        onDelete(password);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Account Modal"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <span className='font-bold text-lg mb-4 text-white'>Delete account</span>
                <p> <span className='text-white'>
                    By deleting your account, you will no longer be able to sign in. Your reviews
                    will stay on the website with your current username, but your activity such
                    as likes and dislikes will be removed, and your username might be claimed
                    by another member.
                </span></p>
                <button className="delete-button" onClick={handleDelete}>
                    DELETE ACCOUNT
                </button>
            </div>
        </Modal>
    );
};

export default DeleteAccount;
