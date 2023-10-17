import React from 'react';

/**
 * tamanio del modal
 * 1. `sm` (pequeño)
 * 2. `md` (mediano)
 * 3. `lg` (grande)
 * 4. `xl` (extra grande)
 * @param {*} param0 
 * @returns 
 */
const Modal = ({ children, title, modal, ancho }) => {
  // Clase CSS para el ancho del modal
  const modalWidthClass = `modal-dialog ${ancho ? `modal-${ancho}` : ''}`;

  return (
    <div className='modal fade' id={modal} tabIndex='-1' aria-hidden='true'>
        <div className={modalWidthClass}>
            <div className='modal-content'>
                <div className='modal-header'>
                    <label className='h5'>{title}</label>
                    <button className='btn-close' type='button' data-bs-dismiss='modal' aria-label='Close'></button>
                </div>
                {children}
            </div>
        </div>
    </div>
  );
}

export default Modal;


