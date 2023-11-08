import React, { useRef, useEffect } from 'react';

function RenderizaPlaceholders({ parametri }) {
  const maxHTMLxRef = useRef(null);
  const maxHTMLyRef = useRef(null);
  const paramContainerWidthRef = useRef(null);

  useEffect(() => {
    // Acceder a las dimensiones de #the-canvas y el ancho de #parametriContainer
    if (maxHTMLxRef.current) {
      const maxHTMLx = maxHTMLxRef.current.clientWidth;
      const maxHTMLy = maxHTMLyRef.current.clientWidth;
      const paramContainerWidth = paramContainerWidthRef.current.clientWidth;
    }
  }, []);

  const notValidHeight = 30;
  let yCounterOfGenerated = 0;

  return (
    <div id="parametriContainer" ref={paramContainerWidthRef}>
      {parametri.map((param, index) => {
        const classStyle = "drag-drop dropped-out";
        const valore = param.valore;
        const x = 6;
        const y = yCounterOfGenerated;
        yCounterOfGenerated += notValidHeight;

        return (
          <div
            key={index}
            className={classStyle}
            data-id="-1"
            data-toggle={valore}
            data-valore={valore}
            data-x={x}
            data-y={y}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <span className="circle" />
            <span className="descrizione">{param.descrizione}</span>
          </div>
        );
      })}
    </div>
  );
}

export default RenderizaPlaceholders;
