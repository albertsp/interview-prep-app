const TECHS = [
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎨" },
  { name: "JavaScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Python", icon: "🐍" },
  { name: "SQL", icon: "🗄️" },
];

export default function Techs() {
  return (
    <section className="w-full py-24 bg-gray-50">

       <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Tecnologías disponibles
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Practica con las tecnologías más demandadas del mercado.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {TECHS.map(({ name, icon }) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-4 py-10 w-40 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
          >
            <span className="text-5xl">{icon}</span>
            <span className="text-base font-bold text-gray-900">{name}</span>
          </div>
        ))}
      </div>

    </section>
  );
}
