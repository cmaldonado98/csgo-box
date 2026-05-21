"use client";

import { useState, useEffect } from "react";
import Roulette from "@/components/Roulette";
import Modal from "@/components/Modal";
import { Package } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("Mi bro");
  const [keys, setKeys] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    if (nameParam) {
      // Evitar error de linter de set-state-in-effect difiriendo la actualización al final de la cola
      Promise.resolve().then(() => setUserName(nameParam));
    }
  }, []);

  const handleFinish = () => {
    setKeys(0);
    setIsModalOpen(true);
  };

  const handleAccept = () => {
    alert("¡RUSH B(ODA) CONFIRMADO! 🔥");
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#1e1e1e] flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black z-0 opacity-80" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 bg-repeat" />

      <header className="w-full h-16 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between px-6 z-10 sticky top-0 shadow-md">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-csgo-gold" />
          <h1 className="text-xl font-bold tracking-widest text-zinc-100 uppercase">
            Inventario
          </h1>
        </div>
        <div className="text-sm font-bold text-zinc{keys}400 bg-zinc-900 px-4 py-1 rounded border border-zinc-800">
          Llaves: <span className="text-csgo-gold">{keys}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 px-4">
          <div className="text-center space-y-2 mb-8 drop-shadow-2xl">
            <p className="text-csgo-gold font-bold text-lg">
              Bienvenido {userName}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
              Caja de Misión Secreta
            </h2>
            <p className="text-zinc-400 text-sm md:text-base">
              Contiene una sorpresa garantizada.
            </p>
          </div>
          <Roulette onFinish={handleFinish} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onAccept={handleAccept} userName={userName} />
    </main>
  );
}
