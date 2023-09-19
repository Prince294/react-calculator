import { useEffect } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import './styles/style.scss';
import http from './services/utility';
import { paths } from './utils/path.js';


function App() {

  useEffect(() => {
    registerUser();
  }, [])

  const registerUser = async () => {
    if (!localStorage.getItem("app-token")) {
      await http.get(paths.register).then(res => {
        localStorage.setItem("app-token", res?.data?.user_token)
      }).catch(err => {
        console.log(err)
      })
    }
  }

  return (
    <Calculator />
  );
}

export default App;
