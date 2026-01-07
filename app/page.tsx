export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black flex flex-col items-center justify-center px-6 text-center">
      {/* Badge */}
      


      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-semibold text-neutral-100 mb-4 max-w-3xl drop-shadow-[0_0_25px_rgba(99,102,241,0.15)]">
        Find the right creators.
        <span className="block text-indigo-400">
          Faster & with confidence.
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-neutral-400 max-w-xl mb-10">
        Matchly helps brands discover creators that actually fit  by
        niche, platform, and audience size while creators present
        themselves professionally in one place.
      </p>

      {/* CTA buttons */}
     <div className="fle1x flex-col sm:flex-row gap-6 items-center">
        <a
          href="/creator/onboarding"
          className="px-12 py-4 bg-indigo-400 text-neutral-900 rounded-lg font-medium hover:opacity-90 transition"
        >
          I’m a Creator
        </a>

        <a
          href="/brand/dashboard"
          className="px-12 py-4 bg-neutral-800 border border-neutral-600 text-neutral-100 rounded-lg font-medium hover:bg-neutral-700 transition"
        >
          I’m a Brand
        </a>
      </div>

      {/* Footer hint */}
      <p className="mt-12 text-xs text-neutral-500 tracking-wide">
        Built for modern creator collaborations
      </p>
    </main>
  );
}
