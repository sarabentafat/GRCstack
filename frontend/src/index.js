import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./redux/store";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS directly after importing it
AOS.init({
  duration: 1000, // Adjust the duration as needed
  once: true, // Animation should happen only once
});

// Uncomment if you plan to use these variables later
// const handleLanguageChange = () => { /* handle language change */ };
// const language = 'en';
// const isRtl = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
        <ToastContainer />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

// For measuring performance in the app
reportWebVitals();
