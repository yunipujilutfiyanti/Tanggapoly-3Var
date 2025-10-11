import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";

const sections = [
    {
        title: "Pengertian",
        content: (
            <>
                <p className="mb-2 text-gray-300 text-left">
                    Sistem Persamaan Linear Tiga Variabel (SPLTV) adalah himpunan yang
                    terdiri atas tiga persamaan linear dengan tiga variabel berbeda,
                    biasanya dinyatakan dengan x, y, dan z. Tujuan utama dari SPLTV yaitu
                    menentukan nilai ketiga variabel yang dapat memenuhi ketiga persamaan
                    sekaligus.
                </p>
                <div className="text-gray-300 mb-2 text-center">
                    Sebagai contoh, SPLTV dapat dituliskan dalam bentuk:
                    <BlockMath math="2x + y - z = 5" />
                    <BlockMath math="x - 3y + 2z = 4" />
                    <BlockMath math="3x + 2y + z = 10" />
                </div>
                <p className="text-gray-300 text-left">
                    Untuk menyelesaikan SPLTV, dapat digunakan beberapa metode, seperti
                    substitusi, eliminasi, gabungan, maupun matriks. Materi ini memiliki
                    peranan penting karena membantu siswa mengembangkan kemampuan berpikir
                    analitis, logis, serta penerapan konsep matematika dalam memecahkan
                    permasalahan sehari-hari.
                </p>
            </>
        ),
    },
    {
        title: "Langkah-langkah Mengerjakan Soal SPLTV",
        content: (
            <ol className="list-decimal ps-1 text-gray-300 space-y-3 text-left">
                <li>
                    <b>Memahami bentuk soal</b>
                    <p>SPLTV terdiri dari tiga persamaan linear dengan tiga variabel.</p>
                    <div className="text-center">
                        <BlockMath math="2x + y - z = 5" />
                        <BlockMath math="x - 3y + 2z = 4" />
                        <BlockMath math="3x + 2y + z = 10" />
                    </div>
                </li>
                <li>
                    <b>Menentukan metode penyelesaian</b>
                    <p>Beberapa metode yang dapat dipakai antara lain:</p>
                    <ol
                        className="list-decimal ps-7 mt-2 space-y-1"
                        style={{ listStyleType: "lower-alpha" }}
                    >
                        <li>Substitusi</li>
                        <li>Eliminasi</li>
                        <li>Gabungan (Eliminasi + Substitusi)</li>
                        <li>Matriks/Aturan Cramer</li>
                    </ol>
                </li>
                <li>
                    <b>Menghilangkan satu variabel</b> – pilih dua persamaan lalu lakukan
                    eliminasi.
                </li>
                <li>
                    <b>Mengulangi pada pasangan persamaan lain</b> – ulangi eliminasi
                    dengan kombinasi lain.
                </li>
                <li>
                    <b>Menyelesaikan SPLDV</b> – hasil eliminasi menghasilkan sistem dua
                    variabel.
                </li>
                <li>
                    <b>Mensubstitusikan kembali</b> – masukkan hasilnya ke persamaan awal.
                </li>
                <li>
                    <b>Mengecek hasil akhir</b> – substitusikan ke semua persamaan awal.
                </li>
            </ol>
        ),
    },
    {
        title: "Metode Menyelesaikan SPLTV",
        content: (
            <div className="text-gray-300 text-left">
                <p className="mb-2">
                    Terdapat beberapa cara yang dapat digunakan untuk menyelesaikan SPLTV,
                    yaitu:
                </p>

                <p className="font-semibold">1. Metode Substitusi</p>
                <ul className="list-disc ps-14 mb-4">
                    <li>Ubah salah satu persamaan menjadi bentuk satu variabel.</li>
                    <li>Substitusikan ke persamaan lain hingga tersisa SPLDV.</li>
                    <li>Selesaikan dan substitusi kembali untuk variabel ketiga.</li>
                </ul>

                <p className="font-semibold">2. Metode Eliminasi</p>
                <ul className="list-disc ps-14 mb-4">
                    <li>Pilih dua persamaan lalu hilangkan satu variabel.</li>
                    <li>Lanjutkan hingga tersisa SPLDV, lalu selesaikan.</li>
                </ul>

                <p className="font-semibold">3. Metode Gabungan</p>
                <p className="mb-4">
                    Gunakan eliminasi untuk menyederhanakan, lalu substitusi agar lebih
                    cepat.
                </p>

                <p className="font-semibold">4. Metode Matriks (Aturan Cramer/Invers)</p>
                <ul className="list-disc ps-14">
                    <li>
                        Tuliskan SPLTV dalam bentuk matriks{" "}
                        <InlineMath math="AX = B" />.
                    </li>
                    <li>
                        Selesaikan dengan aturan Cramer atau invers matriks:{" "}
                        <InlineMath math="X = A^{-1}B" />.
                    </li>
                </ul>
            </div>
        ),
    },
    {
        title: "Contoh Soal SPLTV",
        content: (
            <div className="text-gray-300 text-left">
                <b>Diketahui SPLTV:</b>
                <div className="text-center">
                    <BlockMath math="2x + 2y - 2z = -6" />
                    <BlockMath math="2x + 4y + 2z = 14" />
                    <BlockMath math="4x + 2y + 2z = 8" />
                </div>

                <p className="mt-2 text-left">
                    Nilai dari <InlineMath math="x + y + z = \dots" />
                </p>

                <p className="font-semibold mt-4">Pembahasan:</p>
                <p><b>Eliminasi (1) dan (2):</b></p>
                <div className="text-center">
                    <BlockMath math={`\\begin{aligned} 2x + 2y - 2z &= -6 \\\\ 2x + 4y + 2z &= 14 \\\\ \\hline 4x + 6y &= 8 \\end{aligned}`} />
                </div>

                <p><b>Eliminasi (2) dan (3):</b></p>
                <div className="text-center">
                    <BlockMath math={`\\begin{aligned} 2x + 4y + 2z &= 14 \\\\ 4x + 2y + 2z &= 8 \\\\ \\hline -2x + 2y &= 6 \\end{aligned}`} />
                </div>

                <p><b>Eliminasi (1) dan (3):</b></p>
                <div className="text-center">
                    <BlockMath math={`\\begin{aligned} 2x + 2y - 2z &= -6 \\\\ 4x + 2y + 2z &= 8 \\\\ \\hline 6x + 4y &= 2 \\end{aligned}`} />
                </div>

                <p><b>Eliminasi (5) dan (6):</b></p>
                <div className="text-center">
                    <BlockMath math={`\\begin{aligned} -2x + 2y &= 6 \\\\ 6x + 4y &= 2 \\\\ \\hline -10x &= 10 \\end{aligned}`} />
                </div>

                <InlineMath math="x = -1" />
                <p><b>Substitusi ke (6):</b></p>
                <div className="text-center">
                    <BlockMath math={`\\begin{aligned} 6(-1) + 4y &= 2 \\\\ -6 + 4y &= 2 \\\\ y &= 2 \\end{aligned}`} />
                </div>

                <p><b>Cari z:</b></p>
                <InlineMath math="z = 4" />

                <p className="font-semibold mt-4 text-left">
                    Jadi, <InlineMath math="x + y + z = -1 + 2 + 4 = 5" />.
                </p>
            </div>
        ),
    },
    {
        title: "Kesimpulan",
        content: (
            <p className="text-gray-300 text-left">
                SPLTV dapat diselesaikan dengan metode substitusi, eliminasi, gabungan,
                maupun matriks. Setiap metode memiliki keunggulannya masing-masing:
                substitusi mudah, eliminasi lebih terstruktur, gabungan fleksibel, dan
                matriks efisien. Dengan menguasainya, siswa dapat melatih kemampuan
                berpikir kritis, logis, serta sistematis.
            </p>
        ),
    },
];

const Materi = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="bg-gray-900 w-full min-h-screen flex flex-col">
            <div className="w-full flex-1 bg-gray-900 w-full min-h-screen">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="border border-gray-700 rounded-none overflow-hidden bg-gray-900"
                    >
                        {/* Header */}
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center py-6 px-8 bg-gray-800 font-bold text-3xl text-white"
                        >
                            <span className="flex-1 text-left text-2xl">
                                {section.title}
                            </span>
                            <span className="ml-2">{openIndex === index ? "▲" : "▼"}</span>
                        </button>

                        {/* Konten */}
                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-[2000px] p-8" : "max-h-0 p-0"
                                } bg-gray-900 text-gray-300 text-lg md:text-2xl leading-relaxed`}
                        >
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Materi;