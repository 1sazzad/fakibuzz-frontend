import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../api/api";

function normalizeQuestions(payload) {
  return payload?.questions || payload?.items || payload?.data || payload || [];
}

function normalizeTopics(payload) {
  return payload?.top_topics || payload?.topics || [];
}

function QuestionsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [overview, setOverview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [booting, setBooting] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("Search for a subject code or pick one from the list to load published data.");

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const response = await apiEndpoints.getSubjects();

        if (!active) {
          return;
        }

        const subjectList = response.data?.subjects || [];
        setSubjects(subjectList);

        if (subjectList.length > 0) {
          const firstSubjectCode = subjectList[0].subject_code;
          setSelectedSubject(firstSubjectCode);
          await loadSubjectData(firstSubjectCode);
        } else {
          setMessage("No published subjects are available yet.");
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setMessage("Unable to load published subjects right now.");
        }
      } finally {
        if (active) {
          setBooting(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  async function loadSubjectData(subjectCode) {
    if (!subjectCode) {
      setOverview(null);
      setQuestions([]);
      return;
    }

    setLoadingSubject(true);

    try {
      const [overviewResponse, questionsResponse] = await Promise.all([
        apiEndpoints.getSubjectOverview(subjectCode),
        apiEndpoints.getSubjectQuestions(subjectCode),
      ]);

      setOverview(overviewResponse.data || null);
      setQuestions(normalizeQuestions(questionsResponse.data));
      setMessage(`Loaded published data for ${subjectCode}.`);
    } catch (error) {
      console.error(error);
      setOverview(null);
      setQuestions([]);
      setMessage(error.response?.data?.detail || "Unable to load subject data right now.");
    } finally {
      setLoadingSubject(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (!searchQuery.trim()) {
      setMessage("Enter a subject code or subject name to search.");
      return;
    }

    setSearching(true);

    try {
      const response = await apiEndpoints.searchSubject(searchQuery.trim());
      const data = response.data || {};
      setSearchResult(data);

      if (data.found && data.subject_code) {
        setSelectedSubject(data.subject_code);
        await loadSubjectData(data.subject_code);
      } else {
        setOverview(null);
        setQuestions([]);
        setMessage(data.message || `No published subject found for "${searchQuery.trim()}".`);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Subject search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubjectChange(event) {
    const subjectCode = event.target.value;
    setSelectedSubject(subjectCode);

    if (!subjectCode) {
      setSearchResult(null);
      setOverview(null);
      setQuestions([]);
      setMessage("Pick a subject to view its overview and published questions.");
      return;
    }

    setSearchResult(null);
    await loadSubjectData(subjectCode);
  }

  const topicEntries = normalizeTopics(overview);
  const availableYears = overview?.available_years || [];

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading subjects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Subject discovery</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">Find published data by subject code or name</h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-300">
                Search subjects first, then browse the published questions, topic summary, and prediction availability.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Semantic search
              </button>
              <button
                type="button"
                onClick={() => navigate("/analysis")}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View analysis
              </button>
            </div>
          </div>
        </section>

        <form onSubmit={handleSearch} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
            Search subject
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="CSE-421 or E-Commerce and Web Engineering"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Browse published subjects
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.subject_code} value={subject.subject_code}>
                  {subject.subject_code} - {subject.subject_name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={searching}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {searching ? "Searching..." : "Search subject"}
            </button>
            <span className="text-sm text-slate-500">{message}</span>
          </div>
        </form>

        {searchResult && (
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">Search result</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {searchResult.subject_code || "Subject lookup"}
                </h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${searchResult.found ? "bg-cyan-50 text-cyan-700" : "bg-amber-50 text-amber-700"}`}>
                {searchResult.found ? "Published" : "Not found"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Subject name</p>
                <p className="mt-1 font-semibold text-slate-950">{searchResult.subject_name || "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total questions</p>
                <p className="mt-1 font-semibold text-slate-950">{searchResult.total_questions ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Can upload</p>
                <p className="mt-1 font-semibold text-slate-950">{searchResult.can_upload ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Available years</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {Array.isArray(searchResult.available_years) && searchResult.available_years.length > 0
                    ? searchResult.available_years.join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </section>
        )}

        {overview ? (
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    {overview.subject_code || selectedSubject}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {overview.subject_name || subjects.find((subject) => subject.subject_code === selectedSubject)?.subject_name || "Published subject"}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  Prediction {overview.prediction_available ? "available" : "not ready"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Questions</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{overview.total_questions ?? questions.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Years</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {availableYears.length > 0 ? availableYears.join(", ") : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Topics</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{topicEntries.length}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {topicEntries.length > 0 ? (
                  topicEntries.slice(0, 6).map((topic, index) => (
                    <span key={topic.topic || topic.name || index} className="rounded-full bg-cyan-50 px-3 py-1 text-sm text-cyan-700">
                      {topic.topic || topic.name || topic}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No topic summary returned.</span>
                )}
              </div>
            </section>

            <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">Next steps</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Use the subject in other workflows</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <p className="text-sm font-semibold text-slate-950">Semantic search</p>
                  <p className="mt-1 text-sm text-slate-500">Find similar published questions.</p>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/analysis")}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <p className="text-sm font-semibold text-slate-950">Topic analysis</p>
                  <p className="mt-1 text-sm text-slate-500">Review repeated topics and marks.</p>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/predict")}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <p className="text-sm font-semibold text-slate-950">Predictions</p>
                  <p className="mt-1 text-sm text-slate-500">See likely exam topics.</p>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/answers")}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <p className="text-sm font-semibold text-slate-950">Answer help</p>
                  <p className="mt-1 text-sm text-slate-500">Draft an exam-style answer.</p>
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            No published subject data loaded yet.
          </div>
        )}

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">Published questions</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Questions for the selected subject</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {loadingSubject ? "Refreshing..." : `${questions.length} loaded`}
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {questions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                No published questions available for this subject.
              </div>
            ) : (
              questions.map((question, index) => (
                <article key={question.id || `${question.question_no || index}-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">
                        {question.subject_code || selectedSubject || "Published subject"}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">
                        {question.question_no ? `Question ${question.question_no}` : `Question ${index + 1}`}
                      </h3>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">
                      {question.marks ?? "-"} marks
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-slate-700">
                    {question.question_text || question.text || "No question text provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    {question.exam_name && <span className="rounded-full bg-white px-3 py-1">{question.exam_name}</span>}
                    {question.exam_year && <span className="rounded-full bg-white px-3 py-1">{question.exam_year}</span>}
                    {question.topic && <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">{question.topic}</span>}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default QuestionsPage;
