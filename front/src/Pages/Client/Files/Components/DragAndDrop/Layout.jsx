/**
 * The DragAndDrop Layout component renders the Dropzone component, its
 * previews, and the input component.
 *
 * @param {Object} props
 * @param {JSX.Element} props.input The Dropzone input component.
 * @param {JSX.Element} props.previews The Dropzone previews component.
 * @param {JSX.Element} props.submitButton The Dropzone submit button component.
 * @param {Object} props.dropzoneProps The Dropzone props.
 * @param {Object[]} props.files The files list.
 * @param {Object} props.extra Additional props.
 * @param {number} props.extra.maxFiles The maximum number of files allowed.
 * @returns {JSX.Element} The DragAndDrop Layout component.
 */
function Layout(props) {
  const {
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  } = props;

  return (
    <div {...dropzoneProps}>
      {/* Container for the previews */}
      <div className="preview-container">{previews}</div>

      {/* Footer with the input and the submit button */}
      <div className="dropzone-footer">
        {/* Render the input if the max number of files has not been reached */}
        {files.length < maxFiles && input}

        {/* Render the submit button if there is at least one file */}
        {files.length > 0 && submitButton}
      </div>
    </div>
  );
}

export default Layout;
