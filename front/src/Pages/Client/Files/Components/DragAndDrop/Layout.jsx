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
      <div className="preview-container">{previews}</div>

      <div className="dropzone-footer">
        {files.length < maxFiles && input}

        {files.length > 0 && submitButton}
      </div>
    </div>
  );
}

export default Layout;
