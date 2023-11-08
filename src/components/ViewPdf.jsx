import { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";

const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const loadPdfFromBase64 = async (pdfBase64) => {
  const pdfBytes = base64ToArrayBuffer(pdfBase64);
  return PDFDocument.load(pdfBytes);
};

function ViewPdf({ pdfData }) {
  const [pdfDoc, setPdfDoc] = useState(null);

  const maxPDFx = 595;
  const maxPDFy = 842;
  const offsetY = 7;
  const notValidHeight = 30;
  const parametriContainerRef = useRef(null);
  const [parametri, setParametri] = useState(null); 

  const loadParametri = () => {
    const parametriData = [
      {"idParametro":480,"descrizione":"RAPINA","valore":"X","nota":null},{"idParametro":481,"descrizione":"CAUSAL_G00","valore":"X","nota":null},{"idParametro":482,"descrizione":"A","valore":"A","nota":null},{"idParametro":483,"descrizione":"POSTA_REGISTRATA","valore":"X","nota":null},{"idParametro":484,"descrizione":"CD","valore":"CD","nota":null}
    ];
    setParametri(parametriData);
  };

  const loadPdf = async () => {
    try {
      setPdfDoc(await loadPdfFromBase64(pdfData[0].file));
    } catch (error) {
      console.error("Error al cargar el PDF:", error);
    }
  };

  useEffect(() => {
    loadPdf();
    loadParametri();
  }, [pdfData]);

  const renderizzaPlaceholder = (parametri) => {
    return parametri.map((param, index) => {
      const classStyle = "drag-drop dropped-out";
      const valore = param.valore;
      const x = 6;
      const y = index * notValidHeight; // Usar el índice para calcular la posición en Y

      return (
        <div
          key={index}
          className={classStyle}
          data-id="-1"
          data-toggle={valore}
          data-valore={valore}
          data-x={x}
          data-y={y}
          style={{ transform: `translate(${x}px, ${y}px)` }}
        >
          <span className="circle" />
          <span className="descrizione">{param.descrizione}</span>
        </div>
      );
    });
  };

  const renderizzaInPagina = (parametri) => {
    return parametri.map((param, index) => {
      const classStyle = "drag-drop can-drop";
      const valore = param.valore;
      const paramContainerWidth = parametriContainerRef.current
    ? parametriContainerRef.current.clientWidth
    : 0;
      const pdfY = maxPDFy - param.posizioneY - offsetY;
      const y = (pdfY * maxPDFy) / maxPDFy;
      const x = (param.posizioneX * maxPDFx) + paramContainerWidth;

      return (
        <div
          key={param.idParametroModulo}
          className={classStyle}
          data-id={param.idParametroModulo}
          data-toggle={valore}
          data-valore={valore}
          data-x={x}
          data-y={y}
          style={{ transform: `translate(${x}px, ${y}px)` }}
        >
          <span className="circle" />
          <span className="descrizione">{param.descrizione}</span>
        </div>
      );
    });
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer" style={{ position: "relative" }}>
        {pdfDoc && (
          <iframe
            src={`data:application/pdf;base64,${pdfData[0].file}`}
            width="100%"
            height="800"
            title="PDF Viewer"
          />
        )}
      </div>
      <input id="parameters" type="hidden" value='[]' /> 
      <div id="parametriContainer">
  {parametri ? (
    renderizzaPlaceholder(parametri)
  ) : (
    <p>Cargando parámetros...</p>
  )}
</div></div>
  );
}

export default ViewPdf;
