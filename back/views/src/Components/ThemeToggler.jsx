import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setTheme } from "../store/slices/theme";

/**
 * Component to toggle dark mode on and off
 */
function ThemeToggler() {
  // Get dark mode state from redux store
  const { darkMode } = useSelector((state) => state.theme);
  // Get dispatch function from redux store
  const dispatch = useDispatch();

  // Run when component mounts to get theme preference from localStorage
  useEffect(() => {
    // Get theme state from redux store
    dispatch(getTheme());
  }, [darkMode]);

  // Return the theme toggle component
  return (
    // Label element to hold the input and span for the toggle
    <label className="theme-toggle">
      {/* Input element for the checkbox */}
      <input
        type="checkbox"
        // Name attribute for the input
        name="theme"
        // Event handler for when the checkbox is changed
        onChange={() => {
          // Dispatch action to toggle theme
          dispatch(setTheme());
        }}
        // Checked attribute to set the initial state of the checkbox
        checked={darkMode}
      />
      {/* Span element to hold the toggle */}
      <span className="slider"></span>
    </label>
  );
}

export default ThemeToggler;
