import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import giphy from "../assets/animations/work.gif";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import phone from "../assets/images/phone.png";
import { SiQuizlet } from "react-icons/si";
import { MdQuiz } from "react-icons/md";
const Section = ({ id, title, smallText, details, setActiveSection }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const rtlClass = isRtl ? "dir-rtl text-right" : "text-left";
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5, // Trigger when 50% of the section is in view
  });


  useEffect(() => {
    if (inView) {
      controls.start("visible");
      setActiveSection(id); // Update the active section
    }
  }, [controls, inView, id, setActiveSection]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
      className={`h-screen ${rtlClass}   mt-5 ml-5 flex justify-center flex-col`}
    >
      <p className={` text-bluemain font-semibold mb-4 `}>
        {smallText}
      </p>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-gray-800 text-sm mt-4">{details}</p>
    </motion.section>
  );
};

const About = () => {
  
  const [activeSection, setActiveSection] = useState("section1");
  const { t,i18n } = useTranslation();
 const isRtl = i18n.language === "ar";
 const rtlClass = isRtl ? "dir-rtl text-right" : "text-left";
  return (
    <div className="bg-blue-50">
      <div className={`flex ${isRtl?'flex-row-reverse' : 'flex-row'}  w-[65%] mx-auto`}>
        {/* Left (Scrollable Content) */}
        <div className="w-1/2">
          <Section
            id="section1"
            title={t("about.section1.title")}
            smallText={t("about.section1.smallText")}
            details={t("about.section1.details")}
            setActiveSection={setActiveSection}
          />
          <Section
            id="section2"
            smallText={t("about.section2.smallText")}
            title={t("about.section2.title")}
            details={t("about.section2.details")}
            setActiveSection={setActiveSection}
          />
          <Section
            id="section3"
            smallText={t("about.section3.smallText")}
            title={t("about.section3.title")}
            details={t("about.section3.details")}
            setActiveSection={setActiveSection}
          />
          <Section
            id="section4"
            smallText={t("about.section4.smallText")}
            title={t("about.section4.title")}
            details={t("about.section4.details")}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Right (Fixed Sidebar) */}
        <div className="w-1/2 p-6 sticky top-0 h-screen flex items-center justify-center ">
          {activeSection === "section1" && (
            <div className=" flex justify-center  h-[65%]">
              <div className="flex flex-col justify-between ">
                {" "}
                <div className="p-4 cursor-pointer text-sm shadow rounded-lg w-fit bg-white hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="bg-blue-50 text-bluemain p-2 flex justify-center items-center rounded-lg">
                    <MdQuiz />
                  </div>
                  <p className="text-xs font-semibold">Quiz</p>
                </div>
                <div className="p-4 cursor-pointer text-sm shadow rounded-lg w-fit bg-white hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="bg-blue-50 text-bluemain p-2 flex justify-center items-center rounded-lg">
                    <MdQuiz />
                  </div>
                  <p className="text-xs font-semibold">Flach cards</p>
                </div>
              </div>

              <div className=" w-[70%]">
                <img src={phone} alt="" className="w-full h-full " />
              </div>
              <div className="flex flex-col justify-between ">
                {" "}
                <div className="p-4 cursor-pointer text-sm shadow rounded-lg w-fit bg-white hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="bg-blue-50 text-bluemain p-2 flex justify-center items-center rounded-lg">
                    <MdQuiz />
                  </div>
                  <p className="text-xs font-semibold">Tests</p>
                </div>
                <div className="p-4 cursor-pointer text-sm shadow rounded-lg w-fit bg-white hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="bg-blue-50 text-bluemain p-2 flex justify-center items-center rounded-lg">
                    <MdQuiz />
                  </div>
                  <p className="text-xs font-semibold">Games</p>
                </div>
              </div>
            </div>
          )}
          {activeSection === "section2" && (
            <img
              className="w-full md:h-auto"
              src={giphy}
              alt={t("about.work_animation_alt")}
            />
          )}
          {activeSection === "section3" && (
            <p className="text-xl font-bold">More content for Section 3</p>
          )}
          {activeSection === "section4" && (
            <p className="text-xl font-bold">More content for Section 4</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
