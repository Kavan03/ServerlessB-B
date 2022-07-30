import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import InputLabel from "@mui/material/InputLabel";
import { MenuItem, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as MENU from "../utils/constant";

const Signup = () => {
  let navigate = useNavigate();
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("Provide a user name"),
    emailID: Yup.string().email().required("Enter your Email ID"),
    pswd: Yup.string().required("Create a password for your account"),
    confirmpassword: Yup.string().oneOf([Yup.ref("pswd"), null]),
    cypherkey: Yup.string().required("Number can be between 1 and 26"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  function storeSecurityQuestions(userName, customerID, cypherkey) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        customerId: customerID,
        userName: userName,
        questions: [question],
        answers: [answer],
        cipherKey: cypherkey
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://us-central1-serverlessbnb.cloudfunctions.net/Auth/addAnswers",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            toast.error(result.message);
          }
          resolve(result);
        })
        .catch((error) => console.log("error", error));
    });
  }

  function subscribeEmailService(emailID) {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: emailID,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(
        "https://tpuw7atnfudmtnxysalcl7blay0vkfdc.lambda-url.us-east-1.on.aws/",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => console.log("error", error));
    });
  }

  async function onSubmit({ userName, pswd, emailID, cypherkey }) {
    var maxNumber = 1000;
    var randomNumber = Math.floor(Math.random() * maxNumber + 1);
    var customerID = JSON.stringify(randomNumber);
    try {
      const signUpResponse = await Auth.signUp({
        username: userName,
        password: pswd,
        attributes: {
          email: emailID,
          "custom:customer": customerID,
        },
      });

      await storeSecurityQuestions(userName, customerID, cypherkey);
      const resu = await subscribeEmailService(emailID);

      toast.success("Verification lisk sent to registerd emailID.");
      console.log(resu);

      setTimeout(navigate("/login"), 2000);
      console.log(signUpResponse);
    } catch (error) {
      toast.error("Username Already Exists");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Helmet>
        <title>B&B | Signup</title>
      </Helmet>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 w-full lg:w-96">
          <div className="flex flex-col mb-2">
            <p className="text-2xl text-center mb-5 text-black font-bold">
              Signup
            </p>
            <label htmlFor="userName" className="text-black font-bold text-xl">
              User Name
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter User Name"
              {...register("userName")}
            />
          </div>
          <p className="text-red-600">{errors.userName?.message}</p>
          <div className="flex flex-col mb-2">
            <label htmlFor="emailID" className="text-black font-bold text-xl">
              Email
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="email"
              name="emailID"
              id="emailID"
              placeholder="Enter email"
              {...register("emailID")}
            />
            <p className="text-red-600">{errors.emailID?.message}</p>
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="pswd" className="text-black font-bold text-xl">
              Password
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="password"
              name="pswd"
              id="pswd"
              placeholder="Enter Password"
              {...register("pswd")}
            />
            <p className="text-red-600">{errors.pswd?.message}</p>
          </div>
          <div className="flex flex-col mb-2">
            <label
              htmlFor="confirmpassword"
              className="text-black font-bold text-xl"
            >
              Confirm Password
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="password"
              name="confirmpassword"
              id="confirmpassword"
              placeholder="Confirm password"
              {...register("confirmpassword")}
            />
            <p className="text-red-600">
              {errors.confirmpassword &&
                "Passwords didn’t match. Please try again."}
            </p>
          </div>

          <label className="text-black font-bold text-xl">
            Security Question
          </label>

          <FormControl sx={{ borderColor: "black" }} size="small">
            <InputLabel id="demo-select-small">Security Question</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={question}
              label="Security Question"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              //   className='border-2 border-gray-600'
            >
              {MENU.SECURITY_QUESTIONS.map((question, index) => (
                <MenuItem value={question}>{question}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <label className="text-black font-bold text-xl">
            Security Answer
          </label>

          <TextField
            size="small"
            id="outlined-basic"
            label="Provide Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex flex-col mb-2">
            <label htmlFor="emailID" className="text-black font-bold text-xl">
              Customer Cypher Key
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="text"
              name="cypherkey"
              id="cypherkey"
              placeholder="Choose customer number between 1 and 26"
              {...register("cypherkey")}
            />
            <p className="text-red-600">{errors.cypherkey?.message}</p>
            <p className="italic">Remember your cypher key</p>
          </div>

          <button
            className="border-gray-600 text-black border-2 rounded-md font-bold text-xl hover:bg-gray-600 hover:text-white mt-4 p-2"
            type="submit"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
