import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiEndpoints } from "../api/api";
import { useAuth } from "../context/useAuth";
import { Button, Card, ErrorMessage, PageHeader, ResponsiveContainer } from "../components/ui";
import { getInstitutionDisplay } from "../utils/institution";
import { getApiErrorMessage } from "../utils/auth";

function normalizeItems(payload, key) {
  const items = Array.isArray(payload) ? payload : payload?.[key] || payload?.items || payload?.data || [];
  return Array.isArray(items) ? items : [];
}

function getUniversityId(university) {
  return university.id ?? university.university_id;
}

function getDepartmentId(department) {
  return department.id ?? department.department_id;
}

function getUniversityLabel(university) {
  const name = university.university_name || university.name || "";
  const shortName = university.short_name || "";
  return shortName ? `${name} (${shortName})` : name;
}

function getDepartmentLabel(department) {
  const name = department.department_name || department.name || "";
  const shortName = department.short_name || "";
  return shortName ? `${name} (${shortName})` : name;
}

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const institution = getInstitutionDisplay(user);
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUniversityDraft, setSelectedUniversityDraft] = useState(null);
  const [selectedDepartmentDraft, setSelectedDepartmentDraft] = useState(null);
  const [universitiesLoading, setUniversitiesLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");

  const isStudent = user?.role === "student";
  const selectedUniversity = selectedUniversityDraft ?? (user?.university_id ? String(user.university_id) : "");
  const selectedDepartment = selectedDepartmentDraft ?? (user?.department_id ? String(user.department_id) : "");

  useEffect(() => {
    // Show message when redirected here due to missing academic scope
    if (location?.state?.message) {
      setMessageTone("error");
      setMessage(location.state.message);
    }

    if (!isStudent) {
      return;
    }

    let active = true;
    Promise.resolve()
      .then(() => {
        setUniversitiesLoading(true);
        return apiEndpoints.getUniversities();
      })
      .then((response) => {
        if (!active) {
          return;
        }
        setUniversities(normalizeItems(response.data, "universities"));
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setMessageTone("error");
          setMessage(getApiErrorMessage(error, "Unable to load universities."));
        }
      })
      .finally(() => {
        if (active) {
          setUniversitiesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isStudent]);

  useEffect(() => {
    if (!isStudent || !selectedUniversity) {
      return;
    }

    let active = true;
    Promise.resolve()
      .then(() => {
        setDepartmentsLoading(true);
        return apiEndpoints.getUniversityDepartments(selectedUniversity);
      })
      .then((response) => {
        if (!active) {
          return;
        }
        const nextDepartments = normalizeItems(response.data, "departments");
        setDepartments(nextDepartments);
        setSelectedDepartmentDraft((currentDepartment) =>
          currentDepartment &&
          !nextDepartments.some((department) => String(getDepartmentId(department)) === currentDepartment)
            ? ""
            : currentDepartment,
        );
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setDepartments([]);
          setMessageTone("error");
          setMessage(getApiErrorMessage(error, "Unable to load departments."));
        }
      })
      .finally(() => {
        if (active) {
          setDepartmentsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isStudent, selectedUniversity]);

  const hasMissingAcademicScope = isStudent && (!user?.university_id || !user?.department_id);
  const canSaveAcademicScope = Boolean(selectedUniversity && selectedDepartment && !saving);

  const selectedUniversityName = useMemo(() => {
    return universities.find((university) => String(getUniversityId(university)) === selectedUniversity)?.university_name || "";
  }, [universities, selectedUniversity]);

  function handleUniversityChange(event) {
    setSelectedUniversityDraft(event.target.value);
    setSelectedDepartmentDraft("");
    setDepartments([]);
    setMessage("");
  }

  async function handleSaveAcademicScope(event) {
    event.preventDefault();

    if (!selectedUniversity || !selectedDepartment) {
      setMessageTone("error");
      setMessage("Select both university and department before saving.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await apiEndpoints.updateCurrentUserProfile({
        university_id: Number(selectedUniversity),
        department_id: Number(selectedDepartment),
      });
      await refreshUser();
      setSelectedUniversityDraft(selectedUniversity);
      setSelectedDepartmentDraft(selectedDepartment);
      setMessageTone("success");
      setMessage("Academic profile updated successfully.");
    } catch (error) {
      console.error(error);
      setMessageTone("error");
      setMessage(getApiErrorMessage(error, "Unable to update academic profile."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ResponsiveContainer>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Profile"
          title={user?.full_name || "User Profile"}
          description="Your account details used across the FakiBuzz dashboard."
        />
        {isStudent && (
          <Card as="form" onSubmit={handleSaveAcademicScope} className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Academic profile</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">University and department</h2>
              {hasMissingAcademicScope && (
                <p className="mt-1 text-sm text-slate-600">
                  Complete this information to access subjects for your department.
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                University
                <select
                  value={selectedUniversity}
                  onChange={handleUniversityChange}
                  disabled={universitiesLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">{universitiesLoading ? "Loading universities..." : "Select university"}</option>
                  {universities.map((university) => {
                    const id = getUniversityId(university);
                    return (
                      <option key={id || getUniversityLabel(university)} value={id}>
                        {getUniversityLabel(university)}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Department
                <select
                  value={selectedDepartment}
                  onChange={(event) => {
                    setSelectedDepartmentDraft(event.target.value);
                    setMessage("");
                  }}
                  disabled={!selectedUniversity || departmentsLoading || departments.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">
                    {!selectedUniversity
                      ? "Select university first"
                      : departmentsLoading
                        ? "Loading departments..."
                        : "Select department"}
                  </option>
                  {departments.map((department) => {
                    const id = getDepartmentId(department);
                    return (
                      <option key={id || getDepartmentLabel(department)} value={id}>
                        {getDepartmentLabel(department)}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            {selectedUniversity && !departmentsLoading && departments.length === 0 && (
              <ErrorMessage tone="warning">
                {selectedUniversityName
                  ? `No active departments found for ${selectedUniversityName}.`
                  : "No active departments found for this university."}
              </ErrorMessage>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={!canSaveAcademicScope}>
                {saving ? "Saving..." : "Save academic profile"}
              </Button>
              <ErrorMessage tone={messageTone}>{message}</ErrorMessage>
            </div>
          </Card>
        )}
        <Card>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</p>
            <p className="mt-2 font-medium text-slate-950">{user?.email || "-"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone</p>
            <p className="mt-2 font-medium text-slate-950">{user?.phone_number || "-"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role</p>
            <p className="mt-2 font-medium capitalize text-slate-950">{user?.role || "student"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">User ID</p>
            <p className="mt-2 font-medium text-slate-950">{user?.id || "-"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email verified</p>
            <p className="mt-2 font-medium text-slate-950">{user?.is_email_verified ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Terms accepted</p>
            <p className="mt-2 font-medium text-slate-950">{user?.terms_accepted ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Institution ID</p>
            <p className="mt-2 font-medium text-slate-950">{institution.institutionId}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Institution</p>
            <p className="mt-2 font-medium text-slate-950">{institution.institutionName}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Department</p>
            <p className="mt-2 font-medium text-slate-950">{institution.department}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Program</p>
            <p className="mt-2 font-medium text-slate-950">{institution.program}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Batch/session</p>
            <p className="mt-2 font-medium text-slate-950">{institution.batchSession}</p>
          </div>
        </div>
        </Card>
      </div>
    </ResponsiveContainer>
  );
}

export default ProfilePage;
