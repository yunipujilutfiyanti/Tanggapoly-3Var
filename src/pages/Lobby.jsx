import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// --- SVG Icon Components (Gue ringkas biar ga menuh-menuhin) ---
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const SignInIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>);
const CopyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);


const defaultPlayers = [
    { id: 1, name: "Player 1", color: "red", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, dice: [1, 1], time: 0 },
    { id: 2, name: "Player 2", color: "blue", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, dice: [1, 1], time: 0 },
    { id: 3, name: "Player 3", color: "green", position: 0, score: 10, answer: { x: "", y: "", z: "" }, submitted: { x: false, y: false, z: false }, dice: [1, 1], time: 0 }
];

// --- FUNGSI COPY PINDAH KE SINI BIAR RAPI ---
const copyToClipboard = (text, callback) => {
    const fallbackCopy = () => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            callback(true);
        } catch (err) {
            console.error('Fallback copy gagal:', err);
            callback(false);
        }
        document.body.removeChild(textArea);
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => callback(true)).catch(() => fallbackCopy());
    } else {
        fallbackCopy();
    }
};


function Lobby() {
    const [playerName, setPlayerName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formView, setFormView] = useState(null); // 'create' atau 'join'
    const [gameData, setGameData] = useState(null); // INI STATE UTAMA, kalo ada isinya berarti di dalem lobi
    const [copied, setCopied] = useState(false);
    const [currentPlayerId, setCurrentPlayerId] = useState(null);

    const navigate = useNavigate();

    // --- EFFECT BUAT REALTIME UPDATE LOBI ---
    useEffect(() => {
        if (!gameData?.id) return;

        const channel = supabase.channel(`lobby:${gameData.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'games',
                filter: `id=eq.${gameData.id}`
            }, (payload) => {
                console.log('Ada update lobi:', payload.new);
                const newGameData = payload.new;
                setGameData(newGameData);

                // Kalo phase game-nya udah ganti, semua pemain di-teleport
                if (newGameData.phase === 'dice') {
                    navigate(`/game/${newGameData.id}`);
                }
            })
            .subscribe();

        // Cleanup function pas komponennya ancur
        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameData?.id, navigate]);


    const handleCreateGame = async () => {
        if (!playerName.trim()) { setError('Nama jangan kosong, le!'); return; }
        setLoading(true); setError('');

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const newPlayer = { ...defaultPlayers[0], name: playerName };

        // Game dimulai dengan phase 'waiting'
        const { data, error } = await supabase.from('games').insert([{ players: [newPlayer], join_code: code, turn: 0, phase: 'waiting', diceRoll: [1, 1], finished: false, activatedEquations: [], activePack: null, }]).select().single();

        setLoading(false);
        if (error) {
            setError('Gagal membuat game. Coba lagi.');
            console.error('Supabase Error:', error);
        } else {
            localStorage.setItem(`tanggapoly_player_id_${data.id}`, newPlayer.id.toString());
            setCurrentPlayerId(newPlayer.id);
            setGameData(data); // Langsung set game data, otomatis ganti view
        }
    };

    const handleJoinGame = async () => {
        if (!playerName.trim() || !joinCode.trim()) { setError('Nama dan kode lobi wajib diisi!'); return; }
        setLoading(true); setError('');

        const { data: game, error: fetchError } = await supabase.from('games').select('*').eq('join_code', joinCode.trim()).single();

        if (fetchError || !game) { setLoading(false); setError('Kode lobi tidak ditemukan, Harap Cek lagi kodenya.'); return; }
        if (game.players.length >= 3) { setLoading(false); setError('Lobi sudah penuh!'); return; }
        if (game.players.some(p => p.name === playerName.trim())) {
            setLoading(false);
            setError('Nama itu sudah dipakai, harap diganti dengan nama yang lain!');
            return;
        }

        const newPlayerId = game.players.length + 1;
        const newPlayer = { ...defaultPlayers.find(p => p.id === newPlayerId), name: playerName };
        const updatedPlayers = [...game.players, newPlayer];

        const { error: updateError } = await supabase.from('games').update({ players: updatedPlayers }).eq('id', game.id);

        setLoading(false);
        if (updateError) {
            setError('Gagal bergabung, coba lagi nanti.');
            console.error('Supabase update error:', updateError);
        } else {
            localStorage.setItem(`tanggapoly_player_id_${game.id}`, newPlayer.id.toString());
            setCurrentPlayerId(newPlayer.id);
            setGameData({ ...game, players: updatedPlayers });
        }
    };

    const handleStartGame = async () => {
        if (gameData.players.length !== 3) {
            setError('Pemain belum lengkap!');
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from('games')
            .update({ phase: 'dice' })
            .eq('id', gameData.id);

        setLoading(false);
        if (error) {
            setError('Gagal memulai game');
            console.error('Start game error:', error);
        }
        // Navigasi bakal di-handle sama useEffect listener
    };

    const handleCopy = () => {
        copyToClipboard(gameData.join_code, (success) => {
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        });
    };

    // --- KONTEN LOBI KALO UDAH DIBUAT ---
    const renderWaitingLobby = () => {
        const isFull = gameData.players.length === 3;
        const isHost = currentPlayerId === 1; // Host = Player 1

        const StartButton = () => (
            <button
                onClick={handleStartGame}
                disabled={!isFull || loading}
                className="w-full mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg font-bold text-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? 'Memulai...' : (isFull ? 'Lanjutkan ke Game' : `Menunggu ${3 - gameData.players.length} pemain lagi...`)}
            </button>
        );

        const WaitingMessage = () => (
            <div className="w-full mt-8 px-6 py-3 bg-gray-700 rounded-lg text-gray-300">
                {isFull ? 'Menunggu pembuat lobi memulai game...' : `Menunggu ${3 - gameData.players.length} pemain lagi...`}
            </div>
        );

        return (
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto mt-8 text-center animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-emerald-400">Lobi Menunggu</h2>
                <p className="text-gray-300 mb-4">Kasih kode ini untuk bergabung:</p>
                <div className="flex items-center justify-between gap-2 bg-gray-900 rounded-lg p-4">
                    <span className="font-mono text-4xl tracking-widest text-white">{gameData.join_code}</span>
                    <button onClick={handleCopy} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                <div className="mt-8 text-left">
                    <h3 className="font-bold text-lg mb-3 text-gray-200">Pemain yang sudah di Lobi ({gameData.players.length}/3)</h3>
                    <div className="space-y-3">
                        {gameData.players.map(player => (
                            <div key={player.id} className="bg-gray-700 p-3 rounded-lg flex items-center gap-3">
                                <UserIcon />
                                <span className="font-semibold">{player.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {isHost ? <StartButton /> : <WaitingMessage />}
            </div>
        );
    };

    // --- KONTEN PILIHAN BUAT/GABUNG GAME ---
    const renderSelectionView = () => (
        <>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">TanggaPoly<span className="text-emerald-400">3VAR</span></h3>
            <p className="text-md sm:text-lg md:text-xl text-gray-400 mb-8">Siap mengasah otak sambil seru-seruan?</p>
            <div className='flex flex-col md:flex-row gap-4 md:gap-8 mt-8 sm:mt-12 w-full'>
                <button onClick={() => setFormView('create')} className="w-full text-center p-6 sm:p-8 md:p-10 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg font-bold text-xl sm:text-2xl transition-transform transform hover:scale-105">Buat Game Baru</button>
                <button onClick={() => setFormView('join')} className="w-full text-center p-6 sm:p-8 md:p-10 bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-lg font-bold text-xl sm:text-2xl transition-transform transform hover:scale-105">Gabung Pake Kode</button>
            </div>
        </>
    );

    // --- KONTEN FORM ISIAN ---
    const renderFormView = () => {
        const isCreate = formView === 'create';
        const handler = isCreate ? handleCreateGame : handleJoinGame;
        const color = isCreate ? 'emerald' : 'cyan';
        const isButtonDisabled = loading || !playerName.trim() || (!isCreate && !joinCode.trim());

        return (
            <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md mx-auto mt-8 relative animate-fade-in">
                <button onClick={() => { setFormView(null); setError(''); }} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"><ArrowLeftIcon /></button>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{isCreate ? 'Buat Game Baru' : 'Gabung Pake Kode'}</h2>
                <div className="space-y-4">
                    <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nama Panggilanmu..." className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-${color}-500 text-base sm:text-lg`} />
                    {!isCreate && (<input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="6" value={joinCode} onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))} placeholder="Kode Lobi 6 Digit..." className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-${color}-500 text-base sm:text-lg`} />)}
                    <button onClick={handler} disabled={isButtonDisabled} className={`w-full flex items-center justify-center gap-3 px-6 py-3 sm:py-4 bg-${color}-600 hover:bg-${color}-700 rounded-lg shadow-lg font-bold text-lg sm:text-xl transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}>
                        {isCreate ? <PlusIcon /> : <SignInIcon />} {loading ? (isCreate ? 'Membuat...' : 'Masuk...') : (isCreate ? 'Buat Lobi' : 'Gabung Lobi')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center pt-10">
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }`}</style>
            <div className="w-full max-w-4xl mx-auto text-center">
                {error && (<div className="bg-red-500/20 text-red-400 border border-red-500 rounded-lg p-3 mb-8 max-w-md mx-auto animate-fade-in" role="alert">{error}</div>)}

                {gameData ? renderWaitingLobby() : (formView ? renderFormView() : renderSelectionView())}
            </div>
        </main>
    );
}

export default Lobby;