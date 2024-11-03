import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ModalProvider } from './context/modalContext';
import NavListMenu from './components/header/nav';

function App() {
  return (
    <>
      <div>
        <ModalProvider>
          <NavListMenu />
          <RouterProvider router={router} />
        </ModalProvider>
      </div>
    </>
  );
}

export default App;
