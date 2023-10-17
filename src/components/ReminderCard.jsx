import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Icono de campana para recordatorio
import Card from 'react-bootstrap/Card';

const ReminderCard = ({ title, content }) => {
  return (
    <Card className="mb-3">
      <Card.Header>
        <FontAwesomeIcon icon={faBell} /> {title}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {content}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReminderCard;
