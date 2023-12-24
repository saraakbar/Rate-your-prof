import React, { useState } from 'react';
import '../styles/ReportModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Corrected icon import
import axios from 'axios';

const ReportModal = ({ isOpen, onClose, reviewId }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const [selectedReason, setSelectedReason] = useState('');

    const handleCheckboxChange = (reason) => {
        if (selectedReason === reason) {
            setSelectedReason(''); // Unselect if already selected
        } else {
            setSelectedReason(reason); // Select the clicked checkbox
        }
    };

    const handleSubmit = async () => {
        try{
            await axios.post(
                `http://localhost:8000/review/report/${reviewId}`,
                { reason: selectedReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onClose();

        }catch(error){
        }
    };

    const isSubmitDisabled = selectedReason === '';

    return (
        <div className={`report-modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2 className="font-bold mb-4">Reason to Report Review</h2>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value=" The review contains offensive language, hate speech, or inappropriate content."
                            checked={selectedReason === ' The review contains offensive language, hate speech, or inappropriate content.'}
                            onChange={() => handleCheckboxChange(' The review contains offensive language, hate speech, or inappropriate content.')}
                        />
                        The review contains offensive language, hate speech, or inappropriate content.
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="The information provided in the review is inaccurate, misleading, or false."
                            checked={selectedReason === 'The information provided in the review is inaccurate, misleading, or false.'}
                            onChange={() => handleCheckboxChange('The information provided in the review is inaccurate, misleading, or false.')}
                        />
                        The information provided in the review is inaccurate, misleading, or false.
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="The review includes personal attacks or harassment against the teacher or other users."
                            checked={selectedReason === 'The review includes personal attacks or harassment against the teacher or other users.'}
                            onChange={() => handleCheckboxChange('The review includes personal attacks or harassment against the teacher or other users.')}
                        />
                        The review includes personal attacks or harassment against the teacher or other users.
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="The review appears to be spam or part of a fraudulent activity."
                            checked={selectedReason === 'The review appears to be spam or part of a fraudulent activity.'}
                            onChange={() => handleCheckboxChange('The review appears to be spam or part of a fraudulent activity.')}
                        />
                        The review appears to be spam or part of a fraudulent activity.
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="The review contains personal information about the teacher or other individuals without consent."
                            checked={selectedReason === 'The review contains personal information about the teacher or other individuals without consent.'}
                            onChange={() => handleCheckboxChange('The review contains personal information about the teacher or other individuals without consent.')}
                        />
                        The review contains personal information about the teacher or other individuals without consent.
                    </label>
                </div>
                <button
                    className={`submit-container ${isSubmitDisabled ? 'disabled' : ''}`}
                    onClick={handleSubmit} // Call the handleSubmit function
                    disabled={isSubmitDisabled}
                >
                    Submit
                </button>
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
};

export default ReportModal;
