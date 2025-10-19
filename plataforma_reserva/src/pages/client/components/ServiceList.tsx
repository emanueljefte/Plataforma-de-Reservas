import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Reserve {
  id: string;
  userId: string;
  serviceId: string;
  price: number;
  status: string;
  date: Date;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export const ServiceList = () => {
  const {token, userData, logout} = useAuth()
  const [services, setServices] = useState<Service[]>([]);
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserReservas();
    fetchServices();
  }, []);

  const fetchUserReservas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/reserves", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status === 401) {
        setError("Usuário não autenticado");
        logout()
      }

      if (!res.ok) {
        throw new Error("Erro ao buscar reservas");
      }
      
      const data: Reserve[] = await res.json();
      console.log(data);
      setReserves(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleHire = async (serviceId: string) => {
    
    try {
      const res = await fetch("http://localhost:3000/api/v1/reserves", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        body: JSON.stringify({userId: userData?.id, serviceId}),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.msg);
      } else {
        alert(data.msg || "Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro inesperado");
    }

  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Serviços Disponíveis</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {
        services.length !== 0 ? (
          <>
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{service.title}</h3>
              <p>{service.description}</p>
              <p className="text-sm text-gray-600">R$ {service.price}</p>
              {
                reserves.map((r) => (
                  r.serviceId === service.id ? (
              <button disabled
                className="mt-2 bg-gray-600 text-white px-3 py-1 rounded cursor-not-allowed"
              >
                Contratado
              </button>

                  ) : (
              <button
                onClick={() => handleHire(service.id)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Contratar
              </button>

                  )
                ))
              }
            </div>
          ))}
          </>

        ) : (
          <p className="text-red-500">Sem Serviços disponíveis</p>
        )
      }
    </div>
    </div>
  );
};
