import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProfileModel({setShowProfileModal}) {
    const {user,logoutUser}=useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
      const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  const handleLogout = () => {
    // if using redux action for logout
    dispatch(logoutUser());
    navigate("/login");
  };
    return ( 
          <div className="fixed top-15 right-0 bg-opacity-40 z-50 flex items-center justify-center">
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
     );
}

export default ProfileModel;