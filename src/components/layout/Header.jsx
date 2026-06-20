import { User, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">Deloitte.</span>
        <span className="app-header__divider">|</span>
        <span className="app-header__product">Facial Recognition</span>
      </div>
      <div className="app-header__actions">
        <button className="header-icon-btn">
          <User size={16} />
          <ChevronDown size={14} />
        </button>
        <button className="header-icon-btn">
          <Settings size={16} />
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
