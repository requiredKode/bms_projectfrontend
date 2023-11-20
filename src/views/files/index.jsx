import { useEffect, useState } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import Modal from "../../components/Modal";
import { confirmation, sendRequestWithFile, show_alert } from "../../functions";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

const Files = () => {
  const history = useNavigate();
  const [files, setFiles] = useState([]);
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("");
  const [filesToUpload, setFilesToUpload] = useState([]);

  useEffect(() => {
    getFile();
  }, []);

  const getFile = async () => {
    try {
      const res = await sendRequestWithFile("GET", "/files", "", "", "", true);
      setFiles(res.data);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "NOT_SESSION"
    ) {
      localStorage.clear();
      history("/login");
    } else {
      console.error("Error en la solicitud:", error);
    }
  };

  const deleteFile = (id, name) => {
    confirmation(name, `/files/${id}`, "/files");
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      console.error("No se ha seleccionado un archivo.");
      return;
    }

    setFilesToUpload(acceptedFiles);
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
      console.error("No se ha seleccionado ningún archivo para cargar.");
      return;
    }
  
    let uploadFailed = false; // Flag to track if any file upload fails
  
    // Iterate over the array of files
    for (const selectedFile of filesToUpload) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
      formData.append("fileType", selectedFile.type);
  
      try {
        // Send a POST request for each file
        await sendRequestWithFile(
          "POST",
          "/files",
          formData,
          "", // Empty success message to avoid displaying multiple messages
          ""
        );
      } catch (error) {
        handleErrors(error);
        uploadFailed = true; // Set the flag to true if any file upload fails
      }
    }
  
    // After uploading all files, fetch the updated file list
    getFile();
  
    // Reset the state after uploading files
    setFilesToUpload([]);
  
    // Display success message if no upload has failed
    if (!uploadFailed) {
      show_alert("GUARDADO CON ÉXITO","success");
    }
  };
  

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalFile"
        >
          <i className="fa-solid fa-circle-plus"></i> Agregar
        </button>
      </DivAdd>
      <DivTable col="8" off="2" classLoad={classLoad} classTable={classTable}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre de archivo</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {files.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.fileName}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteFile(row.id, row.fileName)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DivTable>
      <Modal title="Subir Archivo" modal="modalFile">
        <div className="modal-body">
          <div className="dropzone" style={{ height: "100%", width: "100%" }}>
            <Dropzone onDrop={onDrop} noClick={true} multiple={true}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    document.getElementsByName("file")[0].click();
                  }}
                  className={`dropzone-area border-primary rounded p-4 text-center ${
                    isDragActive ? "bg-primary text-white" : ""
                  }`}
                  style={{ height: "100px", border: "2px dashed #ced4da" }}
                >
                  <input {...getInputProps()} name="file" />
                  {filesToUpload.length > 0 ? (
                    <>
                      {filesToUpload.map((file, index) => (
                        <p key={index} className="mb-0">
                          <i className="fa-solid fa-file-upload"></i>{" "}
                          {file.name}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p className="mb-0">
                      {isDragActive
                        ? "Suelta los archivos aquí"
                        : "Haz clic o arrastra y suelta aquí los archivos que deseas subir"}
                    </p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <button className="btn btn-success mt-3" onClick={handleUpload}>
            <i className="fa-solid fa-upload"></i> Subir archivos
          </button>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-dark"
            data-bs-dismiss="modal"
            onClick={() => setFilesToUpload([])}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Files;
