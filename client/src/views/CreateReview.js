// CreateReview.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import axios from 'axios';
import ReactRating from 'react-rating';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateReview = () => {
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [course, setCourse] = useState(''); // New state for course
  const [isGrad, setIsGrad] = useState(false); // New state for graduate status
  const [isLoading, setIsLoading] = useState(true);
  const [teacherName, setTeacherName] = useState('');
  const { teacherid } = useParams();
  const token = JSON.parse(localStorage.getItem('token'));
  const fName = localStorage.getItem('firstName');

  // Fetch criteria on component mount
  useEffect(() => {

    if (!token) {
      navigate('/login', { replace: true });
    }

    const fetchName = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/name/${teacherid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeacherName(response.data.name);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
    fetchName();


    const fetchCriteria = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/create_review/${teacherid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCriteria(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchCriteria();
  }, []);

  // Handle rating change
  const handleRatingChange = (criterionId, rating) => {
    setRatings((prevRatings) => ({ ...prevRatings, [criterionId]: rating }));
  };

  // Handle comment change
  const handleCommentChange = (criterionId, comment) => {
    setComments((prevComments) => ({ ...prevComments, [criterionId]: comment }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const reviewData = {
      course,
      isGrad,
      criteria: Object.keys(ratings).map((criterionId) => ({
        criterion: criterionId,
        rating: ratings[criterionId],
        comment: comments[criterionId],
      })),
    };

    // Make a post request to create the review
    try {
      await axios.post(`http://localhost:8000/create_review/${teacherid}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Review Created!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      });

      navigate(`/teachers`, { replace: true });
      // Handle success (e.g., redirect to review details page)
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const bodyStyle = {
    backgroundImage: 'url("/register_bg_2.png")',
    backgroundSize: 'cover',
    minHeight: '100vh',
    backgroundColor: "#475569",
  };

  return (
    <>
      <Navbar2 transparent fName={fName} />
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="flex justify-center items-center h-full flex-col">
            <h1 className="text-white font-bold text-2xl mt-24 mb-4">Create Review for {teacherName}</h1>
            <div className="bg-gray-200 p-4 rounded mb-4 mt-4" style={{ overflowY: 'auto', maxHeight: '500px', width: '850px' }}>
              <form className='ml-8'>
                {/* Course Name */}
                <div className="relative w-full mb-3">
                  <label className="mt-4 block uppercase text-gray-700 text-base ml-8 font-bold mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="course"
                    placeholder='Enter Course Name'
                    className="w-6/12 mb-2 ml-8 border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring "
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>

                {/* Graduate Status Checkbox */}
                <div className="mb-4 ml-8">
                  <input
                    type="checkbox"
                    id="isGrad"
                    checked={isGrad}
                    onChange={() => setIsGrad(!isGrad)}
                    className="mr-2"
                  />
                  <label htmlFor="isGrad" className="mb-4 text-sm font-bold text-gray-700">
                    Graduate Course
                  </label>
                </div>

                {/* Criteria Ratings and Comments */}
                <div className="ml-8 mr-4 grid grid-cols-2">
                  {criteria.map((criterion, index) => (
                    <div key={criterion._id} className="mb-6" style={{ gridColumn: index % 2 === 0 ? '1' : '2' }}>
                      <label className="block uppercase text-gray-700 text-base font-bold mb-4">
                        {criterion.name}
                      </label>
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor={`rating_${criterion._id}`} className="text-sm mr-8 text-gray-700 font-bold">
                          Rating:
                        </label>
                        <ReactRating
                          id={`rating_${criterion._id}`}
                          initialRating={ratings[criterion._id] || 0}
                          onChange={(value) => handleRatingChange(criterion._id, value)}
                          emptySymbol={<FontAwesomeIcon icon={faStar} className="fa-2x text-gray-300" />}
                          fullSymbol={<FontAwesomeIcon icon={faStar} className="fa-2x text-blue-400" />}
                          fractions={2}
                        />
                      </div>

                      {/* Comment */}
                      <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor={`comment_${criterion._id}`} className="text-sm mr-4 text-gray-700 font-bold">
                          Comment:
                        </label>
                        <textarea
                          id={`comment_${criterion._id}`}
                          onChange={(e) => handleCommentChange(criterion._id, e.target.value)}
                          className="block border rounded-lg border border-gray-300 px-2 py-1 w-48"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-400 text-white px-4 py-2 rounded"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CreateReview;