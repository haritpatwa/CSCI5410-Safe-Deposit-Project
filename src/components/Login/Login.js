import React from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc , deleteDoc, doc } from 'firebase/firestore/lite';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        form : {
            email : "",
            password : "",
            q1 : "",
            q2 : "",
            q3 : "",
            q4 : "",
            cipher : "",
            boxNumber:""
           
        },
        loading : false,
        error : false
    };

    const firebaseConfig = {
      apiKey: "AIzaSyBq9kQwzVeAFVE45OB4sRdaChNFO4H7blU",
      authDomain: "safe-deposit-30066.firebaseapp.com",
      projectId: "safe-deposit-30066",
      storageBucket: "safe-deposit-30066.appspot.com",
      messagingSenderId: "122396467700",
      appId: "1:122396467700:web:4e20ba9f930b1a857859a1"
    };
    
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }
  
  handleInp = (event) => {
    let id = event.target.id
    let form = this.state.form
    form[id] = event.target.value;
    this.setState({form : form})
  }

  register = async (e) => {
    e.preventDefault();
    window.location.href = "/registration"

  }
 login = async (e) => {
    e.preventDefault();
    const col = await collection(this.db, 'UserDetails');
    await this.setState({loading : true, error : false})
    const result = await getDocs(col);
    const data = result.docs.map(doc => doc.data());
    let ans = data.filter((d)=> {
      return d.email==this.state.form.email && d.password==this.state.form.password
    })
    await this.setState({loading : false})
    if(ans.length == 0){
      this.setState({error : true})
    } else {
     
      await result.docs.map(doc => {
        if(doc.data().email == ans[0].email){
          console.log("email:",ans[0].email);
          localStorage.setItem('email',ans[0].email)
          localStorage.setItem('balance',ans[0].balance);
          localStorage.setItem('q1',ans[0].q1)
          localStorage.setItem('q2',ans[0].q2)
          localStorage.setItem('q3',ans[0].q3)
          localStorage.setItem('q4',ans[0].q4)
          localStorage.setItem('cipher',ans[0].cipher)
          localStorage.setItem('boxNumber',ans[0].boxNumber)
          window.location.href = "/questionpage"
         
        }
      })
     
    }
  }
  
  getData = () => {
  
    return <React.Fragment>
        <div className="card col-md-5 color">
        <h3>Log In</h3>
        <table className="table">
        <tbody>
            <tr>
                <td>Email</td>
                <td>:</td>
                <td><input id="email" type="email" className="form-control" placeholder="abc@xyz.com" value={this.state.form.email} onChange={this.handleInp}/></td>
            </tr>
            <tr>
                <td>Password</td>
                <td>:</td>
                <td><input id="password" type="password" className="form-control" placeholder="Enter Password" value={this.state.form.password} onChange={this.handleInp}/></td>
            </tr>
        </tbody>
    </table>
    {
    this.state.loading ?
    <button className="btn btn-success" type="button" disabled>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
    :
    <button className="btn btn-success" onClick={this.login}>Login</button>
  }
   <button className="btn btn-success" onClick={this.register}>Register</button>
      <br></br>
        </div>
        {
          this.state.error ? 
          <div class="alert alert-danger" role="alert">
            Invalid credentials
        </div>
        : ""
        }
       
    </React.Fragment>
  }

  render() {
    return (
      this.getData()
    )
  }
}

export default Login;