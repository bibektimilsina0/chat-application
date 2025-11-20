import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoChatbubbleEllipsesOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline,
  IoLogoGithub,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoLogoInstagram,
  IoHeartOutline
} from 'react-icons/io5';

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <IoChatbubbleEllipsesOutline className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">ChatApp</h3>
              <p className="text-sm text-gray-400">Connect Instantly</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4 max-w-md">
            Experience seamless communication with friends, family, and colleagues. 
            Real-time messaging, secure conversations, and intuitive design.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              <IoLogoGithub className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              <IoLogoTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              <IoLogoLinkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              <IoLogoInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>

       
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-gray-400 hover:text-white transition-colors duration-200">
                Chat
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-200">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <IoMailOutline className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">support@chatapp.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <IoCallOutline className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <IoLocationOutline className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Bottom Section */}
      <div className=" pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <IoHeartOutline className="h-4 w-4 text-red-500" />
              <span>by Bibek Timilsina</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;