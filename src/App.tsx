import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PickerPage } from './picker/PickerPage'
import { Design1Broadsheet } from './designs/design1/Design1Broadsheet'
import { Design2Receipt } from './designs/design2/Design2Receipt'
import { Design3Shell } from './designs/design3/Design3Shell'
import { Design4Filmstrip } from './designs/design4/Design4Filmstrip'
import { Design5Constellation } from './designs/design5/Design5Constellation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/picker" replace />} />
        <Route path="/picker" element={<PickerPage />} />
        <Route path="/1" element={<Design1Broadsheet />} />
        <Route path="/2" element={<Design2Receipt />} />
        <Route path="/3" element={<Design3Shell />} />
        <Route path="/4" element={<Design4Filmstrip />} />
        <Route path="/5" element={<Design5Constellation />} />
      </Routes>
    </BrowserRouter>
  )
}
