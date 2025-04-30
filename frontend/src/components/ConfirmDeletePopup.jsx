// ConfirmDeletePopup.js
import React from "react";

const ConfirmDeletePopup = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-second w-[80%] flex flex-col justify-evenly h-[50%] lg:w-[50%]  p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Supprimer cette liste ? test Vous êtes sur le point de supprimer cette
          liste et tout son contenu.
        </h2>
        <p>
          {" "}
          Personne ne pourra jamais plus y accéder. Êtes-vous vraiment sûr ? Il
          sera impossible d'annuler cette opération.
        </p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
