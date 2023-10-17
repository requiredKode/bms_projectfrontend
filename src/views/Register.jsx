import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../functions';
import DivInput from '../components/DivInput';

const Register = () => {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = {
      companyName: companyName,
      name: name,
      username: username,
      email: email,
      password: password,
    };
    try {
      const res = await sendRequest('POST', '/auth/register', form, 'Felicidades, Ya puedes Iniciar Sesión', '', false);
      if (res.data) {
        navigate('/login');
      }
    } catch (error) {
      // Manejar el error aquí si es necesario
      console.error(error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border border-dark'>
            <div className='card-header bg-dark border border-dark text-white'>
              REGISTRO
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit}>

                <DivInput
                  type='text'
                  icon='fa-building'
                  value={companyName}
                  className='form-control'
                  placeholder='Nombre Empresa'
                  required='required'
                  handleChange={(e) => handleInputChange(e, setCompanyName)}
                />

                <DivInput
                  type='text'
                  icon='fa-user'
                  value={name}
                  className='form-control'
                  placeholder='Primer Nombre'
                  required='required'
                  handleChange={(e) => handleInputChange(e, setName)}
                />

                <DivInput
                  type='text'
                  icon='fa-user'
                  value={username}
                  className='form-control'
                  placeholder='Username'
                  required='required'
                  handleChange={(e) => handleInputChange(e, setUsername)}
                />

                <DivInput
                  type='email'
                  icon='fa-at'
                  value={email}
                  className='form-control'
                  placeholder='Email'
                  required='required'
                  handleChange={(e) => handleInputChange(e, setEmail)}
                />

                <DivInput
                  type='password'
                  icon='fa-key'
                  value={password}
                  className='form-control'
                  placeholder='Password'
                  required='required'
                  handleChange={(e) => handleInputChange(e, setPassword)}
                />

                <div className='d-grid col-10 mx-auto'>
                  <button className='btn btn-dark'>
                    <i className='fa-solid fa-door-open'></i> Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
