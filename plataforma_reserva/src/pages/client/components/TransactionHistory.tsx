import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { DollarOutlined, CalendarOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import { Card, Row, Col, Statistic } from "antd";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface User {
  id: string;
  name: string;
}

interface Reserve {
  id: string;
  date: string;
  provider: string;
  service: Service;
  user: User;
}

export const TransactionHistory = () => {
  const { token, logout } = useAuth();
  const [history, setHistory] = useState<Reserve[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalReservations: 0,
    uniqueProviders: 0,
    mostExpensive: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/reserves/history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("Usuário não autenticado");
          logout();
        }

        if (!res.ok) {
          throw new Error("Erro ao buscar histórico");
        }

        const data: Reserve[] = await res.json();
        setHistory(data);

        // 🔹 Calcula estatísticas
        const totalSpent = data.reduce((sum, r) => sum + r.service.price, 0);
        const totalReservations = data.length;
        const uniqueProviders = new Set(data.map((r) => r.user.id)).size;
        const mostExpensive =
          data.length > 0 ? Math.max(...data.map((r) => r.service.price)) : 0;

        setStats({ totalSpent, totalReservations, uniqueProviders, mostExpensive });
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold mb-4">Histórico de Reservas</h2>

      {/* Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Gasto"
              value={stats.totalSpent}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="Kz"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Reservas Realizadas"
              value={stats.totalReservations}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Provedores Diferentes"
              value={stats.uniqueProviders}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Serviço Mais Caro"
              value={stats.mostExpensive}
              precision={2}
              prefix={<TrophyOutlined />}
              suffix="Kz"
              valueStyle={{ color: "#d48806" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Lista de Reservas */}
      <div className="mt-8">
        {history.length === 0 ? (
          <p>Nenhuma reserva encontrada.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((reserve) => (
              <li
                key={reserve.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <p>
                  <strong>Serviço:</strong> {reserve.service.name}
                </p>
                <p>
                  <strong>Descrição:</strong> {reserve.service.description}
                </p>
                <p>
                  <strong>Valor:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    {reserve.service.price.toFixed(2)} KZ
                  </span>
                </p>
                <p>
                  <strong>Provedor do Serviço:</strong> {reserve.user.name}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(reserve.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
