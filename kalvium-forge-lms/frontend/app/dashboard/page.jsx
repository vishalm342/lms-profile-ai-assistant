"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProfileCards from "@/components/ProfileCards";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id || id === "undefined" || id === "null") {
      localStorage.clear();
      router.push("/login");
      return;
    }
    setStudentId(id);
  }, [router]);

  const fetchProfile = useCallback(async () => {
    const id = localStorage.getItem("studentId");
    if (!id || id === "undefined" || id === "null") return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/profile/${id}`);
      if (res.data.success) {
        setProfileData(res.data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Could not load profile. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run once studentId is a real non-null value (state has settled)
    if (studentId && studentId !== 'undefined' && studentId !== 'null') {
      fetchProfile();
    }
  }, [studentId, fetchProfile]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-6 items-start">
          {/* Left — Profile Cards */}
          <div className="flex-1 min-w-0">
            <ProfileCards
              profileData={profileData}
              loading={loading}
              studentId={studentId}
              onUpdate={fetchProfile}
            />
          </div>

          {/* Right — Chat Widget (sticky) */}
          <div className="w-96 shrink-0 sticky top-20">
            <ChatWidget fetchProfile={fetchProfile} studentId={studentId} />
          </div>
        </div>
      </div>
    </div>
  );
}
