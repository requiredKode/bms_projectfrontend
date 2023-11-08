import { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "../../components/Modal";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import DivTextArea from "../../components/DivTextArea";
import { sendRequest } from "../../functions";

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [myAppointments, setMyAppointments] = useState([]);
  const [patientCases, setPatientCases] = useState([]);
  const [services, setServices] = useState([]);
  //const [companyId, setCompanyId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentEndDate, setAppointmentEndDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [title, setTitle] = useState("");

  const [isViewing, setIsViewing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  //const nameInputRef = useRef();
  const closeRef = useRef();

  let method = "";
  let url = "";

  useEffect(() => {
    const currentDate = moment().format("YYYY-MM-DDTHH:mm");
    setAppointmentDate(currentDate);
    setAppointmentEndDate(currentDate);
    fetchData("patientCase", setPatientCases);
    fetchData("service", setServices);
    fetchData("appointmentSchedule", setMyAppointments);
  }, []);

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

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    clear();
    setIsViewing(false);
    openModal();
  };

  const handleSelectEvent = (event) => {
    // Almacena los detalles del evento seleccionado
    setSelectedEvent(event);
    setIsViewing(true); // Cambia a la vista de visualización
    openModal();
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

  const clear = () => {
    setTitle("");
    setPatientId("");
    setServiceId("");
    setAppointmentDate(moment().format("YYYY-MM-DDTHH:mm"));
    setAppointmentEndDate(moment().format("YYYY-MM-DDTHH:mm"));
    setAppointmentNotes("");
  };

  const save = async (e) => {
    e.preventDefault();

    method = "POST";
    url = "/appointmentSchedule";
    const form = {
      companyId: "",
      patientId: patientId !== "" ? patientId : patientCases[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      serviceId: serviceId !== "" ? serviceId : services[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      appointmentDate: moment(selectedSlot?.start).format("YYYY-MM-DDTHH:mm"),
      appointmentEndDate: moment(selectedSlot?.end).format("YYYY-MM-DDTHH:mm"),
      appointmentNotes: appointmentNotes,
    };

    try {
      const res = await sendRequest(
        method,
        url,
        form,
        "GUARDADO CON EXITO",
        ""
      );
      if (method === "POST" && res.data && res.data.companyId !== null) {
        closeRef.current.click();

        // Aquí agregas el nuevo evento a myAppointments
        setMyAppointments((prevAppointments) => [
          ...prevAppointments,
          {
            id: res.data.id, // Debes adaptar esto según la estructura de tu respuesta
            title: res.data.appointmentNotes, // Utiliza appointmentNotes como título
            start: selectedSlot?.start,
            end: selectedSlot?.end,
            notes: appointmentNotes,
          },
        ]);
        // Además, asegúrate de ocultar el modal después de guardar
        setIsViewing(false);
        fetchData("appointmentSchedule", setMyAppointments); //recargo los eventos de nuevo despues de agregados
      }
      if (res.data && res.data.companyId !== null) {
        clear();
      }
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <Calendar
            style={{ height: "800px" }}
            defaultDate={new Date()}
            defaultView="month"
            events={myAppointments.map((appointment) => ({
              id: appointment.id, // o un identificador único
              title: appointment.service
                ? appointment.service.serviceName
                : "Servicio no definido", // Verificar si 'service' está definido
              patientCaseName: appointment.patientCase
                ? appointment.patientCase.patientCaseName +
                  " " +
                  appointment.patientCase.lastName +
                  " " +
                  appointment.patientCase.lastName2
                : "Paciente no definido",
              start: new Date(appointment.appointmentDate),
              end: new Date(appointment.appointmentEndDate),
              notes: appointment.appointmentNotes,
            }))}
            localizer={localizer}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
      <p data-bs-toggle="modal" data-bs-target="#addEventModal" hidden></p>
      <Modal
        title={isViewing ? "Detalles del Evento" : "Agregar Evento"} // Cambia el título según si se está viendo o creando un evento
        modal="addEventModal"
        ancho="md"
      >
        <div className="modal-body">
          {isViewing ? (
            <div>
              <h3>Detalles del Evento</h3>
              <div>
                <strong>Título:</strong> {selectedEvent.title}
              </div>
              <div>
                <strong>Paciente:</strong> {selectedEvent.patientCaseName}
              </div>
              <div>
                <strong>Fecha de Inicio:</strong>{" "}
                {moment(selectedEvent.start).format("DD/MM/yyyy hh:mm A")}
              </div>
              <div>
                <strong>Fecha de Finalización:</strong>{" "}
                {moment(selectedEvent.end).format("DD/MM/yyyy hh:mm A")}
              </div>
              <div>
                <strong>Notas:</strong> {selectedEvent.notes}
              </div>
            </div>
          ) : (
            // Si no estás viendo un evento, muestra el formulario de creación
            <form>
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
                  value={moment(selectedSlot?.start).format("YYYY-MM-DDTHH:mm")}
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
                  value={moment(selectedSlot?.end).format("YYYY-MM-DDTHH:mm")}
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
                <button className="btn btn-success" onClick={save}>
                  <i className="fa-solid fa-save"></i> Guardar
                </button>
              </div>
            </form>
          )}
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

export default Schedule;
