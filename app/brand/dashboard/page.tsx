"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Creator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: number;
  mediaKit?: string;
};

export default function BrandDashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [followerRange, setFollowerRange] = useState("");

  // Load creators from localStorage (created via onboarding)
  useEffect(() => {
    const stored = localStorage.getItem("creators");
    if (stored) {
      setCreators(JSON.parse(stored));
    }
  }, []);

  const filteredCreators = creators.filter((creator) => {
    const matchesNiche =
      niche === "" ||
      creator.niche.toLowerCase().includes(niche.toLowerCase());

    const matchesPlatform =
      platform === "" || creator.platform === platform;

    const matchesFollowers =
      followerRange === "" ||
      (followerRange === "1-10" &&
        creator.followers >= 1000 &&
        creator.followers <= 10000) ||
      (followerRange === "10-50" &&
        creator.followers > 10000 &&
        creator.followers <= 50000) ||
      (followerRange === "50-100" &&
        creator.followers > 50000 &&
        creator.followers <= 100000) ||
      (followerRange === "100+" && creator.followers > 100000);

    return matchesNiche && matchesPlatform && matchesFollowers;
  });

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex justify-center px-4 py-12">
        <div className="w-full max-w-5xl bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-700">
          <h2 className="text-2xl font-semibold text-neutral-100 mb-1 text-center">
            Discover Creators
          </h2>
          <p className="text-neutral-400 mb-8 text-center">
            Filter creators by niche, platform, and audience size.
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              placeholder="Niche (e.g. Sports, Beauty)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            />

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            >
              <option value="">All Platforms</option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Twitter / X</option>
            </select>

            <select
              value={followerRange}
              onChange={(e) => setFollowerRange(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            >
              <option value="">Any Follower Count</option>
              <option value="1-10">1k – 10k</option>
              <option value="10-50">10k – 50k</option>
              <option value="50-100">50k – 100k</option>
              <option value="100+">100k+</option>
            </select>
          </div>

          {/* Results */}
          {filteredCreators.length === 0 ? (
            <p className="text-center text-neutral-400">
              No creators match your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-100">
                    {creator.name}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-2">
                    {creator.niche} • {creator.platform}
                  </p>
                  <p className="text-sm text-neutral-300 mb-4">
                    {creator.followers.toLocaleString()} followers
                  </p>

                  <Link
                    href={`/creator/profile/${creator.id}`}
                    className="block text-center w-full bg-indigo-400 text-neutral-900 py-2 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
