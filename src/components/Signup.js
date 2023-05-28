import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import app from "../firebase/firebase";
import Swal from "sweetalert2";
import { addDoc } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };

  const requestOtp = () => {
    setLoading(true);

    generateRecaptha();

    let appVerifier = window.recaptchaVerifier;

    if (form.mobile.length !== 10 || form.name.length <= 3) {
      Swal.fire({
        position: "center",
        title: "Please Fill Correct Values",
        icon: "error",
        timer: 4000,
      });
    } else {
      signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          Swal.fire({
            position: "center",
            text: "OTP Sent",
            icon: "success",
            timer: 2000,
          });
          setOtpSent(true);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);

          Swal.fire({
            position: "center",
            text: "Server Error, Please try Again!",
            icon: "error",
            timer: 6000,
          });
        });
    }
    setLoading(false);
  };

  const verifyOTP = () => {
    try {
      setLoading(true);

      if (OTP.length === 6) {
        window.confirmationResult
          .confirm(OTP)
          .then((result) => {
            uploadData();

            Swal.fire({
              position: "center",
              text: "Sucessfully Registered",
              icon: "success",
              timer: 2500,
            });

            navigate("/login");

            setLoading(false);
          })
          .catch((error) => {
            Swal.fire({
              position: "center",
              text: "Invalid Otp!",
              icon: "error",
              timer: 2000,
            });

            setLoading(false);
          });
      } else {
        Swal.fire({
          position: "center",
          text: "Otp must be of 6 digits!",
          icon: "error",
          timer: 4000,
        });

        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        position: "center",
        text: "Server Error, Please try Again!",
        icon: "error",
        timer: 6000,
      });
    }
  };

  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10);

      var hash = bcrypt.hashSync(form.password, salt);

      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        position: "center",
        text: "Server Error, Please try Again!",
        icon: "error",
        timer: 6000,
      });
    }
  };

  return (
    <div className="w-full flex flex-col mt-8 items-center">
      <h1 className="text-xl font-bold">Sign up</h1>
      {otpSent ? (
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                OTP
              </label>
              <input
                maxLength={6}
                id="message"
                name="message"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={verifyOTP}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Confirm Otp"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                Name
              </label>
              <input
                id="message"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
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
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                Password
              </label>
              <input
                type={"password"}
                id="message"
                name="message"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={requestOtp}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Request OTP"}
            </button>
          </div>
        </>
      )}
      <div>
        <p>
          Already have an account{" "}
          <Link to={"/login"}>
            <span className="text-blue-500">Login</span>
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
