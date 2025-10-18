import { useState} from "react";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, loading, error} = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = { email, password};
    const url = "http://localhost:3000/api/v1/users/login";
    loginUser(values, url);
};

  return (
    <div className=" bg-gray-200">
      <div className="h-screen w-screen p-8 flex rounded-2xl items-center">

      {/* Imagem */}
      <div className="hidden md:block w-1/2 h-full bg-white rounded-bl-3xl rounded-tl-3xl">
        <img
          src="/login.jpeg"
          alt="Login"
          className="w-full h-full rounded-bl-3xl rounded-tl-3xl"
        />
      </div>

      {/* Formulário */}
      <div className="w-full  md:w-1/2 md:h-full m-auto flex items-center justify-center md:bg-white md:rounded-br-3xl md:rounded-tr-3xl ">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
>
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
>
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
>
              Entrar
            </button>
          </form>
          <div className="mt-3 text-center">
          <p>Ainda sem uma conta? <Link className="text-blue-500 hover:text-blue-800" to={'/signup'} >Criar agora</Link></p>

          </div>
        </div>
      </div>
      </div>
    </div>
);
}

export default Login;