import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState<"Client" | "Provider" | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) return;
    navigate("/register", { state: { user_role: selectedRole } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Junte-se como cliente ou prestador
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedRole("Client")}
            className={`border rounded-lg p-6 text-center ${
              selectedRole === "Client" ? "border-green-600 bg-green-50" : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-lg">Sou um cliente</h3>
            <p className="text-sm text-gray-600">Contratando para um projeto</p>
          </button>

          <button
            onClick={() => setSelectedRole("Provider")}
            className={`border rounded-lg p-6 text-center ${
              selectedRole === "Provider" ? "border-green-600 bg-green-50" : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-lg">Sou um prestador</h3>
            <p className="text-sm text-gray-600">Oferecendo serviços</p>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
            selectedRole ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Criar uma conta
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
};

export default SelectRole;
