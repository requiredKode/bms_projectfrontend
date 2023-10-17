import React, { forwardRef, useEffect, useRef } from 'react';

const DivTextArea = forwardRef(
  (
    {
      placeholder = '',
      id,
      value,
      className,
      required,
      isFocused,
      handleChange,
      icon = 'user',
      name,
    },
    ref
  ) => {
    const textareaRef = ref || useRef();

    useEffect(() => {
      if (isFocused) {
        textareaRef.current.focus();
      }
    }, [isFocused]);

    return (
      <div className='input-group mb-3'>
        <span className='input-group-text'>
          <i className={'fa-solid ' + icon}></i>
        </span>
        <textarea
          placeholder={placeholder}
          id={id}
          name={name}
          value={value}
          className={className}
          ref={textareaRef}
          required={required}
          onChange={(e) => handleChange(e)}
        />
      </div>
    );
  }
);

export default DivTextArea;
