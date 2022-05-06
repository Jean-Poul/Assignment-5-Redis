import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";

import Hashtags from "./components/Hashtags";
import Birthdays from "./components/Birthdays";
import AddBirthday from "./components/AddBirthday";
import Home from "./components/Home";
import Redis from "./components/Redis";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/redis" exact component={Redis} />
        <Route path="/hashtags" component={Hashtags} />
        <Route path="/birthdays" component={Birthdays} />
        <Route path="/addBirthday" component={AddBirthday} />
      </div>
    </Router>
  );
}

export default App;
