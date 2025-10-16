import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../supabaseClient';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import { FaTrophy, FaQuestionCircle, FaHourglassHalf, FaClipboard } from "react-icons/fa";
import Board from "../components/Board";
import { questionPacks } from "../components/questions";
import { Helmet } from 'react-helmet-async'; // <-- Jangan lupa import SEO-nya nanti

// Konstanta tidak berubah
const specialMoves = {
    '6': { end: 15, startPos: [0.7, 0.8], endPos: [0.8, 0.9] },
    '9': { end: 14, startPos: [0.4, 0.5], endPos: [0.7, 0.7] },
    '10': { end: 13, startPos: [0.9, 0.9], endPos: [0.6, 0.8] },
    5: 1, 11: 4
};
const allEquations = { 1: "2x+y+z=7", 2: "3x+2y+z=13", 3: "x+y+2z=10", 4: "x+y-z=2", 7: "2x-y+z=3", 8: "2x+2y+z=12", 11: "x-y+4z=10", 12: "x+2y+z=9", 13: "4x+y-z=10", 14: "2x+y-z=5", 15: "x+y+2z=9" };
const getDiceFacesForSum = (sum) => { if (sum > 12 || sum < 2) return [1, 1]; for (let i = 6; i >= 1; i--) { const j = sum - i; if (j >= 1 && j <= 6) { return [i, j]; } } return [1, 1]; };
const specialMoveEndpoints = Object.entries(specialMoves).reduce((acc, [start, moveData]) => { const endPosition = (typeof moveData === 'object' && moveData !== null) ? moveData.end : moveData; acc[endPosition] = Number(start); return acc; }, {});
const colorRingClasses = { red: 'focus:ring-red-500', blue: 'focus:ring-blue-500', green: 'focus:ring-green-500' };


function Game() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rolling, setRolling] = useState(false);
    const [localPlayerId, setLocalPlayerId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [visualDice, setVisualDice] = useState([1, 1]);
    const [visualPlayers, setVisualPlayers] = useState(null);
    // const [showLeaverModal, setShowLeaverModal] = useState(false); // <-- DIBUANG

    const localPlayerIdRef = useRef(localPlayerId);
    const gameStateRef = useRef(gameState);
    useEffect(() => { localPlayerIdRef.current = localPlayerId; }, [localPlayerId]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    // Blocker tetap berguna kalau user sengaja klik back/close tab
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            gameState && !gameState.finished &&
            currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        const savedPlayerId = localStorage.getItem(`tanggapoly_player_id_${gameId}`);
        if (!savedPlayerId) {
            navigate('/lobby');
            return;
        }
        setLocalPlayerId(Number(savedPlayerId));

        const fetchInitialGame = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('games').select('*').eq('id', gameId).single();
            if (error || !data) {
                console.error("Game gak ketemu:", error);
                // Ganti alert dengan console.log biar gak ganggu
                console.log('Anjir, Gamenya gak ketemu atau udah bubar, le!');
                navigate('/lobby');
            } else {
                setGameState(data);
                setVisualDice(data.diceRoll || [1, 1]);
                setVisualPlayers(data.players);
            }
            setLoading(false);
        };

        fetchInitialGame();

        const channel = supabase.channel(`game-room-${gameId}`, {
            config: {
                presence: {
                    key: savedPlayerId,
                },
            },
        });

        channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
            (payload) => {
                setGameState(payload.new);
            }
        );

        // ▼▼▼ BAGIAN INI DIAMANKAN (DIBUANG) ▼▼▼
        // channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
        //     if (gameStateRef.current && !gameStateRef.current.finished) {
        //         setShowLeaverModal(true);
        //     }
        // });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ online_at: new Date().toISOString() });
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, navigate]);

    useEffect(() => { if (gameState && !rolling) { setVisualPlayers(gameState.players); } }, [gameState?.players]);
    useEffect(() => { if (gameState && gameState.players.length === 3 && !gameState.activePack && localPlayerId === 1) { const setInitialPack = async () => { const randomPack = questionPacks[Math.floor(Math.random() * questionPacks.length)]; await supabase.from('games').update({ activePack: randomPack }).eq('id', gameId); }; setInitialPack(); } }, [gameState, localPlayerId, gameId]);
    useEffect(() => { if (gameState?.is_rolling && !rolling) { setRolling(true); const diceAnimationDuration = 1500; const diceIntervalTime = 100; const stepDuration = 400; const animationInterval = setInterval(() => { setVisualDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]); }, diceIntervalTime); setTimeout(() => { clearInterval(animationInterval); setVisualDice(gameState.diceRoll); const { turn, players, diceRoll } = gameState; const currentPlayer = players[turn]; const startPosition = currentPlayer.position; const fatedSum = diceRoll[0] + diceRoll[1]; const newPosition = Math.min(startPosition + fatedSum, 15); const path = []; for (let i = startPosition + 1; i <= newPosition; i++) { path.push(i); } if (path.length === 0) { if (localPlayerId === turn + 1) { updateSupabaseAfterAnimation(newPosition, diceRoll); } else { setRolling(false); } return; } let stepIndex = 0; const stepInterval = setInterval(() => { const currentStep = path[stepIndex]; setVisualPlayers(prev => prev.map(p => p.id === currentPlayer.id ? { ...p, position: currentStep } : p)); stepIndex++; if (stepIndex >= path.length) { clearInterval(stepInterval); const moveData = specialMoves[newPosition]; const finalPosition = (typeof moveData === 'object' && moveData !== null) ? moveData.end : (moveData || newPosition); if (newPosition !== finalPosition) { setTimeout(() => { setVisualPlayers(prev => prev.map(p => p.id === currentPlayer.id ? { ...p, position: finalPosition } : p)); if (localPlayerId === turn + 1) { setTimeout(() => updateSupabaseAfterAnimation(finalPosition, diceRoll), 800); } else { setTimeout(() => setRolling(false), 800); } }, 500); } else { if (localPlayerId === turn + 1) { updateSupabaseAfterAnimation(finalPosition, diceRoll); } else { setRolling(false); } } } }, stepDuration); }, diceAnimationDuration); } }, [gameState?.is_rolling]);
    
    // ▼▼▼ FUNGSI INI JUGA DIBUANG KARENA UDAH GAK DIPAKE ▼▼▼
    // const handleLeaverAndExit = async () => { ... };

    const updateSupabaseAfterAnimation = async (finalPosition, fatedFaces) => { const { turn, players, activatedEquations = [], activePack } = gameState; const currentPlayer = players[turn]; const targetEquationIds = Object.keys(activePack.equations).map(Number); const isTarget = targetEquationIds.includes(finalPosition); const isAlreadyActivated = activatedEquations.some(eq => eq.number === finalPosition); let newActivatedEquations = [...activatedEquations]; if (isTarget && !isAlreadyActivated) { newActivatedEquations.push({ number: finalPosition, text: allEquations[finalPosition] }); } const newPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, position: finalPosition, dice: fatedFaces } : p); const nextTurn = (turn + 1) % players.length; const newPhase = newActivatedEquations.length >= 3 ? "answer" : "dice"; await supabase.from('games').update({ players: newPlayers, turn: nextTurn, phase: newPhase, activatedEquations: newActivatedEquations, is_rolling: false, }).eq('id', gameId); setRolling(false); };
    const rollDice = async () => { if (rolling || !gameState || !gameState.activePack || gameState.phase !== 'dice' || Number(gameState.turn) + 1 !== localPlayerId) return; const { activePack, activatedEquations = [] } = gameState; const targetRolls = Object.keys(activePack.equations).map(Number).sort((a, b) => a - b); const targetNumber = targetRolls[activatedEquations.length] || targetRolls[0]; let fatedSum = targetNumber; const entryPoint = specialMoveEndpoints[targetNumber]; if (entryPoint) { fatedSum = entryPoint; } const fatedFaces = getDiceFacesForSum(fatedSum); await supabase.from('games').update({ diceRoll: fatedFaces, is_rolling: true, }).eq('id', gameId); };
    const copyToClipboard = () => { if (gameState?.join_code) { navigator.clipboard.writeText(gameState.join_code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); } };
    const getRankingDetails = (rank) => { switch (rank) { case 0: return { borderColor: 'border-yellow-400', shadow: 'shadow-yellow-200', icon: <FaTrophy className="text-yellow-500" /> }; case 1: return { borderColor: 'border-gray-400', shadow: 'shadow-gray-200', icon: <FaTrophy className="text-gray-400" /> }; case 2: return { borderColor: 'border-orange-400', shadow: 'shadow-orange-200', icon: <FaTrophy className="text-orange-500" /> }; default: return { borderColor: 'border-gray-600', shadow: 'shadow-sm', icon: null }; } };
    const handleChange = async (playerId, field, value) => { if (!gameState) return; const { players } = gameState; const newPlayers = players.map(p => p.id === playerId ? { ...p, answer: { ...p.answer, [field]: value } } : p); await supabase.from('games').update({ players: newPlayers }).eq('id', gameId); };
    const submitVariable = async (playerId, variable) => { if (!gameState) return; const { players, activePack } = gameState; const playerToUpdate = players.find(p => p.id === playerId); if (!playerToUpdate || playerToUpdate.submitted?.[variable] || !activePack) return; const now = Date.now(); const correct = Number(playerToUpdate.answer[variable]) === activePack.answer[variable]; const updatedPlayers = players.map(p => { if (p.id === playerId) { return { ...p, score: correct ? p.score + 30 : p.score + 10, submitted: { ...p.submitted, [variable]: true }, time: now }; } return p; }); const allSubmitted = updatedPlayers.every(p => p.submitted?.x && p.submitted?.y && p.submitted?.z); await supabase.from('games').update({ players: updatedPlayers, finished: allSubmitted, phase: allSubmitted ? "result" : "answer" }).eq('id', gameId); };
    const resetGame = async () => { if (!gameState) return; localStorage.removeItem(`tanggapoly_player_id_${gameId}`); navigate('/lobby'); };

    if (loading || !gameState || !visualPlayers) {
        return <main className="min-h-screen bg-gray-900 p-8 text-white flex justify-center items-center">Loading...</main>;
    }

    if (gameState.players.length < 3 && !gameState.finished) {
        return (
            <main className="min-h-screen bg-gray-900 p-8 text-white flex flex-col justify-center items-center">
                <Helmet>
                    <title>Menunggu Pemain - Tanggapoly 3Var</title>
                    <meta name="description" content="Menunggu pemain lain untuk bergabung ke dalam permainan Tanggapoly 3Var." />
                </Helmet>
                <div className="text-center">
                    <FaHourglassHalf className="text-7xl text-cyan-400 mb-6 animate-pulse" />
                    <h2 className="text-4xl font-bold mb-4">Menunggu Pemain Lain...</h2>
                    <p className="text-xl text-gray-400 mb-8">{gameState.players.length} / 3 pemain telah bergabung.</p>
                    <div className='mb-8'>
                        <p className='text-lg text-gray-300 mb-2'>Kasih kode ini ke temen lu!</p>
                        <div className='flex items-center justify-center gap-3'>
                            <p className="bg-gray-950 border-2 border-dashed border-cyan-500 text-cyan-400 text-4xl font-mono tracking-widest px-8 py-3 rounded-lg">
                                {gameState.join_code}
                            </p>
                            <button onClick={copyToClipboard} className="p-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-2xl transition-all">
                                {copied ? '✔️' : <FaClipboard />}
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Pemain di Lobi:</h3>
                        <ul className="space-y-3 text-left">
                            {gameState.players.map(p => (
                                <li key={p.id} className="text-xl flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }}></span>
                                    {p.name}
                                    {p.id === localPlayerId && <span className="text-sm text-cyan-400">(Ini Kamu)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        );
    }

    const { turn, phase, finished, activatedEquations } = gameState;
    const localPlayer = gameState.players.find(p => p.id === localPlayerId);

    if (!localPlayer && !finished) {
        navigate('/lobby');
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-900 p-4 sm:p-8 text-center">
             <Helmet>
                <title>Permainan Berlangsung - Tanggapoly 3Var</title>
                <meta name="description" content="Permainan edukasi matematika Tanggapoly 3Var sedang berlangsung." />
            </Helmet>
            
            {/* ▼▼▼ MODAL INI JUGA DIBUANG SEMUA ▼▼▼ */}
            {/* {showLeaverModal && ( ... )} */}

            {blocker && blocker.state === 'blocked' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 border-t-4 border-red-500 text-white max-w-sm w-full mx-4 transform transition-all animate-slide-up">
                        <h3 className="text-2xl font-bold mb-4 text-red-400">Yakin Mau Keluar?</h3>
                        <p className="text-slate-300 mb-8">Semua progres di game ini bakal hilang kalo kamu keluar sekarang.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => blocker.proceed()}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-transform transform hover:scale-105 shadow-lg shadow-red-500/30">
                                Ya, Keluar
                            </button>
                            <button
                                onClick={() => blocker.reset()}
                                className="px-8 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold text-white transition-transform transform hover:scale-105 shadow-lg">
                                Gak Jadi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {finished && (
                <div className="w-full flex justify-center animate-fade-in mt-8">
                    <div className="w-full max-w-4xl">
                        <h3 className="text-3xl text-white font-bold mb-6 flex items-center justify-center gap-3">🏆 Papan Peringkat Akhir 🏆</h3>
                        <div className="space-y-4">
                            {gameState.players.slice().sort((a, b) => (b.score === a.score ? a.time - b.time : b.score - a.score)).map((p, idx) => {
                                const details = getRankingDetails(idx);
                                return (
                                    <div key={p.id} className={`flex items-center justify-between p-5 rounded-lg border-2 ${details.borderColor} bg-slate-800 shadow-lg ${details.shadow} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                                        <div className="flex items-center gap-5">
                                            <span className="text-2xl font-bold text-gray-300 w-10 text-center">{idx < 3 ? details.icon : `#${idx + 1}`}</span>
                                            <span className="font-semibold text-xl text-white">{p.name}</span>
                                        </div>
                                        <span className="font-bold text-2xl text-cyan-400">{p.score} Poin</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={resetGame}
                            className="mt-10 px-8 py-4 rounded-lg shadow-lg font-bold text-xl transition-transform transform hover:scale-105 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            🔄 Balik ke Lobi
                        </button>
                    </div>
                </div>
            )}

            {!finished && (
                <>
                    {phase === "dice" && (
                        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4">
                            <Board {...{ players: visualPlayers, diceRoll: visualDice, turn, phase, specialMoves, allEquations, activatedEquations, rolling }} />
                            <div className="mt">
                                <h3 className="text-white mb-2 text-lg"> Giliran <span className="font-semibold" style={{ color: gameState.players?.[turn]?.color }}>{gameState.players?.[turn]?.name}</span> melempar dadu! ({(activatedEquations?.length || 0)}/3 persamaan aktif)</h3>
                                <button
                                    onClick={rollDice}
                                    disabled={rolling || Number(turn) + 1 !== localPlayerId || !gameState.activePack}
                                    className={`px-6 py-3 rounded-lg shadow-lg font-bold text-lg transition-transform transform hover:scale-105 ${rolling || Number(turn) + 1 !== localPlayerId || !gameState.activePack ? "bg-amber-400/50 text-slate-500 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500 text-gray-900"}`}
                                >
                                    {rolling ? "🎲 Rolling..." : (!gameState.activePack ? 'Nunggu Soal...' : 'Lempar Dadu')}
                                </button>
                            </div>
                        </div>
                    )}
                    {phase === "answer" && (
                        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
                            <div className="w-full max-w-3xl lg:w-3/5">
                                <Board {...{ players: visualPlayers, diceRoll: visualDice, turn, phase, specialMoves, allEquations, activatedEquations, rolling }} />
                            </div>
                            <div className="w-full max-w-lg lg:w-2/5">
                                <div className="mt-4 mb-4 lg:mt-0 animate-fade-in">
                                    <div className="w-full bg-slate-800 p-6 rounded-2xl shadow-2xl border-b-4 border-cyan-500 mb-4 ring-1 ring-white/10">
                                        <h3 className="text-xl font-bold mb-4 text-white flex items-center justify-center gap-3"><FaQuestionCircle className="text-cyan-400" /> Pecahkan Sistem Persamaan Ini!</h3>
                                        <div className="text-center font-mono text-xl space-y-3 bg-black/30 p-4 rounded-lg">
                                            {(activatedEquations || []).sort((a, b) => a.number - b.number).map((eq, index) => (
                                                <p key={index} className="text-cyan-300 tracking-wider p-2 rounded-md bg-slate-900/50 ring-1 ring-slate-700">{eq.text}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-800 rounded-xl shadow-lg border-b-8 p-3 flex flex-col gap-4 flex-1" style={{ borderColor: localPlayer.color }}>
                                        <h4 className="font-bold text-xl text-white text-center pb-4 border-b-2" style={{ borderColor: localPlayer.color }}>  Masukkan Jawabanmu {localPlayer?.name}</h4>
                                        <div className="space-y-4 pt-2 pb-2">
                                            {["x", "y", "z"].map((field) => (
                                                <div key={field} className="flex items-center gap-3">
                                                    <label htmlFor={`${localPlayer.id}-${field}`} className="text-xl font-bold text-gray-400 w-10">{field.toUpperCase()}</label>
                                                    <input id={`${localPlayer.id}-${field}`} type="number" placeholder="?"
                                                        className={`text-center text-xl font-bold border-2 border-gray-600 rounded-lg text-white bg-gray-700 px-3 py-1 w-full focus:outline-none focus:ring-4 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed ${colorRingClasses[localPlayer.color] || 'focus:ring-gray-400'}`}
                                                        value={localPlayer.answer?.[field] || ""}
                                                        onChange={(e) => handleChange(localPlayer.id, field, e.target.value)}
                                                        disabled={localPlayer.submitted?.[field]}
                                                    />
                                                    <button onClick={() => submitVariable(localPlayer.id, field)} disabled={localPlayer.submitted?.[field]}
                                                        className={`min-w-[120px] px-4 py-1 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform hover:scale-105 ${localPlayer.submitted?.[field] ? 'bg-green-600 cursor-default' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                                        {localPlayer.submitted?.[field] ? "Dikirim" : "Kirim"}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}

export default Game;
