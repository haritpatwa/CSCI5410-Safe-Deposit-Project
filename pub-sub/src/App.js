import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PubSubPage from './PubSub';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/home/:id" element={<PubSubPage/>}></Route>
          </Routes>
          </div>
          </BrowserRouter>
          );
}
export default App;
