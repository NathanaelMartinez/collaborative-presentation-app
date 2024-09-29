import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/user-context';
import { WebSocketProvider } from './context/websocket-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </UserProvider>
  </StrictMode>,
)
