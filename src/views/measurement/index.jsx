import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Company = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [companies, setCompanies] = useState([]);
  const [id, setId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [countryId, setCountryId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebSite] = useState('');
  const [description, setDescription] = useState('');

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
    getCompany(1);
  }, []);

  const getCompany = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/company?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setCompanies(res.data);
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
  
  const deleteCompany = (id, name) => {
    confirmation(name, '/company/' + id, '/company');
  };

  const clear = () => {
    setCompanyName('');
    setAddress('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountryId('');
    setPhoneNumber('');
    setEmail('');
    setWebSite('');
    setDescription('');
  };

  const openModal = (OPERATION, ID, COMPANYNAME, ADDRESS, CITY, STATE, POSTALCODE, COUNTRYID, PHONENUMBER, EMAIL, WEBSITE, DESCRIPTION) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nueva Empresa');
    } else {
      setTitle('Actualizar Empresa');
      setCompanyName(COMPANYNAME);
      setAddress(ADDRESS);
      setCity(CITY);
      setState(STATE);
      setPostalCode(POSTALCODE);
      setCountryId(COUNTRYID);
      setPhoneNumber(PHONENUMBER);
      setEmail(EMAIL);
      setWebSite(WEBSITE);
      setDescription(DESCRIPTION);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/company' : '/company/' + id;
    const form = {
      companyName: companyName,
      address: address,
      city: city,
      state: state,
      postalCode: postalCode,
      countryId: countryId,
      phoneNumber: phoneNumber,
      email: email,
      website: website,
      description: description,
    };
    
    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON EXITO', '');
      if (method === 'PUT' && res.data && res.data.id !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.id !== null) {
        clear();
        setPage(1);
        getCompany(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      // Manejar errores aquí si es necesario
    }
  };

  const goPage = (p) => {
    setPage(p);
    getCompany(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalCompany"
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
                <td>{row.descriptionService}</td>
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
              icon="fa-code"
              value={code}
              className="form-control"
              placeholder="Code"
              required="required"
              handleChange={(e) => setCode(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-user"
              value={serviceName}
              className="form-control"
              placeholder="Service Name"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setServiceName(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-info"
              value={descriptionService}
              className="form-control"
              placeholder="Description Service"
              required="required"
              handleChange={(e) => setDescriptionService(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-dollar"
              value={cost}
              className="form-control"
              placeholder="Cost"
              required="required"
              handleChange={(e) => setCost(e.target.value)}
            />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> SAVE
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-dark" data-bs-dismiss="modal" ref={closeRef}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Company;
