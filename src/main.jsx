import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Materi from "./pages/Materi";
import Rules from "./pages/Rules";
import './index.css';
import './App.css'
import 'katex/dist/katex.min.css';

// 1. Definisikan semua rute aplikasi lu pake cara baru yang canggih
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App.jsx sekarang jadi layout utama (isinya Navbar)
    children: [
      { path: "/", element: <Profile /> },
      { path: "/materi", element: <Materi /> },
      { path: "/rules", element: <Rules /> },
      { path: "/game/:gameId", element: <Game /> },
      { path: "/lobby", element: <Lobby /> },
    ],
  },
]);

// 2. Render aplikasi pake RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

