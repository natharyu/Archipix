import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { shareGetFile } from "../../../store/slices/files";
import { setToast } from "../../../store/slices/toast";

function ShareFile() {
  const { id } = useParams();
  const [validLink, setValidLink] = useState(false);
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const { currentFile } = useSelector((state) => state.file);
  const navigate = useNavigate();

  const verifyLink = async (id) => {
    await fetch(`/api/v1/share/verify/${id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setValidLink(true);
          dispatch(shareGetFile(data.file_id));
          setUrl(data.link);
        } else {
          setValidLink(false);
          navigate("/error");
          dispatch(setToast({ message: data.message, type: "error", showToast: true }));
        }
      });
  };
  useEffect(() => {
    verifyLink(id);
  }, [id]);

  return (
    <>
      {validLink ? (
        <div>
          {/* If the file is an image, display an image tag */}
          {currentFile?.type.includes("image") && <img src={url} alt="Preview" />}

          {/* If the file is a video, display a video tag */}
          {currentFile?.type.includes("video") && <video src={url} controls />}
        </div>
      ) : (
        <h2>Le lien n'est pas valide</h2>
      )}
    </>
  );
}

export default ShareFile;
