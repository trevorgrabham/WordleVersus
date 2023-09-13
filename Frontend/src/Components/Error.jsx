import React from 'react';

function Error({ children, fontSize }) {
  const mainContainerStyle = {
    color: '#ff6464',
    fontSize: fontSize ? fontSize.toString() : '1.5em',
    fontWeight: '650',
    padding: fontSize ? Math.floor(fontSize / 3).toString() : '0.5em',
  };

  return <div style={mainContainerStyle}>{children}</div>;
}

export default Error;
