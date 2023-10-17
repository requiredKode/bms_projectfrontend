import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardWithIcon from '../../components/CardWithIcon';
import ReminderCard from '../../components/ReminderCard';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const history = useNavigate(); // Instancia de useHistory

  const [reminders, setReminders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Número de recordatorios por página
  const [totalPages, setTotalPages] = useState(0);
 
  // Función para obtener los recordatorios de ejemplo (reemplazar con tu lógica de API)
  const fetchReminders = (page) => {
    // Simular una respuesta de la API con datos de ejemplo
    const fakeResponse = {
      data: [
        { id: 1, title: 'Recordatorio 1', content: 'Contenido del recordatorio 1' },
        { id: 2, title: 'Recordatorio 2', content: 'Contenido del recordatorio 2' },
        // Agregar más recordatorios según sea necesario
      ],
      totalPages: 3, // Número total de páginas
    };

    setTimeout(() => {
      setReminders(fakeResponse.data);
      setTotalPages(fakeResponse.totalPages);
    }, 1000);
  };

  useEffect(() => {
    fetchReminders(currentPage);
  }, [currentPage]);

  // Función para eliminar un recordatorio (reemplazar con tu lógica)
  const deleteReminder = (id) => {
    console.log(`Eliminar recordatorio con ID: ${id}`);
  };

  return (
    <Container>
      <Row>
        {/* Contenido principal */}
        <Col md={8}>
          <Container className="rounded p-3 shadow mb-4 m-3">
            {/* Encabezado */}
            <header>
              <h1>Atajos</h1>
              {/* Contenido del encabezado (CardWithIcon) */}
              <CardWithIcon title="Opción 1" icon="fa-coffee" color="primary" />
              <CardWithIcon title="Opción 2" icon="fa-heart" color="success" />
              <CardWithIcon title="Opción 3" icon="fa-star" color="danger" />
              {/* Agrega más tarjetas CardWithIcon aquí */}
            </header>
          </Container>
        </Col>

        {/* Aside (RecordatorioCard) */}
        <Col md={4}>
          <Container className="rounded p-3 shadow mb-4 m-3">
            <h1>Proximas Citas</h1>
            <aside style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
              {/* Lista de recordatorios */}
              {reminders.map((reminder) => (
                <div key={reminder.id} className="mb-3">
                  <ReminderCard title={reminder.title} content={reminder.content}>
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

      {/* Contenido adicional */}
      <Row>
        <Col md={8}>
          <Container className="rounded p-3 shadow mb-4 m-3">
            {/* Encabezado */}
            <header>
              <h1>Recurrencia del dia</h1>
              {/* Contenido del encabezado (CardWithIcon) */}
              <CardWithIcon title="Opción 1" icon="fa-coffee" color="primary" />
            </header>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
