import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Footer } from './components/navbar/Footer'
import { AppRoutes } from './routes/Index';

function App() {
  return (

    <BrowserRouter>
      <AppRoutes/>
      <Footer/>
    </BrowserRouter>

  );
}

export default App
