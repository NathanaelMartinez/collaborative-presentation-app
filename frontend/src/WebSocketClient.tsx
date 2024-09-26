import React, { useEffect } from 'react';

const WebSocketClient: React.FC = () => {
  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.send(JSON.stringify({ type: 'message', payload: 'Hello from client' }));
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Basic WebSocket Client</h1>
    </div>
  );
};

export default WebSocketClient;
