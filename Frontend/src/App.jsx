import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FormProvider } from "./context/FormContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import BlueprintForm from "./pages/BlueprintForm";

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/blueprint-form" element={<BlueprintForm />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;
