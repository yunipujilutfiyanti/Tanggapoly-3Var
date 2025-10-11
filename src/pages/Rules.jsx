import React from 'react';

// Data rules tetap sama
const rules = [
    {
        title: "1. Persiapan Game 🎮",
        points: [
            "Pilih tombol “Buat Game Baru” atau “Gabung dengan Kode.",
            "Jika kamu memilih “Buat Game Baru,” masukkan nama panggilanmu, lalu tekan tombol “Buat lobi.” Setelah itu, sistem akan menampilkan kode lobi yang bisa kamu bagikan kepada temanmu.",
            "Jika kamu memilih “Gabung dengan Kode,” masukkan nama panggilan dan kode ruangan yang diberikan oleh temanmu, lalu tekan tombol Gabung ke lobi",
            "Setelah ada tiga pemain di dalam lobi, tekan tombol “Lanjut ke Game” untuk memulai permainan."

        ]
    },
    {
        title: "2. Fase Giliran (Dadu & Soal) 🎲",
        points: [
            "Setiap pemain akan bergiliran menekan tombol lempar dadu.",
            "Jumlah pada titik dadu akan otomatis menentukan posisi angka dipapan permainan.",
            "Pada kotak yang di tempatin setiap pemain Adalah persamaan.",
            "Selesai Giliran: Proses ini berulang sampai seluruh pemain memperoleh soal.",
            "Proses ini berulang sampai seluruh pemain memperoleh persamaan ",
            "Setelah tiga kali pelemparan dadu, secara otomatis pada layar akan muncul tiga persamaan yang dapat disebut sebagai soal SPLTV"
        ]
    },
    {
        title: "3. Fase Jawab (Adu Cepat!)⌨️",
        points: [
            "Semua pemain dapat menghitung atau menjawab soal SPLTV masing-masing.",
            "Untuk cara perhitungan dapat ditulis pada kertas masing-masing.",
            "Setiap soal terdiri dari tiga variabel “x,y, dan z”.",
            "Setelah memperoleh nilai x, y, dan z, nilai jawaban tersebut dapat langsung dimasukkan ke dalam kolom yang tersedia.",
            "Apabila terdapat jawaban dengan hasilnya desimal lebih dari tiga angka di belakang koma, maka dapat dituliskan sampai dengan tiga angka di belakang koma saja. Contoh: 3,666",
            "Tekan tombol submit segera setelah pemain yakin dengan jawabannya"
        ]
    },
    {
        title: "4. Penilaian & Juara 🏆",
        points: [
            "Setiap pemain akan mendapatkan 10 poin setelah tahapan lempar dadu ",
            "Setiap variabel benar mendapatkan 30 poin.",
            "Setiap variabel salah mendapatkan 10 poin .",
            "Peserta dengan poin terbanyak akan menempati posisi peringkat teratas.",
            "Jika terdapat skor yang sama waktu tercepat menjadi penentu peringkat.",
            "Setelah semua jawaban terkumpul, hasil akhir akan ditampilkan berdasarkan poin tertinggi dan waktu tercepat."
        ]
    }
];

const App = () => {
    return (
        <div className="bg-gray-900 min-h-screen p-8 text-white">
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold">Panduan Cara Bermain</h1>
                <p className="text-gray-400 mt-2 text-3xl">Pahami aturannya, kuasai permainannya!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {rules.map((rule, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-start shadow-xl hover:border-blue-500 transition-colors duration-300"
                    >
                        <h3 className="font-bold text-2xl text-white mb-4">
                            {rule.title}
                        </h3>
                        <ol
                            className="list-inside pl-6 text-gray-300 space-y-2 text-xl w-full" 
                            style={{ listStyleType: 'lower-alpha' }} 
                        >
                            {rule.points.map((point, i) => (
                                <li key={i} className="text-left">{point}</li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default App;
