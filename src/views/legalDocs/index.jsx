import { useState, useEffect } from "react";
import { sendRequestWithFile } from "../../functions";
import '../../../mijs.js'
import { cargarPDF } from "../../../mijs.js"

const LegalDocs = () => {
  const [pdfData, setPdfData] = useState([]);

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
      console.error("No se encontraron datos en la respuesta.");
    }
  };
  
  
  

  

  return (
    <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12" id="pdfManager" style={{ display: "none" }}>
              <div className="row" id="selectorContainer">
                <div className="col-fixed-240" id="parametriContainer">
                  {/* Coloca aquí el contenido del contenedor de parámetros */}
                </div>
                <div className="col-fixed-605">
                  <div id="pageContainer" className="pdfViewer singlePageView dropzone nopadding" style={{ backgroundColor: "transparent" }}>
                    <canvas id="the-canvas" style={{ border: "1px solid black" }}></canvas>
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
        <input id="pdfBase64" type="hidden" value={pdfData.length > 0 ? pdfData[0].file : ''} />
    </div>
  );
};

export default LegalDocs;