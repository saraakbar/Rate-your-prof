// Profile.js
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import ReviewCard from "../components/profileReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import FileInput from '../components/FileInput';

const Profile = () => {

  const navigate = useNavigate();
  const { username } = useParams();
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    erp: "",
    reviews: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const registerError = (message) => {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      })
    }

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login", { replace: true });
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/${username}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const firstName = response.data.userInfo.firstName
        const lastName = response.data.userInfo.lastName
        const userName = response.data.userInfo.username
        const email = response.data.userInfo.email
        const erp = response.data.userInfo.erp
        const reviews = response.data.reviews
        const img = response.data.userInfo.img

        if (img !== null && img !== '') {
          const imageResponse = await axios.get(`http://localhost:8000${img}`, {
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

        localStorage.setItem("firstName", firstName);
        setIsLoading(false);
        setProfile({ firstName, lastName, userName, email, erp, reviews });
      } catch (error) {
        console.error(error);
        return registerError(error.response.data.message);
        // Handle error, e.g., redirect to an error page
      }
    };

    fetchProfile()
  }, []);



  const customImageStyle = {
    width: "150px",
    height: "150px",
    position: "relative",
  };

  const modalStyles = {
    content: {
      backgroundColor: '#e5e7eb',
      position: 'relative',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      borderRadius: '10px',
      padding: '0px',
    },
  };

  const customStyle2 = {
    width: "325px",
    height: "350px",
  };

  const customStyle3 = {
    height: "500px",
  };

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
  };

  return (
    <>
      <Navbar transparent fName={profile.firstName} />
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="profile-page flex flex-row space-x-4 items-start">
            <div
              className="bg-gray-200 mt-24 flex-shrink-0 mr-4 ml-4 bg-white border border-gray-200 rounded-lg shadow"
              style={customStyle2}
            >
              <div className="mt-4 flex flex-col items-center pb-10">
                <div style={{ position: "relative" }}>
                  <img
                    className="mb-3 rounded-full"
                    style={customImageStyle}
                    src={image || '/avatar.png'}
                    alt="avatar"
                  />
                  <div
                    className="flex border border-white items-center"
                    style={{
                      position: "absolute",
                      height: "33px",
                      width: "33px",
                      top: 0,
                      right: 0,
                      background: "#334155",
                      padding: "0.5rem",
                      borderRadius: "100%",
                      cursor: "pointer",
                      margin: "15px",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#10b981";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#334155";
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="text-white" />
                  </div>
                </div>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {`${profile.firstName} ${profile.lastName}`}
                </h5>
                <span className="text-sm mb-1 text-gray-500 dark:text-gray-400">
                  @{profile.userName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.email}
                </span>
                <div className="flex mt-4 md:mt-6">
                  <a
                    href="/settings"
                    className="hover:bg-emerald-500 hover:text-white inline-flex items-center mr-4 ml-4 mr-2 px-4 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                    Edit Profile
                  </a>
                </div>
              </div>
            </div>
            <div
              className="mt-24 mb-4 bg-gray-200 w-full mr-4 bg-white border border-gray-200 rounded-lg shadow"
              style={customStyle3}
            >
              <div className="py-4 px-4" style={{ overflowY: 'auto', maxHeight: '500px' }}>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {profile.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
      >
        <FileInput onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Profile;
