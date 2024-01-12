import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import useStore from "../src/store";
import styles from "./index.module.css";

import Room  from "./_components/Room";

/**
 * This example shows how to build a collaborative flowchart
 * using Liveblocks, Zustand and React Flow
 */
export default function Index() {



  // The store is defined in src/store.ts
  const {
    liveblocks: { enterRoom, leaveRoom, isStorageLoading },
  } = useStore();

  const roomId = useOverrideRoomId("zustand-flowchart");


  // Enter the Liveblocks room on load
  useEffect(() => {
    enterRoom(roomId);
    return () => leaveRoom();
  }, [enterRoom, leaveRoom, roomId]);

  if (isStorageLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <img src="https://liveblocks.io/loading.svg" alt="Loading" />
        </div>
      </div>
    );
  }


  return (
    <>
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => <Room />}
      </ClientSideSuspense>
    </RoomProvider>
    </>
  );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */

function useOverrideRoomId(roomId: string) {
  const { query } = useRouter();
  const overrideRoomId = useMemo(() => {
    return query?.roomId ? `${roomId}-${query.roomId}` : roomId;
  }, [query, roomId]);

  return overrideRoomId;
}
