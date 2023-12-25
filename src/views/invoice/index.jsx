import { useEffect, useState } from "react";
import DivTable from "../../components/DivTable";
import CustomSelect from "../../components/CustomSelect";
import {
  getCurrentDate,
  sendRequest,
  sendRequestWithFile,
  formatDateToDDMMYYYY,
  show_alert,
} from "../../functions";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "../../components/InvoiceItem";
import InvoiceModal from "../../components/InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { format } from "date-fns";
import { BiShow } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const history = useNavigate();
  const [patientCases, setPatientCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [money, setMoney] = useState([]);
  const [servicesinventories, setServicesInventories] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [code, setCode] = useState("");
  const [moneyId, setMoneyId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [baseCurrencyCode, setbaseCurrencyCode] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedCost, setConvertedCost] = useState(
    selectedService?.cost || 0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [currentDate, setCurrentDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [billTo, setBillTo] = useState("");
  const [billToEmail, setBillToEmail] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billFrom, setBillFrom] = useState("");
  const [billFromEmail, setBillFromEmail] = useState("");
  const [billFromAddress, setBillFromAddress] = useState("");
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("0.00");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("0.00");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [items, setItems] = useState([
    {
      id: 0,
      code: "",
      name: "",
      description: "",
      quantity: 1,
      cost: "1.00",
    },
  ]);

  const invoiceCode = format(new Date(), "yyyyMMddHHmm");

  useEffect(() => {
    handleCalculateTotal();
  }, [items, taxRate, discountRate]);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = items.filter((item) => item.id !== itemToDelete.id);
    setItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      code: "",
      name: "",
      description: "",
      quantity: 1,
      cost: "1.00",
    };
    setItems([...items, newItem]);
  };

  const handleCalculateTotal = () => {
    let calculatedSubTotal = 0;
  
    items.forEach((item) => {
      const itemCost = parseFloat(item.cost);
      const itemQuantity = parseInt(item.quantity);
  
      if (!isNaN(itemCost) && !isNaN(itemQuantity)) {
        calculatedSubTotal += itemCost * itemQuantity;
      }
    });
  
    const calculatedTaxAmount = calculatedSubTotal * (parseFloat(taxRate) / 100);
    const calculatedDiscountAmount = calculatedSubTotal * (parseFloat(discountRate) / 100);
  
    const calculatedTotal = calculatedSubTotal - calculatedDiscountAmount + calculatedTaxAmount;
  
    setSubTotal(calculatedSubTotal.toFixed(2));
    setTaxAmount(calculatedTaxAmount.toFixed(2));
    setDiscountAmount(calculatedDiscountAmount.toFixed(2));
    setTotal(calculatedTotal.toFixed(2));
  };

  const handleUpdateItems = (updatedItems) => {
    setItems(updatedItems);
    const serviceId = updatedItems[0].serviceId;
    getServiceInventory(serviceId);
    setSelectedService(serviceId);
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedValue) => {
    const selectedMoney = money.find(
      (money) => money.id === parseInt(selectedValue)
    );

    setCurrency(selectedMoney?.moneySymbol);
  };

  useEffect(() => {
    // Cuando se cargan las monedas, establece el primer simbolo de la moneda seleccionada
    if (money.length > 0) {
      const initialMoney = money[0];
      onCurrencyChange(initialMoney.id);
    }
  }, [services]);

  const openModal = (event) => {
    event.preventDefault();
    //handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  // Actualiza dinámicamente el objeto info con los datos actuales
  const selectedPatient =
    patientCases.length > 0
      ? patientCases.find(
          (patient) => patient.id === parseInt(selectedPatientId)
        )
      : null;
  const selectedUser =
    users.length > 0
      ? users.find((user) => user.id === parseInt(selectedUserId))
      : null;

  const info = {
    isOpen: false,
    currency,
    currentDate,
    invoiceNumber: invoiceCode,
    companyId: selectedUser ? `${selectedUser.company.companyName}` : "",
    billTo: selectedPatient
      ? `${selectedPatient.patientCaseName} ${selectedPatient.lastName} ${selectedPatient.lastName2}`
      : "",
    billToEmail: selectedPatient?.email || "",
    billToAddress: selectedPatient?.address || "",
    billFrom: selectedUser
      ? `${selectedUser.name} ${selectedUser.lastName} ${selectedUser.lastName2}`
      : "",
    billFromEmail: selectedUser?.email || "",
    senderEmailPass: selectedUser?.senderEmailPass || "",
    billFromAddress: selectedUser?.address || "",
    total,
    subTotal,
    taxRate: taxRate,
    taxAmmount: "0.00",
    discountRate: discountRate,
    discountAmmount: "0.00",
  };

  useEffect(() => {
    const currentDate = getCurrentDate();
    setCurrentDate(formatDateToDDMMYYYY(currentDate));
    fetchData("patientCase", setPatientCases);
    fetchData("money", setMoney);
    fetchData("service", setServices);
    fetchData("users", setUsers);
  }, []);

  useEffect(() => {
    if (selectedService) {
      setTotalAmount(selectedService.cost || 0);
      setCode(selectedService.code || "");
    }
  }, [selectedService]);

  useEffect(() => {
    if (patientCases.length > 0) {
      const initialPatient = patientCases[0];
      setBillTo(initialPatient.id);
      setSelectedPatientId(initialPatient.id);
    }
  }, [patientCases]);

  const handlePatientChange = (selectedValue) => {
    const selectedPatient = patientCases.find(
      (patient) => patient.id === parseInt(selectedValue)
    );

    setSelectedPatientId(selectedValue);
    setBillToEmail(selectedPatient?.email);
    setBillToAddress(selectedPatient?.address);
  };

  useEffect(() => {
    if (users.length > 0) {
      const initialUser = users[0];
      setBillFrom(initialUser.id);
      setSelectedUserId(initialUser.id);
    }
  }, [users]);

  const handleUserChange = (selectedValue) => {
    const selectedUser = users.find(
      (user) => user.id === parseInt(selectedValue)
    );

    setSelectedUserId(selectedValue);
    setBillFromEmail(selectedUser?.email);
    setBillFromAddress(selectedUser?.address);
  };

  //efecto para precargar los datos segun el select precargado del paciente
  useEffect(() => {
    if (selectedPatientId) {
      const selectedPatient = patientCases.find(
        (patient) => patient.id === parseInt(selectedPatientId)
      );

      setBillToEmail(selectedPatient?.email);
      setBillToAddress(selectedPatient?.address);
    }
  }, [selectedPatientId, patientCases]);

  //efecto para precargar los datos segun el select precargado del usuario del sistema
  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find(
        (user) => user.id === parseInt(selectedUserId)
      );

      setBillFromEmail(selectedUser?.email);
      setBillFromAddress(selectedUser?.address);
    }
  }, [selectedUserId, users]);

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
      code: invoiceCode,
      patientId:
        selectedPatientId !== "" ? selectedPatientId : patientCases[0].id,
      serviceId: selectedService !== "" ? selectedService : services[0].id,
      moneyId: moneyId !== "" ? moneyId : money[0].id,
      percentageDiscount: discountRate,
      discount: discountAmount,
      descriptionDiscount: "",
      grossCost: total,
      netCost: 0,
      totalAmount: total,
    };

    try {
      const res = await sendRequest("POST", "/invoice", form, "", "", true);
      if (res.data && res.data.companyId !== null) {
        show_alert("GUARDADO CON EXITO", "success");
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

  const handleGenerateInvoice = async () => {
    try {
      const canvas = await html2canvas(
        document.querySelector("#invoiceCapture")
      );
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Obtener el blob del PDF
      const pdfBlob = pdf.output("blob");
      await sendEmail(pdfBlob);

      pdf.save("invoice-" + `${info.invoiceNumber}` + ".pdf");
    } catch (error) {
      console.error("Error al generar o enviar la factura:", error);
    }
  };

  const sendEmail = async (pdf) => {
    try {

      const formData = new FormData();
      formData.append("from", info.billFromEmail);
      formData.append("senderEmailPass", info.senderEmailPass);
      formData.append("to", info.billToEmail);
      formData.append("subject", "Factura: " + info.invoiceNumber);
      formData.append("text", "Adjunto encontrarás la factura en formato PDF.");
      formData.append("pdf", pdf, "factura.pdf");

      try {
        await sendRequestWithFile("POST", "/invoice/send-email", formData, "Enviado con Exito");
      } catch (error) {
        console.error(error.response);
      }

    } catch (error) {
      console.error("Error al enviar la solicitud al servidor:", error);
    }
  };

  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        <Form>
          <Row>
            <Col md={8} lg={9}>
              <Card className="p-4 p-xl-5 my-3 my-xl-4">
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="fw-bold">
                          Fecha&nbsp;Creacion:&nbsp;{" "}
                        </span>
                        <span className="current-date">{currentDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="fw-bold">
                          Cod&nbsp;Factura:&nbsp;{" "}
                        </span>
                        <span className="current-date">{invoiceCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                <Row className="mb-5">
                  <Col>
                    <CustomSelect
                      label="Facturar a:"
                      name="billTo"
                      value={billTo}
                      options={patientCases.map((patient) => ({
                        id: patient.id,
                        label: `${patient.patientCaseName} ${patient.lastName} ${patient.lastName2}`,
                      }))}
                      handleChange={(e) => {
                        setBillTo(e.target.value);
                        handlePatientChange(e.target.value);
                      }}
                      displayProperty="label"
                      required
                    />
                    <Form.Control
                      placeholder={"Email"}
                      value={billToEmail}
                      type="email"
                      name="billToEmail"
                      className="my-2"
                      onChange={(e) => setBillToEmail(e.target.value)}
                      autoComplete="email"
                      readOnly={true}
                      required="required"
                    />
                    <Form.Control
                      placeholder={"Direccion de factura"}
                      value={billToAddress}
                      type="text"
                      name="billToAddress"
                      className="my-2"
                      autoComplete="address"
                      onChange={(e) => setBillToAddress(e.target.value)}
                      readOnly={true}
                      required="required"
                    />
                  </Col>
                  <Col>
                    <CustomSelect
                      label="Facturador:"
                      name="billFrom"
                      value={billFrom}
                      options={users.map((user) => ({
                        id: user.id,
                        label: `${user.name} ${user.lastName} ${user.lastName2}`,
                      }))}
                      handleChange={(e) => {
                        setBillFrom(e.target.value);
                        handleUserChange(e.target.value);
                      }}
                      displayProperty="label"
                      required
                    />
                    <Form.Control
                      placeholder={"Email address"}
                      value={billFromEmail}
                      type="email"
                      name="billFromEmail"
                      className="my-2"
                      onChange={(e) => setBillFromEmail(e.target.value)}
                      readOnly={true}
                      autoComplete="email"
                      required="required"
                    />
                    <Form.Control
                      placeholder={"Billing address"}
                      value={billFromAddress}
                      type="text"
                      name="billFromAddress"
                      className="my-2"
                      autoComplete="address"
                      onChange={(e) => setBillFromAddress(e.target.value)}
                      readOnly={true}
                      required="required"
                    />
                  </Col>
                </Row>
                <InvoiceItem
                  onRowAdd={handleAddEvent}
                  onRowDel={handleRowDel}
                  currency={currency}
                  items={items}
                  services={services}
                  onUpdateItems={handleUpdateItems}
                />
                <Row className="mt-4 justify-content-end">
                  <Col lg={6}>
                    <div className="d-flex flex-row align-items-start justify-content-between">
                      <span className="fw-bold">Subtotal:</span>
                      <span>
                        {currency}
                        {subTotal}
                      </span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Descuento:</span>
                      <span>
                        <span className="small ">({discountRate || 0}%) </span>
                        {currency}
                        {discountAmount || 0}
                      </span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Impuesto:</span>
                      <span>
                        <span className="small ">({taxRate || 0}%) </span>
                        {currency}
                        {taxAmount || 0}
                      </span>
                    </div>
                    <hr />
                    <div
                      className="d-flex flex-row align-items-start justify-content-between"
                      style={{
                        fontSize: "1.125rem",
                      }}
                    >
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold">
                        {currency}
                        {total || 0}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={4} lg={3}>
              <div className="sticky-top pt-md-3 pt-xl-4">
                <Button
                  variant="primary"
                  type="button"
                  className="d-block w-100"
                  onClick={openModal}
                >
                  <BiShow
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Previsualizar Factura
                </Button>
                <InvoiceModal
                  showModal={isOpen}
                  closeModal={closeModal}
                  info={info}
                  items={items}
                  currency={currency}
                  subTotal={subTotal}
                  taxAmount={taxAmount}
                  discountAmount={discountAmount}
                  total={total}
                  save={save}
                  handleGenerateInvoice={handleGenerateInvoice}
                />
                <Form.Group className="mb-3">
                  <CustomSelect
                    label="Moneda:"
                    name="money"
                    value={moneyId}
                    options={money.map((money) => ({
                      id: money.id,
                      label: money.moneyName,
                    }))}
                    handleChange={(e) => {
                      setMoneyId(e.target.value);
                      onCurrencyChange(e.target.value);
                    }}
                    displayProperty="label"
                    required
                  />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">
                    Porcentaje Impuesto:
                  </Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="taxRate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="bg-white border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className="bg-light fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">
                    Porcentaje Descuento:
                  </Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="discountRate"
                      type="number"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(e.target.value)}
                      className="bg-white border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className="bg-light fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <hr className="my-4" />
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">
                    Estos productos se rebajaran del Inventario:
                  </Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <DivTable
                      col="14"
                      off="0"
                      classLoad={classLoad}
                      classTable={classTable}
                    >
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Producto Asociado</th>
                            <th>Cantidad a Rebajar</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {servicesinventories
                            ? servicesinventories.map((row, i) => (
                                <tr key={row.id}>
                                  <td>{i + 1}</td>
                                  <td>{row.inventory.inventoryName}</td>
                                  <td>{row.quantity}</td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </DivTable>
                  </InputGroup>
                </Form.Group>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Invoice;
