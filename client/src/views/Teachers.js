import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import Select from "react-select";
import TeacherCard from "../components/TeacherCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]); // State to hold teachers' data
  const [fName, setFirstName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdown1Value, setDropdown1Value] = useState(null);
  const [dropdown2Value, setDropdown2Value] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);


  useEffect(() => {
    const registerError = (message) => {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      });
    };

    setFirstName(localStorage.getItem("firstName"));

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchProfile = async () => {
      try {
          setIsPressed(false);
          const response = await axios.get(`http://localhost:8000/teachers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              department: dropdown1Value?.value === 'Select+Department' ? null : dropdown1Value?.value,
              facultyType: dropdown2Value?.value === 'Select+Faculty+Type' ? null : dropdown2Value?.value,
              facultyName: searchValue || null,
            },
          });

          setTeachers(response.data.teachers);
          setTotalPages(Math.ceil(response.data.total / 10));

          console.log(teachers);
          console.log(response);
        
      } catch (error) {
        console.error(error);
        return registerError(error.response.data.message);
      }
    };

    fetchProfile();
  }, [currentPage,dropdown1Value,dropdown2Value,isPressed]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const bodyStyle = {
    backgroundImage: 'url("/register_bg_2.png")',
    backgroundSize: 'cover',
    minHeight: '100vh',
    backgroundColor: "#475569",
  };

  // Sample data for dropdown options
  const options = [
    { value: 'Select Department', label: 'Select Department' },
    { value: 'Accounting & Law', label: 'Accounting & Law' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Management', label: 'Management' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Mathematical Sciences', label: 'Mathematical Sciences' },
    { value: 'Social Sciences & Liberal Arts', label: 'Social Sciences & Liberal Arts' },
  ];

  const options2 = [
    { value: 'Select Faculty Type', label: 'Select Faculty Type' },
    { value: 'Fulltime Faculty', label: 'Fulltime Faculty' },
    { value: 'Visiting Faculty', label: 'Visiting Faculty' },
  ];

  const handleSearch = () => {
    setIsPressed(true);
  };
  return (
    <>
      <Navbar transparent fName={fName} />
      <main>
        <section className="relative block h-500-px" style={bodyStyle}>
          <div className="flex justify-center items-center h-full flex-col">
            <h1 className="text-white font-bold text-2xl mt-24 mb-4">Browse Faculty</h1>

            <div className="flex items-center">
              {/* Dropdown 1 */}
              <Select
                options={options}
                value={dropdown1Value}
                onChange={(selectedOption) => setDropdown1Value(selectedOption)}
                placeholder="Select Department"
                className="mr-4" // Adjust the width as needed
                styles={{ control: (styles) => ({ ...styles, width: '250px' }) }}
              />

              {/* Dropdown 2 */}
              <Select
                options={options2}
                value={dropdown2Value}
                onChange={(selectedOption) => setDropdown2Value(selectedOption)}
                placeholder="Select Faculty Type"
                className="mr-4" // Adjust the width as needed
                styles={{ control: (styles) => ({ ...styles, width: '250px' }) }}
              />

              {/* Search Input */}
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Faculty Name"
                className="mr-4 rounded"
                style={{ width: "200px" }}
              />

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>
            <div className="bg-gray-200 p-4 rounded mb-4 mt-4" style={{ overflowY: 'auto', maxHeight: '500px',width:'830px' }}>
            <div>
            <div className="mb-4">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
            
              {teachers.map((teacher) => (
                <TeacherCard key={teacher._id} teacher={teacher} />
              ))}
            </div>
            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Teachers;
