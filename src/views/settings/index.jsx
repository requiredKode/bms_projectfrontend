import DivTabs from "../../components/DivTabs";
import DivTab from "../../components/DivTab";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import DivTextArea from "../../components/DivTextArea";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendRequest, getCurrentDate, formatDateToYYYYMMDD } from "../../functions";

const Settings = () => {
  const history = useNavigate();
  //const [company, setCompany] = useState([]);
  //const [user, setUser] = useState([]);
  //const [idcompany, setIdCompany] = useState("");
  const [companyName, setCompanyName] = useState();
  const [addressCompany, setAddressCompany] = useState("");
  const [cityCompany, setCityCompany] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [identityCardTypes, setIdentityCardTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [phoneNumberCompany, setPhoneNumberCompany] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  //const [iduser, setIdUser] = useState("");
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
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [isActive, setIsActive] = useState();

  const [sendReq, setSendReq] = useState(false);
  //const [activeTab, setActiveTab] = useState("Empresa"); // "Empresa" o "Usuario" según tu estructura

  let method = "";
  let urlCompany = "";
  let urlUser = "";

  // 1. Obtén el valor del almacenamiento local
  const authUserValue = localStorage.getItem("authUser");

  // 2. Analiza (parse) el valor en un objeto JavaScript
  const authUserData = JSON.parse(authUserValue);

  // 3. Accede a las propiedades del objeto según sea necesario
  const authCompanyId = authUserData.companyId;
  const authUserId = authUserData.id;

  useEffect(() => {
    const currentDate = getCurrentDate();
    setDateOfBirth(currentDate);
    getCompany(authCompanyId);
    getUser(authUserId);
    fetchData("identityCard", setIdentityCardTypes);
    fetchData("gender", setGenders);
    fetchData("country", setCountries);
    confirmReq();
  }, [authCompanyId, authUserId]);

  const getCompany = async (id) => {
    try {
      const res = await sendRequest("GET", "/company/" + id, "", "", "", true);

      setCompanyName(res.data.companyName);
      setAddressCompany(res.data.address);
      setCityCompany(res.data.city);
      setState(res.data.state);
      setPostalCode(res.data.postalCode);
      setCountryId(res.data.countryId);
      setPhoneNumberCompany(res.data.phoneNumber);
      setEmailCompany(res.data.email);
      setWebsite(res.data.website);
      setDescription(res.data.description);
    } catch (error) {
      handleErrors(error);
    }
  };

  const getUser = async (id) => {
    try {
      const res = await sendRequest("GET", "/users/" + id, "", "", "", true);
      
      const formattedDateOfBirth = formatDateToYYYYMMDD(res.data.dateOfBirth);
      setName(res.data.name);
      setLastName(res.data.lastName);
      setLastName2(res.data.lastName2);
      setIdentityCardTypeId(res.data.identityCardTypeId);
      setIdentityCard(res.data.identityCard);
      setGenderId(res.data.genderId);
      setProfession(res.data.profession);
      setDateOfBirth(formattedDateOfBirth);
      setPhoneNumber(res.data.phoneNumber);
      setPhoneNumber2(res.data.phoneNumber2);
      setCountryId(res.data.countryId);
      setCity(res.data.city);
      setAddress(res.data.address);
      setEmail(res.data.email);
      setUserName(res.data.username);
      setPassword(res.data.password);
      setRol(res.data.rol);
      setIsActive(res.data.isActive);
    } catch (error) {
      handleErrors(error);
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

  const clear = () => {
    setCompanyName("");
    setAddressCompany("");
    setCityCompany("");
    setState("");
    setPostalCode("");
    setCountryId("1");
    setPhoneNumberCompany("");
    setEmailCompany("");
    setWebsite("");
    setDescription("");
    //setIdUser("");
    setName("");
    setLastName("");
    setLastName2("");
    setIdentityCardTypeId("1");
    setIdentityCard("");
    setGenderId("1");
    setProfession("");
    //setDateOfBirth("");
    setPhoneNumber("");
    setPhoneNumber2("");
    setCity("");
    setAddress("");
    setEmail("");
    setUserName("");
    setPassword("");
  };

  const save = async (e) => {
    e.preventDefault();
    method = "PUT";
    urlCompany = "/company/" + authCompanyId;
    urlUser = "/users/" + authUserId;
    confirmReq();
    const formDataCompany = {
      companyName: companyName,
      address: addressCompany,
      city: cityCompany,
      state: state,
      postalCode: postalCode,
      countryId: countryId,
      phoneNumber: phoneNumberCompany,
      email: emailCompany,
      website: website,
      description: description,
    };

    const formDataUser = {
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
      countryId: countryId,
      city: city,
      address: address,
      email: email,
      username: username,
      password: password,
      rol: rol,
      isActive: isActive,
    };

    formDataUser.companyId = authCompanyId;

    const formCompany = { ...formDataCompany };
    const formUser = { ...formDataUser };
    try {
      if (!sendReq) {
        const resCompany = await sendRequest(
          method,
          urlCompany,
          formCompany,
          "GUARDADO CON EXITO",
          ""
        );

        if (resCompany.data && resCompany.data.companyId !== null) {
          clear();
          getCompany(authCompanyId);
          getUser(authUserId);
        }
      }

      if (!sendReq) {
        const resUser = await sendRequest(
          method,
          urlUser,
          formUser,
          "GUARDADO CON EXITO",
          ""
        );

        if (resUser.data && resUser.data.companyId !== null) {
          clear();
          getCompany(authCompanyId);
          getUser(authUserId);
        }
      }
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

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const confirmReq = () => {
    setSendReq(true);
  };

  const denyconfirm = () => {
    setSendReq(false);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={save}>
            <DivTabs>
              <br />
              <DivTab
                title="Empresa"
                onClick={() => handleTabChange("Empresa")}
              >
                <DivInput
                  type="text"
                  name="companyName"
                  icon="fa-building-flag"
                  value={companyName}
                  className="form-control"
                  placeholder="Empresa"
                  required="required"
                  handleChange={(e) => setCompanyName(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="addressCompany"
                  icon="fa-location-crosshairs"
                  value={addressCompany}
                  className="form-control"
                  placeholder="Direccion"
                  
                  handleChange={(e) => setAddressCompany(e.target.value)}
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
                  name="state"
                  icon="fa-city"
                  value={state}
                  className="form-control"
                  placeholder="Estado"
                  
                  handleChange={(e) => setState(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="cityCompany"
                  icon="fa-tree-city"
                  value={cityCompany}
                  className="form-control"
                  placeholder="Ciudad"
                  
                  handleChange={(e) => setCityCompany(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="postalCode"
                  icon="fa-envelopes-bulk"
                  value={postalCode}
                  className="form-control"
                  placeholder="Codigo Postal"
                  
                  handleChange={(e) => setPostalCode(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="phoneNumberCompany"
                  icon="fa-phone"
                  value={phoneNumberCompany}
                  className="form-control"
                  placeholder="Telefono"
                  
                  handleChange={(e) => setPhoneNumberCompany(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="emailCompany"
                  icon="fa-at"
                  value={emailCompany}
                  className="form-control"
                  placeholder="Correo Electronico"
                  
                  handleChange={(e) => setEmailCompany(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="website"
                  icon="fa-globe"
                  value={website}
                  className="form-control"
                  placeholder="Sitio Web"
                  
                  handleChange={(e) => setWebsite(e.target.value)}
                />
                <DivTextArea
                  type="Date"
                  name="description"
                  icon="fa-info-circle"
                  value={description}
                  className="form-control"
                  placeholder="Descripcion"
                  handleChange={(e) => setDescription(e.target.value)}
                />
              </DivTab>
              <DivTab
                title="Usuario"
                onClick={() => handleTabChange("Usuario")}
              >
                <DivInput
                  type="text"
                  name="name"
                  icon="fa-user"
                  value={name}
                  className="form-control"
                  placeholder="Nombre"
                  required="required"
                  handleChange={(e) => setName(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="lastname"
                  icon="fa-user"
                  value={lastName}
                  className="form-control"
                  placeholder="Primer Apellido"
                  handleChange={(e) => setLastName(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="lastname2"
                  icon="fa-user"
                  value={lastName2}
                  className="form-control"
                  placeholder="Segundo Apellido"
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
                  icon="fa-earth-america"
                  name="countryId"
                  required="required"
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
                  name="email"
                  icon="fa-at"
                  value={email}
                  className="form-control"
                  placeholder="Correo Electronico"
                  handleChange={(e) => setEmail(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="username"
                  icon="fa-user"
                  value={username}
                  className="form-control"
                  placeholder="Username"
                  handleChange={(e) => setUserName(e.target.value)}
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
              </DivTab>
            </DivTabs>
            <br />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success" onClick={denyconfirm}>
                <i className="fa-solid fa-save"></i> Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
