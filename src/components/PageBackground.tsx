// src/components/PageBackground.tsx

export default function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
      <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
    </div>
  )
}