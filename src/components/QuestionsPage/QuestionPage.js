import React, { Component } from 'react'

import './QuestionPage.css';

export class QuestionPage extends Component {
    constructor(props) {
        super();
        this.state = {
            form: {
                email: "",
                q1: "",
                q2: "",
                q3: "",
                q4: "",
                cipher: "",
                random: ["Favourite Colour", "Favourite Movie", "Favourite Number", "Favourite City"],
                randomNumber: this.randomIntFromInterval(0, 3),
                boxNumber: "",
                cipherQuestion: this.getRandomString(3),
                ans: "",
                cipherAns: ""
            }
            ,
            loading: false,
            error: false
        };
    }
    componentWillMount() {

        let emailId = localStorage.getItem("email");
        let q1 = localStorage.getItem("q1");
        let q2 = localStorage.getItem("q2");
        let q3 = localStorage.getItem("q3");
        let q4 = localStorage.getItem("q4");
        let cipher = localStorage.getItem("cipher");
        let boxNumber = localStorage.getItem("boxNumber");

        console.log("email retrieve : ", emailId);
        console.log("q1 retrieve : ", q1);
        console.log("q2 retrieve : ", q2);
        console.log("q3 retrieve : ", q3);
        console.log("q4 retrieve : ", q4);
        console.log("cipher retrieve : ", cipher);
        console.log("boxNumber retrieve : ", boxNumber);

        this.setState({
            email: emailId,
            q1: q1,
            q2: q2,
            q3: q3,
            q4: q4,
            cipher: cipher,
            boxNumber: boxNumber
        });
    }
    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    leftShifting(s, leftShifts) {
        return s.substring(leftShifts) + s.substring(0, leftShifts);
    }
    CaesarCipher(str, num) {

        var result = '';
        var charcode = 0;

        for (var i = 0; i < str.length; i++) {
            charcode = (str[i].charCodeAt()) + num;
            result += String.fromCharCode(charcode);
        }

        var AWS = require("aws-sdk");
        let awsConfig = {
            "region": "us-east-1",
            "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
        };
        AWS.config.update(awsConfig);
        let docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: "forcipher",
            Key: { "cipher": "forcipher" },
            UpdateExpression: "set ciphervalue = :byUser, valueofcipher = :byuser2, countofcipher = :byuser3",
            ExpressionAttributeValues: {
                ":byUser": result,
                ":byuser2":str,
                ":byuser3":num
            },
            ReturnValues: "UPDATED_NEW"
    
        };
        docClient.update(params, function (err, data) {
    
            if (err) {
                console.log("users::update::error - " + JSON.stringify(err, null, 2));
            } else {
                console.log("users::update::success "+JSON.stringify(data) );
            }
        });

        return result;

    }
    getRandomString(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    handleInp = (event) => {
        let id = event.target.id
        let form = this.state.form
        form[id] = event.target.value;
        this.setState({ form: form })
    }
    dashboard = async (e) => {
        e.preventDefault();
        window.location.href = "/dashboard"
         
    }
    login = async (e) => {
        e.preventDefault();
        await this.setState({ loading: false })
        let q1 = localStorage.getItem("q1");
        let q2 = localStorage.getItem("q2");
        let q3 = localStorage.getItem("q3");
        let q4 = localStorage.getItem("q4");
        let cipher = localStorage.getItem("cipher");
        let answers = [q1, q2, q3, q4];
        console.log("question: ", answers);
        console.log("cipher: ", cipher);
        console.log("answer: ", this.state.form.ans);
        console.log("leftshit first: ", this.CaesarCipher(this.state.form.cipherQuestion, parseInt(cipher)))
        console.log("leftshit second: ", this.state.form.cipherAns)

        this.CaesarCipher(this.state.form.cipherQuestion, parseInt(cipher));


        if (answers[this.state.form.randomNumber] == this.state.form.ans && this.CaesarCipher(this.state.form.cipherQuestion, parseInt(cipher)) == this.state.form.cipherAns) {
          
          
          
            var AWS = require("aws-sdk");
            let awsConfig = {
                "region": "us-east-1",
                "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
            };
            AWS.config.update(awsConfig);
            let docClient = new AWS.DynamoDB.DocumentClient();
            let boxNumber = localStorage.getItem("boxNumber");
                console.log(boxNumber);
                let emailId = localStorage.getItem("email");
            var params = {
                TableName: "loginstatistics",
                Key: {
                    "boxNumber": boxNumber
                }
            };
            docClient.get(params, function (err, data) {
                if (err) {
                    console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
                }
                else {
                    console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date + ' ' + time;
                    var input ;
                    console.log(data);
                    if(!data.Item)
                    {
                        input = {
                            "boxNumber": boxNumber,
                            "line": ['Logged' + ' user: '+emailId + ' at: ' + dateTime]
                        };
                    
                }
                else{
                    var input = {
                        "boxNumber": boxNumber,
                        "line": data.Item.line.concat(['Logged' + ' user: '+emailId + ' at: ' + dateTime])
                    };
                }
                    var params = {
                        TableName: "loginstatistics",
                        Item: input
                    };
                    docClient.put(params, function (err, data) {
        
                        if (err) {
                            console.log("users::save::error - " + JSON.stringify(err, null, 2));
                        } else {
                            console.log("users::save::success");
                            window.location="https://frontend-l2m7wjsa5q-uc.a.run.app/home/user1";
                        }
                    });
                }
            })
        
         
            

        } else {
            this.setState({ error: true })


        }
    }

    getData = () => {

        return <React.Fragment>
            <div className="card col-md-5 color">
                <h3>2-way authentication</h3>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>{this.state.form.random[this.state.form.randomNumber]}</td>
                            <td>:</td>
                            <td><input id="ans" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.ans} onChange={this.handleInp} /></td>
                        </tr>
                        <tr>
                            <td>Cipher of '{this.state.form.cipherQuestion}'</td>
                            <td>:</td>
                            <td><input id="cipherAns" type="text" className="form-control" placeholder="Answer Required*" value={this.state.form.cipherAns} onChange={this.handleInp} /></td>
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
                 <button className="btn btn-success" onClick={this.dashboard}>Go to the DashBoard</button>
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

export default QuestionPage
