import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PickerPage } from './picker/PickerPage'
import { LedgerPage } from './designs/ledger/LedgerPage'
import { BlackwellPage } from './designs/blackwell/BlackwellPage'
import { HaltPage } from './designs/halt/HaltPage'
import { OmissionPage } from './designs/omission/OmissionPage'
import { VeldPage } from './designs/veld/VeldPage'
import { KellerPage } from './designs/keller/KellerPage'
import { ArguePage } from './designs/argue/ArguePage'
import { OverprintPage } from './designs/overprint/OverprintPage'
import { TidalPage } from './designs/tidal/TidalPage'
import { FieldPage } from './designs/field/FieldPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/picker" replace />} />
        <Route path="/picker" element={<PickerPage />} />
        <Route path="/1" element={<LedgerPage />} />
        <Route path="/2" element={<BlackwellPage />} />
        <Route path="/3" element={<HaltPage />} />
        <Route path="/4" element={<OmissionPage />} />
        <Route path="/5" element={<VeldPage />} />
        <Route path="/6" element={<KellerPage />} />
        <Route path="/7" element={<ArguePage />} />
        <Route path="/8" element={<OverprintPage />} />
        <Route path="/9" element={<TidalPage />} />
        <Route path="/10" element={<FieldPage />} />
      </Routes>
    </BrowserRouter>
  )
}
