import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './lib/AuthContext';
import { registerServiceWorker } from './lib/registerServiceWorker';

// Register PWA service worker for Chrome & mobile installability
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

