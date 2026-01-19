"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Creator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: number;
  mediaKit?: string;
  createdAt?: number;
};

export default function CreatorDashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [me, setMe] = useState<Creator | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("creators");
    const parsed: Creator[] = stored ? JSON.parse(stored) : [];
    setCreators(parsed);

    const sorted = [...parsed].sort(
      (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
    );
    setMe(sorted[0] ?? null);
  }, []);

  function saveCreators(next: Creator[]) {
    setCreators(next);
    localStorage.setItem("creators", JSON.stringify(next));

    const sorted = [...next].sort(
      (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
    );
    setMe(sorted[0] ?? null);
  }

  const completeness = useMemo(() => {
    if (!me) return 0;
    const fields = [
      !!me.name,
      !!me.niche,
      !!me.platform,
      !!me.followers,
      !!me.mediaKit,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [me]);

  function deleteMyProfile() {
    if (!me) return;
    const next = creators.filter((c) => c.id !== me.id);
    saveCreators(next);

    const saved = JSON.parse(localStorage.getItem("savedCreators") || "[]");
    localStorage.setItem(
      "savedCreators",
      JSON.stringify(saved.filter((id: string) => id !== me.id))
    );
  }

  function handleReplaceFile(file: File) {
    if (!me) return;

    if (file.type !== "application/pdf") {
      setErrors(["Media kit must be a PDF file"]);
      return;
    }

    setErrors([]);

    const url = URL.createObjectURL(file);
    const next = creators.map((c) =>
      c.id === me.id ? { ...c, mediaKit: url } : c
    );

    saveCreators(next);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleReplaceFile(file);
  }

  return (
    <main className="min-h-screen bg-neutral-900 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black px-6">
      <div className="max-w-5xl mx-auto pt-20 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-100 mb-3 drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]">
            Creator Dashboard
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Manage your profile and media kit — this is what brands see.
          </p>
        </div>

        {!me ? (
          <div className="bg-neutral-800/70 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-neutral-700 text-center">
            <p className="text-neutral-200 font-medium">No creator profile yet.</p>
            <p className="text-neutral-500 text-sm mt-2">
              Create your profile first so brands can discover you.
            </p>

            <Link
              href="/creator/onboarding"
              className="glow-btn mt-6 inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
            >
              Create my profile →
            </Link>
          </div>
        ) : (
          <div className="bg-neutral-800/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-neutral-700 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-100">
                  {me.name}
                </h2>
                <p className="text-neutral-400 mt-1">
                  {me.niche} • {me.platform}
                </p>
                <p className="text-neutral-300 mt-4">
                  {me.followers.toLocaleString()} followers
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>Profile completeness</span>
                    <span>{completeness}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-700">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Link
                  href={`/creator/profile/${me.id}`}
                  className="glow-btn block text-center w-full md:w-60 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
                >
                  View public profile
                </Link>

                <Link
                  href="/creator/onboarding"
                  className="block text-center w-full md:w-60 bg-neutral-900 border border-neutral-700 text-neutral-100 py-3 rounded-xl font-medium hover:bg-neutral-800 transition"
                >
                  Edit profile
                </Link>

                <button
                  type="button"
                  onClick={deleteMyProfile}
                  className="w-full md:w-60 bg-red-500/10 border border-red-500/30 text-red-200 py-3 rounded-xl font-medium hover:bg-red-500/15 transition"
                >
                  Delete profile
                </button>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-neutral-100">
                  Media Kit
                </h3>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="glow-btn bg-neutral-900 border border-neutral-700 text-neutral-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
                  >
                    Replace PDF
                  </button>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded mb-4">
                  <ul className="list-disc list-inside text-sm">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {me.mediaKit ? (
                <div className="border border-neutral-700 rounded-xl overflow-hidden">
                  <iframe src={me.mediaKit} className="w-full h-96 bg-neutral-900" />
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">
                  No media kit uploaded yet.
                </p>
              )}
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-neutral-500 tracking-wide text-center">
          Built for modern creator collaborations
        </p>
      </div>
    </main>
  );
}
