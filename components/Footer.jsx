
// components/Footer.jsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ContentPlatform</h3>
              <p className="text-gray-400">
                A premium platform for exclusive content.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/browse" className="text-gray-400 hover:text-white">
                    Browse Content
                  </a>
                </li>
                <li>
                  <a href="/models" className="text-gray-400 hover:text-white">
                    Models
                  </a>
                </li>
                <li>
                  <a href="/membership" className="text-gray-400 hover:text-white">
                    Premium Membership
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/copyright" className="text-gray-400 hover:text-white">
                    Copyright Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {currentYear} ContentPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }