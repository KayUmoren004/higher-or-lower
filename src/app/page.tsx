import HigherLowerGame from "../components/HigherLowerGame";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-left">
        Higher or Lower Card Game
      </h1>
      <HigherLowerGame />
    </main>
  );
}
