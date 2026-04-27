import { useRef, useState } from "react";
import { uploadFile, uploadFiles, resolveImg } from "../api";
import { useToast } from "../context/ToastContext";

/**
 * FileDrop — drag & drop or click to upload.
 *
 * Modes:
 *  - "single"   → emits a single URL via onChange(url)
 *  - "multiple" → emits an array of URLs via onChange([url, ...])
 *
 * For "multiple", `value` should be an array (cumulative). The component
 * appends new uploads and offers a per-thumb remove.
 */
export default function FileDrop({
  mode = "single",
  value,
  onChange,
  accept = "image/*",
  label,
  hint,
  maxFiles = 10,
}) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const isMultiple = mode === "multiple";
  const items = isMultiple ? (Array.isArray(value) ? value : []) : value || "";

  const pickFiles = () => inputRef.current?.click();

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    const list = Array.from(files);
    setBusy(true);
    setProgress(0);

    try {
      if (isMultiple) {
        const remaining = maxFiles - items.length;
        if (remaining <= 0) {
          toast(`Maximum ${maxFiles} files`, "error");
          setBusy(false);
          return;
        }
        const accepted = list.slice(0, remaining);
        const fd = new FormData();
        accepted.forEach((f) => fd.append("files", f));
        const r = await uploadFiles(fd, (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        const urls = r.data?.urls || [];
        onChange?.([...items, ...urls]);
        toast(`Uploaded ${urls.length} file${urls.length === 1 ? "" : "s"}`, "success");
      } else {
        const fd = new FormData();
        fd.append("file", list[0]);
        const r = await uploadFile(fd, (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        const url = r.data?.url || (r.data?.filename ? `/uploads/${r.data.filename}` : "");
        if (!url) throw new Error("Upload failed");
        onChange?.(url);
        toast("File uploaded", "success");
      }
    } catch (ex) {
      toast(ex.response?.data?.message || "Upload failed", "error");
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeOne = (idx) => {
    if (!isMultiple) return;
    const next = items.filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const clearSingle = () => onChange?.("");

  return (
    <div className="filedrop">
      {label && <label className="filedrop-label">{label}</label>}

      <div
        className={`filedrop-zone ${drag ? "is-drag" : ""} ${busy ? "is-busy" : ""}`}
        onClick={pickFiles}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pickFiles()}
      >
        <div className="filedrop-icons" aria-hidden>
          <span className="filedrop-icon">🗂</span>
          <span className="filedrop-divider" />
          <span className="filedrop-icon">📤</span>
        </div>

        <div className="filedrop-text">
          {busy ? (
            <>
              <div className="filedrop-progress">
                <div
                  className="filedrop-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>Uploading… {progress}%</span>
            </>
          ) : (
            <>Drag &amp; drop {isMultiple ? "files" : "an image or file"} here</>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary filedrop-btn"
          onClick={(e) => {
            e.stopPropagation();
            pickFiles();
          }}
          disabled={busy}
        >
          {busy ? "Uploading…" : isMultiple ? "Upload files" : "Upload file"}
        </button>

        {hint && <div className="filedrop-hint">{hint}</div>}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={isMultiple}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {isMultiple && items.length > 0 && (
        <div className="filedrop-grid">
          {items.map((url, i) => (
            <div key={`${url}-${i}`} className="filedrop-thumb">
              <img src={resolveImg(url)} alt="" />
              <button
                type="button"
                className="filedrop-thumb-remove"
                onClick={() => removeOne(i)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!isMultiple && items && (
        <div className="filedrop-grid">
          <div className="filedrop-thumb">
            <img src={resolveImg(items)} alt="" />
            <button
              type="button"
              className="filedrop-thumb-remove"
              onClick={clearSingle}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
