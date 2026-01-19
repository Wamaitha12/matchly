"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Creator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: number;
  mediaKit?: string; // object URL (demo only)
  createdAt: number;
};

export default function CreatorOnboarding() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    niche: "",
    platform: "",
    followers: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setErrors(["Media kit must be a PDF file"]);
      return;
    }

    setErrors([]);
    setMediaKit(file);

    // demo preview url (works until refresh)
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function removeMediaKit() {
    setMediaKit(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: string[] = [];
    if (!form.name.trim()) newErrors.push("Full name is required");
    if (!form.niche.trim()) newErrors.push("Niche is required");
    if (!form.platform.trim()) newErrors.push("Platform is required");
    if (!form.followers.trim()) newErrors.push("Follower count is required");
    if (!mediaKit || !previewUrl) newErrors.push("Media kit (PDF) is required");

    setErrors(newErrors);
    if (newErrors.length > 0) return;

    const creator: Creator = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      niche: form.niche.trim(),
      platform: form.platform.trim(),
      followers: Number(form.followers),
      mediaKit: previewUrl,
      createdAt: Date.now(),
    };

    const existing: Creator[] = JSON.parse(
      localStorage.getItem("creators") || "[]"
    );

    localStorage.setItem("creators", JSON.stringify([...existing, creator]));

    // go to dashboard
    router.push("/creator/dashboard");
  }

  return (
    <main className="min-h-screen bg-neutral-900 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black px-6">
      <div className="max-w-xl mx-auto pt-20 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-100 mb-3 drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]">
            Create your Matchly profile
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Build a professional profile brands can trust.
          </p>
        </div>

        <div className="bg-neutral-800/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-neutral-700">
          {errors.length > 0 && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded mb-6">
              <ul className="list-disc list-inside text-sm">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Niche
              </label>
              <input
                name="niche"
                value={form.niche}
                onChange={handleChange}
                placeholder="Beauty, Sports, Gaming..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Primary Platform
              </label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="">Select platform</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>Twitter / X</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Follower Count
              </label>
              <input
                name="followers"
                type="number"
                value={form.followers}
                onChange={handleChange}
                placeholder="25000"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            {/* Dropzone */}
            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Media Kit (PDF)
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition
                  ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-400/10"
                      : "border-neutral-600 hover:border-neutral-400"
                  }`}
              >
                <p className="text-sm text-neutral-200 font-medium">
                  {mediaKit ? "Replace media kit" : "Drag & drop PDF here"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Or tap to upload (phone & laptop supported)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {mediaKit && (
                <div className="flex items-center justify-between mt-3 gap-4">
                  <p className="text-xs text-neutral-400 truncate">
                    Selected: {mediaKit.name}
                  </p>
                  <button
                    type="button"
                    onClick={removeMediaKit}
                    className="text-xs text-red-300 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* PDF Preview */}
            {previewUrl && (
              <div className="mt-4 border border-neutral-700 rounded-xl overflow-hidden">
                <iframe src={previewUrl} className="w-full h-72 bg-neutral-900" />
              </div>
            )}

            <button
              type="submit"
              className="glow-btn w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-indigo-400/30 mt-2"
            >
              Save Profile
            </button>
          </form>
        </div>

        <p className="mt-10 text-xs text-neutral-500 tracking-wide text-center">
          Built for modern creator collaborations
        </p>
      </div>
    </main>
  );
}
