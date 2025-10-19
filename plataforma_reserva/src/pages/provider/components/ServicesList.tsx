import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const ServicesList = () => {
  const { token, userData } = useAuth();
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/services/all-user-services/${userData!.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log(data);
    
    setServices(data);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este serviço?")) return;
    await fetch(`http://localhost:3000/api/v1/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  console.log(services);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meus Serviços</h2>
        <Link to="/dashboardProvider/services/new" className="bg-green-600 text-white px-4 py-2 rounded">
          + Novo Serviço
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nome</th>
            <th className="p-2">Descrição</th>
            <th className="p-2">Preço (Kz)</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {!services ? (
            
              <tr className="text-red-500 text-center">
              <td>Sem Serviços cadastrados</td>  
              </tr>
            
          ) : (
            <div>

              {services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.description}</td>
                  <td className="p-2">{s.price.toFixed(2)}</td>
                  <td className="p-2 space-x-2">
                    <Link
                      to={`/dashboardProvider/services/edit/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};
