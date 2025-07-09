import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
// import axios from "axios";

// const testeHello = async (): Promise<void> => {
//   await axios.get(`${process.env.REACT_APP_API_URL}/hello-world`)
// }

const Login: React.FC = () => {
//   console.log(testeHello());
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={null} />
      
      <Footer />
    </div>
  );
};

export default Login;