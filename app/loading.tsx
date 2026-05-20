export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0b30] text-white">
      <p className="text-7xl animate-pulse select-none" aria-hidden="true">🪳</p>
      <h2 className="mt-6 text-2xl font-bold tracking-wide text-yellow-300">
        Loading Parliament...
      </h2>
      <p className="mt-2 text-purple-300 text-sm">The naali is being processed...</p>
    </div>
  )
}
