import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';
import Home from './screens/home';
import Quizes from './screens/quizes';
import Quiz from './screens/quiz';
import Create from './screens/create';
const App = () => {
  
  return <div className='overflow-hidden'>
    <Router className='relative'>
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/quizes' element={<Quizes />} />
        <Route path='/quizes/:id' element={<Quiz />} />
        <Route path='/create' element={<Create />} />
      </Routes>
     
    </Router>
  </div>;
};

export default App;