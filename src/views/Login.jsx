import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRequest } from '../functions';
import DivInput from '../components/DivInput';
import storage from '../storage/storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = { email: email, password: password };
    
    try {
      const res = await sendRequest('POST', '/auth/login', form, 'Inicio Correcto', '', false);
  
      if (res.data) {
        storage.set('authToken', res.data.token);
        storage.set('authUser', res.data.user);
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-md-4 offset-md-4'>
          <div className='card border border-dark'>
            <div className='card-header bg-dark border border-dark text-white'>
              INICIO DE SESION
            </div>
            <div className='card-body'>
              <form onSubmit={handleLogin}>
                <DivInput
                  type='email'
                  icon='fa-at'
                  value={email}
                  className='form-control'
                  placeholder='Email'
                  required='required'
                  handleChange={(e) => setEmail(e.target.value)}
                />
                <DivInput
                  type='password'
                  icon='fa-key'
                  value={password}
                  className='form-control'
                  placeholder='Password'
                  required='required'
                  handleChange={(e) => setPassword(e.target.value)}
                />
                <div className='d-grid col-10 mx-auto'>
                  <button className='btn btn-dark'>
                    <i className='fa-solid fa-door-open'></i> Entrar
                  </button>
                </div>
              </form>
              <Link to='/register'>
                <br/>
                <i className='fa-solid fa-user-plus'></i> Registro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
