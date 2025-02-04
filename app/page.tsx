import WeatherCard from "./components/WeatherCard";

export default function Home() {
  return (
    <section className="w-full  bg-gray-100">
      <main className="p-6">
        <WeatherCard />
      </main>
    </section>
  );
}
