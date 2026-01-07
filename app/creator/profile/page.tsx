export default function CreatorProfile() {
  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-neutral-800 rounded-2xl p-8 border border-neutral-700">
        <h2 className="text-2xl font-semibold mb-1">
          Jane Doe
        </h2>
        <p className="text-neutral-400 mb-4">
          Beauty & Lifestyle Creator
        </p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-neutral-400">Platform:</span>{" "}
            Instagram
          </p>
          <p>
            <span className="text-neutral-400">Followers:</span>{" "}
            25,000
          </p>
        </div>

        <button className="mt-6 w-full bg-indigo-400 text-neutral-900 py-3 rounded-lg font-medium">
          Contact Creator
        </button>
      </div>
    </div>
  );
}
