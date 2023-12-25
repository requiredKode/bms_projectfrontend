import { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import Modal from "../../components/Modal";
import { confirmation, sendRequest } from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";
import DivSelect from "../../components/DivSelect";

const Inventory = () => {
  const history = useNavigate();

  const [servicesinventories, setServicesInventories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [services, setServices] = useState([]);
  const [id, setId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [operation, setOperation] = useState("");
  const [title, setTitle] = useState("");
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  const nameInputRef = useRef();
  const closeRef = useRef();

  let method = "";
  let url = "";

  useEffect(() => {
    getServiceInventory(1);
    fetchData("service", setServices);
    fetchData("inventory", setInventories);
  }, []);

  const getServiceInventory = async (page) => {
    try {
      const res = await sendRequest(
        "GET",
        `/serviceinventory?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );
      setServicesInventories(res.data);
      setRows(res.total);
      setPageSize(res.per_page);
      setClassTable("");
      setClassLoad("d-none");
    } catch (error) {
      handleErrors(error);
    }
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await sendRequest(
        "GET",
        `/${endpoint}?page=${page}&per_page=${100}`,
        "",
        "",
        "",
        true
      );
      setter(res.data);
    } catch (error) {
      handleErrors(error);
    }
  };

  const deleteInventory = (id, name) => {
    confirmation(name, "/serviceinventory/" + id, "/serviceinventory");
  };

  const clear = () => {
    setServiceId("");
    setInventoryId("");
    setQuantity("");
  };

  const openModal = (OPERATION, ID, SERVICEID, INVENTORYID, QUANTITY) => {
    clear();

    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle("Nuevo Producto Asociado");
    } else {
      setTitle("Actualizar Producto Asociado");

      setServiceId(SERVICEID);
      setInventoryId(INVENTORYID);
      setQuantity(QUANTITY);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? "POST" : "PUT";
    url = operation === 1 ? "/serviceinventory" : "/serviceinventory/" + id;
    const form = {
      serviceId: serviceId !== "" ? serviceId : services[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      inventoryId: inventoryId !== "" ? inventoryId : inventories[0].id, // Usa el valor actualmente mostrado o el primer valor en el arreglo
      quantity: quantity,
    };

    try {
      const res = await sendRequest(
        method,
        url,
        form,
        "GUARDADO CON EXITO",
        ""
      );
      if (method === "PUT" && res.data && res.data.companyId !== null) {
        closeRef.current.click();
      }
      if (res.data && res.data.companyId !== null) {
        clear();
        setPage(1);
        getServiceInventory(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getServiceInventory(p);
  };

  const handleErrors = (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "NOT_SESSION"
    ) {
      localStorage.clear();
      history.push("/login");
    } else {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="container-fluid">
      <DivAdd>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modalServiceInventory"
          onClick={() => openModal(1)}
        >
          <i className="fa-solid fa-circle-plus"></i> Agregar
        </button>
      </DivAdd>
      <DivTable col="8" off="2" classLoad={classLoad} classTable={classTable}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Servicio</th>
              <th>Producto Asociado</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {servicesinventories.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.service.serviceName}</td>
                <td>{row.inventory.inventoryName}</td>
                <td>{row.quantity}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalServiceInventory"
                    onClick={() =>
                      openModal(
                        2,
                        row.id,
                        row.serviceId,
                        row.inventoryId,
                        row.quantity
                      )
                    }
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deleteInventory(row.id, row.inventory.inventoryName)
                    }
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DivTable>
      <PaginationControl
        changePage={(page) => goPage(page)}
        next={true}
        limit={pageSize}
        page={page}
        total={rows}
      />
      <Modal title={title} modal="modalServiceInventory">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivSelect
              icon="fa-handshake"
              name="serviceId"
              value={serviceId}
              className="form-select"
              options={services}
              handleChange={(e) => setServiceId(e.target.value)}
              displayProperty="serviceName"
            />
            <DivSelect
              icon="fa-box"
              name="inventoryId"
              value={inventoryId}
              className="form-select"
              options={inventories}
              handleChange={(e) => setInventoryId(e.target.value)}
              displayProperty="inventoryName"
            />
            <DivInput
              type="number"
              icon="fa-arrow-up-9-1"
              value={quantity}
              className="form-control"
              placeholder="Cantidad a Rebajar"
              required="required"
              handleChange={(e) => setQuantity(e.target.value)}
            />
            <br />

            <div className="d-grid col-10 mx-auto">
              <button className="btn btn-success">
                <i className="fa-solid fa-save"></i> Guardar
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-dark"
            data-bs-dismiss="modal"
            ref={closeRef}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
