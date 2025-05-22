"use client";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import for React Router

const LogoutButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your existing logout logic
    console.log("Logging out...");
    // Clear user session/token here if needed
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 w-full transition-colors"
    >
      <LogOut className="h-5 w-5" />
      <span>{t("Logout")}</span>
    </button>
  );
};

export default LogoutButton;
