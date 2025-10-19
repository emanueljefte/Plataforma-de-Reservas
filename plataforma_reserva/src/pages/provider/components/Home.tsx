import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
}

interface Reserve {
  id: string;
  service: Service;
  status: string;
  price: number;
  date: string;
}

export const Home: React.FC = () => {
  const { token, userData, logout } = useAuth();
  const [numberServices, setNumberServices] = useState<number>(0)
  const [numberReserves, setNumberReserves] = useState<number>(0)

  useEffect(() => {
    
    getUserServices()
    getUserReserves()
  }, [])
  
  async function getUserServices () {
    try {
    const res = await fetch("http://localhost:3000/api/v1/services/all-user-services/" + userData!.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.status === 401) {
      alert("Usuário não autenticado");
      logout();
    }

    if (res.ok) {

      setNumberServices(data.length)
    } else {
      alert(data.msg || "Erro ao registrar");
    }
  } catch (error) {
    console.error("Erro no registro:", error);
    alert("Erro inesperado");
  }
  
}
  async function getUserReserves () {
    try {
    const res = await fetch("http://localhost:3000/api/v1/reserves/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (res.ok) {
      const dataRes: Reserve[] = data;
      const userService = dataRes.filter((d) => {
        return d.service.providerId === userData?.id
      })
      
      setNumberReserves(userService.length)
    } else {
      alert(data.msg || "Erro ao registrar");
    }
  } catch (error) {
    console.error("Erro no registro:", error);
    alert("Erro inesperado");
  }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Bem-vindo, {userData?.name}</h1>
      <p className="mt-2 text-gray-600">Aqui pode gerir os seus serviços, reservas e saldo.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-sm text-gray-600">Saldo atual</p>
          <h3 className="text-xl font-bold">{userData?.balance?.toFixed(2)} Kz</h3>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <p className="text-sm text-gray-600">Serviços</p>
          <h3 className="text-xl font-bold">{numberServices || 0} ativos</h3>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm text-gray-600">Reservas</p>
          <h3 className="text-xl font-bold">{numberReserves || 0} aquisições</h3>
        </div>
      </div>
    </div>
  );
};
