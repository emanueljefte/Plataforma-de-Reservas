import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, List, Avatar, Tag, message, Empty } from "antd";
import { DollarOutlined, CalendarOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";

interface Service {
  id: string;
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

export const HomeClient = () => {
  const { userData, token } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [recommended, setRecommended] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Carrega informações do usuário e reservas
  const fetchClientData = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      // saldo e dados do usuário
      const userRes = await fetch(`http://localhost:3000/api/v1/users/by-id/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userJson = await userRes.json();
      setBalance(userJson.balance);

      // reservas do cliente
      const reservesRes = await fetch(
        `http://localhost:3000/api/v1/reserves/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reservesJson = await reservesRes.json();
      setReserves(reservesJson);

      // serviços recomendados
      const servicesRes = await fetch(`http://localhost:3000/api/v1/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const servicesJson = await servicesRes.json();
      setRecommended(servicesJson.slice(0, 4)); // mostra só 4
    } catch (err) {
      message.error("Erro ao carregar dados do cliente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Bem-vindo, {userData?.name} 👋</h2>

      {/* Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Saldo Atual"
              value={balance}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="Kz"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Serviços Reservados"
              value={reserves.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Serviços Recomendados"
              value={recommended.length}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Reservas */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Minhas Reservas</h3>
        {reserves.length === 0 ? (
          <Empty description="Nenhuma reserva encontrada" />
        ) : (
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={reserves}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<CalendarOutlined />} />}
                  title={item.service.name}
                  description={item.service.description}
                />
                <div className="flex flex-col text-right">
                  <Tag color={item.status === "confirmed" ? "green" : "orange"}>
                    {item.status.toUpperCase()}
                  </Tag>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span className="font-semibold text-green-600">
                    {item.price.toFixed(2)} Kz
                  </span>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Serviços Recomendados */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Serviços Recomendados</h3>
        {recommended.length === 0 ? (
          <Empty description="Sem recomendações no momento" />
        ) : (
          <Row gutter={[16, 16]}>
            {recommended.map((s) => (
              <Col xs={24} sm={12} md={6} key={s.id}>
                <Card
                  hoverable
                  title={<span className="font-semibold">{s.name}</span>}
                >
                  <p className="text-gray-600">{s.description}</p>
                  <p className="font-medium text-green-700">
                    {s.price.toFixed(2)} Kz
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
