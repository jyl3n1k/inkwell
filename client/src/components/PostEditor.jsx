import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export function PostEditor() {
  const [status, setStatus] = useState("idle");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handlePublish(event) {
    event.preventDefault();
    setStatus("publishing");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Publishing failed.");
      }
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setStatus("editing");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handlePublish}>
      <div>
        <label htmlFor="post-title" className="block font-medium">Title</label>
        <input
          id="post-title"
          value={title}
          disabled={status === "publishing"}
          onChange={(event) => {
            setTitle(event.target.value);
            setStatus("editing");
          }}
          aria-describedby={errorMessage ? "post-error" : undefined}
          className="mt-1 block w-full rounded"
        />
      </div>
      <div>
        <label htmlFor="post-body" className="block font-medium">Body</label>
        <textarea
          id="post-body"
          rows={10}
          value={body}
          disabled={status === "publishing"}
          onChange={(event) => {
            setBody(event.target.value);
            setStatus("editing");
          }}
          className="mt-1 block w-full rounded"
        />
      </div>
      {errorMessage && (
        <p id="post-error" role="alert" className="text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "publishing"}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "publishing" ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
