import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const BalanceTransfer = () => {
  const navigate = useNavigate()
  const {userData, token, logout, updateUserData} = useAuth()
  const [verify, setVerify] = useState(false)
  const [amount, setAmount] = useState(0);
  const [transfer, setTransfer] = useState<number>(0);

  // useEffect(() => {
  //     updateUserData({balance, ...userData!})
  //   }, [verify])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = userData?.id;
    if (amount > 11000) {
      return
    }
    try {
      const res = await fetch("http://localhost:3000/api/v1/users/transaction/"+id, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        
        body: JSON.stringify({balance: amount}),
      });

      const data = await res.json();

      if (res.status === 401) {
          alert('Usuário não autenticado');
          logout()
}

      if (res.ok) {
        alert(data.msg);
        setTransfer(data.balance)
        setVerify(true)
        navigate('/dashboardClient')
      } else {
        alert(data.msg || "Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro inesperado");
    }
};

  return (
 <div className="space-y-4">
      <h2>Depositar Saldo</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border px-4 py-2 rounded"
        placeholder="Valor a depositar"
        
      />
      <button onClick={handleTransfer} className="bg-purple-600 text-white px-4 py-2 rounded">
        Depositar
      </button>

      {
        amount > 11000 ? 
        (
          <p className="text-red-500">Ultrapassou o limite de cada requisição</p>
        ) 
        :
        (
          <></>
        )
      }
      <div></div>
    </div>
);
};