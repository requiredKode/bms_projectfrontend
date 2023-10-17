import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Gender = () => {
  const history = useNavigate();

  const [genders, setGenders] = useState([]);
  const [id, setId] = useState('');
  const [genderName, setGenderName] = useState('');

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
    getGender(1);
  }, []);

  const getGender = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/gender?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setGenders(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable('');
      setClassLoad('d-none');
    } catch (error) {
      handleErrors(error);
    }
  }

  const deleteGender = (id, name) => {
    confirmation(name, '/gender/' + id, '/gender');
  };

  const clear = () => {
    setGenderName('');
  };

  const openModal = (OPERATION, ID, GENDERNAME) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nuevo Género');
    } else {
      setTitle('Actualizar Género');
      setGenderName(GENDERNAME);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/gender' : '/gender/' + id;
    const form = {
      genderName: genderName
    };
    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON ÉXITO', '');
      if (method === 'PUT' && res.data && res.data.id !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.genderName !== null) {
        clear();
        setPage(1);
        getGender(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getGender(p);
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data && error.response.data.error === 'NOT_SESSION') {
      localStorage.clear();
      history.push('/login');
      return;
    }
    console.error('Error en la solicitud:', error);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalGender"
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
              <th>Género</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {genders.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.genderName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalGender"
                    onClick={() => openModal(2, row.id, row.genderName)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteGender(row.id, row.genderName)}
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
      <Modal title={title} modal="modalGender">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-venus-mars"
              value={genderName}
              className="form-control"
              placeholder="Género"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setGenderName(e.target.value)}
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

export default Gender;
