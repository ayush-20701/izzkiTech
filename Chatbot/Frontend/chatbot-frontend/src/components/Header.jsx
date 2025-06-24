const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">HR Assistant</h1>
        <p className="text-sm text-gray-600">
          Welcome, {user?.name} 
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {user?.role}
          </span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-xs text-green-600 font-medium">● Online</div>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;