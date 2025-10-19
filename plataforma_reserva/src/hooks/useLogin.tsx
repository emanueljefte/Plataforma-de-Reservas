import { useState} from "react";
import { useAuth} from "../contexts/AuthContext";
// import { message} from "antd";
import { useNavigate} from "react-router-dom";

type LoginValues = {
  email: string;
  password: string;
};

type UserType = "Client" | "Provider";

interface UserData {
  id: string;
  name: string;
  nif: string;
  email: string;
  balance: number;
  user_role: UserType;
}

interface LoginResponse {
  token: string;
  msg: string;
  data: UserData;
}

function useLogin() {
  const { login} = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginUser = async (
    values: LoginValues,
    url: string,
): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
},
        body: JSON.stringify(values),
});

      const data: LoginResponse = await res.json();

      if (res.status === 200) {
        // message.success(data.msg);

        login(data.token, data.data, data.data.user_role);
        if (data.data.user_role === "Client") {
          navigate("/dashboardClient");
} else if (data.data.user_role === "Provider") {
          navigate("/dashboardProvider");
}
} else if (res.status === 401) {
        // message.error(data.msg);
        console.log(data);
        setError(data.msg)
    } else if (res.status === 404) {
        console.log(data);
        setError(data.msg);
    } else {
    alert("Falha no Login");
        // message.error("Falha no Login");
}
} catch (error) {
    //   message.error("Erro inesperado");
      console.error("Login error:", error);
} finally {
      setLoading(false);
}
};

  return { loading, error, loginUser};
}

export default useLogin;