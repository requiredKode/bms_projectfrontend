import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Country = () => {
  const history = useNavigate();

  const [countries, setCountries] = useState([]);
  const [id, setId] = useState('');
  const [countryName, setCountryName] = useState('');

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
    getCountry(1);
  }, []);

  const getCountry = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/country?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setCountries(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable('');
      setClassLoad('d-none');
    } catch (error) {
      handleErrors(error);
    }
  }

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

  const deleteCountry = (id, name) => {
    confirmation(name, '/country/' + id, '/country');
  };

  const clear = () => {
    setCountryName('');
  };

  const openModal = (OPERATION, ID, COUNTRYNAME) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nuevo País');
    } else {
      setTitle('Actualizar País');
      setCountryName(COUNTRYNAME);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/country' : '/country/' + id;
    const form = {
      countryName: countryName
    };

    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON EXITO', '');
      if (method === 'PUT' && res.data && res.data.id !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.countryName !== null) {
        clear();
        setPage(1);
        getCountry(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getCountry(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalCountry"
          onClick={() => openModal(1)}
        >
          <i className="fa-solid fa-circle-plus"></i> Agregar
        </button>
      </DivAdd>
      <DivTable col="6" off="3" classLoad={classLoad} classTable={classTable}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {countries.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.countryName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCountry"
                    onClick={() => openModal(2, row.id, row.countryName)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCountry(row.id, row.countryName)}
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
      <Modal title={title} modal="modalCountry">
        <div className="modal-body">
          <form onSubmit={save}>
            
            <DivInput
              type="text"
              icon="fa-solid fa-earth-americas"
              value={countryName}
              className="form-control"
              placeholder="País"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setCountryName(e.target.value)}
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

export default Country;
