"use client";

import { useParams } from "next/navigation";

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;

  // Load creators from localStorage (mock DB)
  const creators =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("creators") || "[]")
      : [];

  const creator = creators.find((c: any) => c.id === id);

  if (!creator) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-neutral-400">
        Creator not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-neutral-800 rounded-2xl p-8 border border-neutral-700">
        <h2 className="text-2xl font-semibold text-neutral-100">
          {creator.name}
        </h2>
        <p className="text-neutral-400 mb-4">
          {creator.niche} • {creator.platform}
        </p>

        <p className="text-neutral-300 mb-6">
          {creator.followers.toLocaleString()} followers
        </p>

        {creator.mediaKit && (
          <iframe
            src={creator.mediaKit}
            className="w-full h-96 border border-neutral-700 rounded-lg"
          />
        )}

        <button className="mt-6 w-full bg-indigo-400 text-neutral-900 py-3 rounded-lg font-medium">
          Contact Creator
        </button>
      </div>
    </div>
  );
}
