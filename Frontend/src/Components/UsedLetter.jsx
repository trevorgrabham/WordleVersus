import React from 'react';

// Re-renders when the code is changed. Should not be changing the children, so this shouldn't trigger a re-render
const UsedLetter = React.memo(({ children, code }) => {
  console.log(`Rendering UsedLetter component (${children}, ${code})`);
  const letterContainerStyle = {
    margin: '10px',
    textAlign: 'center',
    backgroundColor:
      code === 3
        ? '#64ff64'
        : code === 2
        ? '#ffff55'
        : code === 1
        ? '#a8a8a8'
        : 'white',
  };

  return <div style={letterContainerStyle}>{children}</div>;
});

export default UsedLetter;
