const FEATURES = [
  {
    icon: "👤",
    title: "Tu cuenta, tu progreso",
    description: "Registrate e iniciá sesión para tener todo tu historial guardado y acceder desde cualquier dispositivo.",
  },
  {
    icon: "⚡",
    title: "Examen de 5 preguntas",
    description: "Generá un mini examen personalizado según tu rol, tecnología y nivel. La IA arma las preguntas por vos.",
  },
  {
    icon: "🃏",
    title: "Cards con Q&A",
    description: "Cada pregunta viene con su respuesta explicada en una card. Ideal para repasar a tu ritmo.",
  },
  {
    icon: "🗂️",
    title: "Historial guardado",
    description: "Todas tus cards quedan guardadas en tu cuenta. Volvé a practicar cuando quieras.",
  },
];
 
export default function Features() {
  return (
    <section className="w-full px-6 py-20 bg-white">
          
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Todo lo que necesitás para prepararte
        </h2>
        <p className="text-gray-400 text-base max-w-sm mx-auto">
          Una herramienta completa, simple y potenciada por IA.
        </p>
      </div>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {FEATURES.map(({ icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:border-gray-300 transition-colors"
          >
            <span className="text-2xl">{icon}</span>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
 
    </section>
  );
}