import React, { useState, useMemo } from 'react';

// Main component for the Colored Ball Game
const ColoredBallGame = () => {
  // --- STATE MANAGEMENT ---

  // Default state for the boxes, memoized to prevent re-creation on re-renders
  const initialBoxState = useMemo(() => [
    { id: 'a', colorName: 'Violet', colorHex: '#E9D5FF', balls: 0 },
    { id: 'b', colorName: 'Orange', colorHex: '#F97316', balls: 0 },
    { id: 'c', colorName: 'Cream', colorHex: '#FEF3C7', balls: 0 },
    { id: 'd', colorName: 'White', colorHex: '#F8FAFC', balls: 0 },
  ], []);

  // State for the user-defined initial number
  const [initialValue, setInitialValue] = useState('10');
  // State for handling validation errors
  const [error, setError] = useState('');
  // State for the array of boxes
  const [boxes, setBoxes] = useState(initialBoxState);

  // --- GAME LOGIC HANDLERS ---

  // Function to initialize the boxes based on the user's number
  const handleInitialize = () => {
    const n = parseInt(initialValue, 10);
    if (isNaN(n) || n < 0) {
      setError('Please enter a valid positive number.');
      return;
    }
    setError(''); // Clear any previous errors
    const newBoxes = boxes.map((box, index) => ({
      ...box,
      // Calculates n, 2n, 4n, 8n for the boxes
      balls: n * Math.pow(2, index),
    }));
    setBoxes(newBoxes);
  };

  // Resets the game to its initial empty state
  const handleReset = () => {
    setError('');
    setInitialValue('10');
    setBoxes(initialBoxState);
  };

  // Choice 1: Double the balls in each box
  const handleChoice1 = () => {
    setBoxes(currentBoxes =>
      currentBoxes.map(box => ({ ...box, balls: box.balls * 2 }))
    );
  };

  // Choice 2: Consolidate the balls from the first three boxes into the last one
  const handleChoice2 = () => {
    setBoxes(currentBoxes => {
      const ballsToMove = currentBoxes[0].balls + currentBoxes[1].balls + currentBoxes[2].balls;
      return currentBoxes.map((box, index) => {
        if (index < 3) return { ...box, balls: 0 }; // Empty boxes A, B, C
        if (index === 3) return { ...box, balls: box.balls + ballsToMove }; // Add to D
        return box;
      });
    });
  };

  // Choice 3: Move balls from odd-positioned boxes to even-positioned boxes
  const handleChoice3 = () => {
     setBoxes(currentBoxes => {
        const newBoxes = currentBoxes.map(b => ({...b})); // Create a mutable copy

        // Push box 'a' (index 0) into box 'b' (index 1)
        newBoxes[1].balls += newBoxes[0].balls;
        newBoxes[0].balls = 0;

        // Push box 'c' (index 2) into box 'd' (index 3)
        newBoxes[3].balls += newBoxes[2].balls;
        newBoxes[2].balls = 0;

        return newBoxes;
     });
  };

  // --- RENDER ---

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Colored Ball Game</h1>
          <p className="text-slate-500 mt-2">An interactive logic puzzle with numbered balls.</p>
        </div>

        {/* Setup Controls Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
                <label htmlFor="initialValue" className="block text-sm font-medium text-slate-700 mb-1">Set Initial Value</label>
                <input
                  id="initialValue"
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full sm:w-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                />
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-6">
                <button
                    onClick={handleInitialize}
                    className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-transform transform hover:scale-105"
                >
                    Initialize Boxes
                </button>
                <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition"
                >
                    Reset
                </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Game Choices Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Game Choices</h2>
          <div className="flex justify-center flex-wrap gap-4">
            <button onClick={handleChoice1} className="px-5 py-2.5 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition">Choice 1: Double All</button>
            <button onClick={handleChoice2} className="px-5 py-2.5 bg-white border-2 border-sky-500 text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition">Choice 2: Consolidate to D</button>
            <button onClick={handleChoice3} className="px-5 py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition">Choice 3: Combine Pairs</button>
          </div>
        </div>

        {/* Display Boxes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {boxes.map(box => {
            const textColor = ['#E9D5FF', '#FEF3C7', '#F8FAFC'].includes(box.colorHex) ? 'text-slate-800' : 'text-white';
            return (
              <div
                key={box.id}
                style={{ backgroundColor: box.colorHex }}
                className="rounded-xl p-6 text-center shadow-lg transform transition-transform hover:-translate-y-1"
              >
                <h3 className={`text-xl font-bold ${textColor}`}>
                  Box {box.id.toUpperCase()}
                </h3>
                <p className={`text-sm opacity-80 mb-4 ${textColor}`}>({box.colorName})</p>
                <p className={`text-5xl font-mono font-extrabold ${textColor}`}>
                  {box.balls}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ColoredBallGame;
