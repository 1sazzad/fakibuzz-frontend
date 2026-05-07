import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import UploadPage from "./pages/UploadPage";
import QuestionsPage from "./pages/QuestionsPage";
import SimilarQuestionsPage from "./pages/SimilarQuestionsPage";
import TopicsPage from "./pages/TopicsPage";
import PredictionsPage from "./pages/PredictionsPage";
import GenerateAnswerPage from "./pages/GenerateAnswerPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/search" element={<SimilarQuestionsPage />} />
        <Route path="/analysis" element={<TopicsPage />} />
        <Route path="/predict" element={<PredictionsPage />} />
        <Route path="/answers" element={<GenerateAnswerPage />} />
        <Route path="/admin/exams" element={<UploadPage />} />
      </Routes>
    </>
  );
}

export default App;