import React from 'react';
import useGameDataStore from '../stores/gameDataStore';
import Guess from '../Components/Guess';

const GuessList = React.memo(({}) => {
  console.log(`Rendering GuessList component`);
  const guesses = useGameDataStore((state) => state.guesses);

  return (
    <div style={guessContainerStyle}>
      {guesses.map(({ guess, letterCodes }, index) => {
        return (
          <Guess key={index} letterCodes={letterCodes}>
            {guess}
          </Guess>
        );
      })}
    </div>
  );
});

export default GuessList;

const guessContainerStyle = {};
