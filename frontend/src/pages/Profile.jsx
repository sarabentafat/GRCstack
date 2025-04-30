import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/apiCalls/profileApiCall";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPacketsByUserId, fetchPacketsP, fetchUserPackets } from "../redux/apiCalls/packetApiCall";
import CardPacket from "../components/CardPacket";

const Profile = () => {
  const { profileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localPackets, setLocalPackets] = useState([]);

  const authUser = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.profile.profile);
  const { packetsp, loading } = useSelector((state) => state.packet);
  const userpackets = useSelector((state) => state.packet.userpackets);

  useEffect(() => {
   
    if (authUser._id === profileId) {
      dispatch(getUserProfile(authUser._id));
      dispatch(fetchUserPackets(authUser._id));
      setLocalPackets(userpackets)
      
    }else{
      
       dispatch(getUserProfile(profileId));
       dispatch(fetchPacketsP(profileId));
       setLocalPackets(packetsp);
     
    }
  }, [dispatch, profileId, authUser.id]);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="text-black dark:text-white lg:w-[80%]">
      {/* profile */}
      <div className="rounded-lg p-4 flex flex-col justify-between items-center text-center">
        <img
          className="w-24 h-24 rounded-full"
          src={userProfile?.profilePic?.url || "../assets/images/profile.jfif"}
          alt="Profile"
        />
        <div className="ml-2">
          <h1 className="font-bold">
            {userProfile?.username || "Dr Mohamed Belaili"}
          </h1>
          <p className="text-gray-500">{userProfile?.bio || "Student"}</p>
        </div>
      </div>
      {/* accomplishment */}
      <p className="text-lg font-bold">Accomplishments</p>
      <p className="mb-5">The user doesn't have accomplishments for now.</p>
      {/* packets */}
      <p className="text-lg font-bold">Packets</p>
      <div className="flex flex-col gap-2">
        {localPackets ? (
          localPackets.map((packet) => (
            <div key={packet?._id} className="mt-1">
              <CardPacket packet={packet} />
            </div>
          ))
        ) : (
          <p>No favorite packets found.</p>
        )}
      </div>
      <div>Folders</div>
    </div>
  );
};

export default Profile;
