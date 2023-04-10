
import AppHeader from "../appHeader/AppHeader";
import MainPage from '../../pages/MainPage';
import ComicsPage from '../../pages/ComicsPage';
import SingleComic from '../singleComic/SingleComic';
import Page404 from "../../pages/404";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


const App = () => {

  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/comics" element={<ComicsPage />} />
            <Route path="/comics/:id" element={<SingleComic />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;