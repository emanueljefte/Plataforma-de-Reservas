import React, { useState} from 'react';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
}

interface Props {
  onCreate: (service: Omit<Service, 'id'>) => void;
}

const CreateServiceForm: React.FC<Props> = ({ onCreate}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, description, price});
    setTitle('');
    setDescription('');
    setPrice(0);
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Novo Serviço</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-4 py-2 rounded"
        required
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-4 py-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full border px-4 py-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Criar Serviço
      </button>
    </form>
);
};

export default CreateServiceForm;