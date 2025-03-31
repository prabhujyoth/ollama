import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router";
import LLM from "./pages/LLM.jsx";
import SIP from "./pages/SIP.jsx";
import Stocks from "./pages/Stocks.jsx";
import SWP from "./pages/SWP.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LLM />} />
            <Route path="sip" element={<SIP />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="swp" element={<SWP />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
