/**
 * Handles the click event on the submit button.
 *
 * @param {void}
 * @return {void}
 */
function Submit(props) {
  const { onSubmit, files } = props;

  /**
   * Handles the click event on the submit button.
   * Filters the uploaded files to only those that have successfully uploaded or have received headers
   * and then calls the onSubmit function with the filtered array.
   */
  const handleSubmit = () => {
    // Filter the uploaded files to only those that have successfully uploaded or have received headers
    const filteredFiles = files.filter((file) => ["headers_received", "done"].includes(file.meta.status));

    // Call the onSubmit function with the filtered array of files
    onSubmit(filteredFiles);
  };

  return (
    <button className="send-files" onClick={handleSubmit}>
      Envoyer
    </button>
  );
}

export default Submit;
