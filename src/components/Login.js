import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { query, where, getDocs } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import { Appstate } from "../App";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

const Login = () => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    try {
      if (form.mobile.length !== 10 || form.password === "") {
        Swal.fire({
          position: "center",
          title: "Please Fill Correct Values",
          icon: "error",
          timer: 4000,
        });
      } else {
        const quer = query(usersRef, where("mobile", "==", form.mobile));

        const querySnapshot = await getDocs(quer);

        if (querySnapshot.empty) {
          navigate("/signup");

          Swal.fire({
            position: "center",
            title: "Account not Exists!\nSign-Up to Continue",
            icon: "error",
            timer: 4000,
          });
        } else {
          querySnapshot.forEach((doc) => {
            const _data = doc.data();

            const isUser = bcrypt.compareSync(form.password, _data.password);

            if (isUser) {
              var encryptedUser = CryptoJS.AES.encrypt(
                `${_data.name}`,
                secretKey
              ).toString();

              useAppstate.setLogin(true);

              localStorage.setItem("User", _data.name);
              localStorage.setItem("EUser", encryptedUser);

              useAppstate.setUserName(_data.name);

              Swal.fire({
                position: "center",
                title: "Logged In",
                icon: "success",
                timer: 2000,
              });

              navigate("/");
            } else {
              Swal.fire({
                position: "center",
                title: "Invalid Credentials",
                icon: "error",
                timer: 4000,
              });
            }
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        title: error.message,
        icon: "error",
        timer: 6000,
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col mt-8 items-center">
      <h1 className="text-xl font-bold">Login</h1>
      <div className="p-2 w-full md:w-1/3">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-300">
            Mobile No.
          </label>
          <input
            type={"number"}
            id="message"
            name="message"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 w-full md:w-1/3">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="message"
            name="message"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 w-full">
        <button
          onClick={login}
          className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
        >
          {loading ? <TailSpin height={25} color="white" /> : "Login"}
        </button>
      </div>
      <div>
        <p>
          Do not have account?{" "}
          <Link to={"/signup"}>
            <span className="text-blue-500">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
