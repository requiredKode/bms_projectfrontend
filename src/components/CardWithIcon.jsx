import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'; // Reemplaza con el icono que desees
import Card from 'react-bootstrap/Card';

const CardWithIcon = ({ title, icon, color }) => {
  return (
    <Card bg={color} text="white" className="mb-3">
      <Card.Header>
        <FontAwesomeIcon icon={icon} /> {title}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Aquí puedes agregar contenido adicional para la tarjeta.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardWithIcon;
