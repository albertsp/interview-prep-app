const STEPS = [
  {
    number: "1",
    title: "Configurá tu sesión",
    description: "Elegí tu rol, la tecnología que querés practicar y tu nivel de experiencia.",
  },
  {
    number: "2",
    title: "La IA genera tu examen",
    description: "En segundos tenés 5 preguntas personalizadas listas para responder.",
  },
  {
    number: "3",
    title: "Practicá con las cards",
    description: "Revisá cada pregunta con su respuesta explicada y guardadas en tu historial.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-6 py-20 bg-gray-50">

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Cómo funciona
        </h2>
        <p className="text-gray-400 text-base max-w-sm mx-auto">
          Tres pasos para prepararte para tu próxima entrevista.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row items-start justify-center gap-8 max-w-2xl mx-auto">
        {STEPS.map(({ number, title, description }, index) => (
          <div key={number} className="flex flex-col items-center text-center gap-4 flex-1">

            {/* Number + connector */}
            <div className="flex items-center w-full justify-center gap-2">
              {/* Left line */}
              {index !== 0 && (
                <div className="hidden sm:block flex-1 h-px bg-gray-200" />
              )}
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center text-sm font-bold text-gray-900 shrink-0">
                {number}
              </div>
              {/* Right line */}
              {index !== STEPS.length - 1 && (
                <div className="hidden sm:block flex-1 h-px bg-gray-200" />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
