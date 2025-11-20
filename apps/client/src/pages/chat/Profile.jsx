import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice"; // if you have logout action
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs"; 
function Profile() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // assumes user object in Redux
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  console.log("inside profile component");
  const handleLogout = () => {
    // if using redux action for logout
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="border-t border-gray-200 px-4 bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {getInitials(user?.name || "U")}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowProfileModal(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          <BsThreeDotsVertical />
        </button>
      </div>

      {showProfileModal && (
        <div className="fixed bottom-0 left-0 bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {getInitials(user?.name || "U")}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{user?.name}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Profile);
