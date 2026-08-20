import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GalleryPage } from './gallery/GalleryPage'

const Page1 = lazy(() => import('./designs/p1/Page1').then((m) => ({ default: m.Page1 })))
const Page2 = lazy(() => import('./designs/p2/Page2').then((m) => ({ default: m.Page2 })))
const Page3 = lazy(() => import('./designs/p3/Page3').then((m) => ({ default: m.Page3 })))
const Page4 = lazy(() => import('./designs/p4/Page4').then((m) => ({ default: m.Page4 })))
const Page5 = lazy(() => import('./designs/p5/Page5').then((m) => ({ default: m.Page5 })))
const Page6 = lazy(() => import('./designs/p6/Page6').then((m) => ({ default: m.Page6 })))
const Page7 = lazy(() => import('./designs/p7/Page7').then((m) => ({ default: m.Page7 })))
const Page8 = lazy(() => import('./designs/p8/Page8').then((m) => ({ default: m.Page8 })))
const Page9 = lazy(() => import('./designs/p9/Page9').then((m) => ({ default: m.Page9 })))
const Page10 = lazy(() => import('./designs/p10/Page10').then((m) => ({ default: m.Page10 })))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div aria-live="polite" className="vh">Loading</div>}>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/1" element={<Page1 />} />
          <Route path="/2" element={<Page2 />} />
          <Route path="/3" element={<Page3 />} />
          <Route path="/4" element={<Page4 />} />
          <Route path="/5" element={<Page5 />} />
          <Route path="/6" element={<Page6 />} />
          <Route path="/7" element={<Page7 />} />
          <Route path="/8" element={<Page8 />} />
          <Route path="/9" element={<Page9 />} />
          <Route path="/10" element={<Page10 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
