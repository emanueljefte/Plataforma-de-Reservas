import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode} from 'react';
type UserType = 'Client' | 'Provider';

interface User {
  id: string;
  name: string;
  email: string;
  nif: string;
  balance: number;
}

interface AuthContextType {
  token: string | null;
  userData: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  login: (token: string, data: User, type: UserType) => void;
  logout: () => void;
  updateUserData: (data: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children}: { children: ReactNode}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedType = localStorage.getItem('user_type') as UserType | null;
    const storedData = storedType? localStorage.getItem(`user_${storedType}`): null;

    if (storedData && storedType) {
      try {
        const { userToken, user} = JSON.parse(storedData);
        setToken(userToken);
        setUserData(user);
        setUserType(storedType);
        setIsAuthenticated(true);
} catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
}
}
}, []);

  const login = (newToken: string, newData: User, type: UserType) => {
    if (!['Client', 'Provider'].includes(type)) {
      console.error('Tipo de usuário inválido.');
      return;
}

    localStorage.setItem(
      `user_${type}`,
      JSON.stringify({ userToken: newToken, user: newData})
);
    localStorage.setItem('user_type', type);

    setToken(newToken);
    setUserData(newData);
    setUserType(type);
    setIsAuthenticated(true);
};

  const logout = () => {
    const type = localStorage.getItem('user_type') as UserType | null;
    if (type) {
      localStorage.removeItem(`user_${type}`);
      localStorage.removeItem('user_type');
}
    setToken(null);
    setUserData(null);
    setUserType(null);
    setIsAuthenticated(false);
};

  const updateUserData = (updatedData: User) => {
    const type = localStorage.getItem('user_type') as UserType | null;
    const raw = type? localStorage.getItem(`user_${type}`): null;

    if (!raw ||!type) return;

    try {
      const currentData = JSON.parse(raw);
      const newUserData = {
...currentData,
        user: updatedData,
};
      localStorage.setItem(`user_${type}`, JSON.stringify(newUserData));
      setUserData(updatedData);
} catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
}
};

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        userType,
        isAuthenticated,
        login,
        logout,
        updateUserData,
}}
>
      {children}
    </AuthContext.Provider>
);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
}
  return context;
};
