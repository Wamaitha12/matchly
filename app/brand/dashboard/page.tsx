"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Creator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: number;
  mediaKit?: string;
  createdAt?: number; // used for "Recently added"
};

export default function BrandDashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);

  // Filters
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [minFollowers, setMinFollowers] = useState<string>("");
  const [maxFollowers, setMaxFollowers] = useState<string>("");
  const [hasMediaKitOnly, setHasMediaKitOnly] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<"recent" | "most" | "least">("recent");

  // Saved creators
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Load creators + saved
  useEffect(() => {
    const storedCreators = localStorage.getItem("creators");
    const parsed: Creator[] = storedCreators ? JSON.parse(storedCreators) : [];

    // Backwards compatibility: if older creators don't have createdAt,
    // we assign one once (so sorting by recent works).
    const normalized = parsed.map((c) => ({
      ...c,
      createdAt: c.createdAt ?? Date.now(),
    }));

    setCreators(normalized);

    // Persist normalization (optional, but keeps sorting stable)
    localStorage.setItem("creators", JSON.stringify(normalized));

    const storedSaved = localStorage.getItem("savedCreators");
    if (storedSaved) setSavedIds(JSON.parse(storedSaved));
  }, []);

  // Persist saved
  useEffect(() => {
    localStorage.setItem("savedCreators", JSON.stringify(savedIds));
  }, [savedIds]);

  function toggleSave(id: string) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const filteredCreators = useMemo(() => {
    const min = minFollowers === "" ? null : Number(minFollowers);
    const max = maxFollowers === "" ? null : Number(maxFollowers);

    return creators
      .filter((creator) => {
        // Text filters
        const matchesNiche =
          niche === "" ||
          creator.niche.toLowerCase().includes(niche.toLowerCase());

        const matchesPlatform =
          platform === "" || creator.platform === platform;

        // Min/Max followers
        const matchesMin = min === null || creator.followers >= min;
        const matchesMax = max === null || creator.followers <= max;

        // Media kit filter
        const matchesMediaKit = !hasMediaKitOnly || !!creator.mediaKit;

        // Saved filter
        const matchesSaved = !showSavedOnly || savedIds.includes(creator.id);

        return (
          matchesNiche &&
          matchesPlatform &&
          matchesMin &&
          matchesMax &&
          matchesMediaKit &&
          matchesSaved
        );
      })
      .sort((a, b) => {
        // Keep saved creators slightly prioritized (nice UX)
        const aSaved = savedIds.includes(a.id) ? 1 : 0;
        const bSaved = savedIds.includes(b.id) ? 1 : 0;
        if (aSaved !== bSaved) return bSaved - aSaved;

        // Sorting
        if (sortBy === "most") return b.followers - a.followers;
        if (sortBy === "least") return a.followers - b.followers;

        // recent
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      });
  }, [
    creators,
    niche,
    platform,
    minFollowers,
    maxFollowers,
    hasMediaKitOnly,
    showSavedOnly,
    savedIds,
    sortBy,
  ]);

  const hasAnyCreators = creators.length > 0;

  return (
    <main className="min-h-screen bg-neutral-900 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black px-6">
      <div className="max-w-6xl mx-auto pt-20 pb-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-100 mb-3 drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]">
            Discover Creators
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Filter creators by niche, platform, follower range, and media kits —
            then save your shortlist.
          </p>
        </div>

        <div className="bg-neutral-800/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-neutral-700">
          {/* Filters Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-2">Niche</label>
              <input
                type="text"
                placeholder="e.g. Sports, Beauty"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="">All Platforms</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>Twitter / X</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="recent">Recently added</option>
                <option value="most">Most followers</option>
                <option value="least">Least followers</option>
              </select>
            </div>
          </div>

          {/* Filters Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Minimum followers
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Maximum followers
              </label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={maxFollowers}
                onChange={(e) => setMaxFollowers(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setHasMediaKitOnly((v) => !v)}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium border transition focus:outline-none focus:ring-4 focus:ring-indigo-400/20
                  ${
                    hasMediaKitOnly
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                      : "bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-neutral-500"
                  }`}
              >
                {hasMediaKitOnly ? "Media kit: ON" : "Media kit: Any"}
              </button>
            </div>
          </div>

          {/* Saved toggle + count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <button
              type="button"
              onClick={() => setShowSavedOnly((v) => !v)}
              className="glow-btn inline-flex items-center justify-center rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-800 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
            >
              {showSavedOnly ? "Showing: Saved only" : "Show: Saved only"}
            </button>

            <p className="text-sm text-neutral-400">
              Saved: <span className="text-neutral-200">{savedIds.length}</span>
            </p>
          </div>

          {/* Empty states */}
          {!hasAnyCreators ? (
            <div className="text-center py-16">
              <p className="text-neutral-200 font-medium">
                No creators yet.
              </p>
              <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
                Add a creator profile first so brands can discover them here.
              </p>

              <Link
                href="/creator/onboarding"
                className="glow-btn mt-6 inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
              >
                Add a creator →
              </Link>
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-200 font-medium">
                No creators match your filters.
              </p>
              <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
                Try lowering your minimum followers, removing the media kit
                filter, or clearing niche/platform.
              </p>

              <button
                type="button"
                onClick={() => {
                  setNiche("");
                  setPlatform("");
                  setMinFollowers("");
                  setMaxFollowers("");
                  setHasMediaKitOnly(false);
                  setShowSavedOnly(false);
                  setSortBy("recent");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-lg border border-neutral-600 bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-100 hover:bg-neutral-800 transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((creator) => {
                const isSaved = savedIds.includes(creator.id);

                return (
                  <div
                    key={creator.id}
                    className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 hover:border-neutral-500 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-100">
                          {creator.name}
                        </h3>
                        <p className="text-neutral-400 text-sm mt-1">
                          {creator.niche} • {creator.platform}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(creator.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                          ${
                            isSaved
                              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                              : "bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-neutral-500"
                          }`}
                        aria-label={isSaved ? "Unsave creator" : "Save creator"}
                      >
                        {isSaved ? "★ Saved" : "☆ Save"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-sm text-neutral-300">
                        {creator.followers.toLocaleString()} followers
                      </p>

                      {creator.mediaKit ? (
                        <span className="text-xs text-indigo-200 bg-indigo-500/15 border border-indigo-500/30 px-2 py-1 rounded-full">
                          Media kit
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400 bg-neutral-800/60 border border-neutral-700 px-2 py-1 rounded-full">
                          No media kit
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/creator/profile/${creator.id}`}
                      className="glow-btn mt-6 block text-center w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
                    >
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-10 text-xs text-neutral-500 tracking-wide text-center">
          Built for modern creator collaborations
        </p>
      </div>
    </main>
  );
}
