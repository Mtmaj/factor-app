import {  Route, Routes,HashRouter } from 'react-router'
import './tailwind.css'
import Dashboard from './Components/layout/dashboard'
import FactorPage from './pages/factors'
import ShowFactorPage from './pages/factors/show'
import EditFactor from './pages/factors/edit'
import CreateFactor from './pages/factors/add'
import HomePage from './pages/main'

function App() {
  return (
    <>
      <div className="w-full h-full">
        <HashRouter>
          <div className="w-full flex flex-col h-full">
            <Dashboard>
              <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/factors" element={<FactorPage />} />
                <Route path="/factors/:factorId" element={<ShowFactorPage />} />
                <Route path="/factors/:factorId/edit" element={<EditFactor />} />
                <Route path="/factors/add" element={<CreateFactor />} />
              </Routes>
            </Dashboard>
          </div>
        </HashRouter>
      </div>
    </>
  )
}
 

export default App
