import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ closeModal, onSave }) => {
  const signatureRef = useRef();

  const handleSave = () => {
    const dataUrl = signatureRef.current.toDataURL();
    signatureRef.current.clear();  // Limpia el contenido del canvas
    onSave(dataUrl);
  };

  const handleClear = () => {
    signatureRef.current.clear();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SignatureCanvas
        penColor="black"
        canvasProps={{ width: 400, height: 150, style: { border: "1px solid #000", maxWidth: "400px", maxHeight: "150px", width: "100%" } }}
        ref={signatureRef}
      />
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", width: "85%" }}>
        <button className="btn btn-primary" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} className="me-2" />
          Guardar Firma
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
