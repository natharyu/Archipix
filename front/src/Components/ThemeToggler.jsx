import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setTheme } from "../store/slices/theme";

function ThemeToggler() {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTheme());
  }, [darkMode]);

  return (
    <label className="theme-toggle">
      <input type="checkbox" name="theme" onChange={() => dispatch(setTheme())} checked={darkMode} />
      <span className="slider"></span>
    </label>
  );
}

export default ThemeToggler;
