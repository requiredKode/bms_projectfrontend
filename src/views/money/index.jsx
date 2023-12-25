import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Money = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [moneys, setMoneys] = useState([]);
  const [id, setId] = useState('');
  const [moneyName, setMoneyName] = useState('');
  const [moneyCode, setMoneyCode] = useState('');
  const [moneySymbol, setMoneySymbol] = useState('');
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
    getMoney(1);
  }, []);

  const getMoney = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/money?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setMoneys(res.data);
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

  const deleteMoney = (id, name) => {
    confirmation(name, '/money/' + id, '/money');
  };

  const clear = () => {
    setMoneyName('');
    setMoneyCode('');
    setMoneySymbol('');
  };

  const openModal = (OPERATION, ID, MONEYNAME, MONEYCODE, MONEYSYMBOL) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nueva Moneda');
    } else {
      setTitle('Actualizar Moneda');
      setMoneyName(MONEYNAME);
      setMoneyCode(MONEYCODE);
      setMoneySymbol(MONEYSYMBOL);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/money' : '/money/' + id;
    const form = {
      moneyName: moneyName,
      moneyCode: moneyCode,
      moneySymbol: moneySymbol
    };

    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON EXITO', '');
      if (method === 'PUT' && res.data && res.data.id !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.moneyName !== null) {
        clear();
        setPage(1);
        getMoney(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getMoney(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalMoney"
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
              <th>Moneda</th>
              <th>Codigo</th>
              <th>Simbolo</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {moneys.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.moneyName}</td>
                <td>{row.moneyCode}</td>
                <td>{row.moneySymbol}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalMoney"
                    onClick={() => openModal(2, row.id, row.moneyName, row.moneyCode, row.moneySymbol)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteMoney(row.id, row.moneyName)}
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
      <Modal title={title} modal="modalMoney">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-coins"
              value={moneyName}
              className="form-control"
              placeholder="Moneda"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setMoneyName(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-coins"
              value={moneyCode}
              className="form-control"
              placeholder="Codigo Moneda"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setMoneyCode(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-coins"
              value={moneySymbol}
              className="form-control"
              placeholder="Simbolo Moneda"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setMoneySymbol(e.target.value)}
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

export default Money;
