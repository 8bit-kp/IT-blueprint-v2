import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import UserBanner from "./UserBanner";

const FormHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 mb">
      {/* Top Row: Back button + Heading + Logo */}
      <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-lg">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#935010] to-[#34808A] text-white rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          >
            <FiArrowLeft size={20} /> Back
          </button>
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#34808A] to-[#15587B] drop-shadow-md">
            Manage Your IT Blueprint
          </h2>
        </div>
        <img
          src="/conslteklogo.png"
          alt="Consltek Logo"
          className="h-14 w-auto"
        />
      </div>

      {/* User Banner: Full-width stripe below */}
      {/* <UserBanner /> */}
    </div>
  );
};

export default FormHeader;