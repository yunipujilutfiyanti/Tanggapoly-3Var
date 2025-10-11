import React from 'react';
import { Outlet } from "react-router-dom"; // <-- Impor Outlet, ini penting banget
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      {/* Outlet ini adalah 'jendela' atau 'ruang kosong'. 
        main.jsx bakal otomatis nampilin halaman yang sesuai (Profile, Lobby, Game) di sini.
      */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;

