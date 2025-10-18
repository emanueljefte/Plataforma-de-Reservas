import React, { useState} from 'react';
import CreateServiceForm from './CreateServiceForm';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
}

const ServiceDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedService, setEditedService] = useState<Omit<Service, 'id'> | null>(null);

  const handleCreate = (service: Omit<Service, 'id'>) => {
    const newService = {...service, id: Date.now()};
    console.log(newService);
    
    setServices((prev) => [...prev, newService]);
};

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id!== id));
};

  const handleEdit = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setEditingId(id);
      setEditedService({ title: service.title, description: service.description, price: service.price});
}
};

  const handleUpdate = () => {
    if (editingId!== null && editedService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingId? {...s,...editedService}: s))
);
      setEditingId(null);
      setEditedService(null);
}
};

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <CreateServiceForm onCreate={handleCreate} />

      <h2 className="text-xl font-bold">Serviços Criados</h2>
      <ul className="space-y-4">
        {services.map((service) => (
          <li key={service.id} className="bg-white p-4 rounded shadow">
            {editingId === service.id? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedService?.title || ''}
                  onChange={(e) => setEditedService((prev) => ({...prev!, title: e.target.value}))}
                  className="w-full border px-2 py-1 rounded"
                />
                <textarea
                  value={editedService?.description || ''} onChange={(e) => setEditedService((prev) => ({...prev!, description: e.target.value}))}
                  className="w-full border px-2 py-1 rounded"
                />
                <input
                  type="number"
                  value={editedService?.price || 0}
                  onChange={(e) => setEditedService((prev) => ({...prev!, price: Number(e.target.value)}))}
                  className="w-full border px-2 py-1 rounded"
                />
                <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded">
                  Salvar
                </button>
              </div>
): (
              <div>
                <h3 className="font-semibold">{service.title}</h3>
                <p>{service.description}</p>
                <p className="text-sm text-gray-600">Preço: R$ {service.price.toFixed(2)}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(service.id)}
                    className="text-blue-600 hover:underline"
>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:underline"
>
                    Excluir
                  </button>
                </div>
              </div>
)}
          </li>
))}
      </ul>
    </div>
);
};

export default ServiceDashboard;