import { BrowserRouter, Routes, Route } from "react-router-dom";
import NAV from './components/Nav';

import HOME from './views/home/home';

import SERVICE from './views/service/index';
import COUNTRY from './views/country/index';
import DISEASE from './views/disease/index';
import GENDER from './views/gender/index';
import IDENTITYCARD from './views/identityCard/index';
import MONEY from './views/money/index';
import SUPPLIER from './views/supplier/index';
import TREATMENT from './views/treatment/index';
import APPOINTMENTSCHEDULE from './views/appointmentSchedule/index'
import PATIENTCASE from './views/patientCase/index';
import FILES from './views/files/index';

import LOGIN from './views/Login';
import REGISTER from './views/Register';

import PROTECTEDROUTES from './components/ProtectedRoutes';

function App() {

  return (
    <BrowserRouter>
      <NAV />
      <Routes>
        <Route path="/login" element={<LOGIN />} />
        <Route path="/register" element={<REGISTER />} />

        <Route element={<PROTECTEDROUTES />}>
          <Route path="/home" element={<HOME />} />
          <Route path="/service" element={<SERVICE />} />
          <Route path="/country" element={<COUNTRY />} />
          <Route path="/disease" element={<DISEASE />} />
          <Route path="/gender" element={<GENDER />} />
          <Route path="/identityCard" element={<IDENTITYCARD />} />
          <Route path="/money" element={<MONEY />} />
          <Route path="/supplier" element={<SUPPLIER />} />
          <Route path="/treatment" element={<TREATMENT />} />
          <Route path="/appointmentSchedule" element={<APPOINTMENTSCHEDULE />} />
          <Route path="/patientCase" element={<PATIENTCASE />} />
          <Route path="/files" element={<FILES />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
