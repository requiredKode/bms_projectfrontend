import React, { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Disease = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [diseases, setDiseases] = useState([]);
  const [id, setId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [diseaseName, setDiseaseName] = useState('');

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
    getDisease(1);
  }, []);

  const getDisease = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/disease?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setDiseases(res.data); // todos los datos
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

  const deleteDisease = (id, name) => {
    confirmation(name, '/disease/' + id, '/disease');
  };

  const clear = () => {
    setCompanyId('');
    setDiseaseName('');
  };

  const openModal = (OPERATION, ID, DISEASENAME) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Create Disease');
    } else {
      setTitle('Update Disease');
      setDiseaseName(DISEASENAME);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/disease' : '/disease/' + id;
    const form = {
      diseaseName: diseaseName
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
        getDisease(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      // Manejar errores aquí si es necesario
    }
  };

  const goPage = (p) => {
    setPage(p);
    getDisease(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalDisease"
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
              <th>Enfermedad</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {diseases.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.diseaseName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalDisease"
                    onClick={() => openModal(2, row.id, row.diseaseName)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteDisease(row.id, row.diseaseName)}
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
      <Modal title={title} modal="modalDisease">
        <div className="modal-body">
          <form onSubmit={save}>
            
            <DivInput
              type="text"
              icon="fa-user"
              value={diseaseName}
              className="form-control"
              placeholder="Enfermedad"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setDiseaseName(e.target.value)}
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

export default Disease;