// src/pages/Game.jsx
import React from 'react';
import { useState, useEffect } from "react";
import { FaTrophy, FaQuestionCircle } from "react-icons/fa"; // Gue tambahin FaQuestionCircle
import Board from "../components/Board";
import { questionPacks } from "../components/questions";

const specialMoves = {
    7: 15, 9: 14, 10: 13, 5: 1
};

const allEquations = {
    1: "2x+y+z=7", 2: "3x+2y+z=13", 3: "x+y+2z=10", 4: "x+y-z=2",
    6: "2x-y+z=3", 8: "2x+2y+z=12", 11: "x-y+4z=10", 12: "x+2y+z=9",
    13: "4x+y-z=10", 14: "2x+y-z=5", 15: "x+y+2z=9"
};

const getDiceFacesForSum = (sum) => {
    if (sum > 12 || sum < 2) return [1, 1];
    for (let i = 6; i >= 1; i--) {
        const j = sum - i;
        if (j >= 1 && j <= 6) { return [i, j]; }
    }
    return [1, 1];
};

const specialMoveEndpoints = Object.entries(specialMoves).reduce((acc, [start, end]) => {
    acc[end] = Number(start);
    return acc;
}, {});

// Helper buat warna dinamis di class Tailwind
const colorRingClasses = {
    red: 'focus:ring-red-500',
    blue: 'focus:ring-blue-500',
    green: 'focus:ring-green-500',
};

function Game() {
    const [players, setPlayers] = useState([
        { id: 1, name: "Player 1", color: "red", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, time: null, dice: [1, 1] },
        { id: 2, name: "Player 2", color: "blue", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, time: null, dice: [1, 1] },
        { id: 3, name: "Player 3", color: "green", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, time: null, dice: [1, 1] },
    ]);

    const [turn, setTurn] = useState(0);
    const [phase, setPhase] = useState("dice");
    const [finished, setFinished] = useState(false);
    const [diceRoll, setDiceRoll] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [activePack, setActivePack] = useState(null);
    const [activatedEquations, setActivatedEquations] = useState([]);

    useEffect(() => {
        const randomPack = questionPacks[Math.floor(Math.random() * questionPacks.length)];
        setActivePack(randomPack);
    }, []);

    useEffect(() => {
        if (phase !== 'dice' || rolling) return;
        const playerIndex = (turn + players.length - 1) % players.length;
        if (playerIndex < 0) return;
        const lastPlayer = players[playerIndex];
        const currentPos = lastPlayer.position;
        const targetPos = specialMoves[currentPos];
        if (targetPos !== undefined) {
            setTimeout(() => {
                setPlayers(prev => prev.map(p => p.id === lastPlayer.id ? { ...p, position: targetPos } : p));
            }, 500);
        }
        const finalPos = targetPos || currentPos;
        const targetEquationIds = activePack ? Object.keys(activePack.equations).map(Number) : [];
        const isTarget = targetEquationIds.includes(finalPos);
        const isAlreadyActivated = activatedEquations.some(eq => eq.number === finalPos);
        if (isTarget && !isAlreadyActivated) {
            setActivatedEquations(prev => [...prev, { number: finalPos, text: allEquations[finalPos] }]);
        }
    }, [turn, players, phase, rolling, activePack, activatedEquations]);

    useEffect(() => {
        if (activatedEquations.length >= 3) {
            setTimeout(() => setPhase("answer"), 1000);
        }
    }, [activatedEquations]);

    const rollDice = () => {
        if (rolling || !activePack || phase !== 'dice') return;
        setRolling(true);
        const targetRolls = Object.keys(activePack.equations).map(Number).sort((a, b) => a - b);
        const targetNumber = targetRolls[activatedEquations.length];
        let fatedSum = targetNumber;
        const entryPoint = specialMoveEndpoints[targetNumber];
        if (entryPoint) {
            fatedSum = entryPoint;
        }
        const fatedFaces = getDiceFacesForSum(fatedSum);
        let count = 0;
        const interval = setInterval(() => {
            setDiceRoll([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
            count++;
            if (count > 10) {
                clearInterval(interval);
                setDiceRoll(fatedFaces);
                setPlayers(prevPlayers => prevPlayers.map((p, idx) => (idx === turn ? { ...p, dice: fatedFaces } : p)));
                const steps = fatedSum;
                let stepCount = 0;
                const moveInterval = setInterval(() => {
                    stepCount++;
                    setPlayers(prev => prev.map((p, idx) => {
                        if (idx === turn) {
                            return { ...p, position: Math.min(p.position + 1, 15) };
                        }
                        return p;
                    }));
                    if (stepCount >= steps) {
                        clearInterval(moveInterval);
                        if (turn < players.length - 1) {
                            setTurn(turn + 1);
                        } else {
                            setTurn(0);
                        }
                        setRolling(false);
                    }
                }, 300);
            }
        }, 100);
    };

    const submitVariable = (playerId, variable) => {
        const now = Date.now();
        let playerToUpdate = players.find(p => p.id === playerId);
        if (!playerToUpdate || playerToUpdate.submitted[variable] || !activePack) return;
        const updated = players.map(p => {
            if (p.id === playerId) {
                const correct = Number(p.answer[variable]) === activePack.answer[variable];
                return { ...p, score: correct ? p.score + 30 : p.score, submitted: { ...p.submitted, [variable]: true }, time: now };
            }
            return p;
        });
        setPlayers(updated);
        if (updated.every(p => p.submitted.x && p.submitted.y && p.submitted.z)) {
            setFinished(true);
            setPhase("result");
        }
    };

    const handleChange = (playerId, field, value) => {
        setPlayers(players.map(p => (p.id === playerId ? { ...p, answer: { ...p.answer, [field]: value } } : p)));
    };

    const getRankingDetails = (rank) => {
        switch (rank) {
            case 0: return { borderColor: 'border-yellow-400', bgColor: 'bg-yellow-50', shadow: 'shadow-yellow-200', icon: <FaTrophy className="text-yellow-500" /> };
            case 1: return { borderColor: 'border-gray-400', bgColor: 'bg-gray-50', shadow: 'shadow-gray-200', icon: <FaTrophy className="text-gray-400" /> };
            case 2: return { borderColor: 'border-orange-400', bgColor: 'bg-orange-50', shadow: 'shadow-orange-200', icon: <FaTrophy className="text-orange-500" /> };
            default: return { borderColor: 'border-gray-200', bgColor: 'bg-white', shadow: 'shadow-sm', icon: null };
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 text-center">
            <h2 className="text-2xl text-white font-bold mb-4">Game SPLTV 🎲</h2>
            <Board
                players={players}
                diceRoll={diceRoll}
                turn={turn}
                phase={phase}
                specialMoves={specialMoves}
                allEquations={allEquations}
                activatedEquations={activatedEquations}
                rolling={rolling}
            />

            {phase === "dice" && !finished && (
                <div className="mt-6">
                    <h3 className="text-white mb-2 text-lg"> Giliran <span className="font-semibold" style={{ color: players[turn].color }}>{players[turn].name}</span> melempar dadu! ({activatedEquations.length}/3 persamaan aktif)</h3>
                    <button
                        onClick={rollDice}
                        disabled={rolling}
                        className={`px-6 py-3 rounded-lg shadow-lg font-bold text-lg transition-transform transform hover:scale-105 ${rolling
                                ? "bg-stone-400/50 text-white-500 cursor-not-allowed" // State disabled (pake opacity)
                                : "bg-stone-400 hover:bg-amber-500 text-white-900"   // State aktif (teks item lebih kontras)
                            }`}
                    >
                        {rolling ? "🎲 Rolling..." : "Lempar Dadu"}
                    </button>
                </div>
            )}

            {/* ANJAII, INI DIA BAGIAN YANG DI-MAKEOVER */}
            {phase === "answer" && !finished && (
                <div className="mt-6 animate-fade-in">
                    {/* KOTAK SOAL YANG BARU, LEBIH GELAP LEBIH ASIK */}
                    <div className="max-w-2xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-2xl border-b-4 border-cyan-500 mb-8 ring-1 ring-white/10">
                        <h3 className="text-2xl font-bold mb-4 text-white flex items-center justify-center gap-3">
                            <FaQuestionCircle className="text-cyan-400" />
                            Pecahkan Sistem Persamaan Ini!
                        </h3>
                        <div className="text-center font-mono text-xl space-y-3 bg-white/30 p-4 rounded-lg">
                            {activatedEquations.sort((a, b) => a.number - b.number).map((eq, index) => (
                                <p key={index} className="text-cyan-300 tracking-wider p-2 rounded-md bg-slate-900/50 ring-1 ring-slate-700">{eq.text}</p>
                            ))}
                        </div>
                    </div>

                    {/* KOTAK JAWABAN PLAYER YANG BARU, LEBIH JELAS */}
                    <h3 className="text-xl font-semibold mb-4 text-white">Semua Player, Masukkan Jawaban X, Y, dan Z!</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {players.map(p => (
                            <div key={p.id} className="bg-white rounded-xl shadow-lg border-b-8 p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" style={{ borderColor: p.color }}>
                                <h4 className="font-bold text-xl text-white text-center pb-2 border-b-2" style={{ borderColor: p.color }}>{p.name}</h4>
                                <div className="space-y-4 pt-2">
                                    {["x", "y", "z"].map((field) => (
                                        <div key={field} className="flex items-center gap-3">
                                            <label htmlFor={`${p.id}-${field}`} className="text-2xl font-bold text-gray-500 w-8">{field.toUpperCase()} =</label>
                                            <input
                                                id={`${p.id}-${field}`}
                                                type="number"
                                                placeholder="?"
                                                className={`text-center text-xl font-bold border-2 border-gray-300 rounded-lg text-white p-2 w-full focus:outline-none focus:ring-4 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed ${colorRingClasses[p.color] || 'focus:ring-gray-400'}`}
                                                value={p.answer[field]}
                                                onChange={(e) => handleChange(p.id, field, e.target.value)}
                                                disabled={p.submitted[field]}
                                            />
                                            <button
                                                onClick={() => submitVariable(p.id, field)}
                                                disabled={p.submitted[field]}
                                                className={`w-32 px-3 py-2 rounded-lg font-semibold text-white text-base transition-all duration-200 transform hover:scale-105 ${p.submitted[field] ? 'bg-green-600 cursor-default' : 'bg-blue-500 hover:bg-blue-600'}`}
                                            >
                                                {p.submitted[field] ? "Terkirim ✅" : "Kirim"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {finished && (
                <div className="mt-8 max-w-md mx-auto">
                    <h3 className="text-2xl text-white font-bold mb-4 flex items-center justify-center gap-2">🏆 Papan Peringkat 🏆</h3>
                    <div className="space-y-3">
                        {players.slice().sort((a, b) => (b.score === a.score ? a.time - b.time : b.score - a.score)).map((p, idx) => {
                            const details = getRankingDetails(idx);
                            return (<div key={p.id} className={`flex items-center justify-between p-4 rounded-lg border-2 ${details.borderColor} ${details.bgColor} shadow-lg ${details.shadow} transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in`} style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-gray-700 w-8">{idx < 3 ? details.icon : `#${idx + 1}`}</span>
                                    <span className="font-semibold text-lg text-gray-800">{p.name}</span>
                                </div>
                                <span className="font-bold text-xl text-blue-600">{p.score} Poin</span>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;