import { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import DivSelect from "../../components/DivSelect";
import DivTextArea from "../../components/DivTextArea";
import Checkbox from "../../components/DivCheckBox";
import Modal from "../../components/Modal";
import {
  getCurrentDate,
  confirmation,
  sendRequest,
  formatDateToDDMMYYYY,
} from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const history = useNavigate();
  const [patientCases, setPatientCases] = useState([]);
  const [money, setMoney] = useState([]);
  const [servicesinventories, setServicesInventories] = useState([]);
  const [appointmentSchedules, setAppointmentSchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [code, setCode] = useState("");
  const [moneyId, setMoneyId] = useState("");
  const [percentageDiscount, setPercentageDiscount] = useState("");
  const [discount, setDiscount] = useState("");
  const [descriptionDiscount, setDescriptionDiscount] = useState("");
  const [grossCost, setGrossCost] = useState("");
  const [netCost, setNetCost] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [serviceRowCheck, setServiceRowCheck] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  const [baseCurrencyCode, setbaseCurrencyCode] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1); // Tasa de cambio inicial
  const [convertedCost, setConvertedCost] = useState(
    selectedService?.cost || 0
  );

  useEffect(() => {
    const currentDate = getCurrentDate();
    setCurrentDate(currentDate);
    fetchData("patientCase", setPatientCases);
    fetchData("money", setMoney);
    fetchData("service", setServices);
  }, []);

  useEffect(() => {
    // Actualizar el costo cuando cambie el servicio seleccionado
    if (selectedService) {
      setTotalAmount(selectedService.cost || 0);
      setCode(selectedService.code || "")
    }
  }, [selectedService]);

  useEffect(() => {
    // Cuando se cargan los servicios, establece el primer servicio como seleccionado
    if (services.length > 0) {
      const initialService = services[0];
      setServiceId(initialService.id);
      handleServiceChange(initialService.id);
    }
  }, [services]);

  const handleServiceChange = (selectedValue) => {
    const selectedService = services.find(
      (service) => service.id === parseInt(selectedValue)
    );

    setSelectedService(selectedService);
    setTotalAmount(selectedService?.cost || 0);
    setCode(selectedService?.code || "")
    //setConvertedCost((selectedService?.cost * exchangeRate).toFixed(2));
    setMoneyId(selectedService?.money.id);
    setbaseCurrencyCode(selectedService?.money.moneyCode);

    getServiceInventory(selectedService?.id);

    if (selectedService) {
      // Actualiza el costo convertido al seleccionar un nuevo servicio
      setConvertedCost(selectedService.cost);
    } else {
      setConvertedCost((selectedService?.cost * exchangeRate).toFixed(2));
    }
  };

  useEffect(() => {
    // Set the initial selected patient ID when patientCases is loaded
    if (patientCases.length > 0) {
      const initialPatient = patientCases[0];
      setPatientId(initialPatient.id);
      setSelectedPatientId(initialPatient.id);
      getAppointmentSchedule(initialPatient.id);
    }
  }, [patientCases]);

  useEffect(() => {
    if (selectedPatientId) {
      getAppointmentSchedule(selectedPatientId);
    }
  }, [selectedPatientId]);

  const handlePatientChange = (selectedValue) => {
    setSelectedPatientId(selectedValue);
    getAppointmentSchedule(selectedValue);
  };

  const handleMoneyChange = async (selectedMoneyValue) => {
    try {
      const selectedMoney = money.find(
        (money) => money.id === parseInt(selectedMoneyValue)
      );

      const targetCurrencyCode = selectedMoney.moneyCode || "";

      const res = await sendRequest(
        "GET",
        `money/exchange-rate/${baseCurrencyCode}/${targetCurrencyCode}`,
        "",
        "",
        "",
        true
      );
      setExchangeRate(res.exchangeRate);
      // Convertir el costo a la nueva moneda
      setConvertedCost((selectedService.cost * res.exchangeRate).toFixed(2));
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

  const getServiceInventory = async (id) => {
    try {
      const res = await sendRequest(
        "GET",
        `/serviceinventory/service/` + id,
        "",
        "",
        "",
        true
      );
      setServicesInventories(res.data);
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
    setPatientCases("");
    setServices("");
    setMoney("");
    setTotalAmount("");
    setCode("");
  };

  const save = async (e) => {
    e.preventDefault();
    const form = {
      patientId: patientId !== "" ? patientId : patientCases[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      serviceId: serviceId !== "" ? serviceId : services[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      moneyId: moneyId !== "" ? moneyId : money[0].id,
      totalAmount: convertedCost,
      code: code,
    };

    try {
      const res = await sendRequest(
        "POST",
        "/invoice",
        form,
        "GUARDADO CON EXITO",
        "/invoice"
      );
      if (res.data && res.data.companyId !== null) {
        clear();
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getServiceInventory(p);
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

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={save}>
            <br />
            <h1>FACTURACION</h1>
            <br />
            <div className="mb-3">
              <label htmlFor="patientId" className="form-label">
                Paciente
              </label>
              <DivSelect
                icon="fa-user"
                name="patientId"
                value={patientId}
                className="form-select"
                options={patientCases.map((patient) => ({
                  id: patient.id,
                  label: `${patient.patientCaseName} ${patient.lastName} ${patient.lastName2}`,
                }))}
                handleChange={(e) => setPatientId(e.target.value)}
                displayProperty="label"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="CABYS" className="form-label">
              Código de Producto/Servicio (CAByS)
              </label>
              <DivInput
                type="text"
                icon="fa-barcode"
                value={code}
                className="form-control"
                placeholder="CAByS"
                readOnly="readOnly"
                handleChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="serviceId" className="form-label">
                Servicio
              </label>
              <DivSelect
                icon="fa-handshake"
                name="serviceId"
                value={serviceId}
                className="form-select"
                options={services}
                handleChange={(e) => {
                  setServiceId(e.target.value);
                  handleServiceChange(e.target.value);
                }}
                displayProperty="serviceName"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="serviceId" className="form-label">
                Moneda
              </label>
              <DivSelect
                icon="fa-coins"
                name="moneyId"
                value={moneyId}
                className="form-select"
                options={money}
                handleChange={(e) => setMoneyId(e.target.value)}
                displayProperty="moneyName"
                onSelectChange={(e) => handleMoneyChange(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="totalAmount" className="form-label">
                Total
              </label>
              <DivInput
                type="number"
                icon="fa-money-bill"
                value={convertedCost}
                className="form-control"
                placeholder="Costo"
                readOnly="readOnly"
                handleChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="currentDate" className="form-label">
                Fecha
              </label>
              <DivInput
                type="Date"
                name="currentDate"
                icon="fa-calendar"
                value={currentDate}
                className="form-control"
                placeholder="Fecha"
                handleChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
            {/* <div className="mb-3">
              <label htmlFor="currentDate" className="form-label">
                Fecha
              </label>
              <DivTextArea
                type="Text"
                name="notasAdicionales"
                icon="fa-book"
                value={appointmentSchedules.length > 0 ? appointmentSchedules[0].appointmentNotes : ""}
                className="form-control"
                placeholder="Notas Adicionales"
                handleChange={(e) => setAppointmentNotes(e.target.value)}
              />
            </div> */}
            <br />
            {/*<DivTable
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
                        {" "}
                        <Checkbox
                          id="servicio a facturar"
                          label="Servicio A Facturar"
                          checked={null}
                          onChange={() => setServiceRowCheck(!serviceRowCheck)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DivTable> */}
            <p>Estos productos se rebajaran del Inventario.</p>
            <br />
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
                    {/* <th>Servicio</th> */}
                    <th>Producto Asociado</th>
                    <th>Cantidad a Rebajar</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {servicesinventories.map((row, i) => (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      {/* <td>{row.service.serviceName}</td> */}
                      <td>{row.inventory.inventoryName}</td>
                      <td>{row.quantity}</td>
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
            <br />

            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
