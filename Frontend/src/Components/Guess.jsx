import React from 'react';

function Guess({ word, letterCodes }) {
  return (
    <div style={wordContainerStyle}>
      {Array.from(word).map((letter, letterIndex) => {
        console.log(`From the Guess Component, current letter is: ${letter}`);
        return (
          <div
            key={letterIndex}
            style={letterContainerStyle(letterCodes[letterIndex])}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}

const wordContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '10px 0',
};

const letterContainerStyle = (letterCode) => ({
  margin: '0 10px',
  backgroundColor:
    letterCode === 3 ? '#64ff64' : letterCode === 2 ? '#ffff55' : '#a8a8a8',
});

export default Guess;
