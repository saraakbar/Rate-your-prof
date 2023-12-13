import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import ReviewCard from "../components/ReviewCard";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {

    const token = JSON.parse(localStorage.getItem("token"));
    setFirstName(localStorage.getItem("firstName"));

    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8000/home`, {
          params: {
            sortBy,
            page: currentPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(response.data.reviews);
        setTotalPages(Math.ceil(response.data.total / 10));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch reviews");
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
  };

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
    minHeight: '100vh',  

  };


  return (
    <>
      <Navbar transparent fName={firstName} /> {/* Assuming you have a Navbar component */}
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="flex justify-center items-center h-full flex-col">
            <h1 className="text-3xl text-white font-bold mb-4 mt-24">Home Page</h1>
            <div className="bg-gray-200 p-4 rounded mb-4 mt-4" style={{ overflowY: 'auto', maxHeight: '500px', width: '1090px' }}>

              {/* Sorting Dropdown */}
              <div className="mb-4">
                <label className="mr-2">Sort By:</label>
                <Select
                  options={[
                    { value: "date", label: "Date" },
                    { value: "likes", label: "Likes" },
                  ]}
                  value={{ value: sortBy, label: sortBy.charAt(0).toUpperCase() + sortBy.slice(1) }}
                  onChange={handleSortChange}
                />
              </div>

              {/* Reviews */}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
