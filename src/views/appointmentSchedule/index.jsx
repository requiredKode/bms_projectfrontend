import React, { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const AppointmentSchedule = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [appointmentSchedules, setAppointmentSchedules] = useState([]);
  const [id, setId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [operation, setOperation] = useState('');
  const [title, setTitle] = useState('');
  const [classLoad, setClassLoad] = useState('');
  const [classTable, setClassTable] = useState('d-none');
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  const nameInputRef = useRef();
  const closeRef = useRef();

  let method = '';
  let url = '';

  useEffect(() => {
    getAppointmentSchedule(1);
  }, []);

  const getAppointmentSchedule = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/appointmentSchedule?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setAppointmentSchedules(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable('');
      setClassLoad('d-none');
    } catch (error) {
      // Comprueba si la respuesta contiene el error NOT_SESSION
      if (error.response && error.response.data && error.response.data.error === 'NOT_SESSION') {
        // Redirige al usuario a la página de inicio de sesión y limpia el almacenamiento
        localStorage.clear(); // Esto eliminará todos los datos almacenados en el local storage
        history.push('/login'); // Cambia '/login' por la ruta real de tu página de inicio de sesión
        return;
      }
  
      // Manejar otros errores aquí si es necesario
      console.error('Error en la solicitud:', error);
  }
  }
  
  const deleteAppointmentSchedule = (id, name) => {
    confirmation(name, '/appointmentSchedule/' + id, '/appointmentSchedule');
  };

  const clear = () => {
    setCompanyId('');
    setPatientId('');
    setServiceId('');
    setAppointmentDate('');
    setAppointmentNotes('');
  };

  const openModal = (OPERATION, ID, PATIENTID, SERVICEID, APPOINTMENTDATE, APPOINTMENTNOTES) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nueva Cita');
    } else {
      setTitle('Actualizar Cita');
      setPatientId(PATIENTID);
      setServiceId(SERVICEID);
      setAppointmentDate(APPOINTMENTDATE);
      setAppointmentNotes(APPOINTMENTNOTES);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/appointmentSchedule' : '/appointmentSchedule/' + id;
    const form = {
      patientId: patientId,
      serviceId: serviceId,
      appointmentDate: appointmentDate,
      appointmentNotes: appointmentNotes,
    };
    if (operation === 1) {
      form.companyId = companyId;
    }
    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON EXITO', '');
      if (method === 'PUT' && res.data && res.data.companyId !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.companyId !== null) {
        clear();
        setPage(1);
        getAppointmentSchedule(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      // Manejar errores aquí si es necesario
    }
  };

  const goPage = (p) => {
    setPage(p);
    getAppointmentSchedule(p);
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
      <DivTable col="8" off="2" classLoad={classLoad} classTable={classTable}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Paciente</th>
              <th>Servicio</th>
              <th>Fecha de la Cita</th>
              <th>Nota Adicional</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {appointmentSchedules.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.patientId}</td>
                <td>{row.serviceId}</td>
                <td>{row.appointmentDate}</td>
                <td>{row.appointmentNotes}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalAppointmentSchedule"
                    onClick={() => openModal(2, row.id, row.patientId, row.serviceId, row.appointmentDate, row.appointmentNotes)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteAppointmentSchedule(row.id, row.appointmentDate)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DivTable>
      <PaginationControl changePage={page => goPage(page)} next={true} limit={pageSize} page={page} total={rows} />
      <Modal title={title} modal="modalAppointmentSchedule">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-user"
              value={patientId}
              className="form-control"
              placeholder="Paciente"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setPatientId(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-handshake"
              value={serviceId}
              className="form-control"
              placeholder="Servicio"
              required="required" 
              handleChange={(e) => setServiceId(e.target.value)}
            />
            <DivInput
              type="date"
              icon="fa-calendar-days"
              value={appointmentDate}
              className="form-control"
              placeholder="Fecha Cita"
              required="required"
              handleChange={(e) => setAppointmentDate(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-note-sticky"
              value={appointmentNotes}
              className="form-control"
              placeholder="Nota Adicional"
              required="required"
              handleChange={(e) => setAppointmentNotes(e.target.value)}
            />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> Guardar
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-dark" data-bs-dismiss="modal" ref={closeRef}>
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentSchedule;
