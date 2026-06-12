'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroupDemo } from "@/components/dashboard/barrabusqueda";
import { ToggleGroupDemo } from "@/components/dashboard/botonesFiltro";

export default function DashboardPage() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [cards, setCards] = useState([])
  const { token } = useAuth();

  useEffect(() => {
    getCards()
  }, [token])

  const getCards = async () => {
    const response = await fetch(`${API_URL}/cards/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      const data = await response.json()
      setCards(data)
      console.log(data)
    } else {
      console.log('error: ', response.status, response.statusText)
      return { error: { status: response.status, statusText: response.statusText } }
    }
  }

  // Filtrado de Cards

  const [searchInput, setSearchInput] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")

  //Convinacion de Filtros
  const filtered_cards = cards.filter((card) => {
    const matchesSearch = card.concept.toLowerCase().includes(searchInput.toLowerCase())
    const matchesLanguage = languageFilter === "" ? true : card.code_language === languageFilter

    return matchesSearch && matchesLanguage

  })

  // Eliminar una Card
  const deleteCard = async (card_id) => {
    const response = await fetch(`${API_URL}/cards/${card_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      getCards()
      const data = await response.json();
      return data;
    } else {
      console.log('error: ', response.status, response.statusText);
      return { error: { status: response.status, statusText: response.statusText } };
    };
  }


  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 md:py-20 m-20">
      {/* Todo el contenido ahora comparte el mismo ancho máximo centrado */}
      <div className="max-w-6xl mx-auto">

        {/* Contenedor para los buscadores y filtros con separación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <InputGroupDemo setSearchInput={setSearchInput} />
          <ToggleGroupDemo setLanguageFilter={setLanguageFilter} />
        </div>

        <h1 className="text-3xl font-bold text-slate-800 text-center mb-10">
          Mis Cards
        </h1>

        {/* Contenedor Grid adaptable a pantallas móviles, tablets y escritorio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered_cards.map((card) => {
            return (
              <div
                key={card.card_id}
                className="flex flex-col justify-between bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  {/* Encabezado de la Card: Concepto y Lenguaje */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-xl font-semibold text-slate-900 capitalize">
                      {card.concept}
                    </h2>
                    {card.code_language && (
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">
                        {card.code_language}
                      </span>
                    )}
                  </div>

                  {/* Explicación */}
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {card.explanation}
                  </p>

                  {/* Caso de Uso */}
                  {card.use_case && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Caso de Uso:
                      </span>
                      <p className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 italic">
                        "{card.use_case}"
                      </p>
                    </div>
                  )}

                  {/* Bloque de Código estilo Terminal */}
                  {card.code && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Ejemplo de Código:
                      </span>
                      <pre className="p-3 bg-slate-900 rounded-lg overflow-x-auto text-xs text-emerald-400 font-mono">
                        <code>{card.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
               
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  
                  <Button
                    variant="destructive"
                    className="text-xs font-medium px-3 py-1.5 h-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-none"
                    onClick={() => { deleteCard(card.card_id) }}
                  >
                    Eliminar
                  </Button>

                  <Button
                    variant="outline"
                    className="text-xs font-medium px-3 py-1.5 h-auto bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200 shadow-none flex items-center gap-1.5"
                    onClick={() => {}}
                  >
                    Abrir
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

}