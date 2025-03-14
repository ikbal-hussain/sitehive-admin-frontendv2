import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Link
        to="/dashboard"
        className="px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold rounded-3xl flex items-center gap-4 shadow-lg transition-transform transform hover:scale-102"
      >
        <LayoutDashboard size={40} />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;
