import React, { useState, useEffect, useRef } from "react";
import { sendRequestWithFile, sendRequest } from "../../functions";
import SignaturePad from "../../components/signatureCanvas.jsx";
import { cargarPDF, renderizzaPlaceholder } from "../../../mijs.js";
import Modal from "../../components/Modal";
import { useParams } from "react-router-dom";

const LegalDocs = () => {
  const [pdfData, setPdfData] = useState([]);
  const closeRef = useRef();
  const { id } = useParams();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [patientCase, setPatientCase] = useState([]);
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  useEffect(() => {
    getFiles(id);
    getPatientCase();
  }, []);

  function isValidBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  }

  const getFiles = async (fileId) => {
    //const fileId = 39;
    try {
      const res = await sendRequestWithFile(
        "GET",
        `/files/${fileId}`,
        "",
        "",
        "",
        true
      );

      if (res) {
        const pdfContent = res.file;

        if (pdfContent) {
          try {
            if (isValidBase64(pdfContent)) {
              const decodedBinaryData = atob(pdfContent);
              setPdfData(decodedBinaryData);
              cargarPDF(decodedBinaryData);
            } else {
              console.error("Invalid base64 encoding in the server response.");
            }
          } catch (error) {
            console.error("Error decoding base64:", error);
            console.log("Binary Data:", pdfContent);
          }
        } else {
          console.error("No valid PDF content found in the server response.");
        }
      }
    } catch (error) {
      //show_alert("No hay archivos",'info');

      handleErrors(error);
    }
  };

  const getPatientCase = async () => {
    try {
      const res = await sendRequest(
        "GET",
        "/patientCase/latestPatient/",
        "",
        "",
        "",
        true
      );

      if (res.data) {
        const {
          patientCaseName,
          lastName,
          lastName2,
          identityCard,
          phoneNumber,
        } = res.data;

        const formattedData = [
          {
            idParametro: 1,
            descrizione: `${patientCaseName} ${lastName} ${lastName2}`,
            valore: `${patientCaseName} ${lastName} ${lastName2}`,
          },
          {
            idParametro: 2,
            descrizione: identityCard,
            valore: identityCard,
          },
          {
            idParametro: 3,
            descrizione: phoneNumber,
            valore: phoneNumber,
          },
          {
            idParametro: 4,
            descrizione: "x",
            valore: "Sí",
          },
          {
            idParametro: 5,
            descrizione: formattedDate,
            valore: formattedDate,
          },
        ];

        setPatientCase(formattedData);
      } else {
        console.error("No se encontraron datos en la respuesta.");
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const openModal = () => {
    const modalTarget = "#addEventModal";
    const modalButton = document.querySelector(
      `[data-bs-target="${modalTarget}"]`
    );
    if (modalButton) modalButton.click();
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

  const drawOnPdfCanvas = (firmaCoordenadas) => {
    if (firmaCoordenadas && firmaCoordenadas.canvas) {
      const canvas = document.getElementById("the-canvas");
      const context = canvas.getContext("2d");

      context.drawImage(
        firmaCoordenadas.canvas,
        firmaCoordenadas.x,
        firmaCoordenadas.y,
        firmaCoordenadas.width,
        firmaCoordenadas.height
      );
    }
  };

  const descargarPDFConMarcadores = () => {
    return new Promise((resolve) => {
      const canvas = document.getElementById("the-canvas");

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "pdf_con_marcadores.pdf";
        resolve(link);
      }, "application/pdf");
    });
  };

  const handleDescargarClick = () => {
    try {
      descargarPDFConMarcadores()
        .then((link) => link.click())
        .catch((error) =>
          console.error(
            "Error al descargar PDF con firmaCoordenadasPDF:",
            error
          )
        );
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

      const signatureImage = await loadImage(dataUrl);
      setSignatureImage(signatureImage);

      const signatureCanvas = createCanvas();
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

  const handleAceptarClick = () => {
    try {
      const mainCanvas = document.getElementById("the-canvas");
      if (!mainCanvas)
        throw new Error("No se encontró el elemento canvas principal");

      const firmaCanvas = document.getElementById("canvas");
      if (!firmaCanvas)
        throw new Error("No se encontró el elemento canvas de firma");

      const firmaRect = firmaCanvas.getBoundingClientRect();
      const mainCanvasRect = mainCanvas.getBoundingClientRect();

      const firmaCoordenadasRelativas = {
        canvas: firmaCanvas,
        x: firmaRect.left - mainCanvasRect.left,
        y: firmaRect.top - mainCanvasRect.top,
        width: firmaRect.width,
        height: firmaRect.height,
      };

      const scaleFactorX = mainCanvas.width / mainCanvasRect.width;
      const scaleFactorY = mainCanvas.height / mainCanvasRect.height;

      const firmaCoordenadasPDF = {
        canvas: firmaCanvas,
        x: firmaCoordenadasRelativas.x * scaleFactorX,
        y: firmaCoordenadasRelativas.y * scaleFactorY,
        width: firmaCoordenadasRelativas.width * scaleFactorX,
        height: firmaCoordenadasRelativas.height * scaleFactorY,
      };

      drawOnPdfCanvas(firmaCoordenadasPDF);

      firmaCanvas.parentNode.removeChild(firmaCanvas);
    } catch (error) {
      console.error("Error al obtener coordenadas de firma:", error);
    }
  };

  const drawTextOnCanvas = (text, x, y) => {
    const mainCanvas = document.getElementById("the-canvas");
    const context = mainCanvas.getContext("2d");

    context.font = "12px Arial";

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(text, x, y);
  };

  const handleInsertarMarcadoresClick = () => {
    try {
      const mainCanvas = document.getElementById("the-canvas");
      if (!mainCanvas)
        throw new Error("No se encontró el elemento canvas principal");

      const parametersInput = document.getElementById("parameters");
      const parametersValue = parametersInput.value;

      const parametersArray = JSON.parse(parametersValue);
      const maxNumberOfElements = parametersArray.length;

      for (let i = 1; i <= maxNumberOfElements; i++) {
        const paramDataId = `paramData${i}`;
        const paramData = document.getElementById(paramDataId);

        if (!paramData) {
          console.warn(`No se encontró el elemento ${paramDataId}`);
          continue; // Skip to the next iteration if the element is not found
        }

        const placeholderText =
          paramData.querySelector(".descrizione").textContent;

        const firmaRect = paramData.getBoundingClientRect();
        const mainCanvasRect = mainCanvas.getBoundingClientRect();

        const firmaCoordenadasRelativas = {
          canvas: paramData,
          x: firmaRect.left - mainCanvasRect.left,
          y: firmaRect.top - mainCanvasRect.top,
          width: firmaRect.width,
          height: firmaRect.height,
        };

        const scaleFactorX = mainCanvas.width / mainCanvasRect.width;
        const scaleFactorY = mainCanvas.height / mainCanvasRect.height;

        const firmaCoordenadasPDF = {
          canvas: paramData,
          x: firmaCoordenadasRelativas.x * scaleFactorX,
          y: firmaCoordenadasRelativas.y * scaleFactorY,
          width: firmaCoordenadasRelativas.width * scaleFactorX,
          height: firmaCoordenadasRelativas.height * scaleFactorY,
        };

        drawTextOnCanvas(
          placeholderText,
          firmaCoordenadasPDF.x + firmaCoordenadasPDF.width / 2,
          firmaCoordenadasPDF.y + firmaCoordenadasPDF.height / 2
        );

        paramData.parentNode.removeChild(paramData);
      }
      renderizzaPlaceholder(patientCase);
    } catch (error) {
      console.error("Error al obtener coordenadas de marcadores:", error);
    }
  };

  const closeModal = () => {
    setShowSignatureModal(false);
    closeRef.current.click();
  };

  const handleErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "NOT_SESSION"
    ) {
      localStorage.clear();
      history.push("/login");
    } else {
      console.error("Error en la solicitud:", error);
    }
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
                {/* Contenido del contenedor de parámetros */}
              </div>
              <div className="col-fixed-605">
                <div
                  id="pageContainer"
                  className="pdfViewer singlePageView dropzone nopadding"
                  style={{ backgroundColor: "transparent" }}
                >
                  {pdfData ? (
                    <canvas
                      id="the-canvas"
                      style={{ border: "1px solid black" }}
                    ></canvas>
                  ) : (
                    <p>Loading PDF...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        id="parameters"
        type="hidden"
        value={JSON.stringify(patientCase)}
      />

      <div
        id="acciones"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          bottom: 0,
          width: "100%",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        <button className="btn btn-primary" onClick={handleAbrirFirmaClick}>
          Agregar Firma
        </button>
        <button className="btn btn-primary" onClick={handleAceptarClick}>
          Firmar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleInsertarMarcadoresClick}
        >
          Agregar Datos
        </button>
        <button className="btn btn-primary" onClick={handleDescargarClick}>
          Descargar PDF
        </button>
      </div>

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
