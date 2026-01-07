"use client";

import { useState, useRef } from "react";

export default function CreatorOnboarding() {
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
    setPreviewUrl(URL.createObjectURL(file));
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const newErrors: string[] = [];

  if (!form.name) newErrors.push("Full name is required");
  if (!form.niche) newErrors.push("Niche is required");
  if (!form.platform) newErrors.push("Platform is required");
  if (!form.followers) newErrors.push("Follower count is required");
  if (!mediaKit) newErrors.push("Media kit (PDF) is required");

  setErrors(newErrors);

  if (newErrors.length > 0) return;

  const creator = {
    id: crypto.randomUUID(),
    name: form.name,
    niche: form.niche,
    platform: form.platform,
    followers: Number(form.followers),
    mediaKit: previewUrl,
  };

  const existing =
    JSON.parse(localStorage.getItem("creators") || "[]");

  localStorage.setItem(
    "creators",
    JSON.stringify([...existing, creator])
  );

  alert("Congrats You'll recieve an Email once chosen!");
}


  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-700">
          <h2 className="text-2xl font-semibold text-neutral-100 mb-1 text-center">
            Create your Matchly profile
          </h2>
          <p className="text-neutral-400 mb-6 text-center">
            Build a professional profile brands can trust.
          </p>

          {errors.length > 0 && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded mb-4">
              <ul className="list-disc list-inside text-sm">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            />

            {/* Niche */}
            <input
              name="niche"
              value={form.niche}
              onChange={handleChange}
              placeholder="Niche (Beauty, Gaming, Fitness)"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            />

            {/* Platform */}
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            >
              <option value="">Select platform</option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Twitter / X</option>
            </select>

            {/* Followers */}
            <input
              name="followers"
              type="number"
              value={form.followers}
              onChange={handleChange}
              placeholder="Follower count"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-100"
            />

            {/* Media Kit Dropzone */}
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
                className={`cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition
                  ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-400/10"
                      : "border-neutral-600 hover:border-neutral-400"
                  }`}
              >
                <p className="text-sm text-neutral-300">
                  {mediaKit
                    ? "Replace media kit"
                    : "Drag & drop PDF here or tap to upload"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  
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
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-neutral-400">
                    Selected: {mediaKit.name}
                  </p>
                  <button
                    type="button"
                    onClick={removeMediaKit}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* PDF Preview */}
            {previewUrl && (
              <div className="mt-4 border border-neutral-700 rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-64 bg-neutral-900"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-400 text-neutral-900 py-3 rounded-lg font-medium hover:opacity-90 transition mt-4"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
