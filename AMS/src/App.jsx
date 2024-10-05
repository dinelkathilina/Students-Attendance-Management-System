import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import 'flowbite/dist/flowbite.min.css';
import { SessionProvider } from './Context/SessionContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  useEffect(() => {
    initFlowbite();
    
  }, []);
  return (
    <>
    <SessionProvider>

    <Outlet />
    <ToastContainer position="top-right" autoClose={3000} />
    </SessionProvider>
    </>
  )
}

export default App
