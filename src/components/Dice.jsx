// src/components/Dice.jsx
import React, { useState } from "react";

const Dice = () => {
  const [current, setCurrent] = useState(1); // awalnya 1
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 6) + 1;
      setCurrent(random);
      rollCount++;

      if (rollCount > 10) { // stop setelah "berputar" 10x
        clearInterval(interval);
        setRolling(false);
      }
    }, 100); // ganti gambar tiap 100ms
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={`/dice/dice${current}.png`} // simpan di public/dice/
        alt={`dice-${current}`}
        className="w-24 h-24"
      />
      <button
        onClick={rollDice}
        disabled={rolling}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
};

export default Dice;
