import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { validateProfile, validatePasswordReset } from "../../../utils/validator";

export const ProfileEditor = () => {
  const { token, userData, userType, logout, updateUserData } = useAuth();
  const [errors, setErrors] = useState<string | null>(null);
  const [verify, setVerify] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState({
    name: userData?.name || "",
    nif: userData?.nif || "",
    email: userData?.email || "",
  });

  const [resetData, setResetData] = useState({
    nif: "",
    oldPassword: "",
    password: "",
  });

  useEffect(() => {
    if (verify) {
      updateUserData({
        id: userData!.id,
        balance: userData!.balance,
        ...profile,
      });
      setVerify(false);
    }
  }, [verify]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateProfile(profile)
    
    if (err !== null) {
      setErrors(err)
      return;
    } 
    setErrors(null)

    const id = userData?.id;
    const payload = {
      ...profile,
      user_role: userType,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert("Usuário não autenticado");
        logout();
      }

      if (res.ok) {
        alert(data.msg);
        setVerify(true);
      } else {
        setErrors(data.msg || "Erro ao registrar, tente novamente");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro inesperado");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
 
    const err = validatePasswordReset(resetData)
    
    if (err !== null) {
      setErrors(err)
      return;
    } 
    setErrors(null)
    try {
      if (resetData.nif !== userData?.nif) return setErrors('NIF não conscide');

      const res = await fetch("http://localhost:3000/api/v1/users/reset-password/"+userData.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resetData),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert("Sessão expirada, faça login novamente.");
        logout();
      }

      if (res.ok) {
        alert(data.msg || "Senha atualizada com sucesso!");
        setErrors(null);
        setShowModal(false);
        setResetData({ nif: "", oldPassword: "", password: "" });
      } else {
        setErrors(data.msg || "Erro ao redefinir senhan");
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      alert("Erro inesperado ao redefinir senha");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p>Nome</p>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          placeholder="Nome"
        />

        <p>Número de Identificação Fiscal</p>
        <input
          type="text"
          name="nif"
          placeholder="NIF"
          value={profile.nif}
          onChange={(e) => setProfile({ ...profile, nif: e.target.value })}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <p>E-mail</p>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          placeholder="Email"
        />

        {errors && <p className="text-red-600 text-sm">{errors}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Salvar
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Redefinir a Senha
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Redefinir Palavra-Passe
            </h2>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <div>
                <label className="block mb-1">NIF</label>
                <input
                  type="text"
                  value={resetData.nif}
                  onChange={(e) =>
                    setResetData({ ...resetData, nif: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Digite o NIF"
                />
              </div>
              <div>
                <label className="block mb-1">Palavra-passe atual</label>
                <input
                  type="password"
                  value={resetData.oldPassword}
                  onChange={(e) =>
                    setResetData({ ...resetData, oldPassword: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Digite a palavra-passe atual"
                />
              </div>
              <div>
                <label className="block mb-1">Nova palavra-passe</label>
                <input
                  type="password"
                  value={resetData.password}
                  onChange={(e) =>
                    setResetData({ ...resetData, password: e.target.value })
                  }
                  required
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Digite a nova palavra-passe"
                />
              </div>

              {errors && (
                <p className="text-red-600 text-sm">{errors}</p>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
