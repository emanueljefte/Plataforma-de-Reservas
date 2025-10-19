import { useAuth} from '../../../contexts/AuthContext';
import { useNavigate} from 'react-router-dom';
import { LogoutOutlined} from '@ant-design/icons';

export const Header = () => {
  const { userData, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
};

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Painel do Cliente</h1>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Bem-vindo, <strong>{userData?.name || 'usuário'}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition cursor-pointer"
>
          <LogoutOutlined />
          <span>Sair</span>
        </button>
      </div>
    </header>
);
};