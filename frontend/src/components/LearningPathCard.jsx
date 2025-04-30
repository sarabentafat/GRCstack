import React from 'react'

const LearningPathCard = () => {
  return (
    <div className="bg-white dark:bg-second w-fit shadow rounded-[50px] p-6 flex flex-col gap-4">
     <div className='bg-blue-500 rounded-full w-[30px] h-[30px] p-1 text-white text-center'>1</div> <h1 className="font-bold text-xl">Medical English</h1>
      <p className="text-sm text-gray-800 dark:text-gray-400 mt-2 w-[80%]">
        Chapter 1 : system resperatoire Chapter 2 : micro phisiologie Chapter 3
        : system resperatoire{" "}
      </p>
      <div className="flex justify-between">
        {" "}
        <div className="bg-[#C7FFD2] dark:text-black w-fit rounded-3xl py-1 px-2 mt-2 text-sm font-semibold">
          Completed 👏{" "}
        </div>
        <div className="bg-pink-100 w-1/5 rounded-3xl flex items-center justify-between">
          <div className=" w-1/2 text-center ">X</div>
          <div className="bg-black rounded-full text-center  text-white w-1/2 h-full">
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPathCard