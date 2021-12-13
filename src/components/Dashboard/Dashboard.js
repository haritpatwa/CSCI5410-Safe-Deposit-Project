import React, { Component } from 'react'
import './Dashboard.css'
import { jsPDF } from 'jspdf';
import bargraph from './bar-graph.png';

export class Dashboard extends Component {
    constructor(props) {
        super();
        this.state = {
            email: "",
            balance: "",
            q1: "",
            q2: "",
            q3: "",
            q4: "",
            cipher: "",
            boxNumber: ""
        };
       
    }
    
    componentWillMount() {

        let emailId = localStorage.getItem("email");
        let balance = localStorage.getItem("balance");
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
            balance: balance,
            q1: q1,
            q2: q2,
            q3: q3,
            q4: q4,
            cipher: cipher,
            boxNumber: boxNumber
        });

    }
    logout = async (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "/"

    }
    generatereport = async (e) => {
        e.preventDefault();
        var doc = new jsPDF('landscape', 'px', 'a4', 'false');
        doc.setFont('Helvertica', 'bold')
        doc.text(300, 60, 'Log in statistics')
        doc.setFont('Helvertica', 'normal')
        var AWS = require("aws-sdk");
        let awsConfig = {
            "region": "us-east-1",
            "accessKeyId": "AKIA4RW42NZLJPIGWUHA", "secretAccessKey": "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"
        };
        AWS.config.update(awsConfig);

        let docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: "loginstatistics",
            Key: {
                "boxNumber": this.state.boxNumber
            }
        };
        docClient.get(params, function (err, data) {
            if (err) {
                console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
            }
            else {
                console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
                for (let i = 0; i < data.Item.line.length; i++) {
                    doc.text(60, 80+20*i, data.Item.line[i]);
                }
                let boxNumber = localStorage.getItem("boxNumber");
                let emailId = localStorage.getItem("email");

               
                var params = {
                    TableName: "withdrawaldetails",
                    Key: {
                        "email": emailId
                    }
                };
                doc.addPage();
               
              
                docClient.get(params, function (err, data) {
                    if (err) {
                        console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
                    }
                    else {
                        console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));

                        if(!data.Item){
                            doc.setFont('Helvertica', 'bold')
                            doc.text(300, 60, 'Withdrawal Graph')
                            doc.text(60,80,"Sorry no withdrawal from you side, therefore no graph");
                            doc.save(boxNumber + '.pdf')

                        }else{
                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            var dateTime = date + ' ' + time;

                            // for (let i = 0; i < data.Item.NewValue.length; i++) {
                            //     console.log(data.Item.NewValue[i]);
                            //     doc.text(60, 80+20*i, 'User: '+emailId+' Withdrawal Amount: '+data.Item.NewValue[i]+' Time: '+dateTime);
                            // }
                            doc.setFont('Helvertica', 'bold')
                            doc.text(300, 60, 'Withdrawal Graph')
                            doc.addImage(bargraph,'PNG',65,20,500,400);
                            doc.save(boxNumber + '.pdf')
                        
                        }
                        
                       
                    }
                });
            
               
            }
        });
    }

    render() {
        return (

            <div>
                <div id='button'>
                    <button className="btn btn-success" onClick={this.logout}> Logout</button>
                </div>
                <div>
                    <h1>Sucessful log in</h1>
                    <h1>Hello user:  {this.state.email}</h1>
                  

                    <div id='generatereport'>
                        <button className="btn btn-success" onClick={this.generatereport}> Generate Report</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard
