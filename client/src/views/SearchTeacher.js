import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import { useParams } from "react-router-dom";
import axios from "axios";
import TeacherCard from "../components/TeacherCard";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchTeacher = () => {
  const { searchValue } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [fName, setFirstName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const searchError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    })
  }

  useEffect(() => {
    setFirstName(localStorage.getItem("firstName"));

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login", { replace: true });
    }


    const fetchTeachers = async () => {
      try {

        const response = await axios.get(`http://localhost:8000/teachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            facultyName: searchValue || null,
          },
        });

        setTeachers(response.data.teachers);
        setTotalPages(Math.ceil(response.data.total / 10));


      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          searchError("Invalid or expired token")
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("firstName");
          navigate("/login", { replace: true });
        }
        else {
          searchError(error.response.data.message);
        }
      }
    };

    fetchTeachers();

  }, [searchValue, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
    minHeight: '100vh',
  };

  return (
    <>
      <Navbar transparent fName={fName} />
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="flex justify-center items-center h-full flex-col">
            <h1 className="text-white font-bold text-2xl mt-24 mb-4">Search Results</h1>
            <div className="bg-gray-200 p-4 rounded mb-4 mt-4" style={{ overflowY: 'auto', maxHeight: '500px', width: '1090px' }}>
              <div>
                <div className="mb-4">
                  <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </div>

                {teachers.map((teacher) => (
                  <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
              </div>
              <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default SearchTeacher;