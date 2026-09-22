import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Feed } from "./components/Feed";
import { PostEditor } from "./components/PostEditor";
import { LoginForm } from "./components/LoginForm";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/write" element={<PostEditor />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
