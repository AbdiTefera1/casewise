// components/Navbar.js
export default function Navbar() {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="font-bold text-xl">Casewise</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Features</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">About Us</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Resources</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Support</a>
                <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md">Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
  