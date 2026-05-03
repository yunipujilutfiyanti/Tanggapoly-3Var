import React from 'react';
import gambarTangga from '../assets/tanggalurus.svg';
import gambarTanggaMiring from '../assets/tanggamiring.svg';
import gambarUlar from '../assets/ular.svg';
import gambarUlarMangap from '../assets/ularmangap.svg';

// ASSET PION & DADU
import pionMerah from '../assets/pionmerah.svg';
import pionBiru from '../assets/pionbiru.svg';
import pionHijau from '../assets/pionhijau.svg';
import pionKuning from '../assets/pionkuning.svg';
import dice1 from '../assets/dice1.svg';
import dice2 from '../assets/dice2.svg';
import dice3 from '../assets/dice3.svg';
import dice4 from '../assets/dice4.svg';
import dice5 from '../assets/dice5.svg';
import dice6 from '../assets/dice6.svg';

const getPionAsset = (id) => {
    const assets = { 1: pionMerah, 2: pionBiru, 3: pionHijau, 4: pionKuning };
    return assets[id] || pionMerah;
};

const getDiceAsset = (val) => {
    const assets = { 1: dice1, 2: dice2, 3: dice3, 4: dice4, 5: dice5, 6: dice6 };
    return assets[val] || dice1;
};

const generateBoard = () => {
    const rows = 5, cols = 6;
    let board = [];
    for (let r = rows - 1; r >= 0; r--) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let index = r * cols + (r % 2 === 0 ? c : (cols - 1 - c));
            let label = index === 0 ? "START" : index === 29 ? "FINISH" : index;
            row.push({ id: index, label: label });
        }
        board.push(row);
    }
    return board;
};

// FIX: JURUS ACAK HURUF UNIK PER PEMAIN
const getShuffledIndices = (text, attempts, playerId) => {
    if (!text || attempts === 0) return [];

    // 1. Ambil semua index (0, 1, 2, dst)
    let indices = Array.from({ length: text.length }, (_, i) => i);

    // 2. Acak index-nya pake rumus "Seeding" berdasarkan Player ID
    for (let i = indices.length - 1; i > 0; i--) {
        const seed = playerId * (i + 1) * (text.charCodeAt(0) || 1);
        const j = Math.floor((seed % 100) / 100 * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // 3. Ambil sebanyak jumlah kesalahan (failedAttempts)
    return indices.slice(0, attempts);
};

const Board = ({
    players, turn, diceRoll = [1], rolling = false, spinning = false, phase, onRoll,
    activeQuestion, quizAnswer, setQuizAnswer, submitQuiz, answerFeedback, isMyTurn, activePlayerName
}) => {
    const boardData = generateBoard();

    // Ambil info failedAttempts dan ID pemain yang lagi dapet giliran
    const currentPlayer = players?.[turn];
    const currentFailedAttempts = currentPlayer?.failedAttempts || 0;
    const currentPlayerId = currentPlayer?.id || 1;

    // Panggil fungsi acak clue di sini
    const revealedIndices = activeQuestion ? getShuffledIndices(activeQuestion.jawaban, currentFailedAttempts, currentPlayerId) : [];

    // PLAYER CARD
    const PlayerCard = ({ id, colorClass, textColor }) => {
        const p = players?.find(player => player.id === id);
        const isActive = (turn + 1) === id;
        const displayName = p?.name || `Player ${id}`;

        return (
            <div className={`${colorClass} rounded-2xl p-1.5 border-2 ${isActive ? 'border-white ring-4 ring-yellow-400 scale-105 shadow-2xl z-20' : 'border-black/20 z-0'} transition-all duration-300 h-[105px] flex flex-row items-center justify-center gap-1.5 overflow-hidden`}>
                <img src={getPionAsset(id)} alt={`Pion ${id}`} className={`w-9 h-11 object-contain drop-shadow-md flex-none ${isActive && !rolling ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col items-center min-w-0 flex-1">
                    <span
                        className={`text-[10px] font-black uppercase mb-1 drop-shadow-md truncate w-full text-center px-0.5 ${textColor || 'text-white'}`}
                        title={displayName}
                    >
                        {displayName}
                    </span>
                    <div className="bg-white border-2 border-gray-800 rounded-lg px-2.5 py-0.5 flex flex-col items-center shadow-inner min-w-[48px] flex-none">
                        <span className="text-[8px] font-bold text-gray-800 leading-none">Kotak</span>
                        <span className="text-xl font-black text-black leading-none mt-0.5">{p?.position || 0}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-screen max-h-[768px] mx-auto p-2 flex flex-col lg:flex-row gap-3 items-center justify-center overflow-hidden bg-transparent">

            {/* AREA UTAMA BOARD (KIRI) */}
            <div className="flex-none w-full max-w-[700px] h-full max-h-[620px] relative bg-[#4B2C85] p-3 rounded-[2rem] border-8 border-[#D32F2F] shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

                <div className="relative grid grid-cols-6 gap-0 bg-white border-4 border-orange-400 aspect-[6/5] w-full z-0">
                    {boardData.map((row) => row.map((cell) => (
                        <div key={cell.id} className="aspect-square border border-orange-100 flex flex-col justify-start p-0.5 relative bg-white overflow-hidden">

                            <span className={`absolute top-1 right-1.5 font-black leading-none z-10 text-right ${
                                cell.label === "START" || cell.label === "FINISH"
                                ? "text-slate-800 text-[10px] sm:text-xs tracking-tighter"
                                : "text-gray-300 text-[9px] sm:text-[11px]"
                            }`}>
                                {cell.label}
                            </span>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-2 z-30">
                                <div className="flex flex-wrap gap-0 justify-center items-center">
                                    {players?.filter(p => p.position === cell.id).map((p) => (
                                        <img key={p.id} src={getPionAsset(p.id)} className="w-6 h-6 sm:w-8 h-8 object-contain drop-shadow-md animate-bounce" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )))}

                    {/* RINTANGAN MANUAL */}
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '3%', left: '66%', width: '12%', height: '34%' }}><img src={gambarTangga} className="w-full h-full object-contain" /></div>
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '40%', left: '1%', width: '12%', height: '34%' }}><img src={gambarTangga} className="w-full h-full object-contain" /></div>
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '48%', left: '58%', width: '18%', height: '26%', transform: 'scaleX(-1) rotate(25deg)' }}><img src={gambarTanggaMiring} className="w-full h-full object-contain" /></div>
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '18%', left: '6%', width: '38%', height: '46%', transform: 'scaleX(-1) rotate(25deg)' }}><img src={gambarUlar} className="w-full h-full object-contain" /></div>
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '45%', left: '9%', width: '48%', height: '56%', transform: ' rotate(-50deg)' }}><img src={gambarUlarMangap} className="w-full h-full object-contain" /></div>
                    <div className="absolute pointer-events-none z-10" style={{ bottom: '2%', left: '32%', width: '38%', height: '36%', transform: 'rotate(40deg)' }}><img src={gambarUlar} className="w-full h-full object-contain" /></div>
                </div>

                {/* MODAL QUIZ */}
                {phase === "quiz" && activeQuestion && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in rounded-[1.5rem]">
                        <div className="bg-[#FFF9EB] w-full max-w-[320px] rounded-[2rem] border-[6px] border-[#5D4037] shadow-2xl p-4 flex flex-col items-center gap-2 relative scale-95">
                            <h2 className="text-lg font-black text-[#5D4037] uppercase tracking-tighter">SOAL KOTAK NO {players[turn]?.position + 1}</h2>

                            {activeQuestion.gambar && (
                                <div className="bg-white rounded-xl p-4 shadow-inner border border-[#5D4037]/10 w-full flex justify-center h-[120px]">
                                    <img
                                        src={activeQuestion.gambar}
                                        alt="Gambar Soal"
                                        className="w-full h-full object-contain drop-shadow-md animate-fade-in"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="text-center mt-2 w-full px-2">
                                <h3 className="text-xl md:text-2xl font-black text-[#2E7D32] leading-tight break-words">
                                    {activeQuestion.soal}
                                </h3>
                            </div>

                            {/* TAMPILAN CLUE RANDOM (Sesuai Player ID) */}
                            {currentFailedAttempts > 0 && isMyTurn && (
                                <div className="w-full flex flex-col items-center mt-1 animate-fade-in">
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Bantuan Huruf Acak:</span>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {activeQuestion.jawaban.split('').map((char, index) => {
                                            if (char === ' ') return <span key={index} className="w-3"></span>;

                                            // Cek apakah index ini termasuk di daftar clue yang udah kebuka buat pemain ini
                                            const isRevealed = revealedIndices.includes(index);

                                            return (
                                                <span key={index} className="text-lg md:text-xl font-black text-orange-700 bg-orange-100 px-2 py-1 rounded-md border-2 border-orange-300 shadow-sm min-w-[28px] text-center">
                                                    {isRevealed ? char.toUpperCase() : '?'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="w-full flex flex-col gap-2 mt-2">
                                {isMyTurn ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Ketik jawabanmu..."
                                            className="w-full text-center text-md font-black border-2 border-[#5D4037]/20 rounded-lg py-2 bg-white text-slate-800 outline-none focus:border-red-500 transition-all shadow-inner uppercase"
                                            value={quizAnswer}
                                            onChange={(e) => setQuizAnswer(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitQuiz()}
                                        />
                                        <button onClick={submitQuiz} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none transition-all">KIRIM</button>
                                    </>
                                ) : (
                                    <p className="text-slate-500 font-bold text-[10px] text-center italic py-2 leading-tight">Giliran {activePlayerName} menjawab...</p>
                                )}
                            </div>

                            <div className="h-4 flex items-center justify-center">
                                {answerFeedback === "correct" && <p className="text-emerald-600 font-black text-[12px]">✅ Jawaban Anda Benar</p>}
                                {answerFeedback === "wrong" && <p className="text-red-600 font-black text-[12px]">❌ Jawaban Anda Salah</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PANEL SAKTI KANAN */}
            <div className="flex-none w-full max-w-[280px] lg:h-full lg:max-h-[700px] flex flex-col gap-3 bg-[#D32F2F] p-3 rounded-[1.5rem] border-4 border-yellow-400 shadow-2xl self-center overflow-hidden">

                {/* FIX: TAMPILAN DINAMIS PEMAIN 1 & 2 */}
                {players?.some(p => p.id === 1) || players?.some(p => p.id === 2) ? (
                    <div className="grid grid-cols-2 gap-2 flex-none">
                        {players?.some(p => p.id === 1) && <PlayerCard id={1} colorClass="bg-[#E53935]" />}
                        {players?.some(p => p.id === 2) && <PlayerCard id={2} colorClass="bg-[#1E88E5]" />}
                    </div>
                ) : null}

                <div className="flex-1 bg-white rounded-xl p-2 flex flex-col items-center justify-center gap-2 border-4 border-gray-200 shadow-inner overflow-hidden">
                    <div className="text-center">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">Giliran</p>
                        <p className="text-2xl font-black text-red-600 uppercase mt-0.5">{activePlayerName || `P${turn + 1}`}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-3xl border-2 border-gray-100 shadow-md relative">
                        <img src={getDiceAsset(diceRoll[0])} alt="Dice" className={`w-24 h-24 object-contain drop-shadow-md ${spinning ? 'animate-spin' : ''}`} />
                    </div>

                    <button
                        onClick={onRoll}
                        disabled={rolling || phase !== 'dice' || !isMyTurn}
                        className={`w-full py-3 rounded-2xl font-black text-xl tracking-widest shadow-[0_5px_0_rgb(185,28,28)] transition-all active:translate-y-1 active:shadow-none ${rolling || phase !== 'dice' || !isMyTurn
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            }`}
                    >
                        {rolling ? 'M E L E M P A R...' : 'L E M P A R'}
                    </button>
                    <p className="text-[10px] font-bold text-gray-400 italic text-center leading-tight">
                        {phase === 'dice' ? "Klik untuk melempar dadunya!" : "Tunggu kuis selesai..."}
                    </p>
                </div>

                {/* FIX: TAMPILAN DINAMIS PEMAIN 3 & 4 */}
                {players?.some(p => p.id === 3) || players?.some(p => p.id === 4) ? (
                    <div className="grid grid-cols-2 gap-2 flex-none">
                        {players?.some(p => p.id === 3) && <PlayerCard id={3} colorClass="bg-[#43A047]" />}
                        {players?.some(p => p.id === 4) && <PlayerCard id={4} colorClass="bg-[#FDD835]" />}
                    </div>
                ) : null}

            </div>
        </div>
    );
};

export default Board;