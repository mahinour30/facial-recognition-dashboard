import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Toast from './Toast'

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
          <div style={{ flex: 1, padding: 'var(--space-5)' }}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      <Toast />
    </div>
  )
}
