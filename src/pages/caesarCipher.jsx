import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import NotFound from "./404";

const CaesarCipher = (props) => {
  let navigate = useNavigate();
  const [text, setText] = React.useState("Hello World!");
  // const secretKey = props.auth.user.attributes['custom:customer']
  //   ? parseInt(props.auth.user.attributes['custom:customer']) % 26
  //   : 0

  const validationSchema = Yup.object().shape({
    encryptText: Yup.string().required("Provide a valid encryption text"),
  });
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  React.useEffect(() => {
    setText(makeid(5));
  }, []);

  const { errors } = formState;
  async function onSubmit({ encryptText }) {
    console.log(encryptText);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      cipherText: encryptText,
      userName: props.auth.user.username,
      // key: secretKey,
      plainText: text,
    });
    console.log(raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-serverlessbnb.cloudfunctions.net/Auth/doDecryption",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        console.log(result);
        if (result.success) {
          props.auth.setAuthStatus(true);
          await updateLoginStatus();
          toast.success(result.message);
          navigate("/home");
        } else {
          toast.error("Invalid encrypted text!! Please try again");
        }
      })
      .catch((error) => console.log("error", error));
  }

  const updateLoginStatus = () => {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        userName: props.auth.user.username,
        email: props.auth.user.attributes.email,
        type: "login",
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
  if (props.auth.user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Helmet>
          <title>B&B | 3MFA</title>
        </Helmet>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2 w-full lg:w-96">
            <p className="text-2xl text-center mb-3 text-black font-bold">
              Caser Cipher
            </p>

            <p className="text-2xl text-center text-black font-bold mb-3">
              Plain Text: {text}
            </p>

            {/* <p className='text-2xl text-center mb-5 text-black font-bold'>
            Customer Number: &nbsp;
            {secretKey}
          </p> */}

            <label
              htmlFor="encryptText"
              className="text-black font-bold text-xl"
            >
              Encrypted text
            </label>
            <input
              className="bg-gray-50 outline-none p-2 rounded-lg border-2 border-gray-600"
              type="encrypt text"
              name="encryptText"
              id="encryptText"
              placeholder="Enter caesar cipher encrypted text using cipher key"
              {...register("encryptText")}
            />
            <p className="text-red-600">{errors.encryptText?.message}</p>
            <button
              className="border-gray-600 text-black border-2 rounded-md font-bold text-xl hover:bg-gray-600 hover:text-white p-2 mt-4"
              type="submit"
            >
              Verify
            </button>
            <p className="text-center text-black mt-3 font-bold">
              Use link to decrypt: <br />
            </p>
            <a
              className="text-center"
              target="_blank"
              href="https://www.dcode.fr/caesar-cipher"
            >
              https://www.dcode.fr/caesar-cipher
            </a>
          </div>
        </form>
      </div>
    );
  }
  return <NotFound />;
};

export default CaesarCipher;
