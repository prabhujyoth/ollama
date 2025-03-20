import { Link, Outlet } from "react-router";
import Nav from "./components/Nav";

function App() {
  return (
    <div className="flex flex-col h-full">
      <Nav />
      <div className="overflow-auto h-52 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
