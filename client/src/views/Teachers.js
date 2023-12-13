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
  const [dropdown1Options, setDropdown1Options] = useState([]);
  const [dropdown1Value, setDropdown1Value] = useState(null);
  const [dropdown2Value, setDropdown2Value] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [dropdown3Options, setDropdown3Options] = useState([]);
  const [dropdown3Value, setDropdown3Value] = useState(null);

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

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/departments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const departmentsWithSelectOption = [
          { _id: 'Select Department', name: 'Select Department' },
          ...response.data
        ];

        setDropdown1Options(departmentsWithSelectOption);
      } catch (error) {
        console.error(error);
        registerError(error.response?.data?.message || "Failed to fetch departments");
      }
    }

    fetchDepartments();

    const fetchUniversities = async () => {
      try {
        const response = await axios.get("http://localhost:8000/universities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const universitiesOp = [
          { _id: 'Select University', name: 'Select University' },
          ...response.data
        ];

        setDropdown3Options(universitiesOp);
      } catch (error) {
        console.error(error);
        registerError(error.response?.data?.message || "Failed to fetch University");
      }
    }

    fetchUniversities();

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/teachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            university: dropdown3Value?.value === 'Select University' ? null : dropdown3Value?.value,
            page: currentPage,
            department: dropdown1Value?.value === 'Select Department' ? null : dropdown1Value?.value,
            facultyType: dropdown2Value?.value === 'Select Faculty Type' ? null : dropdown2Value?.value,
            facultyName: searchValue || null,
          },
        });

        console.log(response.data.teachers)
        setTeachers(response.data.teachers);
        setTotalPages(Math.ceil(response.data.total / 10));

      } catch (error) {
        console.error(error);
        return registerError(error.response.data.message);
      }
    };

    fetchProfile();
  }, [currentPage, dropdown1Value, dropdown2Value, dropdown3Value, isPressed]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
    minHeight: '100vh',  

  };

  const options2 = [
    { value: 'Select Faculty Type', label: 'Select Faculty Type' },
    { value: 'Fulltime Faculty', label: 'Fulltime Faculty' },
    { value: 'Visiting Faculty', label: 'Visiting Faculty' },
  ];

  const handleSearch = () => {
    setIsPressed(!isPressed);
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
                options={dropdown3Options.map(university => ({ value: university._id, label: university.name }))}
                value={dropdown3Value}
                onChange={(selectedOption) => setDropdown3Value(selectedOption)}
                placeholder="Select University"
                className="mr-4" // Adjust the width as needed
                styles={{ control: (styles) => ({ ...styles, width: '250px' }) }}
              />

              <Select
                options={dropdown1Options.map(department => ({ value: department._id, label: department.name }))}
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
            <div className="bg-gray-200 p-4 rounded mb-4 mt-4" style={{ overflowY: 'auto', maxHeight: '500px', width: '1090px' }}>
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
