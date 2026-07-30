import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div className='p-10 text-2xl font-bold text-blue-600'>
      CondoManager AI — Build & Deploy OK
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
