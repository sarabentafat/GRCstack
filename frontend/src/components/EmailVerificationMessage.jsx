import React from "react";
import { Link } from "react-router-dom";

const EmailVerificationMessage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-50 p-6">
      <div className="bg-white rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Vérifiez votre e-mail
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Nous vous avons envoyé un e-mail de confirmation. Veuillez vérifier
          votre boîte de réception et confirmer votre adresse e-mail pour
          continuer.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Si vous ne trouvez pas l'e-mail, vérifiez votre dossier spam ou
          indésirable.
        </p>
        <Link
          to="/login"
          className="inline-block w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationMessage;
