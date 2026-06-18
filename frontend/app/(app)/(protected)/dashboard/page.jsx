'use client'
import { useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/context/AuthContext";
import { getCards, updateCard, deleteCardById } from "@/services/cardService";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroupDemo } from "@/components/dashboard/barrabusqueda";
import { ToggleGroupDemo } from "@/components/dashboard/botonesFiltro";
import { SingleCard } from "@/components/dashboard/singleCard";

export default function DashboardPage() {

  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    getCards()
      .then((data) => {
        if (!cancelled) setCards(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")
  const [orderSort, setOrderSort] = useState("desc")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 250)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filtered_cards = useMemo(() => {
    return cards
      .filter((card) => {
        const matchesSearch = (card.concept ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesLanguage = languageFilter === "" ? true : card.code_language === languageFilter
        return matchesSearch && matchesLanguage
      })
      .sort((a, b) => {
        if (orderSort === "asc") {
          return new Date(a.created_at) - new Date(b.created_at)
        }
        return new Date(b.created_at) - new Date(a.created_at)
      })
  }, [cards, debouncedSearch, languageFilter, orderSort])

  const handleDeleteCard = useCallback(async (card_id) => {
    try {
      await deleteCardById(card_id)
      setIsSingleCardOpen(false)
      setSelectedCard(null)
      setOriginalCard(null)
      const data = await getCards()
      setCards(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const handleSaveCard = useCallback(async () => {
    if (!selectedCard) return
    try {
      await updateCard(selectedCard.card_id, selectedCard)
      setIsSingleCardOpen(false)
      setSelectedCard(null)
      setOriginalCard(null)
      const data = await getCards()
      setCards(data)
    } catch (err) {
      setError(err.message)
    }
  }, [selectedCard])

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

  if (loading) {
    return (
      <div className="min-h-screen px-6 pt-24 pb-12 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded-lg w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 pt-24 pb-12 md:pt-28 md:pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-destructive text-lg font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => { setError(null); getCards().then(setCards).catch(() => {}) }}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-12 md:pt-28 md:pb-20">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <InputGroupDemo setSearchInput={setSearchInput} resultCount={filtered_cards.length} />
          <ToggleGroupDemo setLanguageFilter={setLanguageFilter} setOrderSort={setOrderSort} />
        </div>

        {filtered_cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {cards.length === 0 ? "Aun no tienes cards guardadas" : "No se encontraron cards con ese filtro"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SingleCard isSingleCardOpen={isSingleCardOpen} setIsSingleCardOpen={setIsSingleCardOpen} selectedCard={selectedCard} originalCard={originalCard} onCardChange={handleCardChange} onSave={handleSaveCard} deleteCard={handleDeleteCard}/>

            {filtered_cards.map((card) => (
              <div
                key={card.card_id}
                className="flex flex-col justify-between bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div>
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

                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {card.explanation}
                  </p>

                  {card.use_case && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Caso de Uso:
                      </span>
                      <p className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 italic">
                        &ldquo;{card.use_case}&rdquo;
                      </p>
                    </div>
                  )}

                  {card.code && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Ejemplo de Codigo:
                      </span>
                      <pre className="p-3 bg-slate-900 rounded-lg overflow-x-auto text-xs text-emerald-400 font-mono" aria-label={`Codigo de ejemplo: ${card.code_language || 'code'}`}>
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
                    aria-label={`Abrir card: ${card.concept}`}
                  >
                    Abrir
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}