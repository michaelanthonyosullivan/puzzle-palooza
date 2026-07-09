import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <footer className="fixed bottom-2 left-0 right-0 z-50 text-center pointer-events-none">
      <span className="font-body text-xs italic text-slate-700/80">
        © MMXXVI Michael O'Sullivan
      </span>
    </footer>
  </BrowserRouter>
);

export default App;
