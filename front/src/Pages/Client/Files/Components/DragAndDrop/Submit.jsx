function Submit(props) {
  const { onSubmit, files } = props;

  const handleSubmit = () => {
    onSubmit(files.filter((file) => ["headers_received", "done"].includes(file.meta.status)));
  };

  return (
    <button className="send-files" onClick={handleSubmit}>
      Envoyer
    </button>
  );
}

export default Submit;
