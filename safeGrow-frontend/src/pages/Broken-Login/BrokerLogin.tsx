import React from "react";
import { brokerloginService } from "../../auth/authServices";

const BrokerLogin: React.FC = () => {

  const handleFyersLogin = async (): Promise<void> => {
    try {
      const data = await brokerloginService();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-[350px]">

        <h1 className="text-2xl font-bold mb-6">
          Login with Fyers
        </h1>

        <button
          onClick={handleFyersLogin}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Connect Fyers Account
        </button>

      </div>
    </div>
  );
};

export default BrokerLogin;