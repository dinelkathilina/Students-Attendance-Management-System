import React, { useEffect } from 'react';
import * as signalR from "@microsoft/signalr";
import { useSession } from '../Context/SessionContext';

const API_URL = 'https://ams-bmanedabbnb8gxdd.southeastasia-01.azurewebsites.net';

const WebSocketManager = () => {
  const { refreshSession } = useSession();

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/sessionHub`)  // Adjust this path if your hub has a different route
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveSessionUpdate", (message) => {
      console.log("Session update received:", message);
      refreshSession();
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.log("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [refreshSession]);

  return null;
};

export default WebSocketManager;