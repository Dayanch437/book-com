import { Link } from 'react-router-dom';

export default function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 bg-white shadow-sm md:hidden">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"   // 👈 put logo.png inside your public/ folder
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Add any mobile-specific header elements here */}
        </div>
      </div>
    </header>
  );
}
