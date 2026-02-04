import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket/socket";
import Chat from "../components/Chat";
import Whiteboard from "../components/Whiteboard";
import Summary from "../components/Summary";

export default function Room() {
  const { roomId } = useParams();
  const boardRef = useRef(null);

  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem("token")
    };

    socket.connect();

    socket.emit("join-room", {
      roomId,
      username: "Rahat"
    });

    return () => socket.disconnect();
  }, [roomId]);

  return (
    <div className="h-screen bg-gray-900 p-4 grid grid-rows-[1fr_260px] gap-4">

      {/* WHITEBOARD */}
      <div className="bg-gray-700 rounded-lg p-2">
        <Whiteboard ref={boardRef} roomId={roomId} />
      </div>

      {/* CHAT + SUMMARY */}
      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2">
          <Chat roomId={roomId} />
        </div>

        <Summary
          roomId={roomId}
          getImage={() => boardRef.current.captureCanvas()}
        />
      </div>
    </div>
  );
}
