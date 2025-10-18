import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const ProfileEditor = () => {
  const {token, userData, userType, logout, updateUserData} = useAuth()
  const [verify, setVerify] = useState(false)
  const [profile, setProfile] = useState({ name: userData?.name || '', nif: userData?.nif || '', email: userData?.email || ''});
  
  useEffect(() => {
    updateUserData({id: userData!.id, balance: userData!.balance, ...profile})
  }, [verify])

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
    const id = userData?.id;
    const payload = {
      ...profile,
      user_role: userType,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/"+id, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
          alert('Usuário não autenticado');
          logout()
}

      if (res.ok) {
        alert(data.msg);
        setVerify(true)
      } else {
        alert(data.msg || "Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro inesperado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <p>Nome</p>
      <input
        type="text"
        value={profile.name}
        onChange={(e) => setProfile({...profile, name: e.target.value})}
        className="w-full border px-4 py-2 rounded"
        placeholder="Nome"
      />
      <p>Número de Identificação Fiscal</p>
      <input
          type="text"
          name="nif"
          placeholder="NIF"
          value={profile.nif}
          onChange={(e) => setProfile({...profile, nif: e.target.value})}
          required
          className="w-full border px-4 py-2 rounded"
        />

      <p>E-mail</p>
      <input
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({...profile, email: e.target.value})}
        className="w-full border px-4 py-2 rounded"
        placeholder="Email"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
        Salvar
      </button>
    </form>
);
};
