import React from 'react';
import pp from '../assets/pp.png';
import mockupGame from '../assets/mockup.jpg';

function Profile() {
    return (
        <main className="bg-gray-900">
            <div className="mx-auto px-6 sm:px-16 py-12">
                {/* ======================================================= */}
                {/* Bagian 1: Hero Section Perkenalan                         */}
                {/* ======================================================= */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    {/* Kolom Kiri: Gambar Mockup */}
                    <div className="flex justify-center">
                        <img
                            className="rounded-lg shadow-2xl w-full max-w-md transform transition-transform duration-500 hover:scale-105"
                            src={mockupGame}
                            alt="Mockup Tanggapoly 3Var"
                        />
                    </div>

                    {/* Kolom Kanan: Teks */}
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-5xl">
                            Apa itu Tanggapoly 3Var?
                        </h1>
                        <p className="text-justify mt-6 text-2xl text-gray-400 md:text-3xl">
                            Tanggapoly-3Var adalah sebuah media pembelajaran inovatif yang
                            dikembangkan untuk membantu siswa-siswi memahami materi Sistem
                            Persamaan Linear Tiga Variabel (SPLTV) dengan cara yang lebih
                            menyenangkan dan interaktif.
                        </p>
                    </div>
                </section>

                {/* ======================================================= */}
                {/* Bagian 2: Manfaat & Keunggulan                          */}
                {/* ======================================================= */}
                <section className="mb-10">
                    <div className="text-center mb-10 bg-slate-800 rounded-2xl p-4 sm:p-8 shadow-inner">
                        <h2 className="text-2xl font-bold text-white sm:text-4xl md:text-4xl">
                            Kenapa Belajar Pake Tanggapoly?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="block p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
                            {/* SVG dan H5 berjejer */}
                            <div className="flex items-center mb-4">
                                <svg className="w-20 h-20 mr-4 text-amber-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.335 2.712a3.341 3.341 0 0 1 3.33 3.332v.333H15.99a2 2 0 0 1 2 2v5.333a2 2 0 0 1-2 2H4.01a2 2 0 0 1-2-2V8.375a2 2 0 0 1 2-2h2.325v-.333a3.341 3.341 0 0 1 3.33-3.332h.34Z M10 12.042a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                                </svg>
                                <h5 className=" text-left text-2xl font-bold tracking-tight text-white md:text-2xl">Asah Logika & Nalar Kritis</h5>
                            </div>
                            {/* P rata kiri */}
                            <p className="text-justify text-l font-normal text-gray-400 md:text-xl">Berlatih keterampilan berpikir kritis, logis, dan sistematis dalam menyelesaikan soal SPLTV.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="block p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center mb-4">
                                <svg className="w-20 h-20 mr-4 text-amber-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 1v11.333a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V1h16Z M12 5h.01M8 5h.01M4 5h.01M4 9h.01M8 9h.01M12 9h.01M18 5v10a2 2 0 0 1-2 2h-1" /></svg>
                                <h5 className="text-left text-2xl font-bold tracking-tight text-white md:text-2xl">Belajar Jadi Menyenangkan</h5>
                            </div>
                            <p className="text-justify text-l font-normal text-gray-400 md:text-xl">Mengurangi rasa jenuh dan membuat konsep SPLTV lebih mudah dipahami dan diingat.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="block p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center mb-4">
                                <svg className="w-20 h-20 mr-4 text-amber-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 19a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1Zm-6 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H7Zm-6 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1Zm12-8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-6-5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                <h5 className="text-left text-2xl font-bold tracking-tight text-white md:text-2xl">Penuh Tantangan & Kerjasama</h5>
                            </div>
                            <p className="text-justify text-l font-normal text-gray-400 md:text-xl">Menikmati suasana belajar yang interaktif dan penuh tantangan bersama teman-teman.</p>
                        </div>
                    </div>
                </section>

                {/* ======================================================= */}
                {/* Bagian 3: Tentang Pencipta                              */}
                {/* ======================================================= */}
                <section className="bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                        {/* Foto Pencipta */}
                        <img
                            className="w-28 h-28 rounded-full shadow-lg ring-4 ring-gray-700"
                            src={pp}
                            alt="Foto Pencipta"
                        />
                        {/* Info Pencipta */}
                        <div>
                            <h3 className="text-2xl font-semibold text-white md:text-3xl">
                                Diciptakan dengan Penuh Semangat
                            </h3>
                            <p className="text-justify mt-2 text-l text-gray-400 md:text-xl">
                                Permainan ini diciptakan oleh{" "}
                                <strong>Yuni Puji Lutfiyanti</strong>, salah satu mahasiswa
                                Universitas Muhammadiyah Jember, sebagai wujud kreativitas dalam
                                mengembangkan media pembelajaran berbasis permainan.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Profile;