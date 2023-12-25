import React from "react";
import Form from "react-bootstrap/Form";

const CustomSelect = ({
  label,
  value,
  name,
  options,
  handleChange,
  onSelectChange,
  displayProperty,
  ...rest
}) => {

const handleSelectChange = (e) => {
  handleChange(e);
  onSelectChange && onSelectChange(e);
};

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Select
        name={name}
        value={value}
        onChange={handleSelectChange}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option[displayProperty]}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default CustomSelect;
