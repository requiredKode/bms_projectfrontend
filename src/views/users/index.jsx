import { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import Checkbox from "../../components/DivCheckBox";
import Modal from "../../components/Modal";
import { getCurrentDate, confirmation, sendRequest } from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [users, setUsers] = useState([]);
  const [identityCardTypes, setIdentityCardTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [identityCardTypeId, setIdentityCardTypeId] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [genderId, setGenderId] = useState("");
  const [profession, setProfession] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [senderEmailPass, setSenderEmailPass] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [isActive, setIsActive] = useState("");

  const [operation, setOperation] = useState("");
  const [title, setTitle] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  const nameInputRef = useRef();
  const closeRef = useRef();

  let method = "";
  let url = "";

  useEffect(() => {
    const currentDate = getCurrentDate();
    setDateOfBirth(currentDate);
    fetchData("identityCard", setIdentityCardTypes);
    fetchData("gender", setGenders);
    fetchData("country", setCountries);
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    try {
      const res = await sendRequest(
        "GET",
        `/users?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );
      setUsers(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      // Comprueba si la respuesta contiene el error NOT_SESSION
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "NOT_SESSION"
      ) {
        // Redirige al usuario a la página de inicio de sesión y limpia el almacenamiento
        localStorage.clear(); // Esto eliminará todos los datos almacenados en el local storage
        history.push("/login"); // Cambia '/login' por la ruta real de tu página de inicio de sesión
        return;
      }

      // Manejar otros errores aquí si es necesario
      console.error("Error en la solicitud:", error);
    }
  };

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

  const deleteUsers = (id, name) => {
    confirmation(name, "/users/" + id, "/users");
  };

  const clear = () => {
    setCompanyId("");
    setCountryId("");
    setName("");
    setLastName("");
    setLastName2("");
    setIdentityCardTypeId("");
    setIdentityCard("");
    setGenderId("");
    setProfession("");
    setPhoneNumber("");
    setPhoneNumber2("");
    setCity("");
    setAddress("");
    setEmail("");
    setSenderEmailPass("");
    setUsername("");
    setPassword("");
    setRol("");
    setIsActive("");
  };

  const openModal = (
    OPERATION,
    ID,
    NAME,
    LASTNAME,
    LASTNAME2,
    IDENTITYCARDTYPEID,
    IDENTITYCARD,
    GENDERID,
    PROFESSION,
    DATEOFBIRTH,
    PHONENUMBER,
    PHONENUMBER2,
    COUNTRYID,
    CITY,
    ADDRESS,
    EMAIL,
    SENDEREMAILPASS,
    USERNAME,
    PASSWORD,
    ROL,
    ISACTIVE
  ) => {
    clear();
    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle("Nuevo Usuario");
    } else {
      setTitle("Actualizar Usuario");
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
      setSenderEmailPass(SENDEREMAILPASS);
      setUsername(USERNAME);
      setPassword(PASSWORD);
      setRol(ROL);
      setIsActive(ISACTIVE);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? "POST" : "PUT";
    url = operation === 1 ? "/users" : "/users/" + id;
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
      senderEmailPass: senderEmailPass,
      username: username,
      password: password,
      rol: rol,
      isActive: isActive,
    };
    if (operation === 1) {
      form.companyId = companyId;
    }
    try {
      const res = await sendRequest(
        method,
        url,
        form,
        "GUARDADO CON EXITO",
        ""
      );
      if (method === "PUT" && res.data && res.data.companyId !== null) {
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
              <th>Estado</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.name + " " + row.lastName + " " + row.lastName2}</td>
                <td>{row.identityCard}</td>
                <td>{row.phoneNumber}</td>
                <td>{row.city}</td>
                <td>{row.email}</td>
                <td>
                  {row.isActive ? (
                    <span
                      style={{
                        border: "1px solid green",
                        padding: "2px",
                        borderRadius: "5px",
                        backgroundColor: "green",
                        color: "white",
                      }}
                    >
                      Activo
                    </span>
                  ) : (
                    <span
                      style={{
                        border: "1px solid yellow",
                        padding: "2px",
                        borderRadius: "5px",
                        backgroundColor: "yellow",
                      }}
                    >
                      Inactivo
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUsers"
                    onClick={() =>
                      openModal(
                        2,
                        row.id,
                        row.name,
                        row.lastName,
                        row.lastName2,
                        row.identityCardTypeId,
                        row.identityCard,
                        row.genderId,
                        row.profession,
                        row.dateOfBirth,
                        row.phoneNumber,
                        row.phoneNumber2,
                        row.countryId,
                        row.city,
                        row.address,
                        row.email,
                        row.senderEmailPass,
                        row.username,
                        row.password,
                        row.rol,
                        row.isActive
                      )
                    }
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
      <PaginationControl
        changePage={(page) => goPage(page)}
        next={true}
        limit={pageSize}
        page={page}
        total={rows}
      />
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
            <DivSelect
              icon="fa-address-card"
              name="identityCardTypeId"
              value={identityCardTypeId}
              className="form-select"
              options={identityCardTypes}
              handleChange={(e) => setIdentityCardTypeId(e.target.value)}
              displayProperty="identityCardName"
            />
            <DivInput
              type="text"
              name="identityCard"
              icon="fa-id-card"
              value={identityCard}
              className="form-control"
              placeholder="Identificacion"
              handleChange={(e) => setIdentityCard(e.target.value)}
            />
            <DivSelect
              icon="fa-venus-mars"
              name="genderId"
              required="required"
              value={genderId}
              className="form-select"
              options={genders}
              handleChange={(e) => setGenderId(e.target.value)}
              displayProperty="genderName"
            />
            <DivInput
              type="text"
              name="profession"
              icon="fa-briefcase"
              value={profession}
              className="form-control"
              placeholder="Profesion"
              handleChange={(e) => setProfession(e.target.value)}
            />
            <DivInput
              type="date"
              name="dateOfBirth"
              icon="fa-cake"
              value={dateOfBirth}
              className="form-control"
              placeholder="Fecha Nacimiento"
              handleChange={(e) => setDateOfBirth(e.target.value)}
            />
            <DivInput
              type="text"
              name="phoneNumber"
              icon="fa-phone"
              value={phoneNumber}
              className="form-control"
              placeholder="Numero Telefono"
              handleChange={(e) => setPhoneNumber(e.target.value)}
            />
            <DivInput
              type="text"
              name="phoneNumber2"
              icon="fa-mobile-screen-button"
              value={phoneNumber2}
              className="form-control"
              placeholder="Numero Telefono Adicional"
              handleChange={(e) => setPhoneNumber2(e.target.value)}
            />
            <DivSelect
              icon="fa-earth-americas"
              name="countryId"
              value={countryId}
              className="form-select"
              options={countries}
              handleChange={(e) => setCountryId(e.target.value)}
              displayProperty="countryName"
            />
            <DivInput
              type="text"
              name="city"
              icon="fa-city"
              value={city}
              className="form-control"
              placeholder="Cuidad"
              handleChange={(e) => setCity(e.target.value)}
            />
            <DivInput
              type="text"
              name="address"
              icon="fa-location-dot"
              value={address}
              className="form-control"
              placeholder="Direccion"
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
              icon="fa-at"
              value={senderEmailPass}
              className="form-control"
              placeholder="Email Pass"
              required="required"
              handleChange={(e) => setSenderEmailPass(e.target.value)}
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
              type="password"
              name="password"
              icon="fa-key"
              value={password}
              className="form-control"
              placeholder="Password"
              handleChange={(e) => setPassword(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-computer"
              value={rol}
              className="form-control"
              placeholder="Rol"
              required="required"
              handleChange={(e) => setRol(e.target.value)}
            />
            <p>Usuario Activo</p>
            <Checkbox
              id="isActive"
              label="Activo"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <br />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> Guardar
              </button>
            </div>
          </form>
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

export default Users;
