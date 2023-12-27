import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/NavTab.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteAccount = ({ isOpen, onClose}) => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));

    const deleteError = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
        })
    }

    const handleDelete = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            await axios.delete("http://localhost:8000/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("firstName");
            onClose();
            toast.success("Account deleted successfully", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark",
            });
            navigate("/login", { replace: true });
        } catch (error) {
            console.error(error);
            if (error.response.status === 403) {
                deleteError("Invalid or expired token")
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("firstName");
                navigate("/login", { replace: true });
            }
            else {
                deleteError(error.response.data.message);
            }
        }

    }

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
