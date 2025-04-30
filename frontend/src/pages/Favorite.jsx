import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedPackets } from "../redux/apiCalls/packetApiCall";
import CardPacket from "../components/CardPacket"; // Import the renamed CardPacket

const Favorite = () => {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const packets = useSelector((state) => state.packet.likedPackets);
console.log(packets)
console.log(authUser._id);
  useEffect(() => {
    if (authUser?._id) {
      dispatch(fetchLikedPackets(authUser._id));
    }
  }, [dispatch, authUser]);

  // If authUser is not available, show loading message
  if (!authUser?._id) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="lg:w-[80%]">
      <h1 className="text-xl mb-2 font-bold">Les packets favoris</h1>
      <div className="w-full grid grid-cols-2 gap-2">
        {packets?.length > 0 ? (
          packets.map((packet) => (
            <CardPacket
              key={packet?._id}
              packet={packet}
              profileId={packet?.user?.id} // Safe access using optional chaining
            />
          ))
        ) : (
          <p>No favorite packets found.</p>
        )}
      </div>
    </div>
  );
};

export default Favorite;
