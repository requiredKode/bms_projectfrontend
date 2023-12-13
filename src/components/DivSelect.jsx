import React, { forwardRef, useEffect, useRef } from "react";

export default forwardRef(
  (
    {
      options = [],
      icon = "user",
      name,
      id,
      value,
      className,
      required,
      isFocused,
      handleChange,
      onSelectChange,
      displayProperty,
    },
    ref
  ) => {
    const input = ref ? ref : useRef();
    useEffect(() => {
      if (isFocused) {
        input.current.focus();
      }
    }, []);

    const handleSelectChange = (e) => {
      handleChange(e);
      onSelectChange && onSelectChange(e);
    };
    
    return (
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className={"fa-solid " + icon}></i>
        </span>
        <select
          name={name}
          id={id}
          value={value}
          className={className}
          ref={input}
          required={required}
          onChange={handleSelectChange}
        >
          {options.map((op) => (
            <option value={op.id} key={op.id}>
              {op[displayProperty]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
