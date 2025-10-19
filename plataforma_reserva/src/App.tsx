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
import ClientDashboard from "./pages/client/ClientDashboard";
import { TransactionHistory } from "./pages/client/components/TransactionHistory";
import { ServiceList } from "./pages/client/components/ServiceList";
import { ProfileEditor } from "./pages/client/components/ProfileEditor";
import { BalanceTransfer } from "./pages/client/components/BalanceTransfer";
import SelectRole from "./pages/SelectRole";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import { Home } from "./pages/provider/components/Home";
import { ServicesList } from "./pages/provider/components/ServicesList";
import { ServiceForm } from "./pages/provider/components/ServiceForm";
import { ServiceEdit } from "./pages/provider/components/ServiceEdit";
import { ProfileProviderEditor } from "./pages/provider/components/ProfileProviderEditor";
import { HomeClient } from "./pages/client/components/HomeClient";

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
        <Route path="/signup" element={<SelectRole />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboardClient"
          element={
            isAuthenticated && userType === "Client" ? (
              <ClientDashboard />
            ) : (
              <Navigate to={"/"} />
            )
          }
        >
          <Route index element={<HomeClient />} />
          <Route path="services" element={<ServiceList />} />
          <Route path="transaction" element={<TransactionHistory />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="transfer" element={<BalanceTransfer />} />
        </Route>

        <Route
          path="/dashboardProvider"
          element={
            isAuthenticated && userType === "Provider" ? (
              <ProviderDashboard />
            ) : (
              <Navigate to={"/"} />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/edit/:id" element={<ServiceEdit />} />
          <Route path="profile" element={<ProfileProviderEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
