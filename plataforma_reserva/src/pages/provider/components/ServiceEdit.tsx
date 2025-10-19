import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ServiceForm } from "./ServiceForm";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const ServiceEdit: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setService(data));
  }, [id]);

  return service ? <ServiceForm service={service} isEditing /> : <p>Carregando...</p>;
};
