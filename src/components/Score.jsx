import React from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Komponen kecil buat nampilin satu kotak skor (X, Y, atau Z)
const ScoreBox = ({ status, variable }) => {
    const getStatusColor = () => {
        if (status === 'correct') return 'bg-green-400 border-green-600';
        if (status === 'incorrect') return 'bg-red-400 border-red-600';
        return 'bg-gray-300 border-gray-400'; 
    };

    return (
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 shadow-md flex flex-col items-center justify-center transition-all duration-300 ${getStatusColor()}`}>
            <span className="text-white font-bold text-lg sm:text-xl">{variable.toUpperCase()}</span>
            {status === 'correct' && <FaCheckCircle className="text-white text-sm" />}
            {status === 'incorrect' && <FaTimesCircle className="text-white text-sm" />}
        </div>
    );
};

// Komponen utama yang akan kita panggil di Game.jsx
// Isinya adalah layout grid 3x3 yang ngelilingin papan permainan
const ScoreTracker = ({ players, children }) => {
    if (players.length < 3) return null; // Pastikan ada 3 player

    const player1 = players[0];
    const player2 = players[1];
    const player3 = players[2];

    return (
        <div className="w-full max-w-3xl mx-auto grid grid-cols-[auto,1fr,auto] gap-2 sm:gap-4">
            
            {/* Player 1 Score (Kiri, Vertikal) */}
            <div className="row-span-3 flex flex-col items-center justify-center gap-2 sm:gap-4 p-2">
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 border-2 border-white shadow-md`} style={{ backgroundColor: player1.color }}></div>
                    <p className="font-semibold text-sm">{player1.name}</p>
                    <p className="font-bold text-lg">{player1.score}</p>
                </div>
                {['x', 'y', 'z'].map(variable => (
                    <ScoreBox key={`p1-${variable}`} status={player1.submissionStatus[variable]} variable={variable} />
                ))}
            </div>

            {/* Player 2 Score (Kanan, Vertikal) */}
            <div className="row-span-3 col-start-3 flex flex-col items-center justify-center gap-2 sm:gap-4 p-2">
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 border-2 border-white shadow-md`} style={{ backgroundColor: player2.color }}></div>
                    <p className="font-semibold text-sm">{player2.name}</p>
                    <p className="font-bold text-lg">{player2.score}</p>
                </div>
                {['x', 'y', 'z'].map(variable => (
                    <ScoreBox key={`p2-${variable}`} status={player2.submissionStatus[variable]} variable={variable} />
                ))}
            </div>

            {/* Player 3 Score (Bawah, Horizontal) */}
            <div className="col-start-2 row-start-3 flex items-center justify-center gap-2 sm:gap-4 p-2">
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 border-2 border-white shadow-md`} style={{ backgroundColor: player3.color }}></div>
                    <p className="font-semibold text-sm">{player3.name}</p>
                    <p className="font-bold text-lg">{player3.score}</p>
                </div>
                {['x', 'y', 'z'].map(variable => (
                    <ScoreBox key={`p3-${variable}`} status={player3.submissionStatus[variable]} variable={variable} />
                ))}
            </div>

            {/* Tempat untuk Board Game, ditaruh di tengah */}
            <div className="col-start-2 row-start-1 row-span-2 flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
};
export default ScoreTracker;