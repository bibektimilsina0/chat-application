
import './App.css'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'
import { BrowserRouter,Navigate,Outlet,Route,Routes, useLocation  } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import Chat from './pages/chat/Chat'
import { useEffect } from 'react'
import { checkAuth, getProfile } from './redux/slices/authSlice'
import About from './pages/about/About'
const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated? <Outlet/>: <Navigate to='/login' replace />
}
// Layout component that conditionally hides header/footer in chat
const Layout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');

  return (
    <>
      {!isChatPage && <Header />}
      <Outlet /> {/* Renders child routes */}
      {!isChatPage && <Footer />}
    </>
  );
};

function App() {

const dispatch = useDispatch();
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
        await dispatch(getProfile()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };
      initializeAuth();
    
  }, [dispatch]);
  return (
    <div className="App">
      {/* <Header />
      <LandingPage />
      <Footer /> */}
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      <Routes>
         <Route element={<Layout />}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login/>} />    
        <Route path='/register' element={<Register/>} />
        <Route path='/about' element={<About/>} />
        {/* Add more routes as needed */}
        </Route>
        <Route element={<ProtectedRoute />}>
        <Route path='/chat' element={<Chat/>} />
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
