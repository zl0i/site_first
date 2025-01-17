import patternDashboard from "./CSS/patternDashboard.module.css";
import patternMenu from "../patternMenu.module.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import useDetectClickOut from "../../files/useDetectClickOut.js";

import zloiAPI from "../../files/API/zloiAPI.js";
import updateSVG from "../../files/img/update-arrows.svg";

export default function PointsDialog() {
  const orders = useSelector((state) => state.admin.orders);
  const scrollInOrders = useSelector((state) => state.admin.scrollInOrders);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const refBox = useDetectClickOut(() => dispatch({ type: "SET_BAR_SHOW" }));
  const scrollAbleDiv = useRef(null);

  function loadingOrders() {
    zloiAPI.getOrders(cookies.get("Token"))
      .then((res) => {
        dispatch({ type: "LOAD_ALL_ORDERS", payload: res.data.data });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: "ERROR_MESSAGE", payload: "Loading orders error" });
      });
    return <p>Loading...</p>;
  }

  function formattedDate(el_date) {
    let t = el_date.split(/\D/g);
    return {
      date: t[2] + "." + t[1] + "." + t[0].slice(-2),
      time: t[3] + ":" + t[4],
    };
  }

  useEffect(() => {
    if (scrollAbleDiv.current !== null) {
      scrollAbleDiv.current.scrollTop = scrollInOrders;
    }
  }, [scrollInOrders]);

  return (
    <div className={patternMenu.darkenBackground}>
      <div className={patternDashboard.showBox} ref={refBox}>
        <button
          className={patternMenu.exitButtonBig}
          onClick={() => dispatch({ type: "SET_BAR_SHOW" })}
        >
          ✖
        </button>
        <button
          className={patternMenu.updateButton}
          onClick={() => dispatch({ type: "REFRESH_AND_OPEN_ORDERS" })}
        >
          <img alt={"update"} src={updateSVG} draggable="false"/>
        </button>
        <div className={patternDashboard.usersTitle}>Orders:</div>
        {orders.length === 0 ? (
          loadingOrders()
        ) : (
          <>
            <li className={patternDashboard.line} key={"title"}>
              <p style={{ width: 30 }}>Id</p>
              <p style={{ width: 120 }}>Date</p>
              <p style={{ width: 120 }}>Time</p>
              <p style={{ width: 120 }}>Total cost</p>
              <p style={{ width: 100 }}>Status</p>
            </li>
            <div
              className={patternDashboard.scrollAbleDashboard}
              ref={scrollAbleDiv}
            >
              {orders.map((el, index) => (
                <li
                  className={`${patternDashboard.line} ${patternDashboard.hover}`}
                  key={index}
                  onClick={(e) => {
                    dispatch({
                      type: "SHOW_ORDER_CONTENT",
                      payload: el.content,
                      id: el.id,
                      scrollPosition:
                        e.target.nodeName === "P"
                          ? e.target.parentElement.parentElement.scrollTop
                          : e.target.parentElement.scrollTop,
                    });
                  }}
                >
                  <p style={{ width: 30 }}>{el.id}</p>
                  <p style={{ width: 120 }}>
                    {formattedDate(el.create_date).date}
                  </p>
                  <p style={{ width: 120 }}>
                    {formattedDate(el.create_date).time}
                  </p>
                  <p style={{ width: 120 }}>{el.total}</p>
                  <p style={{ width: 100 }}>{el.status}</p>
                </li>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
