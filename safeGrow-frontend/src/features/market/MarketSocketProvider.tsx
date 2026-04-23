"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { getSocket } from "@/src/lib/socket";
import {
  tickReceived,
  allTicksReceived,
  setMarketStatus,
  TickData,
} from "@/src/features/market/marketSlice";

/**
 * MarketSocketProvider
 * Drop this inside any page/layout that needs live market data.
 * It connects to the backend Socket.io server and dispatches
 * tick/status events into Redux automatically.
 */
export default function MarketSocketProvider() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    // Backend sends current status on connect
    socket.on("marketStatus", (status: "online" | "offline") => {
      dispatch(setMarketStatus(status));
    });

    // Backend sends a full snapshot of all current ticks on connect
    socket.on("allTicks", (allTicks: Record<string, TickData>) => {
      dispatch(allTicksReceived(allTicks));
    });

    // Backend sends individual ticks in real-time
    socket.on("tick", (tick: TickData) => {
      dispatch(tickReceived(tick));
    });

    socket.on("connect", () => {
      dispatch(setMarketStatus("connecting"));
    });

    socket.on("disconnect", () => {
      dispatch(setMarketStatus("offline"));
    });

    return () => {
      socket.off("marketStatus");
      socket.off("allTicks");
      socket.off("tick");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [dispatch]);

  // Renders nothing — purely a side-effect component
  return null;
}
