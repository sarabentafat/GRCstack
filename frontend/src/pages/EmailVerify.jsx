import React, { useEffect, useState } from "react";
import img from "../assets/images/verified.png";
import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyUser } from "../redux/apiCalls/authApiCall";

const EmailVerify = () => {
  const dispatch = useDispatch();
  const { userId, token } = useParams();
  const [validUrl, setValidUrl] = useState(null); // Utiliser null pour différencier les états de chargement et d'erreur

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        await dispatch(verifyUser(userId, token));
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };

    verifyEmailUrl();
  }, [dispatch, userId, token]);

  return (
    <Fragment>
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-lg shadow w-[90%] md:w-[50%] mx-auto text-center ">
          {validUrl === null ? (
            <div className="text-gray-700 text-lg font-semibold">
              Vérification en cours...
            </div>
          ) : validUrl ? (
            <>
              <img src={img} alt="Verified" className="w-24 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                Email vérifié avec succès !
              </h1>
              <p className="text-gray-600 mb-6">
                Votre adresse e-mail a été vérifiée avec succès. Vous pouvez
                maintenant vous connecter à votre compte.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-bluemain text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Connexion
              </Link>
            </>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Échec de la vérification
              </h1>
              <p className="text-gray-600 mb-6">
                Nous n'avons pas pu vérifier votre adresse e-mail. Veuillez
                réessayer ou contacter le support si le problème persiste.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-bluemain text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default EmailVerify;
