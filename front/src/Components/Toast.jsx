import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast } from "../store/slices/toast";

/**
 * Toast component
 *
 * Displays toast notification based on the redux store's toast state
 */
const Toast = () => {
  const { toast, showToast } = useSelector((state) => state.toast); // toast state from redux store
  const dispatch = useDispatch(); // redux dispatch function

  useEffect(() => {
    /**
     * Reset toast notification after 3 seconds
     */
    setTimeout(() => {
      dispatch(resetToast()); // reset toast state
    }, 3000);
  }, []); // empty array as second argument will only run the effect once on mount

  return showToast ? (
    /**
     * If toast state is true, render toast notification
     */
    <div id="toast" className={`${toast.type}`}>
      {/* className is either 'success' or 'error' or 'warning' */}
      <p>{toast.message}</p> {/* message from redux store */}
    </div>
  ) : null; // else return null
};

export default Toast;
