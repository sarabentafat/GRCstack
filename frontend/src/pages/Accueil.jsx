import React, { useEffect, useState } from 'react'
import LineChart from '../components/LineChart';
import Calendar from '../components/Calender';
import Streak from '../components/Streak';
import LearningPathCard from '../components/LearningPathCard';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubfieldById } from '../redux/apiCalls/subfieldApiCall';
import { fetchYearById } from '../redux/apiCalls/yearApiCall';
const modules = [
  { title: "Module1 Systeme respertoire", subtitle: "Anatomie", score: 80 },
  { title: "Module2 Biologie", subtitle: "Physiologie", score: 60 },
  { title: "Module3 Chimie", subtitle: "Organique", score: 90 },
  { title: "Module4 Physique", subtitle: "Mécanique", score: 70 },
  { title: "Module5 Informatique", subtitle: "Algorithmes", score: 85 },
  { title: "Module6 Mathématiques", subtitle: "Calcul Intégral", score: 75 },
  { title: "Module7 Géographie", subtitle: "Géologie", score: 65 },
  { title: "Module8 Histoire", subtitle: "Révolution Industrielle", score: 50 },
  { title: "Module9 Littérature", subtitle: "Poésie", score: 95 },
  { title: "Module10 Philosophie", subtitle: "Éthique", score: 55 },
];

const Accueil = () => {
  const dispatch = useDispatch();
  const [score,setScore]=useState(75)
    const authUser = useSelector((state) => state.auth.user);
    console.log(authUser)
    console.log(authUser.year)
  const year = useSelector((state) => state.year.year);
  console.log(year)
useEffect(() => {

  //  dispatch(fetchFieldById("66b4ea46a3a4c48176aa7900"));
 
    dispatch(fetchYearById(authUser.year));
  
}, [dispatch]);

  return (
    <div className="lg:flex lg:gap-7 ">
      <div className="">
        <h1 className="font-bold text-2xl">
          Welcome back <span className="text-pink-500">{authUser.username} </span>!
        </h1>
        <h2 className="font-bold text-2xl">
          continue learning in your learning Plan
        </h2>
        {/* learinng path */}
        lerning path hereeeeeeeeeeeeeeeeeeeeeee
        {/* <div className="grid grid-cols-2  gap-8 mt-4">
          <LearningPathCard />
          <LearningPathCard />
          <LearningPathCard />
          <LearningPathCard />
          <LearningPathCard />
        </div> */}
        {/* <div className="">
        <Calendar />
      </div> */}
        {/* <div className="lg:flex  mt-2 gap-3 justify-between w-full ">
        <div className=" lg:w-[70%] dark:bg-second bg-white p-7 rounded-lg  ">
          <LineChart />
        </div>
      </div> */}
      </div>
      <div className="lg:w-1/2 bg-white h-screen dark:bg-second  rounded-t-xl">
        <div className="mt-2">
          {" "}
          <Calendar />
        </div>
        {/* modules progress */}
        <div className="p-4">
          <h1 className="font-bold mb-2">Modules progress</h1>
          <div className=" bg-white dark:bg-second  rounded-md">
            <div className="overflow-y-scroll h-64 p-4 custom-scrollbar">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <h1 className="text-sm font-bold">{module.title}</h1>
                    <p className="font-bold text-gray-600 text-xs">
                      {module.subtitle}
                    </p>
                  </div>
                  <div>
                    <CircularProgressbar
                      className="w-10 font-bold dark:text-white"
                      value={module.score}
                      text={`${module.score}%`}
                      styles={buildStyles({
                        pathColor: "blue", // Blue color for the progress path
                        textColor: "black dark:text-white",
                        trailColor: "lightblue", // Light blue color for the trail
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil