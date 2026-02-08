import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ActorDetails from "./pages/ActorDetails";
import Films from "./pages/Films";
import FilmDetails from "./pages/FilmDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/actors/:id" element={<ActorDetails />} />
        <Route path="/films" element={<Films />} />
        <Route path="/films/:id" element={<FilmDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
