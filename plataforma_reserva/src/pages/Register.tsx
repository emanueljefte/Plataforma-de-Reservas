import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateRegister } from "../utils/validator";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    nif: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const location = useLocation();
const userRole = location.state?.user_role || "Client"; 

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateRegister(form)
        
        if (err !== null) {
          setErrors(err)
          return;
        } 
        setErrors(null)

    const payload = {
      ...form,
      user_role: userRole,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Conta criada com sucesso!");
        navigate("/login");
      } else {
        setErrors(data.msg || "Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro inesperado");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Criar Conta
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="nif"
          placeholder="NIF"
          value={form.nif}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {errors && (
                <p className="text-red-600 text-sm">{errors}</p>
              )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Criar minha conta
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
