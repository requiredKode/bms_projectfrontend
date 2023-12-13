import React, { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import DivTextArea from "../../components/DivTextArea";
import moment from "moment";
import Modal from "../../components/Modal";
import { confirmation, sendRequest } from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";

const AppointmentSchedule = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [appointmentSchedules, setAppointmentSchedules] = useState([]);
  const [patientCaseFilter, setPatientCaseFilter] = useState("");

  const [patientCases, setPatientCases] = useState([]);
  const [services, setServices] = useState([]);
  const [id, setId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentEndDate, setAppointmentEndDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

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
    const currentDate = moment().format("YYYY-MM-DDTHH:mm");
    setAppointmentDate(currentDate);
    setAppointmentEndDate(currentDate);
    fetchData("patientCase", setPatientCases);
    fetchData("service", setServices);
    getAppointmentSchedule(1);
  }, []);

  useEffect(() => {
    getAppointmentSchedule(1);
  }, [page, pageSize, patientCaseFilter]);

  
  const getAppointmentSchedule = async (page) => {
    try {
      let endpoint = `/appointmentSchedule?page=${page}&per_page=${pageSize}`;
      
      if (patientCaseFilter) {
        endpoint += `&patientCaseName=${patientCaseFilter}`;
      }
  
      const res = await sendRequest("GET", endpoint, "", "", "", true);
      
      setAppointmentSchedules(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };
  const fetchData = async (endpoint, setter) => {
    try {
      const res = await sendRequest(
        "GET",
        `/${endpoint}?page=${1}&per_page=${100}`,
        "",
        "",
        "",
        true
      );
      setter(res.data);
    } catch (error) {
      handleErrors(error);
    }
  };

  const deleteAppointmentSchedule = (id, name) => {
    confirmation(
      "la cita del paciente " + name,
      "/appointmentSchedule/" + id,
      "/appointmentSchedule"
    );
  };

  const clear = () => {
    setCompanyId("");
    setPatientId("");
    setServiceId("");
    setAppointmentNotes("");
  };

  const openModal = (
    OPERATION,
    ID,
    PATIENTID,
    SERVICEID,
    APPOINTMENTDATE,
    APPOINTMENTENDDATE,
    APPOINTMENTNOTES
  ) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle("Nueva Cita");
    } else {
      setTitle("Actualizar Cita");
      setPatientId(PATIENTID);
      setServiceId(SERVICEID);
      setAppointmentDate(APPOINTMENTDATE);
      setAppointmentEndDate(APPOINTMENTENDDATE);
      setAppointmentNotes(APPOINTMENTNOTES);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? "POST" : "PUT";
    url =
      operation === 1 ? "/appointmentSchedule" : "/appointmentSchedule/" + id;
    const form = {
      patientId: patientId !== "" ? patientId : patientCases[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      serviceId: serviceId !== "" ? serviceId : services[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      appointmentDate: appointmentDate,
      appointmentEndDate: appointmentEndDate,
      appointmentNotes: appointmentNotes,
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
        getAppointmentSchedule(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getAppointmentSchedule(p);
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

  const [showFullDescription, setShowFullDescription] = useState(false);
  const limitDescriptionLength = 100;

  const truncateDescription = (description) => {
    if (!showFullDescription && description.length > limitDescriptionLength) {
      return `${description.slice(0, limitDescriptionLength)}...`;
    }
    return description;
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalAppointmentSchedule"
          onClick={() => openModal(1)}
        >
          <i className="fa-solid fa-circle-plus"></i> Agregar
        </button>
      </DivAdd>
      <DivTable col="8" off="2" classLoad={classLoad} classTable={classTable}><div className="mb-3">
  <label htmlFor="patientCaseFilter" className="form-label">
    Filtrar por Nombre del Paciente
  </label>
  <DivInput
    type="text"
    icon="fa-search"
    value={patientCaseFilter}
    className="form-control"
    placeholder="Nombre del Paciente"
    handleChange={(e) => setPatientCaseFilter(e.target.value)}
  />
</div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Paciente</th>
              <th>Servicio</th>
              <th>Fecha Inicial de la Cita</th>
              <th>Fecha Final de la Cita</th>
              <th>Nota Adicional</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {appointmentSchedules.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>
                  {row.patientCase.patientCaseName +
                    " " +
                    row.patientCase.lastName +
                    " " +
                    row.patientCase.lastName2}
                </td>
                <td>{row.service.serviceName}</td>
                <td>
                  {moment(row.appointmentDate).format("DD/MM/yyyy hh:mm A")}
                </td>
                <td>
                  {moment(row.appointmentEndDate).format("DD/MM/yyyy hh:mm A")}
                </td>
                <td>
                  {truncateDescription(row.appointmentNotes)}
                  {row.appointmentNotes.length > limitDescriptionLength && (
                    <button
                      className="btn btn-link"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                    >
                      {showFullDescription ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalAppointmentSchedule"
                    onClick={() =>
                      openModal(
                        2,
                        row.id,
                        row.patientId,
                        row.serviceId,
                        row.appointmentDate,
                        row.appointmentEndDate,
                        row.appointmentNotes
                      )
                    }
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deleteAppointmentSchedule(
                        row.id,
                        row.patientCase.patientCaseName +
                          " " +
                          row.patientCase.lastName +
                          " " +
                          row.patientCase.lastName2
                      )
                    }
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
      <Modal title={title} modal="modalAppointmentSchedule">
        <div className="modal-body">
          <form onSubmit={save}>
            <div className="mb-3">
              <label htmlFor="patientId" className="form-label">
                Paciente
              </label>
              <DivSelect
                icon="fa-user"
                name="patientId"
                value={patientId}
                className="form-select"
                options={patientCases.map((patient) => ({
                  id: patient.id,
                  label: `${patient.patientCaseName} ${patient.lastName} ${patient.lastName2}`,
                }))}
                handleChange={(e) => setPatientId(e.target.value)}
                displayProperty="label"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="serviceId" className="form-label">
                Servicio
              </label>
              <DivSelect
                icon="fa-handshake"
                name="serviceId"
                value={serviceId}
                className="form-select"
                options={services}
                handleChange={(e) => setServiceId(e.target.value)}
                displayProperty="serviceName"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="appointmentDate" className="form-label">
                Fecha y Hora Inicial de la Cita
              </label>
              <DivInput
                type="datetime-local"
                icon="fa-calendar"
                value={moment(appointmentDate).format("YYYY-MM-DDTHH:mm")}
                className="form-control"
                placeholder="Fecha Inicio"
                handleChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="appointmentEndDate" className="form-label">
                Fecha y Hora Final de la Cita
              </label>
              <DivInput
                type="datetime-local"
                icon="fa-calendar"
                value={moment(appointmentEndDate).format("YYYY-MM-DDTHH:mm")}
                className="form-control"
                placeholder="Fecha Inicio"
                handleChange={(e) => setAppointmentEndDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="appointmentNotes" className="form-label">
                Notas de la Cita
              </label>
              <DivTextArea
                type="text"
                icon="fa-pencil"
                value={appointmentNotes}
                className="form-control"
                placeholder="Notas de la Cita"
                handleChange={(e) => setAppointmentNotes(e.target.value)}
              />
            </div>
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> Guardar
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
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentSchedule;
