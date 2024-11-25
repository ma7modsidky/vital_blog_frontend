import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App';
import {
  BrowserRouter as Router, Routes , Route
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext';

// this just renders the app component

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Router>
      <ModalProvider>
      <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />}/>
      </Routes>
      </AuthProvider>
      </ModalProvider>
    </Router>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

