import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";

// Tipagem opcional para os componentes se quiser
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceDashboard from "./pages/ServiceDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import { TransactionHistory } from "./components/TransactionHistory";
import { ServiceList } from "./components/ServiceList";
import { ProfileEditor } from "./components/ProfileEditor";
import { BalanceTransfer } from "./components/BalanceTransfer";
import SelectRole from "./pages/SelectRole";

function App() {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && userType === "Client" ? (
              <Navigate to="/dashboardClient" />
            ) : isAuthenticated && userType === "Provider" ? (
              <Navigate to="/dashboardProvider" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={
              <SelectRole />
          }
        />
        <Route
          path="/register"
          element={
              <Register />
          }
        />

        {/* SERVIÇOS */}
        {/* <Route path="/service" element={isAuthenticated && userType === "Provider" ? ( <ServiceDashboard />) : ( <Navigate to="/login" /> )} /> */}
        <Route path="/service" element={ <ServiceDashboard />} />

        <Route path="/dashboardClient" element={isAuthenticated && userType === "Client" ? (<ClientDashboard />): (<Navigate to={'/'} />)}>
          <Route index element={<ServiceList />} />
          <Route path="transaction" element={<TransactionHistory />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="transfer" element={<BalanceTransfer />} />

        </Route>

        
      </Routes>
    </Router>
  );

}

export default App;
