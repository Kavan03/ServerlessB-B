import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import NotFound from "./404";

function Security(props) {
  const [security, setSecurity] = useState("");
  let navigate = useNavigate();
  function fetchSecurityQuestion() {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        userName: props.auth.user.username,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://us-central1-serverlessbnb.cloudfunctions.net/Auth/getQuestions",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            resolve(result);
            setSecurity(result.question[0]);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((error) => console.log("error", error));
    });
  }
  useEffect(() => {
    async function fetchData() {
      await fetchSecurityQuestion();
    }
    fetchData();
  }, []);
  const validationSchema = Yup.object().shape({
    securityanswer: Yup.string().required("Enter answer"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;
  async function onSubmit({ securityanswer }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      userName: props.auth.user.username,
      questions: [security],
      answers: [securityanswer],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-serverlessbnb.cloudfunctions.net/Auth/verifyAnswers",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          navigate("/caesarcipher");
        } else {
          toast.error("Invalid security answer");
        }
      })
      .catch((error) => console.log("error", error));
  }
  if (props.auth.user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Helmet>
          <title>B&B | Security</title>
        </Helmet>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-3 w-full lg:w-96">
            <div className="flex flex-col mb-4">
              <label htmlFor="pswd" className="text-black font-bold text-xl">
                Security Question : {security}
              </label>
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="emailID" className="text-black font-bold text-xl">
                Security Answer
              </label>
              <input
                className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
                type="securityanswer"
                name="securityanswer"
                id="securityanswer"
                placeholder="Enter security answer"
                {...register("securityanswer")}
              />
              <p className="text-red-600">{errors.securityanswer?.message}</p>
            </div>
            <button
              className="border-gray-600 text-black border-2 rounded-md font-bold text-xl hover:bg-gray-600 hover:text-white mt-4 p-2"
              type="submit"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    );
  }
  return <NotFound />;
}

export default Security;
