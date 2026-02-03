import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Home, FileText, User, Plus, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser } from '@/data/mockData';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/transcriptions', icon: FileText, label: 'Minhas Transcrições' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Youtube className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xl font-semibold text-foreground">TubeLink</span>
      </div>

      {/* New Transcription Button */}
      <div className="px-4 py-4">
        <RouterNavLink
          to="/new"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Transcrição</span>
        </RouterNavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <RouterNavLink
                  to={item.to}
                  className={cn(
                    'sidebar-link',
                    isActive && 'sidebar-link-active'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </RouterNavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <RouterNavLink
          to="/profile"
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-all duration-200',
            location.pathname === '/profile' && 'bg-sidebar-accent'
          )}
        >
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {mockUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {mockUser.email}
            </p>
          </div>
          <User className="w-4 h-4 text-muted-foreground" />
        </RouterNavLink>
      </div>
    </aside>
  );
}
