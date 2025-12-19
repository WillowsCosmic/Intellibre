import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout
}) => {
  const navigate = useNavigate()
  
  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onToggle();
        }}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#f5f1eb] transition-colors duration-200"
      >
        {/* Avatar */}
        {avatar ? (
          <img 
            src={avatar} 
            alt="Avatar" 
            className="h-9 w-9 object-cover rounded-xl" 
          />
        ) : (
          <div className="h-9 w-9 bg-linear-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {companyName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        
        {/* Name & Email */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-[#3d2f1f]">{companyName}</p>
          <p className="text-xs text-[#8b7d6f]">{email}</p>
        </div>
        
        {/* Chevron Icon */}
        <ChevronDown 
          className={`h-4 w-4 text-[#6b5d4f] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e8e0d5] py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[#e8e0d5]">
            <p className="text-sm font-medium text-[#3d2f1f]">{companyName}</p>
            <p className="text-xs text-[#8b7d6f]">{email}</p>
          </div>
          
          {/* View Profile */}
          <button 
            onClick={() => {
              navigate('/profile');
              onToggle(); // Close dropdown
            }} 
            className="w-full text-left px-4 py-2 text-sm font-medium text-[#3d2f1f] hover:bg-teal-50/50 hover:text-teal-700 transition-colors cursor-pointer"
          >
            View Profile
          </button>
          
          {/* Sign Out */}
          <div className="border-t border-[#e8e0d5] mt-2 pt-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onLogout();
              }} 
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown