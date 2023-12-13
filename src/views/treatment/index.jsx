import React, { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import Modal from "../../components/Modal";
import { confirmation, sendRequest } from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";

const Treatment = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [treatments, setTreatments] = useState([]);
  const [id, setId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [treatmentName, setTreatmentName] = useState("");

  const [operation, setOperation] = useState("");
  const [title, setTitle] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  const nameInputRef = useRef();
  const closeRef = useRef();

  let method = "";
  let url = "";

  useEffect(() => {
    getTreatment(1);
  }, []);

  const getTreatment = async (page) => {
    try {
      const res = await sendRequest(
        "GET",
        `/treatment?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );
      setTreatments(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      // Comprueba si la respuesta contiene el error NOT_SESSION
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "NOT_SESSION"
      ) {
        // Redirige al usuario a la página de inicio de sesión y limpia el almacenamiento
        localStorage.clear(); // Esto eliminará todos los datos almacenados en el local storage
        history.push("/login"); // Cambia '/login' por la ruta real de tu página de inicio de sesión
        return;
      }

      // Manejar otros errores aquí si es necesario
      console.error("Error en la solicitud:", error);
    }
  };
  
  const deleteTreatment = (id, name) => {
    confirmation(name, "/treatment/" + id, "/treatment");
  };

  const clear = () => {
    setCompanyId("");
    setTreatmentName("");
  };

  const openModal = (OPERATION, ID, TREATMENTNAME) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle("Create Treatment");
    } else {
      setTitle("Update Treatment");
      setTreatmentName(TREATMENTNAME);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? "POST" : "PUT";
    url = operation === 1 ? "/treatment" : "/treatment/" + id;
    const form = {
      treatmentName: treatmentName,
    };
    if (operation === 1) {
      form.companyId = companyId;
    }
    try {
      const res = await sendRequest(
        method,
        url,
        form,
        "GUARDADO CON EXITO",
        ""
      );
      if (method === "PUT" && res.data && res.data.companyId !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.companyId !== null) {
        clear();
        setPage(1);
        getTreatment(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      // Manejar errores aquí si es necesario
    }
  };

  const goPage = (p) => {
    setPage(p);
    getTreatment(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalTreatment"
          onClick={() => openModal(1)}
        >
          <i className="fa-solid fa-circle-plus"></i> ADD
        </button>
      </DivAdd>
      <DivTable col="8" off="2" classLoad={classLoad} classTable={classTable}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {treatments.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.treatmentName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTreatment"
                    onClick={() => openModal(2, row.id, row.treatmentName)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTreatment(row.id, row.treatmentName)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DivTable>
      <PaginationControl
        changePage={(page) => goPage(page)}
        next={true}
        limit={pageSize}
        page={page}
        total={rows}
      />
      <Modal title={title} modal="modalTreatment">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-user"
              value={treatmentName}
              className="form-control"
              placeholder="Tratamiento"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setTreatmentName(e.target.value)}
            />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> SAVE
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-dark"
            data-bs-dismiss="modal"
            ref={closeRef}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Treatment;
