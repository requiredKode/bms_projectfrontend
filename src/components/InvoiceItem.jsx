import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import CustomSelect from "./CustomSelect";

const ItemRow = ({
  item,
  onDelEvent,
  currency,
  services,
  onUpdateItem,
}) => {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [code, setCode] = useState("");
  const [descriptionService, setDescriptionService] = useState("");
  const [cost, setCost] = useState("");

  const handleDelEvent = () => {
    onDelEvent(item);
  };

  useEffect(() => {
    // Actualizar el costo cuando cambie el servicio seleccionado
    if (selectedService) {
      setCode(selectedService.code || "");
      setDescriptionService(selectedService.descriptionService || "");
      setCost(selectedService?.cost || 0)
    }
  }, [selectedService]);

  useEffect(() => {
    // Cuando se cargan los servicios, establece el primer servicio como seleccionado
    if (services.length > 0) {
      const initialService = services[0];
      setSelectedService(initialService);
      setServiceId(initialService.id);
      handleServiceChange(initialService.id);
    }
  }, [services]);

  const handleServiceChange = (selectedValue) => {
    const selectedService = services.find(
      (service) => service.id === parseInt(selectedValue)
    );
  
    setSelectedService(selectedService);
  
  };
  
  // Llamar a la función onUpdateItem para devolver los items actualizados
  useEffect(() => {
    onUpdateItem(item.id, {
      id: item.id,
      code,
      serviceId: serviceId|| "",
      name: selectedService?.serviceName || "",
      description: descriptionService,
      quantity: item.quantity,
      cost,
    });
  }, [code, descriptionService, cost]);

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          cellData={{
            type: "text",
            name: "code",
            placeholder: "Cod. CAByS",
            value:code,
            id:  item.id,
          }}
        />
        <CustomSelect
          name="service"
          value={serviceId}
          options={services.map((service) => ({
            id: service.id,
            label: service.serviceName,
          }))}
          handleChange={(e) => {
            setServiceId(e.target.value);
            handleServiceChange(e.target.value);
          }}
          displayProperty="label"
          required
        />

        <EditableField
          cellData={{
            type: "text",
            name: "description",
            placeholder: "descripcion",
            value: descriptionService,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "135px" }}>
        <EditableField
          cellData={{
            leading: currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            precision: 2,
            textAlign: "text-end",
            value: cost,
            id: item.id,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={handleDelEvent}
          style={{ height: "33px", width: "33px", padding: "5.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

const InvoiceItem = ({
  onRowAdd,
  onRowDel,
  currency,
  items,
  services,
  onUpdateItems,
}) => {
  const handleRowDel = (itemToDelete) => {
    onRowDel(itemToDelete);
  };

  const handleRowAdd = () => {
    onRowAdd();
  };

  // Función para actualizar los items en el componente principal
  const handleUpdateItem = (itemId, updatedItem) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? updatedItem : item
    );
    onUpdateItems(updatedItems);
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>CANT</th>
            <th>PRECIO</th>
            <th className="text-center">ACCION</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onDelEvent={handleRowDel}
              currency={currency}
              services={services}
              onUpdateItem={handleUpdateItem}
            />
          ))}
        </tbody>
      </Table>
      <Button className="fw-bold" onClick={handleRowAdd}>
        Agregar Item
      </Button>
    </div>
  );
};

export default InvoiceItem;
