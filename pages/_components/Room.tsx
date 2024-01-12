import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, { Controls, MiniMap } from "reactflow";
import useStore from "../../src/store";
import { useRouter } from "next/router";
import styles from "../index.module.css";
import { RoomProvider, useMyPresence, useOthers } from "liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import Cursor from "components/Cursor";

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export function Room() {
  const {
    liveblocks: { enterRoom, leaveRoom, isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore();
  const [{ cursor }, updateMyPresence] = useMyPresence();

  // Get list of other users
  const others = useOthers();

  function handlePointerMove(e: { clientX: number; clientY: number }) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave(e: any) {
    updateMyPresence({ cursor: null });
  }

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onPointerMove={(event) => {
          // Update the user cursor position on every pointer move
          updateMyPresence({
            cursor: {
              x: Math.round(event.clientX),
              y: Math.round(event.clientY),
            },
          });
        }}
        onPointerLeave={() =>
          // When the pointer goes out, set cursor to null
          updateMyPresence({
            cursor: null,
          })
        }
      >
        <Controls />
        {
          /**
           * Iterate over other users and display a cursor based on their presence
           */
          others.map(({ connectionId, presence }) => {
            if (presence.cursor === null) {
              return null;
            }

            return (
              <Cursor
                key={`cursor-${connectionId}`}
                // connectionId is an integer that is incremented at every new connections
                // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
                color={COLORS[connectionId % COLORS.length]}
                x={presence.cursor.x}
                y={presence.cursor.y}
              />
            );
          })
        }
      </ReactFlow>
    </div>
  );
}
