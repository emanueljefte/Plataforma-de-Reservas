import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ServiceFormProps {
  service?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  isEditing?: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ service, isEditing }) => {
  const { token, userData } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: parseFloat(form.price),
      providerId: userData!.id,
    };
    console.log(payload);
    
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3000/api/v1/services/${service?.id}`
      : "http://localhost:3000/api/v1/services";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Serviço guardado com sucesso!");
      navigate("/dashboardProvider/services");
    } else {
      alert(data.msg || "Erro ao guardar serviço");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-6">
      <div>
        <label className="block mb-1">Nome do Serviço</label>
        <input
          type="text"
          className="border w-full px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Descrição</label>
        <textarea
          className="border w-full px-3 py-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Preço (Kz)</label>
        <input
          type="number"
          step="0.01"
          className="border w-full px-3 py-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isEditing ? "Atualizar" : "Criar"}
      </button>
    </form>
  );
};
