
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoChatbubbleEllipsesOutline, IoPersonOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import ProfileModel from './ProfileModel';
const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [isProfileModelOpen,setIsProfileModelOpen]=useState(false);
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                <IoChatbubbleEllipsesOutline className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                  ChatApp
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Connect Instantly</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            {
              user && (
                <Link
                  to="/chat"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <IoChatbubbleEllipsesOutline className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              )
            }

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {user ? (
              <>
                <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <IoNotificationsOutline className="h-5 w-5" />
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Profile/User Menu */}
                <button 
                onClick={()=>setIsProfileModelOpen(!isProfileModelOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <IoPersonOutline className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm font-medium">Account</span>
                </button>

              </>
            ) : (
              <>
                {/* User Actions */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )

            }

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <IoMenuOutline className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu (you can expand this later) */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-4 py-3 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2"
          >
            Home
          </Link>
          <Link
            to="/chat"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2"
          >
            Chat
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600 font-medium py-2"
          >
            About
          </Link>
          <div className="pt-2 border-t border-gray-200">
            <Link
              to="/login"
              className="block text-blue-600 font-medium py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium mt-2 text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {/* Profile Modal */}
      {isProfileModelOpen && (
          <ProfileModel setShowProfileModal={setIsProfileModelOpen}/>
      )}
    </header>
  );
}

export default Header;