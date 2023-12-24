// ReviewCard.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ReviewCard.css';

const ReviewCard = ({ review }) => {

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.numOfLikes);
  const [dislikeCount, setDislikeCount] = useState(review.numOfDislikes);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) {
    navigate('/login', { replace: true });
  }
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
      console.error('Error liking review:', error);
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
      console.error('Error disliking review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/delete_review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
    };

  return (
    <div className="text-white bg-gray-700 mb-8 p-6 border rounded-lg shadow relative">
    <button
      onClick={() => handleDelete(review._id)}  // Add a delete function similar to handleLike and handleDislike
      className="absolute bottom-0 right-0 p-4 text-gray-500 hover:text-white cursor-pointer"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
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
      </div>
    </div>
  );
};

export default ReviewCard;
