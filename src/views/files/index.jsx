import { useEffect, useState } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import Modal from "../../components/Modal";
import { confirmation, sendRequestWithFile } from "../../functions";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

const Files = () => {
  const history = useNavigate();
  const [files, setFiles] = useState([]);
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

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
    if (error.response && error.response.data && error.response.data.error === "NOT_SESSION") {
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

    const selectedFile = acceptedFiles[0];
    setFileToUpload(selectedFile);
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      console.error("No se ha seleccionado un archivo para cargar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("fileName", fileToUpload.name);
    formData.append("fileType", fileToUpload.type);

    try {
      await sendRequestWithFile("POST", "/files", formData, "GUARDADO CON ÉXITO", "");
      getFile();
      // Reinicia el estado después de cargar el archivo
      setFileToUpload(null);
    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalFile">
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
                  <button className="btn btn-danger" onClick={() => deleteFile(row.id, row.fileName)}>
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
          <div className="dropzone">
            <Dropzone onDrop={onDrop} noClick={true} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} className={`dropzone-area border-primary rounded p-3 text-center ${isDragActive ? "bg-primary text-white" : ""}`}>
                  <input {...getInputProps()} name="file" />
                  {fileToUpload ? (
                    <>
                      <p className="mb-0"><i className="fa-solid fa-file-upload"></i> {fileToUpload.name}</p>
                      <button className="btn btn-success mt-3" onClick={handleUpload}>
                        <i className="fa-solid fa-upload"></i> Subir archivo
                      </button>
                    </>
                  ) : (
                    <p className="mb-0">
                      {isDragActive ? "Suelta el archivo aquí" : "Arrastra y suelta aquí el archivo que deseas subir"}
                    </p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-dark" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Files;
