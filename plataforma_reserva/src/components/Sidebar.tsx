import { Link, useLocation} from 'react-router-dom';
import {
  HomeOutlined,
  ProfileOutlined,
  DollarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Serviços', path: '/dashboardClient', icon: <HomeOutlined />},
    { label: 'Transações', path: '/dashboardClient/transaction', icon: <HistoryOutlined />},
    { label: 'Editar Perfil', path: '/dashboardClient/profile', icon: <ProfileOutlined />},
    { label: 'Depositar Saldo', path: '/dashboardClient/transfer', icon: <DollarOutlined />},
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-6 space-y-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-100 transition ${
              location.pathname === item.path? 'bg-blue-50 text-blue-600 font-semibold': 'text-gray-700'
}`}
>
            {item.icon}
            <span>{item.label}</span>
          </Link>
))}
      </nav>
    </aside>
);
};

export default Sidebar;