import {
  RouterProvider,
} from "react-router-dom";
import { router } from "./router";
import Header from "./components/header";
import { ModalProvider } from "./context/modalContext";

function App() {

  return (
    <>
      <div>
      <ModalProvider>
        <Header />
        <RouterProvider router={router} />
        </ModalProvider>
      </div>
    </>
  )
}

export default App
