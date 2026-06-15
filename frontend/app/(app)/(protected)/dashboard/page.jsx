'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroupDemo } from "@/components/dashboard/barrabusqueda";
import { ToggleGroupDemo } from "@/components/dashboard/botonesFiltro";
import { SingleCard } from "@/components/dashboard/singleCard";

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
  const [orderSort, setOrderSort] = useState("desc")

  //Convinacion de Filtros
  const filtered_cards = cards
    .filter((card) => {
      const matchesSearch = (card.concept ?? "").toLowerCase().includes(searchInput.toLowerCase())
      const matchesLanguage = languageFilter === "" ? true : card.code_language === languageFilter

    return matchesSearch && matchesLanguage 

    })
  .sort((a, b) => {
    
    if (orderSort === "asc"){
      return new Date(a.created_at) - new Date(b.created_at)
    } else {
      return new Date(b.created_at) - new Date(a.created_at)
    }
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
      setIsSingleCardOpen(false)
      setSelectedCard(null)
      getCards()
      const data = await response.json();
      return data;
    } else {
      console.log('error: ', response.status, response.statusText);
      return { error: { status: response.status, statusText: response.statusText } };
    };
  }

  //abrir una sola card
  const [selectedCard, setSelectedCard] = useState(null)
  const [originalCard, setOriginalCard] = useState(null)
  const [isSingleCardOpen, setIsSingleCardOpen] = useState(null)

  const abrirCard = (card) => {
    setIsSingleCardOpen(true)
    setSelectedCard(card)
    setOriginalCard({ ...card })
  }

  const handleCardChange = (updatedCard) => {
    setSelectedCard(updatedCard)
  }

  const saveCard = async () => {
    if (!selectedCard) return
    const response = await fetch(`${API_URL}/cards/${selectedCard.card_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selectedCard)
    })
    if (response.ok) {
      setIsSingleCardOpen(false)
      setSelectedCard(null)
      setOriginalCard(null)
      getCards()
    }
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-12 md:pt-28 md:pb-20">
      {/* Todo el contenido ahora comparte el mismo ancho máximo centrado */}
      <div className="max-w-6xl mx-auto">

        {/* Contenedor para los buscadores y filtros con separación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <InputGroupDemo setSearchInput={setSearchInput} />
          <ToggleGroupDemo setLanguageFilter={setLanguageFilter} setOrderSort={setOrderSort} />
        </div>
        
        {/* Contenedor Grid adaptable a pantallas móviles, tablets y escritorio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SingleCard isSingleCardOpen={isSingleCardOpen} setIsSingleCardOpen={setIsSingleCardOpen} selectedCard={selectedCard} originalCard={originalCard} onCardChange={handleCardChange} onSave={saveCard} deleteCard={deleteCard}/>
          
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
                    variant="outline"
                    className="text-xs font-medium px-3 py-1.5 h-auto bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200 shadow-none flex items-center gap-1.5"
                    onClick={() => {abrirCard(card)}}
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