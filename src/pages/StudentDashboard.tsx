// import React from 'react';
import { useAuth } from '../hooks/authContext';
import { doSignOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
// import {
//   Bell,
//   BookOpen,
//   Calendar,
//   ChevronRight,
//   Home,
//   MessageSquare,
//   Settings,
//   User,
// } from "lucide-react";

const StudentDashboard=()=> {

  const navigate = useNavigate();
  // const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();

  return (
    <main className="flex flex-wrap mx-auto bg-white">
      <img
        src={currentUser?.photoURL ? currentUser.photoURL : 'https://via.placeholder.com/150'}
        alt="photo"
        className="w-40 h-40 object-cover"
      />
      <button type='button' onClick={() => { doSignOut().then(() => { navigate('/'); }); }} className='text-sm text-blue-600 underline'>Logout</button>
      <div className='text-2xl font-bold pt-14'>Hello {currentUser?.displayName ? currentUser.displayName : currentUser?.email}, you are now logged in.</div>
    </main>
  );
};

export default StudentDashboard;