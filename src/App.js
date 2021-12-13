import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import { BrowserRouter , Route,Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import QuestionPage from './components/QuestionsPage/QuestionPage';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
     
      <Route path="/"   exact={true} component={Login} />
      <Route path="/registration"   exact={true} component={Registration} />
      <Route path="/questionpage"  exact={true} component={QuestionPage} />
      <Route path="/dashboard"   exact={true} component={Dashboard} />

      
       
    </div>
    </BrowserRouter>
  );
}

export default App;
