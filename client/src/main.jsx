//import các thư viện, các file
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { WebContextProvider } from "./context/WebContext.jsx";


createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <WebContextProvider>
        <App />
      </WebContextProvider>
    </BrowserRouter>
);
