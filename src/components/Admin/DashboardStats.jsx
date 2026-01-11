import { Users, Laptop, Monitor } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: Users,
      color: '#0a0aa6',
      bgColor: '#e8e8ff',
    },
    {
      title: 'Laptops Deployed',
      value: stats.laptopsDeployed,
      icon: Laptop,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'PCs Deployed',
      value: stats.pcsDeployed,
      icon: Monitor,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
  ];

  return (
    <div className="stats-grid">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: stat.bgColor }}
            >
              <Icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}