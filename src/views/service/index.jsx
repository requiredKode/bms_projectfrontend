import React, { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import DivTextArea from '../../components/DivTextArea';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Service = () => {
  const history = useNavigate();

  const [services, setServices] = useState([]);
  const [id, setId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [code, setCode] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [descriptionService, setDescriptionService] = useState('');
  const [cost, setCost] = useState('');

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
    getService(1);
  }, []);

  const getService = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/service?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setServices(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable('');
      setClassLoad('d-none');
    } catch (error) {
      handleErrors(error);
    }
  };

  const deleteService = (id, name) => {
    confirmation(name, '/service/' + id, '/service');
  };

  const clear = () => {
    setCompanyId('');
    setCode('');
    setServiceName('');
    setDescriptionService('');
    setCost('');
  };

  const openModal = (OPERATION, ID, CODE, SERVICENAME, DESCRIPTIONSERVICE, COST) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nuevo Servicio');
    } else {
      setTitle('Actualizar Servicio');
      setCode(CODE);
      setServiceName(SERVICENAME);
      setDescriptionService(DESCRIPTIONSERVICE);
      setCost(COST);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/service' : '/service/' + id;
    const form = {
      code: code,
      serviceName: serviceName,
      descriptionService: descriptionService,
      cost: cost,
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
        getService(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getService(p);
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const limitDescriptionLength = 100;

  const truncateDescription = (description) => {
    if (!showFullDescription && description.length > limitDescriptionLength) {
      return `${description.slice(0, limitDescriptionLength)}...`;
    }
    return description;
  };

  // Función para manejar errores
  const handleErrors = (error) => {
    // Comprueba si la respuesta contiene el error NOT_SESSION
    if (error.response && error.response.data && error.response.data.error === 'NOT_SESSION') {
      // Redirige al usuario a la página de inicio de sesión y limpia el almacenamiento
      localStorage.clear(); // Esto eliminará todos los datos almacenados en el local storage
      history.push('/login'); // Cambia '/login' por la ruta real de tu página de inicio de sesión
    } else {
      // Manejar otros errores aquí si es necesario
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalService"
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
              <th>Codigo</th>
              <th>Servicio</th>
              <th>Descripcion</th>
              <th>Costo</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {services.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.code}</td>
                <td>{row.serviceName}</td>
                <td>
                  {truncateDescription(row.descriptionService)}
                  {row.descriptionService.length > limitDescriptionLength && (
                    <button
                      className="btn btn-link"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </td>
                <td>{row.cost}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalService"
                    onClick={() => openModal(2, row.id, row.code, row.serviceName, row.descriptionService, row.cost)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteService(row.id, row.serviceName)}
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
      <Modal title={title} modal="modalService">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-barcode"
              value={code}
              className="form-control"
              placeholder="Codigo"
              required="required"
              handleChange={(e) => setCode(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-handshake"
              value={serviceName}
              className="form-control"
              placeholder="Nombre del Servicio"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setServiceName(e.target.value)}
            />
            <DivTextArea
              placeholder="Descripcion del Servicio"
              id="descripcion"
              value={descriptionService}
              className="form-control"
              required={true}
              isFocused={true}
              handleChange={(e) => setDescriptionService(e.target.value)}
              icon="fa-circle-info"
            />
            <DivInput
              type="text"
              icon="fa-coins"
              value={cost}
              className="form-control"
              placeholder="Costo"
              required="required"
              handleChange={(e) => setCost(e.target.value)}
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

export default Service;
