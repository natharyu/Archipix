import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast } from "../store/slices/toast";

const Toast = () => {
  const { toast, showToast } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetToast());
    }, 3000);
  }, []);

  return showToast ? (
    <div id="toast" className={`${toast.type}`}>
      <p>{toast.message}</p>
    </div>
  ) : null;
};

export default Toast;
