import React, { useRef, useState, useEffect } from 'react';
import { FaChessPawn } from 'react-icons/fa';
import dekorasiImage from '../assets/Logo.png';

const boardLayout = [
    { type: 'player', player: 1 }, { type: 'path', number: 15 }, { type: 'path', number: 14 }, { type: 'path', number: 13 }, { type: 'path', number: 12 }, { type: 'player', player: 2 },
    { type: 'dice', player: 1, die: 1 }, { type: 'path', number: 8 }, { type: 'path', number: 9 }, { type: 'path', number: 10 }, { type: 'path', number: 11 }, { type: 'dice', player: 2, die: 1 },
    { type: 'dice', player: 1, die: 2 }, { type: 'path', number: 7 }, { type: 'path', number: 6 }, { type: 'path', number: 5 }, { type: 'path', number: 4 }, { type: 'dice', player: 2, die: 2 },
    { type: 'score', player: 1 }, { type: 'path', number: 0, text: 'Start' }, { type: 'path', number: 1 }, { type: 'path', number: 2 }, { type: 'path', number: 3 }, { type: 'score', player: 2 },
    { type: 'empty' }, { type: 'player', player: 3 }, { type: 'dice', player: 3, die: 1 }, { type: 'dice', player: 3, die: 2 }, { type: 'score', player: 3 }, { type: 'empty' }
];

const pathMap = {
    0: 19, 1: 20, 2: 21, 3: 22, 4: 16, 5: 15, 6: 14, 7: 13,
    8: 7, 9: 8, 10: 9, 11: 10, 12: 4, 13: 3, 14: 2, 15: 1,
};

const Board = ({ players, diceRoll, turn, phase, specialMoves, allEquations, activatedEquations, rolling }) => {
    const boardRef = useRef(null);
    const cellRefs = useRef({});
    const [svgConnectors, setSvgConnectors] = useState([]);
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const boardElement = boardRef.current;
        if (!boardElement) return;

        let resizeTimer;
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const { width, height } = entries[0].contentRect;
                    setBoardSize({ width, height });
                }, 100);
            }
        });
        observer.observe(boardElement);
        return () => {
            observer.disconnect();
            clearTimeout(resizeTimer);
        };
    }, []);

    useEffect(() => {
        if (!boardRef.current || boardSize.width === 0) return;

        const isMobile = boardSize.width < 640;
        const cellSize = boardSize.width / 6;
        const newConnectors = [];

        for (const startNumStr in specialMoves) {
            const startNum = Number(startNumStr);
            const moveData = specialMoves[startNum]; // Ambil datanya

            // Cek apakah formatnya canggih (object) atau simpel (number)
            const isAdvanced = typeof moveData === 'object' && moveData !== null;
            const endNum = isAdvanced ? moveData.end : moveData;

            const startIndex = pathMap[startNum];
            const endIndex = pathMap[endNum];
            const startCell = cellRefs.current[startIndex];
            const endCell = cellRefs.current[endIndex];

            if (startCell && endCell) {
                if (endNum > startNum) { // Ini Tangga
                    let startX, startY, endX, endY;

                    if (isAdvanced) {
                        // LOGIKA BARU YANG CUSTOM PAKE PERSENTASE [x, y]
                        // Kalo startPos/endPos gak diisi, pake default biar gak error
                        const [startPosX, startPosY] = moveData.startPos || [0.5, 0.1];
                        const [endPosX, endPosY] = moveData.endPos || [0.5, 0.9];

                        startX = startCell.offsetLeft + startCell.offsetWidth * startPosX;
                        startY = startCell.offsetTop + startCell.offsetHeight * startPosY;
                        endX = endCell.offsetLeft + endCell.offsetWidth * endPosX;
                        endY = endCell.offsetTop + endCell.offsetHeight * endPosY;
                    } else {
                        // LOGIKA LAMA SEBAGAI FALLBACK (kalo formatnya simpel)
                        const verticalPadding = isMobile ? 5 : 10;
                        startX = startCell.offsetLeft + startCell.offsetWidth / 2;
                        endX = endCell.offsetLeft + endCell.offsetWidth / 2;
                        startY = startCell.offsetTop + verticalPadding;
                        endY = endCell.offsetTop + endCell.offsetHeight - verticalPadding;

                        const ladderOffset = isMobile ? cellSize * 0.12 : 35;
                        startX += ladderOffset;
                        endX += ladderOffset;
                    }

                    const deltaX = endX - startX;
                    const deltaY = endY - startY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX);
                    newConnectors.push({ id: `${startNum}-${endNum}`, type: 'ladder', startX, startY, endX, endY, distance, angle });

                } else { // Ini Ular (logika ular gak diubah, tapi bisa juga dicustom kalo mau)
                    const padding = isMobile ? cellSize * 0.25 : 15;
                    let startX = startCell.offsetLeft + padding;
                    let startY = startCell.offsetTop + startCell.offsetHeight / 2;
                    let endX = endCell.offsetLeft + endCell.offsetWidth - padding;
                    let endY = endCell.offsetTop + endCell.offsetHeight / 2;

                    // Ini bisa juga dibikin advanced kalo perlu
                    if (isAdvanced) {
                        const [startPosX, startPosY] = moveData.startPos || [0.5, 0.5];
                        const [endPosX, endPosY] = moveData.endPos || [0.5, 0.5];
                        startX = startCell.offsetLeft + startCell.offsetWidth * startPosX;
                        startY = startCell.offsetTop + startCell.offsetHeight * startPosY;
                        endX = endCell.offsetLeft + endCell.offsetWidth * endPosX;
                        endY = endCell.offsetTop + endCell.offsetHeight * endPosY;
                    }

                    const deltaX = endX - startX;
                    const deltaY = endY - startY;
                    const angle = Math.atan2(deltaY, deltaX);
                    const perpAngle = angle + Math.PI / 2;
                    const curveOffset = isMobile ? cellSize * 1.1 : 70;
                    const offsetX = curveOffset * Math.cos(perpAngle);
                    const offsetY = curveOffset * Math.sin(perpAngle);
                    const cp1X = startX + deltaX * 0.25 + offsetX;
                    const cp1Y = startY + deltaY * 0.25 + offsetY;
                    const cp2X = startX + deltaX * 0.75 - offsetX;
                    const cp2Y = startY + deltaY * 0.75 - offsetY;
                    const pathData = `M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
                    newConnectors.push({ id: `${startNum}-${endNum}`, type: 'snake', path: pathData, startX, startY, endX, endY });
                }
            }
        }
        setSvgConnectors(newConnectors);
    }, [specialMoves, boardSize]);


    const renderPawns = (cellIndex) => {
        const playersOnCell = (players || []).filter(p => pathMap[p.position] === cellIndex);
        if (playersOnCell.length === 0) return null;
        return (
            <div className="absolute bottom-1 right-1 flex flex-wrap-reverse gap-1 justify-end z-40">
                {playersOnCell.map(p => (<FaChessPawn key={p.id} className="text-sm sm:text-xl lg:text-2xl drop-shadow" style={{ color: p.color }} />))}
            </div>
        );
    };

    return (
        <div ref={boardRef} className="relative grid grid-cols-6 gap-2 sm:gap-4 w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-2 sm:p-3 bg-indigo-950 rounded-xl shadow-inner border-10 border-gray-400/90 shadow-lg shadow-cyan-400/20">
            <div className="absolute top-0 left-[16.66%] w-[66.66%] h-[80%] bg-amber-400/90 backdrop-blur-sm rounded-xl pointer-events-none z-0"></div>
            {boardLayout.map((cell, index) => {
                const currentPlayer = players?.[turn];
                return (
                    <div key={index} ref={el => cellRefs.current[index] = el} className="relative">
                        {(() => {
                            switch (cell.type) {
                                case 'player':
                                    const playerForCell = players?.find(p => p.id === cell.player);
                                    if (!playerForCell) return <div className="rounded-lg bg-gray-200 aspect-square" />;
                                    const ringColorClass = playerForCell.color === 'red' ? 'ring-red-500' : playerForCell.color === 'blue' ? 'ring-blue-500' : 'ring-green-500';
                                    const playerBoxStyle = { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${dekorasiImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                                    return (
                                        <div className={`flex flex-col justify-center items-center rounded-lg shadow-inner p-1 aspect-square text-center transition-all duration-300 ${currentPlayer?.id === playerForCell.id && phase === 'dice' ? `ring-2 sm:ring-4 ring-offset-2 ${ringColorClass}` : ''}`} style={playerBoxStyle} >
                                            <FaChessPawn className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-0.5 sm:mb-1" style={{ color: playerForCell.color }} />
                                            <h4 className="font-bold text-[8px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap text-black">{playerForCell.name}</h4>
                                        </div>
                                    );
                                case 'dice':
                                    const playerForDice = players?.find(p => p.id === cell.player);
                                    if (!playerForDice) return <div className="rounded-lg bg-gray-200 aspect-square" />;
                                    const diceBgColor = playerForDice.color === 'red' ? 'bg-red-600' : playerForDice.color === 'blue' ? 'bg-blue-600' : playerForDice.color === 'green' ? 'bg-green-600' : 'bg-gray-400';
                                    let diceValues = playerForDice.dice || [1, 1];
                                    if (phase === 'dice' && rolling && currentPlayer?.id === playerForDice.id) { diceValues = diceRoll; }
                                    const dieValue = cell.die === 1 ? diceValues[0] : diceValues[1];
                                    return (
                                        <div className={`flex justify-center items-center rounded-lg ${diceBgColor} shadow-inner p-1 sm:p-2 aspect-square`}>
                                            <img src={`/dice/dice${dieValue}.png`} alt={`dice-${dieValue}`} className="w-full h-full object-contain rounded-md" />
                                        </div>
                                    );
                                case 'score':
                                    const playerForScore = players?.find(p => p.id === cell.player);
                                    let scoreBgClass = 'bg-gray-100';
                                    let scoreTextClass = 'text-gray-800';
                                    let scoreLabelClass = 'text-gray-700';
                                    if (playerForScore) {
                                        switch (playerForScore.color) {
                                            case 'red': scoreBgClass = 'bg-red-100'; scoreTextClass = 'text-red-800'; scoreLabelClass = 'text-red-700'; break;
                                            case 'blue': scoreBgClass = 'bg-blue-100'; scoreTextClass = 'text-blue-800'; scoreLabelClass = 'text-blue-700'; break;
                                            case 'green': scoreBgClass = 'bg-green-100'; scoreTextClass = 'text-green-800'; scoreLabelClass = 'text-green-700'; break;
                                        }
                                    }
                                    return (
                                        <div className={`flex flex-col justify-center items-center rounded-lg ${scoreBgClass} shadow-inner p-1 aspect-square`}>
                                            <span className={`text-[8px] sm:text-xs lg:text-sm ${scoreLabelClass} font-semibold`}>SKOR</span>
                                            <span className={`font-bold ${scoreTextClass} text-center text-xs sm:text-2xl md:text-3xl lg:text-4xl`}>{playerForScore?.score || 0}</span>
                                        </div>
                                    );
                                case 'path':
                                    const isSpecialStart = specialMoves[cell.number] !== undefined;
                                    const isActivated = (activatedEquations || []).some(eq => eq.number === cell.number);
                                    const bgColor = isActivated ? 'bg-yellow-400 shadow-lg scale-105' : 'bg-stone-100';
                                    const startBg = cell.text === 'Start' ? 'bg-stone-300 font-bold' : bgColor;

                                    // ===== BAGIAN YANG DIUBAH ADA DI SINI =====
                                    const numberClass = cell.text === 'Start'
                                        ? "text-base sm:text-lg md:text-xl lg:text-2xl"
                                        : "text-[clamp(8px,2vw,18px)]"; // <-- UDAH PAKE CLAMP()

                                    return (
                                        <div className={`relative flex flex-col justify-center items-center rounded-lg shadow p-1 aspect-square ${startBg} transition-all duration-300`}>
                                            <span className={`absolute top-1 left-1 font-bold text-slate-800 z-10 ${numberClass}`}>{cell.text || cell.number}</span>
                                            {!isSpecialStart && allEquations[cell.number] && (
                                                <p className="break-words leading-tight text-center font-semibold text-slate-800 z-10 text-[clamp(7px,1.5vw,16px)]">
                                                    {allEquations[cell.number]}
                                                </p>
                                            )}
                                            {renderPawns(index)}
                                        </div>
                                    );
                                case 'empty':
                                    return (<div className="relative rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 shadow-inner aspect-square"> <img src={dekorasiImage} alt="dekorasi" className="w-full h-full object-cover rounded-md opacity-80 mix-blend-multiply" /> </div>);
                                default:
                                    return <div className="bg-white aspect-square rounded-lg"></div>;
                            }
                        })()}
                    </div>
                );
            })}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-5">
                <defs> {svgConnectors.filter(c => c.type === 'snake').map(connector => (<linearGradient key={`snakeGradient-${connector.id}`} id={`snakeGradient-${connector.id}`} x1={connector.startX} y1={connector.startY} x2={connector.endX} y2={connector.endY} gradientUnits="userSpaceOnUse"> <stop offset="0%" stopColor="#4CAF50" stopOpacity="1" /> <stop offset="100%" stopColor="#A1887F" stopOpacity="0.8" /> </linearGradient>))} </defs>
                {svgConnectors.map((connector) => {
                    const isMobile = boardSize.width < 640;
                    const cellSize = boardSize.width / 6;
                    if (connector.type === 'snake') {
                        const snakeStrokeWidth = isMobile ? Math.max(6, cellSize * 0.18) : 18;
                        const headRadius = isMobile ? Math.max(2, cellSize * 0.06) : 5;
                        const eyeRadius = headRadius * 0.4;
                        return (<g key={connector.id}>
                            <path d={connector.path} fill="none" stroke={`url(#snakeGradient-${connector.id})`} strokeWidth={snakeStrokeWidth} strokeLinecap="round" style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }} />
                            <circle cx={connector.startX} cy={connector.startY} r={headRadius} fill="white" stroke="black" strokeWidth="1" />
                            <circle cx={connector.startX} cy={connector.startY} r={eyeRadius} fill="black" />
                        </g>);
                    } else if (connector.type === 'ladder') {
                        const ladderWidth = isMobile ? Math.max(10, cellSize * 0.22) : 20;
                        const railStrokeWidth = isMobile ? Math.max(2, cellSize * 0.05) : 4;
                        const rungSpacing = isMobile ? Math.max(15, cellSize * 0.35) : 25;
                        const numRungs = Math.floor(connector.distance / rungSpacing);
                        const perpAngle = connector.angle + Math.PI / 2;
                        const railOffsetX = (ladderWidth / 2) * Math.cos(perpAngle);
                        const railOffsetY = (ladderWidth / 2) * Math.sin(perpAngle);
                        const rail1_startX = connector.startX - railOffsetX;
                        const rail1_startY = connector.startY - railOffsetY;
                        const rail1_endX = connector.endX - railOffsetX;
                        const rail1_endY = connector.endY - railOffsetY;
                        const rail2_startX = connector.startX + railOffsetX;
                        const rail2_startY = connector.startY + railOffsetY;
                        const rail2_endX = connector.endX + railOffsetX;
                        const rail2_endY = connector.endY + railOffsetY;
                        return (<g key={connector.id} style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))' }}>
                            <line x1={rail1_startX} y1={rail1_startY} x2={rail1_endX} y2={rail1_endY} stroke="#8D6E63" strokeWidth={railStrokeWidth} strokeLinecap="round" />
                            <line x1={rail2_startX} y1={rail2_startY} x2={rail2_endX} y2={rail2_endY} stroke="#8D6E63" strokeWidth={railStrokeWidth} strokeLinecap="round" />
                            {Array.from({ length: numRungs }).map((_, i) => {
                                const rungRatio = (i + 1) / (numRungs + 1);
                                const rungX1 = rail1_startX + (rail1_endX - rail1_startX) * rungRatio;
                                const rungY1 = rail1_startY + (rail1_endY - rail1_startY) * rungRatio;
                                const rungX2 = rail2_startX + (rail2_endX - rail2_startX) * rungRatio;
                                const rungY2 = rail2_startY + (rail2_endY - rail2_startY) * rungRatio;
                                return (<line key={`rung-${connector.id}-${i}`} x1={rungX1} y1={rungY1} x2={rungX2} y2={rungY2} stroke="#A1887F" strokeWidth={railStrokeWidth} strokeLinecap="round" />)
                            })}
                        </g>);
                    }
                    return null;
                })}
            </svg>
        </div>
    );
};

export default Board;