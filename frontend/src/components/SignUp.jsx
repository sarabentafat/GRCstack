import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tiktokIcon from "../assets/icons/tik-tok.png";
import friendIcon from "../assets/icons/friends.png";
import adIcon from "../assets/icons/search.png";
import otherIcon from "../assets/icons/more.png";
import studyIcon from "../assets/icons/more.png";
import networkIcon from "../assets/icons/more.png";
import jobIcon from "../assets/icons/more.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchLevelById, fetchLevels } from "../redux/apiCalls/levelApiCall";
// import { fetchFieldById, fetchFields } from "../redux/apiCalls/fieldApiCall";
import { fetchSubfieldById } from "../redux/apiCalls/subfieldApiCall";
import { checkEmailUsername, registerUser } from "../redux/apiCalls/authApiCall";
import { useTranslation } from "react-i18next";

import wilayas from "../assets/data/wilayas"
const SignUp = () => {
    const { t } = useTranslation();
const dispatch = useDispatch();
const navigate = useNavigate();
const [loading,setLoading]=useState(null)
const [step, setStep] = useState(1);
// const [selectedYear, setSelectedYear] = useState(""); // Initialize selectedYear state
const [selectedSubfield, setSelectedSubfield] = useState("");
const [selectedLevel, setSelectedLevel] = useState(null);
const [selectedField, setSelectedField] = useState("");
const [referralsource,setReferralsource]=useState('')
const [msg, setMsg] = useState("");
const [errorPassword,setErrorPassword]=useState('')
const levels = useSelector((state) => state.level.levels);
const level = useSelector((state) => state.level.level);
const loadinga = useSelector((state) => state.level.loading);
const field = useSelector((state) => state.field.field);
        // const fields = useSelector((state) => state.field.fields);
const subfield = useSelector((state) => state.subfield.subfield);

const options = [
        {
          label: "Facebook",
          icon: "https://th.bing.com/th/id/OIP.g-PMKXEGdnEU8sBg9_X8uwHaHa?rs=1&pid=ImgDetMain",
        },
        { label: "Ami/Famille", icon: friendIcon },
        {
          label: "Instagram",
          icon: "https://th.bing.com/th/id/R.26d9974a1feec9905a4e0d5e5ddf8db6?rik=ycoXFwG5Udz08A&pid=ImgRaw&r=0",
        },
        {
          label: "Tiktok",
          icon: tiktokIcon,
        },
        { label: "Autre", icon: otherIcon },
      ];

const optionImages = {
        "Réseaux Sociaux": tiktokIcon,
        "Ami/Familie": friendIcon,
        Publicité: adIcon,
        Autre: otherIcon,
        "Aide aux études": studyIcon,
        Réseautage: networkIcon,
        "Opportunités d'emploi": jobIcon,
        Universite: studyIcon,
        Ecole: networkIcon,
        Lycee: jobIcon,
        Cem: otherIcon,
      };
const validateForm = () => {
  const errors = {};

  // Check if username is provided
  if (!formData.username.trim()) {
    errors.username = "Le nom d'utilisateur est requis";
  }

  // // Check if firstname is provided
  // if (!formData.firstname.trim()) {
  //   errors.firstname = "Le nom est requis";
  // }

  // // Check if secondname is provided
  // if (!formData.secondname.trim()) {
  //   errors.secondname = "Le prénom est requis";
  // }

  // Check if email is provided and valid
  if (!formData.email) {
    errors.email = "L'email est requis";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "L'email n'est pas valide";
  }

  // Check if phone number is provided
  if (!formData.phonenumber.trim()) {
    errors.phonenumber = "Le numéro de téléphone est requis";
  }

  // Check if gender is selected
  if (!formData.gender) {
    errors.gender = "Le genre est requis";
  }

  // Check if address is provided
  if (!formData.address) {
    errors.address = "La wilaya est requise";
  }

  // Check if password is provided and meets length requirement
  if (!formData.password) {
    errors.password = "Le mot de passe est requis";
  } else if (formData.password.length < 6) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères";
  }

  return errors;
};

const handleConfirm = (value) => {
  setConfirmedPassword(value); // Update the state

  if (formData.password !== value) {
    setErrorPassword("Les mots de passe ne correspondent pas"); // Set error message
  } else {
    setErrorPassword(""); // Clear error message if passwords match
  }
};

const [formData, setFormData] = useState({
        username: "",
        // firstname: "",
        // secondname: "",
        gender: "",
        email: "",
        address: "",
        password: "",
        phonenumber: "",
        level: "",
        field: "", // Example ObjectId for field
        subfield: "",
        // year: "",
        referralsource: "",
        // Example ObjectId for subfield
      });
const [formErrors, setFormErrors] = useState({
        username: "",
        // firstname: "",
        // secondname: "",
        gender: "",
        email: "",
        address: "",
        password: "",
        phonenumber: "",
        level: "",
        field: "", // Example ObjectId for field
        subfield: "",
        // year: "",
        referralsource: "",
        // Example ObjectId for subfield
      });
const [confirmedPassword, setConfirmedPassword] = useState("");

const message = useSelector(
        (state) => state.auth.checkemailusernameMessage
      );
      // console.log("messssage", message);
// setMsg(message)
    
const handleCheckEmailUsername = async () => {
 
        const { email, username } = formData;
        const data = { email, username };

        try {
          await dispatch(checkEmailUsername(data));

          const errors = validateForm();
console.log(errors)
          if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
           
          }else{
                   setLoading(true);
console.log("message", message);
if (message.emailExists || message.usernameExists) {
  setFormErrors({
    ...errors,
    email: message.emailExists ? "L'email est déjà utilisé" : "",
    username: message.usernameExists
      ? "Le nom d'utilisateur est déjà utilisé"
      : "",
  });
  setLoading(false);
} else {
  setLoading(false);
  nextStep();
}
          }

        } catch (error) {
          setLoading(false);
          console.log("Une erreur s'est produite lors de la vérification");
        }
      };

useEffect(() => {
        dispatch(fetchLevels());
        if(selectedLevel){
           dispatch(fetchLevelById(selectedLevel));
        }
       
      if(selectedField){
          dispatch(fetchFieldById(selectedField));
      }
        //  dispatch(fetchFieldById("66b4ea46a3a4c48176aa7900"));
        if (selectedSubfield) {
          // Add a check to ensure it's not an empty string
          dispatch(fetchSubfieldById(selectedSubfield));
        }
      }, [dispatch, selectedLevel, selectedField, selectedSubfield]);


const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

const handleOptionSelect = (name, value) => {
        setReferralsource(value);
        setFormData({ ...formData, referralsource: value });
      };

const nextStep = () => {
        setStep(step + 1);
      };
const nextStepa = () => {
        setStep(step + 1);
      };

const prevStep = () => {
        setStep(step - 1);
      };

const handleSubmit = async (e) => {
        e.preventDefault();
        // Log formData
        try {
          await dispatch(registerUser(formData)); // Dispatch the action with formData

          navigate("/emailsent"); // Redirect to /login
        } catch (error) {
          console.log("Registration failed!");
        }
      };
const handleFieldSelect = (f) => {
        setSelectedField(f); // Update selected field
        setFormData({ ...formData, field: f }); // Update formData with selected field
      };
const handleLevelSelect = (l) => {
        setSelectedLevel(l); // Update selected field
        setFormData({ ...formData, level: l }); // Update formData with selected field
      };

const handleSubfieldSelect = (f) => {
        setSelectedSubfield(f); // Update selected field

        setFormData({ ...formData, subfield: f }); // Update formData with selected field
      };

      return (
        <div className="min-w-full  h-screen">
          {loading ? (
            <div className="flex absolute top-0 justify-center items-center h-screen bg-blue-50  w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            ""
          )}
          <div className="">
            <div className="  fixed w-full">
              {" "}
              {step === 1 && (
                <div className="flex h-screen justify-center ">
                  <div className="hidden md:block md:w-1/2 lg:w-2/3 bg-blue-50 h-screen"></div>
                  <div className="flex w-[95%] mx-auto md:w-1/2 lg:w-1/3  px-7 mt-2 rounded-lg   flex-col justify-center md:mx-auto  ">
                    <h2 className="text-2xl font-bold mb-1">
                      {t("signup.title")}
                    </h2>
                    <form>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.username")}
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder={t("signup.usernamePlaceholder")}
                          value={formData.username}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.username && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.username}
                          </p>
                        )}
                      </div>

                      {/* <div className="mb-2">
                        <label className="block text-gray-700">Nom</label>
                        <input
                          type="text"
                          name="firstname"
                          placeholder="Entrez votre nom"
                          value={formData.firstname}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.firstname && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.firstname}
                          </p>
                        )}
                      </div> */}
                      {/* <div className="mb-2">
                        <label className="block text-gray-700">Prénom</label>
                        <input
                          type="text"
                          name="secondname"
                          placeholder="Entrez votre prénom"
                          value={formData.secondname}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.secondname && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.secondname}
                          </p>
                        )}
                      </div> */}
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.email")}
                        </label>
                        <input
                          type="email"
                          placeholder={t("signup.emailPlaceholder")}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.phoneNumber")}
                        </label>
                        <input
                          type="tel"
                          placeholder={t("signup.phoneNumberPlaceholder")}
                          name="phonenumber"
                          value={formData.phonenumber}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.phonenumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.phonenumber}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.gender")}
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        >
                          <option value="">
                            {t("signup.genderPlaceholder")}
                          </option>
                          <option value="male">{t("signup.genderMale")}</option>
                          <option value="female">
                            {t("signup.genderFemale")}
                          </option>
                        </select>
                        {formErrors.gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.gender}
                          </p>
                        )}
                      </div>

                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.address")}
                        </label>
                        <select
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        >
                          <option value="">
                            {t("signup.addressPlaceholder")}
                          </option>
                          {wilayas.map((wilaya) => (
                            <option key={wilaya.value} value={wilaya.value}>
                              {wilaya.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.address && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.address}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.password")}
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder={t("signup.passwordPlaceholder")}
                          value={formData.password}
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {formErrors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.password}
                          </p>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          {t("signup.confirmPassword")}
                        </label>
                        <input
                          type="password"
                          name="confirmedPassword"
                          placeholder={t("signup.confirmPasswordPlaceholder")}
                          value={confirmedPassword}
                          onChange={(e) => handleConfirm(e.target.value)}
                          className="mt-1 p-2 w-full border rounded-lg"
                        />
                        {errorPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {errorPassword}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckEmailUsername}
                        className="bg-blue-500 w-full text-white p-2 rounded-lg"
                      >
                        {t("signup.next")}
                      </button>

                      <div className="text-black">
                        Vous avez un compte ?{" "}
                        <Link className="text-blue-500" to={"/login"}>
                          Se connecter
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex h-screen justify-center w-[80%] md:w-[500px]  items-center mx-auto ">
            {step === 2 && (
              <div className="">
                <form className=" ">
                  <label className="block w-fit text-xl mb-10 py-6 shadow bg-blue-500 text-white p-4 rounded-r-2xl rounded-bl-2xl">
                    Comment avez-vous entendu parler de notre application ?
                  </label>

                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      {options.map((option) => {
                        const isSelected = referralsource === option.label;

                        return (
                          <div
                            key={option.label}
                            onClick={() =>
                              handleOptionSelect("heardAbout", option.label)
                            }
                            className={`p-4 rounded-lg cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? "border border-blue-500 bg-blue-50 "
                                : "bg-blue-50 shadow"
                            }`}
                          >
                            <img
                              src={option.icon}
                              alt={option.label}
                              className="w-10 h-10 object-cover"
                            />
                            <p className="mt-2 text-center">{option.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-gray-500 p-2 rounded mr-2"
                    >
                      Précédent
                    </button>
                    {referralsource && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-500 text-white p-2 rounded-lg px-16 py-4"
                      >
                        Continuer
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <form className="w-full  ">
                <label className="block w-fit text-xl mb-10 py-6 shadow bg-blue-500 text-white p-4 rounded-r-2xl rounded-bl-2xl">
                  Quel est votre niveau d'études actuel ?
                </label>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    {levels && levels.length > 0 ? (
                      levels.map((level) => {
                        const isSelected = selectedLevel === level._id; // Check if this level is selected

                        return (
                          <div
                            key={level._id} // Use level._id for unique keys
                            className={`p-4 rounded-lg cursor-pointer flex items-center gap-4 ${
                              isSelected
                                ? "bg-blue-50 border border-blue-500"
                                : "bg-blue-50 shadow"
                            }`}
                            onClick={() => handleLevelSelect(level._id)} // Ensure this function is correctly defined
                          >
                            <p>{level.name}</p> {/* Display the level name */}
                          </div>
                        );
                      })
                    ) : (
                      <p>Aucun niveau disponible</p> // Display message if levels are empty
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-500 p-2 rounded mr-2"
                  >
                    Précédent
                  </button>
                  {selectedLevel && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-500 text-white p-2 rounded-lg px-16 py-4"
                    >
                      Continuer
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 4 && (
              <form className=" min-w-full  flex flex-col justify-evenly">
                <label className="block w-fit text-xl mb-10 py-6 shadow bg-blue-500 text-white p-4 rounded-r-2xl rounded-bl-2xl">
                  Choisissez un domaine d'étude
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {level?.fields?.map((f) => {
                    const isSelected = selectedField === f._id;

                    return (
                      <div
                        key={f.id}
                        className={`p-4 rounded-lg cursor-pointer flex items-center gap-4 ${
                          isSelected
                            ? "bg-blue-50 border border-blue-500"
                            : "bg-blue-50 shadow"
                        }`}
                        onClick={() => handleFieldSelect(f._id)} // Corrected this line
                      >
                        <p>{f.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-500 p-2 rounded mr-2"
                  >
                    Précédent
                  </button>
                  {selectedField && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-500 mt-2 text-white p-2 rounded-lg px-16 py-4"
                    >
                      Continuer
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 5 && (
              <form className=" min-w-full flex flex-col justify-evenly">
                <label className="block w-fit text-xl mb-10 py-6 shadow bg-blue-500 text-white p-4 rounded-r-2xl rounded-bl-2xl">
                  Choisissez votre spécialité
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {field?.subfields?.map((subfield) => {
                    const isSelected = selectedSubfield === subfield._id; // Determine if this subfield is selected
                    return (
                      <div
                        key={subfield._id}
                        className={`p-4 rounded-lg cursor-pointer flex items-center gap-4 ${
                          isSelected
                            ? "bg-blue-50 border border-blue-500"
                            : "bg-blue-50 shadow"
                        }`}
                        onClick={() => handleSubfieldSelect(subfield._id)} // Handle selection
                      >
                        <p>{subfield.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-500 p-2 rounded mr-2"
                  >
                    Précédent
                  </button>
                  {selectedSubfield && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-500 text-white p-2 rounded-lg px-16 py-4"
                    >
                      Continuer
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 6 && (
              <form
                onSubmit={handleSubmit}
                className=" min-w-full flex flex-col justify-evenly "
              >
                <label className="block w-fit text-xl mb-2 shadow bg-blue-500 text-white p-4 rounded-r-2xl rounded-bl-2xl">
                  A quelle année vous êtes ?
                </label>


              </form>
            )}
          </div>
        </div>
      );
    };
  
export default SignUp;
