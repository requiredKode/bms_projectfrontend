import React from "react";
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

const DropArea = () => {
  const [, drop] = useDrop({
    accept: NativeTypes.FILE,
    drop: (item) => {
      // Maneja el elemento soltado aquí
      console.log('Elemento soltado:', item.signatureImage);
    },
  });

  return (
    <div ref={drop} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }} />
  );
};

export default DropArea;
