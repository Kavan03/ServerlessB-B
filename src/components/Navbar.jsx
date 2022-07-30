import React from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {
  let navigate = useNavigate();
  const handleLogOut = async (event) => {
    event.preventDefault();
    try {
      Auth.signOut();
      await updateLoginStatus();
      props.auth.setAuthStatus(false);
      props.auth.setUser(null);
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateLoginStatus = () => {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        userName: props.auth.user.username,
        email: props.auth.user.attributes.email,
        type: "logout",
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://b7tdajffli4prwkltuyqgygmr40yifbu.lambda-url.us-east-1.on.aws/",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => console.log("error", error));
    });
  };

  return (
    <nav className="flex flex-row items-center justify-between px-2 py-3 bg-black lg-sticky">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          {!props.auth.isAuthenticated && (
            <a
              className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white hover:text-gray-400"
              href="/login"
            >
              Serverless B&B
            </a>
          )}
          {props.auth.isAuthenticated && (
            <a
              className="text-xl font-bold font-satisfy leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white hover:text-red-300"
              href="/home"
            >
              Serverless B&B
            </a>
          )}
        </div>
        {!props.auth.isAuthenticated && (
          <div>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <a
                  className="text-xl font-bold font-satisfy leading-relaxed inline-block py-2 whitespace-nowrap text-white hover:text-red-300 ml-3"
                  target={"_self"}
                  href="/orders"
                >
                  Orders
                </a>
                &nbsp;&nbsp;&nbsp;
                <a
                  className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white hover:text-gray-400"
                  href="/login"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        )}
        {props.auth.isAuthenticated && (
          <div>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <p className="text-xl font-bold font-satisfy leading-relaxed inline-block py-2 whitespace-nowrap text-white hover:text-red-300">
                  Hello {props.auth.user.username}
                </p>
                <a
                  className="text-xl font-bold font-satisfy leading-relaxed inline-block py-2 whitespace-nowrap text-white hover:text-red-300 ml-3"
                  target={"_self"}
                  href="/orders"
                >
                  Orders
                </a>
                <a
                  className="text-xl font-bold font-satisfy leading-relaxed inline-block py-2 whitespace-nowrap text-white hover:text-red-300 ml-3"
                  href="/notification"
                >
                  Notification
                </a>
                <a
                  onClick={handleLogOut}
                  className="text-xl font-bold font-satisfy leading-relaxed inline-block py-2 whitespace-nowrap text-white hover:text-red-300 ml-3"
                  href="/login"
                >
                  Logout
                </a>
                
              </li>
            </ul>
          </div>
        )}
      
      </div>
    </nav>
  );
}
