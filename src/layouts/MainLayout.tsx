import { type ReactNode } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Virtual Store
          </Link>
          <nav>
            <ul className="flex items-center space-x-6 text-sm font-medium">
              <li><Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-indigo-600">How It Works</a></li>
              <li><Link to="/store" className="text-gray-600 hover:text-indigo-600">Stores</Link></li>
              <li><a href="#about" className="text-gray-600 hover:text-indigo-600">About</a></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/orders" className="text-gray-600 hover:text-indigo-600">My Orders</Link></li>
                  <li><Link to="/store" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Enter Store</Link></li>
                  <li>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-gray-600 hover:text-red-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link></li>
                  <li><Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col w-full">
        {children || <Outlet />}
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center md:text-left">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Virtual Store</h3>
            <p className="text-sm">Experience the future of online shopping with our browser-based 3D virtual environment.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/store" className="hover:text-white">Stores</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; {new Date().getFullYear()} Virtual Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
