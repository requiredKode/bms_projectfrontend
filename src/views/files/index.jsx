import { useEffect, useState } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import Modal from "../../components/Modal";
import { confirmation, sendRequest } from "../../functions";
import { useNavigate } from "react-router-dom";

// Importa Dropzone desde react-dropzone
import Dropzone from "react-dropzone";

const Files = () => {
  const history = useNavigate();

  const [files, setFiles] = useState([]);
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");

  let method = "";
  let url = "";

  useEffect(() => {
    getFile(1);
  }, []);

  const getFile = async () => {
    try {
      const res = await sendRequest("GET", "/files", "", "", "", true);
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
      history.push("/login");
    } else {
      console.error("Error en la solicitud:", error);
    }
  };

  const deleteFile = (id, name) => {
    confirmation(name, "/files/" + id, "/files");
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      console.error("No se ha seleccionado un archivo.");
      return;
    }

    const fileToUpload = acceptedFiles[0];
    console.log(fileToUpload);

    const formData = new FormData();
    formData.append("file", fileToUpload); // Añade el archivo con la clave "file"
    formData.append("fileName", fileToUpload.name);
    formData.append("fileType", fileToUpload.type);

    console.log("formData:");
    console.log(formData.get("file")); // Accede al archivo adjunto
    console.log(formData.get("fileName"));

    method = "POST";
    url = "/files";

    try {
      const res = await sendRequest(
        method,
        url,
        formData,
        "GUARDADO CON ÉXITO",
        ""
      );
      if (res.data) {
        getFile(1);
        // Otras acciones después de cargar el archivo, si es necesario
      }
    } catch (error) {
      handleErrors(error);
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
          <div className="dropzone">
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone-area">
                  <input {...getInputProps()} name="file" />
                  <p>
                    Arrastra y suelta archivos aquí, o haz clic para seleccionar
                    archivos
                  </p>
                </div>
              )}
            </Dropzone>
          </div>
          <div className="d-grid col-10 mx-auto">
            <button className="btn btn-success">
              <i className="fa-solid fa-upload"></i> Subir archivo
            </button>
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
