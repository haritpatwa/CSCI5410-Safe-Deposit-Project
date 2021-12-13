/*Author - Sowmya Busanagari*/
import "./PubSub.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

function PubSubPage() {
  const [balance, setBalance] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState('');
    const [sent, setSent] = useState('');
    const param = useParams();
  const [passImage, setPassImage] = useState(null);
 

  axios.get("https://pubsub-l2m7wjsa5q-uc.a.run.app/box/" + param.id).then((response) => {
    setAmount(response.data.result)
    console.log(response.data.disp)
    setSent(response.data.sent)
    console.log(response.data.sent)
    if(sent!=param.id)
    {
        setMsg(response.data.disp)
    }        
    else{
        setMsg("No messages to show")
    }
})

  const handleWithdraw = (event) => {
    if (balance > 1000) {
      alert("You can withdraw below 1000 only");
    } else {
      event.preventDefault();
      alert(event.target.amount.value);
      axios.put("https://pubsub-l2m7wjsa5q-uc.a.run.app/box/" + param.id, {
        amount: event.target.amount.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert("Message sent successfully");
    console.log("Handle Submit");
    axios.post(`https://pubsub-l2m7wjsa5q-uc.a.run.app/result`).then((res) => {
      console.log("Result : " + res.data);
      console.log("Result Type: " + typeof res.data);
      if (res.data) {
        console.log()
        axios
          .post("https://pubsub-l2m7wjsa5q-uc.a.run.app/box/" + param.id, {
            message: e.target.message.value,
          })
          .then((response) => {
            console.log("Res Box: " + response.data.message);
            //setMsg(response.data.message);
          });
        //alert(message);
      }
    });
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    alert("Image is been sent for processing");
    console.log(passImage);
    var metadataImage = new FormData();
    metadataImage.append("imageName", passImage.name);
    metadataImage.append("metadata", passImage);
    axios
      .post(
        "https://us-central1-assignment-2-csci5410.cloudfunctions.net/imgUpload",
        metadataImage
      )
      .then((response) => {
        setMsg(response.data.message);
      });
  };

  const [openModal, setOpenModal] = useState(false);

  const toggleModal = async (e) => {
    e.stopPropagation();
    setOpenModal(!openModal);
  };

  return (
    <>
      <section className="main">
        <section className="side">
          <section className="heading">
            <h2>Welcome to Safe Deposit</h2>
            <h4>Your Safe Deposit ammout is..{amount}</h4>
          </section>
          <article>
            <section className="survey">
              <h4>Your messages are</h4>
              <h4>{msg}</h4>
              <h3>Connect with your box members....!</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Please type your message
                  <input
                    type="text"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
                <input type="submit" value="Submit" />
                <br></br>
                <br></br>
              </form>
              <button onClick={toggleModal}>Upload Image</button>
            </section>
            <section className="withdrawl">
              <h3>Do you want to withdraw!</h3>
              <form onSubmit={handleWithdraw}>
                <label>
                  Your Withdraw amount:
                  <input
                    type="text"
                    name="amount"
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </label>
                <input type="submit" value="Submit" />
              </form>
            </section>
          </article>
        </section>
      </section>
      <Modal isOpen={openModal} toggle={toggleModal}>
        <ModalHeader
          toggle={toggleModal}
          style={{ backgroundColor: "#a0aecdb0", color: "#FFFFFF" }}
        ></ModalHeader>
        <ModalBody>
          <div
            style={{
              height: "auto",
              width: "470px",
              display: "block",
              justifyContent: "center",
              backgroundColor: "#9c9c9c21",
              marginRight: "150px",
            }}
          >
            <form onSubmit={handleImageSubmit}>
              <label>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  name="amount"
                  onChange={(e) => setPassImage(e.target.files[0])}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default PubSubPage;
