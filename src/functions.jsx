import Swal from "sweetalert2";
import storage from "./storage/storage";
import axios from 'axios';

// Función para mostrar una alerta
export const show_alert = (message, icon) => {
  Swal.fire({
    title: message,
    icon: icon,
    buttonsStyling: true
  });
};

// Función para configurar el token de autorización en las solicitudes Axios
export const configureAuthHeaders = () => {
    const authToken = storage.get('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

// Función para enviar una solicitud y manejar errores
export const sendRequest = async (method, url, data, successMessage = '', redirectTo = '', token = true) => {
    if (token) {
      configureAuthHeaders();
    }
  
    try {
      const response = await axios({
        method: method,
        url: url,
        data: data
      });
  
      const responseData = response.data;
  
      if (successMessage) {
        show_alert(successMessage, 'success');
      }
  
      if (redirectTo) {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 2000);
      }
  
      return responseData;
  } catch (error) {
    // Manejar errores de red u otros errores
    const errorDescription = error.response ? error.response.data.error : '';

    show_alert(errorDescription || 'Error de conexión con el servidor', 'error');

    throw error;
  }
};

// Función para mostrar una confirmación antes de realizar una acción
export const confirmation = async (name, url, redir) => {
  const alert = Swal.mixin({ buttonsStyling: true });
  const result = await alert.fire({
    title: `¿Estás seguro que deseas eliminar ${name} ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '<i class="fa-solid fa-check"></i> Yes, delete',
    cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancel'
  });

  if (result.isConfirmed) {
    await sendRequest('DELETE', url, {},'BORRADO SATISFACTORIAMENTE', redir);
  }
};

// Definir una función para obtener la fecha actual en el formato 'YYYY-MM-DD'
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateToYYYYMMDD = (dateTimeString) => {
  const date = new Date(dateTimeString);
  date.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateToDDMMYYYY = (dateTimeString) => {
  const date = new Date(dateTimeString);
  date.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};




export default show_alert;

