import s from "./login.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import zloiAPI from "../../files/API/zloiAPI.js";
import InputPhone from "./InputPhone.jsx";
import InputCode from "./InputCode.jsx";

import vkIco from "../../files/img/token/vk.png";
import yandexIco from "../../files/img/token/ya.png";
import googleIco from "../../files/img/token/gog.png";

export default function ByPhone() {
  const [phone, setPhone] = useState("8(___)___-__-__");
  const [code, setCode] = useState("____");
  const [isShowVYG, setShowVYG] = useState(true);
  const [inputType, setInputType] = useState("Phone");
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const { t } = useTranslation();

  function sendPhoneNumber() {
    let preparedPhone = phone.split("").filter((e) => !isNaN(Number(e)));
    preparedPhone = "+7" + preparedPhone.join("").slice(1);
    dispatch({ type: "SUCCESS_MESSAGE", payload: t("Checking phone") });
    zloiAPI.authByPhone(preparedPhone)
      .then(() => {
        setInputType("Code");
        setShowVYG(false);
        dispatch({ type: "SUCCESS_MESSAGE", payload: t("Code sent") });
      })
      .catch((err) => {
        dispatch({ type: "ERROR_MESSAGE", payload: err.message });
      });
  }

  function sendCode() {
    dispatch({ type: "SUCCESS_MESSAGE", payload: t("Checking code") });
    zloiAPI.authByCode(code)
      .then((res) => {
        console.log("Your token is " + res.data.token);
        dispatch({ type: "SUCCESS_MESSAGE", payload: t("Code confirmed") });
        cookies.set("Token", res.data.token, { path: "/" });
        dispatch({ type: "LOGIN_CONFIRM", payload: res.data[0] });
        dispatch({ type: "PROFILE_DIALOG_SHOW" });
        dispatch({ type: "PROFILE_DIALOG_STATE", payload: "Profile" });
        dispatch({ type: "LOAD_PROFILE" });
      })
      .catch((err) => {
        dispatch({ type: "ERROR_MESSAGE", payload: err.message });
      });
  }

  function getAnswerToken(method) {
    zloiAPI.authByOAuth(method);
    dispatch({ type: "PROFILE_DIALOG_STATE", payload: "Wait" });
  }

  return (
    <div className={s.afterName}>
      <div className={s.firstLine}>
        {inputType === "Code" && <div className={s.sendCodeFor}>{phone}</div>}
        <div className={s.numberOrCodeBox}>
          {inputType === "Phone" ? (
            <InputPhone
              phone={phone}
              setPhone={setPhone}
              doNext={sendPhoneNumber}
              className={s.phoneForm}
            />
          ) : (
            <InputCode
              code={code}
              setCode={setCode}
              doNext={sendCode}
              className={s.codeAfterNumber}
            />
          )}
        </div>
        <button
          className={s.loginBtn}
          onClick={inputType === "Phone" ? sendPhoneNumber : sendCode}
        >
          {t("Next")}
        </button>
      </div>
      <button
        className={s.loginByPassLink}
        onClick={() =>
          dispatch({ type: "PROFILE_DIALOG_STATE", payload: "byPass" })
        }
      >
        {t("Sign in by password")}
      </button>
      {isShowVYG && (
        <>
          <div className={s.loginByToken}>{t("Sign in with")}:</div>
          <div className={s.tokenImg}>
            <button>
              <img
                src={vkIco}
                alt={"Vk"}
                onClick={() => getAnswerToken("vk")}
              />
            </button>
            <button>
              <img
                src={yandexIco}
                alt={"Yandex"}
                onClick={() => getAnswerToken("yandex")}
              />
            </button>
            <button>
              <img
                src={googleIco}
                alt={"Google"}
                onClick={() => getAnswerToken("google")}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
