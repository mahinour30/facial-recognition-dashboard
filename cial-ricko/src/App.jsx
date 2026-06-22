import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/shell/Layout'
import Dashboard from './pages/Dashboard'
import TokenSwatch from './pages/TokenSwatch'
import PeopleAccess from './pages/PeopleAccess'
import EnrollWizard from './pages/EnrollWizard'

const Placeholder = ({ title }) => (
  <div>
    <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-4)' }}>{title}</h1>
    <p style={{ color: 'var(--text-body-primary)' }}>Coming in the next build step.</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="alerts" element={<Placeholder title="Alerts" />} />
          <Route path="people" element={<PeopleAccess />} />
          <Route path="people/enroll" element={<EnrollWizard />} />
          <Route path="access-log" element={<Placeholder title="Access Log" />} />
          <Route path="tokens" element={<TokenSwatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
