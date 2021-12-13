import React from 'react';
import './Registration.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        cipher: "",
        email: "",
        password: "",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        boxNumber: ""
      },
      loading: false,
      start: true
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
    this.setState({ form: form, start: false })
  }

  register = async (e) => {
    e.preventDefault();
    //For Box
    const col1 = await collection(this.db, 'Users');
    const result = await getDocs(col1);
    const data = result.docs.map(doc => doc.data());
    var AWS = require("aws-sdk");
    let awsConfig = {
      "region": "us-east-1",
      "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
    };
    AWS.config.update(awsConfig);
    let docClient = new AWS.DynamoDB.DocumentClient();
    let ans = data.filter((d) => {
      return d.count < 3
    })
    let finalBoxNumber;
    if (ans.length == 0) {
      //create new safedepositbox
      let randomNumber = Math.random().toFixed(16).split(".")[1];
      await addDoc(col1, {
        balance: 5000,
        count: 1,
        members: [this.state.form.email],
        pubsub: false,
        sentby: "",
        boxNumber: randomNumber
      });
      finalBoxNumber=randomNumber;
      var input = {
        "boxId": randomNumber,
        "balance": 5000,
        "count": 1,
        "members": [this.state.form.email],
        "pubsub": false,
        "sentby": ""
      };
      var params = {
        TableName: "User",
        Item: input
      };
      docClient.put(params, function (err, data) {

        if (err) {
          console.log("users::save::error - " + JSON.stringify(err, null, 2));
        } else {
          console.log("users::save::success");
        }
      });




    } else {

      console.log("Came here");
      let docc = ""
      let boxIdDelete = ""
      await result.docs.map(doc => {
        if (doc.data().count < 3) {
          docc = doc.ref;
          boxIdDelete = doc.data().boxNumber
        }
      })
      await deleteDoc(docc);
      var params = {
        TableName: "User",
        Key: {
          "boxId": boxIdDelete
        }
      };
      docClient.delete(params, function (err, data) {

        if (err) {
          console.log("users::delete::error - " + JSON.stringify(err, null, 2));
        } else {
          console.log("users::delete::success");
        }
      });
      ans[0].members[ans[0].count] = this.state.form.email
      ans[0].count = ans[0].count + 1
      console.log(ans[0]);
      finalBoxNumber=ans[0].boxNumber;
      await addDoc(col1, ans[0]);

      var input = {
        "boxId": ans[0].boxNumber,
        "balance": ans[0].balance,
        "count": ans[0].count,
        "members": ans[0].members,
        "pubsub": ans[0].pubsub,
        "sentby": ans[0].sentby
      };

      var params = {
        TableName: "User",
        Item: input
      };
      docClient.put(params, function (err, data) {

        if (err) {
          console.log("users::save::error - " + JSON.stringify(err, null, 2));
        } else {
          console.log("users::save::success");
        }
      });
    }
    const col = await collection(this.db, 'UserDetails');
    await this.setState({ loading: true })
    await addDoc(col, {
      cipher: this.state.form.cipher,
      email: this.state.form.email,
      password: this.state.form.password,
      q1: this.state.form.q1,
      q2: this.state.form.q2,
      q3: this.state.form.q3,
      q4: this.state.form.q4,
      boxNumber: finalBoxNumber
    });
    await this.setState({ loading: false, start: true })

   alert("Registration is done");
    window.location.href = "/"

  }

  getData = () => {


    return <React.Fragment>
      
      <div className="card col-md-5 color">

        <h3>Sign Up</h3>
        <table className="table">
          <tbody>
            <tr>
              <td>Email</td>
              <td>:</td>
              <td><input id="email" type="email" className="form-control" placeholder="abc@dal.ca" value={this.state.form.email} onChange={this.handleInp} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td>:</td>
              <td><input id="password" type="password" className="form-control" placeholder="Enter Password" value={this.state.form.password} onChange={this.handleInp} /></td>
            </tr>
            <tr>
              <td>Favourite Colour</td>
              <td>:</td>
              <td><input id="q1" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.q1} onChange={this.handleInp} /></td>
            </tr>

            <tr>
              <td>Favourite Movie</td>
              <td>:</td>
              <td><input id="q2" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.q2} onChange={this.handleInp} /></td>
            </tr>

            <tr>
              <td>Favourite Number</td>
              <td>:</td>
              <td><input id="q3" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.q3} onChange={this.handleInp} /></td>
            </tr>

            <tr>
              <td>Favourite City</td>
              <td>:</td>
              <td><input id="q4" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.q4} onChange={this.handleInp} /></td>
            </tr>
            <tr>
              <td>Example "ABC"</td>
              <td>:</td>
              <td>For value as "1": "BCD"</td>
            </tr>
            <tr>
              <td>Cipher Value</td>
              <td>:</td>
              <td><input id="cipher" type="text" className="form-control" placeholder="value Required*" value={this.state.form.cipher} onChange={this.handleInp} /></td>
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
            <button className="btn btn-success" onClick={this.register}>Register</button>
        }
        <br></br>
        {
          this.state.loading && !this.state.start ?
            <div class="alert alert-success" role="alert">
              Successfully registered !
            </div>
            : ""
        }
      </div>
    </React.Fragment>
  }

  render() {
    return (
     
        

     
      this.getData()
     
    )
  }
}

export default Registration;