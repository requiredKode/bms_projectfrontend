import { useState, useEffect, useRef } from "react";
import { sendRequestWithFile } from "../../functions";
import SignaturePad from "../../components/signatureCanvas.jsx";
import "../../../mijs.js";
import { cargarPDF, descargarPDFConMarcadores } from "../../../mijs.js";
import Modal from "../../components/Modal";
import { PDFDocument, rgb } from "pdf-lib";

const LegalDocs = () => {
  const [pdfData, setPdfData] = useState([]);
  const [pdfLink, setPdfLink] = useState(null);
  const closeRef = useRef();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      const res = await sendRequestWithFile("GET", "/files", "", "", "", true);
      if (res && res.data && res.data.length > 0) {
        setPdfData(res.data);
        // Llama a tu función cargarPDF aquí después de obtener los datos
        cargarPDF();
      } else {
        console.error("No se encontraron datos en la respuesta.");
      }
    } catch (error) {
      console.error("Error al obtener datos en la respuesta.");
    }
  };

  const openModal = () => {
    const modalTarget = "#addEventModal";

    // Simula un clic en el botón para abrir el modal
    const modalButton = document.querySelector(
      `[data-bs-target="${modalTarget}"]`
    );
    if (modalButton) {
      modalButton.click();
    }
  };

  const handleDescargarClick = async () => {
    // Aquí puedes llamar a tu función para descargar el PDF con marcadores
    descargarPDFConMarcadores();
  };

  const handleAbrirFirmaClick = () => {
    setShowSignatureModal(true);
    openModal();
  };

  const handleSignatureSave = async (dataUrl) => {
    try {
      const pdfDataUrl = pdfData.length > 0 ? pdfData[0].file : "";
      const pdfBytes = new Uint8Array(atob(pdfDataUrl).split('').map(char => char.charCodeAt(0)));
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = url;
        });
      };
  
      const signatureCanvas = document.createElement("canvas");
      signatureCanvas.width = pdfDoc.getPages()[0].getWidth();
      signatureCanvas.height = pdfDoc.getPages()[0].getHeight();
      const signatureContext = signatureCanvas.getContext("2d");
  
      const signatureImage = await loadImage(dataUrl);
      signatureContext.drawImage(signatureImage, 50, 50);
  
      const mainCanvas = document.getElementById("the-canvas");
      const mainContext = mainCanvas.getContext("2d");

      
      mainContext.drawImage(signatureCanvas, 0, 0);
  
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfDataUrl = btoa(String.fromCharCode.apply(null, modifiedPdfBytes));
  
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${modifiedPdfDataUrl}`;
      link.download = "pdf_con_firma.pdf";
      link.click();
  
      closeModal();
    } catch (error) {
      console.error("Error al insertar la firma en el PDF:", error);
    }
  };
  
  
  
  
  
  const closeModal = () => {
    setShowSignatureModal(false);
    closeRef.current.click(); // Simula el clic en el botón de cerrar modal
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div
            className="col-md-12"
            id="pdfManager"
            style={{ display: "none" }}
          >
            <div className="row" id="selectorContainer">
              <div className="col-fixed-240" id="parametriContainer">
                {/* Coloca aquí el contenido del contenedor de parámetros */}
              </div>
              <div className="col-fixed-605">
                <div
                  id="pageContainer"
                  className="pdfViewer singlePageView dropzone nopadding"
                  style={{ backgroundColor: "transparent" }}
                >
                  <canvas
                    id="the-canvas"
                    style={{ border: "1px solid black" }}
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        id="parameters"
        type="hidden"
        value='[{"idParametro":480,"descrizione":"RAPINA","valore":"X","nota":null},{"idParametro":481,"descrizione":"CAUSAL_G00","valore":"X","nota":null},{"idParametro":482,"descrizione":"A","valore":"A","nota":null},{"idParametro":483,"descrizione":"POSTA_REGISTRATA","valore":"X","nota":null},{"idParametro":484,"descrizione":"CD","valore":"CD","nota":null}]'
      />
      <input
        id="pdfBase64"
        type="hidden"
        value={pdfData.length > 0 ? pdfData[0].file : ""}
      />

      <button onClick={handleAbrirFirmaClick}>Abrir Modal de Firma</button>

      <button onClick={handleDescargarClick}>
        Descargar PDF con Marcadores
      </button>

      {/* Agrega el modal */}
      <p data-bs-toggle="modal" data-bs-target="#addEventModal" hidden></p>
      <Modal title="Agregar Firma." modal="addEventModal" ancho="md">
        <div className="modal-body">
          <SignaturePad closeModal={closeModal} onSave={handleSignatureSave} />
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-dark"
            data-bs-dismiss="modal"
            ref={closeRef}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LegalDocs;
