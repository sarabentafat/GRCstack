import React, { useEffect, useState } from 'react'
import LineChart from '../components/LineChart';
import Calendar from '../components/Calender';
import Streak from '../components/Streak';
import LearningPathCard from '../components/LearningPathCard';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDispatch, useSelector } from 'react-redux';

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
  return (
    <div className="lg:flex lg:gap-7 ">
      <div className="">
        <h1 className="font-bold text-2xl">
          Welcome back <span className="text-pink-500">{authUser.username} </span>!
        </h1>
       
      </div>

    </div>
  );
}

export default Accueil