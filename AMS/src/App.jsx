import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import 'flowbite/dist/flowbite.min.css';
import { SessionProvider } from './Context/SessionContext';
function App() {

  useEffect(() => {
    initFlowbite();
    
  }, []);
  return (
    <>
    <SessionProvider>

    <Outlet />
    </SessionProvider>
    </>
  )
}

export default App
