import { RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__status">
        <span className="status-dot status-dot--normal" />
        <span>System Status: Normal Operations</span>
      </div>
      <div className="app-footer__links">
        <a href="#">Privacy notice</a>
        <a href="#">About Deloitte</a>
        <a href="#">Cookie Settings</a>
      </div>
      <div className="app-footer__sync">
        <span>Last sync: 09:42:14 AM</span>
        <RefreshCw size={12} style={{ marginLeft: 4 }} />
      </div>
    </footer>
  );
}
