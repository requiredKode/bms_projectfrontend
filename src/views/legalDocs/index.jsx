import React, { useState, useEffect, useRef } from "react";
import { sendRequestWithFile } from "../../functions";
import SignaturePad from "../../components/signatureCanvas.jsx";
import "../../../mijs.js";
import { cargarPDF } from "../../../mijs.js";
import Modal from "../../components/Modal";
import { PDFDocument } from "pdf-lib";

const LegalDocs = () => {
  const [pdfData, setPdfData] = useState([]);
  const closeRef = useRef();
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [pdfDataUrl, setPdfDataUrl] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      const res = await sendRequestWithFile("GET", "/files", "", "", "", true);
      if (res && res.data && res.data.length > 0) {
        setPdfData(res.data);
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
    const modalButton = document.querySelector(
      `[data-bs-target="${modalTarget}"]`
    );
    if (modalButton) {
      modalButton.click();
    }
  };

  const createCanvas = () => {
    const containerWidth = 150;
    const containerHeight = 50;
    const containerLeft = "50%";
    const containerTop = "50%";

    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.classList.add("drag-drop");
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.position = "absolute";
    canvas.style.left = containerLeft;
    canvas.style.top = containerTop;
    canvas.style.transform = "translate(-50%, -50%)";
    return canvas;
  };

  const descargarPDFConMarcadores = (firmaCoordenadas) => {
    return new Promise(function (resolve) {
      // Check if firmaCoordenadas is provided
      if (firmaCoordenadas && firmaCoordenadas.canvas) {
        const canvas = document.getElementById("the-canvas");
        const context = canvas.getContext("2d");

        // Dibujar la firma en el canvas principal
        context.drawImage(
          firmaCoordenadas.canvas,
          firmaCoordenadas.x,
          firmaCoordenadas.y,
          firmaCoordenadas.width,
          firmaCoordenadas.height
        );

        // Generar el blob con los elementos superpuestos
        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob);

          var link = document.createElement("a");
          link.href = url;
          link.download = "pdf_con_marcadores.pdf";

          resolve(link);
        }, "application/pdf");
      }
    });
  };

  const handleDescargarClick = () => {
    try {
      // Obtener el elemento canvas principal
      const mainCanvas = document.getElementById("the-canvas");

      if (!mainCanvas) {
        throw new Error("No se encontró el elemento canvas principal");
      }

      // Obtener las coordenadas del canvas de firma
      const firmaCanvas = document.getElementById("canvas");

      if (!firmaCanvas) {
        throw new Error("No se encontró el elemento canvas de firma");
      }

      const firmaRect = firmaCanvas.getBoundingClientRect();
      const mainCanvasRect = mainCanvas.getBoundingClientRect();

      // Obtener las coordenadas relativas al canvas principal
      const firmaCoordenadasRelativas = {
        canvas: firmaCanvas,
        x: firmaRect.left - mainCanvasRect.left,
        y: firmaRect.top - mainCanvasRect.top,
        width: firmaRect.width,
        height: firmaRect.height,
      };

      // Coordenadas relativas al PDF (ajustando según el escalamiento)
      const scaleFactorX = mainCanvas.width / mainCanvasRect.width;
      const scaleFactorY = mainCanvas.height / mainCanvasRect.height;

      const firmaCoordenadasPDF = {
        canvas: firmaCanvas,
        x: firmaCoordenadasRelativas.x * scaleFactorX,
        y: firmaCoordenadasRelativas.y * scaleFactorY,
        width: firmaCoordenadasRelativas.width * scaleFactorX,
        height: firmaCoordenadasRelativas.height * scaleFactorY,
      };

      console.log(
        "Coordenadas del canvas de firma (relativas):",
        firmaCoordenadasRelativas
      );
      console.log(
        "Coordenadas del canvas de firma (en el PDF):",
        firmaCoordenadasPDF
      );

      descargarPDFConMarcadores(firmaCoordenadasPDF)
        .then((link) => {
          // Manejar el enlace (por ejemplo, desencadenar un clic para comenzar la descarga)
          link.click();
        })
        .catch((error) => {
          console.error(
            "Error al descargar PDF con firmaCoordenadasPDF:",
            error
          );
        });
    } catch (error) {
      console.error("Error al obtener coordenadas de firma:", error);
    }
  };

  const handleAbrirFirmaClick = () => {
    setShowSignatureModal(true);
    openModal();
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  };

  const handleSignatureSave = async (dataUrl) => {
    try {
      const pdfDataUrl = pdfData.length > 0 ? pdfData[0].file : "";
      setPdfDataUrl(pdfDataUrl);

      const pdfBytes = new Uint8Array(
        atob(pdfDataUrl)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const signatureImage = await loadImage(dataUrl);
      setSignatureImage(signatureImage);

      const signatureCanvas = createCanvas(); // Utilizar createCanvas en lugar de signatureCanvas
      setSignatureCanvas(signatureCanvas);

      const signatureContext = signatureCanvas.getContext("2d");

      signatureContext.fillStyle = "rgba(0, 0, 0, 0)";
      signatureContext.fillRect(
        0,
        0,
        signatureCanvas.width,
        signatureCanvas.height
      );

      const scaleFactor = Math.min(
        signatureCanvas.width / signatureImage.width,
        signatureCanvas.height / signatureImage.height
      );
      const scaledWidth = signatureImage.width * scaleFactor;
      const scaledHeight = signatureImage.height * scaleFactor;

      signatureContext.drawImage(
        signatureImage,
        0,
        0,
        scaledWidth,
        scaledHeight
      );

      document.body.appendChild(signatureCanvas);
    } catch (error) {
      console.error("Error al insertar la firma en el PDF:", error);
    }
  };

  const closeModal = () => {
    setShowSignatureModal(false);
    closeRef.current.click();
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
        value='[{"idParametro":480,"descrizione":"Paciente","valore":"X","nota":null},{"idParametro":481,"descrizione":"CAUSAL_G00","valore":"X","nota":null},{"idParametro":482,"descrizione":"A","valore":"A","nota":null},{"idParametro":483,"descrizione":"POSTA_REGISTRATA","valore":"X","nota":null},{"idParametro":484,"descrizione":"CD","valore":"CD","nota":null}]'
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
