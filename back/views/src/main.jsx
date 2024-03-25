import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Router from "./Router";
import "./main.scss";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router />
  </Provider>
);
