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
    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
  <a
  href="/creator/onboarding"
  className="glow-btn px-12 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white rounded-full font-semibold shadow-lg hover:from-indigo-600 hover:via-indigo-700 hover:to-violet-700 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
>
  I’m a Creator
</a>

<a
  href="/brand/dashboard"
  className="glow-btn px-12 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white rounded-full font-semibold shadow-lg hover:from-indigo-600 hover:via-indigo-700 hover:to-violet-700 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
>
  I’m a Brand
</a>

</div>


      {/* Footer hint */}
      <p className="mt-16 text-xs text-neutral-500 tracking-wide">
        Built for modern creator collaborations
      </p>
    </main>
  );
}
