"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Heart } from "lucide-react"
import Image from "next/image"

interface Flower {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
}

export default function RomanticWebsite() {
  const [clickCount, setClickCount] = useState(0)
  const [showMainSite, setShowMainSite] = useState(false)
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Data de início: 27 de março de 2024 às 16:00
  const startDate = new Date(2024, 2, 27, 16, 0, 0) // mês 2 = março (0-indexed)

  useEffect(() => {
    // Inicializar áudio - AQUI É ONDE VOCÊ COLOCA O ARQUIVO DE MÚSICA
    const audioElement = new Audio("/simply-red-you-make-me-feel-brand-new.mp3")
    audioElement.loop = true
    setAudio(audioElement)

    return () => {
      audioElement.pause()
    }
  }, [])

  useEffect(() => {
    // Atualizar contador de tempo a cada segundo
    const interval = setInterval(() => {
      const now = new Date()
      const diff = now.getTime() - startDate.getTime()

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeElapsed({ years, months, days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (showMainSite) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top

    // Criar flores que caem
    const newFlowers: Flower[] = []
    for (let i = 0; i < 5; i++) {
      newFlowers.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      })
    }

    setFlowers((prev) => [...prev, ...newFlowers])
    setClickCount((prev) => prev + 1)

    // Remover flores após animação
    setTimeout(() => {
      setFlowers((prev) => prev.filter((flower) => !newFlowers.some((nf) => nf.id === flower.id)))
    }, 3000)

    if (clickCount + 1 >= 5) {
      setTimeout(() => {
        setShowMainSite(true)
      }, 1000)
    }
  }

  const toggleMusic = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (!showMainSite) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 flex items-center justify-center cursor-pointer relative overflow-hidden px-4"
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <div className="text-center max-w-sm mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-red-500 mx-auto mb-6 sm:mb-8" />
          </motion.div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Clique {5 - clickCount} vez{5 - clickCount !== 1 ? "es" : ""} para revelar
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">Uma surpresa especial te aguarda...</p>
        </div>

        {/* Flores caindo */}
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              className="absolute pointer-events-none text-2xl sm:text-4xl"
              initial={{
                x: flower.x,
                y: flower.y,
                rotate: flower.rotation,
                scale: flower.scale,
                opacity: 1,
              }}
              animate={{
                y: flower.y + 800,
                rotate: flower.rotation + 360,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              🌹
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header com música */}
        <motion.div
          className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border-2 border-pink-200"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={toggleMusic}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-400 to-red-400 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-pink-500 hover:to-red-500 transition-all duration-300 shadow-md text-sm sm:text-base"
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
            <div className="text-center">
              <div className="font-medium">Simply Red - You Make Me Feel Brand New</div>
              <div className="text-xs opacity-90">(Official Live at Sydney Opera House)</div>
            </div>
          </button>
        </motion.div>

        {/* Imagens do casal */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-pink-200">
            <div className="aspect-[4/5] relative overflow-hidden rounded-xl">
              <Image src="/couple-1.jpg" alt="Nosso amor - Foto 1" fill className="object-cover" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-pink-200">
            <div className="aspect-[4/5] relative overflow-hidden rounded-xl">
              <Image src="/couple-2.jpg" alt="Nosso amor - Foto 2" fill className="object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Mensagem de amor */}
        <motion.div
          className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border-2 border-pink-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-center text-base sm:text-lg text-gray-700 font-medium">
            Vou te amar pra sempre assim como...
          </p>
        </motion.div>

        {/* Contador de tempo */}
        <motion.div
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-pink-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Estou te amando há:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 text-center">
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.years}</div>
                <div className="text-xs sm:text-sm text-gray-600">ano{timeElapsed.years !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.months}</div>
                <div className="text-xs sm:text-sm text-gray-600">mes{timeElapsed.months !== 1 ? "es" : ""}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.days}</div>
                <div className="text-xs sm:text-sm text-gray-600">dia{timeElapsed.days !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.hours}</div>
                <div className="text-xs sm:text-sm text-gray-600">hora{timeElapsed.hours !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.minutes}</div>
                <div className="text-xs sm:text-sm text-gray-600">minuto{timeElapsed.minutes !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{timeElapsed.seconds}</div>
                <div className="text-xs sm:text-sm text-gray-600">segundo{timeElapsed.seconds !== 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Corações flutuantes - otimizado para mobile */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300 text-lg sm:text-2xl"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
                rotate: 0,
              }}
              animate={{
                y: -50,
                rotate: 360,
              }}
              transition={{
                duration: 10 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 3,
                ease: "linear",
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
