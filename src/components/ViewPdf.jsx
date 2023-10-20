import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const ViewPdf = ({ pdfData }) => {
  if (!pdfData || pdfData.length === 0) {
    return <div className="pdf-viewer-container">No hay PDF para mostrar</div>;
  }

  const pdfFile = pdfData[0];
  const pdfUrl = `data:application/pdf;base64,${pdfFile.file}`;

  // Estilos personalizados para el visor
  const pdfViewerStyles = {
    container: {
      overflow: "hidden", // Oculta el scroll vertical
    },
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer">
        <Worker workerUrl={`//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer fileUrl={pdfUrl} styles={pdfViewerStyles} />
        </Worker>
      </div>
    </div>
  );
};

export default ViewPdf;
