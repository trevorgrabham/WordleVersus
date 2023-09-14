import React from 'react';
import UsedLetter from './UsedLetter';
import useGameDataStore from '../stores/gameDataStore';

const UsedLetterGrid = React.memo(({}) => {
  const usedLetters = useGameDataStore((state) => state.usedLetters);

  return (
    <div style={usedLetterGridStyle}>
      {Object.keys(usedLetters).map((key) => {
        return (
          <UsedLetter key={key.charCodeAt(0)} code={usedLetters[key]}>
            {key}
          </UsedLetter>
        );
      })}
    </div>
  );
});

export default UsedLetterGrid;

const usedLetterGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7,1fr)',
  gridGap: '10px',
};
