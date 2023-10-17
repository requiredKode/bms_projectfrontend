import { useEffect, useState, useRef } from 'react';
import DivAdd from '../../components/DivAdd';
import DivTable from '../../components/DivTable';
import DivInput from '../../components/DivInput';
import Modal from '../../components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [users, setUsers] = useState([]);
  const [id, setId] = useState('');
  const [companyId, setCompanyId] = useState('');  
  const [countryId, setCountryId] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [identityCardTypeId, setIdentityCardTypeId] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [genderId, setGenderId] = useState('');
  const [profession, setProfession] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [isActive, setIsActive] = useState('');

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
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    try {
      const res = await sendRequest(
        'GET',
        `/users?page=${page}&per_page=${pageSize}`,
        '',
        '',
        '',
        true
      );
      setUsers(res.data);
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
  
  const deleteUsers = (id, name) => {
    confirmation(name, '/users/' + id, '/users');
  };

  const clear = () => {
    setCompanyId('');  
    setCountryId('');
    setName('');
    setLastName('');
    setLastName2('');
    setIdentityCardTypeId('');
    setIdentityCard('');
    setGenderId('');
    setProfession('');
    setDateOfBirth('');
    setPhoneNumber('');
    setPhoneNumber2('');
    setCity('');
    setAddress('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRol('');
    setIsActive('');
  };

  const openModal = (OPERATION, ID, COUNTRYID, NAME, LASTNAME, LASTNAME2, IDENTITYCARDTYPEID, IDENTITYCARD, GENDERID, PROFESSION, DATEOFBIRTH, PHONENUMBER, PHONENUMBER2, CITY, ADDRESS, EMAIL, USERNAME, PASSWORD, ROL, ISACTIVE) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle('Nuevo Usuario');
    } else {
      setTitle('Actualizar Usuario');
      setCountryId(COUNTRYID);
      setName(NAME);
      setLastName(LASTNAME);
      setLastName2(LASTNAME2);
      setIdentityCardTypeId(IDENTITYCARDTYPEID);
      setIdentityCard(IDENTITYCARD);
      setGenderId(GENDERID);
      setProfession(PROFESSION);
      setDateOfBirth(DATEOFBIRTH);
      setPhoneNumber(PHONENUMBER);
      setPhoneNumber2(PHONENUMBER2);
      setCity(CITY);
      setAddress(ADDRESS);
      setEmail(EMAIL);
      setUsername(USERNAME);
      setPassword(PASSWORD);
      setRol(ROL);
      setIsActive(ISACTIVE);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? 'POST' : 'PUT';
    url = operation === 1 ? '/users' : '/users/' + id;
    const form = {
      countryId: countryId,
      name: name,
      lastName: lastName,
      lastName2: lastName2,
      identityCardTypeId: identityCardTypeId,
      identityCard: identityCard,
      genderId: genderId,
      profession: profession,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
      phoneNumber2: phoneNumber2,
      city: city,
      address: address,
      email: email,
      username: username,
      password: password,
      rol: rol,
      isActive: isActive,
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
        getUsers(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      // Manejar errores aquí si es necesario
    }
  };

  const goPage = (p) => {
    setPage(p);
    getUsers(p);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalUsers"
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
              <th>Nombre</th>
              <th>Identificacion</th>
              <th>Numero de Telefono</th>
              <th>Ciudad</th>
              <th>Email</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.name +' '+ row.lastName +' '+ row.lastName2}</td>
                <td>{row.identityCard}</td>
                <td>{row.phoneNumber}</td>
                <td>{row.city}</td>
                <td>{row.email}</td>
                <td>{row.isActive}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUsers"
                    onClick={() => openModal(2, row.id, row.name, row.lastName, row.lastName2, row.identityCardTypeId, row.identityCard, row.genderId, row.profession, row.dateOfBirth, row.phoneNumber, row.phoneNumber2, row.countryId, row.city, row.address, row.email, row.username, row.isActive)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUsers(row.id, row.name)}
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
      <Modal title={title} modal="modalUsers">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-user"
              value={name}
              className="form-control"
              placeholder="Nombre"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setName(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-user"
              value={lastName}
              className="form-control"
              placeholder="Primer Apellido"
              required="required"
              handleChange={(e) => setLastName(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-user"
              value={lastName2}
              className="form-control"
              placeholder="Segundo Apellido"
              required="required"
              handleChange={(e) => setLastName2(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-id"
              value={identityCardTypeId}
              className="form-control"
              placeholder="Eligen una opcion"
              required="required"
              handleChange={(e) => setIdentityCardTypeId(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-id"
              value={identityCard}
              className="form-control"
              placeholder="Identificacion"
              required="required"
              handleChange={(e) => setIdentityCard(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-gender"
              value={genderId}
              className="form-control"
              placeholder="Elige un genero"
              required="required"
              handleChange={(e) => setGenderId(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-job"
              value={profession}
              className="form-control"
              placeholder="Profesion"
              required="required"
              handleChange={(e) => setProfession(e.target.value)}
            />
            <DivInput
              type="date"
              icon="fa-calendar"
              value={dateOfBirth}
              className="form-control"
              placeholder="Fecha Nacimiento"
              required="required"
              handleChange={(e) => setDateOfBirth(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-phone"
              value={phoneNumber}
              className="form-control"
              placeholder="Numero Telefono"
              required="required"
              handleChange={(e) => setPhoneNumber(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-phone"
              value={phoneNumber2}
              className="form-control"
              placeholder="Numero Telefono Adicional"
              required="required"
              handleChange={(e) => setPhoneNumber2(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-world"
              value={countryId}
              className="form-control"
              placeholder="Elige una opcion"
              required="required"
              handleChange={(e) => setCountryId(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-world"
              value={city}
              className="form-control"
              placeholder="Cuidad"
              required="required"
              handleChange={(e) => setCity(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-address"
              value={address}
              className="form-control"
              placeholder="Direccion"
              required="required"
              handleChange={(e) => setAddress(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-at"
              value={email}
              className="form-control"
              placeholder="Correo Electronico"
              required="required"
              handleChange={(e) => setEmail(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-user"
              value={username}
              className="form-control"
              placeholder="Username"
              required="required"
              handleChange={(e) => setUsername(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-key"
              value={password}
              className="form-control"
              placeholder="Password"
              required="required"
              handleChange={(e) => setPassword(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-role"
              value={rol}
              className="form-control"
              placeholder="Rol"
              required="required"
              handleChange={(e) => setRol(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-active"
              value={isActive}
              className="form-control"
              placeholder="Activo"
              required="required"
              handleChange={(e) => setIsActive(e.target.value)}
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

export default Users;
