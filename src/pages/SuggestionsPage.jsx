import { useEffect, useState } from "react";
import { apiEndpoints } from "../api/api";

function normalizeSubjects(payload) {
  const rawSubjects = Array.isArray(payload) ? payload : payload?.subjects || payload?.items || payload?.data || [];

  return rawSubjects
    .map((subject) => ({
      subject_code: String(subject?.subject_code ?? subject?.code ?? "").trim(),
      subject_name: String(subject?.subject_name ?? subject?.name ?? "").trim(),
    }))
    .filter((subject) => subject.subject_code);
}

function normalizeSuggestions(payload) {
  const seen = new Set();

  function splitSuggestionText(text) {
    return String(text)
      .split(/\n+/)
      .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
      .filter(Boolean)
      .map((question) => ({ question }));
  }

  function collect(value, parentTopic = "") {
    if (!value) {
      return [];
    }

    if (typeof value === "string") {
      return splitSuggestionText(value).map((item) => ({ ...item, topic: parentTopic || item.topic }));
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) => collect(item, parentTopic));
    }

    if (typeof value !== "object") {
      return [];
    }

    if (seen.has(value)) {
      return [];
    }
    seen.add(value);

    const topic = value.topic || value.final_topic || value.suggested_topic || parentTopic;
    const questionText =
      value.question ||
      value.question_text ||
      value.text ||
      value.title ||
      value.prompt ||
      value.suggestion;

    const directItems = questionText ? [{ ...value, question: questionText, topic }] : [];
    const nestedItems = [
      value.suggestions,
      value.suggested_questions,
      value.probable_questions,
      value.important_questions,
      value.questions,
      value.items,
      value.results,
      value.data,
    ].flatMap((item) => collect(item, topic));

    return [...directItems, ...nestedItems];
  }

  return collect(payload).filter((item, index, list) => {
    const key = `${item.question || item.question_text || item.text || ""}-${item.topic || ""}`;
    return key.trim() && list.findIndex((candidate) => `${candidate.question || candidate.question_text || candidate.text || ""}-${candidate.topic || ""}` === key) === index;
  });
}

function getErrorMessage(error, fallback) {
  const detail = error.response?.data?.detail || error.response?.data?.message;
  return typeof detail === "string" ? detail : error.message || fallback;
}

function getSuggestionsMessage(payload, count) {
  if (payload?.message) {
    return payload.message;
  }

  if (payload?.pending_review_count > 0) {
    return `No approved topics yet. ${payload.pending_review_count} topic review item(s) are pending approval.`;
  }

  return `Found ${count} suggestion(s).`;
}

function getSuggestionText(item) {
  return item.question || item.question_text || item.text || item.title || item.prompt || item.suggestion || "Suggested question";
}

function getSuggestionMarks(item) {
  return item.marks ?? item.total_marks ?? item.expected_marks ?? "-";
}

function getSuggestionScore(item) {
  return item.score ?? item.confidence ?? item.probability ?? item.frequency ?? "-";
}

function SuggestionsPage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectCode, setSubjectCode] = useState("");
  const [query, setQuery] = useState("important questions for final exam");
  const [topK, setTopK] = useState(10);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await apiEndpoints.getSubjects();
        const subjectList = normalizeSubjects(response.data);
        setSubjects(subjectList);

        if (subjectList.length > 0) {
          setSubjectCode(subjectList[0].subject_code);
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to load published subjects. Enter a subject code manually.");
      }
    }

    loadSubjects();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!subjectCode.trim()) {
      setMessage("Enter a subject code first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuggestions([]);

    try {
      const response = await apiEndpoints.getSuggestions({
        subject_code: subjectCode.trim(),
        query: query.trim() || "important questions for final exam",
        top_k: Number(topK) || 10,
      });
      const nextSuggestions = normalizeSuggestions(response.data);
      setSuggestions(nextSuggestions);
      setMessage(getSuggestionsMessage(response.data, nextSuggestions.length));
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error, "Unable to generate suggestions."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-88px)] bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Suggestions</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Generate exam question suggestions</h1>
          <p className="mt-2 text-sm text-slate-500">Uses POST /suggestions with a subject code, query, and result limit.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr_140px_auto]">
            {subjects.length > 0 ? (
              <select value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400">
                {subjects.map((subject) => (
                  <option key={subject.subject_code} value={subject.subject_code}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            ) : (
              <input value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} placeholder="Subject code" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            )}
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="important questions for final exam" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            <input type="number" min="1" max="50" value={topK} onChange={(event) => setTopK(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            <button type="submit" disabled={loading} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:bg-slate-300">
              {loading ? "Loading..." : "Generate"}
            </button>
          </form>

          {message && <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p>}
        </div>

        <div className="grid gap-4">
          {suggestions.map((item, index) => (
            <article key={item.id || index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Suggestion {index + 1}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{getSuggestionText(item)}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">{item.topic || item.final_topic || item.suggested_topic || "No topic"}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{getSuggestionMarks(item)} marks</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{getSuggestionScore(item)} score</span>
              </div>
            </article>
          ))}

          {suggestions.length === 0 && <p className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">No suggestions generated yet.</p>}
        </div>
      </section>
    </main>
  );
}

export default SuggestionsPage;
