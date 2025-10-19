import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined} from '@ant-design/icons';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const ServicesList = () => {
  const { token, userData, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/services/all-user-services/${userData!.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.status === 401) {
        alert("Usuário não autenticado");
        logout();
      }

      setServices(data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Meus Serviços</h2>
        <Link
          to="/dashboardProvider/services/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          <PlusCircleOutlined size={18} /> Novo Serviço
        </Link>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">A carregar serviços...</p>}

      {/* Empty State */}
      {!loading && services.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>❌ Nenhum serviço cadastrado ainda.</p>
          <Link
            to="/dashboardProvider/services/new"
            className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Criar Primeiro Serviço
          </Link>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition-all duration-200"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {service.name}
              </h3>
            </div>

            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {service.description}
            </p>
            <div className="mt-4 text-right">
              <span className=" bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-md ">
                {service.price.toFixed(2)} Kz
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Link
                to={`/dashboardProvider/services/edit/${service.id}`}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
              >
                
                <EditOutlined size={16} /> Editar
              </Link>
              <button
                onClick={() => deleteService(service.id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition cursor-pointer"
              >
                <DeleteOutlined size={16} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
