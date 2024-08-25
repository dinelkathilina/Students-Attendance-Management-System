import 'flowbite';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import 'flowbite/dist/flowbite.min.css';
function App() {

  useEffect(() => {
    initFlowbite();
    
  }, []);
  return (
    <>
    <Outlet />
    </>
  )
}

export default App
