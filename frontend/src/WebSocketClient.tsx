import { useEffect } from "react";

const WebSocketClient: React.FC = () => {
  useEffect(() => {
    // connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      
      // test send action message to add a new slide
      const message = {
        type: 'action',
        action: 'addSlide',
        payload: { content: 'New Slide Content' },
        userId: 'user123',  // mock userId for testing
        role: 'creator'  // assign creator role
      };
      ws.send(JSON.stringify(message)); // send the addSlide action to the server
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
      <h1>WebSocket Client</h1>
    </div>
  );
};

export default WebSocketClient;