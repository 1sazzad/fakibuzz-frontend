import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiEndpoints } from "../api/api";
import { Badge, Button, Card, ErrorMessage, PageHeader, ResponsiveContainer } from "../components/ui";

function GenerateAnswerPage() {
  const location = useLocation();
  const [question, setQuestion] = useState(() => location.state?.question || "");
  const [subjectCode, setSubjectCode] = useState(() => location.state?.subject_code || "");
  const [answerType, setAnswerType] = useState("5_mark");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("Ask a question and generate a simple answer.");

  useEffect(() => {
    let active = true;

    apiEndpoints.getSubjects({ status: "published" })
      .then((response) => {
        if (!active) {
          return;
        }

        const subjectList = response.data?.subjects || [];
        setSubjects(subjectList);

        if (!subjectCode && subjectList.length > 0) {
          setSubjectCode(subjectList[0].subject_code);
        }
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setMessage("Could not load subjects. You can still type a subject code manually.");
        }
      });

    return () => {
      active = false;
    };
  }, [subjectCode]);

  async function handleGenerateAnswer(event) {
    event.preventDefault();

    if (!question.trim() || !subjectCode.trim()) {
      setAnswer("Please enter both a question and a subject code.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");
      setMessage("Generating answer using related stored questions...");

      const response = await apiEndpoints.generateAnswer({
        question: question.trim(),
        subject_code: subjectCode.trim(),
        answer_type: answerType,
      });

      setAnswer(response.data?.answer || response.data?.generated_answer || JSON.stringify(response.data, null, 2));
      setMessage("Answer generated successfully.");
    } catch (error) {
      console.error(error);
      setAnswer("Answer generation failed. Please check the backend response.");
      setMessage(error.response?.data?.detail || "The backend could not generate an answer for this request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsiveContainer>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          eyebrow="Answer generator"
          title="Generate exam-style answers with context"
          description="Draft a focused answer from the selected subject and related stored questions."
        />

        <Card>
          <form onSubmit={handleGenerateAnswer} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
                Question
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What is SEO?"
                  className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 leading-6 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Subject code
                <input
                  value={subjectCode}
                  onChange={(event) => setSubjectCode(event.target.value)}
                  placeholder="CSE-421"
                  list="subject-list"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Answer type
                <select
                  value={answerType}
                  onChange={(event) => setAnswerType(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="5_mark">5 Mark Answer</option>
                  <option value="10_mark">10 Mark Answer</option>
                  <option value="short_note">Short Note</option>
                  <option value="definition">Definition</option>
                  <option value="difference_table">Difference Table</option>
                </select>
              </label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate answer"}
            </Button>
          </form>

          <datalist id="subject-list">
            {subjects.map((subject) => (
              <option key={subject.subject_code} value={subject.subject_code}>
                {subject.subject_name}
              </option>
            ))}
          </datalist>

          <div className="mt-4">
            <ErrorMessage tone={answer.startsWith("Answer generation failed") ? "error" : "info"}>{message}</ErrorMessage>
          </div>

          {answer && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-950">Generated answer</h2>
                <Badge tone="indigo">{answerType.replace("_", " ")}</Badge>
              </div>

              <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-700 sm:text-base">{answer}</p>
            </div>
          )}
        </Card>
      </div>
    </ResponsiveContainer>
  );
}

export default GenerateAnswerPage;
