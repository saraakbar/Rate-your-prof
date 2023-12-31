import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faFlag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ReviewCard.css';
import ReportModal from './ReportModal';
import {toast} from 'react-toastify';

const ReviewCard = ({ review }) => {

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.numOfLikes);
  const [dislikeCount, setDislikeCount] = useState(review.numOfDislikes);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const reviewError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    })
  }

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) {
    navigate('/login', { replace: true });
  }

  useEffect(() => {

    const fetchUserImage = async () => {
      try {
        if (review.user.img) {
          const imageResponse = await axios.get(`http://localhost:8000${review.user.img}`, {
            responseType: 'arraybuffer',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Convert the binary image data to a base64-encoded string
          const base64Data = btoa(
            new Uint8Array(imageResponse.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );

          // Set the base64 data as the image source
          setImage(`data:image/jpeg;base64,${base64Data}`);
        } else {
          // Set image to null when img is empty or null
          setImage(null);
        }
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          reviewError("Invalid or expired token")
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("firstName");
          navigate("/login", { replace: true });
        }
        else {
          reviewError(error.response.data.message);
        }
      }
    };

    // Call the async function immediately
    fetchUserImage();
  }, []);
  const handleLike = async (reviewId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/like/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'dislike removed, review liked') {
        setIsLiked(true);
        setIsDisliked(false);
      } else if (response.data.message === 'Like removed') {
        setIsLiked(false);
        setIsDisliked(false);
      } else {
        setIsLiked(true);
        setIsDisliked(false);
      }
      setLikeCount(response.data.info[0]?.numOfLikes);
      setDislikeCount(response.data.info[0]?.numOfDislikes);
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        reviewError("Invalid or expired token")
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("firstName");
        navigate("/login", { replace: true });
      }
      else {
        reviewError(error.response.data.message);
      }
    }
  };


  const handleDislike = async (reviewId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/dislike/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'like removed, review disliked') {
        setIsLiked(false);
        setIsDisliked(true);
      } else if (response.data.message === 'dislike removed') {
        setIsLiked(false);
        setIsDisliked(false);
      } else {
        setIsLiked(false);
        setIsDisliked(true);
      }

      setLikeCount(response.data.info[0]?.numOfLikes);
      setDislikeCount(response.data.info[0]?.numOfDislikes);
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        reviewError("Invalid or expired token")
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("firstName");
        navigate("/login", { replace: true });
      }
      else {
        reviewError(error.response.data.message);
      }
    }
  };

  const customImageStyle = {
    // Add your custom image styles here
    width: '40px',
    height: '40px',
    borderRadius: '50%',  // Make the image circular
    border: '1px solid #fff', // Add a white border  
  };

  return (
    <div className="text-white bg-gray-700 mb-8 p-6 border rounded-lg shadow">
      <div className="flex items-center mb-3">
        <img
          className="mr-3 rounded-full"
          style={customImageStyle}
          src={image || '/avatar.png'}
          alt="user avatar"
        />
        <p className="text-sm font-bold text-white">{review.user.username}</p>
      </div>
      <h3 className="hoverable-name text-2xl font-semibold mb-2 cursor-pointer">
        <Link to={`/teacher/${review.teacher.ID}`}>{review.teacher.name}</Link>
      </h3>
      <p className="text-lg">{review.course}</p>
      <p className="mt-2">{review.comment}</p>
      <div className="mt-4">
        <p className="text-lg font-semibold">Review Details:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Average Rating: {review.avgRating}</li>
          <li>Date: {new Date(review.date).toLocaleDateString()}</li>
          <li>Is Grad Review: {review.isGradReview ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">Criteria:</p>
        <ul className="list-disc pl-5 mt-2">
          {review.criteria.map((criterion) => (
            <li key={criterion._id}>
              {criterion.criterion.name}: {criterion.rating} - {criterion.comment}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center mt-6">
        <button
          onClick={() => handleLike(review._id)}
          className={`mr-2 ${isLiked ? 'text-green-500' : 'text-gray-500 hover:text-white cursor-pointer'}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <span className="mr-2">{likeCount}</span>
        <button
          onClick={() => handleDislike(review._id)}
          className={`mr-2 ${isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-white cursor-pointer'}`}
        >
          <FontAwesomeIcon icon={faThumbsDown} />
        </button>
        <span>{dislikeCount}</span>
        <button
          onClick={() => handleReport()}
          className="ml-4 text-gray-500 hover:text-white cursor-pointer"
        >
          <FontAwesomeIcon icon={faFlag} />
        </button>
        {isReportModalOpen && (
        <ReportModal
            isOpen={isReportModalOpen}
            onClose={handleCloseReportModal}
            reviewId={review._id} // Pass the reviewId as a prop
        />
    )}
      </div>
    </div>

  );
};

export default ReviewCard;
