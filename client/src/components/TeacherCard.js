import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ReviewCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const TeacherCard = ({ teacher }) => {
  const { name, faculty_type, department, position, university } = teacher;

  return (
    <div className="teacher-card-container">
      <div className="text-white bg-gray-700 border p-4 mb-4 shadow rounded relative">
        {/* Create Review Button */}
        <button
          className="hover:bg-emerald-500 hover:text-white absolute right-0 m-2 p-2 bg-white text-gray-700 rounded-full flex justify-center"
          style={{ marginRight: '15px' }}
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2 mt-1" />
          <Link to={`/create_review/${teacher.ID}`} className="flex items-center">
            <span>Create Review</span>
          </Link>
        </button>

        {/* Teacher Information */}
        <h3 className="hoverable-name text-lg font-bold mb-2">
          <Link to={`/teacher/${teacher.ID}`}>{name}</Link>
        </h3>
        <p className="mb-2">University: {university && university.name}</p>
        <p className="mb-2">Faculty Type: {faculty_type}</p>
        <p className="mb-2">Department: {department && department.name}</p>
        <p>Position: {position}</p>
      </div>
    </div>
  );
};

export default TeacherCard;
