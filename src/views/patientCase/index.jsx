import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentDate,
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
  confirmation,
  sendRequest,
  sendRequestWithFile,
} from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import DivTextArea from "../../components/DivTextArea";
import DivTabs from "../../components/DivTabs";
import DivTab from "../../components/DivTab";
import Checkbox from "../../components/DivCheckBox";
import Modal from "../../components/Modal";

const PatientCase = () => {
  const history = useNavigate();
  const [files, setFiles] = useState([]);
  const [patientCases, setPatientCases] = useState([]);
  const [identityCardTypes, setIdentityCardTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [appointmentSchedules, setAppointmentSchedules] = useState([]);
  const [id, setId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [patientCaseName, setPatientCaseName] = useState("");
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
  const [serviceId, setServiceId] = useState("");
  const [patientHistoryId, setPatientHistoryId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState(false);
  const [smokingHabit, setSmokingHabit] = useState(false);
  const [drugsUse, setDrugsUse] = useState(false);
  const [foodAllergies, setFoodAllergies] = useState(false);
  const [drugsAllergies, setDrugsAllergies] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [appointmentSchedulePatientId, setAppointmentSchedulePatientId] =
    useState("");
  const [appointmentScheduleServiceId, setAppointmentScheduleServiceId] =
    useState("");
  const [appointmentScheduleDate, setAppointmentScheduleDate] = useState("");
  const [appointmentScheduleCost, setAppointmentScheduleCost] = useState("");
  const [appointmentScheduleNotes, setAppointmentScheduleNotes] = useState("");
  const [operation, setOperation] = useState("");
  const [title, setTitle] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [showModal, setShowModal] = useState();
  const nameInputRef = useRef();
  const closeRef = useRef();
  let method = "";
  let url = "";

  const ShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const currentDate = getCurrentDate();
    setDateOfBirth(currentDate);
    setStartDate(currentDate);
    setEndDate(currentDate);
    getPatientCase(1);
    fetchData("identityCard", setIdentityCardTypes);
    fetchData("gender", setGenders);
    fetchData("country", setCountries);
    fetchData("service", setServices);
    getFiles();
  }, []);

  const getPatientCase = async (page) => {
    try {
      const res = await sendRequest(
        "GET",
        `/patientCase?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );
      setPatientCases(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };

  const getAppointmentSchedule = async (id) => {
    try {
      const res = await sendRequest(
        "GET",
        "/appointmentSchedule/patient/" + id,
        "",
        "",
        "",
        true
      );
      setAppointmentSchedules(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await sendRequest(
        "GET",
        `/${endpoint}?page=${page}&per_page=${100}`,
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

  const getFiles = async () => {
    try {
      const res = await sendRequestWithFile("GET", "/files", "", "", "", true);
      setFiles(res.data);
    } catch (error) {
      handleErrors(error);
    }
  };

  const deletePatientCase = (id, name) => {
    confirmation(name, "/patientCase/" + id, "/patientCase");
  };

  const clear = () => {
    setCompanyId("");
    setCountryId("1");
    setPatientCaseName("");
    setLastName("");
    setLastName2("");
    setIdentityCardTypeId("1");
    setIdentityCard("");
    setGenderId("1");
    setProfession("");
    setPhoneNumber("");
    setPhoneNumber2("");
    setCity("");
    setAddress("");
    setEmail("");
    setServiceId("1");
    setPatientHistoryId("");
    setTreatmentId("");
    setDiseaseId("");
    setAlcoholConsumption(false);
    setSmokingHabit(false);
    setDrugsUse(false);
    setFoodAllergies(false);
    setDrugsAllergies("");
    setTreatmentName("");
    setDose("");
    setFrequency("");
    setDiseaseName("");
  };

  const openModal = (
    OPERATION,
    ID,
    PATIENTCASENAME,
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
    SERVICEID,
    PATIENTHISTORYID,
    TREATMENTID,
    DISEASEID,
    ALCOHOLCONSUMPTION,
    SMOKINGHABIT,
    DRUGSUSE,
    FOODALLERGIES,
    DRUGSALLERGIES,
    TREATMENTNAME,
    DOSE,
    FREQUENCY,
    STARTDATE,
    ENDDATE,
    DISEASENAME
  ) => {
    clear();
    ShowModal();

    const formattedDateOfBirth = formatDateToYYYYMMDD(DATEOFBIRTH);
    const formattedStartDate = formatDateToYYYYMMDD(STARTDATE);
    const formattedEndDate = formatDateToYYYYMMDD(ENDDATE);

    setOperation(OPERATION);
    setId(ID);

    if (OPERATION === 1) {
      setTitle("Nuevo Paciente");
      getAppointmentSchedule(0); //le pasamos un 0 de Id de paciente para que cuando se agregue un nuevo paciente, la tabla este vacia
    } else {
      setTitle("Actualizar Paciente");
      setCountryId(COUNTRYID);
      setPatientCaseName(PATIENTCASENAME);
      setLastName(LASTNAME);
      setLastName2(LASTNAME2);
      setIdentityCardTypeId(IDENTITYCARDTYPEID);
      setIdentityCard(IDENTITYCARD);
      setGenderId(GENDERID);
      setProfession(PROFESSION);
      setDateOfBirth(formattedDateOfBirth);
      setPhoneNumber(PHONENUMBER);
      setPhoneNumber2(PHONENUMBER2);
      setCity(CITY);
      setAddress(ADDRESS);
      setEmail(EMAIL);
      setServiceId(SERVICEID);
      setPatientHistoryId(PATIENTHISTORYID);
      setTreatmentId(TREATMENTID);
      setDiseaseId(DISEASEID);
      setAlcoholConsumption(ALCOHOLCONSUMPTION);
      setSmokingHabit(SMOKINGHABIT);
      setDrugsUse(DRUGSUSE);
      setFoodAllergies(FOODALLERGIES);
      setDrugsAllergies(DRUGSALLERGIES);
      setTreatmentName(TREATMENTNAME);
      setDose(DOSE);
      setFrequency(FREQUENCY);
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
      setDiseaseName(DISEASENAME);
      getAppointmentSchedule(ID);
    }
  };

  const save = async (e) => {
    e.preventDefault();

    method = operation === 1 ? "POST" : "PUT";
    url = operation === 1 ? "/patientCase" : "/patientCase/" + id;

    const formData = {
      patientCase: {
        patientCaseName: patientCaseName,
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
        serviceId: serviceId,
        patientHistoryId: patientHistoryId,
        treatmentId: treatmentId,
        diseaseId: diseaseId,
      },
      patientHistory: {
        alcoholConsumption: alcoholConsumption,
        smokingHabit: smokingHabit,
        drugsUse: drugsUse,
        foodAllergies: foodAllergies,
        drugsAllergies: drugsAllergies,
      },
      treatment: {
        treatmentName: treatmentName,
        dose: dose,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
      },
      disease: {
        diseaseName: diseaseName,
      },
    };

    if (operation === 1) {
      formData.companyId = companyId;
    }

    const form = { ...formData };
    try {
      if (!showModal) {
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
          getPatientCase(1);
        }
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const openModalAppointmentSchedule = (
    OPERATION,
    ID,
    PATIENTID,
    SERVICEID,
    SERVICECOST,
    APPOINTMENTDATE,
    APPOINTMENTNOTES
  ) => {
    clear();
    ShowModal();

    const formattedAppointmentDate = formatDateToYYYYMMDD(APPOINTMENTDATE);

    setOperation(OPERATION);
    setId(ID);
    setTitle("Actualizar Paciente");
    setAppointmentSchedulePatientId(PATIENTID);
    setAppointmentScheduleServiceId(SERVICEID);
    setAppointmentScheduleCost(SERVICECOST);
    setAppointmentScheduleDate(formattedAppointmentDate);
    setAppointmentScheduleNotes(APPOINTMENTNOTES);
  };

  const saveAppointmentSchedule = async (e) => {
    e.preventDefault();

    method = "PUT";
    url = "/appointmentSchedule/" + id;

    const formData = {
      appointmentSchedulePatientId: appointmentSchedulePatientId,
      appointmentScheduleServiceId: appointmentScheduleServiceId,
      appointmentDate: appointmentScheduleDate,
      appointmentNotes: appointmentScheduleNotes,
    };

    const form = { ...formData };
    try {
      if (!showModal) {
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
          getAppointmentSchedule(appointmentSchedulePatientId);
        }
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getPatientCase(p);
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

  const navigateToLegalDocs = (id) => {
    history(`/legalDocs/${id}`);
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalPatientCase"
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
              <th>Paciente</th>
              <th>Identificacion</th>
              <th>Numero de Telefono</th>
              <th>Ciudad</th>
              <th>Email</th>
              <th>Servicio</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {patientCases.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>
                  {row.patientCaseName +
                    " " +
                    row.lastName +
                    " " +
                    row.lastName2}
                </td>
                <td>{row.identityCard}</td>
                <td>{row.phoneNumber}</td>
                <td>{row.city}</td>
                <td>{row.email}</td>
                <td>{row.service.serviceName}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPatientCase"
                    onClick={() =>
                      openModal(
                        2,
                        row.id,
                        row.patientCaseName,
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
                        row.serviceId,
                        row.patientHistoryId,
                        row.treatmentId,
                        row.diseaseId,
                        row.patientHistory.alcoholConsumption,
                        row.patientHistory.smokingHabit,
                        row.patientHistory.drugsUse,
                        row.patientHistory.foodAllergies,
                        row.patientHistory.drugsAllergies,
                        row.treatment.treatmentName,
                        row.treatment.dose,
                        row.treatment.frequency,
                        row.treatment.startDate,
                        row.treatment.endDate,
                        row.disease.diseaseName
                      )
                    }
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deletePatientCase(row.id, row.patientCaseName)
                    }
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
      <Modal title={title} modal="modalPatientCase" ancho="lg">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivTabs>
              <br />
              <DivTab title="Datos del Paciente">
                <DivInput
                  type="text"
                  name="patientCaseName"
                  icon="fa-user"
                  value={patientCaseName}
                  className="form-control"
                  placeholder="Nombre"
                  required="required"
                  ref={nameInputRef}
                  handleChange={(e) => setPatientCaseName(e.target.value)}
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
                <DivSelect
                  icon="fa-handshake"
                  name="serviceId"
                  required="required"
                  value={serviceId}
                  className="form-select"
                  options={services}
                  handleChange={(e) => setServiceId(e.target.value)}
                  displayProperty="serviceName"
                />
              </DivTab>
              <DivTab title="AP">
                <p>Historial del Paciente</p>
                <Checkbox
                  id="alcohol-consumption"
                  label="Consume Alcohol?"
                  checked={alcoholConsumption}
                  onChange={() => setAlcoholConsumption(!alcoholConsumption)}
                />
                <Checkbox
                  id="smoking-habit"
                  label="Fuma?"
                  checked={smokingHabit}
                  onChange={() => setSmokingHabit(!smokingHabit)}
                />
                <Checkbox
                  id="drugs-use"
                  label="Consume alguna droga?"
                  checked={drugsUse}
                  onChange={() => setDrugsUse(!drugsUse)}
                />
                <Checkbox
                  id="food-allergies"
                  label="Alergia a alimentos?"
                  checked={foodAllergies}
                  onChange={() => setFoodAllergies(!foodAllergies)}
                />
                <DivTextArea
                  type="Text"
                  name="drugsAllergies"
                  icon="fa-pills"
                  value={drugsAllergies}
                  className="form-control"
                  placeholder="Alergias a medicamentos"
                  handleChange={(e) => setDrugsAllergies(e.target.value)}
                />
                <br />
                <p>Tratamiento</p>
                <br />
                <DivInput
                  type="text"
                  name="treatmentName"
                  icon="fa-pencil"
                  value={treatmentName}
                  className="form-control"
                  placeholder="Nombre Tratamiento"
                  handleChange={(e) => setTreatmentName(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="dose"
                  icon="fa-pills"
                  value={dose}
                  className="form-control"
                  placeholder="Dosis"
                  handleChange={(e) => setDose(e.target.value)}
                />
                <DivInput
                  type="text"
                  name="frequency"
                  icon="fa-clock"
                  value={frequency}
                  className="form-control"
                  placeholder="Frecuencia"
                  handleChange={(e) => setFrequency(e.target.value)}
                />
                <DivInput
                  type="Date"
                  name="startDate"
                  icon="fa-calendar"
                  value={startDate}
                  className="form-control"
                  placeholder="fecha inicio"
                  handleChange={(e) => setStartDate(e.target.value)}
                />
                <DivInput
                  type="Date"
                  name="endDate"
                  icon="fa-calendar"
                  value={endDate}
                  className="form-control"
                  placeholder="fecha fin"
                  handleChange={(e) => setEndDate(e.target.value)}
                />
                <br />
                <p>Enfermedades</p>
                <br />
                <DivTextArea
                  type="Date"
                  name="diseaseName"
                  icon="fa-dna"
                  value={diseaseName}
                  className="form-control"
                  placeholder="Enfermedad(es)"
                  handleChange={(e) => setDiseaseName(e.target.value)}
                />
              </DivTab>
              <DivTab title="Expediente">
                <DivTable
                  col="8"
                  off="2"
                  classLoad={classLoad}
                  classTable={classTable}
                >
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fecha Servicio</th>
                        <th>Servicio</th>
                        <th>Costo</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {appointmentSchedules.map((row, i) => (
                        <tr key={row.id}>
                          <td>{i + 1}</td>
                          <td>{formatDateToDDMMYYYY(row.appointmentDate)}</td>
                          <td>{row.service.serviceName}</td>
                          <td>{row.service.cost}</td>
                          <td>{row.appointmentNotes}</td>
                          <td>
                            <button
                              className="btn btn-warning"
                              data-bs-toggle="modal"
                              data-bs-target="#modalAppointmentSchedule"
                              onClick={() =>
                                openModalAppointmentSchedule(
                                  2,
                                  row.id,
                                  row.patientId,
                                  row.serviceId,
                                  row.service.cost,
                                  row.appointmentDate,
                                  row.appointmentNotes
                                )
                              }
                            >
                              <i className="fa-solid fa-edit"></i>
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
              </DivTab>
              <DivTab title="Consentimiento">
                <br />

                <div className="d-grid col-10 mx-auto">
                  <p> Debe guardar los datos antes de proceder a Firmar:</p>
                  <button className="btn btn-success">
                    {/*onClick={closeModal}*/}
                    <i className="fa-solid fa-save"></i> Guardar
                  </button>
                </div>
                <br />
                <DivTable
                  col="8"
                  off="2"
                  classLoad={classLoad}
                  classTable={classTable}
                >
                  <p> Documentos a Firmar:</p>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre del Archivo</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {files.map((row, i) => (
                        <tr key={row.id}>
                          <td>{i + 1}</td>
                          <td>{row.fileName}</td>
                          <td>
                            <button
                              className="btn btn-light"
                              data-bs-dismiss="modal"
                              ref={closeRef}
                              onClick={() => {
                                navigateToLegalDocs(row.id);
                                closeModal();
                              }}
                            >
                              <i className="fa-solid fa-signature"></i> Firmar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DivTable>
              </DivTab>
            </DivTabs>
          </form>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-dark"
            data-bs-dismiss="modal"
            ref={closeRef}
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </Modal>
      <Modal title={title} modal="modalAppointmentSchedule" ancho="lg">
        <div className="modal-body">
          <form onSubmit={saveAppointmentSchedule}>
            <DivTabs>
              <br />
              <DivTab title="Datos de Expediente">
                <DivInput
                  type="date"
                  name="appointmentScheduleDate"
                  icon="fa-cake"
                  value={appointmentScheduleDate}
                  className="form-control"
                  placeholder="Fecha Nacimiento"
                  handleChange={(e) =>
                    setAppointmentScheduleDate(e.target.value)
                  }
                />
                <DivSelect
                  icon="fa-handshake"
                  name="appointmentScheduleServiceId"
                  required="required"
                  value={appointmentScheduleServiceId}
                  className="form-select"
                  options={services}
                  readOnly={true}
                  displayProperty="serviceName"
                />
                <DivInput
                  type="text"
                  name="appointmentScheduleCost"
                  icon="fa-coins"
                  value={appointmentScheduleCost}
                  className="form-control"
                  placeholder="Costo"
                  readOnly={true}
                />
                <DivInput
                  type="text"
                  name="appointmentScheduleNotes"
                  icon="fa-note-sticky"
                  value={appointmentScheduleNotes}
                  className="form-control"
                  placeholder="Notas"
                  handleChange={(e) =>
                    setAppointmentScheduleNotes(e.target.value)
                  }
                />
              </DivTab>
            </DivTabs>
            <br />
            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success" onClick={closeModal}>
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
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientCase;
