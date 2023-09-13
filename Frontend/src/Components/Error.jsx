import React from 'react';

function Error({ children, fontSize }) {
  console.log(
    `Rendering Error component (children:${children}, fontSize:${fontSize})`,
  );
  const mainContainerStyle = {
    color: '#ff6464',
    fontSize: fontSize ? fontSize.toString() + 'px' : '1.5em',
    fontWeight: '650',
    padding: fontSize ? Math.floor(fontSize / 3).toString() : '0.5em',
  };

  return <div style={mainContainerStyle}>{children}</div>;
}

export default Error;
