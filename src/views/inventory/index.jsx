import { useEffect, useState, useRef } from "react";
import DivAdd from "../../components/DivAdd";
import DivTable from "../../components/DivTable";
import DivInput from "../../components/DivInput";
import Modal from "../../components/Modal";
import { getCurrentDate, confirmation, sendRequest, formatDateToDDMMYYYY, formatDateToYYYYMMDD } from "../../functions";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";
import DivTextArea from "../../components/DivTextArea";
import DivSelect from "../../components/DivSelect";
import Checkbox from "../../components/DivCheckBox";

const Inventory = () => {
  const history = useNavigate();

  const [inventories, setInventories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [cabys, setCabys] = useState("");
  const [inventoryName, setInventoryName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [measurementId, setMeasurementId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [grossCost, setGrossCost] = useState("");
  const [netCost, setNetCost] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [stockAlert, setStockAlert] = useState(false);
  const [minimumQuantity, setMinimumQuantity] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

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
    const currentDate = getCurrentDate();
    setPurchaseDate(currentDate);
    setUpdatedAt(currentDate);
    getInventory(1);
    fetchData("measurement", setMeasurements);
    fetchData("supplier", setSuppliers);
  }, []);

  const getInventory = async (page) => {
    try {
      const res = await sendRequest(
        "GET",
        `/inventory?page=${page}&per_page=${pageSize}`,
        "",
        "",
        "",
        true
      );
      setInventories(res.data);
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
    confirmation(name, "/inventory/" + id, "/inventory");
  };

  const clear = () => {
    setCode("");
    setCabys("");
    setInventoryName("");
    setDescription("");
    setQuantity("");
    setMeasurementId("1");
    setGrossCost("");
    setNetCost("");
    setSupplierId("1");
    setTotalCost("");
    setStockAlert(false);
    setMinimumQuantity("");
  };

  const openModal = (
    OPERATION,
    ID,
    CODE,
    CABYS,
    INVENTORYNAME,
    DESCRIPTION,
    QUANTITY,
    MEASUREMENTID,
    PURCHASEDATE,
    GROSSCOST,
    NETCOST,
    SUPPLIERID,
    TOTALCOST,
    STOCKALERT,
    MINIMUMQUANTITY,
    UPDATEDAT
  ) => {
    clear();

    const formattedPurchaseDate = formatDateToYYYYMMDD(PURCHASEDATE);
    const formattedUpdatedAt = formatDateToYYYYMMDD(UPDATEDAT);

    setTimeout(() => nameInputRef.current.focus(), 600);
    setOperation(OPERATION);
    setId(ID);
    if (OPERATION === 1) {
      setTitle("Nuevo Producto");
    } else {
      setTitle("Actualizar Producto");
      setCode(CODE);
      setCabys(CABYS);
      setInventoryName(INVENTORYNAME);
      setDescription(DESCRIPTION);
      setQuantity(QUANTITY);
      setMeasurementId(MEASUREMENTID);
      setPurchaseDate(formattedPurchaseDate);
      setGrossCost(GROSSCOST);
      setNetCost(NETCOST);
      setSupplierId(SUPPLIERID);
      setTotalCost(TOTALCOST);
      setStockAlert(STOCKALERT);
      setMinimumQuantity(MINIMUMQUANTITY);
      setUpdatedAt(formattedUpdatedAt);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    method = operation === 1 ? "POST" : "PUT";
    url = operation === 1 ? "/inventory" : "/inventory/" + id;
    const form = {
      code: code,
      cabys: cabys,
      inventoryName: inventoryName,
      description: description,
      quantity: quantity,
      measurementId: measurementId,
      purchaseDate: purchaseDate,
      grossCost: grossCost,
      netCost: netCost,
      supplierId: supplierId,
      totalCost: totalCost,
      stockAlert: stockAlert,
      minimumQuantity: minimumQuantity,
      updatedAt: updatedAt,
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
        getInventory(1);
        setTimeout(() => nameInputRef.current.focus(), 3000);
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const goPage = (p) => {
    setPage(p);
    getInventory(p);
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
          data-bs-target="#modalInventory"
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
              <th>Producto</th>
              <th>Cantidad Disponible</th>
              <th>Fecha Actualizacion</th>
              <th>Fecha Compra</th>
              <th>Costo Total</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {inventories.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.inventoryName}</td>
                <td>{row.quantity}</td>
                <td>{formatDateToDDMMYYYY(row.updatedAt)}</td>
                <td>{formatDateToDDMMYYYY(row.purchaseDate)}</td>
                <td>{row.totalCost}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalInventory"
                    onClick={() =>
                      openModal(
                        2,
                        row.id,
                        row.code,
                        row.cabys,
                        row.inventoryName,
                        row.description,
                        row.quantity,
                        row.measurementId,
                        row.purchaseDate,
                        row.grossCost,
                        row.netCost,
                        row.supplierId,
                        row.totalCost,
                        row.stockAlert,
                        row.minimumQuantity,
                        row.updatedAt
                      )
                    }
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteInventory(row.id, row.inventoryName)}
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
      <Modal title={title} modal="modalInventory">
        <div className="modal-body">
          <form onSubmit={save}>
            <DivInput
              type="text"
              icon="fa-barcode"
              value={code}
              className="form-control"
              placeholder="Codigo"
              required="required"
              handleChange={(e) => setCode(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-barcode"
              value={cabys}
              className="form-control"
              placeholder="Codigo Cabys"
              required="required"
              ref={nameInputRef}
              handleChange={(e) => setCabys(e.target.value)}
            />
            <DivInput
              type="text"
              icon="fa-box"
              value={inventoryName}
              className="form-control"
              placeholder="Producto"
              required="required"
              handleChange={(e) => setInventoryName(e.target.value)}
            />
            <DivTextArea
              type="text"
              icon="fa-info-circle"
              value={description}
              className="form-control"
              placeholder="Descripcion"
              required="required"
              handleChange={(e) => setDescription(e.target.value)}
            />
            <p>Cantidad:</p>
            <DivInput
              type="number"
              icon="fa-arrow-up-9-1"
              value={quantity}
              className="form-control"
              placeholder="Cantidad"
              required="required"
              handleChange={(e) => setQuantity(e.target.value)}
            />
            <p>Unidad de Medida:</p>
            <DivSelect
              icon="fa-balance-scale"
              name="measurementId"
              value={measurementId}
              className="form-select"
              options={measurements}
              handleChange={(e) => setMeasurementId(e.target.value)}
              displayProperty="measurementName"
            />
            <p>Fecha de Compra:</p>
            <DivInput
              type="date"
              icon="fa-calendar"
              value={purchaseDate}
              className="form-control"
              placeholder="Fecha Compra"
              required="required"
              handleChange={(e) => setPurchaseDate(e.target.value)}
            />
            <DivInput
              type="number"
              icon="fa-coins"
              value={grossCost}
              className="form-control"
              placeholder="Costo Bruto"
              required="required"
              handleChange={(e) => setGrossCost(e.target.value)}
            />
            <DivInput
              type="number"
              icon="fa-coins"
              value={netCost}
              className="form-control"
              placeholder="Costo Neto"
              required="required"
              handleChange={(e) => setNetCost(e.target.value)}
            />
            <DivSelect
              icon="fa-truck-field"
              name="supplierId"
              value={supplierId}
              className="form-select"
              options={suppliers}
              handleChange={(e) => setSupplierId(e.target.value)}
              displayProperty="supplierName"
            />
            <DivInput
              type="number"
              icon="fa-coins"
              value={totalCost}
              className="form-control"
              placeholder="Costo Total"
              required="required"
              handleChange={(e) => setTotalCost(e.target.value)}
            />
            <Checkbox
              id="stockAlert"
              label="Alerta de Stock Bajo"
              checked={stockAlert}
              onChange={() => setStockAlert(!stockAlert)}
            />
            <br />
            <DivInput
              type="number"
              icon="fa-arrow-down-9-1"
              value={minimumQuantity}
              className="form-control"
              placeholder="Cantidad Minima"
              required="required"
              handleChange={(e) => setMinimumQuantity(e.target.value)}
            />

            <p>Fecha de Actualizacion:</p>
            <DivInput
              type="date"
              icon="fa-calendar"
              value={updatedAt}
              className="form-control"
              placeholder="Fecha Actualizacion"
              required="required"
              handleChange={(e) => setUpdatedAt(e.target.value)}
            />
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
