import { useEffect, useState } from "react";
import SelectAll from "./SelectAll";
import SelectFiles from "./SelectFiles";
import SelectFolders from "./SelectFolders";

/**
 * The select menu component.
 * @param {Function} setSelectedFiles The function to set the selected files.
 * @param {Function} setSelectedFolders The function to set the selected folders.
 * @returns {JSX.Element} The select menu component.
 */
function SelectMenu({ setSelectedFiles, setSelectedFolders }) {
  // State to keep track if the select menu is shown or not
  const [showSelectMenu, setShowSelectMenu] = useState(false);

  /**
   * Handles the click event to show/hide the select menu.
   */
  const handleShowSelectMenu = () => {
    // Toggle the showSelectMenu state
    setShowSelectMenu(!showSelectMenu);
  };

  /**
   * Handles the click event outside of the select menu.
   * @param {MouseEvent} event The click event.
   */
  useEffect(() => {
    // Add an event listener to the document to detect clicks outside of the select menu
    const handleClickOutside = (event) => {
      // If the target element is not the select menu and the select menu is shown, hide it
      if (!event.target.matches(".selectMenu") && showSelectMenu) {
        setShowSelectMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSelectMenu]);

  return (
    <button className="selectMenu" onClick={handleShowSelectMenu}>
      Sélection
      {/* If the select menu is shown, show its children */}
      {showSelectMenu && (
        <div className="selectMenuContent">
          <SelectAll setSelectedFiles={setSelectedFiles} setSelectedFolders={setSelectedFolders} />
          <SelectFolders setSelectedFolders={setSelectedFolders} />
          <SelectFiles setSelectedFiles={setSelectedFiles} />
        </div>
      )}
    </button>
  );
}

export default SelectMenu;
