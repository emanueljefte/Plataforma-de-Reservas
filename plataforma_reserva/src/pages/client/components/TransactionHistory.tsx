import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface Reserve {
  id: string;
  date: string;
  provider: string;
  service: Service;
}
export const TransactionHistory = () => {
  const {token, logout} = useAuth()
  const [history, setHistory] = useState<Reserve[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/reserves/history/', {
          headers: {
            Authorization: `Bearer ${token}`,
},
});

        if (res.status === 401) {
          setError('Usuário não autenticado');
          logout()
}

        if (!res.ok) {
          throw new Error('Erro ao buscar histórico');
}

        const data: Reserve[] = await res.json();
        setHistory(data);
} catch (err) {
        console.error(err);
        setError('Erro ao carregar dados');
} finally {
        setLoading(false);
}
};

    fetchHistory();
}, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Histórico de Reservas</h2>
      {history.length === 0? (
        <p>Nenhuma reserva encontrada.</p>
): (
        <ul className="space-y-3">
          {history.map((reserve) => (
            <li key={reserve.id} className="bg-white p-4 rounded shadow">
              <p><strong>Serviço:</strong> {reserve.service.title}</p>
              <p><strong>Descrição:</strong> {reserve.service.description}</p>
              <p><strong>Valor:</strong> R$ {reserve.service.price.toFixed(2)}</p>
              <p><strong>Data:</strong> {new Date(reserve.date).toLocaleDateString()}</p>
            </li>
))}
        </ul>
)}
    </div>
);
};
