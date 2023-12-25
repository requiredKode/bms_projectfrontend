import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardWithIcon from "../../components/CardWithIcon";
import ReminderCard from "../../components/ReminderCard";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";
import {
  confirmation,
  sendRequest,
} from "../../functions";

const Home = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [reminders, setReminders] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3); // Número de recordatorios por página
  const [totalPages, setTotalPages] = useState(0);
  const [qrCodeMessage, setQrCodeMessage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);

  const [lowStockProducts, setLowStockProducts] = useState([]);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("es-ES", options);
  };

  
  const getQR = async () => {
    try {
      const res = await sendRequest(
        "GET",
        "/whatsappBot/getQRCODE",
        "",
        "",
        "",
        true
      );
      setQrCodeMessage(res.message);

      // Mostrar notificación después de unos segundos
      setTimeout(() => {
        setQrCodeMessage(
          "Al activar los mensajes programados se enviará una notificación por WhatsApp a los pacientes que tengan una cita para las próximas 24 horas."
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000); // 5000 milisegundos = 5 segundos
      }, 15000); // 15000 milisegundos = 15 segundos
    } catch (error) {
      handleErrors(error);
    }
  };

  const fetchReminders = async (endpoint, setter) => {
    try {
      const currentDate = new Date();
      const endOfNextDay = new Date(currentDate);
      endOfNextDay.setDate(endOfNextDay.getDate() + 1);
      endOfNextDay.setHours(23, 59, 59, 999);
  
      const res = await sendRequest(
        "GET",
        `/${endpoint}?page=${1}&per_page=${100}`,
        "",
        "",
        "",
        true
      );
  
      const filteredReminders = res.data.filter((reminder) => {
        const appointmentDate = new Date(reminder.appointmentDate);
        return appointmentDate >= currentDate && appointmentDate <= endOfNextDay;
      });
  
      // Sort reminders by date and time
      const sortedReminders = filteredReminders.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
  
      setter(sortedReminders);
    } catch (error) {
      handleErrors(error);
    }
  };
  

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    fetchReminders("appointmentSchedule", setReminders);
  }, []);

  const getInventory = async () => {
    try {
      const page = 1;
      const pageSize = 8;
      const res = await sendRequest(
        "GET",
        `/inventory?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );

      const products = res.data;
      const lowStockProducts = products.filter(
        (product) =>
          product.stockAlert && product.quantity <= product.minimumQuantity
      );

      setInventories(products);
      setLowStockProducts(lowStockProducts);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };

  // Función para eliminar un recordatorio (reemplazar con tu lógica)
  const deleteReminder = (id) => {
    console.log(`Eliminar recordatorio con ID: ${id}`);
  };

  const handleErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "NOT_SESSION"
    ) {
      localStorage.clear();
      history.push("/login");
      return;
    }
    console.error("Error en la solicitud:", error);
  };

  return (
    <Container>
      <Row>
        {/* Contenido principal */}
        <Col md={8}>
          <Container className="rounded p-3 shadow mb-4 m-3">
            {/* Encabezado */}
            <header>
              <h1>Conexion con WaBot</h1>
              <Button variant="primary" onClick={getQR}>
                Haz click aquí para iniciar los mensajes programados. Conectando
                con WhatsApp.
              </Button>
              {qrCodeMessage && <p>{qrCodeMessage}</p>}
            </header>
            {/* Alerta de Stock */}
            <Row>
              <Col md={8}>
                <Container className="rounded p-3 shadow mb-4 m-3">
                  {/* Encabezado */}
                  <header>
                    <h1>Alerta de Stock</h1>
                  </header>
                  {/* Contenido de la alerta de stock */}
                  {lowStockProducts.length > 0 ? (
                    <div>
                      <Alert variant="warning">
                        <p>Productos con stock bajo:</p>
                        <ul>
                          {lowStockProducts.map((product) => (
                            <li key={product.id}>
                              {product.inventoryName} - Stock:{" "}
                              {product.quantity} / Mínimo:{" "}
                              {product.minimumQuantity}
                            </li>
                          ))}
                        </ul>
                      </Alert>
                    </div>
                  ) : (
                    <p>No hay productos con stock bajo.</p>
                  )}
                </Container>
              </Col>
            </Row>
          </Container>
        </Col>

        {/* Aside (RecordatorioCard) */}
        <Col md={4}>
          <Container className="rounded p-3 shadow mb-4 m-3">
            <h1>Proximas Citas</h1>
            <aside
              style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
            >
              {/* Lista de recordatorios */}
              {reminders.map((reminder) => (
                <div key={reminder.id} className="mb-3">
                  <ReminderCard
                    title={`${reminder.patientCase.patientCaseName} ${reminder.patientCase.lastName} ${reminder.patientCase.lastName2}`}
                    content={`Fecha/Hora de la Cita: ${formatDateToDDMMYYYY(
                      reminder.appointmentDate
                    )}`}
                  >
                    {/* Botón de cierre para eliminar el recordatorio */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <FontAwesomeIcon icon="fa-clock" />
                    </Button>
                  </ReminderCard>
                </div>
              ))}
              {/* Agrega más recordatorios aquí */}
            </aside>

            {/* Paginación */}
            <PaginationControl
              changePage={(page) => setCurrentPage(page)}
              next={true}
              limit={pageSize}
              page={currentPage}
              total={totalPages}
            />
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
