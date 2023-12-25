import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";

function DropDownNav() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="" id="dropdown-basic">
        Configuracion Inicial
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <Link to="/country" className="nav-link">
            Pais
          </Link>
        </Dropdown.Item>
        {/* <Dropdown.Item>
          <Link to="/disease" className="nav-link">
            Enfermedad
          </Link>
        </Dropdown.Item> */}
        <Dropdown.Item>
          <Link to="/gender" className="nav-link">
            Genero
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/identityCard" className="nav-link">
            Identificacion
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/money" className="nav-link">
            Moneda
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/supplier" className="nav-link">
            Proveedor
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/files" className="nav-link">
            Archivos
          </Link>
        </Dropdown.Item>
      { /*  <Dropdown.Item>
          <Link to="/WABot" className="nav-link">
            WABot
          </Link>
        </Dropdown.Item>*/} 
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDownNav;
