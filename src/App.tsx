import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { LoadingBar } from './components/LoadingBar';

function App() {
  return (
    <Router>
      <LoadingBar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}



export default App;