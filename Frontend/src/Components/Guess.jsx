import React from 'react';

// Re-renders when the letter codes or the text changes (Should not happen once it is set)
const Guess = React.memo(({ children, letterCodes }) => {
  console.log(
    `Rendering Guess component (word:${children}, letterCodes:[${letterCodes.join(
      ', ',
    )}])`,
  );
  return (
    <div style={wordContainerStyle}>
      {Array.from(children).map((letter, letterIndex) => {
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
});

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
