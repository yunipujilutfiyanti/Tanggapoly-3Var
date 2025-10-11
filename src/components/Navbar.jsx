import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
    // Fungsi buat nentuin kelas CSS, sekarang tanpa mode gelap
    const getNavLinkClass = ({ isActive }) => {
        const baseClasses = "relative transition-colors duration-300 ease-out py-1";
        
        // PERBAIKAN: Cuma satu set warna, kaga pake dark:
        const stateClasses = isActive
            ? 'font-bold text-gray-500' // Warna pas aktif
            : 'text-green-600 hover:text-gray-500'; // Warna pas biasa & di-hover
        
        const underlineClasses = `
            after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:bg-blue-500 
            after:transition-transform after:duration-300 after:ease-out
            ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 after:origin-left'}
        `;

        return `${baseClasses} ${stateClasses} ${underlineClasses}`;
    };

    return (
        // PERBAIKAN: Kelas dark: di nav dihapus
        <nav className="bg-gray-900 border-b border-gray-700 py-4">
            <div className="max-w-screen-xl flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between mx-auto px-4 space-y-4 md:space-y-0">

                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl md:text-3xl font-extrabold whitespace-nowrap text-white">
                        {/* PERBAIKAN: Kelas dark: di logo dihapus */}
                        TanggaPoly<span className="text-green-400">3VAR</span>
                    </span>
                </Link>

                <div>
                    <ul className="font-medium flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-8 text-base md:text-lg">
                        <li>
                            <NavLink to="/" className={getNavLinkClass}>
                                Profil
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/materi" className={getNavLinkClass}>
                                Materi
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/rules" className={getNavLinkClass}>
                                Tata Cara
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/lobby" className={getNavLinkClass}>
                                Game
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;