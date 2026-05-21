"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Skin {
  id: string;
  name: string;
  image: string;
  rarity: {
    color: string;
  };
}

interface Item {
  id: string;
  name: string;
  image: string;
  color: string;
  isSpecial?: boolean;
}

const RARITY_COLORS = {
  blue: "#4b69ff",
  purple: "#8847ff",
  pink: "#d32ce6",
  red: "#eb4b4b",
  gold: "#ffd700",
};

function getGradientByHex(hexColor: string) {
  // Mapa básico de colores hexadecimales de la API a colores CSGO
  const c = hexColor.toLowerCase();
  if (c.includes("4b69ff")) return `bg-gradient-to-t from-csgo-blue/60 to-transparent border-csgo-blue`;
  if (c.includes("8847ff")) return `bg-gradient-to-t from-csgo-purple/60 to-transparent border-csgo-purple`;
  if (c.includes("d32ce6")) return `bg-gradient-to-t from-csgo-pink/60 to-transparent border-csgo-pink`;
  if (c.includes("eb4b4b")) return `bg-gradient-to-t from-csgo-red/60 to-transparent border-csgo-red`;
  if (c.includes("e4ae39") || c.includes("ffd700")) return `bg-gradient-to-t from-csgo-gold/60 to-transparent border-csgo-gold`;
  
  return `bg-gradient-to-t from-zinc-700 to-transparent border-zinc-500`;
}

interface RouletteProps {
  onFinish: () => void;
}

export default function Roulette({ onFinish }: RouletteProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [finalTranslateX, setFinalTranslateX] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const isReady = audioReady && imagesReady;
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  
  const ITEM_WIDTH = 120; // Ancho fijo por item
  const TOTAL_ITEMS = 50;
  const WINNING_INDEX = 45; // El item 45 es el ganador

  useEffect(() => {
    // 1. Pre-descargar el audio como blob URL: iOS/Android ignoran preload="auto",
    //    con blob el archivo queda en memoria y la reproducción es instantánea.
    fetch('/case-opening-sound.wav')
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }
        setAudioReady(true);
      })
      .catch(() => setAudioReady(true));

    // 2. Desbloquear el audio en el primer toque: iOS Safari exige que el primer
    //    play() ocurra dentro de un gesto del usuario.
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    };

    document.addEventListener('touchstart', unlock, { once: true, passive: true });

    return () => {
      document.removeEventListener('touchstart', unlock);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  useEffect(() => {
    async function fetchSkins() {
      try {
        const res = await fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json");
        const data: Skin[] = await res.json();
        
        // Filtrar skins que tengan imagen y rareza
        const validSkins = data.filter(s => s.image && s.rarity?.color);
        
        // Seleccionar aleatoriamente
        const selected: Item[] = [];
        for (let i = 0; i < TOTAL_ITEMS; i++) {
          if (i === WINNING_INDEX) {
            selected.push({
              id: "special-item",
              name: "Special Item",
              image: "/csgo-pro.png",
              color: "#ffd700",
              isSpecial: true,
            });
          } else {
            const randomIndex = Math.floor(Math.random() * validSkins.length);
            const skin = validSkins[randomIndex];
            selected.push({
              id: `${i}-${skin.id}`,
              name: skin.name,
              image: skin.image,
              color: skin.rarity.color,
            });
          }
        }
        
        // Precargar todas las imágenes para que no haya delay al girar
        await Promise.all(
          selected.map(
            (item) =>
              new Promise<void>((resolve) => {
                const img = new window.Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = item.image;
              })
          )
        );

        setItems(selected);
        setImagesReady(true);
      } catch (error) {
        console.error("Error fetching skins:", error);
        setImagesReady(true);
      }
    }
    
    fetchSkins();
  }, []);

  const startSpin = () => {
    if (isSpinning || hasFinished) return;

    // Reproducir audio de forma síncrona dentro del gesto del usuario
    // (en iOS/Android cualquier await antes de play() rompe el contexto de gesto)
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
    
    // Obtenemos el ancho exacto del contenedor, no de la ventana, para que la línea central cuadre
    const containerWidth = containerRef.current?.parentElement?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 400);
    const centerOffset = containerWidth / 2;
    
    // Eliminamos el offset aleatorio (fijado a 0) para asegurar que caiga EXACTAMENTE en el medio del item dorado
    const randomOffset = 0; 
    const calculatedTranslateX = -(WINNING_INDEX * ITEM_WIDTH) + centerOffset - (ITEM_WIDTH / 2) + randomOffset;
    
    setFinalTranslateX(calculatedTranslateX);
    setIsSpinning(true);
    
    setTimeout(() => {
      setIsSpinning(false);
      setHasFinished(true);
      onFinish();
    }, 6000); // 6s exactos
  };

  if (!isReady) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-16">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
          <div className="absolute inset-0 rounded-full border-4 border-t-csgo-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm uppercase tracking-widest animate-pulse">
          Cargando caja...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <audio ref={audioRef} src="/case-opening-sound.wav" preload="auto" />
      {/* Contenedor de la ruleta */}
      <div className="relative w-full h-[180px] bg-zinc-950/80 border-y-2 border-zinc-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Línea central (Puntero) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-csgo-gold z-20 -translate-x-1/2 shadow-[0_0_10px_#ffd700]"></div>
        
        {/* Sombra en los bordes para dar profudidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-zinc-900 z-10 pointer-events-none"></div>

        {/* Cinta de items */}
        <div 
          ref={containerRef}
          className="absolute top-0 bottom-0 left-0 flex items-center"
          style={{
            transform: isSpinning || hasFinished ? `translate3d(${finalTranslateX}px, 0, 0)` : 'translate3d(0, 0, 0)',
            transition: isSpinning ? 'transform 6s cubic-bezier(0.15, 0.85, 0.15, 1)' : 'none',
          }}
        >
          {items.map((item, index) => {
            const gradientClass = getGradientByHex(item.color);
            return (
              <div 
                key={item.id}
                className="flex-shrink-0 flex flex-col justify-end p-2 border-b-[3px]"
                style={{ width: `${ITEM_WIDTH}px`, height: '140px' }}
              >
                <div className={`w-full h-full flex flex-col items-center justify-between p-2 pt-4 bg-zinc-800/50 ${gradientClass} ${item.isSpecial ? 'border-csgo-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.3)] border' : ''}`}>
                  <div className={`relative w-full flex items-center justify-center ${item.isSpecial ? 'h-24 -mt-4' : 'h-16'}`}>
                    <img 
                      src={item.image} 
                      alt={item.name || "Special Item"}
                      className={`w-full h-full object-contain filter drop-shadow-md ${item.isSpecial ? 'scale-[1.3]' : ''}`}
                    />
                  </div>
                  {item.name ? (
                    <span className={`text-[10px] text-center font-semibold truncate w-full px-1 relative z-10 ${item.isSpecial ? 'text-csgo-gold -mt-4 pb-2' : 'text-zinc-300'}`}>
                      {item.name}
                    </span>
                  ) : (
                    <div className="h-[15px]"></div> /* Espaciador para mantener al mismo alto si no hay nombre */
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón de Abrir Caja */}
      <button 
        onClick={startSpin}
        disabled={isSpinning || hasFinished}
        className={`px-12 py-3 bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white font-bold uppercase tracking-widest text-sm transition-all border border-zinc-600 border-b-4 border-b-zinc-900 rounded shadow-lg active:border-b active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSpinning ? 'Abriendo...' : 'Abrir caja'}
      </button>
    </div>
  );
}
