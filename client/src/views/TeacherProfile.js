import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReviewCard from "../components/ReviewCard";
import Rating from 'react-rating';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    criteriaAverages: {},
    AverageRating: 0,
    position: "",
    tName: "",
    department: "",
    faculty_type: "",
    university: "",
    reviews: [],
  });
  const [fName, setFirstName] = useState("");

  useEffect(() => {
    const registerError = (message) => {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      })
    }

    setFirstName(localStorage.getItem("firstName"));

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/teacher/${ID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const criteriaAverages = response.data.criteriaAverages;
        const AverageRating = response.data.AverageRating;
        const reviews = response.data.reviews;
        const position = response.data.teacher.position;
        const tName = response.data.teacher.name;
        const department = response.data.teacher.department.name;
        const faculty_type = response.data.teacher.faculty_type;
        const university = response.data.teacher.uni.name;

        setIsLoading(false);
        setProfile({ criteriaAverages, AverageRating, position, tName, department, faculty_type, university, reviews });
      } catch (error) {
        console.error(error);
        return registerError(error.response.data.message);
      }
    };

    fetchTeacher();

  }, []);

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
    minHeight: '100vh',  

  };


  const customStyle2 = {
    width: "400px",
    height: "365px",
  };

  const customStyle3 = {
    height: "500px",
  };
  return (
    <>
      <Navbar transparent fName={fName} />
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="flex flex-row space-x-4 items-start">
            <div
              className="bg-gray-200 mt-24 flex-shrink-0 mr-4 ml-4 bg-white border border-gray-200 rounded-lg shadow"
              style={customStyle2}
            >
              {/* Add Teacher's Profile Information Here */}
              <div className="ml-2">
                <h2 className="text-2xl font-semibold mt-4 mb-4">{profile.tName}</h2>
                <p className="text-lg">{`University: ${profile.university}`}</p>
                <p className="text-lg">{`Position: ${profile.position}`}</p>
                <p className="text-lg">{`Department: ${profile.department}`}</p>
                <p className="text-lg">{`Faculty Type: ${profile.faculty_type}`}</p>
                <p className="text-lg">{`Average Rating: ${profile.AverageRating}`}</p>
                <div className="mt-4 mb-2 text-center">
                  <button
                    className="hover:bg-emerald-500 hover:text-white p-2 bg-white text-gray-700 rounded-full mx-auto"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                    <Link to={`/create_review/${ID}`}>
                      <span>Create Review</span>
                    </Link>
                  </button>
                </div>
                {/* Add other relevant information */}
              </div>



            </div>
            <div
              className="mt-24 mb-4 bg-gray-200 w-full mr-4 bg-white border border-gray-200 rounded-lg shadow"
              style={{ ...customStyle3, overflowY: 'auto', maxHeight: '500px' }}>
              <div className="py-4 px-4">
                <h2 className="text-2xl font-semibold mt-4 mb-4">Criteria Averages</h2>
                <div className="text-white bg-gray-700 p-6 border rounded-lg shadow">
                  <ul style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {Object.entries(profile.criteriaAverages).map(([criterion, averageRating]) => (
                      <li key={criterion} className="flex items-center mb-2">
                        <span className="mr-2">{criterion}:</span>
                        <Rating
                          initialRating={averageRating}
                          emptySymbol={<span className="text-gray-400">&#9734;</span>} // Empty star
                          fullSymbol={<span className="text-blue-400">&#9733;</span>}  // Filled star
                          readonly
                        />
                        <span className="ml-2 text-blue-400">{averageRating}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="py-4 px-4">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {/* Render ReviewCards */}
                {profile.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TeacherProfile;