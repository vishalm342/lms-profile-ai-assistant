"use client";

import { useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  GraduationCap,
  BookOpen,
  BookMarked,
  Shield,
  CheckCircle,
  Pencil,
  X,
  Trash2,
  Clock,
  BadgeDollarSign,
  Plus,
} from "lucide-react";

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-700">{value || "—"}</p>
      </div>
    </div>
  );
}

function EducationRow({ icon: Icon, label, sub, percentage }) {
  const color =
    percentage >= 80
      ? "text-orange-500"
      : percentage >= 60
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0 border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </div>
      <span className={`text-base font-bold ${color}`}>
        {percentage != null ? `${percentage}%` : "—"}
      </span>
    </div>
  );
}

function CourseCard({ app, onDelete, isDeleting, onToggle }) {
  return (
    <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3">
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-orange-400 flex items-center justify-center shrink-0">
        <BookMarked size={20} className="text-white" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-gray-800">
            {app.course.title} Specialization
          </p>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {app.status === 'accepted' ? 'ACTIVE' : 'COMPLETED'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={11} /> {app.course.duration_months} months
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <BadgeDollarSign size={11} /> {app.course.fee?.toLocaleString()} Rs/month
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onDelete(app.course.id)}
          disabled={isDeleting}
          title="Remove course"
          className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
        >
          {isDeleting ? (
            <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
        <button
          onClick={onToggle}
          title="Toggle course status"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            app.status === 'accepted'
              ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ProfileCards({ profileData, loading, studentId, onUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [togglingCourseId, setTogglingCourseId] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", duration: "", fee: "" });
  const [courseError, setCourseError] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);

  function openEditModal() {
    if (!profileData) return;
    setFormData({
      phone:               profileData.phone              ?? "",
      city:                profileData.city               ?? "",
      // Slice to YYYY-MM-DD for <input type="date">
      date_of_birth:       profileData.date_of_birth
                             ? profileData.date_of_birth.toString().slice(0, 10)
                             : "",
      tenth_board:         profileData.education?.tenth_board        ?? "",
      tenth_percentage:    profileData.education?.tenth_percentage   ?? "",
      twelfth_board:       profileData.education?.twelfth_board      ?? "",
      twelfth_percentage:  profileData.education?.twelfth_percentage ?? "",
    });
    setSaveError("");
    setIsEditModalOpen(true);
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/${studentId}`,
        formData
      );
      if (res.data.success) {
        setIsEditModalOpen(false);
        if (onUpdate) onUpdate();
      } else {
        setSaveError(res.data.message || "Update failed.");
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCourse(courseId) {
    if (!window.confirm("Remove this course from your profile?")) return;
    setDeletingCourseId(courseId);
    try {
      await axios.delete(
        `http://localhost:5000/api/profile/${studentId}/course/${courseId}`
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Course delete error:", err);
    } finally {
      setDeletingCourseId(null);
    }
  }

  async function handleToggleCourse(courseId) {
    setTogglingCourseId(courseId);
    try {
      await axios.put(
        `http://localhost:5000/api/profile/${studentId}/course/${courseId}/toggle`
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Course toggle error:", err);
    } finally {
      setTogglingCourseId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!profileData) return null;

  const { full_name, email, phone, date_of_birth, city, education, applications } =
    profileData;

  const totalCourses = applications?.length || 0;

  // Timezone-safe: "YYYY-MM-DD" → "DD/MM/YYYY" without Date() UTC shift
  const formattedDob = date_of_birth
    ? date_of_birth.toString().slice(0, 10).split('-').reverse().join('/')
    : "—";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Personal Info ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex items-start justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">Hi, {full_name}</h1>
          <button
            onClick={openEditModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit profile"
          >
            <Pencil size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <InfoItem icon={Mail} label="Email" value={email} />
          <InfoItem icon={CalendarDays} label="DOB" value={formattedDob} />
          <InfoItem icon={Phone} label="Phone" value={phone} />
          <InfoItem icon={MapPin} label="Location" value={city} />
        </div>
      </div>

      {/* ── Education Details ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={18} className="text-gray-500" />
          <h2 className="text-base font-bold text-gray-800">Education Details</h2>
        </div>
        <div>
          <EducationRow
            icon={BookOpen}
            label="10th Board"
            sub={education?.tenth_board || "—"}
            percentage={education?.tenth_percentage}
          />
          <EducationRow
            icon={BookMarked}
            label="12th Board"
            sub={education?.twelfth_board || "—"}
            percentage={education?.twelfth_percentage}
          />
        </div>
      </div>

      {/* ── Enrolled Courses (always visible) ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gray-400" /> Enrolled Courses
            <span className="ml-3 bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-bold">{totalCourses}</span>
          </h3>
          <button
            onClick={() => { setCourseError(""); setIsCourseModalOpen(true); }}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Course
          </button>
        </div>
        {applications && applications.length > 0 ? (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <CourseCard
                key={app.application_id}
                app={app}
                onDelete={handleDeleteCourse}
                isDeleting={deletingCourseId === app.course.id}
                onToggle={() => handleToggleCourse(app.course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
              <BookMarked size={26} className="text-orange-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No courses enrolled yet.</p>
            <p className="text-xs text-gray-400 mt-1">Your enrolled courses will appear here.</p>
          </div>
        )}
      </div>

      {/* ── Add Course Modal ── */}
      {isCourseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCourseModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Add Course</h2>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCourse.name.trim()) {
                  setCourseError("Course name is required.");
                  return;
                }
                setAddingCourse(true);
                setCourseError("");
                try {
                  await axios.post(
                    `http://localhost:5000/api/profile/${studentId}/course`,
                    { course_name: newCourse.name, duration: newCourse.duration, fee: newCourse.fee }
                  );
                  setIsCourseModalOpen(false);
                  setNewCourse({ name: "", duration: "", fee: "" });
                  if (onUpdate) onUpdate();
                } catch (err) {
                  setCourseError(err.response?.data?.message || "Failed to add course.");
                } finally {
                  setAddingCourse(false);
                }
              }}
              className="px-6 py-5 flex flex-col gap-4"
            >
              {courseError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {courseError}
                </p>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Gen AI Specialization"
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 6"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Fee (Rs/month)</label>
                  <input
                    type="text"
                    value={newCourse.fee}
                    onChange={(e) => setNewCourse((p) => ({ ...p, fee: e.target.value }))}
                    placeholder="e.g. 7000"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCourse}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg transition-colors"
                >
                  {addingCourse ? "Adding…" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {saveError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {saveError}
                </p>
              )}

              {/* Personal Info section */}
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Personal Info</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXXXXXXX"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Education section */}
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">Education Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">10th Board</label>
                  <input
                    type="text"
                    name="tenth_board"
                    value={formData.tenth_board}
                    onChange={handleChange}
                    placeholder="e.g. CBSE"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">10th %</label>
                  <input
                    type="number"
                    name="tenth_percentage"
                    value={formData.tenth_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 85"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">12th Board</label>
                  <input
                    type="text"
                    name="twelfth_board"
                    value={formData.twelfth_board}
                    onChange={handleChange}
                    placeholder="e.g. TN HSC"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">12th %</label>
                  <input
                    type="number"
                    name="twelfth_percentage"
                    value={formData.twelfth_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 90"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded-lg transition-colors"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
