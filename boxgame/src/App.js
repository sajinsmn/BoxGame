import React, { useState } from 'react';

// A little bit of styling to make the boxes look nice
const boxStyles = {
  border: '2px solid #333',
  borderRadius: '8px',
  padding: '16px',
  margin: '8px',
  textAlign: 'center',
  minWidth: '120px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const containerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  margin: '20px 0',
};

const controlStyles = {
  margin: '10px',
  padding: '8px 16px',
  fontSize: '16px',
  cursor: 'pointer',
};

// The main component
const BoxGame = () => {
  // Initial structure of the boxes
  const initialBoxState = [
    { id: 'a', color: 'Violet', balls: 0 },
    { id: 'b', color: 'Orange', balls: 0 },
    { id: 'c', color: 'Cream', balls: 0 },
    { id: 'd', color: 'White', balls: 0 },
  ];

  // State to hold the initial number from the user
  const [initialValue, setInitialValue] = useState(10);
  // State to hold the array of boxes
  const [boxes, setBoxes] = useState(initialBoxState);

  // Function to initialize the boxes based on the user's number
  const handleInitialize = () => {
    const n = parseInt(initialValue, 10);
    if (isNaN(n) || n < 0) {
      alert('Please enter a valid positive number.');
      return;
    }
    const newBoxes = boxes.map((box, index) => ({
      ...box,
      balls: n * Math.pow(2, index), // Calculates n, 2n, 4n, 8n
    }));
    setBoxes(newBoxes);
  };
  
  // Resets the game to its initial empty state
  const handleReset = () => {
    setBoxes(initialBoxState);
  }

  // GAME LOGIC HANDLERS

  // Choice 1: Double the balls in each box
  const handleChoice1 = () => {
    setBoxes(currentBoxes => 
      currentBoxes.map(box => ({ ...box, balls: box.balls * 2 }))
    );
  };

  // Choice 2: Empty consecutive boxes and push to the last box
  const handleChoice2 = () => {
    const ballsToMove = boxes[0].balls + boxes[1].balls + boxes[2].balls;
    const newBoxes = JSON.parse(JSON.stringify(boxes)); // Deep copy

    newBoxes[0].balls = 0; // Empty box a
    newBoxes[1].balls = 0; // Empty box b
    newBoxes[2].balls = 0; // Empty box c
    newBoxes[3].balls += ballsToMove; // Add all to box d

    setBoxes(newBoxes);
  };

  // Choice 3: Push odd-numbered boxes into even-numbered boxes
  const handleChoice3 = () => {
    const newBoxes = JSON.parse(JSON.stringify(boxes)); // Deep copy
    
    // Push box 'a' (pos 1) into box 'b' (pos 2)
    newBoxes[1].balls += newBoxes[0].balls;
    newBoxes[0].balls = 0;
    
    // Push box 'c' (pos 3) into box 'd' (pos 4)
    newBoxes[3].balls += newBoxes[2].balls;
    newBoxes[2].balls = 0;
    
    setBoxes(newBoxes);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🎨 Colored Ball Game</h2>
      
      {/* --- Setup Controls --- */}
      <div>
        <label>Set Initial Value: </label>
        <input 
          type="number"
          value={initialValue}
          onChange={(e) => setInitialValue(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleInitialize} style={controlStyles}>Initialize Boxes</button>
        <button onClick={handleReset} style={controlStyles}>Reset</button>
      </div>

      {/* --- Game Checker Choices --- */}
      <div style={{ marginTop: '20px' }}>
        <h3>Game Checker Choices</h3>
        <button onClick={handleChoice1} style={controlStyles}>Choice 1</button>
        <button onClick={handleChoice2} style={controlStyles}>Choice 2</button>
        <button onClick={handleChoice3} style={controlStyles}>Choice 3</button>
      </div>

      {/* --- Display Boxes --- */}
      <div style={containerStyles}>
        {boxes.map(box => (
          <div key={box.id} style={{...boxStyles, backgroundColor: box.color.toLowerCase()}}>
            <h3 style={{ margin: 0, color: ['Violet', 'White'].includes(box.color) ? 'black' : 'white' }}>
              Box {box.id.toUpperCase()} ({box.color})
            </h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: ['Violet', 'White'].includes(box.color) ? 'black' : 'white' }}>
              {box.balls}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxGame;