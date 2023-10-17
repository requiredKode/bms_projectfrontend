import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Supplier = () => {
  const history = useNavigate(); // Instancia de useHistory

  // Estado para almacenar la lista de proveedores
  const [suppliers, setSuppliers] = useState([]);
  // Estados para el formulario y la edición
  const [id, setId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [operation, setOperation] = useState('');
  const [title, setTitle] = useState('');
  // Estados para la paginación y carga
  const [classLoad, setClassLoad] = useState('');
  const [classTable, setClassTable] = useState('d-none');
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  // Referencias a elementos del DOM
  const nameInputRef = useRef();
  const closeRef = useRef();

  let method = '';
  let url = '';

  useEffect(() => {
    getSupplier(1);
  }, []);

  // Función para obtener la lista de proveedores
  const getSupplier = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/supplier?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setSuppliers(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable('');
      setClassLoad('d-none');
    } catch (error) {
      handleErrors(error);
    }
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

  // Función para eliminar un proveedor
  const deleteSupplier = (id, name) => {
    confirmation(name, '/supplier/' + id, '/supplier');
  };

  // Función para limpiar el formulario
  const clear = () => {
    setSupplierName('');
  };

  // Función para abrir el modal de edición o creación
  const openModal = (OPERATION, ID, SUPPLIERNAME) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nuevo Proveedor');
    } else {
      setTitle('Actualizar Proveedor');
      setSupplierName(SUPPLIERNAME);
    }
  };

  // Función para guardar un proveedor
  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/supplier' : '/supplier/' + id;
    const form = {
      supplierName: supplierName
    };

    try {
      const res = await sendRequest(method, url, form, 'GUARDADO CON EXITO', '');
      if (method === 'PUT' && res.data && res.data.id !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.supplierName !== null) {
        clear();
        setPage(1);
        getSupplier(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  // Función para cambiar de página
  const goPage = (p) => {
    setPage(p);
    getSupplier(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalSupplier"
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
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {suppliers.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.supplierName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalSupplier"
                    onClick={() => openModal(2, row.id, row.supplierName)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteSupplier(row.id, row.supplierName)}
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
      <Modal title={title} modal="modalSupplier">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-truck-field"
              value={supplierName}
              className="form-control"
              placeholder="Proveedor"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setSupplierName(e.target.value)}
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

export default Supplier;
