import React from 'react'
import profile from '../assets/images/profile.jfif'

const Notifications = () => {
  return (
    <div className="flex flex-col gap-1">
      Notifications
      <div className="flex dark:bg-second bg-white p-3  rounded shadow-sm gap-1">
        <img src={profile} alt="" className="h-14" />
        <div>
          <h1>
            <span className="font-bold">Malika </span>followed you
          </h1>
          <p className="text-sm">12:15 Lorem ipsum dolor sit.</p>
        </div>
      </div>
      <div className="flex dark:bg-second bg-white p-3  rounded shadow-sm gap-1">
        <img src={profile} alt="" className="h-14" />
        <div>
          <h1>
            <span className="font-bold">Malika </span>followed you
          </h1>
          <p className="text-sm">12:15 Lorem ipsum dolor sit.</p>
        </div>
      </div>
      <div className="flex dark:bg-second bg-white p-3  rounded shadow-sm gap-1">
        <img src={profile} alt="" className="h-14" />
        <div>
          <h1>
            <span className="font-bold">Malika </span>followed you
          </h1>
          <p className="text-sm">12:15 Lorem ipsum dolor sit.</p>
        </div>
      </div>
    </div>
  );
}

export default Notifications