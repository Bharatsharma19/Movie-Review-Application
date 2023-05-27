import Header from "./components/Header";
import Cards from "./components/Cards";
import AddMovie from "./components/AddMovie";
import { Route, Routes } from "react-router-dom";
import Detail from "./components/Detail";
import { createContext, useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CryptoJS from "crypto-js";

const Appstate = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  var User = localStorage.getItem("User");
  var EUser = localStorage.getItem("EUser");
  var DUser;

  useEffect(() => {
    if (EUser !== null && User !== null) {
      var decryptedUser = CryptoJS.AES.decrypt(EUser, secretKey);
      // eslint-disable-next-line
      DUser = decryptedUser.toString(CryptoJS.enc.Utf8);
    }

    if (DUser === User) {
      setLogin(true);
      setUserName(DUser);
    } else {
      localStorage.clear();
      setLogin(false);
    }
  }, [User]);

  return (
    <Appstate.Provider value={{ login, userName, setLogin, setUserName }}>
      <div className="App relative">
        <Header />
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/addmovie" element={<AddMovie />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Appstate.Provider>
  );
}

export default App;

export { Appstate };
