import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export const ServiceList = () => {
  const {token, logout} = useAuth()
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.status === 401) {
          setError("Usuário não autenticado");
          logout()
        }

        if (!res.ok) {
          throw new Error("Erro ao buscar serviços");
        }

        const data: Service[] = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleHire = (serviceId: string) => {
    // lógica para contratar serviço
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {
        services.length !== 0 ? (
          <>
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{service.title}</h3>
              <p>{service.description}</p>
              <p className="text-sm text-gray-600">R$ {service.price}</p>
              <button
                onClick={() => handleHire(service.id)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Contratar
              </button>
            </div>
          ))}
          </>

        ) : (
          <p className="text-red-500">Sem Serviços disponíveis</p>
        )
      }
    </div>
  );
};
