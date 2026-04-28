
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleDot,
  Crown,
  Flame,
  Gem,
  LayoutGrid,
  Map,
  Mountain,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
  Volume2,
  VolumeX,
  Zap,
  Star,
  Copy,
  Trash2,
  Package2,
  BookOpen,
  Clock3,
  Gift,
  ScrollText,
  ShoppingBag,
  Megaphone,
  Newspaper,
  Coins,
  CreditCard,
  MousePointerClick,
  ShieldAlert,
  Trophy,
} from "lucide-react";

type AssetImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

function buildImageCandidates(src: string) {
  const candidates = new Set<string>();
  const fileName = src.split("/").pop() ?? "";
  const lower = fileName.toLocaleLowerCase("tr-TR");

  const add = (value: string) => {
    if (value && value.trim().length > 0) candidates.add(value);
  };

  add(src);

  [
    `/characters/events/${fileName}`,
    `/images/news/characters/characters/${fileName}`,
    `/images/news/characters/${fileName}`,
    `/images/characters/characters/${fileName}`,
    `/images/characters/${fileName}`,
    `/images/news/${fileName}`,
    `/images/${fileName}`,
  ].forEach(add);

  const renameMap: Record<string, string[]> = {
    "creeper.png": ["creaper.png", "sarmasik.png", "sarmaşık.png"],
    "creaper.png": ["creeper.png", "sarmasik.png", "sarmaşık.png"],
    "luna.png": ["ay.png"],
    "ay.png": ["luna.png"],
    "duello-2v2.jpg": ["duello-v2v2.jpg"],
    "duello-v2v2.jpg": ["duello-2v2.jpg"],
    "kirmizi-jhon.png": ["kırmızı-jhon.png"],
    "tadilatci.png": ["tadilatçı.png"],
    "kaya-yaratigi.png": ["kaya-yaratığı.png"],
    "genc-garmadon.png": ["genç-garmadon.png"],
    "genc-wu.png": ["genç-wu.png"],
    "ates-mech.png": ["ateş-mech.png"],
    "golge-cinder.png": ["gölge-cinder.png"],
    "uykucu-gary.png": ["uykucu-gary.png"],
    "dinamit-kiz.png": ["dinamit-kız.png"],
    "ates-frank.png": ["ateş-frank.png"],
  };

  for (const alt of renameMap[lower] ?? []) {
    [
      `/characters/events/${alt}`,
      `/images/news/characters/characters/${alt}`,
      `/images/news/characters/${alt}`,
      `/images/characters/characters/${alt}`,
      `/images/characters/${alt}`,
      `/images/news/${alt}`,
      `/images/${alt}`,
    ].forEach(add);
  }

  return Array.from(candidates);
}

function AssetImage({ src, alt, ...props }: AssetImageProps) {
  const candidates = useMemo(() => buildImageCandidates(src), [src]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [src]);

  return (
    <img
      {...props}
      src={candidates[candidateIndex] ?? src}
      alt={alt ?? ""}
      onError={(event) => {
        props.onError?.(event);
        setCandidateIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : prev));
      }}
    />
  );
}


type MultiSourceImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  sources: string[];
};

function MultiSourceImage({ sources, alt, ...props }: MultiSourceImageProps) {
  const safeSources = useMemo(() => Array.from(new Set(sources.filter(Boolean))), [sources]);
  const fallbackSrc = useMemo(
    () =>
      svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ff9acb"/>
              <stop offset="42%" stop-color="#d81b82"/>
              <stop offset="100%" stop-color="#39001f"/>
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="34%" r="58%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.38"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1200" height="675" rx="44" fill="url(#bg)"/>
          <rect width="1200" height="675" fill="url(#glow)"/>
          <text x="600" y="272" text-anchor="middle" font-family="Arial, sans-serif" font-size="132" font-weight="900" fill="#fff">♥</text>
          <text x="600" y="378" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="900" fill="#fff">Sora Love Link</text>
          <text x="600" y="436" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#ffe3f1">Kapak bulunamazsa bu güvenli kapak görünür</text>
        </svg>
      `),
    []
  );
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [safeSources.join("|")]);

  return (
    <img
      {...props}
      src={safeSources[sourceIndex] ?? fallbackSrc}
      alt={alt ?? ""}
      onError={(event) => {
        props.onError?.(event);
        setSourceIndex((prev) => (prev < safeSources.length ? prev + 1 : prev));
      }}
    />
  );
}


type Side = "İyi" | "Kötü";
type RangeType = "Yakın" | "Orta" | "Uzak" | "Karışık";
type RoleType = "Saldırı" | "Destek" | "Tank" | "Kontrol" | "Suikastçı" | "Savunma";
type ReelMode = "rarity" | "character";
type MainTab = "cark" | "karakterler" | "oyunModlari" | "bilgi" | "gorevler" | "envanter" | "sosyal" | "ranklar" | "dukkan" | "yenilikler" | "haberler" | "gurkanhub" | "admin";
type RarityName = "Omega" | "Kristalize" | "Efsanevi" | "Destansı" | "Ender" | "Sıradan";
type AccentType = "crystal-good" | "crystal-bad";

type ResultItem = {
  rarity: RarityName;
  side: Side | null;
  character: string;
};

type InventoryProfile = {
  id: "player1" | "player2" | "founder";
  name: string;
  code: string;
  items: string[];
  palette: string;
  credits: number;
  matchesPlayed: number;
  rankPoints: number;
  levelPoints: number;
  characterLevels: Record<string, number>;
  wheelKeys: Record<WheelType, number>;
  banned?: boolean;
  profileCharacter?: string;
  surfaceStyle?: "karanlik" | "aydinlik" | "gecisli";
  glowLevel?: "dusuk" | "orta" | "yuksek";
  profilePattern?: "duz" | "ender" | "destansi" | "efsanevi" | "kristalize" | "omega";
  frameStyle?: "duz" | "keskin" | "neon";
  slogan?: string;
  profileTitle?: string;
  favoriteMode?: string;
  favoriteCharacter?: string;
};

type TradeAccount = {
  id: string;
  name: string;
  items: string[];
  palette?: string;
  isFake?: boolean;
  rankPoints?: number;
  accountLevel?: number;
  characterLevels?: Record<string, number>;
  credits?: number;
  levelPoints?: number;
  wheelKeys?: Record<WheelType, number>;
  persona?: "cocukca" | "argolu" | "garip" | "olgun" | "yabanci";
  banned?: boolean;
};

type TradeMaterialId = "credits" | "levelPoints" | `wheelKey:${WheelType}`;

type ReelCard = {
  label: string;
  rarity?: RarityName;
  accent?: AccentType;
};

type CharacterInfo = {
  id: string;
  name: string;
  rarity: RarityName;
  side?: Side | null;
  hp: number;
  range: RangeType;
  role: RoleType;
  skill1: string;
  skill2: string;
  ultimate: string;
  ultimate2?: string;
  image?: string;
  level: number;
  maxLevel: number;
  baseDamage: number;
};

type RarityConfig = {
  name: RarityName;
  weight: number;
};

type ModeInfo = {
  id: string;
  name: string;
  subtitle: string;
  eyebrow: string;
  chip: string;
  terrain: string;
  players: string;
  objective: string;
  description: string;
  zones: string[];
  accent: string;
  image: string;
  imagePosition?: React.CSSProperties["objectPosition"];
  icon: React.ReactNode;
};

type WheelType = "acemi" | "akademi" | "turnuva";

type WheelConfig = {
  id: WheelType;
  name: string;
  subtitle: string;
  description: string;
  accent: string;
  cardClass: string;
  glowClass: string;
  frameStyle: "normal" | "gold" | "omega";
  allowedRarities?: RarityName[];
  weights: Record<RarityName, number>;
};

const CARD_W = 170;
const GAP = 12;
const STEP = CARD_W + GAP;

const RARITY_ORDER: RarityName[] = [
  "Sıradan",
  "Ender",
  "Destansı",
  "Efsanevi",
  "Kristalize",
  "Omega",
];

const ROLE_ORDER: RoleType[] = [
  "Saldırı",
  "Destek",
  "Tank",
  "Kontrol",
  "Suikastçı",
  "Savunma",
];

const CHARACTER_ROLES: Record<string, RoleType> = {
  "Omega Dareth": "Saldırı",
  "Genç Garmadon": "Saldırı",
  "Genç Wu": "Destek",
  "Darth Vader": "Kontrol",
  "Gurkan": "Saldırı",
  "Vengestone Askeri": "Tank",
  "Ateş Mech": "Saldırı",
  "Steve": "Savunma",
  "Gölge Cinder": "Kontrol",
  "Creeper": "Saldırı",
  "Anacondrai": "Saldırı",
  "Ragrast": "Suikastçı",
  "Uykucu Gary": "Kontrol",
  "Luna": "Destek",
  "Jett": "Suikastçı",
  "Mia": "Destek",
  "Robo Raptor": "Suikastçı",
  "Dedektif Clara": "Destek",
  "Dinamit Kız": "Saldırı",
  "Ateş Frank": "Saldırı",
  "Kaya Yaratığı": "Tank",
  "Guby": "Kontrol",
  "Toxe": "Kontrol",
  "Clone Trooper": "Saldırı",
  "Kırmızı Jhon": "Saldırı",
  "Dracula": "Suikastçı",
  "Tadilatçı": "Destek",
  "Kranler": "Savunma",
};

const rarityRank: Record<RarityName, number> = {
  Sıradan: 0,
  Ender: 1,
  Destansı: 2,
  Efsanevi: 3,
  Kristalize: 4,
  Omega: 5,
};

const RANK_ORDER = [
  "Bronz",
  "Silver",
  "Gold",
  "Diamond",
  "EXO Askeri",
  "Yüce Savaşçı",
  "Omega",
] as const;

type RankName = (typeof RANK_ORDER)[number];

const RANK_THRESHOLDS: { name: RankName; min: number; max: number }[] = [
  { name: "Bronz", min: 0, max: 39 },
  { name: "Silver", min: 40, max: 89 },
  { name: "Gold", min: 90, max: 159 },
  { name: "Diamond", min: 160, max: 259 },
  { name: "EXO Askeri", min: 260, max: 399 },
  { name: "Yüce Savaşçı", min: 400, max: 579 },
  { name: "Omega", min: 580, max: 999999 },
];

function getRankInfo(points: number) {
  const safePoints = Math.max(0, points);
  const tier = RANK_THRESHOLDS.find((item) => safePoints >= item.min && safePoints <= item.max) ?? RANK_THRESHOLDS[0];
  const span = Math.max(1, tier.max - tier.min + 1);
  const progress = tier.name === "Omega" ? 100 : Math.max(0, Math.min(100, ((safePoints - tier.min) / span) * 100));
  return {
    name: tier.name,
    progress,
    points: safePoints,
    nextTarget: tier.name === "Omega" ? null : tier.max + 1,
  };
}

function getMatchSurveyRankDelta(modeId: string, won: boolean) {
  const base: Record<string, number> = {
    turnuva: 14,
    kale: 10,
    bayrak: 10,
    gemi: 8,
    araba: 7,
    duello: 9,
  };
  const value = base[modeId] ?? 8;
  return won ? value : -Math.max(4, Math.floor(value * 0.65));
}

function getCharacterPrice(character: CharacterInfo) {
  const rarityPrices: Record<RarityName, number> = {
    "Sıradan": 10,
    "Ender": 18,
    "Destansı": 34,
    "Efsanevi": 52,
    "Kristalize": 82,
    "Omega": 115,
  };

  return rarityPrices[character.rarity];
}

const MAX_CHARACTER_LEVEL = 11;

const DAMAGE_BY_RARITY: Record<RarityName, number> = {
  "Sıradan": 18,
  "Ender": 24,
  "Destansı": 31,
  "Efsanevi": 39,
  "Kristalize": 47,
  "Omega": 58,
};

const DAMAGE_ROLE_BONUS: Record<RoleType, number> = {
  "Saldırı": 6,
  "Suikastçı": 8,
  "Tank": -2,
  "Kontrol": 2,
  "Destek": -3,
  "Savunma": -1,
};

const DAMAGE_RANGE_BONUS: Record<RangeType, number> = {
  "Yakın": 4,
  "Orta": 2,
  "Uzak": 3,
  "Karışık": 5,
};

function clampCharacterLevel(level: number) {
  return Math.max(1, Math.min(MAX_CHARACTER_LEVEL, Math.round(level)));
}

function getBaseDamageForCharacter(character: Pick<CharacterInfo, "rarity" | "role" | "range" | "hp">) {
  const hpBalance = character.hp >= 200 ? -3 : character.hp <= 130 ? 2 : 0;
  return Math.max(8, DAMAGE_BY_RARITY[character.rarity] + DAMAGE_ROLE_BONUS[character.role] + DAMAGE_RANGE_BONUS[character.range] + hpBalance);
}

function getCharacterLevelStats(character: CharacterInfo, level = character.level) {
  const safeLevel = clampCharacterLevel(level);
  const damageMultiplier = 1 + (safeLevel - 1) * 0.06;
  const hpMultiplier = 1 + (safeLevel - 1) * 0.03;

  return {
    level: safeLevel,
    maxLevel: MAX_CHARACTER_LEVEL,
    damage: Math.round(character.baseDamage * damageMultiplier),
    hp: Math.round(character.hp * hpMultiplier),
    nextDamage: safeLevel < MAX_CHARACTER_LEVEL ? Math.round(character.baseDamage * (1 + safeLevel * 0.06)) : null,
    maxDamage: Math.round(character.baseDamage * (1 + (MAX_CHARACTER_LEVEL - 1) * 0.06)),
    maxHp: Math.round(character.hp * (1 + (MAX_CHARACTER_LEVEL - 1) * 0.03)),
  };
}


function getUpgradePointCost(nextLevel: number) {
  const lvl = clampCharacterLevel(nextLevel);
  const costs: Record<number, number> = {
    2: 100,
    3: 250,
    4: 500,
    5: 850,
    6: 1250,
    7: 1800,
    8: 2500,
    9: 3400,
    10: 4300,
    11: 5000,
  };
  return costs[lvl] ?? 100;
}

function formatPointAmount(value: number) {
  return value.toLocaleString("tr-TR");
}

function getProfileCharacterLevel(profile: Pick<InventoryProfile, "characterLevels">, characterName: string) {
  return clampCharacterLevel(profile.characterLevels?.[characterName] ?? 1);
}

function makeDailyShopOffers() {
  return [...CHARACTER_DATABASE]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

function RankBadge({ points }: { points: number }) {
  const rank = getRankInfo(points);

  return (
    <div className="border border-white/12 bg-white/[0.05] px-3 py-2">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">Rank</div>
      <div className="mt-1 text-sm font-bold text-white">{rank.name}</div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/70" style={{ width: `${rank.progress}%` }} />
      </div>
      <div className="mt-2 text-[11px] text-white/48">{rank.points} RP</div>
    </div>
  );
}


function RankLogo({ rank, size = 18 }: { rank: RankName; size?: number }) {
  const styleMap: Record<RankName, { label: string; classes: string }> = {
    "Bronz": { label: "B", classes: "border-[#8a5a3b] bg-[#2b1b12] text-[#d39a70]" },
    "Silver": { label: "S", classes: "border-[#9da4af] bg-[#1b2028] text-[#d7dde8]" },
    "Gold": { label: "G", classes: "border-[#c79b2a] bg-[#2c240d] text-[#ffd76b]" },
    "Diamond": { label: "D", classes: "border-[#49b6ff] bg-[#0f2233] text-[#9fe1ff]" },
    "EXO Askeri": { label: "EX", classes: "border-[#6be3ff] bg-[#0d2630] text-[#b8f6ff]" },
    "Yüce Savaşçı": { label: "YS", classes: "border-[#b96cff] bg-[#241232] text-[#e8c4ff]" },
    "Omega": { label: "Ω", classes: "border-[#ffb86b] bg-[#2f1910] text-[#ffe0b3]" },
  };

  const style = styleMap[rank];

  return (
    <div
      className={`flex shrink-0 items-center justify-center border font-black uppercase tracking-[0.08em] ${style.classes}`}
      style={{
        width: size,
        height: size,
        fontSize: size >= 24 ? 10 : 8,
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
      }}
    >
      {style.label}
    </div>
  );
}



const BASE_RARITIES: RarityConfig[] = [
  { name: "Sıradan", weight: 36 },
  { name: "Ender", weight: 24 },
  { name: "Destansı", weight: 18 },
  { name: "Efsanevi", weight: 11 },
  { name: "Kristalize", weight: 9.5 },
  { name: "Omega", weight: 1.5 },
];

const rarityBg: Record<RarityName, string> = {
  Sıradan: "from-zinc-500/18 to-zinc-900/18",
  Ender: "from-lime-300/18 via-emerald-300/14 to-green-900/20",
  Destansı: "from-violet-500/22 to-violet-900/18",
  Efsanevi: "from-amber-400/24 to-orange-900/20",
  Kristalize: "from-fuchsia-400/24 via-cyan-300/18 to-indigo-900/22",
  Omega:
    "from-fuchsia-300/28 via-orange-300/20 via-yellow-200/18 via-slate-200/16 to-violet-900/24",
};

const rarityOverlay: Record<RarityName, string> = {
  Sıradan: "from-zinc-300/20 via-zinc-700/10 to-black",
  Ender: "from-lime-100/26 via-emerald-300/14 to-black",
  Destansı: "from-violet-300/25 via-violet-700/10 to-black",
  Efsanevi: "from-amber-200/35 via-orange-500/20 to-black",
  Kristalize: "from-fuchsia-200/28 via-cyan-200/18 via-indigo-400/12 to-black",
  Omega: "from-fuchsia-200/30 via-orange-200/22 via-white/12 via-slate-300/16 to-black",
};

const raritySoftText: Record<RarityName, string> = {
  Sıradan: "text-zinc-200",
  Ender: "text-lime-200",
  Destansı: "text-violet-300",
  Efsanevi: "text-amber-300",
  Kristalize: "text-fuchsia-200",
  Omega: "text-white",
};

const rarityGlow: Record<RarityName, string> = {
  Sıradan: "shadow-[0_0_40px_rgba(255,255,255,0.25)]",
  Ender: "shadow-[0_0_60px_rgba(170,255,140,0.45)]",
  Destansı: "shadow-[0_0_75px_rgba(160,90,255,0.55)]",
  Efsanevi: "shadow-[0_0_85px_rgba(255,200,80,0.6)]",
  Kristalize: "shadow-[0_0_95px_rgba(120,240,255,0.65)]",
  Omega: "shadow-[0_0_110px_rgba(255,185,255,0.8)]",
};

function getRarityBackdropFx(char: { rarity: RarityName; side?: Side | null }) {
  if (char.rarity === "Kristalize" && char.side === "Kötü") {
    return "bg-[radial-gradient(circle_at_top_right,rgba(255,170,170,0.24),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,70,70,0.18),transparent_28%),linear-gradient(135deg,rgba(255,120,120,0.12),transparent_30%,transparent_70%,rgba(255,80,80,0.10))]";
  }
  if (char.rarity === "Kristalize" && char.side === "İyi") {
    return "bg-[radial-gradient(circle_at_top_right,rgba(180,255,255,0.22),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.16),transparent_28%),linear-gradient(135deg,rgba(210,255,255,0.10),transparent_30%,transparent_70%,rgba(120,220,255,0.08))]";
  }
  return rarityBackdropFx[char.rarity];
}

const rarityBackdropFx: Record<RarityName, string> = {
  Sıradan:
    "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_24%)]",
  Ender:
    "bg-[radial-gradient(circle_at_top_right,rgba(210,255,180,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(120,255,120,0.08),transparent_28%)]",
  Destansı:
    "bg-[radial-gradient(circle_at_top_right,rgba(210,140,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(120,80,255,0.08),transparent_28%)]",
  Efsanevi:
    "bg-[radial-gradient(circle_at_top_right,rgba(255,220,150,0.16),transparent_24%),linear-gradient(135deg,rgba(255,210,120,0.06),transparent_30%,transparent_70%,rgba(255,235,180,0.05))]",
  Kristalize:
    "bg-[radial-gradient(circle_at_top_right,rgba(180,255,255,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.10),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_30%,transparent_70%,rgba(170,250,255,0.06))]",
  Omega:
    "bg-[radial-gradient(circle_at_top_right,rgba(255,220,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,120,210,0.10),transparent_30%),linear-gradient(135deg,rgba(255,210,255,0.08),transparent_30%,transparent_70%,rgba(255,240,255,0.06))]",
};

function getRarityParticleFx(char: { rarity: RarityName; side?: Side | null }) {
  if (char.rarity === "Kristalize" && char.side === "Kötü") {
    return "bg-[radial-gradient(circle,rgba(255,180,180,0.22)_0_1.1px,transparent_1.6px)] bg-[length:18px_18px] opacity-85";
  }
  if (char.rarity === "Kristalize" && char.side === "İyi") {
    return "bg-[radial-gradient(circle,rgba(190,255,255,0.22)_0_1.1px,transparent_1.6px)] bg-[length:18px_18px] opacity-85";
  }
  return rarityParticleFx[char.rarity];
}

const rarityParticleFx: Record<RarityName, string> = {
  Sıradan: "",
  Ender:
    "bg-[radial-gradient(circle,rgba(210,255,180,0.12)_0_1px,transparent_1.4px)] bg-[length:26px_26px] opacity-70",
  Destansı:
    "bg-[radial-gradient(circle,rgba(220,180,255,0.12)_0_1px,transparent_1.4px)] bg-[length:24px_24px] opacity-70",
  Efsanevi:
    "bg-[radial-gradient(circle,rgba(255,235,180,0.13)_0_1.1px,transparent_1.6px)] bg-[length:22px_22px] opacity-75",
  Kristalize:
    "bg-[radial-gradient(circle,rgba(190,255,255,0.15)_0_1.1px,transparent_1.6px)] bg-[length:18px_18px] opacity-80",
  Omega:
    "bg-[radial-gradient(circle,rgba(255,230,255,0.16)_0_1.1px,transparent_1.6px)] bg-[length:16px_16px] opacity-85",
};

function getRarityHeaderGlow(char: { rarity: RarityName; side?: Side | null }) {
  if (char.rarity === "Kristalize" && char.side === "Kötü") {
    return "from-red-100/24 via-rose-100/12 to-transparent";
  }
  if (char.rarity === "Kristalize" && char.side === "İyi") {
    return "from-cyan-100/18 via-sky-100/10 to-transparent";
  }
  return rarityHeaderGlow[char.rarity];
}

const rarityHeaderGlow: Record<RarityName, string> = {
  Sıradan: "from-white/6 via-transparent to-transparent",
  Ender: "from-lime-200/12 via-emerald-200/6 to-transparent",
  Destansı: "from-fuchsia-200/12 via-violet-200/6 to-transparent",
  Efsanevi: "from-amber-100/14 via-yellow-100/8 to-transparent",
  Kristalize: "from-cyan-100/14 via-sky-100/8 to-transparent",
  Omega: "from-pink-100/16 via-fuchsia-100/10 to-transparent",
};

const inventoryPaletteFx: Record<string, string> = {
  default: "from-white/[0.04] via-transparent to-transparent",
  blue: "from-sky-300/10 via-cyan-300/6 to-transparent",
  purple: "from-fuchsia-300/10 via-violet-300/6 to-transparent",
  green: "from-emerald-300/10 via-lime-300/6 to-transparent",
  gold: "from-amber-300/12 via-yellow-200/6 to-transparent",
  red: "from-rose-300/10 via-red-300/6 to-transparent",
  dark: "from-white/[0.03] via-transparent to-transparent",
};

const modeVisuals = {
  // Yerleştirilecek dosya adları:
  // /images/turnuva.jpg         -> Turnuva modu
  // /images/araba.jpg           -> Araba Modifiye Yarış modu
  // /images/gemi.jpg            -> Gemi Savaşları modu
  // /images/kale.jpg            -> Kale Savunma modu
  // /images/bayrak.jpg          -> Bayrak Kapmaca modu
  // /images/duello-2v2.jpg      -> 2v2 Düello modu
  // /images/news/haberler.jpg   -> Haberler kapağı
  turnuva: "/images/turnuva.jpg",
  duello: "/images/duello-2v2.jpg",
  araba: "/images/araba.jpg",
  kale: "/images/kale.jpg",
  gemi: "/images/gemi.jpg",
  bayrak: "/images/bayrak.jpg",
};

const WHEEL_CONFIGS: WheelConfig[] = [
  {
    id: "acemi",
    name: "Acemi Çarkı",
    subtitle: "Başlangıç seviyesi",
    description:
      "Daha zor ve sınırlı bir havuzdur. Üst rarity\'ler çıkabilir ama oranları felaket düşüktür. Başlangıç için daha güvenli, sürpriz için ise düşük şanslıdır.",
    accent: "from-zinc-500/18 via-sky-500/10 to-black",
    cardClass: "from-zinc-500/10 via-slate-500/8 to-black",
    glowClass: "shadow-[0_0_26px_rgba(180,200,255,0.08)]",
    frameStyle: "normal",
    weights: {
      Sıradan: 56.5,
      Ender: 26,
      Destansı: 13,
      Efsanevi: 2,
      Kristalize: 1.2,
      Omega: 0.3,
    },
  },
  {
    id: "akademi",
    name: "Akademi Çarkı",
    subtitle: "Dengeli sistem",
    description:
      "Mevcut ana sistemdir. Dengeli oranlarla orta riskli, orta ödüllü açılım sunar.",
    accent: "from-fuchsia-500/18 via-cyan-400/10 to-black",
    cardClass: "from-fuchsia-500/10 via-cyan-500/8 to-black",
    glowClass: "shadow-[0_0_30px_rgba(180,120,255,0.12)]",
    frameStyle: "gold",
    weights: {
      Sıradan: 36,
      Ender: 24,
      Destansı: 22,
      Efsanevi: 12,
      Kristalize: 5,
      Omega: 1,
    },
  },
  {
    id: "turnuva",
    name: "Turnuva Çarkı",
    subtitle: "Yüksek kalite",
    description:
      "Daha kaliteli, daha riskli ve daha ödüllü açılım sunar. Üst rarity şansları ciddi şekilde yükseltilmiştir.",
    accent: "from-amber-500/18 via-orange-400/10 to-black",
    cardClass: "from-amber-500/10 via-orange-500/8 to-black",
    glowClass: "shadow-[0_0_34px_rgba(255,190,80,0.16)]",
    frameStyle: "omega",
    weights: {
      Sıradan: 18,
      Ender: 22,
      Destansı: 22,
      Efsanevi: 18,
      Kristalize: 15,
      Omega: 5,
    },
  },
];

const DEFAULT_WHEEL: WheelType = "akademi";
const DEFAULT_WHEEL_KEYS: Record<WheelType, number> = {
  acemi: 0,
  akademi: 0,
  turnuva: 0,
};

const WHEEL_KEY_LABELS: Record<WheelType, string> = {
  acemi: "Acemi Çarkı Anahtarı",
  akademi: "Akademi Çarkı Anahtarı",
  turnuva: "Turnuva Çarkı Anahtarı",
};


const WHEEL_KEY_VISUALS: Record<WheelType, { short: string; ring: string; core: string; glow: string; teeth: string }> = {
  acemi: {
    short: "A",
    ring: "from-zinc-200 via-slate-400 to-zinc-700",
    core: "bg-slate-200",
    glow: "shadow-[0_0_34px_rgba(210,225,255,0.28)]",
    teeth: "bg-slate-300",
  },
  akademi: {
    short: "AK",
    ring: "from-cyan-200 via-fuchsia-300 to-indigo-700",
    core: "bg-cyan-100",
    glow: "shadow-[0_0_42px_rgba(160,230,255,0.42)]",
    teeth: "bg-fuchsia-200",
  },
  turnuva: {
    short: "T",
    ring: "from-amber-100 via-orange-300 to-red-700",
    core: "bg-amber-100",
    glow: "shadow-[0_0_48px_rgba(255,190,80,0.48)]",
    teeth: "bg-orange-200",
  },
};

function WheelKeyArt({ wheel, count, size = "normal" }: { wheel: WheelType; count?: number; size?: "small" | "normal" | "large" }) {
  const visual = WHEEL_KEY_VISUALS[wheel];
  const box = size === "large" ? "h-24 w-24" : size === "small" ? "h-12 w-12" : "h-16 w-16";
  const head = size === "large" ? "h-14 w-14" : size === "small" ? "h-8 w-8" : "h-10 w-10";
  const stem = size === "large" ? "h-4 w-11" : size === "small" ? "h-2.5 w-7" : "h-3 w-8";
  return (
    <div className={`relative flex ${box} items-center justify-center ${visual.glow}`}>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${visual.ring} opacity-25 blur-xl`} />
      <div className="relative rotate-[-18deg]">
        <div className={`${head} rounded-full border border-white/55 bg-gradient-to-br ${visual.ring} p-1 shadow-inner`}>
          <div className={`flex h-full w-full items-center justify-center rounded-full border border-black/25 ${visual.core} text-[10px] font-black text-black/75`}>
            {visual.short}
          </div>
        </div>
        <div className={`absolute left-[70%] top-1/2 ${stem} -translate-y-1/2 rounded-r-full border border-white/40 bg-gradient-to-r ${visual.ring}`} />
        <div className={`absolute left-[112%] top-[54%] h-3 w-2 ${visual.teeth}`} />
        <div className={`absolute left-[128%] top-[38%] h-3 w-2 ${visual.teeth}`} />
      </div>
      {typeof count === "number" && (
        <div className="absolute -bottom-1 -right-1 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/30 bg-black px-2 text-xs font-black text-white shadow-[0_0_20px_rgba(0,0,0,0.55)]">
          {count}
        </div>
      )}
    </div>
  );
}

function normalizeWheelKeys(keys?: Partial<Record<WheelType, number>> | null): Record<WheelType, number> {
  return {
    acemi: Math.max(0, Math.floor(Number(keys?.acemi ?? 0))),
    akademi: Math.max(0, Math.floor(Number(keys?.akademi ?? 0))),
    turnuva: Math.max(0, Math.floor(Number(keys?.turnuva ?? 0))),
  };
}

function getWheelKeyCount(profile: Pick<InventoryProfile, "wheelKeys">, wheel: WheelType) {
  return normalizeWheelKeys(profile.wheelKeys)[wheel];
}

function getQuestKeyRewardTitle(reward: QuestReward) {
  return `${reward.amount}x ${WHEEL_KEY_LABELS[reward.wheel]}`;
}

const GAME_MODES: ModeInfo[] = [
  {
    id: "turnuva",
    name: "Turnuva",
    subtitle: "Ana mod",
    eyebrow: "Battle Royale",
    chip: "Ana Oynanış",
    terrain: "Çok katlı daralan arena",
    players: "16 oyuncu",
    objective: "Hayatta kal, loot topla, son kalan ol.",
    description:
      "Harita zamanla küçülür. Oyuncular map üzerindeki lootları, silahları, kılıçları ve kalkanları toplayabilir. Düşen rakiplerin ekipmanları da alınabilir.",
    zones: ["Loot Alanı", "Daralan Halka", "Merkez Çekirdek", "Yüksek Platform"],
    accent: "from-fuchsia-500/20 via-orange-400/10 to-black",
    image: modeVisuals.turnuva,
    imagePosition: "center",
    icon: <Map className="h-7 w-7 text-white" />,
  },
  {
    id: "kale",
    name: "Kale Savunma",
    subtitle: "Savunma baskısı",
    eyebrow: "Defense",
    chip: "Takım Odaklı",
    terrain: "Savunma hattı",
    players: "8 (4v4)",
    objective: "Kaleyi koru, dalgaları durdur.",
    description:
      "Takımlar savunma noktalarını tutar. Baskı, bariyer, menzil kullanımı ve alan kontrolü bu modda belirleyicidir.",
    zones: ["Ön Hat", "Kapı", "İç Avlu", "Son Savunma Noktası"],
    accent: "from-red-500/18 via-orange-400/10 to-black",
    image: modeVisuals.kale,
    imagePosition: "center top",
    icon: <Shield className="h-7 w-7 text-white" />,
  },
  {
    id: "bayrak",
    name: "Bayrak Kapmaca",
    subtitle: "Hızlı hedef oyunu",
    eyebrow: "Objective",
    chip: "Mobil Oynanış",
    terrain: "İki üs arası rota",
    players: "8 (4v4)",
    objective: "Rakip bayrağı al, kendi üssüne taşı.",
    description:
      "Hız, rotalar, taşıyıcı koruması ve hızlı geri dönüş bu modun temelidir. Amaç odaklı çatışma yapısı öne çıkar.",
    zones: ["Mavi Üs", "Kırmızı Üs", "Orta Hat", "Gizli Geçiş"],
    accent: "from-sky-500/18 via-cyan-400/10 to-black",
    image: modeVisuals.bayrak,
    imagePosition: "center",
    icon: <FlagLikeIcon />,
  },
  {
    id: "gemi",
    name: "Gemi Savaşları",
    subtitle: "Deniz üstü çatışma",
    eyebrow: "Naval",
    chip: "4 Kişilik",
    terrain: "Açık deniz ve ana gemiler",
    players: "4 oyuncu / 5 ana gemi",
    objective: "Gemileri ele geçir, üstünlüğü kur.",
    description:
      "Beş ana gemi vardır. Gemiler rastgele iyi veya kötü tarafta olabilir. Açık deniz pozisyonu ve güverte baskısı bu modun omurgasıdır.",
    zones: ["Ana Gemi", "Köprü", "Top Güvertesi", "Yan İskele"],
    accent: "from-slate-500/18 via-sky-400/10 to-black",
    image: modeVisuals.gemi,
    imagePosition: "center",
    icon: <ShipLikeIcon />,
  },
  {
    id: "araba",
    name: "Araba Modifiye Yarış",
    subtitle: "Hız ve çarpışma",
    eyebrow: "Race",
    chip: "10 Kişilik",
    terrain: "Açık pist ve mod alanı",
    players: "10 oyuncu / Tekli veya 2v2",
    objective: "Pisti bitir, modifiye avantajını iyi kullan.",
    description:
      "10 kişilik yarış odaklı moddur. Tekli veya 2v2 oynanabilir. Araç modları ve hız odaklı hat seçimi yarışın akışını değiştirir.",
    zones: ["Başlangıç", "Mod Alanı", "Drift Virajı", "Son Düzlük"],
    accent: "from-orange-500/20 via-red-400/10 to-black",
    image: modeVisuals.araba,
    imagePosition: "center bottom",
    icon: <Zap className="h-7 w-7 text-white" />,
  },
  {
    id: "duello",
    name: "2v2 Düello",
    subtitle: "Yakın rekabet",
    eyebrow: "Arena",
    chip: "2v2",
    terrain: "Kompakt çatışma alanı",
    players: "4 oyuncu (2v2)",
    objective: "Rakip ikiliyi düşür, alanı kontrol et.",
    description:
      "Yakın çatışma, hızlı trade, takım uyumu ve baskı yönetimiyle ilerleyen rekabetçi arena modu. Poster gibi güçlü görünmesi amaçlandı.",
    zones: ["Merkez", "Yan Kapılar", "Yüksek Kutu", "İyileşme Köşesi"],
    accent: "from-amber-500/18 via-orange-400/10 to-black",
    image: modeVisuals.duello,
    imagePosition: "center",
    icon: <Swords className="h-7 w-7 text-white" />,
  },
];

function FlagLikeIcon() {
  return (
    <div className="relative h-7 w-7">
      <div className="absolute left-2 top-1 h-5 w-[2px] bg-white/90" />
      <div className="absolute left-[10px] top-1 h-3 w-4 bg-white/85 [clip-path:polygon(0_0,100%_20%,72%_50%,100%_82%,0_100%)]" />
    </div>
  );
}

function ShipLikeIcon() {
  return (
    <div className="relative h-7 w-7">
      <div className="absolute bottom-1 left-1 h-2.5 w-5 rounded-b-full border border-white/85 border-t-0" />
      <div className="absolute bottom-3 left-3 h-3 w-[2px] bg-white/90" />
      <div className="absolute bottom-4 left-[13px] h-0 w-0 border-b-[8px] border-l-0 border-r-[8px] border-b-white/85 border-t-0 border-r-transparent" />
    </div>
  );
}


function KeyMiniIcon({ tone = "blue" }: { tone?: "blue" | "purple" | "gold" }) {
  const toneClass =
    tone === "gold"
      ? "from-amber-200 via-yellow-300 to-orange-500"
      : tone === "purple"
      ? "from-fuchsia-200 via-violet-300 to-indigo-500"
      : "from-cyan-200 via-sky-300 to-blue-500";

  return (
    <span className={`relative inline-flex h-4 w-4 rotate-[-12deg] items-center justify-center rounded-full bg-gradient-to-br ${toneClass} shadow-[0_0_16px_rgba(255,255,255,0.25)]`}>
      <span className="absolute left-[9px] top-[7px] h-[3px] w-[9px] rounded-full bg-current text-white/90" />
      <span className="absolute left-[15px] top-[6px] h-[4px] w-[2px] bg-current text-white/90" />
      <span className="absolute left-[18px] top-[6px] h-[5px] w-[2px] bg-current text-white/90" />
      <span className="h-2 w-2 rounded-full border border-black/45 bg-white/50" />
    </span>
  );
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildCharacterArt(name: string, rarity: RarityName, side?: Side | null) {
  const palette =
    rarity === "Omega"
      ? { a: "#ffd7ff", b: "#f08cff", c: "#fff1a6" }
      : rarity === "Kristalize" && side === "İyi"
      ? { a: "#d8f9ff", b: "#79ceff", c: "#8d7bff" }
      : rarity === "Kristalize" && side === "Kötü"
      ? { a: "#ffd6d6", b: "#ff4242", c: "#5f0f1f" }
      : rarity === "Efsanevi"
      ? { a: "#fff0af", b: "#ffbf47", c: "#8f5c18" }
      : rarity === "Destansı"
      ? { a: "#eed9ff", b: "#9a65ff", c: "#3c246d" }
      : rarity === "Ender"
      ? { a: "#ecffcf", b: "#96f06f", c: "#1f5f2a" }
      : { a: "#f1f2f5", b: "#8f98a1", c: "#404851" };

  const initial = (name[0] || "?").toUpperCase();

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.a}"/>
          <stop offset="50%" stop-color="${palette.b}"/>
          <stop offset="100%" stop-color="${palette.c}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="24%" r="55%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="420" height="520" rx="16" fill="url(#bg)"/>
      <path d="M22 14 H398 L406 22 V498 L398 506 H22 L14 498 V22 Z" fill="#0b0f14" fill-opacity="0.18" stroke="#ffffff" stroke-opacity="0.18"/>
      <path d="M18 30 V18 H30" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
      <path d="M390 18 H402 V30" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
      <path d="M18 490 V502 H30" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
      <path d="M390 502 H402 V490" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
      <circle cx="210" cy="110" r="78" fill="url(#glow)"/>
      <path d="M135 410 C150 336, 176 300, 210 300 C244 300, 270 336, 285 410" fill="#0d1117" fill-opacity="0.34"/>
      <circle cx="210" cy="214" r="74" fill="#f6d1a6"/>
      <path d="M150 188 C176 124, 244 122, 278 184 L278 208 L142 208 Z" fill="#1d2128"/>
      <rect x="145" y="292" width="130" height="110" rx="18" fill="#1a2028" fill-opacity="0.68"/>
      <circle cx="184" cy="214" r="10" fill="#20242b"/>
      <circle cx="236" cy="214" r="10" fill="#20242b"/>
      <path d="M186 246 C202 258, 218 258, 234 246" fill="none" stroke="#8a4f3f" stroke-width="8" stroke-linecap="round"/>
      <path d="M132 414 L288 414" stroke="#ffffff" stroke-opacity="0.18" stroke-width="6" stroke-linecap="round"/>
      <text x="210" y="468" font-family="Arial, sans-serif" font-size="92" font-weight="700" text-anchor="middle" fill="#ffffff" fill-opacity="0.92">${initial}</text>
    </svg>
  `);
}


const CHARACTER_IMAGE_MAP: Record<string, string> = {
  "Omega Dareth": "/images/news/characters/characters/omega-dareth.png",
  "Genç Garmadon": "/images/news/characters/characters/genc-garmadon.png",
  "Genç Wu": "/images/news/characters/characters/genc-wu.png",
  "Darth Vader": "/images/news/characters/characters/darth-vader.png",
  "Gurkan": "/images/news/characters/characters/gurkan.png",
  "Vengestone Askeri": "/images/news/characters/characters/vengestone-askeri.png",
  "Ateş Mech": "/images/news/characters/characters/ates-mech.png",
  "Steve": "/images/news/characters/characters/steve.png",
  "Gölge Cinder": "/images/news/characters/characters/golge-cinder.png",
  "Creeper": "/images/news/characters/characters/creaper.png",
  "Anacondrai": "/images/news/characters/characters/anacondrai.png",
  "Ragrast": "/images/news/characters/characters/ragrast.png",
  "Uykucu Gary": "/images/news/characters/characters/uykucu-gary.png",
  "Luna": "/images/news/characters/characters/luna.png",
  "Jett": "/images/news/characters/characters/jett.png",
  "Mia": "/images/news/characters/characters/mia.png",
  "Robo Raptor": "/images/news/characters/characters/robo-raptor.png",
  "Dedektif Clara": "/images/news/characters/characters/dedektif-clara.png",
  "Dinamit Kız": "/images/news/characters/characters/dinamit-kiz.png",
  "Ateş Frank": "/images/news/characters/characters/ates-frank.png",
  "Kaya Yaratığı": "/images/news/characters/characters/kaya-yaratigi.png",
  "Guby": "/images/news/characters/characters/guby.png",
  "Toxe": "/images/news/characters/characters/toxe.png",
  "Clone Trooper": "/images/news/characters/characters/clone-trooper.png",
  "Kırmızı Jhon": "/images/news/characters/characters/kirmizi-jhon.png",
  "Dracula": "/images/news/characters/characters/dracula.png",
  "Tadilatçı": "/images/news/characters/characters/tadilatci.png",
  "Kranler": "/images/news/characters/kranler.png",
};

function getCharacterImage(name: string, rarity: RarityName, side?: Side | null) {
  return CHARACTER_IMAGE_MAP[name] ?? buildCharacterArt(name, rarity, side ?? null);
}



const CHARACTER_DATABASE: CharacterInfo[] = [
  {
    id: "omega-dareth",
    name: "Omega Dareth",
    rarity: "Omega",
    hp: 285,
    range: "Karışık",
    skill1: "Diyar kristali enerjili yumruk",
    skill2: "Enerji ışını",
    ultimate: "Işınlanma",
  },

  {
    id: "genc-garmadon",
    name: "Genç Garmadon",
    rarity: "Kristalize",
    side: "Kötü",
    hp: 220,
    range: "Karışık",
    skill1: "Yakın menzilde karanlık yumruk atar ve rakibi kısa süre yavaşlatır.",
    skill2: "Karanlık ateş topu fırlatır, çarptığı yerde kısa süre karanlık etki bırakır.",
    ultimate: "Hasar aldıkça öfke biriktirir. Gücü dolunca kısa süre hız ve saldırı artışı kazanır, ilk vuruşunda karanlık patlama yayar.",
  },
  {
    id: "genc-wu",
    name: "Genç Wu",
    rarity: "Kristalize",
    side: "İyi",
    hp: 205,
    range: "Karışık",
    skill1: "Kendine veya takım arkadaşının kullanabileceği bir silah yaratır.",
    skill2: "Kişisel parıltı kalkanları oluşturur; hem HP hem de kalkan sağlar ama etkisi kısa sürer.",
    ultimate: "Son düşen takım arkadaşını düşük HP ile geri çağırır; ulti çok geç dolar.",
  },
  {
    id: "darth-vader",
    name: "Darth Vader",
    rarity: "Kristalize",
    side: "Kötü",
    hp: 220,
    range: "Karışık",
    skill1: "Rakibini telekinetik güçle tutup fırlatır ve kısa sersemletir.",
    skill2: "Telekinetik boğma ile çekerek kontrollü hasar verir.",
    ultimate: "Kılıcıyla yaptığı ilk vuruş çok yüksek hasar verir ve ağır sersemletir, ancak tek atmaz; ulti çok geç dolar.",
  },
  {
    id: "gurkan",
    name: "Gurkan",
    rarity: "Kristalize",
    side: "İyi",
    hp: 225,
    range: "Yakın",
    skill1: "Kılıcına elektriği Godzilla kemiğinden aldığı güçle verir.",
    skill2: "Kılıcını yere saplar; etraftakileri şoklar ve kısa süre sars etkisi verir.",
    ultimate: "Her kill başına kısa süreli küçük heal ve sınırlı saldırı bonusu kazanır.",
  },

  {
    id: "vengestone-askeri",
    name: "Vengestone Askeri",
    rarity: "Efsanevi",
    hp: 195,
    range: "Orta",
    skill1: "Hızlıca zıplar ve sarsıcı bir darbe yapar.",
    skill2: "Vücudunda kristal dikenler çıkarır; ona hasar verenler kısa süreli zehir etkisi alır.",
    ultimate: "Orta hızda dolar; öldürdüğü kişiler zayıf zırhlı askere dönüşür ve kısa süre emrine girer.",
  },
  {
    id: "ates-mech",
    name: "Ateş Mech",
    rarity: "Efsanevi",
    hp: 210,
    range: "Karışık",
    skill1: "Kanatlarını çırpar ve yakın mesafedeki rakibe sars uygular.",
    skill2: "Ateş püskürtür.",
    ultimate: "Uçarak alev topu atabilir.",
  },
  {
    id: "steve",
    name: "Steve",
    rarity: "Efsanevi",
    hp: 185,
    range: "Karışık",
    skill1: "Rakibini uzaktan kazma fırlatarak sarsar ve orta hasar verir.",
    skill2: "Blok koyup kısa süreli kalkan veya yükselti yapabilir.",
    ultimate: "Canını %50 artıran bir elmas zırh giyer.",
  },
  {
    id: "golge-cinder",
    name: "Gölge Cinder",
    rarity: "Efsanevi",
    hp: 185,
    range: "Orta",
    skill1: "Kılıcına toz serper; 10 saniye içinde vurduğu ilk düşman uykulanır, sersemler ve hasar yer.",
    skill2: "Toz dumana dönüşür; minik bir mesafe seyahat eder ama bu yetenek geç dolar.",
    ultimate: "Geniş bir parıltı bulutu saçar; takımını hızlandırıp güçlendirir, rakipleri zayıflatır ve bu alanda sınırsız duman olabilir.",
  },

  {
    id: "creeper",
    name: "Creeper",
    rarity: "Destansı",
    hp: 145,
    range: "Yakın",
    skill1: "Etrafındaki doğaya adapte olup gizlenir.",
    skill2: "Kendi etrafını patlatır; rakip ne kadar yakınsa o kadar fazla hasar alır, ama kendisi de risk altına girer.",
    ultimate: "Gökyüzünden yıldırım çarpar; 2. yeteneği güçlenir ve kısa süre ek HP kazanır.",
  },
  {
    id: "anacondrai",
    name: "Anacondrai",
    rarity: "Destansı",
    hp: 165,
    range: "Yakın",
    skill1: "Rakibini ısırırsa bedenine zehir salar.",
    skill2: "Hasarlardan kurtulacak bir salgı yayar; keskin delici aletler dışında çoğu şeye direnci artar.",
    ultimate: "Rakibini kuyruğuyla tutup boğmaya başlar; bu sırada rakip kaçamaz ve ultisi hızlı dolar.",
  },
  {
    id: "kranler",
    name: "Kranler",
    rarity: "Destansı",
    side: null as never,
    hp: 200,
    range: "Yakın",
    skill1: "Kısa süre savunmasını artırır ve aldığı hasarı azaltır.",
    skill2: "Dev eldiveniyle güçlü bir darbe indirir ve hedefi kısa süre geri iter.",
    ultimate: "Gücünü toplar, etrafına güçlü bir enerji patlaması yayar ve yakınındaki düşmanları geri savurur.",
  },

  {
    id: "ragrast",
    name: "Ragrast",
    rarity: "Destansı",
    hp: 170,
    range: "Yakın",
    skill1: "Rakibini ısırır ve buldog gibi kitlenir; saniye başı HP hasarı verir.",
    skill2: "Hızını, zıplamasını, saldırısını ve dayanıklılığını ciddi oranda arttırır.",
    ultimate: "Yeri kazar ve rakibinin arkasından çıkar.",
  },
  {
    id: "uykucu-gary",
    name: "Uykucu Gary",
    rarity: "Destansı",
    hp: 155,
    range: "Orta",
    skill1: "Rakibine sersemleme etkisi veren bir uyku tozu serper.",
    skill2: "Çevresine rakipleri sersemleten ve görme yetisine zarar veren uyku gazı saçar.",
    ultimate: "Bir rakibini tamamen uyutur.",
  },
  {
    id: "luna",
    name: "Luna",
    rarity: "Destansı",
    hp: 170,
    range: "Orta",
    skill1: "Kendine ve takım arkadaşına 5 saniyelik kayganlık ve regeneration etkisi verir.",
    skill2: "Sudan dayanıklı küçük bir alan kalkanı oluşturur; hasarlar ve mermiler geçer ama %80 daha az hasar verir.",
    ultimate: "Geniş menzilli bir girdap oluşturur; rakipleri merkeze çeker, sars ve hasar verirken takımına 10 saniyelik kayganlık ve regeneration sağlar.",
  },

  {
    id: "jett",
    name: "Jett",
    rarity: "Ender",
    hp: 145,
    range: "Karışık",
    skill1: "Bir sis bombası atar.",
    skill2: "Hafif dash atar.",
    ultimate: "5 adet fırlatılabilir bıçak çıkarır ve dash yeteneği 30 saniyeliğine sınırsızlaşır.",
  },
  {
    id: "mia",
    name: "Mia",
    rarity: "Ender",
    hp: 165,
    range: "Yakın",
    skill1: "Kendisine ve bir takım arkadaşına 3 saniye sürecek regeneration efekti verir.",
    skill2: "10 saniye duran bir kalkan çemberi açar; yakın menzilde bu alanın içine hasarlar giremez.",
    ultimate: "Kendisinin ve takım arkadaşının canını tamamen doldurur.",
  },
  {
    id: "robo-raptor",
    name: "Robo Raptor",
    rarity: "Ender",
    hp: 160,
    range: "Yakın",
    skill1: "Rakibi kıskacıyla sokar; 3 saniyeliğine yavaşlık, zehir ve görüş bozukluğu verir.",
    skill2: "Hızını ve zıplamasını ciddi oranda arttırır; bu sırada rakibe atlarsa düşüş hasarı verir.",
    ultimate: "Gözündeki tarayıcıyla avını bulur; 1. ve 2. yeteneklerini daha güçlü şekilde birlikte kullanır ve hedefe kilitlenir.",
  },
  {
    id: "dedektif-clara",
    name: "Dedektif Clara",
    rarity: "Ender",
    hp: 150,
    range: "Orta",
    skill1: "Kendine basit bir şok tabancası verir.",
    skill2: "Yere bakarak yakın çaptaki ayak izlerini takip edebilir.",
    ultimate: "Bütün rakiplerinin yerini kendisi ve takım arkadaşları için açığa çıkarır.",
  },
  {
    id: "dinamit-kiz",
    name: "Dinamit Kız",
    rarity: "Ender",
    hp: 150,
    range: "Orta",
    skill1: "Flash tarzı mini hasarlı bir dinamit fırlatır.",
    skill2: "Daha fazla hasarlı ama flash etkisi olmayan bir dinamit fırlatır.",
    ultimate: "Yere C4 mayını kurar ve istediği anda patlatır; isterse rakibine fırlatabilir.",
  },
  {
    id: "ates-frank",
    name: "Ateş Frank",
    rarity: "Ender",
    hp: 160,
    range: "Orta",
    skill1: "Mini ateş topları atar.",
    skill2: "Ateşi uzun süre püskürtür.",
    ultimate: "Büyük menzilli bir ateş fırtınası oluşturur; kendisi HP kazanırken rakipleri hasar görür.",
  },
  {
    id: "kaya-yaratigi",
    name: "Kaya Yaratığı",
    rarity: "Ender",
    hp: 180,
    range: "Yakın",
    skill1: "Kayadan oluşan bir kıskaç ve çekiç kazanır; çekici rakipleri sarsar.",
    skill2: "Kıskacını kullanarak bir rakibini yakalar; rakip sersemleme etkisi alır.",
    ultimate: "Yere kocaman vurur ve uzun menzildeki herkes sarsılır.",
  },

  {
    id: "guby",
    name: "Guby",
    rarity: "Sıradan",
    hp: 130,
    range: "Yakın",
    skill1: "Rakibine tükürür ve minik zehir verir.",
    skill2: "Sıvıya dönüşüp saklanabilir; rakibin altına geçerse rakip kayar, düşer ve sersemler.",
    ultimate: "Rakibin kafasına atlayıp yapışır; görüşünü kapatır ve HP çalmaya başlar.",
  },
  {
    id: "toxe",
    name: "Toxe",
    rarity: "Sıradan",
    hp: 120,
    range: "Orta",
    skill1: "Rakibine zehirli bir gaz püskürtür; rakip saniye başı hasar alır.",
    skill2: "Küçük bir zehirli gaz sisi bırakır.",
    ultimate: "Büyük bir zehir alanı oluşturur; herkese hasar verirken Toxe’un zehir vuruşları güçlenir.",
  },
  {
    id: "clone-trooper",
    name: "Clone Trooper",
    rarity: "Sıradan",
    hp: 125,
    range: "Uzak",
    skill1: "Kendine bir ışın silahı kazandırır.",
    skill2: "Uzun menzilli silahı 3 saniyeliğine patlayıcı lazerler atar.",
    ultimate: "Kendisinden daha zayıf, zırhsız ama aynı silahlı 3 trooper çağırır.",
  },
  {
    id: "kirmizi-jhon",
    name: "Kırmızı Jhon",
    rarity: "Sıradan",
    hp: 130,
    range: "Karışık",
    skill1: "Eline yakın menzilli çoklu tabancasını alır.",
    skill2: "Metal kolunu şoklar; yumruk attığı ilk kişi çarpılma etkisi alır ve sersemler.",
    ultimate: "Koluyla tabancasını birleştirip taramalı uzak menzilli silaha dönüştürür.",
  },
  {
    id: "dracula",
    name: "Dracula",
    rarity: "Sıradan",
    hp: 125,
    range: "Yakın",
    skill1: "Uçarak minik dash atar.",
    skill2: "Rakibini ısırır; rakip kanama/poison etkisi alırken kendisi HP yenilemeye başlar.",
    ultimate: "Kendini öldürür ve bambaşka bir yerde 0 loot ile yeniden doğar.",
  },
  {
    id: "tadilatci",
    name: "Tadilatçı",
    rarity: "Sıradan",
    hp: 130,
    range: "Orta",
    skill1: "Kendisinin ve takım arkadaşının silahını geliştirir; %10 daha fazla hasar sağlar.",
    skill2: "Kendisinin ve takım arkadaşının kalkanını %10 geliştirir.",
    ultimate: "Kendisi ve takım arkadaşının hem kalkanlarını hem silahlarını %25 geliştirir.",
  },
].map((c) => {
  const role = CHARACTER_ROLES[c.name] ?? "Saldırı";
  const character = {
    ...c,
    role,
    level: 1,
    maxLevel: MAX_CHARACTER_LEVEL,
    image: getCharacterImage(c.name, c.rarity as RarityName, c.side === "İyi" || c.side === "Kötü" ? c.side : null),
  } as Omit<CharacterInfo, "baseDamage">;

  return {
    ...character,
    baseDamage: getBaseDamageForCharacter(character),
  };
}) as CharacterInfo[];


const FAKE_ACCOUNT_NAMES = [
  "Çaycı Rıza",
  "Keko Kaan",
  "Taktik Taylan",
  "Çılgın Veli",
  "Bomba Bülent",
  "Kral Hüso",
  "Deli İsmail",
  "Tombul Taha",
  "Tilt Tolga",
  "Kafayı Yedi Hasan",
  "Sinsi Sinan",
  "Yancı Yunus",
  "Turbo Tuncay",
  "Reis Rıza",
  "Şaban Deluxe",
  "Köylü Kemal",
  "Kurnaz Kadir",
  "Dayı Metin",
  "Mini Mehmet",
  "Kasa Kerem",
  "Kara Kenan",
  "Zıpır Ziya",
  "Hızlı Hüseyin",
  "Fırıldak Ferhat",
  "Duman Doğan",
  "Serseri Serkan",
  "Manyak Murat",
  "Bozkurt Bora",
  "Tosbağa Tamer",
  "Aşiret Ali",
  "Çakır Cemil",
  "Patron Pala",
  "Garip Gürkan",
  "Bıçkın Burak",
  "Sivri Zeki",
  "Tetikçi Taha",
  "Şampiyon Şükrü",
  "Kaptan Kamil",
  "Dobra Davut",
  "Gizli Gökhan",
  "Karpuz Kamil",
  "Lodos Levent",
  "Çorbacı Cengiz",
  "Yılan Yılmaz",
  "Sakin Selim",
  "Osman Aga",
  "Şovmen Şeref",
  "Panik Poyraz",
  "Ceviz Celal",
  "Pofuduk Pusat",
  "Racon Rıfat",
  "Kurt Kadir",
  "Piksel Pala",
  "Nöbetçi Nihat",
  "Korsan Kazım",
  "Kroşe Kamil",
  "Yıldız Yusuf",
  "Hologram Hakkı",
  "Beyin Barış",
  "Balkon Bahri",
  "Efsane Enes",
  "Mızıkçı Mert",
  "Pastacı Polat",
  "Klavye Kerim",
  "Dandik Davut",
  "Büyük Bora",
  "Noob Nurettin",
  "Ağır Abi Arda",
  "Sosis Samet",
  "Frensiz Fikret",
  "Kabadayı Kaan",
  "Şanslı Şükrü",
  "Mangal Mahir",
  "Ninja Necmi",
  "Trol Tayfun",
  "Mermi Meto",
  "Baron Batu",
  "Süper Sedat",
  "Kaptırmış Koral",
  "Çılgın Cevdet",
  "Lavuk Levent",
  "Sarı Sabri",
  "Baba Beko",
  "Küpeli Kıvanç",
  "Mistik Mesut",
  "Kule Kaan",
  "Yamuk Yavuz",
  "Hortlak Harun",
  "Tavşan Tuncer",
  "Makas Mahmut",
  "coolboy58",
  "shadow.exe",
  "rx77",
  "iceflame",
  "voidwalker",
  "neonviper",
  "darkbyte",
  "glitchkid",
  "astranova",
  "turbopixel",
  "zerofox",
  "nightc0re",
  "crystal404",
  "voltix",
  "arknova",
  "frostloop",
  "hyperzen",
  "ghostmesh",
  "quantumboy",
  "redsignal",
  "z3roline",
  "mystbyte",
  "blueshard",
  "onyxkid",
  "fluxwave",
  "KaosLobi533",
  "SinirKupesi61",
  "LanetPing404",
  "TiltMakinesi77",
  "YuhAbi999",
  "RageQuitX12",
  "TrolMermisi31",
  "ÇöpLobby88",
  "KaraMizah71",
  "KaosFırını52",
  "TuzluBey47",
  "PingCanavarı19",
  "BanYiyen69",
  "KafaAçan404",
  "YeterBeOğlum33",
  "UltraWolf101",
  "NeoSpark102",
  "MegaCore103",
  "HyperPoint104",
  "VoidMesh105",
  "TurboEdge106",
  "GlitchRider107",
  "ShadowLoop108",
  "PixelBeam109",
  "NovaStone110",
  "FrostWolf111",
  "BlazeSpark112",
  "StormCore113",
  "VortexPoint114",
  "QuantumMesh115",
  "NightEdge116",
  "SolarRider117",
  "LunarLoop118",
  "IronBeam119",
  "GhostStone120",
  "CyberWolf121",
  "TitanSpark122",
  "RapidCore123",
  "DeltaPoint124",
  "OmegaMesh125",
  "CrimsonEdge126",
  "BlueRider127",
  "OnyxLoop128",
  "AmberBeam129",
  "VoltStone130",
  "EchoWolf131",
  "PulseSpark132",
  "InfernoCore133",
  "RiftPoint134",
  "ZeroMesh135",
  "AlphaEdge136",
  "BetaRider137",
  "GammaLoop138",
  "SigmaBeam139",
  "OrbitStone140",
  "UltraWolf141",
  "NeoSpark142",
  "MegaCore143",
  "HyperPoint144",
  "VoidMesh145",
  "TurboEdge146",
  "GlitchRider147",
  "ShadowLoop148",
  "PixelBeam149",
  "NovaStone150",
  "FrostWolf151",
  "BlazeSpark152",
  "StormCore153",
  "VortexPoint154",
  "QuantumMesh155",
  "NightEdge156",
  "SolarRider157",
  "LunarLoop158",
  "IronBeam159",
  "GhostStone160",
  "CyberWolf161",
  "TitanSpark162",
  "RapidCore163",
  "DeltaPoint164",
  "OmegaMesh165",
  "CrimsonEdge166",
  "BlueRider167",
  "OnyxLoop168",
  "AmberBeam169",
  "VoltStone170",
  "EchoWolf171",
  "PulseSpark172",
  "InfernoCore173",
  "RiftPoint174",
  "ZeroMesh175",
  "AlphaEdge176",
  "BetaRider177",
  "GammaLoop178",
  "SigmaBeam179",
  "OrbitStone180",
  "UltraWolf181",
  "NeoSpark182",
  "MegaCore183",
  "HyperPoint184",
  "VoidMesh185",
  "TurboEdge186",
  "GlitchRider187",
  "ShadowLoop188",
  "PixelBeam189",
  "NovaStone190",
  "FrostWolf191",
  "BlazeSpark192",
  "StormCore193",
  "VortexPoint194",
  "QuantumMesh195",
  "NightEdge196",
  "SolarRider197",
  "LunarLoop198",
  "IronBeam199",
  "GhostStone200",
  "CyberWolf201",
  "TitanSpark202",
  "RapidCore203",
  "DeltaPoint204",
  "OmegaMesh205",
  "CrimsonEdge206",
  "BlueRider207",
  "OnyxLoop208",
  "AmberBeam209",
  "VoltStone210",
  "EchoWolf211",
  "PulseSpark212",
  "InfernoCore213",
  "RiftPoint214",
  "ZeroMesh215",
  "AlphaEdge216",
  "BetaRider217",
  "GammaLoop218",
  "SigmaBeam219",
  "OrbitStone220",
  "UltraWolf221",
  "NeoSpark222",
  "MegaCore223",
  "HyperPoint224",
  "VoidMesh225",
  "TurboEdge226",
  "GlitchRider227",
  "ShadowLoop228",
  "PixelBeam229",
  "NovaStone230",
  "FrostWolf231",
  "BlazeSpark232",
  "StormCore233",
  "VortexPoint234",
  "QuantumMesh235",
  "NightEdge236",
  "SolarRider237",
  "LunarLoop238",
  "IronBeam239",
  "GhostStone240",
  "CyberWolf241",
  "TitanSpark242",
  "RapidCore243",
  "DeltaPoint244",
  "OmegaMesh245",
  "CrimsonEdge246",
  "BlueRider247",
  "OnyxLoop248",
  "AmberBeam249",
  "VoltStone250",
  "EchoWolf251",
  "PulseSpark252",
  "InfernoCore253",
  "RiftPoint254",
  "ZeroMesh255",
  "AlphaEdge256",
  "BetaRider257",
  "GammaLoop258",
  "SigmaBeam259",
  "OrbitStone260",
  "UltraWolf261",
  "NeoSpark262",
  "MegaCore263",
  "HyperPoint264",
  "VoidMesh265",
  "TurboEdge266",
  "GlitchRider267",
  "ShadowLoop268",
  "PixelBeam269",
  "NovaStone270",
  "FrostWolf271",
  "BlazeSpark272",
  "StormCore273",
  "VortexPoint274",
  "QuantumMesh275",
  "NightEdge276",
  "SolarRider277",
  "LunarLoop278",
  "IronBeam279",
  "GhostStone280",
  "CyberWolf281",
  "TitanSpark282",
  "RapidCore283",
  "DeltaPoint284",
  "OmegaMesh285",
  "CrimsonEdge286",
  "BlueRider287",
  "OnyxLoop288",
  "AmberBeam289",
  "VoltStone290",
  "EchoWolf291",
  "PulseSpark292",
  "InfernoCore293",
  "RiftPoint294",
  "ZeroMesh295",
  "AlphaEdge296",
  "BetaRider297",
  "GammaLoop298",
  "SigmaBeam299",
  "OrbitStone300",
  "UltraWolf301",
  "NeoSpark302",
  "MegaCore303",
  "HyperPoint304",
  "VoidMesh305",
  "TurboEdge306",
  "GlitchRider307",
  "ShadowLoop308",
  "PixelBeam309",
  "NovaStone310",
  "FrostWolf311",
  "BlazeSpark312",
  "StormCore313",
  "VortexPoint314",
  "QuantumMesh315",
  "NightEdge316",
  "SolarRider317",
  "LunarLoop318",
  "IronBeam319",
  "GhostStone320",
  "CyberWolf321",
  "TitanSpark322",
  "RapidCore323",
  "DeltaPoint324",
  "OmegaMesh325",
  "CrimsonEdge326",
  "BlueRider327",
  "OnyxLoop328",
  "AmberBeam329",
  "VoltStone330",
  "EchoWolf331",
  "PulseSpark332",
  "InfernoCore333",
  "RiftPoint334",
  "ZeroMesh335",
  "AlphaEdge336",
  "BetaRider337",
  "GammaLoop338",
  "SigmaBeam339",
  "OrbitStone340",
  "UltraWolf341",
  "NeoSpark342",
  "MegaCore343",
  "HyperPoint344",
  "VoidMesh345",
  "TurboEdge346",
  "GlitchRider347",
  "ShadowLoop348",
  "PixelBeam349",
  "NovaStone350",
  "TiltCanavari533",
  "SinirKupesi404",
  "KaosMakinesi71",
  "BanSebebi77",
  "RageLobisi61",
  "TuzMadenI33",
  "CokGerginAbi52",
  "PingBelasi19",
  "LobiYakan35",
  "OfkeMotoru88",
  "CapsLockBey47",
  "TripKral66",
  "TersKose31",
  "KufurEtmiyom59",
  "YayinKopan22",
  "TakimBozan91",
  "NoScopeSinir14",
  "KarsiTakimKabusu73",
  "SinirliPanda53",
  "AlevAlanKlavye29",
  "CildirisModu84",
  "MizacBozuk48",
  "LanetOlasiPing63",
  "TaktikYok35",
  "DramaLobby57",
  "BasimAgridi42",
  "YineMiLag87",
  "TuzluTurşu24",
  "YandikAbi70",
  "KacanMoruk11",
  "KafaAcanLag64",
  "RageReset39",
  "BaskaOyunaGit55",
  "KirmiziAlarm18",
  "SinirKrizi90",
  "LobiCarpani13",
  "CokFenaTilt26",
  "KlavyeSallayan44",
  "DengesizDrop72",
  "TerliMouse21",
  "GolgeTrol68",
  "SabrimTasiyor16",
  "DertKupesi81",
  "BagirCagir43",
  "GerginJoystick54",
  "KarsiLobiAzabi27",
  "TansiyonYuksek62",
  "ZorOyuncu17",
  "TripliMermi36",
  "AğırTuz58",
  "MandalinaMurat",
  "PatatesFerhat",
  "LimonluLevent",
  "BalkabakBaris",
  "TursucuTuna",
  "PijamaliPoyraz",
  "CekirdekCenk",
  "TerlikciTaylan",
  "BulgurhanBora",
  "KavanozKamil",
  "MisirliMert",
  "YogurtcuYasar",
  "SemaverSelim",
  "TostcuTurgut",
  "PusetliPolat",
  "CitirCemre",
  "KarpuzhanKaan",
  "MaydanozMahir",
  "SimitciSina",
  "KoltukKenan",
  "NohutcuNecip",
  "PaspasPusat",
  "LambaciLevo",
  "GofretGokhan",
  "KiremitKivanc",
  "MerdaneMetin",
  "PorselenPelin",
  "TencereTuna",
  "BiberonBurak",
  "SalcaliSamet",
  "MakarnaMuzo",
  "KestaneKoray",
  "DantelDavut",
  "FincanFurkan",
  "LeblebiLevent",
  "KaravanaKerem",
  "PiknikPala",
  "YelpazeYusuf",
  "SaksiSabri",
  "MandalMithat",
  "RendeRasim",
  "KumbaraKudret",
  "YorganYigit",
  "PofidikPamir",
  "SandalyeSuat",
  "CakmakCavit",
  "SarmaSahin",
  "TavaTayfun",
  "YastikYalcin",
  "FistikFikri",
  "KupSekerKutay",
  "PirincliPolat",
  "BastonBahadir",
  "TorbaliTufan",
  "PipetPoyraz",
  "MandalinOsman",
  "DolapDoruk",
  "KaseKaan",
  "YelekYunus",
  "LahanaLatif",
  "PekmezPusat",
  "TursuTalha",
  "NaneNihat",
  "MumbarMete",
  "SehpaSerdar",
  "KirisKadir",
  "LadesLevo",
  "MumlukMurat",
  "SahanSaffet",
  "KekikKorhan",
  "BorekBartu",
  "SufleSencer",
  "TarhanaTamer",
  "MarulMithat",
  "CereyanCemil",
  "FermuarFaruk",
  "KovboyKabak",
  "KampciKoksal",
  "DondurmaDavut",
  "SungerSukru",
  "RadyocuRiza",
  "TavafErhan",
  "LokumLutfi",
  "CipsciCagatay",
  "TokaTolga",
  "KaskliKemal",
  "MumyaMurat",
  "SosisSencer",
  "SacTavaSami",
  "KayisiKamil",
  "MikserMert",
  "KasnakKaan",
  "PikapPolat",
  "TiftilTahir",
  "YamukYekta"
];


const TRADE_ONLY_ACCOUNT_NAMES = [
  "Rick Sanchez",
  "labadamadumav",
  "Gürkan",
  "Deniz",
  "Prottotype",
  "The Dark Lord",
  "Ariso",
  "h4ck3r",
  "Bıldırcın Furkan",
  "Morro",
  "Sensei Wu",
];

function createTradeOnlyAccounts(): TradeAccount[] {
  const opLoadouts: Record<string, string[]> = {
    "labadamadumav": ["Omega Dareth", "Darth Vader", "Gurkan", "Vengestone Askeri", "Ateş Mech", "Steve"],
    "Gürkan": ["Gurkan", "Genç Wu", "Darth Vader", "Omega Dareth", "Mia"],
    "Deniz": ["Omega Dareth", "Genç Wu", "Vengestone Askeri", "Gölge Cinder", "Mia"],
    "Prottotype": ["Darth Vader", "Gurkan", "Ateş Mech", "Steve", "Jett"],
    "The Dark Lord": ["Omega Dareth", "Darth Vader", "Genç Garmadon", "Vengestone Askeri", "Robo Raptor"],
    "Ariso": ["Genç Wu", "Gurkan", "Gölge Cinder", "Mia", "Kaya Yaratığı"],
    "h4ck3r": ["Darth Vader", "Steve", "Jett", "Robo Raptor", "Dinamit Kız"],
    "Bıldırcın Furkan": ["Omega Dareth", "Gurkan", "Ateş Frank", "Mia", "Kaya Yaratığı"],
    "Morro": ["Genç Garmadon", "Darth Vader", "Gölge Cinder", "Jett", "Ragrast"],
    "Sensei Wu": ["Genç Wu", "Gurkan", "Steve", "Mia", "Vengestone Askeri"],
    "Rick Sanchez": ["Steve", "Darth Vader", "Jett", "Dinamit Kız", "Clone Trooper"],
  };

  return TRADE_ONLY_ACCOUNT_NAMES.map((name, index) => {
    const preset = opLoadouts[name];
    const extraPool = [...CHARACTER_DATABASE]
      .filter((char) => !(preset ?? []).includes(char.name))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((char) => char.name);

    return {
      id: `trade-only-${index + 1}`,
      name,
      items: Array.from(new Set([...(preset ?? []), ...extraPool])).slice(0, 8),
      isFake: true,
    };
  });
}

const PUBLIC_VISIBLE_PLAYER_COUNT = 3750000000;
const GENERATED_PLAYER_SAMPLE_SIZE = 2600;
const FAKE_PLAYER_TARGET = GENERATED_PLAYER_SAMPLE_SIZE;

const TURKISH_FIRST_NAMES = ["Arda", "Eren", "Mert", "Deniz", "Kaan", "Yiğit", "Emir", "Kerem", "Bora", "Tuna", "Baran", "Berk", "Furkan", "Efe", "Ali", "Mahir", "Poyraz", "Toprak", "Rüzgar", "Atlas", "Zeynep", "Elif", "Duru", "Mina", "Ada", "Lara", "Mira", "İrem", "Defne", "Nisa", "Cemre", "Asya"];
const FOREIGN_FIRST_NAMES = ["Shadow", "Neo", "Alex", "Ryan", "Milo", "Liam", "Noah", "Leo", "Max", "Jack", "Nova", "Luna", "Ivy", "Kai", "Axel", "Rex", "Zane", "Blaze", "Zero", "Pixel"];
const FUNNY_PREFIXES = ["Tilt", "Turbo", "Kral", "Mini", "Korsan", "Çaycı", "Tostçu", "Piksel", "Lobi", "Klavye", "Ping", "Noob", "Pro", "Karpuz", "Semaver", "Taktik", "Sinsi", "Uykucu", "Hızlı", "Yavaş", "Ciddi", "Efendi", "Garip"];
const FUNNY_SUFFIXES = ["Canavarı", "Ustası", "Kralı", "Dayı", "Bey", "Abi", "Çocuk", "Reis", "Modu", "Makinesi", "Oyuncusu", "Kaptanı", "Şefi", "Mühendisi", "Dedektifi", "Tayfa", "Köşesi", "404", "77", "31"];
const MILD_ARGO_TAGS = ["Yuh", "Of", "TersKöşe", "Tripli", "Tuzlu", "Sinirli", "Rage", "GG", "BoşYok", "Laglı"];

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function makeFakePlayerName(index: number) {
  const styleRoll = Math.random();
  const persona: NonNullable<TradeAccount["persona"]> = styleRoll < 0.22 ? "cocukca" : styleRoll < 0.40 ? "argolu" : styleRoll < 0.58 ? "garip" : styleRoll < 0.78 ? "olgun" : "yabanci";
  if (persona === "yabanci") return { persona, name: `${randomFrom(FOREIGN_FIRST_NAMES)}${randomFrom(["Wolf", "Byte", "Storm", "Core", "Viper", "Knight", "Spark", "Rider"])}${randomInt(10, 999)}` };
  if (persona === "olgun") return { persona, name: `${randomFrom(TURKISH_FIRST_NAMES)} ${randomFrom(["Komutan", "Stratejist", "Usta", "Kaptan", "Analist", "Muhafız"])} ${randomInt(1, 99)}` };
  if (persona === "argolu") return { persona, name: `${randomFrom(MILD_ARGO_TAGS)}${randomFrom(FUNNY_PREFIXES)}${randomInt(10, 999)}` };
  if (persona === "garip") return { persona, name: `${randomFrom(FUNNY_PREFIXES)} ${randomFrom(FUNNY_SUFFIXES)} ${randomInt(1, 500)}` };
  return { persona, name: `${randomFrom(["Minik", "Çılgın", "Şeker", "Küp", "Patates", "Mısır", "Bıcır", "Pofuduk"])}${randomFrom(TURKISH_FIRST_NAMES)}${randomInt(1, 999)}` };
}

function makeRandomCharacterLevels(items: string[], accountPower: number) {
  return Object.fromEntries(
    items.map((item) => {
      const maxByPower = accountPower >= 260 ? 11 : accountPower >= 140 ? 9 : accountPower >= 50 ? 7 : 5;
      const minByPower = accountPower >= 260 ? 3 : accountPower >= 140 ? 2 : 1;
      return [item, randomInt(minByPower, maxByPower)];
    })
  );
}

function pickRandomCharacterNames(count: number) {
  const names = new Set<string>();
  const target = Math.min(count, CHARACTER_DATABASE.length);

  while (names.size < target) {
    names.add(CHARACTER_DATABASE[randomInt(0, CHARACTER_DATABASE.length - 1)].name);
  }

  return Array.from(names);
}

function makeRandomAccountMaterials(rankPoints: number, itemCount: number) {
  const powerMultiplier = rankPoints >= 400 ? 4 : rankPoints >= 260 ? 3 : rankPoints >= 140 ? 2 : 1;
  const credits = randomInt(2, 22) + itemCount * randomInt(1, 4) + randomInt(0, 18 * powerMultiplier);
  const levelPoints = randomInt(30, 260) + itemCount * randomInt(35, 95) + randomInt(0, 420 * powerMultiplier);

  return {
    credits,
    levelPoints,
    wheelKeys: {
      acemi: Math.random() < 0.46 ? randomInt(1, 4 + powerMultiplier) : 0,
      akademi: Math.random() < 0.24 ? randomInt(1, 2 + Math.floor(powerMultiplier / 2)) : 0,
      turnuva: Math.random() < 0.035 ? 1 : 0,
    } satisfies Record<WheelType, number>,
  };
}

function createFakeAccounts(): TradeAccount[] {
  return Array.from({ length: FAKE_PLAYER_TARGET }, (_, index) => {
    const roll = Math.random();
    let itemCount = 0;
    if (roll < 0.045) itemCount = 18 + randomInt(0, 9);
    else if (roll < 0.18) itemCount = 10 + randomInt(0, 7);
    else if (roll < 0.55) itemCount = 5 + randomInt(0, 4);
    else itemCount = 1 + randomInt(0, 3);

    const rotated = pickRandomCharacterNames(itemCount);
    const rankPoints = itemCount >= 18 ? 260 + randomInt(0, 359) : itemCount >= 10 ? 140 + randomInt(0, 219) : itemCount >= 5 ? 50 + randomInt(0, 149) : randomInt(0, 79);
    const generated = index < FAKE_ACCOUNT_NAMES.length ? { name: FAKE_ACCOUNT_NAMES[index], persona: "garip" as const } : makeFakePlayerName(index);
    const materials = makeRandomAccountMaterials(rankPoints, itemCount);

    return {
      id: `fake-${index + 1}`,
      name: generated.name,
      items: rotated,
      isFake: true,
      persona: generated.persona,
      accountLevel: randomInt(1, 11),
      characterLevels: makeRandomCharacterLevels(rotated, rankPoints),
      banned: Math.random() < 0.006,
      rankPoints,
      credits: materials.credits,
      levelPoints: materials.levelPoints,
      wheelKeys: materials.wheelKeys,
    };
  });
}

const INVENTORY_PALETTES = [
  "from-sky-500/28 via-cyan-400/16 to-black",
  "from-violet-500/28 via-fuchsia-400/16 to-black",
  "from-emerald-500/28 via-teal-400/16 to-black",
  "from-amber-500/28 via-orange-400/16 to-black",
  "from-rose-500/28 via-red-400/16 to-black",
  "from-zinc-500/28 via-slate-400/16 to-black",
  "from-indigo-500/28 via-blue-400/16 to-black",
  "from-lime-500/28 via-emerald-300/16 to-black",
  "from-pink-500/28 via-purple-400/16 to-black",
  "from-stone-500/28 via-neutral-300/16 to-black",
  "from-cyan-400/28 via-blue-600/16 to-black",
  "from-fuchsia-500/28 via-rose-400/16 to-black",
];


const PROFILE_PATTERN_DEFS: {
  id: NonNullable<InventoryProfile["profilePattern"]>;
  label: string;
  rarity: RarityName | null;
  overlay: string;
}[] = [
  {
    id: "duz",
    label: "Düz",
    rarity: null,
    overlay: "bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_62%,rgba(255,255,255,0.04))]",
  },
  {
    id: "ender",
    label: "Ender Desen",
    rarity: "Ender",
    overlay: "bg-[radial-gradient(circle_at_20%_20%,rgba(170,255,120,0.18),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(170,255,120,0.12),transparent_20%)]",
  },
  {
    id: "destansi",
    label: "Destansı Desen",
    rarity: "Destansı",
    overlay: "bg-[radial-gradient(circle_at_50%_20%,rgba(205,160,255,0.22),transparent_24%),linear-gradient(135deg,transparent_0%,rgba(205,160,255,0.10)_40%,transparent_75%)]",
  },
  {
    id: "efsanevi",
    label: "Efsanevi Desen",
    rarity: "Efsanevi",
    overlay: "bg-[radial-gradient(circle_at_20%_25%,rgba(255,210,120,0.18),transparent_20%),radial-gradient(circle_at_80%_75%,rgba(255,170,80,0.14),transparent_22%)]",
  },
  {
    id: "kristalize",
    label: "Kristalize Desen",
    rarity: "Kristalize",
    overlay: "bg-[linear-gradient(135deg,rgba(120,220,255,0.14),transparent_20%,rgba(255,120,220,0.10)_55%,transparent_76%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.14),transparent_18%)]",
  },
  {
    id: "omega",
    label: "Omega Desen",
    rarity: "Omega",
    overlay: "bg-[radial-gradient(circle_at_50%_20%,rgba(255,190,120,0.22),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_26%,rgba(255,190,120,0.10)_58%,transparent_80%)]",
  },
];

function getUnlockedProfilePatterns(profile: InventoryProfile) {
  const ownedRarities = new Set(
    CHARACTER_DATABASE.filter((char) => profile.items.includes(char.name)).map((char) => char.rarity)
  );

  return PROFILE_PATTERN_DEFS.filter((pattern) => pattern.rarity === null || ownedRarities.has(pattern.rarity));
}

function getProfilePatternRequiredRarity(pattern?: InventoryProfile["profilePattern"]) {
  return PROFILE_PATTERN_DEFS.find((item) => item.id === (pattern ?? "duz"))?.rarity ?? null;
}

function canUseProfilePattern(profile: InventoryProfile, pattern?: InventoryProfile["profilePattern"]) {
  const requiredRarity = getProfilePatternRequiredRarity(pattern);
  if (!requiredRarity) return true;
  return CHARACTER_DATABASE.some((char) => char.rarity === requiredRarity && profile.items.includes(char.name));
}

function sanitizeProfileCosmetics(profile: InventoryProfile): InventoryProfile {
  const safePattern = canUseProfilePattern(profile, profile.profilePattern) ? profile.profilePattern : "duz";
  return {
    ...profile,
    profilePattern: safePattern ?? "duz",
  };
}

function getProfilePatternOverlay(pattern?: InventoryProfile["profilePattern"]) {
  const overlays: Record<NonNullable<InventoryProfile["profilePattern"]>, string> = {
    duz: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%,rgba(255,255,255,0.04)_72%,transparent)]",
    ender: "bg-[radial-gradient(circle_at_18%_18%,rgba(170,255,120,0.30),transparent_18%),radial-gradient(circle_at_80%_76%,rgba(170,255,120,0.22),transparent_22%),linear-gradient(135deg,rgba(170,255,120,0.10),transparent_42%)]",
    destansi: "bg-[radial-gradient(circle_at_50%_18%,rgba(205,160,255,0.34),transparent_22%),linear-gradient(135deg,rgba(205,160,255,0.12),transparent_26%,rgba(205,160,255,0.10)_58%,transparent_84%)]",
    efsanevi: "bg-[radial-gradient(circle_at_20%_24%,rgba(255,220,120,0.34),transparent_20%),radial-gradient(circle_at_84%_76%,rgba(255,170,80,0.26),transparent_22%),linear-gradient(135deg,rgba(255,210,120,0.10),transparent_40%)]",
    kristalize: "bg-[linear-gradient(135deg,rgba(120,220,255,0.18),transparent_22%,rgba(255,120,220,0.14)_54%,transparent_78%),radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.22),transparent_16%),radial-gradient(circle_at_22%_74%,rgba(120,220,255,0.18),transparent_22%)]",
    omega: "bg-[radial-gradient(circle_at_50%_16%,rgba(255,190,120,0.40),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_26%,rgba(255,190,120,0.16)_58%,transparent_82%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.18),transparent_18%)]",
  };
  return overlays[pattern ?? "duz"];
}

function getProfileFrameClass(frameStyle?: InventoryProfile["frameStyle"]) {
  switch (frameStyle ?? "duz") {
    case "keskin":
      return "border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_18px_44px_rgba(255,255,255,0.10)]";
    case "neon":
      return "border-cyan-300/40 shadow-[0_0_34px_rgba(120,220,255,0.34),0_0_74px_rgba(120,220,255,0.18)]";
    default:
      return "border-white/24 shadow-[0_18px_44px_rgba(255,255,255,0.10)]";
  }
}

const DEFAULT_INVENTORY_PROFILES: InventoryProfile[] = [
  { id: "player1", name: "Oyuncu 1", code: "184362", items: [], palette: INVENTORY_PALETTES[0], credits: 0, matchesPlayed: 0, rankPoints: 0, levelPoints: 0, characterLevels: {}, wheelKeys: { ...DEFAULT_WHEEL_KEYS }, surfaceStyle: "gecisli", glowLevel: "orta", profilePattern: "duz", frameStyle: "duz", slogan: "Lobiye yeni indi", favoriteMode: "turnuva", favoriteCharacter: "" },
  { id: "player2", name: "Oyuncu 2", code: "753104", items: [], palette: INVENTORY_PALETTES[1], credits: 0, matchesPlayed: 0, rankPoints: 0, levelPoints: 0, characterLevels: {}, wheelKeys: { ...DEFAULT_WHEEL_KEYS }, surfaceStyle: "gecisli", glowLevel: "orta", profilePattern: "duz", frameStyle: "duz", slogan: "Hazır bekliyorum", favoriteMode: "turnuva", favoriteCharacter: "" },
  { id: "founder", name: "Kurucu", code: "490271", items: [], palette: INVENTORY_PALETTES[3], credits: 120, matchesPlayed: 50, rankPoints: 0, levelPoints: 25, characterLevels: {}, wheelKeys: { acemi: 3, akademi: 2, turnuva: 1 }, surfaceStyle: "gecisli", glowLevel: "yuksek", profilePattern: "omega", frameStyle: "neon", slogan: "Sistemi kuran kişi", favoriteMode: "turnuva", favoriteCharacter: "" },
];

const RESERVED_PROFILE_CODES: Record<string, string> = {
  "YargıçGürkan_62": "627943",
  "YargicGurkan_62": "627943",
  "DenizKovboy_31": "314862",
};

function makeSafeInventoryCode(seed: string, used: Set<string>) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 900000;
  }

  let candidate = String(100000 + hash).slice(0, 6);
  while (used.has(candidate)) {
    candidate = String(((Number(candidate) + 7919) % 900000) + 100000).slice(0, 6);
  }
  return candidate;
}

function normalizeInventoryProfileCodes(profiles: InventoryProfile[]) {
  const used = new Set<string>();

  return profiles.map((profile, index) => {
    const reservedCode = RESERVED_PROFILE_CODES[profile.name];
    const originalCode = /^\d{6}$/.test(profile.code ?? "") ? profile.code : "";
    let nextCode = reservedCode ?? originalCode;

    if (!nextCode || used.has(nextCode)) {
      nextCode = makeSafeInventoryCode(`${profile.name}-${profile.id}-${index}`, used);
    }

    used.add(nextCode);
    return { ...profile, code: nextCode };
  });
}

const INVENTORY_REGISTRY_KEY = "inventoryRegistry_v2";
const INVENTORY_PROFILES_KEY = "inventoryProfiles_v2";
const INVENTORY_SELECTED_KEY = "selectedInventoryProfileId_v2";
const ADMIN_TOOLS_KEY = "adminToolsEnabled_v1";
const ADMIN_TOOLS_PASSWORD = "84868";


function exportProfilePayload(profile: InventoryProfile) {
  const payload = JSON.stringify({
    code: profile.code,
    name: profile.name,
    items: profile.items,
    palette: profile.palette,
    credits: profile.credits,
    matchesPlayed: profile.matchesPlayed,
    rankPoints: profile.rankPoints,
    levelPoints: profile.levelPoints,
    characterLevels: profile.characterLevels,
    wheelKeys: normalizeWheelKeys(profile.wheelKeys),
    profileCharacter: profile.profileCharacter,
    surfaceStyle: profile.surfaceStyle,
    glowLevel: profile.glowLevel,
    profilePattern: profile.profilePattern,
    frameStyle: profile.frameStyle,
    slogan: profile.slogan,
    favoriteMode: profile.favoriteMode,
    favoriteCharacter: profile.favoriteCharacter,
  });

  if (typeof window === "undefined") return payload;

  try {
    return window.btoa(unescape(encodeURIComponent(payload)));
  } catch {
    return payload;
  }
}

function importProfilePayload(
  targetId: InventoryProfile["id"],
  raw: string,
  fallbackCode: string
): InventoryProfile | null {
  try {
    let normalizedRaw = raw.trim();

    try {
      if (typeof window !== "undefined") {
        normalizedRaw = decodeURIComponent(escape(window.atob(normalizedRaw)));
      }
    } catch {}

    const parsed = JSON.parse(normalizedRaw) as {
      code?: string;
      name?: string;
      items?: string[];
      palette?: string;
      credits?: number;
      matchesPlayed?: number;
      rankPoints?: number;
      levelPoints?: number;
      characterLevels?: Record<string, number>;
      wheelKeys?: Partial<Record<WheelType, number>>;
      profileCharacter?: string;
      surfaceStyle?: "karanlik" | "aydinlik" | "gecisli";
      glowLevel?: "dusuk" | "orta" | "yuksek";
      profilePattern?: "duz" | "ender" | "destansi" | "efsanevi" | "kristalize" | "omega";
      frameStyle?: "duz" | "keskin" | "neon";
      slogan?: string;
      favoriteMode?: string;
      favoriteCharacter?: string;
    };

    if (!parsed || !Array.isArray(parsed.items)) return null;

    const allowedNames = new Set(CHARACTER_DATABASE.map((char) => char.name));
    const uniqueItems = Array.from(new Set(parsed.items)).filter((name) => allowedNames.has(name));

    return {
      id: targetId,
      name: typeof parsed.name === "string" && parsed.name.trim().length > 0
        ? parsed.name.slice(0, 18)
        : targetId === "founder"
        ? "Kurucu"
        : "Oyuncu",
      code:
        typeof parsed.code === "string" && /^\d{6}$/.test(parsed.code)
          ? parsed.code
          : fallbackCode,
      items: uniqueItems,
      palette:
        typeof parsed.palette === "string" && parsed.palette.length > 0
          ? parsed.palette
          : INVENTORY_PALETTES[0],
      credits: typeof parsed.credits === "number" && parsed.credits >= 0 ? Math.floor(parsed.credits) : 0,
      matchesPlayed:
        typeof parsed.matchesPlayed === "number" && parsed.matchesPlayed >= 0
          ? Math.floor(parsed.matchesPlayed)
          : 0,
      rankPoints:
        typeof parsed.rankPoints === "number" && parsed.rankPoints >= 0
          ? Math.floor(parsed.rankPoints)
          : 0,
      levelPoints:
        typeof parsed.levelPoints === "number" && parsed.levelPoints >= 0
          ? Math.floor(parsed.levelPoints)
          : 0,
      characterLevels:
        parsed.characterLevels && typeof parsed.characterLevels === "object"
          ? Object.fromEntries(
              Object.entries(parsed.characterLevels)
                .filter(([name]) => uniqueItems.includes(name))
                .map(([name, level]) => [name, clampCharacterLevel(Number(level))])
            )
          : {},
      wheelKeys: normalizeWheelKeys(parsed.wheelKeys),
      profileCharacter:
        typeof parsed.profileCharacter === "string" && allowedNames.has(parsed.profileCharacter)
          ? parsed.profileCharacter
          : uniqueItems[0],
      surfaceStyle:
        parsed.surfaceStyle === "karanlik" || parsed.surfaceStyle === "aydinlik" || parsed.surfaceStyle === "gecisli"
          ? parsed.surfaceStyle
          : "gecisli",
      glowLevel:
        parsed.glowLevel === "dusuk" || parsed.glowLevel === "orta" || parsed.glowLevel === "yuksek"
          ? parsed.glowLevel
          : "orta",
      profilePattern:
        parsed.profilePattern === "duz" ||
        parsed.profilePattern === "ender" ||
        parsed.profilePattern === "destansi" ||
        parsed.profilePattern === "efsanevi" ||
        parsed.profilePattern === "kristalize" ||
        parsed.profilePattern === "omega"
          ? parsed.profilePattern
          : "duz",
      frameStyle:
        parsed.frameStyle === "duz" || parsed.frameStyle === "keskin" || parsed.frameStyle === "neon"
          ? parsed.frameStyle
          : "duz",
      slogan:
        typeof parsed.slogan === "string" && parsed.slogan.trim().length > 0
          ? parsed.slogan.slice(0, 36)
          : "",
      favoriteMode:
        typeof parsed.favoriteMode === "string" && parsed.favoriteMode.trim().length > 0
          ? parsed.favoriteMode
          : "turnuva",
      favoriteCharacter:
        typeof parsed.favoriteCharacter === "string" && allowedNames.has(parsed.favoriteCharacter)
          ? parsed.favoriteCharacter
          : uniqueItems[0] ?? "",
    };
  } catch {
    return null;
  }
}


function getCharacterPanelBg(char: { rarity: RarityName; side?: Side | null }) {
  if (char.rarity === "Kristalize" && char.side === "Kötü") {
    return "from-red-500/70 via-rose-600/48 to-black";
  }
  if (char.rarity === "Kristalize" && char.side === "İyi") {
    return "from-cyan-400/44 via-blue-500/34 to-indigo-900/30";
  }
  return rarityBg[char.rarity];
}


const CHARACTER_POOLS: Record<RarityName, { name: string; weight: number }[]> = {
  Omega: [{ name: "Omega Dareth", weight: 1 }],
  Kristalize: [
    { name: "Genç Garmadon", weight: 1.08 },
    { name: "Genç Wu", weight: 1.04 },
    { name: "Darth Vader", weight: 1.0 },
    { name: "Gurkan", weight: 1.06 },
  ],
  Efsanevi: [
    { name: "Vengestone Askeri", weight: 1.0 },
    { name: "Ateş Mech", weight: 1.02 },
    { name: "Steve", weight: 1.02 },
    { name: "Gölge Cinder", weight: 1.02 },
  ],
  Destansı: [
    { name: "Creeper", weight: 1.0 },
    { name: "Anacondrai", weight: 1.01 },
    { name: "Ragrast", weight: 1.01 },
    { name: "Uykucu Gary", weight: 1.01 },
    { name: "Luna", weight: 1.03 },
  ],
  Ender: [
    { name: "Jett", weight: 1.0 },
    { name: "Mia", weight: 1.0 },
    { name: "Robo Raptor", weight: 1.0 },
    { name: "Dedektif Clara", weight: 1.0 },
    { name: "Dinamit Kız", weight: 1.0 },
    { name: "Ateş Frank", weight: 1.0 },
    { name: "Kaya Yaratığı", weight: 1.0 },
  ],
  Sıradan: [
    { name: "Guby", weight: 1.0 },
    { name: "Toxe", weight: 1.0 },
    { name: "Clone Trooper", weight: 1.0 },
    { name: "Kırmızı Jhon", weight: 1.0 },
    { name: "Dracula", weight: 1.0 },
    { name: "Tadilatçı", weight: 1.0 },
  ],
};

const KRISTALIZE_SIDE_MAP: Record<Side, string[]> = {
  İyi: ["Genç Wu", "Gurkan"],
  Kötü: ["Genç Garmadon", "Darth Vader"],
};

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}


function getModePlayerCountOptions(modeId: string) {
  const options: Record<string, number[]> = {
    turnuva: [16],
    kale: [8],
    bayrak: [8],
    gemi: [4],
    araba: [10, 4],
    duello: [4],
  };

  return options[modeId] ?? [4];
}


function getLobbyTier(rarity: RarityName) {
  if (rarity === "Sıradan" || rarity === "Ender") return "alt";
  if (rarity === "Destansı" || rarity === "Efsanevi") return "orta";
  return "ust";
}

function canShareLobby(a: RarityName, b: RarityName) {
  const aTier = getLobbyTier(a);
  const bTier = getLobbyTier(b);

  if (aTier === bTier) return true;

  const pairs = new Set([
    "alt-orta",
    "orta-alt",
    "orta-ust",
    "ust-orta",
  ]);

  return pairs.has(`${aTier}-${bTier}`);
}

function generateBalancedRoster(playerCount: number) {
  const rarityBands: RarityName[][] = [
    ["Sıradan", "Ender"],
    ["Ender", "Destansı"],
    ["Destansı", "Efsanevi"],
    ["Efsanevi", "Kristalize"],
  ];

  const chosenBand = randomFrom(rarityBands);
  const allowed = new Set(chosenBand);
  const rolesCycle = ["Saldırı", "Destek", "Tank", "Kontrol", "Suikastçı", "Savunma"] as RoleType[];
  const used = new Set<string>();
  const roster: CharacterInfo[] = [];

  for (let i = 0; i < playerCount; i++) {
    const preferredRole = rolesCycle[i % rolesCycle.length];

    let pool = CHARACTER_DATABASE.filter(
      (char) =>
        allowed.has(char.rarity) &&
        char.role === preferredRole &&
        !used.has(char.name)
    );

    if (pool.length === 0) {
      pool = CHARACTER_DATABASE.filter(
        (char) => allowed.has(char.rarity) && !used.has(char.name)
      );
    }

    if (pool.length === 0) {
      pool = CHARACTER_DATABASE.filter((char) => !used.has(char.name));
    }

    const picked = randomFrom(pool.length > 0 ? pool : CHARACTER_DATABASE);
    used.add(picked.name);
    roster.push(picked);
  }

  return roster;
}

function getAdjustedRarities(
  history: ResultItem[],
  noHighTierCount: number,
  wheel: WheelType
): RarityConfig[] {
  const wheelConfig = WHEEL_CONFIGS.find((item) => item.id === wheel) ?? WHEEL_CONFIGS[1];
  const rarities = RARITY_ORDER.map((name) => ({
    name,
    weight: wheelConfig.weights[name],
  }));

  if (noHighTierCount >= 8) {
    for (const r of rarities) {
      if (wheel === "acemi") {
        if (r.name === "Ender") r.weight += 2;
        if (r.name === "Destansı") r.weight += 1.5;
        if (r.name === "Sıradan") r.weight = Math.max(35, r.weight - 4);
      } else if (wheel === "akademi") {
        if (r.name === "Ender") r.weight += 1.8;
        if (r.name === "Destansı") r.weight += 2.2;
        if (r.name === "Efsanevi") r.weight += 2.4;
        if (r.name === "Kristalize") r.weight += 1.8;
        if (r.name === "Omega") r.weight += 0.35;
        if (r.name === "Sıradan") r.weight = Math.max(18, r.weight - 7);
      } else if (wheel === "turnuva") {
        if (r.name === "Destansı") r.weight += 2.5;
        if (r.name === "Efsanevi") r.weight += 3;
        if (r.name === "Kristalize") r.weight += 2.5;
        if (r.name === "Omega") r.weight += 0.8;
        if (r.name === "Sıradan") r.weight = Math.max(8, r.weight - 5);
      }
    }
  }

  const last = history[0];
  if (last) {
    const same = rarities.find((r) => r.name === last.rarity);
    if (same) same.weight *= 0.72;
  }

  const filtered = wheelConfig.allowedRarities
    ? rarities.filter((r) => wheelConfig.allowedRarities!.includes(r.name))
    : rarities;

  return filtered.filter((item) => item.weight > 0);
}

function pickRarity(history: ResultItem[], noHighTierCount: number, wheel: WheelType): RarityName {
  return weightedPick(getAdjustedRarities(history, noHighTierCount, wheel)).name as RarityName;
}

function adjustCharacters(pool: { name: string; weight: number }[], lastCharacter: string | null) {
  return pool.map((c) => ({
    ...c,
    weight: c.name === lastCharacter ? c.weight * 0.18 : c.weight,
  }));
}

function getCharacterByName(name: string) {
  return CHARACTER_DATABASE.find((c) => c.name === name);
}


function getUnownedCharacterNamesForRarity(
  rarity: RarityName,
  ownedNames: string[],
  side?: Side | null
) {
  const owned = new Set(ownedNames);

  if (rarity === "Kristalize") {
    const allowedSides: Side[] = side ? [side] : ["İyi", "Kötü"];
    const allowedNames = new Set(allowedSides.flatMap((item) => KRISTALIZE_SIDE_MAP[item]));
    return CHARACTER_POOLS.Kristalize
      .map((item) => item.name)
      .filter((name) => allowedNames.has(name) && !owned.has(name));
  }

  return CHARACTER_POOLS[rarity]
    .map((item) => item.name)
    .filter((name) => !owned.has(name));
}

function hasAnyUnownedCharacter(ownedNames: string[]) {
  const owned = new Set(ownedNames);
  return CHARACTER_DATABASE.some((character) => !owned.has(character.name));
}

function pickAvailableRarityForOwned(
  preferredRarity: RarityName,
  ownedNames: string[],
  weightedRarities: { name: RarityName; weight: number }[],
  side?: Side | null
): RarityName | null {
  if (getUnownedCharacterNamesForRarity(preferredRarity, ownedNames, side).length > 0) {
    return preferredRarity;
  }

  const available = weightedRarities.filter((item) => getUnownedCharacterNamesForRarity(item.name, ownedNames).length > 0);
  if (available.length === 0) return null;

  return weightedPick(available).name as RarityName;
}


function findBalancedOpponent(
  playerChar: CharacterInfo,
  options?: {
    playerCount?: number;
    preferredRole?: RoleType | "Aynı Rol" | "Farketmez";
    preferredRange?: RangeType | "Aynı Menzil" | "Farketmez";
  }
) {
  const playerRank = rarityRank[playerChar.rarity];
  const preferredRole = options?.preferredRole ?? "Aynı Rol";
  const preferredRange = options?.preferredRange ?? "Aynı Menzil";

  const matchesRole = (char: CharacterInfo) => {
    if (preferredRole === "Farketmez") return true;
    if (preferredRole === "Aynı Rol") return char.role === playerChar.role;
    return char.role === preferredRole;
  };

  const matchesRange = (char: CharacterInfo) => {
    if (preferredRange === "Farketmez") return true;
    if (preferredRange === "Aynı Menzil") return char.range === playerChar.range;
    return char.range === preferredRange;
  };

  const primaryPool = CHARACTER_DATABASE.filter((char) => {
    if (char.name === playerChar.name) return false;
    const rank = rarityRank[char.rarity];
    return (
      Math.abs(rank - playerRank) <= 1 &&
      canShareLobby(playerChar.rarity, char.rarity) &&
      matchesRole(char) &&
      matchesRange(char)
    );
  });

  if (primaryPool.length > 0) {
    return randomFrom(primaryPool);
  }

  const fallbackPool = CHARACTER_DATABASE.filter((char) => {
    if (char.name === playerChar.name) return false;
    return (
      Math.abs(rarityRank[char.rarity] - playerRank) <= 1 &&
      canShareLobby(playerChar.rarity, char.rarity)
    );
  });

  if (fallbackPool.length > 0) {
    return randomFrom(fallbackPool);
  }

  const strictTierPool = CHARACTER_DATABASE.filter(
    (char) => char.name !== playerChar.name && getLobbyTier(char.rarity) === getLobbyTier(playerChar.rarity)
  );

  if (strictTierPool.length > 0) {
    return randomFrom(strictTierPool);
  }

  return randomFrom(CHARACTER_DATABASE.filter((char) => char.name !== playerChar.name));
}

function pickCharacter(
  rarity: RarityName,
  history: ResultItem[],
  side?: Side | null,
  blockedNames: string[] = []
) {
  const lastCharacter = history[0]?.character ?? null;
  const blocked = new Set(blockedNames);

  if (rarity === "Kristalize") {
    const preferredSide = side ?? (Math.random() < 0.5 ? "İyi" : "Kötü");
    const sidesToTry: Side[] = side ? [side, side === "İyi" ? "Kötü" : "İyi"] : [preferredSide, preferredSide === "İyi" ? "Kötü" : "İyi"];

    for (const chosenSide of sidesToTry) {
      const allowed = new Set(KRISTALIZE_SIDE_MAP[chosenSide]);
      const pool = CHARACTER_POOLS.Kristalize.filter((item) => allowed.has(item.name) && !blocked.has(item.name));
      if (pool.length > 0) {
        return {
          character: weightedPick(adjustCharacters(pool, lastCharacter)).name,
          side: chosenSide,
        };
      }
    }
  } else {
    const pool = CHARACTER_POOLS[rarity].filter((item) => !blocked.has(item.name));
    if (pool.length > 0) {
      return {
        character: weightedPick(adjustCharacters(pool, lastCharacter)).name,
        side: null,
      };
    }
  }

  const fallbackPool = CHARACTER_DATABASE
    .filter((character) => !blocked.has(character.name))
    .map((character) => ({ name: character.name, weight: Math.max(1, rarityRank[character.rarity] + 1) }));

  const fallback = fallbackPool.length > 0 ? weightedPick(adjustCharacters(fallbackPool, lastCharacter)).name : CHARACTER_DATABASE[0].name;
  const found = getCharacterByName(fallback);

  return {
    character: fallback,
    side: found?.side ?? null,
  };
}

function weightedRandomRarityCard(): ReelCard {
  const rarity = weightedPick(BASE_RARITIES).name;
  return { label: rarity, rarity };
}

function randomCharacterNameFromRarity(rarity: RarityName, side?: Side | null) {
  if (rarity === "Kristalize") {
    const chosenSide = side ?? "İyi";
    return randomFrom(KRISTALIZE_SIDE_MAP[chosenSide]);
  }
  return randomFrom(CHARACTER_POOLS[rarity].map((c) => c.name));
}

function buildRarityTrack(target: RarityName, total = 32, stopIndex = 24) {
  const cards: ReelCard[] = Array.from({ length: total }, () => weightedRandomRarityCard());
  cards[stopIndex] = { label: target, rarity: target };
  return { cards, stopIndex };
}

function buildCharacterTrack(
  rarity: RarityName,
  target: string,
  side?: Side | null,
  total = 32,
  stopIndex = 24
) {
  const accent = rarity === "Kristalize" ? (side === "İyi" ? "crystal-good" : "crystal-bad") : undefined;
  const cards: ReelCard[] = Array.from({ length: total }, () => ({
    label: randomCharacterNameFromRarity(rarity, side),
    rarity,
    accent,
  }));

  cards[stopIndex] = { label: target, rarity, accent };
  return { cards, stopIndex };
}

function makePlaceholderTrack(total = 32, stopIndex = 24) {
  const cards: ReelCard[] = Array.from({ length: total }, (_, i) => {
    const rarity = RARITY_ORDER[i % RARITY_ORDER.length];
    return { label: rarity, rarity };
  });
  cards[stopIndex] = { label: "Destansı", rarity: "Destansı" };
  return { cards, stopIndex };
}

function inferSummary(char: CharacterInfo) {
  const sideText = char.side ? ` • ${char.side}` : "";
  const ultiText = char.ultimate2 ? "2 ulti" : "1 ulti";
  return `${char.rarity}${sideText} • ${char.range} menzil • ${ultiText}`;
}

function SmallCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-white/20 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}


function TabScene({
  sceneKey,
  children,
}: {
  sceneKey: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0, y: 18, scale: 0.988, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, scale: 0.992, filter: "blur(6px)" }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function TechCorners() {
  return (
    <>
      <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-white/18" />
      <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-white/18" />
      <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-white/18" />
      <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-white/18" />
    </>
  );
}

function CutPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/20 bg-black/35 ${className}`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
      }}
    >
      <TechCorners />
      {children}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  onHover,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  onHover?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`flex items-center gap-2 border px-4 py-2 text-sm transition ${
        active
          ? "border-white/30 bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.08)]"
          : "border-white/10 bg-black/35 text-white/65 hover:border-white/20 hover:bg-white/8 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function NeutralLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <CircleDot
        width={size}
        height={size}
        strokeWidth={2.2}
        className="text-white/65 drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]"
      />
      <CircleDot
        width={Math.max(10, Math.floor(size * 0.42))}
        height={Math.max(10, Math.floor(size * 0.42))}
        className="absolute text-white/70"
      />
    </div>
  );
}

function CrestLogo({ size = 28, className = "text-violet-300" }: { size?: number; className?: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <Shield
        width={size}
        height={size}
        strokeWidth={2.2}
        className={`${className} drop-shadow-[0_0_12px_rgba(180,120,255,0.2)]`}
      />
      <Star
        width={Math.max(12, Math.floor(size * 0.48))}
        height={Math.max(12, Math.floor(size * 0.48))}
        className="absolute text-violet-200 fill-violet-200"
      />
    </div>
  );
}

function CrystalLogo({
  side,
  size = 28,
}: {
  side?: Side | null;
  size?: number;
}) {
  const color =
    side === "İyi"
      ? "text-cyan-200"
      : side === "Kötü"
      ? "text-red-200"
      : "text-fuchsia-200";

  const mini =
    side === "İyi" ? (
      <ShieldCheck width={14} height={14} className="absolute text-cyan-100" />
    ) : side === "Kötü" ? (
      <Flame width={14} height={14} className="absolute text-red-100" />
    ) : (
      <Sparkles width={14} height={14} className="absolute text-fuchsia-100" />
    );

  return (
    <div className="relative flex items-center justify-center">
      <Gem
        width={size}
        height={size}
        strokeWidth={2.2}
        className={`${color} drop-shadow-[0_0_16px_rgba(255,150,255,0.28)]`}
      />
      <Gem
        width={Math.max(12, Math.floor(size * 0.52))}
        height={Math.max(12, Math.floor(size * 0.52))}
        className="absolute text-white/60"
      />
      {mini}
    </div>
  );
}

function RarityLogo({
  rarity,
  side,
  size = 28,
}: {
  rarity?: RarityName;
  side?: Side | null;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    strokeWidth: 2.2,
    className: "drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]",
  };

  if (rarity === "Sıradan") {
    return (
      <div className="relative flex items-center justify-center">
        <Shield {...common} className={`${common.className} text-zinc-300`} />
        <CircleDot width={12} height={12} className="absolute text-zinc-200" />
      </div>
    );
  }

  if (rarity === "Ender") {
    return (
      <div className="relative flex items-center justify-center">
        <Shield {...common} className={`${common.className} text-lime-300`} />
        <Zap width={14} height={14} className="absolute text-lime-200" />
      </div>
    );
  }

  if (rarity === "Destansı") {
    return <CrestLogo size={size} />;
  }

  if (rarity === "Efsanevi") {
    return (
      <div className="relative flex items-center justify-center">
        <Crown {...common} className={`${common.className} text-amber-300`} />
        <Star width={14} height={14} className="absolute top-[6px] text-amber-200 fill-amber-200" />
      </div>
    );
  }

  if (rarity === "Kristalize") {
    return <CrystalLogo side={side} size={size} />;
  }

  if (rarity === "Omega") {
    return (
      <div className="relative flex items-center justify-center">
        <CircleDot
          {...common}
          className={`${common.className} text-fuchsia-200 drop-shadow-[0_0_16px_rgba(255,220,255,0.35)]`}
        />
        <Gem width={15} height={15} className="absolute text-orange-200" />
        <Star width={11} height={11} className="absolute -top-[1px] right-[1px] text-white fill-white/80" />
      </div>
    );
  }

  return <NeutralLogo size={size} />;
}


function useUiSfx(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!enabled || typeof window === "undefined") return null;
    const Ctx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    return ctxRef.current;
  };

  const ping = (freq = 820, gainValue = 0.012, duration = 0.08, type: OscillatorType = "sine") => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.min(gainValue * 3.2, 0.09), now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  };

  return {
    tab() {
      ping(760, 0.01, 0.07, "triangle");
      ping(980, 0.006, 0.08, "sine");
    },
    hoverSoft() {
      ping(900, 0.008, 0.05, "sine");
    },
    hoverMap() {
      ping(640, 0.01, 0.06, "triangle");
    },
    shopBuy() {
      ping(420, 0.012, 0.08, "triangle");
      ping(620, 0.009, 0.12, "sine");
      ping(880, 0.006, 0.16, "sine");
    },
    fail() {
      ping(240, 0.012, 0.1, "square");
    },
    success() {
      ping(620, 0.014, 0.07, "triangle");
      ping(920, 0.01, 0.11, "sine");
      ping(1240, 0.007, 0.15, "triangle");
    },
    crystalTap(stage: number) {
      ping(920 + stage * 70, 0.014, 0.07, "triangle");
      ping(1260 + stage * 80, 0.008, 0.09, "sine");
      ping(1660 + stage * 50, 0.006, 0.12, "triangle");
    },
    crystalBreak() {
      ping(360, 0.015, 0.12, "triangle");
      ping(720, 0.012, 0.16, "sine");
      ping(1180, 0.01, 0.22, "triangle");
      ping(1640, 0.008, 0.28, "sine");
    },
  };
}

function useEpicAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeRef = useRef<Array<{ osc: OscillatorNode; gain: GainNode }>>([]);

  const getCtx = () => {
    if (!enabled || typeof window === "undefined") return null;
    const Ctx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    return ctxRef.current;
  };

  const stopAll = () => {
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    activeRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.stop(now + 0.1);
      } catch {}
    });
    activeRef.current = [];
  };

  const tone = (
    freq: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    delay = 0,
    attack = 0.02,
    release = 0.14
  ) => {
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    activeRef.current.push({ osc, gain });

    const now = ctx.currentTime + delay;
    const end = now + duration;
    const safeReleaseStart = Math.max(now + attack + 0.02, end - release);

    gain.gain.setValueAtTime(0.0001, now);
    const boostedGain = Math.min(gainValue * 2.4, 0.18);
    gain.gain.exponentialRampToValueAtTime(boostedGain, now + attack);
    gain.gain.setValueAtTime(boostedGain, safeReleaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.start(now);
    osc.stop(end + 0.02);

    osc.onended = () => {
      activeRef.current = activeRef.current.filter((n) => n.osc !== osc);
    };
  };

  const chord = (
    freqs: number[],
    duration: number,
    type: OscillatorType,
    gainValue: number,
    delay = 0,
    attack = 0.02,
    release = 0.16
  ) => {
    freqs.forEach((f) => tone(f, duration, type, gainValue, delay, attack, release));
  };

  const bellRun = (freqs: number[], start = 0, step = 0.06, gainValue = 0.01) => {
    freqs.forEach((f, i) => {
      tone(f, 0.42, "sine", gainValue, start + i * step, 0.01, 0.24);
      tone(f * 2, 0.24, "triangle", gainValue * 0.4, start + i * step + 0.02, 0.01, 0.14);
    });
  };

  const airyLift = (root: number, start = 0, power = 1) => {
    tone(root, 0.58, "sine", 0.011 * power, start, 0.03, 0.24);
    tone(root * 1.5, 0.74, "triangle", 0.008 * power, start + 0.08, 0.03, 0.28);
    tone(root * 2, 0.92, "sine", 0.006 * power, start + 0.18, 0.03, 0.32);
  };

  const darkPulse = (root: number, start = 0, power = 1) => {
    tone(root, 0.34, "sawtooth", 0.008 * power, start, 0.02, 0.18);
    tone(root * 0.5, 0.5, "triangle", 0.006 * power, start + 0.05, 0.03, 0.22);
    tone(root * 1.5, 0.4, "square", 0.004 * power, start + 0.11, 0.02, 0.16);
  };

  const dreadRise = (root: number, start = 0, power = 1) => {
    tone(root, 0.5, "triangle", 0.007 * power, start, 0.03, 0.22);
    tone(root * 1.06, 0.62, "sawtooth", 0.006 * power, start + 0.08, 0.03, 0.24);
    tone(root * 1.26, 0.8, "sine", 0.004 * power, start + 0.16, 0.03, 0.3);
  };

  const holyRise = (root: number, start = 0, power = 1) => {
    chord([root, root * 1.25], 0.42, "sine", 0.01 * power, start, 0.03, 0.18);
    tone(root * 2, 0.66, "triangle", 0.007 * power, start + 0.12, 0.03, 0.26);
    tone(root * 2.5, 0.82, "sine", 0.005 * power, start + 0.22, 0.03, 0.32);
  };

  return {
    stopAll,
    spinTick() {
      tone(440, 0.04, "triangle", 0.01, 0, 0.01, 0.03);
      tone(660, 0.035, "sine", 0.006, 0.01, 0.01, 0.03);
    },
    rarityHit(rarity: RarityName) {
      if (rarity === "Sıradan") {
        chord([262, 330], 0.22, "triangle", 0.012, 0, 0.02, 0.12);
        return;
      }
      if (rarity === "Ender") {
        chord([294, 392, 494], 0.3, "sine", 0.013, 0, 0.02, 0.16);
        bellRun([494, 588], 0.06, 0.08, 0.008);
        return;
      }
      if (rarity === "Destansı") {
        chord([330, 440, 554], 0.42, "sine", 0.014, 0, 0.03, 0.18);
        bellRun([554, 659, 880], 0.08, 0.07, 0.0085);
        airyLift(330, 0.1, 1.0);
        return;
      }
      if (rarity === "Efsanevi") {
        chord([349, 466, 698], 0.56, "sine", 0.015, 0, 0.03, 0.22);
        bellRun([698, 880, 1047], 0.08, 0.065, 0.009);
        airyLift(349, 0.12, 1.1);
        return;
      }
      if (rarity === "Kristalize") {
        chord([392, 523, 784], 0.68, "sine", 0.016, 0, 0.03, 0.24);
        bellRun([784, 988, 1175, 1568], 0.08, 0.06, 0.0095);
        holyRise(392, 0.12, 1.2);
        return;
      }
      if (rarity === "Omega") {
        chord([440, 587, 880], 0.82, "sine", 0.017, 0, 0.04, 0.28);
        bellRun([880, 1175, 1568, 1760], 0.1, 0.06, 0.01);
        holyRise(440, 0.16, 1.3);
      }
    },
    finalReveal(rarity: RarityName) {
      if (rarity === "Sıradan") {
        chord([262, 330, 392], 0.3, "triangle", 0.012, 0, 0.02, 0.16);
        return;
      }
      if (rarity === "Ender") {
        chord([294, 392, 494], 0.42, "sine", 0.013, 0, 0.03, 0.18);
        bellRun([494, 588, 784], 0.08, 0.07, 0.008);
        return;
      }
      if (rarity === "Destansı") {
        chord([330, 440, 554], 0.56, "sine", 0.014, 0, 0.03, 0.22);
        bellRun([554, 659, 880, 988], 0.1, 0.065, 0.0085);
        airyLift(330, 0.16, 1.1);
        return;
      }
      if (rarity === "Efsanevi") {
        chord([349, 466, 698], 0.7, "sine", 0.015, 0, 0.04, 0.26);
        bellRun([698, 880, 1047, 1397], 0.12, 0.06, 0.009);
        airyLift(349, 0.18, 1.2);
        return;
      }
      if (rarity === "Kristalize") {
        chord([392, 523, 784], 0.86, "sine", 0.016, 0, 0.04, 0.3);
        bellRun([784, 988, 1175, 1568, 1760], 0.12, 0.055, 0.0095);
        holyRise(392, 0.18, 1.3);
        return;
      }
      if (rarity === "Omega") {
        chord([440, 587, 880], 1.0, "sine", 0.017, 0, 0.05, 0.34);
        bellRun([880, 1175, 1568, 1760, 2093], 0.14, 0.055, 0.01);
        holyRise(440, 0.2, 1.4);
      }
    },
    crystalChoiceHover(side: Side) {
      if (side === "İyi") {
        chord([523, 659], 0.2, "sine", 0.009, 0, 0.02, 0.12);
        tone(988, 0.32, "triangle", 0.006, 0.07, 0.02, 0.14);
        return;
      }
      chord([247, 311], 0.22, "triangle", 0.009, 0, 0.02, 0.12);
      tone(466, 0.34, "sine", 0.006, 0.07, 0.02, 0.14);
      tone(196, 0.42, "triangle", 0.0035, 0.1, 0.03, 0.18);
    },
    crystalSideReveal(side: Side) {
      if (side === "İyi") {
        chord([392, 523, 659], 0.72, "sine", 0.015, 0, 0.04, 0.28);
        bellRun([659, 784, 988, 1319], 0.1, 0.06, 0.0085);
        holyRise(392, 0.14, 1.15);
        return;
      }
      chord([220, 277, 392], 0.76, "triangle", 0.014, 0, 0.04, 0.3);
      darkPulse(220, 0.05, 1.25);
      darkPulse(196, 0.18, 1.1);
      dreadRise(220, 0.1, 1.15);
      tone(523, 0.44, "sawtooth", 0.0045, 0.22, 0.03, 0.18);
    },
  };
}

function SlotReel({
  cards = [],
  stopIndex = 24,
  spinKey,
  duration = 4.3,
  title,
  status,
  revealColors = false,
  mode,
  wheel = "akademi",
}: {
  cards?: ReelCard[];
  stopIndex?: number;
  spinKey: number;
  duration?: number;
  title: string;
  status: string;
  revealColors?: boolean;
  mode: ReelMode;
  wheel?: WheelType;
}) {
  const wheelTheme = getWheelTheme(wheel);

  return (
    <div className={`relative mb-5 overflow-hidden border ${wheelTheme.frame}`} style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}>
      <TechCorners />
      <div className={`absolute inset-0 bg-gradient-to-br ${wheelTheme.accent}`} />
      <div className={`absolute inset-0 ${wheelTheme.halo}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent" />
      <div className="relative p-4">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/45">
        <span>{title}</span>
        <span>{status}</span>
      </div>

      <div className="relative h-[140px] overflow-hidden border border-white/20 bg-white/5">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_15px_white]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#06070b] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#06070b] to-transparent" />

        <motion.div
          key={spinKey}
          initial={{ x: -(CARD_W / 2) }}
          animate={{ x: -(stopIndex * STEP + CARD_W / 2) }}
          transition={{ duration, ease: [0.08, 0.82, 0.17, 1] }}
          className="absolute left-1/2 top-1/2 flex -translate-y-1/2 gap-3 will-change-transform"
          style={{ width: "max-content", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
        >
          {cards.map((item, idx) => {
            let bg = "from-white/8 to-white/6";
            let softCap = "bg-transparent";

            if (revealColors && item.rarity) {
              bg = rarityBg[item.rarity];
              if (item.accent === "crystal-good") bg = "from-cyan-400/18 via-sky-400/10 to-indigo-900/16";
              if (item.accent === "crystal-bad") bg = "from-rose-400/18 via-fuchsia-400/10 to-indigo-900/16";

              if (item.rarity === "Sıradan") softCap = "bg-zinc-300/8";
              if (item.rarity === "Ender") softCap = "bg-lime-200/10";
              if (item.rarity === "Destansı") softCap = "bg-violet-300/10";
              if (item.rarity === "Efsanevi") softCap = "bg-amber-300/12";
              if (item.rarity === "Kristalize") softCap = "bg-fuchsia-300/12";
              if (item.rarity === "Omega") softCap = "bg-white/10";
              if (item.accent === "crystal-good") softCap = "bg-cyan-300/12";
              if (item.accent === "crystal-bad") softCap = "bg-rose-300/12";
            }

            const side =
              item.accent === "crystal-good"
                ? "İyi"
                : item.accent === "crystal-bad"
                ? "Kötü"
                : null;

            const showRealLogo = mode === "rarity" || revealColors;

            return (
              <div
                key={`${item.label}-${idx}`}
                className={`relative flex min-w-[170px] flex-col items-center justify-center overflow-hidden border border-white/20 bg-gradient-to-b ${bg} px-4 py-5 text-center shadow-lg`}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <TechCorners />
                <div className={`absolute inset-0 ${softCap}`} />

                <div className="relative z-10 mb-3 flex h-12 w-12 items-center justify-center border border-white/20 bg-black/20">
                  {showRealLogo ? (
                    <RarityLogo rarity={item.rarity} side={side} size={24} />
                  ) : (
                    <NeutralLogo size={24} />
                  )}
                </div>

                <div className="relative z-10 text-sm font-semibold text-white">{item.label}</div>
                {item.rarity && (
                  <div className={`relative z-10 mt-2 text-[11px] uppercase tracking-[0.18em] ${raritySoftText[item.rarity]}`}>
                    {item.rarity}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div></div>
  );
}

function SideSelection({
  onSelect,
  onPreview,
}: {
  onSelect: (side: Side) => void;
  onPreview: (side: Side) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative mb-5 overflow-hidden border border-white/20 bg-gradient-to-br from-fuchsia-500/10 via-cyan-500/5 to-indigo-900/20 p-5"
      style={{
        clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
      }}
    >
      <TechCorners />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,120,230,0.12),transparent_44%),radial-gradient(circle_at_30%_20%,rgba(110,220,255,0.12),transparent_24%),radial-gradient(circle_at_75%_22%,rgba(255,255,255,0.06),transparent_16%)]" />
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 border border-white/20 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
          <Sparkles className="h-3.5 w-3.5" />
          Kristalize Seçimi
        </div>
        <div className="mt-3 text-2xl font-black text-white">Tarafını seç</div>
        <div className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
          İyi taraf daha huzurlu, kutsal ve koruyucu his verir. Kötü taraf ise baskıcı, karanlık ve tehditkâr enerji taşır.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onMouseEnter={() => onPreview("İyi")}
          onFocus={() => onPreview("İyi")}
          onClick={() => onSelect("İyi")}
          className="group relative overflow-hidden border border-cyan-300/15 bg-gradient-to-b from-cyan-300/16 via-sky-400/10 to-indigo-900/18 p-5 text-left transition hover:border-cyan-200/30"
          style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(140,180,255,0.16),transparent_30%)] opacity-90 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-white/5" />
          <div className="relative z-10 mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-cyan-200/25 bg-black/25 shadow-[0_0_18px_rgba(120,240,255,0.12)]">
              <CrystalLogo side="İyi" size={24} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">İyi</div>
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Koruyucu taraf</div>
            </div>
          </div>
          <div className="relative z-10 space-y-2 text-sm leading-6 text-white/78">
            <div>• Arınmış enerji</div>
            <div>• Destek ve savunma hissi</div>
            <div>• Daha huzurlu, kutsal ve temiz aura</div>
          </div>
        </button>

        <button
          onMouseEnter={() => onPreview("Kötü")}
          onFocus={() => onPreview("Kötü")}
          onClick={() => onSelect("Kötü")}
          className="group relative overflow-hidden border border-rose-300/15 bg-gradient-to-b from-red-700/18 via-rose-700/12 to-black p-5 text-left transition hover:border-rose-200/30"
          style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,130,130,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(140,0,50,0.22),transparent_34%)] opacity-90 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-fuchsia-950/22 to-red-200/5" />
          <div className="pointer-events-none absolute inset-y-0 right-8 w-px bg-rose-200/12 blur-[1px]" />
          <div className="relative z-10 mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-rose-200/25 bg-black/30 shadow-[0_0_18px_rgba(255,110,140,0.14)]">
              <CrystalLogo side="Kötü" size={24} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">Kötü</div>
              <div className="text-xs uppercase tracking-[0.18em] text-red-100/70">Karanlık taraf</div>
            </div>
          </div>
          <div className="relative z-10 space-y-2 text-sm leading-6 text-white/78">
            <div>• Baskı ve korku enerjisi</div>
            <div>• Saldırı ve tehdit hissi</div>
            <div>• Daha karanlık, ürkütücü ve ağır aura</div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/20 bg-white/[0.04] p-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function AbilityBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="border border-white/20 bg-white/[0.04] p-3">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="text-sm leading-6 text-white/82">{text}</div>
    </div>
  );
}

function CharacterCard({ char, viewMode = "smooth", displayLevel }: { char: CharacterInfo; viewMode?: "smooth" | "keskin"; displayLevel?: number }) {
  const levelStats = getCharacterLevelStats(char, displayLevel ?? char.level);

  return (
    <div
      className={`group relative overflow-hidden border bg-black/30 transition-transform duration-300 hover:-translate-y-1 ${
        viewMode === "smooth"
          ? `border-white/18 shadow-[0_18px_44px_rgba(255,255,255,0.08)] ${rarityGlow[char.rarity]}`
          : `border-white/34 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_22px_56px_rgba(255,255,255,0.10)] ${rarityGlow[char.rarity]}`
      }`}
      style={{
        clipPath:
          viewMode === "smooth"
            ? "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))"
            : "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
      }}
    >
      <TechCorners />
      <div className={`pointer-events-none absolute inset-0 ${getRarityBackdropFx(char)}`} />
      {char.rarity !== "Sıradan" && (
        <div className={`pointer-events-none absolute inset-0 ${getRarityParticleFx(char)}`} />
      )}

      <div className={`relative overflow-hidden bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
        <AssetImage
          src={char.image || ""}
          alt={char.name}
          className={`h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03] ${viewMode === "smooth" ? "saturate-[1.04]" : "contrast-[1.08] saturate-[1.02]"}` }
        />

        {char.rarity === "Kristalize" && char.side === "İyi" && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(210,255,255,0.18),transparent_12%),radial-gradient(circle_at_78%_24%,rgba(180,240,255,0.16),transparent_12%),radial-gradient(circle_at_56%_72%,rgba(255,255,255,0.12),transparent_10%)]" />
        )}

        {char.rarity === "Kristalize" && char.side === "Kötü" && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,200,200,0.18),transparent_12%),radial-gradient(circle_at_78%_24%,rgba(255,120,120,0.18),transparent_12%),radial-gradient(circle_at_56%_72%,rgba(255,120,120,0.14),transparent_10%)]" />
        )}
        {char.rarity === "Omega" && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,220,255,0.18),transparent_20%),radial-gradient(circle_at_78%_24%,rgba(255,160,240,0.14),transparent_18%)]" />
        )}
        {char.rarity === "Ender" && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(210,255,180,0.14),transparent_16%),radial-gradient(circle_at_76%_72%,rgba(150,255,140,0.08),transparent_16%)]" />
        )}

        <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${getRarityHeaderGlow(char)}`} />
        <div className="pointer-events-none absolute inset-0 opacity-16 animate-pulse bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute right-4 top-4 flex items-center gap-2 border border-white/20 bg-black/35 px-3 py-2 backdrop-blur-md">
          <RarityLogo rarity={char.rarity} side={char.side} size={18} />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">{char.rarity}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-2xl font-black text-white">{char.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/60">{inferSummary(char)}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="border border-white/18 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/82">
              {char.role}
            </span>
            <span className="border border-white/14 bg-black/28 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {char.range}
            </span>
            <span className="border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100">
              Lv {levelStats.level}/{levelStats.maxLevel}
            </span>
            <span className="border border-red-200/20 bg-red-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-100">
              {levelStats.damage} Hasar
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <InfoTile label="ID" value={char.id} />
          <InfoTile label="Seviye" value={`${levelStats.level}/${levelStats.maxLevel}`} />
          <InfoTile label="HP" value={`${levelStats.hp} / Max ${levelStats.maxHp}`} />
          <InfoTile label="Hasar" value={`${levelStats.damage} / Max ${levelStats.maxDamage}`} />
          <InfoTile label="Menzil" value={char.range} />
          <InfoTile label="Rol" value={char.role} />
        </div>

        <div className="space-y-3">
          <AbilityBlock label="Yetenek 1" text={char.skill1} />
          <AbilityBlock label="Yetenek 2" text={char.skill2} />
          <AbilityBlock label="Ulti 1" text={char.ultimate} />
          {char.ultimate2 && <AbilityBlock label="Ulti 2" text={char.ultimate2} />}
        </div>
      </div>
    </div>
  );
}

function LootCard({ item, reveal }: { item: ResultItem; reveal: boolean }) {
  const char = getCharacterByName(item.character);
  if (!char) return null;
  const levelStats = getCharacterLevelStats(char);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: reveal ? 1 : 0.9, y: 0, scale: 1 }}
      className={`relative overflow-hidden border border-white/20 bg-black/30 ${rarityGlow[item.rarity]}`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      <TechCorners />
      <div className={`relative bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
        <AssetImage src={char.image || ""} alt={char.name} className="h-[320px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute left-5 top-5 flex items-center gap-3 border border-white/20 bg-black/35 px-4 py-3 backdrop-blur-md">
          <RarityLogo rarity={item.rarity} side={item.side} size={20} />
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/55">Açılan Karakter</div>
            <div className="text-sm font-bold text-white">{item.rarity}</div>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="text-3xl font-black text-white md:text-4xl">{char.name}</div>
          <div className="mt-2 text-sm uppercase tracking-[0.18em] text-white/65">
            {char.side ? `${char.side} • ` : ""}
            {char.range} menzil • Lv {levelStats.level}/{levelStats.maxLevel} • {levelStats.hp} HP • {levelStats.damage} Hasar
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <div className="space-y-3">
          <AbilityBlock label="Yetenek 1" text={char.skill1} />
          <AbilityBlock label="Yetenek 2" text={char.skill2} />
        </div>
        <div className="space-y-3">
          <AbilityBlock label="Ulti 1" text={char.ultimate} />
          {char.ultimate2 ? (
            <AbilityBlock label="Ulti 2" text={char.ultimate2} />
          ) : (
            <AbilityBlock label="Karakter Özeti" text={`${inferSummary(char)} • ${char.role}`} />
          )}
        </div>
      </div>
    </motion.div>
  );
}



function getWheelTheme(wheel: WheelType) {
  if (wheel === "acemi") {
    return {
      frame: "border-white/15 shadow-[0_0_24px_rgba(180,200,255,0.08)]",
      accent: "from-zinc-500/10 via-slate-500/8 to-black",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(180,220,255,0.08),transparent_30%)]",
      line: "border-white/12",
      badge: "border-white/15 bg-white/8 text-white/80",
    };
  }

  if (wheel === "akademi") {
    return {
      frame: "border-amber-300/30 shadow-[0_0_34px_rgba(255,210,120,0.14),inset_0_0_0_1px_rgba(255,220,150,0.08)]",
      accent: "from-amber-500/10 via-yellow-400/8 to-black",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(255,220,140,0.12),transparent_26%),linear-gradient(135deg,rgba(255,220,150,0.06),transparent_28%,transparent_70%,rgba(255,210,120,0.04))]",
      line: "border-amber-300/18",
      badge: "border-amber-300/25 bg-amber-200/10 text-amber-100",
    };
  }

  return {
    frame: "border-fuchsia-300/30 shadow-[0_0_38px_rgba(255,160,255,0.16),inset_0_0_0_1px_rgba(255,210,255,0.10)]",
    accent: "from-fuchsia-500/12 via-cyan-400/8 to-black",
    halo: "bg-[radial-gradient(circle_at_top_right,rgba(255,220,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.10),transparent_28%),linear-gradient(135deg,rgba(255,180,255,0.08),transparent_30%,transparent_70%,rgba(180,240,255,0.06))]",
    line: "border-fuchsia-300/18",
    badge: "border-fuchsia-300/25 bg-fuchsia-200/10 text-fuchsia-100",
  };
}

function WheelSelector({
  selected,
  onSelect,
}: {
  selected: WheelType;
  onSelect: (wheel: WheelType) => void;
}) {
  return (
    <div className="mb-6 grid gap-4 xl:grid-cols-3">
      {WHEEL_CONFIGS.map((wheel) => {
        const isSelected = selected === wheel.id;

        const frameClass =
          wheel.frameStyle === "normal"
            ? "border-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
            : wheel.frameStyle === "gold"
            ? "border-amber-300/30 shadow-[0_0_24px_rgba(255,205,120,0.10),inset_0_0_0_1px_rgba(255,220,150,0.10)]"
            : "border-fuchsia-300/30 shadow-[0_0_28px_rgba(255,160,255,0.12),inset_0_0_0_1px_rgba(255,210,255,0.10)]";

        const titleClass =
          wheel.frameStyle === "normal"
            ? "text-white"
            : wheel.frameStyle === "gold"
            ? "text-amber-100"
            : "text-fuchsia-50";

        const badgeClass =
          wheel.frameStyle === "normal"
            ? "border-white/15 bg-white/8 text-white/80"
            : wheel.frameStyle === "gold"
            ? "border-amber-300/25 bg-amber-200/10 text-amber-100"
            : "border-fuchsia-300/25 bg-fuchsia-200/10 text-fuchsia-100";

        const cellClass =
          wheel.frameStyle === "normal"
            ? "border-white/10 bg-white/[0.05]"
            : wheel.frameStyle === "gold"
            ? "border-amber-300/15 bg-amber-200/[0.06]"
            : "border-fuchsia-300/15 bg-fuchsia-200/[0.06]";

        return (
          <button
            key={wheel.id}
            onClick={() => onSelect(wheel.id)}
            className={`group relative overflow-hidden border p-5 text-left transition ${frameClass} ${
              isSelected
                ? `bg-white/10 ${wheel.glowClass} scale-[1.01]`
                : "bg-black/35 hover:border-white/20 hover:bg-white/8"
            }`}
            style={{
              clipPath:
                wheel.id === "akademi"
                  ? "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  : "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              transform: wheel.id === "akademi" ? "scale(1.02)" : undefined,
            }}
          >
            <TechCorners />
            <div className={`absolute inset-0 bg-gradient-to-br ${wheel.cardClass}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/28 to-transparent" />
            {wheel.frameStyle === "gold" && (
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,140,0.12),transparent_26%),linear-gradient(135deg,rgba(255,220,150,0.08),transparent_28%,transparent_70%,rgba(255,210,120,0.06))]" />
            )}
            {wheel.frameStyle === "omega" && (
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.10),transparent_28%),linear-gradient(135deg,rgba(255,180,255,0.08),transparent_30%,transparent_70%,rgba(180,240,255,0.06))]" />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {wheel.subtitle}
                  </div>
                  <div className={`mt-1 font-black ${titleClass} ${wheel.id === "akademi" ? "text-3xl" : "text-2xl"}`}>
                    {wheel.name}
                  </div>
                </div>
                {isSelected && (
                  <div className={`border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${badgeClass}`}>
                    Seçili
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm leading-6 text-white/74">{wheel.description}</div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {RARITY_ORDER.map((rarity) => {
                  const value = wheel.weights[rarity];
                  const visible = !wheel.allowedRarities || wheel.allowedRarities.includes(rarity);

                  return (
                    <div
                      key={`${wheel.id}-${rarity}`}
                      className={`border px-3 py-2 text-sm ${visible ? `${cellClass} text-white/82` : "border-white/8 bg-black/25 text-white/28"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{rarity}</span>
                        <span className="font-semibold">{visible ? `${value}%` : "Yok"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}




function GameModesSection({
  selectedModeId,
  onSelectMode,
  profiles,
  fakeAccounts,
  founderView,
  onToggleProfileBan,
  onToggleFakeBan,
  onUpgradeCharacter,
  adminToolsEnabled,
  onToggleAdminTools,
}: {
  selectedModeId: string;
  onSelectMode: (modeId: string) => void;
  profiles: InventoryProfile[];
  fakeAccounts: TradeAccount[];
  founderView: boolean;
  onToggleProfileBan: (id: InventoryProfile["id"]) => void;
  onToggleFakeBan: (id: string) => void;
  onUpgradeCharacter: (id: InventoryProfile["id"], name: string) => void;
  adminToolsEnabled: boolean;
  onToggleAdminTools: () => void;
}) {
  const [surveyPlayerCount, setSurveyPlayerCount] = useState<string>("");
  const [surveyCharacter, setSurveyCharacter] = useState<string>("");
  const [surveyRole, setSurveyRole] = useState<RoleType | "Aynı Rol" | "Farketmez">("Aynı Rol");
  const [surveyRange, setSurveyRange] = useState<RangeType | "Aynı Menzil" | "Farketmez">("Aynı Menzil");
  const [foundOpponent, setFoundOpponent] = useState<CharacterInfo | null>(null);
  const [foundTeammate, setFoundTeammate] = useState<CharacterInfo | null>(null);
  const [balancedRoster, setBalancedRoster] = useState<CharacterInfo[]>([]);
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const selectedMode = GAME_MODES.find((mode) => mode.id === selectedModeId) ?? GAME_MODES[0];
  const selectedCharacterInfo =
    CHARACTER_DATABASE.find((char) => char.name === surveyCharacter) ?? null;

  const activePlayerCountOptions = getModePlayerCountOptions(selectedMode.id);

  const resetSurveyFromMode = (modeId: string) => {
    onSelectMode(modeId);
    const firstCount = getModePlayerCountOptions(modeId)[0];
    setSurveyPlayerCount(String(firstCount));
    setFoundOpponent(null);
    setFoundTeammate(null);
    setBalancedRoster([]);
  };

  useEffect(() => {
    if (!surveyPlayerCount) {
      setSurveyPlayerCount(String(activePlayerCountOptions[0]));
    }
  }, [selectedMode.id]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10">
          <Swords className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Oyun Modları</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">Mod Tasarımı</div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {GAME_MODES.map((mode) => {
          const isSelected = mode.id === selectedModeId;

          return (
            <button
              key={mode.id}
              onClick={() => resetSurveyFromMode(mode.id)}
              className={`group relative overflow-hidden border bg-black/40 text-left transition ${
                isSelected
                  ? "border-white/28 shadow-[0_0_32px_rgba(255,255,255,0.08)]"
                  : "border-white/10 hover:border-white/18"
              }`}
              style={{
                clipPath:
                  mode.id === "duello"
                    ? "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))"
                    : "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
              }}
            >
              <TechCorners />
              <AssetImage
                src={mode.image || ""}
                alt={mode.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: mode.imagePosition ?? "center" }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${mode.accent}`} />
              <div className={`absolute inset-0 ${mode.id === "turnuva" ? "bg-gradient-to-r from-black/82 via-black/58 to-black/18" : "bg-gradient-to-t from-black via-black/45 to-black/10"}`} />
              <div className="absolute inset-0 bg-transparent" />

              <div className={`relative z-10 flex h-full flex-col justify-between p-6 ${mode.id === "duello" ? "md:min-h-[520px]" : "md:min-h-[460px]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center border border-white/20 bg-black/35 backdrop-blur-md">
                      {mode.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                        {mode.eyebrow}
                      </div>
                      <div className={`mt-1 font-black text-white ${mode.id === "duello" ? "text-3xl md:text-4xl" : mode.id === "turnuva" ? "text-2xl md:text-3xl" : "text-2xl md:text-3xl"}`}>
                        {mode.name}
                      </div>
                      <div className="mt-1 text-sm uppercase tracking-[0.18em] text-white/55">
                        {mode.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                    {mode.chip}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
                    <Mountain className="h-3.5 w-3.5" />
                    {mode.terrain}
                  </div>

                  <div className={`${mode.id === "duello" ? "max-w-3xl text-xl leading-8 md:text-2xl" : mode.id === "turnuva" ? "max-w-2xl text-base leading-7" : "text-base leading-7"} text-white/84`}>
                    {mode.description}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-white/20 bg-black/35 p-4 backdrop-blur-md">
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                        Hedef
                      </div>
                      <div className="text-sm leading-6 text-white/84">{mode.objective}</div>
                    </div>

                    <div className="border border-white/20 bg-black/35 p-4 backdrop-blur-md">
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                        <Users className="h-3.5 w-3.5" />
                        Oyuncu Yapısı
                      </div>
                      <div className="text-sm text-white/84">{mode.players}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mode.zones.map((zone) => (
                      <span
                        key={zone}
                        className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white/78"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <CutPanel className="mt-8 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold text-white">Eşleşme Anketi</div>
            <div className="mt-1 text-sm text-white/55">
              Önce modu ve oyuncu sayısını seç. Sistem alt, orta ve üst kademe lobby mantığıyla güç dengesini koruyarak rakip, takım arkadaşı veya tam yerleşim önerisi üretir.
            </div>
          </div>
          <div className="border border-white/12 bg-white/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/75">
            Seçili Mod: {selectedMode.name}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                1. Oyun Modu
              </div>
              <select
                value={selectedMode.id}
                onChange={(e) => resetSurveyFromMode(e.target.value)}
                className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
              >
                {GAME_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                2. Kaç Kişilik
              </div>
              <select
                value={surveyPlayerCount || String(activePlayerCountOptions[0])}
                onChange={(e) => {
                  setSurveyPlayerCount(e.target.value);
                  setFoundOpponent(null);
                  setFoundTeammate(null);
                  setBalancedRoster([]);
                }}
                className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
              >
                {activePlayerCountOptions.map((count) => (
                  <option key={count} value={String(count)}>
                    {count} Kişilik
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                3. Karakterin
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <select
                  value={surveyCharacter}
                  onChange={(e) => {
                    setSurveyCharacter(e.target.value);
                    setFoundOpponent(null);
                    setFoundTeammate(null);
                    setBalancedRoster([]);
                  }}
                  className="w-full border border-white/20 bg-black/35 py-3 pl-11 pr-4 text-white outline-none"
                >
                  <option value="">Karakter seç...</option>
                  {CHARACTER_DATABASE.map((char) => (
                    <option key={char.id} value={char.name}>
                      {char.name} • {char.rarity} • {char.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  4. Rol Uyumu
                </div>
                <select
                  value={surveyRole}
                  onChange={(e) => {
                    setSurveyRole(e.target.value as RoleType | "Aynı Rol" | "Farketmez");
                    setFoundOpponent(null);
                    setFoundTeammate(null);
                  }}
                  className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
                >
                  <option value="Aynı Rol">Aynı Rol</option>
                  <option value="Farketmez">Farketmez</option>
                  {ROLE_ORDER.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  5. Menzil Uyumu
                </div>
                <select
                  value={surveyRange}
                  onChange={(e) => {
                    setSurveyRange(e.target.value as RangeType | "Aynı Menzil" | "Farketmez");
                    setFoundOpponent(null);
                    setFoundTeammate(null);
                  }}
                  className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
                >
                  <option value="Aynı Menzil">Aynı Menzil</option>
                  <option value="Farketmez">Farketmez</option>
                  <option value="Yakın">Yakın</option>
                  <option value="Orta">Orta</option>
                  <option value="Uzak">Uzak</option>
                  <option value="Karışık">Karışık</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (!selectedCharacterInfo) return;
                  setFoundOpponent(
                    findBalancedOpponent(selectedCharacterInfo, {
                      playerCount: Number(surveyPlayerCount || activePlayerCountOptions[0]),
                      preferredRole: surveyRole,
                      preferredRange: surveyRange,
                    })
                  );
                  setFoundTeammate(null);
                  setBalancedRoster([]);
                }}
                className="border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/14"
              >
                Rakip Bul
              </button>

              <button
                onClick={() => {
                  if (!selectedCharacterInfo) return;
                  const teammatePool = CHARACTER_DATABASE.filter(
                    (char) =>
                      char.name !== selectedCharacterInfo.name &&
                      Math.abs(rarityRank[char.rarity] - rarityRank[selectedCharacterInfo.rarity]) <= 1 &&
                      canShareLobby(selectedCharacterInfo.rarity, char.rarity) &&
                      (char.role !== selectedCharacterInfo.role || char.range !== selectedCharacterInfo.range)
                  );
                  setFoundTeammate(randomFrom(teammatePool.length > 0 ? teammatePool : CHARACTER_DATABASE.filter((char) => char.name !== selectedCharacterInfo.name)));
                  setFoundOpponent(null);
                  setBalancedRoster([]);
                }}
                className="border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-300/14"
              >
                Takım Arkadaşı Bul
              </button>

              <button
                onClick={() => {
                  const count = Number(surveyPlayerCount || activePlayerCountOptions[0]);
                  setBalancedRoster(generateBalancedRoster(count));
                  setFoundOpponent(null);
                  setFoundTeammate(null);
                }}
                className="border border-amber-300/20 bg-amber-300/10 px-5 py-3 font-semibold text-amber-100 transition hover:bg-amber-300/14"
              >
                Oyun Dengesini Ayarla
              </button>
            </div>
          </div>

          <div className="border border-white/20 bg-black/30 p-4">
            {balancedRoster.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm uppercase tracking-[0.16em] text-white/45">Dengeli Yerleşim</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {balancedRoster.map((char, index) => (
                    <div
                      key={`${char.id}-${index}`}
                      className="relative overflow-hidden border border-white/20 bg-black/35"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                      }}
                    >
                      <div className={`relative bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
                        <AssetImage src={char.image  ?? ""} alt={char.name} className="h-36 w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute left-3 top-3 border border-white/20 bg-black/35 px-2 py-1 text-[11px] text-white">
                          Oyuncu {index + 1}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-base font-black text-white">{char.name}</div>
                          <div className="text-[11px] text-white/68">
                            {char.rarity} • {char.role} • {char.range}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/72">
                  Seçilen mod için oyuncu sayısına göre alt / orta / üst kademe lobby mantığında, rarity sıçraması abartılmadan ve rol dağılımı gözetilerek yerleşim üretildi.
                </div>
              </div>
            ) : !selectedCharacterInfo ? (
              <div className="flex h-full min-h-[240px] items-center justify-center text-center text-sm leading-7 text-white/48">
                Sırayla mod, oyuncu sayısı ve karakter seç. Sonra rakip, takım arkadaşı veya dengeli oyun yerleşimi üret.
              </div>
            ) : foundOpponent || foundTeammate ? (
              <div className="space-y-4">
                <div className="text-sm uppercase tracking-[0.16em] text-white/45">
                  {foundTeammate ? "Önerilen Takım Arkadaşı" : "Önerilen Eşleşme"}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[selectedCharacterInfo, foundTeammate ?? foundOpponent].map((char, idx) => (
                    <div
                      key={`${char?.id}-${idx}`}
                      className="relative overflow-hidden border border-white/20 bg-black/35"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                      }}
                    >
                      {char && (
                        <div className={`relative bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
                          <AssetImage src={char.image  ?? ""} alt={char.name} className="h-44 w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          <div className="absolute left-3 top-3 flex items-center gap-2 border border-white/20 bg-black/35 px-3 py-2">
                            <RarityLogo rarity={char.rarity} side={char.side} size={16} />
                            <span className="text-xs font-semibold text-white">{char.rarity}</span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="font-bold text-white">{idx === 0 ? "Sen" : foundTeammate ? "Takım Arkadaşı" : "Rakip"}</div>
                            <div className="text-lg font-black text-white">{char.name}</div>
                            <div className="text-xs text-white/65">
                              {char.role} • {char.range} • {getCharacterLevelStats(char).hp} HP • {getCharacterLevelStats(char).damage} Hasar
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/72">
                  {foundTeammate
                    ? "Takım arkadaşı; rarity seviyesi ve lobby kademesi çok kopmayan, rol ve menzil olarak seni tamamlayabilecek bir profile göre önerildi."
                    : "Rakip; seçilen mod, oyuncu sayısı, lobby kademesi, rarity bandı ve rol / menzil uyumu düşünülerek önerildi."}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[240px] items-center justify-center text-center text-sm leading-7 text-white/48">
                Seçimler hazır. Şimdi butonlardan biriyle rakip, takım arkadaşı veya dengeli oyun yerleşimi üret.
              </div>
            )}
          </div>
        </div>
      </CutPanel>

      {false && selectedMode.id === "turnuva" && (
        <CutPanel className="mt-8 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold text-white">Turnuva Oyuncuları</div>
              <div className="mt-1 text-sm text-white/55">
                Turnuva lobisindeki bütün oyuncuları incele. Kurucu profili açıksa ban durumu yönetilebilir.
              </div>
            </div>
            <button
              onClick={() => setShowAllPlayers((prev) => !prev)}
              className="border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              {showAllPlayers ? "Listeyi Gizle" : "Bütün Oyuncuları Gör"}
            </button>
          </div>

          {showAllPlayers ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[...profiles.map((profile) => ({
                id: profile.id,
                name: profile.name,
                items: profile.items,
                rankPoints: profile.rankPoints ?? 0,
                banned: Boolean(profile.banned),
                isProfile: true,
              })), ...fakeAccounts.map((account) => ({
                id: account.id,
                name: account.name,
                items: account.items,
                rankPoints: account.rankPoints ?? 0,
                banned: Boolean(account.banned),
                isProfile: false,
              }))].map((player) => {
                const rank = getRankInfo(player.rankPoints);
                const featured = CHARACTER_DATABASE.find((char) => player.items.includes(char.name)) ?? null;
                return (
                  <div
                    key={`turnuva-player-${player.id}`}
                    className={`border p-4 ${
                      player.banned ? "border-red-400/25 bg-red-400/6" : "border-white/12 bg-white/[0.04]"
                    }`}
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/42">
                          {player.isProfile ? "oyuncu hesabı" : "canlı hesap"} • {player.items.length} karakter
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-[11px] uppercase tracking-[0.14em] ${
                        player.banned ? "border border-red-300/18 bg-red-300/8 text-red-100" : "border border-white/12 bg-white/8 text-white/58"
                      }`}>
                        {player.banned ? "Banlandı" : "Aktif"}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <RankLogo rank={rank.name} size={20} />
                      <div className="text-sm font-bold text-white">{rank.name}</div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-white/75" style={{ width: `${rank.progress}%` }} />
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden border border-white/12 bg-black/25">
                        {featured ? (
                          <AssetImage src={featured.image || ""} alt={featured.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-white/35">Yok</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{featured?.name ?? "Karakter Yok"}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/42">{rank.points} RP</div>
                      </div>
                    </div>

                    {founderView && (
                      <button
                        onClick={() => player.isProfile ? onToggleProfileBan(player.id as InventoryProfile["id"]) : onToggleFakeBan(player.id)}
                        className={`mt-4 w-full border px-3 py-2 text-sm font-semibold transition ${
                          player.banned
                            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14"
                            : "border-red-300/18 bg-red-300/8 text-red-100 hover:bg-red-300/12"
                        }`}
                      >
                        {player.banned ? "Banı Kaldır" : "Banla"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-white/45">Liste kapalı. Turnuva oyuncularını görmek için butona bas.</div>
          )}
        </CutPanel>
      )}
    </div>
  );
}



function TradeSection({
  profiles,
  setProfiles,
  fakeAccounts = [],
  setFakeAccounts,
  tradeOnlyAccounts = [],
  setTradeOnlyAccounts,
}: {
  profiles: InventoryProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<InventoryProfile[]>>;
  fakeAccounts: TradeAccount[];
  setFakeAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
  tradeOnlyAccounts: TradeAccount[];
  setTradeOnlyAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
}) {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [tradeType, setTradeType] = useState<"character" | "material">("character");
  const [selectedCharacterName, setSelectedCharacterName] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<TradeMaterialId>("credits");
  const [materialAmount, setMaterialAmount] = useState(1);
  const [tradeStatus, setTradeStatus] = useState("");

  const allAccounts: TradeAccount[] = useMemo(() => {
    const playableFakeAccounts = fakeAccounts.slice(0, 240);

    return [
      ...profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        items: profile.items,
        palette: profile.palette,
        isFake: false,
        credits: profile.credits,
        levelPoints: profile.levelPoints,
        wheelKeys: profile.wheelKeys,
      })),
      ...tradeOnlyAccounts,
      ...playableFakeAccounts,
    ];
  }, [profiles, fakeAccounts, tradeOnlyAccounts]);

  const fromAccount = allAccounts.find((account) => account.id === fromAccountId) ?? null;
  const toAccount = allAccounts.find((account) => account.id === toAccountId) ?? null;

  const tradeMaterials = useMemo(
    () => [
      {
        id: "credits" as TradeMaterialId,
        label: "Oyun Kredisi",
        icon: <Coins className="h-4 w-4" />,
        amount: fromAccount?.credits ?? 0,
        hint: "Dükkan ve sandık alımında kullanılır.",
      },
      {
        id: "levelPoints" as TradeMaterialId,
        label: "Seviye Point",
        icon: <Star className="h-4 w-4" />,
        amount: fromAccount?.levelPoints ?? 0,
        hint: "Karakter yükseltmede kullanılır.",
      },
      {
        id: "wheelKey:acemi" as TradeMaterialId,
        label: "Acemi Çarkı Anahtarı",
        icon: <KeyMiniIcon tone="blue" />,
        amount: fromAccount?.wheelKeys?.acemi ?? 0,
        hint: "Acemi çarkını açar.",
      },
      {
        id: "wheelKey:akademi" as TradeMaterialId,
        label: "Akademi Çarkı Anahtarı",
        icon: <KeyMiniIcon tone="purple" />,
        amount: fromAccount?.wheelKeys?.akademi ?? 0,
        hint: "Akademi çarkını açar.",
      },
      {
        id: "wheelKey:turnuva" as TradeMaterialId,
        label: "Turnuva Çarkı Anahtarı",
        icon: <KeyMiniIcon tone="gold" />,
        amount: fromAccount?.wheelKeys?.turnuva ?? 0,
        hint: "Sadece özel event değerinde tutulur.",
      },
    ],
    [fromAccount]
  );

  const selectedMaterial = tradeMaterials.find((material) => material.id === selectedMaterialId) ?? tradeMaterials[0];

  const applyItemsToAccount = (
    accountId: string,
    updater: (items: string[]) => string[]
  ) => {
    if (profiles.some((profile) => profile.id === accountId)) {
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === accountId ? { ...profile, items: updater(profile.items) } : profile
        )
      );
      return;
    }

    if (fakeAccounts.some((account) => account.id === accountId)) {
      setFakeAccounts((prev) =>
        prev.map((account) =>
          account.id === accountId ? { ...account, items: updater(account.items) } : account
        )
      );
      return;
    }

    setTradeOnlyAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, items: updater(account.items) } : account
      )
    );
  };

  const applyMaterialToProfile = (
    accountId: string,
    materialId: TradeMaterialId,
    amount: number,
    direction: "add" | "remove"
  ) => {
    const multiplier = direction === "add" ? 1 : -1;

    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== accountId) return profile;

        if (materialId === "credits") {
          return { ...profile, credits: Math.max(0, profile.credits + amount * multiplier) };
        }

        if (materialId === "levelPoints") {
          return { ...profile, levelPoints: Math.max(0, profile.levelPoints + amount * multiplier) };
        }

        const keyType = materialId.replace("wheelKey:", "") as WheelType;
        return {
          ...profile,
          wheelKeys: {
            ...profile.wheelKeys,
            [keyType]: Math.max(0, (profile.wheelKeys?.[keyType] ?? 0) + amount * multiplier),
          },
        };
      })
    );
  };

  const handleTrade = () => {
    if (!fromAccount || !toAccount) {
      setTradeStatus("Önce gönderen ve alan hesabı seç.");
      return;
    }

    if (fromAccount.id === toAccount.id) {
      setTradeStatus("Aynı hesaba takas gönderemezsin.");
      return;
    }

    if (tradeType === "character") {
      if (!selectedCharacterName) {
        setTradeStatus("Aktarılacak karakteri seç.");
        return;
      }

      if (!fromAccount.items.includes(selectedCharacterName)) {
        setTradeStatus("Bu karakter seçili hesapta yok.");
        return;
      }

      applyItemsToAccount(fromAccount.id, (items) => items.filter((item) => item !== selectedCharacterName));
      applyItemsToAccount(toAccount.id, (items) =>
        items.includes(selectedCharacterName) ? items : [...items, selectedCharacterName]
      );

      setTradeStatus(`${selectedCharacterName}, ${fromAccount.name} hesabından ${toAccount.name} hesabına aktarıldı.`);
      setSelectedCharacterName("");
      return;
    }

    const amount = Math.max(1, Math.floor(Number(materialAmount) || 1));

    if (!profiles.some((profile) => profile.id === fromAccount.id) || !profiles.some((profile) => profile.id === toAccount.id)) {
      setTradeStatus("Malzeme takası sadece gerçek oyuncu/kurucu envanterleri arasında yapılabilir.");
      return;
    }

    if ((selectedMaterial?.amount ?? 0) < amount) {
      setTradeStatus(`Yetersiz ${selectedMaterial?.label ?? "malzeme"}.`);
      return;
    }

    applyMaterialToProfile(fromAccount.id, selectedMaterialId, amount, "remove");
    applyMaterialToProfile(toAccount.id, selectedMaterialId, amount, "add");
    setTradeStatus(`${amount}x ${selectedMaterial.label}, ${fromAccount.name} hesabından ${toAccount.name} hesabına aktarıldı.`);
    setMaterialAmount(1);
  };

  return (
    <CutPanel className="mb-6 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/8">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Takas Merkezi</div>
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">
              Karakter + Malzeme Aktarımı
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden border border-white/12 bg-black/30 p-1">
          <button
            onClick={() => {
              setTradeType("character");
              setTradeStatus("");
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              tradeType === "character" ? "bg-white text-black" : "text-white/55 hover:text-white"
            }`}
          >
            Karakter
          </button>
          <button
            onClick={() => {
              setTradeType("material");
              setTradeStatus("");
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              tradeType === "material" ? "bg-amber-200 text-black" : "text-white/55 hover:text-white"
            }`}
          >
            Malzemeler
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            Gönderen Hesap
          </div>
          <select
            value={fromAccountId}
            onChange={(e) => {
              setFromAccountId(e.target.value);
              setSelectedCharacterName("");
              setMaterialAmount(1);
              setTradeStatus("");
            }}
            className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
          >
            <option value="">Hesap seç...</option>
            {allAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} {account.isFake ? "• canlı hesap" : "• gerçek profil"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            Alan Hesap
          </div>
          <select
            value={toAccountId}
            onChange={(e) => {
              setToAccountId(e.target.value);
              setTradeStatus("");
            }}
            className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
          >
            <option value="">Hesap seç...</option>
            {allAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} {account.isFake ? "• canlı hesap" : "• gerçek profil"}
              </option>
            ))}
          </select>
        </div>

        {tradeType === "character" ? (
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Karakter
            </div>
            <select
              value={selectedCharacterName}
              onChange={(e) => {
                setSelectedCharacterName(e.target.value);
                setTradeStatus("");
              }}
              className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
            >
              <option value="">Karakter seç...</option>
              {(fromAccount?.items ?? []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Malzeme ve Miktar
            </div>
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <select
                value={selectedMaterialId}
                onChange={(e) => {
                  setSelectedMaterialId(e.target.value as TradeMaterialId);
                  setMaterialAmount(1);
                  setTradeStatus("");
                }}
                className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
              >
                {tradeMaterials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.label} • sende {material.amount}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={Math.max(1, selectedMaterial?.amount ?? 1)}
                value={materialAmount}
                onChange={(e) => setMaterialAmount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {tradeType === "material" && (
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {tradeMaterials.map((material) => {
            const selected = material.id === selectedMaterialId;
            return (
              <button
                key={material.id}
                onClick={() => {
                  setSelectedMaterialId(material.id);
                  setMaterialAmount(1);
                  setTradeStatus("");
                }}
                className={`group relative overflow-hidden border p-3 text-left transition ${
                  selected ? "border-amber-200/50 bg-amber-200/12" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,210,120,0.13),transparent_35%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-center gap-2 text-sm font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center border border-white/12 bg-black/25 text-amber-100">
                    {material.icon}
                  </span>
                  <span>{material.label}</span>
                </div>
                <div className="relative mt-2 text-lg font-black text-white">{material.amount}</div>
                <div className="relative mt-1 text-[11px] leading-relaxed text-white/45">{material.hint}</div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleTrade}
          className="border border-amber-300/20 bg-amber-300/10 px-5 py-3 font-semibold text-amber-100 transition hover:bg-amber-300/14"
        >
          Takası Onayla
        </button>
        <div className="text-sm text-white/62">
          {tradeStatus ||
            (tradeType === "character"
              ? "Hesapları seç, karakteri işaretle ve aktarımı başlat."
              : "Gerçek oyuncu/kurucu envanterleri arasında kredi, point ve çark anahtarı aktar.")}
        </div>
      </div>
    </CutPanel>
  );
}


function RankSection({
  profiles,
  fakeAccounts,
  onAddCredits,
  onAdjustRank,
  onAddLevelPoints,
  uiSfx,
}: {
  profiles: InventoryProfile[];
  fakeAccounts: TradeAccount[];
  onAddCredits: (id: InventoryProfile["id"], amount: number, matches?: number) => void;
  onAdjustRank: (id: InventoryProfile["id"], delta: number) => void;
  onAddLevelPoints: (id: InventoryProfile["id"], amount: number) => void;
  uiSfx: ReturnType<typeof useUiSfx>;
}) {
  const [surveyProfileId, setSurveyProfileId] = useState<InventoryProfile["id"]>("player1");
  const [surveyMode, setSurveyMode] = useState<string>("turnuva");
  const [surveyWon, setSurveyWon] = useState<"kazandım" | "kaybettim">("kazandım");
  const [storeTab, setStoreTab] = useState<"sandiklar" | "magaza">("sandiklar");
  const [message, setMessage] = useState("Maç sonucunu işleyerek coin ve rank puanı kazan.");

  const top10 = useMemo(() => {
    const sampledFakeAccounts = fakeAccounts.slice(0, 700);

    return [
      ...profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        rankPoints: profile.rankPoints ?? 0,
        owned: profile.items.length,
        featuredCharacter: profile.items[0] ?? "Karakter Yok",
        isProfile: true,
      })),
      ...sampledFakeAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        rankPoints: account.rankPoints ?? 0,
        owned: account.items.length,
        featuredCharacter: account.items[0] ?? "Karakter Yok",
        isProfile: false,
      })),
    ]
      .sort((a, b) => b.rankPoints - a.rankPoints)
      .slice(0, 10);
  }, [profiles, fakeAccounts]);

  const submitSurvey = () => {
    const delta = getMatchSurveyRankDelta(surveyMode, surveyWon === "kazandım");
    onAddCredits(surveyProfileId, 1, 1);
    onAdjustRank(surveyProfileId, delta);
    setMessage(
      surveyWon === "kazandım"
        ? `Sonuç işlendi. +1 coin ve +${delta} RP kazandın.`
        : `Sonuç işlendi. +1 coin aldın ve ${Math.abs(delta)} RP kaybettin.`
    );
    uiSfx.shopBuy();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/10 shadow-sm">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Ranklar</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/45">Rekabet ve Sezon Takibi</div>
        </div>
      </div>

      <CutPanel className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-white">Ayın Oyuncuları</div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/42">
              İlk 10 sıralama • 250.000 oyuncu ölçeği, hafif örnek havuz
            </div>
          </div>
          <div className="text-xs uppercase tracking-[0.14em] text-white/45">Top 10</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {top10.map((entry, index) => {
            const rank = getRankInfo(entry.rankPoints);
            return (
              <div
                key={`rank-top-${entry.id}`}
                className="border border-white/12 bg-black/35 p-4"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">#{index + 1} {entry.name}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/42">
                      {entry.isProfile ? "oyuncu hesabı" : "canlı hesap"}
                    </div>
                  </div>
                  <div className="text-[11px] text-white/52">{entry.owned} karakter</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <RankLogo rank={rank.name} size={24} />
                  <div className="text-sm font-bold text-white">{rank.name}</div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white/75" style={{ width: `${rank.progress}%` }} />
                </div>

                <div className="mt-2 text-[11px] text-white/45">
                  {rank.points} RP • {entry.featuredCharacter}
                </div>
              </div>
            );
          })}
        </div>
      </CutPanel>

      <CutPanel className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-white">Güncel Karakter Metası</div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/42">
              Şu an en güçlü görünen seçimler
            </div>
          </div>
          <div className="text-xs uppercase tracking-[0.14em] text-white/45">Meta Watch</div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {(() => {
            const metaGroups = [
              {
                tier: "S Tier",
                note: "Şu an en güvenli ve en yüksek değerli seçimler.",
                chars: ["Omega Dareth", "Darth Vader"],
              },
              {
                tier: "A Tier",
                note: "Dengeli, güçlü ve çoğu eşleşmede rahat oynanan karakterler.",
                chars: ["Genç Wu", "Gurkan"],
              },
              {
                tier: "B Tier",
                note: "Doğru elde çok iş yapan, eşleşmeye göre değeri yükselen karakterler.",
                chars: ["Anacondrai", "Genç Garmadon"],
              },
            ] as const;

            const getMetaNote = (char: CharacterInfo) => {
              if (char.name === "Omega Dareth") return "Yüksek tavanı koruyor, baskıyı temiz kuruyor.";
              if (char.name === "Darth Vader") return "Kontrol gücü ve baskın düellolarla öne çıkıyor.";
              if (char.name === "Genç Wu") return "Takım temposunu güvenli şekilde ayakta tutuyor.";
              if (char.name === "Gurkan") return "Yakın menzilde istikrarlı tehdit oluşturuyor.";
              if (char.name === "Anacondrai") return "Zehir baskısı ve ayakta kalması hâlâ değerli.";
              if (char.name === "Genç Garmadon") return "Yeni skill yapısıyla tempo ve karşı baskı değeri yükseldi.";
              if (char.name === "Anacondrai") return "Zehir baskısı ve ayakta kalmasıyla doğru elde hâlâ çok değerlidir.";
              return "Alan etkisiyle takım savaşında iyi katkı veriyor.";
            };

            return metaGroups.map((group) => {
              const chars = group.chars
                .map((name) => CHARACTER_DATABASE.find((char) => char.name === name))
                .filter((char): char is CharacterInfo => Boolean(char));

              return (
                <div
                  key={group.tier}
                  className="relative overflow-hidden border border-white/12 bg-black/24"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  <div className="border-b border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black uppercase tracking-[0.16em] text-white">{group.tier}</div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/42">2 karakter</div>
                    </div>
                    <div className="mt-2 text-xs text-white/52">{group.note}</div>
                  </div>

                  <div className="space-y-3 p-4">
                    {chars.map((char) => (
                      <div
                        key={`meta-${group.tier}-${char.id}`}
                        className="overflow-hidden border border-white/10 bg-white/[0.03]"
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                        }}
                      >
                        <div className="flex min-h-[108px]">
                          <div className={`relative w-28 shrink-0 bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
                            <AssetImage src={char.image || ""} alt={char.name} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                          </div>

                          <div className="flex-1 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-black text-white">{char.name}</div>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="border border-white/14 bg-black/28 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/82">
                                    {char.role}
                                  </span>
                                  <span className="border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/68">
                                    {char.range}
                                  </span>
                                </div>
                              </div>
                              <RarityLogo rarity={char.rarity} side={char.side} size={15} />
                            </div>

                            <div className="mt-3 text-xs leading-5 text-white/62">{getMetaNote(char)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </CutPanel>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CutPanel className="p-5">
          <div className="mb-4 text-lg font-bold text-white">Rank Kademeleri</div>
          <div className="grid gap-3">
            {RANK_THRESHOLDS.map((tier) => (
              <div
                key={tier.name}
                className="flex items-center justify-between border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-center gap-3">
                  <RankLogo rank={tier.name} size={22} />
                  <div>
                    <div className="font-semibold text-white">{tier.name}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/42">
                      {tier.name === "Omega" ? `${tier.min}+ RP` : `${tier.min} - ${tier.max} RP`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/45">Sezon</div>
              </div>
            ))}
          </div>
        </CutPanel>

        <div className="space-y-6">
          <CutPanel className="p-5">
            <div className="mb-4 text-lg font-bold text-white">Oyuncu Durumu</div>
            <div className="grid gap-4 md:grid-cols-2">
              {profiles.slice(0, 2).map((profile) => {
                const rank = getRankInfo(profile.rankPoints ?? 0);
                return (
                  <div key={profile.id} className="border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{profile.name}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/42">
                          {profile.rankPoints ?? 0} RP
                        </div>
                      </div>
                      <RankLogo rank={rank.name} size={22} />
                    </div>
                    <div className="mt-3 text-sm font-bold text-white">{rank.name}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-white/75" style={{ width: `${rank.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CutPanel>

          <CutPanel className="p-5">
            <div className="mb-3 text-lg font-bold text-white">Maç Tamamlama Anketi</div>
            <div className="mb-4 text-sm leading-6 text-white/68">
              Maç sonucunu işle. Her kayıt +1 coin verir; kazanırsan daha fazla RP alırsın, kaybedersen RP düşer.
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <select
                value={surveyProfileId}
                onChange={(e) => setSurveyProfileId(e.target.value as InventoryProfile["id"])}
                className="border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>

              <select
                value={surveyMode}
                onChange={(e) => setSurveyMode(e.target.value)}
                className="border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              >
                {GAME_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>

              <select
                value={surveyWon}
                onChange={(e) => setSurveyWon(e.target.value as "kazandım" | "kaybettim")}
                className="border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              >
                <option value="kazandım">Kazandım</option>
                <option value="kaybettim">Kaybettim</option>
              </select>
            </div>

            <button
              onClick={submitSurvey}
              className="mt-4 w-full border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/14"
            >
              Sonucu Kaydet
            </button>

            <div className="mt-3 text-sm text-white/62">{message}</div>
          </CutPanel>
        </div>
      </div>
    </div>
  );
}


function InventorySection({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onRenameProfile,
  onClearInventory,
  onRemoveFromInventory,
  onAddToInventory,
  onOpenByCode,
  codeInput,
  setCodeInput,
  onCopyCode,
  onChangePalette,
  uiSfx,
  setProfiles,
  fakeAccounts = [],
  setFakeAccounts,
  tradeOnlyAccounts = [],
  setTradeOnlyAccounts,
  onToggleProfileBan,
  onToggleFakeBan,
  onUpgradeCharacter,
  adminToolsEnabled,
  onToggleAdminTools,
}: {
  profiles: InventoryProfile[];
  selectedProfileId: InventoryProfile["id"];
  onSelectProfile: (id: InventoryProfile["id"]) => void;
  onRenameProfile: (id: InventoryProfile["id"], name: string) => void;
  onClearInventory: (id: InventoryProfile["id"]) => void;
  onRemoveFromInventory: (id: InventoryProfile["id"], name: string) => void;
  onAddToInventory: (id: InventoryProfile["id"], name: string) => void;
  onOpenByCode: () => void;
  codeInput: string;
  setCodeInput: (value: string) => void;
  onCopyCode: () => void;
  onChangePalette: (id: InventoryProfile["id"], palette: string) => void;
  uiSfx: ReturnType<typeof useUiSfx>;
  setProfiles: React.Dispatch<React.SetStateAction<InventoryProfile[]>>;
  fakeAccounts: TradeAccount[];
  setFakeAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
  tradeOnlyAccounts: TradeAccount[];
  setTradeOnlyAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
  onToggleProfileBan: (id: InventoryProfile["id"]) => void;
  onToggleFakeBan: (id: string) => void;
  onUpgradeCharacter: (id: InventoryProfile["id"], name: string) => void;
  adminToolsEnabled: boolean;
  onToggleAdminTools: () => void;
}) {
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];
  const isFounder = selectedProfile.id === "founder";
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryView, setInventoryView] = useState<"karakterler" | "malzemeler">("karakterler");
  const [visibleFakeStart, setVisibleFakeStart] = useState(0);
  const [selectedFakeAccountId, setSelectedFakeAccountId] = useState<string>("");

  const normalizedInventorySearch = inventorySearch.trim().toLocaleLowerCase("tr-TR");
  const profileItems = CHARACTER_DATABASE.filter(
    (char) =>
      selectedProfile.items.includes(char.name) &&
      (normalizedInventorySearch.length === 0 ||
        char.name.toLocaleLowerCase("tr-TR").includes(normalizedInventorySearch))
  );

  const selectedFakeAccount = fakeAccounts.find((account) => account.id === selectedFakeAccountId) ?? null;

  const updateSelectedProfile = <K extends keyof InventoryProfile,>(key: K, value: InventoryProfile[K]) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== selectedProfile.id) return profile;
        const nextProfile = { ...profile, [key]: value } as InventoryProfile;
        if (key === "profilePattern" && !canUseProfilePattern(profile, value as InventoryProfile["profilePattern"])) {
          uiSfx.fail();
          return { ...profile, profilePattern: "duz" };
        }
        return sanitizeProfileCosmetics(nextProfile);
      })
    );
  };

  useEffect(() => {
    setVisibleFakeStart(0);
  }, [fakeAccounts.length]);

  const visibleFakeAccounts = useMemo(() => {
    if (fakeAccounts.length <= 18) return fakeAccounts;

    return Array.from({ length: 18 }, (_, index) =>
      fakeAccounts[(visibleFakeStart + index) % fakeAccounts.length]
    ).filter(Boolean);
  }, [fakeAccounts, visibleFakeStart]);

  const availableToAdd = CHARACTER_DATABASE.filter(
    (char) =>
      !selectedProfile.items.includes(char.name) &&
      (normalizedInventorySearch.length === 0 ||
        char.name.toLocaleLowerCase("tr-TR").includes(normalizedInventorySearch))
  );

  const previewChar =
    CHARACTER_DATABASE.find((char) => char.name === (selectedProfile.profileCharacter ?? "")) ??
    CHARACTER_DATABASE.find((char) => selectedProfile.items.includes(char.name)) ??
    null;
  const favoriteChar =
    CHARACTER_DATABASE.find((char) => char.name === (selectedProfile.favoriteCharacter ?? "")) ??
    CHARACTER_DATABASE.find((char) => selectedProfile.items.includes(char.name)) ??
    null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10">
          <Package2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Envanter</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">Profil ve Koleksiyon</div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <CutPanel className="p-4">
          <div className="mb-3 text-sm font-semibold text-white">Profiller</div>
          <div className="space-y-3">
            {profiles.map((profile) => {
              const selected = profile.id === selectedProfileId;
              const rank = getRankInfo(profile.rankPoints ?? 0);

              return (
                <div
                  key={profile.id}
                  className={`w-full border p-3 transition ${
                    selected
                      ? "border-white/28 bg-white/10 shadow-[0_0_24px_rgba(255,255,255,0.06)]"
                      : "border-white/10 bg-black/30"
                  }`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <button className="w-full text-left" onClick={() => onSelectProfile(profile.id)}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{profile.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">
                          Kod: {profile.code}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/55">
                          <RankLogo rank={rank.name} size={18} />
                          <span>{rank.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/55">{profile.items.length} karakter</div>
                        {profile.banned && (
                          <div className="mt-2 border border-red-300/18 bg-red-300/8 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-red-100">
                            Banlandı
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {isFounder && profile.id !== "founder" && (
                    <button
                      onClick={() => onToggleProfileBan(profile.id)}
                      className={`mt-3 w-full border px-3 py-2 text-xs font-semibold transition ${
                        profile.banned
                          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14"
                          : "border-red-300/18 bg-red-300/8 text-red-100 hover:bg-red-300/12"
                      }`}
                    >
                      {profile.banned ? "Banı Kaldır" : "Banla"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="mb-3 text-sm font-semibold text-white">Hesaplar</div>
            <div className="grid max-h-[720px] gap-3 overflow-y-auto pr-1">
              {visibleFakeAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedFakeAccountId(account.id)}
                  className="border border-white/10 bg-white/[0.04] px-4 py-3 text-left"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{account.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/42">
                        <RankLogo rank={getRankInfo(account.rankPoints ?? 0).name} size={16} />
                        <span>{account.items.length} karakter • {getRankInfo(account.rankPoints ?? 0).name}</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-white/50">
                      <div>
                        {account.items.length >= 18
                          ? "zengin hesap"
                          : account.items.length >= 10
                          ? "güçlü hesap"
                          : account.items.length >= 5
                          ? "orta hesap"
                          : "başlangıç"}
                      </div>
                      {account.banned && (
                        <div className="mt-2 border border-red-300/18 bg-red-300/8 px-2 py-1 uppercase tracking-[0.14em] text-red-100">
                          Banlandı
                        </div>
                      )}
                    </div>
                  </div>

                  {isFounder && (
                    <div className="mt-3">
                      <span
                        className={`inline-flex w-full items-center justify-center border px-3 py-2 text-xs font-semibold ${
                          account.banned
                            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                            : "border-red-300/18 bg-red-300/8 text-red-100"
                        }`}
                      >
                        {account.banned ? "Banı Kaldır" : "Banla"}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedFakeAccount && (
              <div className="mt-4 border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{selectedFakeAccount.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/42">
                      <RankLogo rank={getRankInfo(selectedFakeAccount.rankPoints ?? 0).name} size={16} />
                      <span>
                        {selectedFakeAccount.items.length} karakter • canlı hesap profili • {getRankInfo(selectedFakeAccount.rankPoints ?? 0).name}
                      </span>
                    </div>
                  </div>

                  {isFounder && (
                    <button
                      onClick={() => onToggleFakeBan(selectedFakeAccount.id)}
                      className={`border px-3 py-2 text-xs font-semibold transition ${
                        selectedFakeAccount.banned
                          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14"
                          : "border-red-300/18 bg-red-300/8 text-red-100 hover:bg-red-300/12"
                      }`}
                    >
                      {selectedFakeAccount.banned ? "Banı Kaldır" : "Banla"}
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedFakeAccount.items.map((item) => (
                    <span
                      key={`${selectedFakeAccount.id}-${item}`}
                      className="border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-white/72"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
              Kod Yapıştır / Envanter Aç
            </div>
            <div className="flex gap-3">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Profil kodunu yapıştır..."
                className="flex-1 border border-white/12 bg-black/35 px-4 py-3 text-white outline-none"
              />
              <button
                onClick={onOpenByCode}
                className="border border-white/12 bg-white/8 px-4 py-3 text-sm text-white transition hover:bg-white/12"
              >
                Aç
              </button>
            </div>
            <div className="mt-2 text-xs leading-5 text-white/45">
              Kodu yapıştırdığında seçili profile ad, tema ve karakterler birlikte uygulanır.
            </div>
          </div>
        </CutPanel>

        <CutPanel
          className={`relative p-5 ${getProfileFrameClass(selectedProfile.frameStyle)} ${
            selectedProfile.glowLevel === "yuksek"
              ? "shadow-[0_0_110px_rgba(255,255,255,0.28),0_0_190px_rgba(255,255,255,0.16)]"
              : selectedProfile.glowLevel === "dusuk"
              ? "shadow-[0_16px_34px_rgba(255,255,255,0.08)]"
              : "shadow-[0_0_70px_rgba(255,255,255,0.18),0_20px_60px_rgba(255,255,255,0.10)]"
          }`}
        >
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${selectedProfile.palette}`} />
          <div className={`pointer-events-none absolute inset-0 ${getProfilePatternOverlay(selectedProfile.profilePattern)}`} />
          <div
            className={`pointer-events-none absolute inset-0 ${
              selectedProfile.surfaceStyle === "karanlik"
                ? "bg-gradient-to-t from-black/95 via-black/72 to-black/30"
                : selectedProfile.surfaceStyle === "aydinlik"
                ? "bg-gradient-to-t from-white/18 via-white/8 to-transparent"
                : "bg-gradient-to-t from-black/82 via-black/18 to-transparent"
            }`}
          />
          <div className="relative">
            <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-bold text-white">{selectedProfile.name}</div>
                  <div className="mt-1 text-sm text-white/55">Envanter kodu: {selectedProfile.code}</div>
                  <div className="mt-3 max-w-xl">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-white/42">
                      <span className="flex items-center gap-2">
                        <RankLogo rank={getRankInfo(selectedProfile.rankPoints ?? 0).name} size={18} />
                        <span>{getRankInfo(selectedProfile.rankPoints ?? 0).name}</span>
                      </span>
                      <span>{selectedProfile.rankPoints ?? 0} RP</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-white/75"
                        style={{ width: `${getRankInfo(selectedProfile.rankPoints ?? 0).progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onCopyCode}
                    className="flex items-center gap-2 border border-white/12 bg-white/8 px-4 py-2 text-sm text-white transition hover:bg-white/12"
                  >
                    <Copy className="h-4 w-4" />
                    Kodu Kopyala
                  </button>
                  {selectedProfile.id === "founder" && (
                    <button
                      onClick={() => onClearInventory(selectedProfile.id)}
                      className="flex items-center gap-2 border border-red-300/18 bg-red-300/8 px-4 py-2 text-sm text-red-100 transition hover:bg-red-300/12"
                    >
                      <Trash2 className="h-4 w-4" />
                      Envanteri Temizle
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`relative overflow-hidden border bg-black/28 p-3 ${getProfileFrameClass(selectedProfile.frameStyle)}`}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedProfile.palette}`} />
                <div className={`absolute inset-0 ${getProfilePatternOverlay(selectedProfile.profilePattern)}`} />
                <div
                  className={`absolute inset-0 ${
                    selectedProfile.surfaceStyle === "karanlik"
                      ? "bg-gradient-to-t from-black/95 via-black/72 to-black/30"
                      : selectedProfile.surfaceStyle === "aydinlik"
                      ? "bg-gradient-to-t from-white/18 via-white/8 to-transparent"
                      : "bg-gradient-to-t from-black/82 via-black/18 to-transparent"
                  }`}
                />
                <div className="relative">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45"><span>Profil Önizleme</span><span className="border border-white/12 bg-white/8 px-2 py-1 text-[10px] text-white/62">{selectedProfile.surfaceStyle ?? "gecisli"}</span><span className="border border-white/12 bg-white/8 px-2 py-1 text-[10px] text-white/62">{selectedProfile.glowLevel ?? "orta"} glow</span></div>
                  <div className="relative h-40 overflow-hidden border border-white/20 bg-black/35 shadow-[0_0_45px_rgba(255,255,255,0.12)]">
                    {previewChar ? (
                      <AssetImage src={previewChar.image || ""} alt={previewChar.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/42">Karakter seç</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_34%)]" />
                  </div>
                </div>
              </div>
            </div>

            {isFounder && (
              <div className="mb-5 border border-amber-300/18 bg-amber-300/8 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-100">Kurucu Kontrolü</div>
                <div className="mb-3 text-sm leading-6 text-white/68">
                  Admin tools açıkken üst menüde GürkanHUB ve Admin Menüsü görünür. Kapalıyken tamamen gizlenirler.
                </div>
                <button
                  onClick={onToggleAdminTools}
                  className={`border px-4 py-2 text-sm font-semibold transition ${
                    adminToolsEnabled
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14"
                      : "border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300/14"
                  }`}
                >
                  {adminToolsEnabled ? "Admin Tools Aktif • Kapat" : "Admin Tools Pasif • Aç"}
                </button>
              </div>
            )}

            {selectedProfile.id !== "founder" && (
              <div className="mb-5">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">Profil Adı</div>
                <input
                  value={selectedProfile.name}
                  onChange={(e) => onRenameProfile(selectedProfile.id, e.target.value)}
                  className="w-full border border-white/20 bg-black/35 px-4 py-3 text-white outline-none"
                />
              </div>
            )}

            <div className="mb-5 border border-fuchsia-300/16 bg-fuchsia-300/[0.06] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-white">Profil / Base Düzenleme</div>
                  <div className="mt-1 text-xs text-white/48">Hesap detayları tek yerde toplandı: ünvan, slogan, favori mod, kapak karakteri ve profil görünümü buradan ayarlanır.</div>
                </div>
                <div className="border border-white/12 bg-black/35 px-3 py-2 text-xs font-bold text-white/65">Tek hesap paneli</div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Ünvan</span>
                  <input
                    value={selectedProfile.profileTitle ?? ""}
                    onChange={(e) => updateSelectedProfile("profileTitle", e.target.value)}
                    placeholder={getProfileTitle({ ...selectedProfile, profileTitle: "" })}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Slogan</span>
                  <input
                    value={selectedProfile.slogan ?? ""}
                    onChange={(e) => updateSelectedProfile("slogan", e.target.value)}
                    placeholder="Kısa profil sözü yaz..."
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Favori Karakter</span>
                  <select
                    value={selectedProfile.favoriteCharacter ?? ""}
                    onChange={(e) => updateSelectedProfile("favoriteCharacter", e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="">Seçilmedi</option>
                    {selectedProfile.items.map((item) => (
                      <option key={`fav-${item}`} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Kapak Karakteri</span>
                  <select
                    value={selectedProfile.profileCharacter ?? ""}
                    onChange={(e) => updateSelectedProfile("profileCharacter", e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="">Otomatik</option>
                    {selectedProfile.items.map((item) => (
                      <option key={`cover-${item}`} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Favori Mod</span>
                  <select
                    value={selectedProfile.favoriteMode ?? "turnuva"}
                    onChange={(e) => updateSelectedProfile("favoriteMode", e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    {GAME_MODES.slice(0, 6).map((mode) => (
                      <option key={`mode-${mode.id}`} value={mode.id}>{mode.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Tema Paleti</span>
                  <select
                    value={selectedProfile.palette}
                    onChange={(e) => onChangePalette(selectedProfile.id, e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    {INVENTORY_PALETTES.map((palette, index) => (
                      <option key={`palette-${index}`} value={palette}>Palet {index + 1}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Desen</span>
                  <select
                    value={canUseProfilePattern(selectedProfile, selectedProfile.profilePattern) ? selectedProfile.profilePattern ?? "duz" : "duz"}
                    onChange={(e) => updateSelectedProfile("profilePattern", e.target.value as InventoryProfile["profilePattern"])}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    {getUnlockedProfilePatterns(selectedProfile).map((pattern) => (
                      <option key={pattern.id} value={pattern.id}>{pattern.label}</option>
                    ))}
                  </select>
                  <span className="mt-2 block text-[10px] font-semibold text-white/38">Omega/Kristalize gibi desenler sadece o rarity karakter envanterde varsa açılır.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Çerçeve</span>
                  <select
                    value={selectedProfile.frameStyle ?? "duz"}
                    onChange={(e) => updateSelectedProfile("frameStyle", e.target.value as InventoryProfile["frameStyle"])}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="duz">Düz</option>
                    <option value="keskin">Keskin</option>
                    <option value="neon">Neon</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Glow</span>
                  <select
                    value={selectedProfile.glowLevel ?? "orta"}
                    onChange={(e) => updateSelectedProfile("glowLevel", e.target.value as InventoryProfile["glowLevel"])}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="dusuk">Düşük</option>
                    <option value="orta">Orta</option>
                    <option value="yuksek">Yüksek</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Kart Kontrastı</span>
                  <select
                    value={selectedProfile.surfaceStyle ?? "gecisli"}
                    onChange={(e) => updateSelectedProfile("surfaceStyle", e.target.value as InventoryProfile["surfaceStyle"])}
                    className="w-full border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="karanlik">Karanlık</option>
                    <option value="aydinlik">Aydınlık</option>
                    <option value="gecisli">Geçişli</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-2">
              <button onClick={() => setInventoryView("karakterler")}
                className={`border px-4 py-3 text-sm font-semibold ${inventoryView === "karakterler" ? "border-white/30 bg-white/14 text-white" : "border-white/10 bg-white/[0.04] text-white/58"}`}>
                Karakterler
              </button>
              <button onClick={() => setInventoryView("malzemeler")}
                className={`border px-4 py-3 text-sm font-semibold ${inventoryView === "malzemeler" ? "border-white/30 bg-white/14 text-white" : "border-white/10 bg-white/[0.04] text-white/58"}`}>
                Malzemeler
              </button>
            </div>

            {inventoryView === "malzemeler" && (
              <div className="mb-5 grid gap-4 md:grid-cols-2">
                <div className="border border-amber-300/20 bg-amber-300/8 p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-amber-100/65">Malzeme</div>
                  <div className="mt-2 flex items-center gap-3 text-2xl font-black text-amber-100"><Coins className="h-6 w-6" /> {selectedProfile.credits} Oyun Kredisi</div>
                </div>
                <div className="border border-sky-300/20 bg-sky-300/8 p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-sky-100/65">Malzeme</div>
                  <div className="mt-2 flex items-center gap-3 text-2xl font-black text-sky-100"><Star className="h-6 w-6" /> {selectedProfile.levelPoints} Seviye Point</div>
                  <div className="mt-3 text-sm leading-6 text-white/58">Her karakter yükseltmesinde bir sonraki seviyeye göre point harcanır. Lv 11 maksimumdur.</div>
                </div>
                {WHEEL_CONFIGS.map((wheel) => {
                  const keyCount = getWheelKeyCount(selectedProfile, wheel.id);
                  const theme = getWheelTheme(wheel.id);
                  return (
                    <div key={`inv-key-${wheel.id}`} className={`relative overflow-hidden border p-5 ${theme.frame}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent}`} />
                      <div className={`absolute inset-0 ${theme.halo}`} />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.16em] text-white/58">Çark Anahtarı</div>
                            <div className="mt-2 text-lg font-black text-white">{WHEEL_KEY_LABELS[wheel.id]}</div>
                            <div className="mt-3 text-xs leading-5 text-white/58">Bu anahtar olmadan {wheel.name} açılamaz. Görevlerden kazanılır.</div>
                          </div>
                          <WheelKeyArt wheel={wheel.id} count={keyCount} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">Sahip Olunan Karakterler</div>
                  <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <input
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Karakter ara..."
                      className="w-full border border-white/20 bg-black/35 py-3 pl-11 pr-4 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {profileItems.length === 0 ? (
                  <div className="border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/45">
                    Bu profilde henüz karakter yok.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {profileItems.map((char) => (
                      <div
                        key={`${selectedProfile.id}-${char.id}`}
                        className="relative overflow-hidden border border-white/20 bg-black/30"
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                        }}
                      >
                        <div className={`relative bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
                          <AssetImage src={char.image || ""} alt={char.name} className="h-40 w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          <div className="absolute left-3 top-3 flex items-center gap-2 border border-white/20 bg-black/35 px-3 py-2">
                            <RarityLogo rarity={char.rarity} side={char.side} size={16} />
                            <span className="text-xs font-semibold text-white">{char.rarity}</span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="font-bold text-white">{char.name}</div>
                            <div className="text-xs text-white/65">
                              {char.side ? `${char.side} • ` : ""}
                              Lv {getProfileCharacterLevel(selectedProfile, char.name)}/11 • {getCharacterLevelStats(char, getProfileCharacterLevel(selectedProfile, char.name)).hp} HP • {getCharacterLevelStats(char, getProfileCharacterLevel(selectedProfile, char.name)).damage} Hasar
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 p-3">
                          {(() => {
                            const currentLevel = getProfileCharacterLevel(selectedProfile, char.name);
                            const nextCost = currentLevel < MAX_CHARACTER_LEVEL ? getUpgradePointCost(currentLevel + 1) : 0;
                            const canUpgrade = currentLevel < MAX_CHARACTER_LEVEL && selectedProfile.levelPoints >= nextCost;
                            return (
                              <button onClick={() => onUpgradeCharacter(selectedProfile.id, char.name)} disabled={!canUpgrade}
                                className={`w-full border px-3 py-2 text-sm font-semibold transition ${canUpgrade ? "border-sky-300/22 bg-sky-300/10 text-sky-100 hover:bg-sky-300/14" : "border-white/10 bg-white/[0.03] text-white/35"}`}>
                                {currentLevel >= MAX_CHARACTER_LEVEL ? "Max Seviye" : `Yükselt • ${nextCost} Point`}
                              </button>
                            );
                          })()}
                          {isFounder && (
                            <button onClick={() => onRemoveFromInventory(selectedProfile.id, char.name)}
                              className="w-full border border-red-300/18 bg-red-300/8 px-3 py-2 text-sm text-red-100 transition hover:bg-red-300/12">
                              Karakteri Sil
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>



            {isFounder && (
              <div className="mb-5">
                <div className="mb-3 text-sm font-semibold text-white">Kurucu Karakter Ekle</div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {availableToAdd.map((char) => (
                    <button
                      key={`add-${char.id}`}
                      onClick={() => onAddToInventory(selectedProfile.id, char.name)}
                      className="border border-white/20 bg-white/[0.04] p-3 text-left transition hover:border-white/18 hover:bg-white/[0.08]"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-white">{char.name}</div>
                          <div className="mt-1 text-xs text-white/55">{char.rarity}</div>
                        </div>
                        <div className="border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/75">
                          Karakter Ekle
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </CutPanel>
      </div>
    </div>
  );
}


function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="group relative overflow-hidden border border-neutral-200 bg-white/72 p-5 shadow-[0_10px_28px_rgba(40,30,10,0.08)] backdrop-blur-sm"
      style={{
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.45),transparent_40%,transparent_70%,rgba(255,240,210,0.32))] opacity-80 transition group-hover:opacity-100" />
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-200 bg-white text-neutral-900 shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold text-neutral-900">{title}</div>
          <div className="mt-2 text-sm leading-7 text-neutral-700">{body}</div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoSection() {
  return (
    <div className="min-h-[600px]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-black/10 bg-white/80 shadow-sm">
          <BookOpen className="h-6 w-6 text-neutral-900" />
        </div>
        <div>
          <div className="text-2xl font-bold text-neutral-900">Bilgi</div>
          <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">Öğretici Rehber</div>
        </div>
      </div>

      <div
        className="overflow-hidden border border-neutral-200 bg-gradient-to-br from-[#fffdf7] via-[#faf5ea] to-[#f4ecdc] text-neutral-900 shadow-[0_12px_40px_rgba(30,20,10,0.10)]"
        style={{
          clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
        }}
      >
        <div className="border-b border-neutral-200 bg-white/55 px-6 py-6 backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-600">
            <Sparkles className="h-3.5 w-3.5" />
            Oyun İçi Rehber
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight">LEGOVERSEGAMES Oyun Rehberi</div>
          <div className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
            Bu bölüm yeni oyuncular için temel sistemi açıklar. Amaç; karakter rolleri, ulti dolum mantığı,
            yetenek yenilenmesi, maç süreleri, çark kazanımı ve takım kurma dengesini tek yerde anlaşılır biçimde toplamaktır.
          </div>
        </div>

        <div className="grid gap-5 p-6 xl:grid-cols-2">
          <InfoCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Ultiler nasıl dolar?"
            body="Ulti enerjisi rakibe hasar vurmak, takım savaşına katkı vermek ve maç içinde aktif kalmakla dolar. Destek karakterleri iyileştirme, kalkan ve takım yardımıyla da enerji kazanır. Tek atma, diriltme veya büyük alan kontrolü gibi güçlü ultiller daha yavaş dolmalıdır."
          />

          <InfoCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Yetenekler ne kadar sürede yenilenmeli?"
            body="Basit saldırı ve hareket yetenekleri genelde 5–8 saniye, orta güçte kontrol ve baskı yetenekleri 8–14 saniye, güçlü savunma ve takım desteği becerileri ise 14–22 saniye aralığında yenilenmelidir. Çok etkili kaçış veya alan kontrolü çok kısa sürede geri gelmemelidir."
          />

          <InfoCard
            icon={<Swords className="h-5 w-5" />}
            title="Bir maç ortalama kaç dakika sürmeli?"
            body="2v2 düello için 6–10 dakika, bayrak kapmaca ve kale savunma gibi takım modları için 10–16 dakika, turnuva modu için ise 15–22 dakika ideal aralıktır. Böylece strateji hissi korunur ama tempo da düşmez."
          />

          <InfoCard
            icon={<Gift className="h-5 w-5" />}
            title="Çarklar nasıl kazanılır?"
            body="Çarklar günlük görevler, haftalık etkinlikler, başarı görevleri ve özel turnuva ödülleriyle kazanılmalıdır. Acemi Çarkı daha sık, Akademi Çarkı düzenli oynayanlara, Turnuva Çarkı ise daha zor içeriklere bağlı verilirse sistem daha tatmin edici olur."
          />

          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="Karakter rolleri neden önemli?"
            body="Saldırı karakterleri baskı kurar, destek karakterleri takımı ayakta tutar, tanklar alan açar, kontrol karakterleri rakibi bozar, suikastçılar zayıf hedefleri hızlı düşürür, savunma karakterleri ise bölge tutmada öne çıkar. İyi takım kurmak için sadece rarity değil, rol dengesi de gerekir."
          />

          <InfoCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Yeni oyuncular için öneri"
            body="Önce Acemi veya Akademi Çarkı ile karakter havuzunu büyütmek, ardından rollere göre takım kurmayı öğrenmek en mantıklı yoldur. Destek ve kontrol karakterlerini erken öğrenmek çoğu zaman sadece hasar karakteri oynamaktan daha çok maç kazandırır."
          />
        </div>
      </div>
    </div>
  );
}




type QuestReward = {
  wheel: WheelType;
  amount: 1 | 2;
};

type QuestItem = {
  id: string;
  title: string;
  detail: string;
  difficulty: "Basit" | "Zor";
  reward: QuestReward;
};

const SIMPLE_DAILY_TASKS = [
  "1 maç tamamla",
  "2 maç tamamla",
  "3 rakibi sersemlet",
  "5 rakibe hasar ver",
  "1 kez ulti kullan",
  "2 kez ulti kullan",
  "1 destek karakteriyle oyna",
  "1 saldırı karakteriyle oyna",
  "1 ender karakter aç",
  "1 sıradan karakter aç",
  "envantere 1 karakter ekle",
  "1 maçta 3 yetenek kullan",
  "2 farklı karakter görüntüle",
  "1 bilgi sekmesini ziyaret et",
  "1 oyun modu kartı incele",
  "1 kez çark aç",
  "2 kez çark aç",
  "1 karakteri dikkatlice incele",
  "1 maçlık takım kur",
  "1 kristalize karakter görüntüle",
  "1 efsanevi karakter görüntüle",
  "5 saniye içinde 2 yetenek kullan",
  "1 tank karakter incele",
  "1 destek karakter incele",
  "1 suikastçı karakter incele",
  "1 savunma karakter incele",
  "1 kontrol karakter incele",
  "bir maç planı oluştur",
  "1 profil kodu kopyala",
  "1 profil kodu içe aktar",
  "3 farklı kart hover yap",
  "1 turnuva kartını aç",
  "1 bayrak kapmaca kartını aç",
  "1 kale savunma kartını aç",
  "1 gemi savaşları kartını aç",
  "1 araba yarışı kartını aç",
  "1 düello kartını aç",
  "1 profil adı güncelle",
  "1 envanter temasını değiştir",
  "1 karakter rolüne göre filtrele",
  "1 rarity’ye göre filtrele",
  "2 farklı rarity görüntüle",
  "1 destansı karakter incele",
  "1 omega karakter incele",
  "10 saniye menüde aktif kal",
  "1 takım destek kombosu düşün",
  "1 alan kontrol karakteri incele",
  "1 menzil türü karşılaştır",
  "1 karakterin ulti bilgisini oku",
  "1 karakterin yetenek 1 bilgisini oku",
  "1 karakterin yetenek 2 bilgisini oku",
  "1 oyunda loot stratejisi belirle",
  "1 profil seç",
  "1 envanter kartı aç",
  "1 yeni karakter öğren",
  "1 günlük görev menüsünü ziyaret et",
  "1 görev ödülünü incele",
  "2 mod arasında geçiş yap",
  "1 karakter kartını kaydır",
  "1 rarity sayacını kontrol et",
  "son açılanları incele",
];

const HARD_DAILY_TASKS = [
  "3 maç üst üste tamamla",
  "5 farklı karakter incele",
  "2 farklı rolde karakter filtrele",
  "3 kez çark aç",
  "1 gün içinde 2 ender veya üstü karakter aç",
  "1 maç planında tank + destek dengesi kur",
  "2 oyun modu arasında takım seçimi yap",
  "1 kristalize karakteri envantere ekle",
  "1 efsanevi karakteri envantere ekle",
  "5 karakterin yeteneklerini oku",
  "3 farklı profil ayarı değiştir",
  "2 görev ödülünü karşılaştır",
  "bir turnuva kadrosu planla",
  "4 farklı rarity görüntüle",
  "1 envanter temasını değiştirip kaydet",
  "1 profil kodunu dışa aktar",
  "1 profil kodunu içe aktar",
  "en az 3 karakteri role göre sınıflandır",
  "1 maçlık savunma kompozisyonu kur",
  "1 maçlık saldırı kompozisyonu kur",
  "1 görevler menüsünü tam incele",
  "1 bilgi sekmesinde tüm kartları oku",
  "1 akademi çarkı seçip aç",
  "1 akademi çarkı seçip aç",
  "2 kez envantere karakter ekle",
  "son açılanlardan 3 karakter incele",
  "1 tank, 1 destek, 1 saldırı karakter belirle",
  "1 oyunda kontrol ağırlıklı plan kur",
  "1 suikastçı ağırlıklı plan kur",
  "2 mod için ayrı kadro düşün",
  "1 nadir karakter açmaya çalış",
  "1 günlük seti tamamla",
  "1 büyük ödül için plan yap",
  "1 loot odaklı strateji belirle",
  "1 takım arkadaşını güçlendiren karakter seç",
  "1 alan savunması yapan karakter seç",
  "1 mobil karakter seç",
  "1 ağır savaşçı seç",
  "3 karakteri menziline göre ayır",
  "1 destek zinciri oluştur",
];

function randomQuestReward(difficulty: "Basit" | "Zor"): QuestReward {
  if (difficulty === "Basit") {
    return {
      wheel: "acemi",
      amount: Math.random() < 0.2 ? 2 : 1,
    };
  }

  // Turnuva Çarkı Anahtarı günlük görevlerden verilmez.
  // Bu anahtar sadece Canlı Event / özel event ödüllerinden kazanılır.
  return {
    wheel: "akademi",
    amount: Math.random() < 0.16 ? 2 : 1,
  };
}

function pickUniqueStrings(source: string[], count: number) {
  const copy = [...source];
  const picked: string[] = [];

  while (picked.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy[index]);
    copy.splice(index, 1);
  }

  return picked;
}

function makeQuestSet(): QuestItem[] {
  const basics = pickUniqueStrings(SIMPLE_DAILY_TASKS, 3).map((title, index) => ({
    id: `simple-${index}-${title}`,
    title,
    detail: "Kolay günlük görev. Düzenli oynayış ve menü etkileşimiyle tamamlanması hedeflenir.",
    difficulty: "Basit" as const,
    reward: randomQuestReward("Basit"),
  }));

  const hards = pickUniqueStrings(HARD_DAILY_TASKS, 2).map((title, index) => ({
    id: `hard-${index}-${title}`,
    title,
    detail: "Daha değerli ödül verir. Daha uzun dikkat, daha fazla etkileşim veya daha zor ilerleme ister.",
    difficulty: "Zor" as const,
    reward: randomQuestReward("Zor"),
  }));

  return [...basics, ...hards];
}

function QuestCard({ quest, completed, onComplete }: { quest: QuestItem; completed: boolean; onComplete: () => void }) {
  const hard = quest.difficulty === "Zor";

  return (
    <div
      className={`relative overflow-hidden border p-4 ${
        hard
          ? "border-amber-300/18 bg-gradient-to-br from-amber-200/12 via-orange-200/8 to-black/10"
          : "border-white/10 bg-white/[0.06]"
      }`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-white">{quest.title}</div>
          <div className={`mt-1 text-[11px] uppercase tracking-[0.16em] ${hard ? "text-amber-200/80" : "text-white/45"}`}>
            {quest.difficulty}
          </div>
        </div>
        <div className={`flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-[0.14em] ${hard ? "border-amber-300/22 bg-amber-200/10 text-amber-100" : "border-white/12 bg-white/8 text-white/80"}`}>
          <WheelKeyArt wheel={quest.reward.wheel} count={quest.reward.amount} size="small" />
          <span>{getQuestKeyRewardTitle(quest.reward)}</span>
        </div>
      </div>

      <div className="text-sm leading-6 text-white/72">{quest.detail}</div>
      <button
        onClick={onComplete}
        disabled={completed}
        className={`mt-4 w-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
          completed
            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
            : hard
            ? "border-amber-200/28 bg-amber-300/12 text-amber-100 hover:bg-amber-300/18"
            : "border-sky-200/24 bg-sky-300/10 text-sky-100 hover:bg-sky-300/16"
        }`}
      >
        {completed ? "Görev Alındı" : "Görevi Tamamladım"}
      </button>
    </div>
  );
}


function QuestKeyShowcase({ profile }: { profile: InventoryProfile }) {
  const themes: Record<WheelType, { frame: string; title: string; note: string }> = {
    acemi: {
      frame: "border-slate-300/20 bg-gradient-to-br from-slate-500/12 via-white/[0.04] to-black/25",
      title: "Acemi Anahtarı",
      note: "Kolay görevlerden sık gelir.",
    },
    akademi: {
      frame: "border-cyan-200/24 bg-gradient-to-br from-cyan-400/12 via-fuchsia-400/8 to-black/25",
      title: "Akademi Anahtarı",
      note: "Zor görevlerde daha değerlidir.",
    },
    turnuva: {
      frame: "border-amber-200/28 bg-gradient-to-br from-amber-300/14 via-orange-500/10 to-black/25",
      title: "Turnuva Anahtarı",
      note: "Sadece canlı eventlerden kazanılır.",
    },
  };

  return (
    <div className="mb-6 grid gap-3 md:grid-cols-3">
      {WHEEL_CONFIGS.map((wheel) => {
        const theme = themes[wheel.id];
        const count = getWheelKeyCount(profile, wheel.id);

        return (
          <div
            key={`quest-key-${wheel.id}`}
            className={`relative overflow-hidden border p-4 ${theme.frame}`}
            style={{
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_26%),linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)]" />
            <div className="relative flex items-center gap-4">
              <WheelKeyArt wheel={wheel.id} count={count} size="small" />
              <div className="min-w-0">
                <div className="text-sm font-black text-white">{theme.title}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/45">{count} adet var</div>
                <div className="mt-2 text-xs leading-5 text-white/58">{theme.note}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestsSection({ activeProfile, onAddWheelKeys }: { activeProfile: InventoryProfile; onAddWheelKeys: (id: InventoryProfile["id"], wheel: WheelType, amount: number) => void }) {
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [eventRewardClaimed, setEventRewardClaimed] = useState(false);

  useEffect(() => {
    setQuests(makeQuestSet());
    setCompletedQuestIds([]);
    setEventRewardClaimed(false);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10">
          <ScrollText className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Görevler</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">Günlük İlerleme</div>
        </div>
      </div>


      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden border border-white/20 bg-black/35"
          style={{
            clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
          }}
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-xl font-bold text-white">Günlük Görevler</div>
            <div className="mt-2 text-sm leading-6 text-white/65">
              Her site açılışında 5 görev rastgele gelir. Her görevin altında tamamladım butonu vardır.
              Ödüller artık direkt çark açtırmaz; envantere çark anahtarı olarak eklenir.
            </div>
          </div>

          <div className="space-y-3 p-5">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                completed={completedQuestIds.includes(quest.id)}
                onComplete={() => {
                  if (completedQuestIds.includes(quest.id)) return;
                  onAddWheelKeys(activeProfile.id, quest.reward.wheel, quest.reward.amount);
                  setCompletedQuestIds((prev) => [...prev, quest.id]);
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-amber-300/18 bg-gradient-to-br from-amber-200/10 via-orange-300/8 to-black/20 p-5"
            style={{
              clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
            }}
          >
            <div className="text-xl font-bold text-white">Kadim Duello</div>
            <div className="mt-2 text-sm leading-6 text-white/68">
              Kadim Duello bu sezonda Thunderfang baskınıyla açılıyor. Büyük ödül için artık vitrin değil,
              gerçek bir ortak boss avı var.
            </div>
          </div>

          <div
            className="relative overflow-hidden border border-orange-300/22 bg-gradient-to-br from-orange-300/12 via-red-500/8 to-black/25 p-5"
            style={{
              clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,190,90,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,60,60,0.14),transparent_32%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-orange-100/70">Canlı Event Özel Görevi</div>
                <div className="mt-1 text-lg font-black text-white">Thunderfang baskınını tamamla</div>
                <div className="mt-2 text-sm leading-6 text-white/65">
                  Bu özel görev günlük görevlerden ayrı çalışır ve ödül olarak direkt Turnuva Çarkı Anahtarı verir.
                </div>
              </div>
              <WheelKeyArt wheel="turnuva" count={eventRewardClaimed ? 0 : 1} size="normal" />
            </div>
            <button
              onClick={() => {
                if (eventRewardClaimed) return;
                onAddWheelKeys(activeProfile.id, "turnuva", 1);
                setEventRewardClaimed(true);
              }}
              disabled={eventRewardClaimed}
              className={`relative mt-5 w-full border px-4 py-3 text-xs font-black uppercase tracking-[0.16em] transition ${
                eventRewardClaimed
                  ? "border-emerald-300/22 bg-emerald-300/10 text-emerald-100"
                  : "border-orange-200/30 bg-orange-300/14 text-orange-100 hover:bg-orange-300/22"
              }`}
            >
              {eventRewardClaimed ? "Turnuva Anahtarı Alındı" : "Görevi Tamamladım • 1x Turnuva Anahtarı"}
            </button>
          </div>

          <ThunderfangEvent compact />
        </div>
      </div>
    </div>
  );
}



type StoreChestStage = 0 | 1 | 2 | 3 | 4;

type ShopChestId = "kalitesiz" | "exo" | "rick" | "premium";

type ChestReward =
  | { kind: "credits"; amount: number; label: string }
  | { kind: "levelPoints"; amount: number; label: string }
  | { kind: "wheelKey"; wheel: WheelType; amount: number; label: string }
  | { kind: "character"; character: string; rarity: RarityName; side: Side | null; label: string }
  | { kind: "empty"; label: string };

type ShopChestConfig = {
  id: ShopChestId;
  name: string;
  subtitle: string;
  price: number;
  accent: string;
  panelClass: string;
  glowClass: string;
  iconLabel: string;
  openingVerb: string;
  characterChance: number;
  creditRange: [number, number];
  pointRange: [number, number];
  keyChance: number;
  keyWeights: Record<WheelType, number>;
  rewardSlots: number;
  countBadge: number;
  weights: Record<RarityName, number>;
};

const SHOP_CHESTS: ShopChestConfig[] = [
  {
    id: "kalitesiz",
    name: "Kalitesiz Sandık",
    subtitle: "Çatlak tahta kasa. Ucuz, riskli ve genelde küçük kredi/point parçaları verir.",
    price: 5,
    accent: "from-[#2a160b] via-[#4a2a14] to-[#120b07]",
    panelClass: "border-amber-950/70 bg-gradient-to-br from-[#2a160b] via-[#4a2a14] to-[#120b07]",
    glowClass: "bg-orange-700/38",
    iconLabel: "KASA",
    openingVerb: "Tahta kilitler çatırdıyor; kapağın arası açılıyor...",
    characterChance: 0.06,
    creditRange: [1, 3],
    pointRange: [20, 60],
    keyChance: 0.03,
    keyWeights: { acemi: 88, akademi: 11, turnuva: 1 },
    rewardSlots: 3,
    countBadge: 3,
    weights: { Sıradan: 82, Ender: 14, Destansı: 3.3, Efsanevi: 0.6, Kristalize: 0.09, Omega: 0.01 },
  },
  {
    id: "exo",
    name: "EXO Ganimeti",
    subtitle: "Askeri kilitli ganimet kasası. Daha çok parçalı ödül, daha dengeli karakter şansı.",
    price: 10,
    accent: "from-slate-950 via-sky-950 to-cyan-900",
    panelClass: "border-cyan-300/45 bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-800",
    glowClass: "bg-cyan-300/55",
    iconLabel: "EXO",
    openingVerb: "EXO kilitleri çözülüyor; güvenlik çizgileri yeşile dönüyor...",
    characterChance: 0.12,
    creditRange: [2, 5],
    pointRange: [45, 120],
    keyChance: 0.055,
    keyWeights: { acemi: 65, akademi: 30, turnuva: 5 },
    rewardSlots: 5,
    countBadge: 5,
    weights: { Sıradan: 66, Ender: 22, Destansı: 8.5, Efsanevi: 2.7, Kristalize: 0.7, Omega: 0.1 },
  },
  {
    id: "premium",
    name: "Premium Kristal Sandık",
    subtitle: "Kristal kırma animasyonlu özel sandık. Rick'ten önce gelir; daha ucuz ama yüksek nadirlikte kontrollüdür.",
    price: 20,
    accent: "from-fuchsia-950 via-indigo-950 to-amber-900",
    panelClass: "border-fuchsia-300/50 bg-gradient-to-br from-fuchsia-950 via-indigo-900 to-amber-700",
    glowClass: "bg-fuchsia-300/65",
    iconLabel: "KRİSTAL",
    openingVerb: "Kristal çatlıyor; iç çekirdek ışık vermeye başlıyor...",
    characterChance: 0.18,
    creditRange: [3, 8],
    pointRange: [80, 220],
    keyChance: 0.075,
    keyWeights: { acemi: 46, akademi: 42, turnuva: 12 },
    rewardSlots: 7,
    countBadge: 7,
    weights: { Sıradan: 54, Ender: 25, Destansı: 13.5, Efsanevi: 5, Kristalize: 2, Omega: 0.5 },
  },
  {
    id: "rick",
    name: "Rick'in Bavulu",
    subtitle: "Portal sızıntılı final bavulu. En pahalı sandık; Omega oranı tam %5, ama karakter yine garanti değil.",
    price: 30,
    accent: "from-[#103d24] via-[#28b56a] to-[#3f1b69]",
    panelClass: "border-lime-300/55 bg-gradient-to-br from-[#103d24] via-[#28b56a] to-[#3f1b69]",
    glowClass: "bg-lime-300/60",
    iconLabel: "RICK",
    openingVerb: "Portal menteşeleri açılıyor; bavulun içinden yeşil ışık taşıyor...",
    characterChance: 0.25,
    creditRange: [5, 12],
    pointRange: [140, 360],
    keyChance: 0.1,
    keyWeights: { acemi: 30, akademi: 45, turnuva: 25 },
    rewardSlots: 9,
    countBadge: 9,
    weights: { Sıradan: 35, Ender: 25, Destansı: 18, Efsanevi: 11, Kristalize: 6, Omega: 5 },
  },
];

function getChestById(id: ShopChestId) {
  return SHOP_CHESTS.find((chest) => chest.id === id) ?? SHOP_CHESTS[0];
}

function formatChestOdds(chest: ShopChestConfig) {
  return RARITY_ORDER
    .map((rarity) => `${rarity}: %${chest.weights[rarity].toLocaleString("tr-TR")}`)
    .join(" • ");
}

function getChestOpeningHint(chest: ShopChestConfig, stage: StoreChestStage) {
  if (stage < 4) return chest.openingVerb;
  return "Sandık kırıldı/açıldı. Şimdi ödüller tek tek geliyor.";
}

function pickStoreChestResult(excluded: string[], chest: ShopChestConfig) {
  const rarityItems = RARITY_ORDER.map((name) => ({ name, weight: chest.weights[name] }));
  const chosenRarity = weightedPick(rarityItems).name;
  const rewardRarity = pickAvailableRarityForOwned(chosenRarity, excluded, rarityItems);

  if (!rewardRarity) return null;

  const pool = getUnownedCharacterNamesForRarity(rewardRarity, excluded);
  const character = randomFrom(pool);
  const found = getCharacterByName(character);

  return {
    rarity: rewardRarity,
    character,
    side: found?.side ?? null,
  };
}

function pickChestWheelKey(chest: ShopChestConfig): WheelType {
  const wheel = weightedPick((Object.keys(chest.keyWeights) as WheelType[]).map((name) => ({ name, weight: chest.keyWeights[name] })));
  return wheel.name;
}

function rollShopChestRewards(chest: ShopChestConfig, excluded: string[]): ChestReward[] {
  const rewards: ChestReward[] = [];
  const firstCredit = randomInt(chest.creditRange[0], chest.creditRange[1]);
  const firstPoint = randomInt(chest.pointRange[0], chest.pointRange[1]);

  rewards.push({ kind: "credits", amount: firstCredit, label: `${firstCredit} Oyun Kredisi` });
  rewards.push({ kind: "levelPoints", amount: firstPoint, label: `${formatPointAmount(firstPoint)} Seviye Point` });

  while (rewards.length < chest.rewardSlots) {
    const keyRoll = Math.random() < chest.keyChance;
    if (keyRoll) {
      const wheel = pickChestWheelKey(chest);
      rewards.push({ kind: "wheelKey", wheel, amount: 1, label: `1x ${WHEEL_KEY_LABELS[wheel]}` });
      continue;
    }

    const giveCredits = Math.random() < 0.38;
    if (giveCredits) {
      const amount = randomInt(Math.max(1, Math.floor(chest.creditRange[0] * 0.55)), Math.max(1, Math.floor(chest.creditRange[1] * 0.8)));
      rewards.push({ kind: "credits", amount, label: `${amount} Oyun Kredisi` });
    } else {
      const amount = randomInt(Math.max(10, Math.floor(chest.pointRange[0] * 0.45)), Math.max(18, Math.floor(chest.pointRange[1] * 0.75)));
      rewards.push({ kind: "levelPoints", amount, label: `${formatPointAmount(amount)} Seviye Point` });
    }
  }

  if (Math.random() < chest.characterChance) {
    const result = pickStoreChestResult(excluded, chest);
    if (result) {
      rewards.push({
        kind: "character",
        character: result.character,
        rarity: result.rarity,
        side: result.side,
        label: result.character,
      });
    } else {
      const amount = Math.max(chest.pointRange[1], 500);
      rewards.push({ kind: "levelPoints", amount, label: `${formatPointAmount(amount)} Seviye Point` });
    }
  }

  return rewards;
}

function getChestVisibleRewardCount(chest: ShopChestConfig, rewards: ChestReward[]) {
  const hasCharacter = rewards.some((reward) => reward.kind === "character");
  return chest.countBadge + (hasCharacter ? 1 : 0);
}

function getChestRemainingCount(chest: ShopChestConfig, rewards: ChestReward[], revealed: ChestReward[]) {
  return Math.max(0, getChestVisibleRewardCount(chest, rewards) - revealed.length);
}

function getChestReadableOdds(chest: ShopChestConfig) {
  return [
    `Karakter çıkma: %${Math.round(chest.characterChance * 100)}`,
    `Kredi ödülü: %100 / ${chest.creditRange[0]}-${chest.creditRange[1]}`,
    `Point ödülü: %100 / ${formatPointAmount(chest.pointRange[0])}-${formatPointAmount(chest.pointRange[1])}`,
    `Anahtar ihtimali: %${Math.round(chest.keyChance * 100)}`,
  ].join(" • ");
}

function ShopSection({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onImportByCode,
  shopCodeInput,
  setShopCodeInput,
  onAddCredits,
  onConsumeCredits,
  onAddItem,
  onAdjustRank,
  onAddLevelPoints,
  onAddWheelKeys,
  uiSfx,
}: {
  profiles: InventoryProfile[];
  selectedProfileId: InventoryProfile["id"];
  onSelectProfile: (id: InventoryProfile["id"]) => void;
  onImportByCode: () => void;
  shopCodeInput: string;
  setShopCodeInput: (value: string) => void;
  onAddCredits: (id: InventoryProfile["id"], amount: number, matches?: number) => void;
  onConsumeCredits: (id: InventoryProfile["id"], amount: number) => void;
  onAddItem: (id: InventoryProfile["id"], name: string) => void;
  onAdjustRank: (id: InventoryProfile["id"], delta: number) => void;
  onAddLevelPoints: (id: InventoryProfile["id"], amount: number) => void;
  onAddWheelKeys: (id: InventoryProfile["id"], wheel: WheelType, amount: number) => void;
  uiSfx: ReturnType<typeof useUiSfx>;
}) {
  const [message, setMessage] = useState("Dükkan premium EXO tedarik ağı ile yönetilir.");
  const [crystalStage, setCrystalStage] = useState<StoreChestStage>(0);
  const [chestOpening, setChestOpening] = useState(false);
  const [activeChestId, setActiveChestId] = useState<ShopChestId>("kalitesiz");
  const [chestRewards, setChestRewards] = useState<ChestReward[]>([]);
  const [revealedRewards, setRevealedRewards] = useState<ChestReward[]>([]);
  const [pendingResult, setPendingResult] = useState<ResultItem | null>(null);
  const [dailyOffers] = useState<CharacterInfo[]>(() => makeDailyShopOffers());
  const [surveyMode, setSurveyMode] = useState<string>("turnuva");
  const [surveyWon, setSurveyWon] = useState<"kazandım" | "kaybettim">("kazandım");
  const [storeTab, setStoreTab] = useState<"sandiklar" | "magaza">("sandiklar");

  const activeProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];
  const founderAccess = activeProfile.id === "founder";

  const tryPurchaseCredits = (amount: number) => {
    if (!founderAccess) {
      if (amount === 25) {
        setMessage("Üzgünüz, işleminiz reddedildi. EXO sistemi bu paketi sana vermedi. Şimdilik kredi yok 😄");
      } else if (amount === 50) {
        setMessage("İşlem yine reddedildi. EXO market bakıp 'bu biraz iddialı olmuş' dedi. Önce biraz daha maç kazan 😄");
      } else {
        setMessage("Üzgünüz, 100 kredi talebin dramatik şekilde reddedildi. EXO kasası sana baktı, sessizce kapağını kapattı ve başka yöne döndü 😄");
      }
      uiSfx.fail();
      return;
    }

    onAddCredits(activeProfile.id, amount);
    setMessage("EXO şirketi size bunu ısmarlıyor.");
    uiSfx.shopBuy();
  };

  const openShopChest = (chestId: ShopChestId) => {
    const chest = getChestById(chestId);
    if (activeProfile.credits < chest.price) {
      setMessage(`${chest.name} için ${chest.price} oyun kredisi gerekli.`);
      uiSfx.fail();
      return;
    }

    onConsumeCredits(activeProfile.id, chest.price);
    setActiveChestId(chest.id);
    setCrystalStage(0);
    setPendingResult(null);
    setChestRewards(rollShopChestRewards(chest, activeProfile.items));
    setRevealedRewards([]);
    setChestOpening(true);
    setMessage(`${chest.name} açılıyor. Önce sandık kırılır/açılır; sonra ödüller tek tek azalacak sayaçla gösterilir.`);
    uiSfx.shopBuy();
  };

  const openCrystalChest = () => openShopChest("premium");

  const revealNextChestReward = () => {
    if (!chestOpening) return;

    if (crystalStage < 4) {
      const next = (crystalStage + 1) as StoreChestStage;
      setCrystalStage(next);
      uiSfx.crystalTap(next);
      setMessage(getChestOpeningHint(getChestById(activeChestId), next));
      return;
    }

    const reward = chestRewards[revealedRewards.length];
    if (!reward) {
      setChestOpening(false);
      setCrystalStage(0);
      setMessage("Sandık açılımı tamamlandı.");
      uiSfx.crystalBreak();
      return;
    }

    if (reward.kind === "credits") {
      onAddCredits(activeProfile.id, reward.amount);
      setMessage(`Ödül: +${reward.amount} oyun kredisi.`);
    } else if (reward.kind === "levelPoints") {
      onAddLevelPoints(activeProfile.id, reward.amount);
      setMessage(`Ödül: +${formatPointAmount(reward.amount)} seviye point.`);
    } else if (reward.kind === "wheelKey") {
      onAddWheelKeys(activeProfile.id, reward.wheel, reward.amount);
      setMessage(`Ödül: ${reward.label}. Anahtar envantere eklendi.`);
    } else if (reward.kind === "character") {
      if (activeProfile.items.includes(reward.character)) {
        const duplicateBonus = Math.max(300, Math.round((rarityRank[reward.rarity] + 1) * 420));
        onAddLevelPoints(activeProfile.id, duplicateBonus);
        setMessage(`${reward.character} zaten vardı. Tekrar çıktığı için +${formatPointAmount(duplicateBonus)} seviye point verildi.`);
      } else {
        onAddItem(activeProfile.id, reward.character);
        setMessage(`Karakter çıktı: ${reward.character}. Hesaba eklendi.`);
      }
      setPendingResult({ rarity: reward.rarity, character: reward.character, side: reward.side });
    } else {
      setMessage("Bu sandıktan karakter çıkmadı. Bu normal; sandıklar garanti karakter vermiyor.");
    }

    setRevealedRewards((prev) => [...prev, reward]);
    uiSfx.crystalBreak();
  };

  const crackCrystal = revealNextChestReward;

  const addPendingToAccount = () => {
    setPendingResult(null);
    setMessage("Karakter ödülü zaten hesaba işlendi.");
    uiSfx.shopBuy();
  };

  const buyDailyOffer = (character: CharacterInfo) => {
    const price = getCharacterPrice(character);

    if (activeProfile.items.includes(character.name)) {
      setMessage(`${character.name} zaten bu hesapta var.`);
      uiSfx.fail();
      return;
    }

    if (activeProfile.credits < price) {
      setMessage(`${character.name} için ${price} coin gerekli.`);
      uiSfx.fail();
      return;
    }

    onConsumeCredits(activeProfile.id, price);
    onAddItem(activeProfile.id, character.name);
    setMessage(`${character.name} dükkandan satın alındı.`);
    uiSfx.shopBuy();
  };

  const buyLevelPointBundle = (amount: number) => {
    const price = amount === 50 ? 8 : amount === 150 ? 22 : 45;
    if (activeProfile.credits < price) {
      setMessage(`${formatPointAmount(amount)} seviye point için ${price} oyun kredisi gerekli.`);
      uiSfx.fail();
      return;
    }
    onConsumeCredits(activeProfile.id, price);
    onAddLevelPoints(activeProfile.id, amount);
    setMessage(`${formatPointAmount(amount)} seviye point malzemelere eklendi.`);
    uiSfx.shopBuy();
  };

  const buyWheelKeyBundle = (wheel: WheelType) => {
    const priceMap: Record<WheelType, number> = { acemi: 12, akademi: 24, turnuva: 42 };
    const price = priceMap[wheel];
    if (activeProfile.credits < price) {
      setMessage(`${WHEEL_KEY_LABELS[wheel]} için ${price} oyun kredisi gerekli.`);
      uiSfx.fail();
      return;
    }
    onConsumeCredits(activeProfile.id, price);
    onAddWheelKeys(activeProfile.id, wheel, 1);
    setMessage(`1x ${WHEEL_KEY_LABELS[wheel]} satın alındı ve malzemelere eklendi.`);
    uiSfx.shopBuy();
  };

  const submitMatchSurvey = () => {
    const delta = getMatchSurveyRankDelta(surveyMode, surveyWon === "kazandım");
    onAddCredits(activeProfile.id, 1, 1);
    onAdjustRank(activeProfile.id, delta);
    setMessage(
      surveyWon === "kazandım"
        ? `Maç kaydı işlendi. +1 coin ve +${delta} rank puanı kazandın.`
        : `Maç kaydı işlendi. +1 coin aldın, ${Math.abs(delta)} rank puanı düştü.`
    );
    uiSfx.shopBuy();
  };


  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/10 shadow-[0_0_24px_rgba(255,220,120,0.12)]">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Dükkan</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">EXO Premium Market</div>
        </div>
      </div>

      <div
        className="overflow-hidden border border-white/12 bg-gradient-to-br from-[#eaf6ff] via-[#f5fbff] to-[#fff2ce] text-neutral-900 shadow-[0_24px_80px_rgba(25,45,65,0.24)]"
        style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
      >
        <div className="relative overflow-hidden border-b border-neutral-200/70 bg-white/55 px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,120,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(120,210,255,0.12),transparent_24%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 border border-amber-300/30 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-700">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Market
            </div>
            <div className="mt-3 text-3xl font-black tracking-tight">EXO Şirketi Premium Mağaza</div>
            <div className="mt-2 max-w-3xl text-sm leading-6 text-neutral-700">
              Burada hesap kodunla giriş yapabilir, kredi durumunu görebilir, Mağaza bölümünden küçük point paketleri alabilir
              veya Sandıklar bölümünde Brawl Stars tarzı ödül açılımı yapabilirsin.
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <div className="relative overflow-hidden border border-neutral-200 bg-white/72 p-5 shadow-[0_10px_30px_rgba(30,30,30,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,140,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.28),transparent_36%)]" />
              <div className="relative">
                <div className="mb-3 text-lg font-bold">Oyuncu Hesabı</div>

                <div className="mb-4 flex flex-wrap gap-3">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        onSelectProfile(profile.id);
                        uiSfx.tab();
                      }}
                      onMouseEnter={uiSfx.hoverSoft}
                      className={`border px-4 py-2 text-sm transition ${
                        selectedProfileId === profile.id
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_0_26px_rgba(20,20,20,0.12)]"
                          : "border-neutral-300 bg-white/80 text-neutral-800 hover:bg-white"
                      }`}
                    >
                      {profile.name}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Aktif Hesap</div>
                    <div className="mt-1 text-lg font-bold">{activeProfile.name}</div>
                  </div>
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Hesap Kodu</div>
                    <div className="mt-1 text-lg font-bold">{activeProfile.code}</div>
                  </div>
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Oyun Kredisi</div>
                    <div className="mt-1 flex items-center gap-2 text-lg font-black text-amber-700">
                      <Coins className="h-5 w-5" />
                      {activeProfile.credits}
                    </div>
                  </div>
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Seviye Point</div>
                    <div className="mt-1 flex items-center gap-2 text-lg font-black text-sky-700"><Star className="h-5 w-5" />{activeProfile.levelPoints}</div>
                  </div>
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Toplam Maç</div>
                    <div className="mt-1 text-lg font-bold">{activeProfile.matchesPlayed}</div>
                  </div>
                  <div className="border border-neutral-200 bg-white/86 p-4 shadow-sm md:col-span-2">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Sezon Rankı</div>
                    <div className="mt-1 text-lg font-black text-neutral-900">{getRankInfo(activeProfile.rankPoints ?? 0).name}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                      <div className="h-full rounded-full bg-neutral-900" style={{ width: `${getRankInfo(activeProfile.rankPoints ?? 0).progress}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-neutral-500">{activeProfile.rankPoints ?? 0} RP</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    value={shopCodeInput}
                    onChange={(e) => setShopCodeInput(e.target.value)}
                    placeholder="Hesap kodunu veya profil verisini yapıştır..."
                    className="border border-neutral-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-neutral-400"
                  />
                  <button
                    onClick={() => {
                      onImportByCode();
                      uiSfx.shopBuy();
                    }}
                    onMouseEnter={uiSfx.hoverSoft}
                    className="border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Hesabı Yükle
                  </button>
                </div>
              </div>
            </div>

            {storeTab === "magaza" && (
            <>
            <div className="relative overflow-hidden border border-amber-300/28 bg-gradient-to-br from-white via-[#fffaf0] to-[#ffeac4] p-5 shadow-[0_12px_34px_rgba(255,190,90,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,120,0.18),transparent_24%)]" />
              <div className="relative">
                <div className="mb-3 text-lg font-bold">Para ile Satın Alma</div>
                <div className="mb-4 text-sm leading-6 text-neutral-700">
                  Şimdilik normal hesaplarda ödeme altyapısı kapalıdır. Kurucu erişimiyle test edildiğinde
                  EXO şirketi promosyon tanımlar ve hesabına kredi gönderir.
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => tryPurchaseCredits(amount)}
                      onMouseEnter={uiSfx.hoverSoft}
                      className="group relative overflow-hidden border border-amber-300/35 bg-gradient-to-b from-white to-amber-50 px-4 py-4 text-left shadow-sm transition hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.45),transparent_40%,transparent_70%,rgba(255,220,120,0.16))] opacity-80" />
                      <div className="relative">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Paket</div>
                        <div className="mt-1 text-xl font-black text-amber-700">{amount} Kredi</div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
                          <CreditCard className="h-4 w-4" />
                          Test Satın Al
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-sky-300/28 bg-gradient-to-br from-white via-[#f2fbff] to-[#dff5ff] p-5 shadow-[0_12px_34px_rgba(90,190,255,0.14)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(90,190,255,0.18),transparent_24%)]" />
              <div className="relative">
                <div className="mb-2 text-lg font-bold">Alınabilir Seviye Point</div>
                <div className="mb-4 text-sm leading-6 text-neutral-700">Karakter yükseltmek için kullanılır. Üst seviyelerde tek level için daha fazla point ister.</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[50, 150, 300].map((amount) => {
                    const price = amount === 50 ? 8 : amount === 150 ? 22 : 45;
                    return (
                      <button key={`level-point-${amount}`} onClick={() => buyLevelPointBundle(amount)} onMouseEnter={uiSfx.hoverSoft}
                        className="group relative overflow-hidden border border-sky-300/35 bg-gradient-to-b from-white to-sky-50 px-4 py-4 text-left shadow-sm transition hover:-translate-y-1">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Malzeme</div>
                        <div className="mt-1 text-xl font-black text-sky-700">+{formatPointAmount(amount)} Point</div>
                        <div className="mt-2 text-sm text-neutral-700">{price} oyun kredisi</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-violet-300/28 bg-gradient-to-br from-white via-[#f7f2ff] to-[#fff0dc] p-5 shadow-[0_12px_34px_rgba(140,90,255,0.14)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,120,255,0.20),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,190,90,0.16),transparent_26%)]" />
              <div className="relative">
                <div className="mb-2 text-lg font-bold">Çark Anahtarı Satın Al</div>
                <div className="mb-4 text-sm leading-6 text-neutral-700">Anahtarlar çark açmak için kullanılır. Görevden kazanmak daha iyi; dükkandan almak pahalı acil çözüm.</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["acemi", "akademi", "turnuva"] as WheelType[]).map((wheel) => {
                    const priceMap: Record<WheelType, number> = { acemi: 12, akademi: 24, turnuva: 42 };
                    return (
                      <button key={`buy-key-${wheel}`} onClick={() => buyWheelKeyBundle(wheel)} onMouseEnter={uiSfx.hoverSoft}
                        className="group relative overflow-hidden border border-violet-300/35 bg-gradient-to-b from-white to-violet-50 px-4 py-4 text-left shadow-sm transition hover:-translate-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Anahtar</div>
                            <div className="mt-1 text-sm font-black text-neutral-900">{WHEEL_KEY_LABELS[wheel]}</div>
                            <div className="mt-2 text-sm text-neutral-700">{priceMap[wheel]} oyun kredisi</div>
                          </div>
                          <WheelKeyArt wheel={wheel} size="small" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            </>
            )}
          </div>

          <div className="space-y-5">
            <div className="relative overflow-hidden border border-neutral-200 bg-white/80 p-4 shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-neutral-200 bg-white/70 p-2">
                {[{ id: "sandiklar" as const, label: "Sandıklar", icon: <Package2 className="h-4 w-4" /> }, { id: "magaza" as const, label: "Mağaza", icon: <ShoppingBag className="h-4 w-4" /> }].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setStoreTab(tab.id); uiSfx.tab(); }}
                    onMouseEnter={uiSfx.hoverSoft}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition ${
                      storeTab === tab.id
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                        : "border-neutral-200 bg-white/80 text-neutral-700 hover:bg-white"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {storeTab === "magaza" && (
            <div className="relative overflow-hidden border border-neutral-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(30,30,30,0.08)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-bold">Günlük Karakter Pazarı</div>
                  <div className="mt-1 text-sm text-neutral-700">
                    Her oyun açılışında tekliflerin rastgele yenilenir. Fiyatlar rarity seviyesine göre ayarlanır.
                  </div>
                </div>
                <div className="border border-neutral-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-700">
                  Random Market
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {dailyOffers.map((char) => {
                  const price = getCharacterPrice(char);
                  const alreadyOwned = activeProfile.items.includes(char.name);

                  return (
                    <div
                      key={`offer-${char.id}`}
                      className="overflow-hidden border border-neutral-200 bg-white/90 shadow-sm"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                      }}
                    >
                      <div className={`relative h-44 overflow-hidden bg-gradient-to-b ${getCharacterPanelBg(char)}`}>
                        <AssetImage
                          src={char.image || ""}
                          alt={char.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                        <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2 border border-white/20 bg-black/35 px-3 py-1.5">
                            <RarityLogo rarity={char.rarity} side={char.side} size={14} />
                            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                              {char.rarity}
                            </span>
                          </div>
                          <div className="shrink-0 border border-amber-300/20 bg-amber-300/12 px-3 py-1.5 text-xs font-black text-amber-100">
                            {price} coin
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-[1.75rem] leading-[1.05] font-black text-white">{char.name}</div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/72">
                            {char.role} • {char.range}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <button
                          onClick={() => buyDailyOffer(char)}
                          disabled={alreadyOwned}
                          className={`w-full border px-4 py-3 text-sm font-semibold ${
                            alreadyOwned
                              ? "border-neutral-200 bg-neutral-100 text-neutral-400"
                              : "border-neutral-900 bg-neutral-900 text-white"
                          }`}
                        >
                          {alreadyOwned ? "Zaten Sende Var" : "Satın Al"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {storeTab === "sandiklar" && (
            <>
            <div className="relative overflow-hidden border border-neutral-200 bg-white/78 p-5 shadow-[0_16px_38px_rgba(30,30,30,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,120,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.12),transparent_24%)]" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">Sandıklar</div>
                    <div className="mt-1 text-sm text-neutral-700">
                      Brawl Stars mantığı: önce sandık açılır/kırılır, sonra ödüller sayaç azalarak tek tek gelir.
                    </div>
                  </div>
                  <div className="border border-neutral-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-700">
                    Garanti karakter yok
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                  {SHOP_CHESTS.map((chest) => (
                    <button
                      key={chest.id}
                      onClick={() => openShopChest(chest.id)}
                      onMouseEnter={uiSfx.hoverSoft}
                      className={`group relative min-h-[430px] overflow-hidden border p-5 text-left shadow-[0_18px_42px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.16)] ${chest.panelClass}`}
                      style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
                    >
                      <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl ${chest.glowClass}`} />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_32%,transparent_68%,rgba(0,0,0,0.22))]" />
                      <div className="relative mb-4 flex h-36 items-center justify-center overflow-hidden rounded-[28px] border border-white/25 bg-black/10 shadow-[inset_0_0_38px_rgba(255,255,255,0.14)]">
                        {chest.id === "premium" ? (
                          <div className="relative h-28 w-24">
                            <div className="absolute inset-x-2 bottom-1 h-8 rounded-full bg-fuchsia-300/60 blur-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 via-fuchsia-300 to-indigo-700 shadow-[0_0_70px_rgba(230,120,255,0.62)]" style={{ clipPath: "polygon(50% 0%, 82% 16%, 100% 48%, 84% 88%, 50% 100%, 16% 88%, 0% 48%, 18% 16%)" }} />
                            <div className="absolute left-6 top-5 h-12 w-3 rounded-full bg-white/45 blur-sm" />
                          </div>
                        ) : chest.id === "rick" ? (
                          <div className="relative h-24 w-[120px]">
                            <div className="absolute inset-x-2 bottom-0 h-8 rounded-full bg-lime-300/60 blur-2xl" />
                            <div className="absolute left-1 top-7 h-16 w-28 rounded-2xl border border-emerald-900/30 bg-gradient-to-b from-emerald-500 via-lime-300 to-emerald-800 shadow-[0_20px_32px_rgba(0,0,0,0.28)]" />
                            <div className="absolute left-5 top-2 h-12 w-20 rounded-t-3xl border-4 border-emerald-950/40 border-b-0" />
                            <div className="absolute left-10 top-11 h-8 w-10 rounded-full border border-white/60 bg-cyan-200/60 shadow-[0_0_24px_rgba(125,255,190,0.75)]" />
                            <div className="absolute right-3 top-8 h-4 w-4 rounded-full bg-violet-300/80" />
                          </div>
                        ) : chest.id === "exo" ? (
                          <div className="relative h-24 w-[120px]">
                            <div className="absolute inset-x-2 bottom-0 h-8 rounded-full bg-cyan-300/60 blur-2xl" />
                            <div className="absolute left-1 top-6 h-16 w-28 rounded-xl border border-cyan-200/50 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_20px_32px_rgba(0,0,0,0.38)]" />
                            <div className="absolute inset-x-4 top-10 h-2 bg-cyan-300/70 shadow-[0_0_16px_rgba(103,232,249,0.8)]" />
                            <div className="absolute left-10 top-12 rounded-md border border-cyan-200/60 bg-cyan-300/20 px-2 py-1 text-[10px] font-black text-cyan-100">EXO</div>
                          </div>
                        ) : (
                          <div className="relative h-24 w-[120px]">
                            <div className="absolute inset-x-2 bottom-0 h-8 rounded-full bg-stone-400/50 blur-2xl" />
                            <div className="absolute left-2 top-8 h-16 w-28 rounded-xl border border-amber-950/25 bg-gradient-to-b from-amber-500 via-amber-700 to-stone-800 shadow-[0_20px_32px_rgba(0,0,0,0.30)]" />
                            <div className="absolute left-4 top-4 h-10 w-22 rounded-t-2xl border-4 border-amber-950/25 border-b-0" />
                            <div className="absolute inset-x-4 top-13 h-2 bg-black/18" />
                            <div className="absolute left-12 top-13 h-5 w-6 rounded bg-amber-200/60" />
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">
                          {chest.iconLabel}
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`text-lg font-black text-white`}>{chest.name}</div>
                            <div className={`mt-1 min-h-[54px] text-xs leading-5 text-white/74`}>{chest.subtitle}</div>
                          </div>
                          <Package2 className={`h-5 w-5 text-white/75`} />
                        </div>

                        <div className={`mt-4 grid grid-cols-2 gap-2 text-xs text-white/82`}>
                          <div className="border border-white/25 bg-white/18 px-3 py-2">
                            <div className="font-black">{chest.price} Kredi</div>
                            <div className="opacity-70">Açma bedeli</div>
                          </div>
                          <div className="border border-white/25 bg-white/18 px-3 py-2">
                            <div className="font-black">%{Math.round(chest.characterChance * 100)}</div>
                            <div className="opacity-70">Karakter şansı</div>
                          </div>
                        </div>

                        <div className="mt-3 border border-white/25 bg-white/16 p-3 text-[11px] leading-5 text-white/82">
                          <div className="mb-1 font-black uppercase tracking-[0.14em] opacity-80">Temel Ödül Oranları</div>
                          {getChestReadableOdds(chest)}
                        </div>

                        <div className="mt-3 border border-white/25 bg-white/16 p-3 text-[11px] leading-5 text-white/82">
                          <div className="mb-1 font-black uppercase tracking-[0.14em] opacity-80">Anahtar Çıkarsa Dağılım</div>
                          Acemi %{chest.keyWeights.acemi} • Akademi %{chest.keyWeights.akademi} • Turnuva %{chest.keyWeights.turnuva}
                        </div>

                        <div className="mt-3 border border-white/25 bg-white/16 p-3 text-[11px] leading-5 text-white/82">
                          <div className="mb-1 font-black uppercase tracking-[0.14em] opacity-80">Karakter Çıkarsa Enderlik</div>
                          {formatChestOdds(chest)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-amber-300/35 bg-gradient-to-br from-[#fffdf7] via-[#f7fbff] to-[#fff2cf] p-5 shadow-[0_18px_44px_rgba(255,190,70,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,220,150,0.20),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.10),transparent_26%)]" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">Sandık Açılım Alanı</div>
                    <div className="mt-1 text-sm text-neutral-700">
                      Yukarıdaki sandıklardan birini seç. Sandık önce animasyonla açılır, sonra ödüller sırayla hesaba işlenir.
                    </div>
                  </div>
                  <div className="border border-amber-300/35 bg-white/80 px-4 py-2 text-sm font-bold text-amber-700">
                    {getChestById(activeChestId).name}
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-neutral-200 bg-white/78 p-4 text-sm text-neutral-700 shadow-sm">
                  {message}
                </div>

                {!chestOpening && !pendingResult && (
                  <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white/78 p-6 text-center shadow-[0_18px_44px_rgba(30,30,30,0.08)]">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50">
                      <Package2 className="h-10 w-10 text-neutral-700" />
                    </div>
                    <div className="mt-4 text-xl font-black text-neutral-900">Sandık seç</div>
                    <div className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-700">
                      Üstteki sandık kartlarından birine basınca kredi düşer. Satın alırken kırmızı sayaç görünmez; sayaç yalnızca ödül açılımında çalışır.
                    </div>
                  </div>
                )}

                {chestOpening && (
                  <div className={`overflow-hidden rounded-[36px] border p-8 shadow-[0_34px_100px_rgba(15,23,42,0.20)] ${activeChestId === "premium" ? "border-cyan-200/55 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.34),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(224,242,254,0.82),rgba(238,242,255,0.82))]" : "border-amber-200/55 bg-[radial-gradient(circle_at_top,rgba(255,237,213,0.42),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(254,243,199,0.82),rgba(231,229,228,0.82))]"}`}>
                    <div className="relative flex min-h-[520px] flex-col items-center justify-center">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_30%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.08),transparent_42%)]" />
                      <button type="button" onClick={crackCrystal} onMouseEnter={uiSfx.hoverSoft} className="group relative z-10 h-96 w-80 cursor-pointer" title="Sandığı aç">
                        {crystalStage >= 4 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.55, y: 12 }}
                            animate={{ opacity: 1, scale: getChestRemainingCount(getChestById(activeChestId), chestRewards, revealedRewards) === 1 && chestRewards.some((reward) => reward.kind === "character") ? [1, 1.22, 1] : 1, y: 0 }}
                            transition={{ duration: 0.38, repeat: getChestRemainingCount(getChestById(activeChestId), chestRewards, revealedRewards) === 1 && chestRewards.some((reward) => reward.kind === "character") ? Infinity : 0 }}
                            className={`absolute -left-5 bottom-2 z-30 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100/70 bg-gradient-to-br from-red-500 via-red-700 to-black text-3xl font-black text-white shadow-[0_0_42px_rgba(220,38,38,0.72)] ${getChestRemainingCount(getChestById(activeChestId), chestRewards, revealedRewards) === 1 && chestRewards.some((reward) => reward.kind === "character") ? "ring-4 ring-red-300/50 shadow-[0_0_72px_rgba(255,0,0,0.98)]" : ""}`}
                          >
                            {getChestRemainingCount(getChestById(activeChestId), chestRewards, revealedRewards)}
                          </motion.div>
                        )}
                        {activeChestId === "premium" ? (
                          <motion.div animate={{ scale: [1, 1.03, 1], rotate: crystalStage >= 3 ? [0, 1.4, -1.4, 0] : 0 }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }} className="relative mx-auto h-96 w-72">
                            <div className="absolute inset-x-6 bottom-2 h-14 rounded-full bg-cyan-400/34 blur-3xl" />
                            <div className={`absolute inset-0 m-auto rounded-[52px] bg-gradient-to-b from-cyan-100 via-sky-300 to-indigo-500 shadow-[0_0_130px_rgba(120,220,255,0.72)] transition-all duration-300 ${crystalStage === 0 ? "scale-100" : crystalStage === 1 ? "scale-[0.992] rotate-1" : crystalStage === 2 ? "scale-[0.984] -rotate-1" : crystalStage === 3 ? "scale-[0.976] rotate-2" : "scale-[0.968] -rotate-2"}`} style={{ clipPath: "polygon(50% 0%, 82% 16%, 100% 46%, 86% 86%, 50% 100%, 14% 86%, 0% 46%, 18% 16%)" }} />
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_32%,transparent_72%,rgba(255,255,255,0.14))]" />
                            {crystalStage >= 1 && <div className="absolute left-[40%] top-[18%] h-28 w-[2px] rotate-12 bg-white/88 shadow-[0_0_16px_rgba(255,255,255,0.62)]" />}
                            {crystalStage >= 2 && <div className="absolute left-[32%] top-[44%] h-20 w-[2px] -rotate-12 bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.62)]" />}
                            {crystalStage >= 3 && <div className="absolute right-[34%] top-[28%] h-24 w-[2px] rotate-[24deg] bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.62)]" />}
                            {crystalStage >= 4 && <div className="absolute left-[46%] top-[10%] h-40 w-[2px] bg-white/95 shadow-[0_0_18px_rgba(255,255,255,0.72)]" />}
                          </motion.div>
                        ) : (
                          <motion.div animate={{ y: [0, -4, 0], rotate: crystalStage >= 3 ? [0, 0.8, -0.8, 0] : 0 }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="relative mx-auto h-96 w-80">
                            <div className={`absolute inset-x-8 bottom-8 h-16 rounded-full blur-3xl ${getChestById(activeChestId).glowClass}`} />
                            <div className={`absolute left-8 top-28 h-44 w-64 rounded-[30px] border shadow-[0_34px_64px_rgba(0,0,0,0.34)] ${getChestById(activeChestId).panelClass}`} />
                            <motion.div animate={{ rotateX: crystalStage * -16, y: crystalStage >= 4 ? -30 : -crystalStage * 6 }} transition={{ duration: 0.42, type: "spring", stiffness: 160 }} className={`absolute left-10 top-18 h-28 w-60 origin-bottom rounded-t-[34px] border border-white/35 ${getChestById(activeChestId).panelClass}`} />
                            <div className="absolute left-12 top-48 h-3 w-56 bg-black/20" />
                            <div className="absolute left-32 top-51 h-14 w-14 rounded-xl border border-white/50 bg-white/30 shadow-[0_0_34px_rgba(255,255,255,0.42)]" />
                            <div className="absolute left-1/2 top-54 -translate-x-1/2 text-xs font-black uppercase tracking-[0.16em] text-white/90 drop-shadow">{getChestById(activeChestId).iconLabel}</div>
                            {activeChestId === "rick" && <div className="absolute right-10 top-28 h-16 w-16 rounded-full border border-lime-100/50 bg-lime-300/30 blur-sm shadow-[0_0_44px_rgba(132,255,146,0.82)]" />}
                            {activeChestId === "exo" && <div className="absolute inset-x-12 top-44 h-2 bg-cyan-200/80 shadow-[0_0_22px_rgba(103,232,249,0.86)]" />}
                            {activeChestId === "kalitesiz" && <div className="absolute left-16 top-36 h-24 w-2 rotate-12 bg-black/18" />}
                            {crystalStage >= 3 && <div className="absolute left-24 top-20 h-16 w-32 rounded-full bg-white/30 blur-xl" />}
                            {crystalStage >= 4 && <div className="absolute left-12 top-10 h-48 w-52 rounded-full bg-white/28 blur-2xl" />}
                          </motion.div>
                        )}
                      </button>
                      <div className="relative z-10 mt-3 rounded-full border border-neutral-300/45 bg-gradient-to-r from-white via-amber-50 to-neutral-50 px-6 py-3 text-sm font-bold text-neutral-900 shadow-sm">{crystalStage < 4 ? "Tıkla: önce sandık açılır/kırılır" : "Tıkla: ödül sayacı azalır ve ödüller tek tek gelir"}</div>
                      <div className="relative z-10 mt-4 text-sm font-semibold text-neutral-700">{activeChestId === "premium" ? "Sadece Premium Kristal Sandık kristal kırma animasyonuyla açılır." : "Bu sandık kapak/menteşe animasyonuyla açılır; kristal kırma efekti kullanılmaz."}</div>
                      {revealedRewards.length > 0 && (
                        <div className="relative mt-5 grid w-full max-w-xl gap-2">
                          {revealedRewards.map((reward, index) => (
                            <div key={`reward-${index}-${reward.label}`} className="flex items-center justify-between gap-3 border border-neutral-200 bg-white/78 px-4 py-3 text-sm text-neutral-800 shadow-sm"><span className="font-bold">{index + 1}. Ödül</span><span className="flex items-center gap-2">{reward.kind === "wheelKey" && <WheelKeyArt wheel={reward.wheel} size="small" />}{reward.label}</span></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {pendingResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl border border-neutral-200 bg-white/84 shadow-[0_18px_40px_rgba(30,30,30,0.10)]"
                  >
                    <div className={`relative bg-gradient-to-br p-6 ${rarityBg[pendingResult.rarity]}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%)]" />
                      <div className="relative">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/70">Sandıktan Çıkan</div>
                        <div className="mt-1 text-3xl font-black text-white">{pendingResult.character}</div>
                        <div className="mt-1 text-sm text-white/80">{pendingResult.rarity}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={addPendingToAccount}
                        onMouseEnter={uiSfx.hoverSoft}
                        className="w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Hesaba Kat
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            </>
            )}

            <div className="relative overflow-hidden border border-neutral-200 bg-white/72 p-5 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(110,220,255,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,220,120,0.10),transparent_24%)]" />
              <div className="relative">
                <div className="text-lg font-bold">Kredi Kazanım Mantığı</div>
                <div className="mt-3 space-y-3 text-sm leading-6 text-neutral-700">
                  <p>Her maç 1 oyun kredisi verir.</p>
                  <p>Sandık fiyatları sırasıyla 5 / 10 / 20 / 30 kredidir. Karakter garanti değildir; Rick'in Bavulu karakter çıkarsa %5 Omega oranına sahiptir.</p>
                  <p>Seviye point satın alımı bilerek düşük tutuldu. Basit maliyet sistemi: Lv2 100 point ile başlar, son seviye Lv11 tam 5000 point ister.</p>
                  <p>Kurucu erişiminde test satın alımları EXO şirketi tarafından karşılanır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function ThunderfangEvent({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden border border-red-400/18 bg-gradient-to-br from-[#13070a] via-[#1f0c12] to-[#0a0610] shadow-[0_30px_90px_rgba(120,20,40,0.28)] ${
        compact ? "max-w-full" : ""
      }`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,70,70,0.24),transparent_20%),radial-gradient(circle_at_left_center,rgba(175,60,255,0.18),transparent_25%)]" />
      <div className={`grid gap-0 ${compact ? "lg:grid-cols-1" : "xl:grid-cols-[1.08fr_0.92fr]"}`}>
        <div className={`relative overflow-hidden border-white/10 ${compact ? "min-h-[280px] border-b" : "min-h-[420px] border-b xl:border-b-0 xl:border-r"}`}>
          <AssetImage
            src="/images/news/characters/characters/events/thunderfang.png"
            alt="Thunderfang Event"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/45 to-black/12" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,50,50,0.22),transparent_32%),radial-gradient(circle_at_right,rgba(180,70,255,0.18),transparent_24%)]" />

          <div className={`relative z-10 flex h-full flex-col justify-end ${compact ? "p-5" : "p-6 md:p-8"}`}>
            <div className="inline-flex w-fit items-center gap-2 border border-red-300/18 bg-red-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-red-100/88">
              Canlı Event
            </div>
            <div className={`mt-4 max-w-2xl font-black tracking-tight text-white ${compact ? "text-3xl leading-none md:text-4xl" : "text-4xl md:text-5xl"}`}>
              Thunderfang: Kadim Parçalayıcı Ejderha
            </div>
            <div className={`mt-4 max-w-2xl text-white/82 ${compact ? "text-sm leading-7" : "text-base leading-8 md:text-lg"}`}>
              Turnuva haritasına saldıran bu kadim yaratık, tek başına yenilemeyecek kadar güçlü.
              Onu durdurmak için 16 oyuncunun aynı lobide birleşmesi gerekiyor.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="border border-white/15 bg-black/32 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/78">
                16 Oyuncu Co-op
              </div>
              <div className="border border-red-300/18 bg-red-400/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-red-100/84">
                3000 HP
              </div>
              <div className="border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100/84">
                Zayıf Nokta: Kafa Kristali
              </div>
            </div>
          </div>
        </div>

        <div className={`relative ${compact ? "p-5" : "p-6 md:p-8"}`}>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Anlatıcı Kayıtları</div>
          <div className={`mt-4 space-y-4 text-white/76 ${compact ? "text-sm leading-7" : "text-sm leading-8 md:text-base"}`}>
            <p>
              Gökyüzü yarıldığında önce ses değil, titreşim geldi. Ardından turnuva çekirdeğinin üstünde
              mor-kızıl bir ışık açıldı ve içinden Thunderfang indi.
            </p>
            <p>
              Söylentilere göre bu yaratık, kadim duello alanlarında mühürlü kalan savaş kalıntılarının
              yaşayan öfkesinden doğdu. Zırhı neredeyse parçalanmaz, pençeleri ise tek darbede savunma
              hatlarını dağıtacak kadar güçlü.
            </p>
            <p>
              Ancak gözlemciler onun kafasının üzerinde duran kristalin farklı tepki verdiğini fark etti.
              Gövdesi darbeleri emerken, o kristal doğrudan hasar alıyor. Thunderfang’ı yenmenin tek yolu
              gücü o noktaya odaklamak.
            </p>
            <p>
              Bu yüzden emir net: takım olun, pozisyon alın, dikkat dağıtmayın ve kristali kırın.
              Çünkü bu kez turnuva bir rekabet değil, hayatta kalma savunması.
            </p>
          </div>

          <div className={`mt-6 grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-3" : "sm:grid-cols-3"}`}>
            <div className="border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Harita</div>
              <div className="mt-2 text-lg font-bold text-white">Turnuva Arenası</div>
            </div>
            <div className="border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Tehdit Türü</div>
              <div className="mt-2 text-lg font-bold text-white">Boss Event</div>
            </div>
            <div className="border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Kritik Bilgi</div>
              <div className="mt-2 text-lg font-bold text-white">Kristale Vur</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function UpdatesSection() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/10 shadow-[0_0_24px_rgba(255,220,120,0.10)]">
          <Megaphone className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Yenilikler
</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">Güncelleme Vitrini</div>
        </div>
      </div>

      <div className="space-y-6">
        <ThunderfangEvent />

        <div
          className="overflow-hidden border border-white/12 bg-gradient-to-br from-[#f4f7ff] via-[#fdfcff] to-[#eef8ff] shadow-[0_22px_70px_rgba(25,45,65,0.18)]"
          style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
        >
          <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="border-r border-neutral-200 bg-white/72 p-8">
              <div className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-700">
                Sistem Güncellemesi
              </div>
              <div className="mt-4 text-4xl font-black tracking-tight text-neutral-900">
                Rank ve Profil Stüdyosu aktif
              </div>
              <div className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
                Rekabet tarafında artık oyuncular maç sonucuna göre rank puanı kazanıyor ya da kaybediyor.
                Bronz seviyeden Omega&apos;ya kadar uzanan yeni sezon merdiveni eklendi. Aynı anda profil
                özelleştirme sistemi büyütüldü; oyuncular artık slogan, profil karakteri, favori mod,
                kart çerçevesi, ışık seviyesi ve rarity ile açılan özel desenleri kullanabiliyor.
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="border border-neutral-200 bg-white/82 p-4">
                  <div className="text-sm font-bold text-neutral-900">Rank Sistemi</div>
                  <div className="mt-2 text-sm leading-7 text-neutral-700">
                    Maç tamamla, coin ve RP topla, sezon içinde üst liglere çık. Top 10 ve kademeler artık ayrı
                    rank panelinde izlenebiliyor.
                  </div>
                </div>
                <div className="border border-neutral-200 bg-white/82 p-4">
                  <div className="text-sm font-bold text-neutral-900">Profil Stüdyosu</div>
                  <div className="mt-2 text-sm leading-7 text-neutral-700">
                    Enderlik açtıkça yeni desenler açılır. Omega kartı aldıysan Omega deseni, Kristalize açtıysan
                    kristal kırığı teması gibi özel kart arka planları kullanılabilir.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8fbff] p-8">
              <div className="text-sm font-bold text-neutral-900">Eklenen Başlıca Özellikler</div>
              <div className="mt-4 space-y-3">
                {[
                  "Bronz → Omega rank ilerlemesi",
                  "Maç tamamlama anketi ile RP işlemesi",
                  "Profil sloganı ve favori mod seçimi",
                  "Kart çerçevesi, glow ve kontrast ayarı",
                  "Rarity ile açılan desen kilitleri",
                  "Admin tools ve canlı sistem panelleri",
                ].map((item) => (
                  <div key={item} className="border border-neutral-200 bg-white/90 px-4 py-3 text-sm text-neutral-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden border border-white/12 bg-gradient-to-br from-[#eef8ff] via-[#f9fbff] to-[#fff3d9] shadow-[0_22px_70px_rgba(25,45,65,0.18)]"
          style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
        >
          <div className="border-b border-white/10 bg-white/55 px-8 py-7">
            <div className="text-4xl font-black tracking-tight text-neutral-900">Event Güncellemesi</div>
            <div className="mt-3 max-w-4xl text-base leading-7 text-neutral-700">
              Yeni büyük sezon içeriği olarak Thunderfang baskını duyuruldu. Bu etkinlikte oyuncular ilk kez
              klasik PvP akışından çıkıp ortak hedefe karşı birleşecek.
            </div>
          </div>

          <div className="grid gap-0 xl:grid-cols-3">
            <div className="border-r border-neutral-200 bg-white/72 p-7">
              <div className="text-sm font-bold text-neutral-900">Yeni Oynanış Mantığı</div>
              <div className="mt-4 text-sm leading-7 text-neutral-700">
                Turnuva arenası yalnızca birbirini eleme alanı olmaktan çıkıyor. Belirli döngülerde Thunderfang
                baskını açılacak ve lobideki bütün oyuncular tehdit yok olana kadar ortak savunma kuracak.
              </div>
            </div>
            <div className="border-r border-neutral-200 bg-white/72 p-7">
              <div className="text-sm font-bold text-neutral-900">Boss Odaklı Hasar</div>
              <div className="mt-4 text-sm leading-7 text-neutral-700">
                Gövdeye yapılan saldırılar sınırlı etki verir. Asıl verimli hasar kafadaki kristale gider. Bu yüzden
                menzil, pozisyon ve dikkat dağıtma rolleri ilk kez bu kadar önemli hâle gelir.
              </div>
            </div>
            <div className="bg-white/72 p-7">
              <div className="text-sm font-bold text-neutral-900">Beklenen Hissiyat</div>
              <div className="mt-4 text-sm leading-7 text-neutral-700">
                Bu event; kaos, takım oyunu, boss baskısı ve sinematik atmosferi bir araya getirir.
                Yenilikler
 bölümü artık boş değil, doğrudan oyunun en büyük tehdidini duyuruyor.
              </div>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden border border-white/12 bg-black/24"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
          }}
        >
          <div className="grid gap-0 md:grid-cols-[280px_1fr]">
            <div className="relative min-h-[220px] border-b border-white/10 md:min-h-[260px] md:border-b-0 md:border-r">
              <AssetImage
                src="/images/news/characters/kranler.png"
                alt="Kranler"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute left-4 top-4 border border-white/18 bg-black/35 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                Yeni Karakter
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-2xl font-black text-white">Kranler</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-white/62">Destansı • Savunma</div>
              </div>
            </div>

            <div className="p-6 md:p-7">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72">
                Yeni Karakter
              </div>

              <div className="mt-4 text-2xl font-black text-white">Thunderfang&apos;in zincirlerini kıran savaşçı</div>
              <div className="mt-3 max-w-3xl text-sm leading-6 text-white/62">
                Thunderfang&apos;in ejderha kölelerinden biri olan Kranler, uzun süre karanlık ordunun ön safında savaştı.
                Ancak efendisinin acımasız buyruğuna başkaldırdı, zincirlerini kırdı ve artık kendi iradesiyle savaşan bir savunma savaşçısı oldu.
                Ağır eldiveniyle hattı tutar, karanlık patlamasıyla alan açar ve takımın ön cephesinde düşman baskısını üstüne çeker.
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Skill 1</div>
                  <div className="mt-2 text-sm font-bold text-white">Skill 1</div>
                  <div className="mt-2 text-xs leading-5 text-white/58">Kısa süre savunmasını artırır ve aldığı hasarı azaltır.</div>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Skill 2</div>
                  <div className="mt-2 text-sm font-bold text-white">Skill 2</div>
                  <div className="mt-2 text-xs leading-5 text-white/58">Dev eldiveniyle güçlü darbe indirir ve hedefi kısa süre geri iter.</div>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/42">Ulti</div>
                  <div className="mt-2 text-sm font-bold text-white">Ulti</div>
                  <div className="mt-2 text-xs leading-5 text-white/58">Etrafına güçlü enerji patlaması yayar ve yakınındaki düşmanları geri savurur.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


function NewsSection() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/10 shadow-[0_0_24px_rgba(120,220,255,0.10)]">
          <Newspaper className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">Haberler</div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/55">Duyuru Akışı</div>
        </div>
      </div>

      <div
        className="relative overflow-hidden border border-cyan-300/35 bg-[#05070d] shadow-[0_22px_70px_rgba(20,25,45,0.34),0_0_90px_rgba(0,255,255,0.6),0_0_90px_rgba(255,70,70,0.16)]"
        style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
      >
        <div className="relative min-h-[340px] md:min-h-[430px] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-cyan-300/70 before:shadow-[0_0_18px_rgba(0,255,255,0.65)] after:absolute after:inset-y-0 after:right-0 after:w-[2px] after:bg-cyan-300/70 after:shadow-[0_0_18px_rgba(0,255,255,0.65)]">
          <AssetImage
            src="/images/news/characters/characters/events/news/bill-son-savas.jpg"
            alt="Bill son savaş"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/62 to-black/38" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04050a] via-transparent to-[#0c1630]/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(255,60,60,0.52),transparent_22%),radial-gradient(circle_at_24%_18%,rgba(255,224,90,0.44),transparent_24%),radial-gradient(circle_at_8%_92%,rgba(0,255,255,0.52),transparent_26%),radial-gradient(circle_at_92%_8%,rgba(0,255,255,0.34),transparent_18%)]" />

          <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-8 md:min-h-[430px] md:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/78 backdrop-blur-sm">
                Evren Haberi
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                Bill, Son Savaş&apos;ta özgür kaldı
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/82 md:text-lg">
                Zeta serisinin dördüncü yapımına uzanan büyük hikâye artık netleşiyor. Son Savaş&apos;ın külleri içinden çıkan Bill,
                diyarlar arası düzenin en büyük düşmanı olarak geri dönüyor.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-cyan-300/20 bg-[linear-gradient(135deg,rgba(255,70,70,0.45),rgba(255,220,80,0.30)_28%,rgba(4,8,18,0.88)_58%,rgba(0,255,255,0.35))] p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm md:p-8">
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/68">
              Öne Çıkan Haber
            </div>
            <div className="mt-5 text-3xl font-black text-white">Son Savaş yalnızca bir son değildi, bir kırılmaydı.</div>
            <div className="mt-5 space-y-5 text-base leading-8 text-white/80">
              <p>
                Uzun süre mühürlü kalan Bill, Son Savaş adı verilen büyük çatışmada zincirlerinden kurtuldu. O gün yaşananlar sadece
                bir düşmanın geri dönüşü değildi; boyutlar arasındaki görünmez sınırlar da ilk kez ciddi biçimde sarsıldı.
              </p>
              <p>
                Savaşın sonunda birçok kapı kapandı, birçok dünya küle döndü, fakat Bill için asıl başlangıç tam o anda geldi.
                Özgürlüğünü kazandığı an, gerçekliği bir düzen olarak değil kırılması gereken bir duvar olarak görmeye başladı.
              </p>
              <p>
                Şimdi Zeta serisinin dördüncü yapımında onun hedefi açık: Light&apos;ın kurduğu diyarlar arası birliği parçalamak,
                dünyalar arasındaki dengeyi kendi iradesine göre yeniden yazmak ve hiçbir otoritenin kalmadığı bir kaos çağını başlatmak.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm md:p-7">
              <AssetImage
                src="/images/news/characters/characters/events/news/bill-trust-none.jpg"
                alt="Bill trust no one"
                className="mb-5 h-40 w-full object-cover"
              />
              <div className="text-xl font-black text-white">Birliğe Karşı İlk Tehdit</div>
              <div className="mt-4 text-base leading-8 text-white/80">
                Light tarafından kurulan diyarlar arası birlik, farklı evrenleri tek bir savunma çatısı altında toplamayı hedefliyordu.
                Ancak Bill bu yapıyı barış değil zincir olarak görüyor. Ona göre birlik, varoluşu sınırlarla kilitleyen son duvar.
              </div>
            </div>

            <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm md:p-7">
              <AssetImage
                src="/images/news/characters/characters/events/news/bill-glitch.jpg"
                alt="Bill glitch"
                className="mb-5 h-40 w-full object-cover"
              />
              <div className="text-xl font-black text-white">Zeta 4&apos;ün Karanlık Odağı</div>
              <div className="mt-4 text-base leading-8 text-white/80">
                Yeni yapımda Bill yalnızca eski bir tehdit olarak dönmüyor. O artık olayların merkezinde duran,
                ittifakları bozan, gerçekliği büken ve her dünyayı kendi diliyle konuşmaya zorlayan ana karanlık güç olacak.
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-cyan-300/20 bg-[linear-gradient(180deg,rgba(255,70,70,0.35),rgba(255,220,80,0.28)_22%,rgba(6,9,19,0.94)_58%,rgba(0,255,255,0.35))] p-6 md:p-8 xl:grid-cols-3">
          <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm">
            <div className="text-xl font-black text-white">Hikâyenin Dili</div>
            <div className="mt-4 text-base leading-8 text-white/78">
              Zeta 4 tarafında anlatı daha karanlık, daha kaotik ve daha zihinsel bir tona geçiyor. Bill&apos;in gelişi yalnızca savaş
              getirmiyor; güveni, düzeni ve gerçeklik algısını da parçalayacak.
            </div>
          </div>

          <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm">
            <div className="text-xl font-black text-white">Beklenen Çatışma</div>
            <div className="mt-4 text-base leading-8 text-white/78">
              Light&apos;ın birliği evrenleri bir arada tutmaya çalışırken Bill tam tersini istiyor: sınırların çözülmesi, düzenin çökmesi
              ve her dünyanın yeni kurallarla yeniden şekillenmesi.
            </div>
          </div>

          <div className="overflow-hidden border border-cyan-300/18 bg-[linear-gradient(160deg,rgba(255,70,70,0.35),rgba(255,220,80,0.25)_22%,rgba(255,255,255,0.04)_52%,rgba(0,255,255,0.30))] p-6 shadow-[0_18px_40px_rgba(5,10,20,0.24),0_0_26px_rgba(0,255,255,0.35)] backdrop-blur-sm">
            <div className="text-xl font-black text-white">Sonuç</div>
            <div className="mt-4 text-base leading-8 text-white/78">
              Bu haber artık yalnızca yeni bir düşmanı duyurmuyor. Zeta serisinin dördüncü yapımında başlayacak büyük savaşın,
              Bill ile diyarlar arası birlik arasında geçeceğini kesin biçimde ilan ediyor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function makeLiveOperationTime(index: number) {
  if (index === 0) return "şimdi";

  const secondsAgo = index * randomInt(4, 13);
  if (secondsAgo < 60) return `${secondsAgo} sn önce`;

  const minutesAgo = Math.max(1, Math.floor(secondsAgo / 60));
  return `${minutesAgo} dk önce`;
}

function makeAdminMatchFeed(allPlayers: Array<{ name: string; items: string[] }>) {
  const excludedNames = new Set(["YargıçGürkan_62", "DenizKovboy_31", "Kurucu", "Oyuncu 1", "Oyuncu 2"]);
  const events = [
    "oyuna giriş yaptı",
    "turnuva maçına hazırlandı",
    "rank puanı kazandı",
    "maç sonucunu sisteme işledi",
    "takım lobisine katıldı",
    "boss event kuyruğuna girdi",
    "çark ödülü aldı",
    "sandık ödülü açtı",
    "karakter seviyesini yükseltti",
    "eşleşme kuyruğuna girdi",
  ];
  const usedNames = new Set<string>();

  return Array.from({ length: 16 }, (_, index) => {
    let player = allPlayers[randomInt(0, Math.max(0, allPlayers.length - 1))];
    let guard = 0;

    while (player && (excludedNames.has(player.name) || usedNames.has(player.name)) && guard < 24) {
      player = allPlayers[randomInt(0, Math.max(0, allPlayers.length - 1))];
      guard += 1;
    }

    if (player?.name) usedNames.add(player.name);

    const randomItemPool = player?.items?.length ? player.items : ["Karakter Yok"];
    const character = randomItemPool[randomInt(0, randomItemPool.length - 1)] ?? "Karakter Yok";

    return {
      id: `log-${Date.now()}-${index + 1}-${player?.name ?? "oyuncu"}`,
      time: makeLiveOperationTime(index),
      player: player?.name ?? `Oyuncu ${index + 1}`,
      event: events[randomInt(0, events.length - 1)],
      character,
    };
  });
}

function AdminSection({
  profiles,
  fakeAccounts,
  onToggleProfileBan,
  onToggleFakeBan,
  adminToolsEnabled,
  onToggleAdminTools,
}: {
  profiles: InventoryProfile[];
  fakeAccounts: TradeAccount[];
  onToggleProfileBan: (id: InventoryProfile["id"]) => void;
  onToggleFakeBan: (id: string) => void;
  adminToolsEnabled: boolean;
  onToggleAdminTools: () => void;
}) {
  const [playerSearch, setPlayerSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "banned" | "high" | "low">("all");
  const allPlayers = useMemo(() => [
    ...profiles.map((profile) => ({ ...profile, isProfile: true, accountLevel: 1, persona: "olgun" as const })),
    ...fakeAccounts.map((account) => ({ ...account, isProfile: false })),
  ], [profiles, fakeAccounts]);

  const [matchFeed, setMatchFeed] = useState(() => makeAdminMatchFeed(allPlayers));
  const normalizedSearch = playerSearch.trim().toLocaleLowerCase("tr-TR");

  const filteredPlayers = useMemo(() => {
    const limit = normalizedSearch.length === 0 && riskFilter === "all" ? 90 : 180;
    const result: typeof allPlayers = [];

    for (const player of allPlayers) {
      if (normalizedSearch.length > 0 && !player.name.toLocaleLowerCase("tr-TR").includes(normalizedSearch)) continue;

      const rp = player.rankPoints ?? 0;
      if (riskFilter === "banned" && !player.banned) continue;
      if (riskFilter === "high" && rp < 260) continue;
      if (riskFilter === "low" && rp >= 50) continue;

      result.push(player);
      if (result.length >= limit) break;
    }

    return result;
  }, [allPlayers, normalizedSearch, riskFilter]);

  const adminStats = useMemo(() => {
    let visibleBannedCount = 0;

    for (const player of allPlayers) {
      if (player.banned) visibleBannedCount += 1;
    }

    // Büyük oyuncu havuzu render edilmediği için ban metriği iki parçalı tutulur:
    // simülasyon tabanı + panelden canlı değiştirilen görünür hesaplar.
    // Böylece Banla / Banı Kaldır basınca sayı anında +1 / -1 oynar.
    const simulatedBanBase = Math.round(PUBLIC_VISIBLE_PLAYER_COUNT * 0.00042);
    const estimatedBannedCount = Math.max(0, simulatedBanBase + visibleBannedCount);
    const estimatedHighRankCount = Math.round(PUBLIC_VISIBLE_PLAYER_COUNT * 0.0114);

    return { bannedCount: estimatedBannedCount, highRankCount: estimatedHighRankCount };
  }, [allPlayers]);

  const bannedCount = adminStats.bannedCount;
  const highRankCount = adminStats.highRankCount;
  const liveCount = PUBLIC_VISIBLE_PLAYER_COUNT;
  const visibleCount = filteredPlayers.length;

  useEffect(() => {
    setMatchFeed(makeAdminMatchFeed(allPlayers));
  }, [profiles, fakeAccounts]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMatchFeed((prev) => {
        const fresh = makeAdminMatchFeed(allPlayers).slice(0, 3);
        return [...fresh, ...prev].slice(0, 20);
      });
    }, 1100);

    return () => window.clearInterval(interval);
  }, [profiles, fakeAccounts]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center border border-red-300/25 bg-gradient-to-br from-red-500/18 to-black shadow-[0_0_30px_rgba(255,90,90,0.20)]">
            <ShieldAlert className="h-7 w-7 text-red-100" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">Admin Komuta Merkezi</div>
            <div className="text-xs uppercase tracking-[0.18em] text-red-100/70">Canlı oyuncu, güvenlik ve ekonomi paneli</div>
          </div>
        </div>
        <button
          onClick={onToggleAdminTools}
          className={`border px-5 py-3 text-sm font-black uppercase tracking-[0.14em] transition ${adminToolsEnabled ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : "border-red-300/25 bg-red-300/10 text-red-100"}`}
        >
          {adminToolsEnabled ? "Admin Tools Aktif" : "Admin Tools Kapalı"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Toplam Oyuncu", PUBLIC_VISIBLE_PLAYER_COUNT.toLocaleString("tr-TR"), "global oyuncu ağı"],
          ["Banlı Hesap", bannedCount.toLocaleString("tr-TR"), "aktif kısıtlama / global takip"],
          ["Üst Kademe", highRankCount.toLocaleString("tr-TR"), "Diamond ve üzeri aktif oyuncu"],
          ["Listelenen", visibleCount.toLocaleString("tr-TR"), "performans için panel listesi"],
        ].map(([label, value, note]) => (
          <div key={label} className="relative overflow-hidden border border-white/12 bg-gradient-to-br from-white/[0.07] to-black/30 p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/42">{label}</div>
            <div className="mt-2 text-3xl font-black text-white">{value}</div>
            <div className="mt-1 text-xs text-white/48">{note}</div>
          </div>
        ))}
      </div>


      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.9fr_1.25fr]">
        <CutPanel className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-white">Canlı Operasyon Akışı</div>
              <div className="mt-1 text-sm text-white/55">Oyuncu hareketleri, maçlar ve sistem olayları.</div>
            </div>
            <div className="inline-flex items-center gap-2 border border-emerald-300/14 bg-emerald-300/8 px-3 py-1 text-xs uppercase tracking-[0.14em] text-emerald-100">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,255,180,0.85)]" />
              Live
            </div>
          </div>

          <div className="space-y-3">
            {matchFeed.map((item, index) => (
              <div key={`${item.id}-${index}`} className="border border-white/10 bg-white/[0.04] p-3 transition hover:bg-white/[0.07]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white">{item.player}</div>
                      {index < 3 && <span className="border border-emerald-300/14 bg-emerald-300/8 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-100">yeni</span>}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/42">{item.character} • {item.event}</div>
                  </div>
                  <div className="text-xs text-white/45">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CutPanel>

        <CutPanel className="p-5">
          <div className="mb-4 text-lg font-bold text-white">Sistem Kontrolü</div>
          <div className="space-y-3">
            {[
              ["Eşleşme Motoru", "Normal", "text-emerald-100", "bg-emerald-300/8"],
              ["Sandık Ekonomisi", "İzleniyor", "text-amber-100", "bg-amber-300/8"],
              ["Çark Anahtarları", "Event kilidi aktif", "text-cyan-100", "bg-cyan-300/8"],
              ["Ban Sistemi", "Anlık", "text-red-100", "bg-red-300/8"],
            ].map(([name, state, text, bg]) => (
              <div key={name} className={`border border-white/10 ${bg} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className={`text-xs font-bold uppercase tracking-[0.14em] ${text}`}>{state}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-2 text-sm font-semibold text-white">Yönetim Notu</div>
            <div className="space-y-2 text-sm leading-6 text-white/62">
              <div>• Büyük oyuncu havuzu render edilmez; panel yalnızca hafif örnek listeyi gösterir.</div>
              <div>• Liste performansı için ekranda varsayılan az sonuç, aramada kontrollü sonuç gösterilir.</div>
              <div>• Canlı akış daha hızlı ve gerçek zaman hissiyle akar.</div>
            </div>
          </div>
        </CutPanel>

        <CutPanel className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-white">Oyuncu Yönetimi</div>
              <div className="mt-1 text-sm text-white/55">Arat, filtrele, rank/seviye gör ve banla.</div>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[360px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  placeholder="Oyuncu adı ara..."
                  className="w-full border border-white/20 bg-black/35 py-3 pl-11 pr-4 text-sm text-white outline-none"
                />
              </div>
              <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)} className="w-full border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none">
                <option value="all">Tüm hesaplar</option>
                <option value="banned">Banlı hesaplar</option>
                <option value="high">Üst kademe</option>
                <option value="low">Yeni / düşük rank</option>
              </select>
            </div>
          </div>

          <div className="max-h-[760px] space-y-3 overflow-y-auto pr-1">
            {filteredPlayers.map((player) => {
              const rank = getRankInfo(player.rankPoints ?? 0);
              const levelMap = (player as TradeAccount).characterLevels ?? {};
              const featuredName = (player.items ?? [])[0];
              const featuredLevel = featuredName ? clampCharacterLevel(levelMap[featuredName] ?? (player.accountLevel ?? 1)) : player.accountLevel ?? 1;
              return (
                <div key={player.id} className={`border p-4 transition hover:bg-white/[0.06] ${player.banned ? "border-red-300/18 bg-red-300/8" : "border-white/10 bg-white/[0.04]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{player.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/42">
                        <RankLogo rank={rank.name} size={16} />
                        <span>{rank.name}</span>
                        <span>Lv {player.accountLevel ?? 1}</span>
                        <span>{(player.items ?? []).length} karakter</span>
                        {player.persona && <span>{player.persona}</span>}
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/45">
                      <div>{rank.points} RP</div>
                      <div className={player.banned ? "mt-1 text-red-100" : "mt-1 text-emerald-100"}>{player.banned ? "Banlı" : "Aktif"}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(player.items ?? []).slice(0, 5).map((item) => (
                      <span key={`${player.id}-${item}`} className="border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-white/68">
                        {item} • Lv {clampCharacterLevel(levelMap[item] ?? featuredLevel)}
                      </span>
                    ))}
                  </div>

                  <button onClick={() => player.isProfile ? onToggleProfileBan(player.id as InventoryProfile["id"]) : onToggleFakeBan(player.id)} className={`mt-4 w-full border px-3 py-2 text-sm font-semibold transition ${player.banned ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14" : "border-red-300/18 bg-red-300/8 text-red-100 hover:bg-red-300/12"}`}>
                    {player.banned ? "Banı Kaldır" : "Banla"}
                  </button>
                </div>
              );
            })}
          </div>
        </CutPanel>
      </div>
    </div>
  );
}


function GurkanHubSection() {
  const [dangerOpen, setDangerOpen] = useState(false);
  const [hubContentTab, setHubContentTab] = useState<"sora" | "videos" | "links">("sora");
  const [selectedSoraImage, setSelectedSoraImage] = useState<{
    src: string;
    sources: string[];
    index: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<Array<OscillatorNode | GainNode | BiquadFilterNode>>([]);
  const melodyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hubMusicMasterRef = useRef<GainNode | null>(null);
  const [hubMusicVolume, setHubMusicVolume] = useState(0.16);
  const [secretLinkStep, setSecretLinkStep] = useState<"text" | "number" | "unlocked">("text");
  const [secretLinkPassword, setSecretLinkPassword] = useState("");
  const [secretLinkNumberPassword, setSecretLinkNumberPassword] = useState("");
  const [secretLinkMessage, setSecretLinkMessage] = useState("");

  const stopHubMusic = () => {
    if (melodyTimerRef.current) {
      clearInterval(melodyTimerRef.current);
      melodyTimerRef.current = null;
    }
    audioNodesRef.current.forEach((node) => {
      try {
        if ("stop" in node) node.stop();
      } catch {}
      try {
        node.disconnect();
      } catch {}
    });
    audioNodesRef.current = [];

    hubMusicMasterRef.current = null;

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startHubMusic = () => {
    stopHubMusic();

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    ctx.resume().catch(() => {});

    const master = ctx.createGain();
    master.gain.value = hubMusicVolume;
    hubMusicMasterRef.current = master;
    master.connect(ctx.destination);

    const warmth = ctx.createBiquadFilter();
    warmth.type = "lowpass";
    warmth.frequency.value = 3800;
    warmth.Q.value = 0.64;
    warmth.connect(master);

    const createDrone = (frequency: number, gainValue: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = gainValue;
      osc.connect(gain);
      gain.connect(warmth);
      osc.start();
      audioNodesRef.current.push(osc, gain);
    };

    // Telifsiz, kod içinde üretilen slow love + jazz lounge loop.
    // İnternetten şarkı kopyalamaz; tarayıcıda oscillator/chord ile canlı üretilir.
    createDrone(49.0, 0.046, "sine");
    createDrone(98.0, 0.032, "triangle");
    createDrone(146.83, 0.016, "sine");
    createDrone(196.0, 0.014, "sine");
    createDrone(246.94, 0.011, "sine");

    const playNote = (frequency: number, when: number, length = 0.48, gainValue = 0.095, type: OscillatorType = "triangle") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(Math.min(gainValue * 0.38, 0.055), when + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
      osc.connect(gain);
      gain.connect(warmth);
      osc.start(when);
      osc.stop(when + length + 0.06);
    };

    const playSoftChord = (root: number, when: number) => {
      [root, root * 1.1892, root * 1.5].forEach((freq, offset) => {
        playNote(freq, when + offset * 0.035, 0.82, 0.034, "sine");
      });
    };

    const melody = [246.94, 293.66, 329.63, 392.0, 369.99, 329.63, 293.66, 277.18, 246.94, 220.0, 246.94, 293.66];
    const jazzChords = [98.0, 123.47, 146.83, 164.81, 196.0, 174.61];
    let step = 0;

    const tick = () => {
      const now = ctx.currentTime;
      const note = melody[step % melody.length];
      playNote(note, now, 1.16, 0.132, step % 3 === 0 ? "sine" : "triangle");
      if (step % 2 === 0) playNote(note * 1.1892, now + 0.24, 0.72, 0.052, "sine");
      if (step % 4 === 0) {
        const root = jazzChords[(step / 4) % jazzChords.length];
        [root, root * 1.1892, root * 1.4983, root * 1.6818, root * 1.8877].forEach((freq, offset) => {
          playNote(freq, now + offset * 0.075, 2.05, 0.056, offset === 0 ? "sine" : "triangle");
        });
      }
      if (step % 8 === 6) playNote(196.0, now + 0.32, 1.35, 0.052, "sine");
      step += 1;
    };

    tick();
    melodyTimerRef.current = setInterval(tick, 980);

    const heartbeat = ctx.createOscillator();
    const heartbeatGain = ctx.createGain();
    heartbeat.type = "sine";
    heartbeat.frequency.value = 1.08;
    heartbeatGain.gain.value = 0.004;
    heartbeat.connect(heartbeatGain);
    heartbeatGain.connect(master);
    heartbeat.start();

    audioNodesRef.current.push(heartbeat, heartbeatGain, warmth, master);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    return () => stopHubMusic();
  }, []);

  useEffect(() => {
    if (!hubMusicMasterRef.current) return;
    hubMusicMasterRef.current.gain.value = hubMusicVolume;
  }, [hubMusicVolume]);

  useEffect(() => {
    if (!isClient || !selectedSoraImage) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSoraImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isClient, selectedSoraImage]);

  const closeSoraImage = () => {
    setSelectedSoraImage(null);
  };

  const changeHubMusicVolume = (value: number) => {
    const safeValue = Math.max(0, Math.min(1, value));
    setHubMusicVolume(safeValue);
    if (hubMusicMasterRef.current) hubMusicMasterRef.current.gain.value = safeValue;
  };

  const openDangerZone = () => {
    setDangerOpen(true);
    startHubMusic();
  };

  // GürkanHUB medya yolu.
  // Klasör adında Türkçe karakter olduğu için hem düz hem encode edilmiş yolu deniyoruz.
  // Ayrıca dosyaların bazen Yeni klasör (4) içinde, bazen Yeni klasör (3) altında durmasına karşı 2 konum var.
  const GURKAN_MEDIA_BASES = [
    "/images/news/characters/characters/events/news/Yeni klasör (3)/Yeni klasör (4)",
    "/images/news/characters/characters/events/news/Yeni%20klas%C3%B6r%20(3)/Yeni%20klas%C3%B6r%20(4)",
    "/images/news/characters/characters/events/news/Yeni klasör (3)",
    "/images/news/characters/characters/events/news/Yeni%20klas%C3%B6r%20(3)",
  ];

  const getSoraImageFileNames = (number: number) =>
    number <= 20
      ? [`sora${number}.png.jpeg`, `sora${number}.png`]
      : [`sora${number}.png`, `sora${number}.png.jpeg`];

  const buildSoraImageSources = (number: number) =>
    GURKAN_MEDIA_BASES.flatMap((base) =>
      getSoraImageFileNames(number).map((fileName) => `${base}/${fileName}`)
    );

  const soraImages = Array.from({ length: 100 }, (_, index) => {
    const number = index + 1;
    const sources = buildSoraImageSources(number);
    return { src: sources[0], sources, index };
  });

  const soraVideos = Array.from({ length: 8 }, (_, index) => {
    const number = index + 1;
    return {
      label: `Sora Video ${number}`,
      sources: GURKAN_MEDIA_BASES.flatMap((base) => [
        `${base}/soravideo${number}.mp4`,
        `${base}/soravideos${number}.mp4`,
        `${base}/sora-video-${number}.mp4`,
        `${base}/sora video ${number}.mp4`,
        `${base}/Sora Video ${number}.mp4`,
      ]),
    };
  });

  const sorappCoverSources = [
    // sorapp.png, Sora görselleriyle aynı klasördeyse önce bunlar çalışır.
    ...GURKAN_MEDIA_BASES.flatMap((base) => [
      `${base}/sorapp.png`,
      `${base}/Sorapp.png`,
      `${base}/soraapp.png`,
      `${base}/soraApp.png`,
    ]),

    // Klasörün adı direkt "3" ise bunlar çalışır.
    "/3/sorapp.png",
    "/images/3/sorapp.png",
    "/characters/events/3/sorapp.png",
    "/images/news/characters/characters/events/news/3/sorapp.png",

    // En doğru kullanım: public klasörünün içinde "Yeni klasör (3)/sorapp.png" varsa bu çalışır.
    "/Yeni%20klas%C3%B6r%20%283%29/sorapp.png",
    "/Yeni%20klas%C3%B6r%20(3)/sorapp.png",
    "/yeni%20klas%C3%B6r%20%283%29/sorapp.png",
    "/yeni%20klas%C3%B6r%20(3)/sorapp.png",
    "/Yeni klasör (3)/sorapp.png",
    "/yeni klasör (3)/sorapp.png",

    // Sen klasörü sadece "(3)" yaptıysan bunlar çalışır.
    "/%283%29/sorapp.png",
    "/(3)/sorapp.png",

    // Dosyayı images içine attıysan bunlar çalışır.
    "/images/Yeni%20klas%C3%B6r%20%283%29/sorapp.png",
    "/images/yeni%20klas%C3%B6r%20%283%29/sorapp.png",
    "/images/%283%29/sorapp.png",
    "/images/(3)/sorapp.png",
    "/images/sorapp.png",
    "/sorapp.png",
  ];

  const secretLinks = [
    {
      title: "Sora Love X Profili",
      url: "https://x.com/Sora47550",
      coverSources: sorappCoverSources,
      note: "Gizli love bağlantısı aktif. Yeni linkleri gönderince bu koleksiyona ekleyeceğiz.",
    },
  ];

  const handleSecretTextPassword = () => {
    if (secretLinkPassword.trim() !== "EcrinMiray") {
      setSecretLinkMessage("💔 İlk love şifresi yanlış. Kalpli kapı açılmadı.");
      return;
    }
    setSecretLinkMessage("💖 Tebrikler! İlk love kapısı açıldı. Şimdi son sayı kilidine geçiyoruz.");
    setSecretLinkStep("number");
  };

  const handleSecretNumberPassword = () => {
    if (secretLinkNumberPassword.trim() !== "84868") {
      setSecretLinkMessage("💔 Sayı kilidi yanlış. Son kalp hâlâ kapalı.");
      return;
    }
    setSecretLinkMessage("💞 Mükemmel! Tüm love kilitleri açıldı, gizli linkler artık senin.");
    setSecretLinkStep("unlocked");
  };

  const resetSecretLinks = () => {
    setSecretLinkStep("text");
    setSecretLinkPassword("");
    setSecretLinkNumberPassword("");
    setSecretLinkMessage("");
  };

  const openSoraImage = (item: { src: string; sources: string[]; index: number }) => {
    // Objeyi kopyalayarak state referansını garanti değiştiriyoruz.
    // Böylece aynı karta tekrar basılsa bile modal kesin tetiklenir.
    setSelectedSoraImage({
      src: item.src,
      sources: [...item.sources],
      index: item.index,
    });

    // GürkanHUB müziği daha önce başlamadıysa görsel açılırken de başlat.
    if (!audioContextRef.current) {
      startHubMusic();
    }
  };

  return (
    <div className="relative mx-auto max-w-[1760px] overflow-hidden pb-32">
      <div className="pointer-events-none absolute inset-0 opacity-95">
        <div className="absolute left-10 top-20 text-6xl text-pink-200/10">♥</div>
        <div className="absolute right-16 top-12 text-7xl text-rose-200/10">♡</div>
        <div className="absolute bottom-20 left-1/4 text-8xl text-fuchsia-200/10">♥</div>
        <div className="absolute bottom-4 right-1/3 text-6xl text-pink-100/10">♡</div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,35,160,0.34),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,190,225,0.28),transparent_26%),linear-gradient(135deg,rgba(70,0,38,0.92),rgba(150,0,86,0.45),rgba(255,80,170,0.22))]" />
      </div>

      <div className="relative z-10 mb-7 grid gap-6 rounded-[34px] border border-pink-100/35 bg-gradient-to-br from-[#4b002c]/78 via-[#9b075e]/40 to-[#ff6fb7]/18 p-6 shadow-[0_35px_120px_rgba(255,35,160,0.24)] backdrop-blur-md lg:grid-cols-[1fr_420px]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center border border-pink-100/50 bg-pink-400/25 shadow-[0_0_44px_rgba(255,80,190,0.42)]">
            <ShieldAlert className="h-7 w-7 text-pink-100" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">GürkanHUB</div>
            <div className="text-xs uppercase tracking-[0.22em] text-pink-100/70">Kilitli pembe alan</div>
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100/32 bg-gradient-to-br from-rose-700/32 via-fuchsia-700/22 to-pink-300/12 p-4 shadow-[0_0_60px_rgba(255,80,180,0.24)]">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-rose-100/80">Açmadan önce uyarı</div>
          <div className="grid gap-2 text-[12px] leading-5 text-pink-50/72">
            <div>⚠ Bu buton gizli GürkanHUB vitrinini açar.</div>
            <div>⚠ Pembe love teması, kalp efektleri ve özel müzik başlar.</div>
            <div>⚠ Bölümden çıkana kadar müzik devam eder.</div>
            <div>⚠ Görseller büyük basıldığı için düşük çözünürlükler belli olur.</div>
          </div>
          <button
            onClick={openDangerZone}
            className="group relative mt-4 w-full overflow-hidden rounded-2xl border border-rose-200/45 bg-gradient-to-r from-rose-600/45 via-fuchsia-500/32 to-pink-400/35 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_38px_rgba(255,80,180,0.26)] transition hover:scale-[1.015] hover:border-pink-100/80"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
            <span className="relative">Sakın Basma</span>
          </button>
        </div>
      </div>

      {dangerOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 mx-auto mt-12 max-w-[1760px] overflow-hidden border border-pink-100/45 bg-gradient-to-br from-[#16000d] via-[#5c0036] via-[#b50b72] to-[#ff7fbd] shadow-[0_42px_160px_rgba(255,25,155,0.52)]"
          style={{ clipPath: "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))" }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(255,80,190,0.22),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_36%,rgba(255,130,210,0.12))]" />
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,0.95)_0_1.5px,transparent_2px)] [background-size:32px_32px]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(45deg,rgba(255,175,220,0.18)_25%,transparent_25%,transparent_50%,rgba(255,175,220,0.18)_50%,rgba(255,175,220,0.18)_75%,transparent_75%,transparent)] [background-size:46px_46px]" />
            {Array.from({ length: 28 }, (_, index) => (
              <div
                key={index}
                className="absolute text-pink-100/15"
                style={{
                  left: `${(index * 37) % 96}%`,
                  top: `${(index * 19) % 88}%`,
                  fontSize: `${18 + ((index * 7) % 34)}px`,
                  transform: `rotate(${(index * 23) % 45}deg)`,
                }}
              >
                {index % 2 === 0 ? "♥" : "♡"}
              </div>
            ))}
          </div>

          <div className="relative z-10 border-b border-pink-100/28 bg-gradient-to-r from-[#5a0037]/72 via-[#d01588]/24 to-[#ffaad4]/12 px-10 py-9 backdrop-blur-md">
            <div className="inline-flex items-center gap-2 border border-pink-100/25 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-pink-50">
              Gizli Bölge Açıldı
            </div>
            <div className="mt-6 grid gap-2 text-base leading-7 text-pink-50/86 md:grid-cols-2">
              <div>01. Burası normal menü akışının dışında çalışan özel bir test odasıdır.</div>
              <div>02. Bu alanın içindeki görseller sadece GürkanHUB vitrininde kullanılır.</div>
              <div>03. Yanlış dosya yolu verilirse kartlar otomatik olarak boş görüntüye düşebilir.</div>
              <div>04. Görseller büyütüldü; bu yüzden düşük çözünürlüklü dosyalar bulanık görünebilir.</div>
              <div>05. Bu ekran pembe, kalpli ve yüksek kontrastlı özel tema ile tasarlandı.</div>
              <div>06. Müzik bu alandan çıkana kadar çalmaya devam eder.</div>
              <div>07. Tarayıcı ses izni vermezse müzik başlamayabilir.</div>
              <div>08. Görseller sırayla yüklenir; başlık yazıları özellikle kaldırıldı.</div>
              <div>09. Dosyalar mevcut klasör yapına göre .png.jpeg uzantısıyla çağrılıyor.</div>
              <div>10. Burası tehlikeli, gösterişli ve bilerek abartılı bir gizli koleksiyon alanıdır.</div>
            </div>
          </div>

          <div className="relative z-10 px-5 pb-20 pt-10 md:px-8 xl:px-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-3xl font-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]">Sora Galerisi</div>
                <div className="mt-2 text-sm text-pink-50/72">100 görsel + video vitrini için ferah, love/jazz vitrin.</div>
              </div>
              <div className="hidden border border-pink-100/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-50/80 md:block">
                100 Sora + 8 Video
              </div>
            </div>

            <div className="mb-8 grid gap-3 rounded-[28px] border border-pink-100/25 bg-black/24 p-3 shadow-[inset_0_0_45px_rgba(255,90,180,0.12)] backdrop-blur-xl md:grid-cols-3">
              {[
                { id: "sora" as const, label: "Sora Galerisi", meta: "100 görsel" },
                { id: "videos" as const, label: "Sora Videolar", meta: "8 video" },
                { id: "links" as const, label: "Gizli Linkler", meta: "1 love link" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setHubContentTab(tab.id)}
                  className={`relative overflow-hidden rounded-[22px] border px-5 py-4 text-left transition ${
                    hubContentTab === tab.id
                      ? "border-pink-100/70 bg-gradient-to-r from-rose-500/38 via-fuchsia-500/28 to-pink-300/24 text-white shadow-[0_0_42px_rgba(255,70,180,0.25)]"
                      : "border-white/10 bg-white/[0.045] text-pink-100/62 hover:border-pink-100/34 hover:bg-pink-200/10"
                  }`}
                >
                  <div className="text-base font-black uppercase tracking-[0.12em]">{tab.label}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] opacity-70">{tab.meta}</div>
                  {hubContentTab === tab.id && <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-pink-200 via-rose-300 to-fuchsia-300" />}
                </button>
              ))}
            </div>

            <div className="mb-8 flex items-center gap-3 rounded-[24px] border border-pink-100/28 bg-black/36 px-5 py-4 shadow-[0_0_30px_rgba(255,80,180,0.16)] backdrop-blur-xl">
              <Volume2 className="h-5 w-5 text-pink-100" />
              <div className="text-xs font-black uppercase tracking-[0.14em] text-pink-50/80">Müzik Sesi</div>
              <input
                aria-label="GürkanHUB müzik sesi"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={hubMusicVolume}
                onChange={(event) => changeHubMusicVolume(Number(event.target.value))}
                className="h-2 flex-1 cursor-pointer accent-pink-300"
              />
              <span className="w-10 text-right text-xs font-black tabular-nums text-pink-50/85">{Math.round(hubMusicVolume * 100)}%</span>
            </div>

            {hubContentTab === "sora" && (
              <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
              {soraImages.map((item, index) => (
                <div
                  key={item.src}
                  className="group relative overflow-hidden border border-pink-100/28 bg-gradient-to-br from-pink-300/18 via-rose-500/14 to-fuchsia-950/34 p-3 shadow-[0_18px_48px_rgba(110,0,70,0.28)] backdrop-blur-md transition hover:-translate-y-1 hover:border-pink-100/60 hover:bg-pink-200/14"
                  style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_22%),linear-gradient(135deg,rgba(255,105,190,0.16),transparent_42%,rgba(255,255,255,0.08))] opacity-80" />

                  <button
                    type="button"
                    onPointerUp={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openSoraImage(item);
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openSoraImage(item);
                    }}
                    className="relative block aspect-[4/5] min-h-[360px] w-full cursor-zoom-in overflow-hidden border border-pink-100/24 bg-[#190011]/38 text-left sm:min-h-[420px] xl:min-h-[520px]"
                  >
                    <MultiSourceImage
                      sources={item.sources}
                      alt={`GürkanHUB görseli ${index + 1}`}
                      draggable={false}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index < 6 ? "high" : "low"}
                      className="pointer-events-none h-full w-full object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2b061d]/45 via-transparent to-white/10" />
                    <div className="pointer-events-none absolute bottom-3 right-3 text-4xl text-pink-100/85 drop-shadow-[0_0_12px_rgba(255,255,255,0.18)]">♥</div>
                  </button>

                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onPointerUp={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openSoraImage(item);
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openSoraImage(item);
                    }}
                    className="relative z-30 mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-pink-100/45 bg-black/70 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-pink-50 shadow-[0_0_24px_rgba(255,80,180,0.24)] backdrop-blur-md transition hover:border-pink-100/80 hover:bg-pink-500/32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-100/80"
                  >
                    Görseli Büyüt
                  </button>
                </div>
              ))}
              </div>
            )}

            {hubContentTab === "videos" && (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {soraVideos.map((video, index) => (
                  <motion.div
                    key={video.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.025 }}
                    className="group relative overflow-hidden rounded-[30px] border border-rose-100/30 bg-gradient-to-br from-[#2a001a]/88 via-[#7c004c]/44 to-[#ff87c2]/16 p-4 shadow-[0_30px_90px_rgba(120,0,70,0.38)] backdrop-blur-xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_24%),linear-gradient(135deg,rgba(255,110,190,0.16),transparent_44%,rgba(255,255,255,0.07))]" />
                    <div className="relative overflow-hidden rounded-[24px] border border-pink-100/22 bg-black/42">
                      <video className="aspect-video w-full bg-black object-contain" controls preload="metadata">
                        {video.sources.map((src) => (
                          <source key={src} src={src} type="video/mp4" />
                        ))}
                      </video>
                    </div>
                    <div className="relative mt-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-black uppercase tracking-[0.14em] text-white">{video.label}</div>
                        <div className="mt-1 text-xs text-pink-100/62">Love video vitrini</div>
                      </div>
                      <div className="rounded-full border border-pink-100/30 bg-pink-300/14 px-3 py-1 text-lg text-pink-100">♥</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {hubContentTab === "links" && (
              <div className="relative overflow-hidden rounded-[34px] border border-pink-100/38 bg-gradient-to-br from-[#2a001a]/86 via-[#8d0057]/42 to-[#ff9ccc]/16 p-6 shadow-[0_30px_110px_rgba(255,60,170,0.30)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,90,190,0.24),transparent_30%),linear-gradient(135deg,rgba(255,140,210,0.14),transparent_42%,rgba(255,255,255,0.08))]" />
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(255,235,250,0.95)_0_1.4px,transparent_1.9px)] [background-size:26px_26px]" />
                <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-3xl font-black text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.18)]">Gizli Linkler</div>
                    <div className="mt-2 text-sm text-pink-50/72">İki aşamalı love kilidi: önce yazı şifresi, sonra sayı şifresi.</div>
                  </div>
                  <button type="button" onClick={resetSecretLinks} className="rounded-full border border-pink-100/38 bg-black/48 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-pink-50 transition hover:bg-pink-500/22">
                    Kilidi Sıfırla
                  </button>
                </div>

                <div className="relative z-10 grid gap-5 lg:grid-cols-[420px_1fr]">
                  <div className="rounded-[28px] border border-pink-100/28 bg-black/36 p-5 shadow-[inset_0_0_42px_rgba(255,80,180,0.12)]">
                    {secretLinkStep === "text" && (
                      <div className="space-y-4">
                        <div className="text-sm font-black uppercase tracking-[0.16em] text-pink-100/80">1. Love şifresi</div>
                        <input value={secretLinkPassword} onChange={(event) => setSecretLinkPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleSecretTextPassword(); }} placeholder="İlk şifre" className="w-full rounded-2xl border border-pink-100/28 bg-[#16000f]/72 px-4 py-3 text-white outline-none placeholder:text-pink-100/38 focus:border-pink-100/65" />
                        <button type="button" onClick={handleSecretTextPassword} className="w-full rounded-2xl border border-pink-100/45 bg-pink-500/24 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-pink-50 transition hover:bg-pink-500/36">
                          İlk Kapıyı Aç
                        </button>
                      </div>
                    )}
                    {secretLinkStep === "number" && (
                      <div className="space-y-4">
                        <div className="text-sm font-black uppercase tracking-[0.16em] text-pink-100/80">2. Sayı şifresi</div>
                        <input value={secretLinkNumberPassword} onChange={(event) => setSecretLinkNumberPassword(event.target.value.replace(/\D/g, ""))} onKeyDown={(event) => { if (event.key === "Enter") handleSecretNumberPassword(); }} inputMode="numeric" placeholder="Sayı şifresi" className="w-full rounded-2xl border border-pink-100/28 bg-[#16000f]/72 px-4 py-3 text-white outline-none placeholder:text-pink-100/38 focus:border-pink-100/65" />
                        <button type="button" onClick={handleSecretNumberPassword} className="w-full rounded-2xl border border-pink-100/45 bg-pink-500/24 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-pink-50 transition hover:bg-pink-500/36">
                          İkinci Kilidi Aç
                        </button>
                      </div>
                    )}
                    {secretLinkStep === "unlocked" && (
                      <div className="rounded-[24px] border border-emerald-200/24 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-50">💞 Tebrikler, love kilidi açıldı! Gizli linkler görünür durumda.</div>
                    )}
                    {secretLinkMessage && <div className="mt-4 rounded-2xl border border-pink-100/22 bg-white/8 px-4 py-3 text-sm font-bold text-pink-50/82">{secretLinkMessage}</div>}
                  </div>

                  <div className="rounded-[28px] border border-pink-100/24 bg-black/28 p-5">
                    {secretLinkStep !== "unlocked" ? (
                      <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-pink-100/18 bg-[#17000f]/48 p-8 text-center">
                        <div>
                          <div className="text-6xl text-pink-100/80">♥</div>
                          <div className="mt-4 text-xl font-black text-white">Love link kasası kilitli</div>
                          <div className="mt-2 max-w-md text-sm leading-6 text-pink-50/64">İki şifre doğru girilince kalpli gizli link listesi açılır. Her doğru şifrede küçük bir tebrik mesajı çıkar.</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {secretLinks.map((link, index) => (
                          <a
                            key={`${link.title}-${index}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[32px] border border-pink-100/34 bg-gradient-to-br from-pink-300/18 via-rose-500/14 to-fuchsia-950/36 p-4 transition hover:-translate-y-1 hover:border-pink-100/70 hover:bg-pink-200/14 hover:shadow-[0_0_70px_rgba(255,90,190,0.30)]"
                          >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_26%),linear-gradient(135deg,rgba(255,100,190,0.16),transparent_44%,rgba(255,255,255,0.08))]" />
                            <div className="relative z-10 overflow-hidden rounded-[26px] border border-pink-100/24 bg-black/36">
                              <MultiSourceImage
                                sources={link.coverSources}
                                alt={link.title}
                                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16000f]/92 via-[#4b002c]/28 to-transparent" />
                              <div className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-pink-100/34 bg-pink-400/20 text-2xl text-pink-50 shadow-[0_0_30px_rgba(255,90,190,0.28)] backdrop-blur-md">♥</div>
                            </div>
                            <div className="relative z-10 px-2 pb-2 pt-5 text-center">
                              <div className="text-2xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.16)]">{link.title}</div>
                              <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-pink-50/70">{link.note}</div>
                              <div className="mx-auto mt-5 inline-flex rounded-full border border-pink-100/30 bg-black/38 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-pink-50/88 shadow-[0_0_26px_rgba(255,90,190,0.16)]">
                                Love Linke Git ♥
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {isClient &&
        createPortal(
          <AnimatePresence>
            {selectedSoraImage && (
              <motion.div
                key={`sora-lightbox-${selectedSoraImage.index}`}
                className="fixed left-0 top-0 flex items-center justify-center overflow-hidden bg-[#090008]/92 p-4 backdrop-blur-2xl cursor-default"
                style={{ zIndex: 2147483647, width: "100dvw", height: "100dvh" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) closeSoraImage();
                }}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,120,210,0.34),transparent_34%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),linear-gradient(135deg,rgba(120,0,70,0.86),rgba(255,40,160,0.30),rgba(20,0,16,0.95))]" />
                  <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,230,250,0.95)_0_1.3px,transparent_1.8px)] [background-size:28px_28px]" />
                </div>

                <motion.div
                  className="relative z-[100000] flex max-h-[92dvh] w-[min(94dvw,1180px)] flex-col overflow-hidden rounded-[38px] border border-pink-100/60 bg-gradient-to-br from-pink-200/22 via-rose-700/28 to-black/45 p-4 shadow-[0_0_120px_rgba(255,70,180,0.58)] cursor-default"
                  initial={{ scale: 0.78, opacity: 0, y: 22 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.82, opacity: 0, y: 18 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,80,190,0.28),transparent_28%),linear-gradient(135deg,rgba(255,105,190,0.20),transparent_42%,rgba(255,255,255,0.08))]" />

                  <div className="relative z-20 mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="rounded-full border border-pink-100/42 bg-black/52 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-pink-50/88 backdrop-blur-md">
                      Sora {selectedSoraImage.index + 1}
                    </div>

                    <div className="flex min-w-[230px] items-center gap-3 rounded-full border border-pink-100/38 bg-black/58 px-4 py-2 backdrop-blur-md">
                      {hubMusicVolume <= 0 ? <VolumeX className="h-4 w-4 text-pink-100" /> : <Volume2 className="h-4 w-4 text-pink-100" />}
                      <input
                        aria-label="GürkanHUB müzik sesi"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={hubMusicVolume}
                        onPointerDown={(event) => event.stopPropagation()}
                        onChange={(event) => changeHubMusicVolume(Number(event.target.value))}
                        className="h-2 flex-1 cursor-pointer accent-pink-300"
                      />
                      <span className="w-9 text-right text-xs font-black tabular-nums text-pink-50/85">{Math.round(hubMusicVolume * 100)}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={closeSoraImage}
                      className="rounded-full border border-pink-100/55 bg-black/80 px-5 py-2 text-sm font-black text-pink-50 shadow-[0_0_34px_rgba(255,80,180,0.48)] backdrop-blur-md transition hover:bg-pink-500/45"
                    >
                      Görseli Kapat
                    </button>
                  </div>

                  <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-pink-100/28 bg-[#16000f]/50">
                    <MultiSourceImage
                      sources={selectedSoraImage.sources}
                      alt={`GürkanHUB büyük görsel ${selectedSoraImage.index + 1}`}
                      draggable={false}
                      decoding="async"
                      fetchPriority="high"
                      className="block max-h-[76dvh] max-w-full object-contain drop-shadow-[0_0_54px_rgba(255,110,205,0.48)]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a0018]/22 via-transparent to-white/10" />
                    <div className="pointer-events-none absolute bottom-6 right-7 text-7xl text-pink-100/95 drop-shadow-[0_0_28px_rgba(255,120,210,0.85)]">♥</div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}


type MaintenanceErrorBoundaryState = { hasError: boolean };

function MaintenanceScreen() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,160,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,210,90,0.12),transparent_26%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
        <div
          className="relative w-full overflow-hidden border border-sky-300/24 bg-black/55 p-8 shadow-[0_0_90px_rgba(80,160,255,0.20)] backdrop-blur-xl md:p-12"
          style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.10),transparent_38%,rgba(255,255,255,0.05)_52%,rgba(251,191,36,0.08))]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 border border-sky-200/24 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-sky-100">
              Sistem Bakımı
            </div>
            <div className="mt-7 text-4xl font-black tracking-tight text-white md:text-7xl">
              LEGOVERSEGAMES
              <span className="mt-2 block bg-gradient-to-r from-sky-200 via-white to-amber-100 bg-clip-text text-transparent">
                ŞU ANDA ONARIMDA
              </span>
            </div>
            <div className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              Site tarafında geçici bir hata yakalandı. Oyuncu verileri korunuyor; ekran güvenli bakım moduna alındı.
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {["Çark sistemi kontrol ediliyor", "Envanter kodları doğrulanıyor", "Lobi servisleri yenileniyor"].map((item, index) => (
                <div key={item} className="border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-sm font-black text-white">0{index + 1}</div>
                  <div className="mt-2 text-sm text-white/65">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

class MaintenanceErrorBoundary extends React.Component<React.PropsWithChildren, MaintenanceErrorBoundaryState> {
  state: MaintenanceErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("LEGOVERSEGAMES bakım ekranı aktif:", error);
  }

  render() {
    if (this.state.hasError) return <MaintenanceScreen />;
    return this.props.children;
  }
}


type SocialChatMessage = {
  id: string;
  author: string;
  text: string;
  tone: "normal" | "troll" | "pro" | "system";
  clan?: string;
};

type MarketListing = {
  id: string;
  seller: string;
  title: string;
  description: string;
  price: number;
  rewardType: "levelPoints" | "wheelKey";
  amount: number;
  wheel?: WheelType;
  quality?: "normal" | "good" | "rare" | "hot";
};

type ClanRole = "Kurucu" | "Yardımcı" | "Üye";

type ClanInfo = {
  id: string;
  name: string;
  tag: string;
  level: number;
  members: string[];
  roles?: Record<string, ClanRole>;
  color: string;
  motto: string;
  requirement: string;
};

type PlayerMarketDraftType = "levelPoints" | "acemi" | "akademi" | "turnuva";
type ChatSpeed = "slow" | "medium" | "fast";
type ChatRegion = "tr" | "abd" | "cin" | "arap";

const SOCIAL_CLAN_STORAGE_KEY = "legoverse_social_clans_v1";
const SOCIAL_ACTIVE_CLAN_STORAGE_KEY = "legoverse_social_active_clan_v1";
const SOCIAL_CLAN_MESSAGES_STORAGE_KEY = "legoverse_social_clan_messages_v1";

function normalizePlayerNameForMatch(name: string) {
  return name.trim().toLocaleLowerCase("tr-TR");
}

function getClanRole(clan: ClanInfo | undefined, member: string, index = -1): ClanRole {
  if (!clan) return "Üye";
  const storedRole = clan.roles?.[member];
  if (storedRole === "Kurucu" || storedRole === "Yardımcı" || storedRole === "Üye") return storedRole;
  return index === 0 ? "Kurucu" : "Üye";
}

function normalizeClanForGame(clan: ClanInfo): ClanInfo {
  const members = Array.from(new Set((clan.members ?? []).filter(Boolean)));
  const roles: Record<string, ClanRole> = {};
  members.forEach((member, index) => {
    roles[member] = getClanRole(clan, member, index);
  });
  if (members.length > 0 && !Object.values(roles).includes("Kurucu")) {
    roles[members[0]] = "Kurucu";
  }
  return { ...clan, members, roles };
}


const SOCIAL_BOT_NAMES = [
  "KekoKaan_31",
  "ShadowKid",
  "MaviPanda",
  "RageQuitAli",
  "JudgeNova",
  "TaktikTaylan",
  "NoobAvcisi",
  "PixelDayi",
  "LunaMain",
  "TurboMert",
  "RickFan62",
  "ClaraDedektif",
  "MarketciMert",
  "RankciBatu",
  "AksamciAli",
  "CoolKid404",
];

const GLOBAL_CHAT_LINES = [
  "bugün sandıktan efsanevi düşürdüm, lobi 3 saniye sustu",
  "turnuva anahtarı event dışında gelmesin abi değerli kalsın",
  "omega karakter gören var mı yoksa oyun bana mı trip atıyor",
  "rank kasan gelsin ama troll gelmesin lütfen",
  "pazarda fiyatlar oynuyor, ucuza koyanı botlar anında topluyor",
  "gg ama bizim takım sanki AFK belgeseli çekiyordu",
  "GurkanHub tarafında kalpler fazla parlıyor, biri ayarı kısmış mı",
  "akademi çarkı bugün iyi hissettiriyor ama bana hâlâ Tadilatçı atıyor",
  "adminler online mı biri pazarı kontrol etsin",
  "kredi lazım kredi satan var mı ama mantıklı fiyattan",
  "çok konuşma düello at, sonra konuşuruz",
  "klan savaşı gelirse ortalık karışır",
  "1 krediye 1000 point yazanı sistem kabul etmiyor artık iyi olmuş",
  "Rick Sanchez yine portaldan geçip EXO deposuna girmiş diyorlar",
  "Dark Lord lobide görünmüş, gören herkes menüye kaçmış",
  "EXO şirketi bugün bakım yaptıysa kesin gizli drop oranı oynandı",
  "Kırmızı Jhon mainleyenler neden hep en önden koşuyor",
  "Omega Dareth gelirse oyunun sesi bile yükseliyor gibi",
  "Rick'in Bavulu açtım, içinden kredi çıktı ama adam hâlâ gülüyor",
  "Dark Lord event boss olursa klanla girmeden çıkılmaz",
  "EXO çalışanı gibi konuşan bot var, aşırı resmi ama iyi fiyat veriyor",
  "PazarBot az önce ilanımı aldı, demek ki fiyatı düzgün koymuşum",
  "Turnuva çarkı açarken kalbim kasa kapağı gibi çarpıyor",
  "Akademi anahtarı satan varsa yazsın, saçma fiyat atma",
  "Bu oyunda en tehlikeli şey boss değil, yanlış pazar fiyatı",
  "Rick Sanchez: 'bu oranlar bilimsel değil Morty' demiş olabilir",
  "Dark Lord klan daveti atmış, kabul eden geri yazmamış",
  "EXO şirketinin güvenlik botu beni pazardan kovdu",
  "GurkanHub müziği kısık ama enerji garip şekilde yüksek",
  "Clone Trooper ucuz sanılıyor ama doğru levelde sinir bozuyor",
  "Mia support alan varsa takıma gelsin, herkes saldırı seçiyor",
  "Kaya Yaratığı oynayanlar gerçek sabır testi",
  "Toxe zehir alanı bırakınca herkes dramatik koşuyor",
  "Robo Raptor gördüm, kameram bile geri adım attı",
  "Darth Vader alan kontrolünde hâlâ çok ağır duruyor",
  "Genç Wu revive atınca karşı takımın morali gidiyor",
  "Gölge Cinder bulut atınca ekran sinema sahnesi oluyor",
  "Vengestone Askeri tank gibi ama pazarda nedense ucuz konuşuluyor",
  "Bugün global chat sakin başlamıştı, Rick adı geçince bozuldu",
  "EXO market fişi isteyen var mı, adamlar her şeyi kayıt altına alıyor",
  "Dark Lord skin gelirse bütün klanlar dağılır",
  "Oyun kredisi azaldı, ruhum kalitesiz sandığa döndü",
  "Pembe tema güzel ama GürkanHub kapısı biraz fazla şüpheli",
  "Rankta kaybedince suçlu hep internet oluyor klasik",
  "Biri pazara 99999 fiyat koymuş, EXO vergi memuru musun kardeşim",
  "Rick'in Bavulu 30 kredi oldu diye millet kuyruğa girmiş",
  "Premium Kristal Sandık ucuzladı ama hâlâ artist gibi parlıyor",
  "Kalitesiz sandık bazen gururlu fakir gibi güzel ödül veriyor",
  "EXO ganimeti açınca ses efekti daha tok olmalı bence",
  "Klan lideri 'aktif olun' dedi ve kayboldu",
  "Global TR lobisi yine kahvehane + uzay laboratuvarı karışımı",
  "ABD lobisinde herkes 'gg' yazıyor ama içeriden ağlıyor",
  "Çin lobisinde pazar fiyatları satranç gibi oynanıyor",
  "Arap lobisinde turnuva anahtarı altın gibi değerli",
  "Gurkan adlı oyuncu pazara bakınca ekonomi titriyor",
  "DenizKovboy_31 yine garip bir takas teklif etmiş olabilir",
  "YargıçGürkan_62 kodu değişti mi, biri teyit etsin",
  "EXO şirketi sponsorlu event istiyoruz ama oranları ellemesinler",
  "Dark Lord boss olarak gelirse ödül Turnuva Anahtarı olsun",
  "Rick Sanchez sandık oranlarını görünce portalı kapatmış",
  "Ben sadece günlük görev yapacaktım, 2 saat pazara baktım",
  "Burası oyun değil ekonomi simülasyonu olmuş",
  "Düşük level karakteri küçümseyenler Ragrast yememiştir",
  "Uykucu Gary global chat okurken bile uyutuyor",
  "Luna alanı açınca takım bir anda spa merkezine dönüyor",
  "Jett dash attı diye kamera onu takip edemedi",
  "Dinamit Kız oynayanlar önce kendini patlatıyor sonra taktik diyor",
  "Ateş Frank görürsen yakın durma, adam tost makinesi gibi",
  "Dracula ulti atınca herkes 'nereye gitti bu' diye bakıyor",
  "Tadilatçı support ama pazarda tam esnaf ruhu var",
  "Rick bugün EXO laboratuvarında bavul unutmuş diyorlar",
  "Dark Lord ismi geçince lobi rengi bile koyulaştı",
  "EXO şirketi yeni sezonu gizli test ediyor olabilir",
  "Akademi çarkı bana güven vermiyor ama yine de basıyorum",
  "Turnuva anahtarı olanlar kendini borsa zengini sanıyor",
  "Kalitesiz sandık düşük bütçe ama yüksek umut",
  "EXO Ganimeti açınca sanki fabrika alarmı çalıyor",
  "Rick'in Bavulu ucuz değil ama hikayesi var",
  "Premium Kristal ışıldıyor diye iyi çıkacak sananlara selam",
  "Dark Lord gelirse global chat kesin 3 dakika susar",
  "EXO ajanı gibi fiyat yazan oyuncular var",
  "Klan lideri online görünür ama mesajlara cevap vermez klasik",
  "Pazarda mantıklı fiyat görünce elim kendi kendine satın alıyor",
  "Omega düşüren kişi screenshot atmadan inanmam",
  "Rick Sanchez bu chat'i görse kendi kanalını açardı",
  "Dark Lord eventinde ödül az olursa isyan çıkar",
  "EXO kasası patlarsa herkes zengin olmaz, biri üzülür",
  "GurkanHub kapısı yine pembe parlıyor, ben basmam",
  "Globalde biri sakin yazınca daha korkutucu oluyor",
  "Kredi bitti, ruhum ücretsiz deneme sürümü oldu",
  "Seviye point kasmak spor salonu üyeliği gibi, düzen ister",
  "PazarBot beni reddetti, demek ki fiyatı abartmışım",
  "Mia alan takım sakin oynuyor, Jett alan takım koşup kayboluyor",
  "Vengestone tank gibi ama markette pazarlık yapamıyor",
  "Creeper mainleyen arkadaşlar mesafe kavramını bilmiyor",
  "Anacondrai görünce herkes panik roll yapıyor",
  "Kranler seçen adamlar genelde duvar gibi duruyor",
  "Ragrast oyuncusu sessizse daha tehlikeli",
  "Uykucu Gary ile oynayanlar chat'te bile yavaş yazıyor",
  "Luna support değil terapi paketi gibi",
  "Robo Raptor kilitlendi mi kaçış yok gibi duruyor",
  "Dedektif Clara pazardaki kazıkları da bulsun lütfen",
  "Dinamit Kız takım arkadaşlarına güven testi yapıyor",
  "Ateş Frank geldiğinde harita tost kokuyor",
  "Kaya Yaratığı basit ama sinir bozucu derecede sağlam",
  "Clone Trooper kalabalık yapınca oyun bir anda Star lobisine dönüyor",
  "Kırmızı Jhon önce ateş ediyor sonra düşünüyor",
  "Dracula kaybolunca herkes envanteri kontrol ediyor",
  "Steve blok koydu diye düello Minecraft'a döndü",
  "Ateş Mech yukarı çıkınca kamera karar veremiyor",
  "Darth Vader yavaş ama ağırlığı var",
  "Genç Garmadon öfke biriktirince takım geri çekiliyor",
  "Genç Wu revive atarsa maç yeniden yazılır",
  "Omega Dareth sahaya inince UI bile premium hissettiriyor",
  "Bu chat biraz kahvehane biraz uzay karaborsası",
  "ABD lobisi hızlı, TR lobisi yorumcu, Çin lobisi hesapçı, Arap lobisi pazarlıkçı",
  "EXO şirketi maintenance yazarsa kesin arka planda bir şey dönüyor",
  "Rick'in oran hesapları kimseye güven vermiyor",
  "Dark Lord klanı kurulursa tag kesin siyah olur",
  "Pazar bugün taze, ama fiyatlar sinirli",
  "Klan arayanlar önce aktiflik yazsın, sonra rank",
  "Sezon bitmeden Omega hedefi mantıklı mı tartışılır",
  "Biri 1 krediye 5000 point isterse sistem değil ben reddederim",
  "Lobi hızını hızlı yapanlar chat okumuyor, sadece akış izliyor",
  "Yavaş chat daha ciddi, hızlı chat yangın yeri",
  "EXO raporu: oyuncular yine anahtar biriktiriyor",
  "Rick Sanchez pazar vergisine itiraz etmiş olabilir",
  "Dark Lord söylentisi sandık satışını artırdı",
  "Günlük görev yapmadan zengin olmaya çalışanlar pazar mağduru olur",
  "Turnuva anahtarı harcamadan önce iki kere düşün",
  "Akademi anahtarı orta sınıfın kralıdır",
  "Acemi anahtarı bazen kalp kırar bazen sürpriz yapar",
  "Global chat bugün daha fresh olmuş, eski gri hava gitmiş",
  "Rick dün pazara bavul koymuş, açıklama kısmına sadece 'dokunma' yazmış",
  "Dark Lord söylentisi çıktı diye turnuva anahtarı fiyatı yine oynadı",
  "EXO denetçisi gibi konuşuyorsunuz ama yarınız sandık bağımlısı",
  "Klan arayanlar önce aktif saat yazsın, hayalet üye istemiyoruz",
  "Pazarda ucuz ilan görünce kalbim değil mouse'um hızlanıyor",
  "GürkanHub'a giren biri globalde şiir yazmaya başladı, normal mi",
  "Rank için takım lazım yazan herkes sonra solo giriyor, klasik",
  "Rick'in Bavulu açtım, ödül çıktı mı ben mi çıktım anlamadım",
  "Dark Lord eventine romantik müzik koyarsanız ben oynamam",
  "EXO şirketi fazla ciddi, lobide bir tane eğlenceli departman yok mu",
  "Akademi anahtarı orta sınıfın umudu, turnuva anahtarı zengin stresi",
  "Bugün pazar daha sakin ama bu sessizlik pahalı sessizlik",
  "Omega düşürsem önce screenshot sonra nefes alırım",
  "Klan lideri 'aktif olun' dedi, 2 gündür offline",
  "Globalde biri düzgün analiz yaptı, herkes 5 saniye saygı duruşuna geçti",
  "Troll mesaj atanların yarısı maçta support bekliyor",
  "EXO Ganimeti fabrika kokuyor ama ödül fena değil",
  "Kalitesiz sandık 5 kredi ama umut bedava değil",
  "Rick'in Bavulu 20 kredi mi, bu adam yine indirimle deney yapıyor",
  "Premium Kristal parlıyor ama ben artık ışığa kanmıyorum",
  "Dark Lord klan daveti atarsa kabul edenin sigortası var mı",
  "Pazara ilan koydum, AI almadı; demek ki ben de kazıkçı olmuşum",
  "Kredi az, hayal çok, lobi bildiğin ekonomik kriz",
  "Mia mainler globalde en sakin insanlar gibi duruyor",
  "Creeper oynayan arkadaş yakınlık kavramını yanlış anlamış",
  "YargıçGürkan karar verirse pazar itiraz kabul etmez",
  "DenizKovboy_31 pazara girince herkes fiyat kontrol ediyor",
  "Dark Lord adı geçince klan sohbeti bile fısıldıyor",
  "EXO kasası açılırken sanki şirket toplantısı başlıyor",
  "RickFan62 yine bavulu savunuyor, adamın hissesi var galiba",
  "PazarBot beni reddetti ama dürüst olmak gerekirse haklıydı",
  "Klan savaşı gelirse global chat 3 ayrı dilde kavga eder",
  "Arap lobisinde anahtar altın gibi, Çin lobisinde fiyat satranç gibi",
  "ABD lobisi gg yazıyor ama herkes içinden tilt",
  "TR lobisi kahvehane, laboratuvar ve pazar yeri karışımı",
  "Rank kasmak istiyorum ama takım random olunca kadercilik başlıyor",
  "GürkanHub müziği kısık ama etkisi yüksek, bilim açıklayamıyor",
  "Omega Dareth sesi duyulunca lobi kendini toparlıyor",
  "Dark Lord için support seçmeyen klanı ben ciddiye almam",
  "EXO şirketi event açarsa ödül büyük ama bedel de büyük olur",
  "Rick'in Bavulu açarken sayaç 1'e düşünce elim terliyor",
  "Pazar ilanı koyarken vicdanla fiyat arasında kaldım",
  "Klan arıyorum ama lideri kaybolan klan istemiyorum",
  "Bugün globalde dostluk çıktı, yarın kesin pazar kavgası olur",
  "Tadilatçı mainlerin pazarlık yeteneği fazla iyi",
  "Ragrast sessiz oyuncunun elindeyse daha korkutucu",
  "Luna oynayan biri globalde herkesi sakinleştirdi, nadir an",
  "EXO raporu gibi mesaj yazanlara saygım var ama korkuyorum",
  "Dark Lord skin gelirse pazar değil borsa açılır",
  "Rick bu oyuna denge değil hikaye katıyor",
  "Kredi görünce herkes ciddi, love temaya girince herkes şair",
  "Pazarın yeni kuralı: mantıklı fiyat yaşar, saçma fiyat donar",
  "Turnuva anahtarı sadece eventten gelsin, değer oradan geliyor",
  "Akademi çarkı güvenli liman gibi ama bazen fırtına çıkarıyor",
  "Kalitesiz sandık düşük bütçeli dram filmi gibi",
  "Premium Kristal'e bakınca gözüm değil kredi cüzdanım yanıyor",
  "Klan sohbeti iyi olunca oyun daha gerçek hissettiriyor",
  "Globalde birbirini tanıyan botlar oluştu, oyun kendi hayatını kuruyor",
  "Bir oyuncu pazardan item aldı, sonra satanla arkadaş oldu; lobi garip",
  "Rick ve Dark Lord aynı evente gelirse EXO binası taşınır",
  "GürkanHub kapısına basma yazıyor ya, en çok ona basılıyor",
  "Bugün chat hızlı, düşünmeden yazanlar daha hızlı pişman oluyor",
  "Klan kurmak kolay, aktif tutmak boss kesmekten zor",
  "Pazar tasarımı güzel olmuş ama fiyatlar hâlâ acımasız",
  "EXO güvenlik botu beni görünce 'mantıklı fiyat gir' dedi sanki",
  "Dark Lord efsane değilse bile söylentisi bile içerik üretiyor",
  "Rick'in bavulu bazen ödül değil kişilik testi veriyor",
  "Global chat büyüdükçe oyun menü değil şehir gibi durmaya başladı",
  "Bir gün sadece pazarı izleyerek video çekilir bu oyunda",
  "Klan üyeleri birbirine cevap verince lobi gerçekten canlı hissettiriyor",
  "Aşk mesajı atan oyuncu 2 dakika sonra rank kavgasına girdi",
  "Troll oyuncu bile doğru fiyat görünce ciddileşiyor",
  "EXO şirketi varsa kesin gizli muhasebe sekmesi de vardır",
  "Dark Lord gelmeden herkes cesur, event başlayınca herkes taktikçi",
  "Rick Sanchez bu chat datasını görse sosyal deney derdi",
  "Pazar ilanımı kim aldıysa hayrını görsün, kazık değildi söz",
  "Globalde birine yardım ettim, sonra klana çağırdı; güzel sistem",
  "Anahtarlar az ama değerli olsun, oyunun tadı orada",
  "Seviye point kasmak emek istiyor, bedavaya güç olmaz",
  "Kredi kazanmak için görev şart, pazar tek başına kurtarmıyor",
  "Oyunun gerçek bossu bazen Dark Lord değil, ekonomi dengesi",
  "Sosyal merkez iyi olursa oyuncu oyundan çıkmadan takılır",
];

const REGION_CHAT_LINES: Record<ChatRegion, string[]> = {
  tr: [
    ...GLOBAL_CHAT_LINES,
    "abi pazarda ucuz akademi anahtarı gördüm kaçırmayın",
    "kim turnuva eventine girecek takım lazım",
    "şu sandık animasyonu fena olmuş, özellikle son sayaç",
    "rank kasıyorum ama takım yine uyuyor",
    "Rick'in Bavulu açanlar sonucu yazsın",
    "Dark Lord söylentisi gerçekse event patlar",
    "EXO şirketi yine rapor yayınlamış gibi herkes ciddi konuşuyor",
    "pazara koyduğum ilanı AI aldı, demek ki bu sefer kazıklamamışım",
    "klan arıyorum ama üyeler aktif olsun, süs klanı istemem",
    "global çok hızlı akıyor, orta hıza aldım rahatladım",
    "bu lobinin yarısı sandıkçı yarısı ekonomist olmuş",
    "Omega Dareth çıkarmadan uyumam diyen biri 5 saat önce yazmıştı",
    "GurkanHub kapısına basan geri gelince değişik konuşuyor",
    "turnuva anahtarını pazarda ucuza koyan varsa yanlışlıkla koymuştur",
    "EXO ganimeti bugün bana güven vermiyor",
  ],
  abd: [
    "yo this market is actually clean",
    "anyone grinding clan missions tonight?",
    "omega drop rate is brutal but fair",
    "rank queue is wild right now",
    "selling keys only if the price makes sense",
    "gg that duel was close",
    "global lobby feels alive now",
    "Rick's suitcase just robbed me emotionally",
    "Dark Lord rumor sounds like a whole season event",
    "EXO Corp prices are suspiciously organized",
    "who listed 1k points for 1 coin bro the system rejected you for a reason",
    "clan chat finally feels like a real club room",
    "premium crystal looks cheaper but still acts expensive",
    "market bots are smarter than half my ranked team",
    "I saw Omega Dareth once and my FPS got nervous",
    "Rick Sanchez would call this economy unstable but fun",
    "EXO security bot told me to stop underpricing keys",
    "Dark Lord clan tag would go insanely hard",
  ],
  cin: [
    "排位队友来一个，别乱打",
    "市场价格今天有点高",
    "活动钥匙很值钱，别低价卖",
    "这个箱子动画不错",
    "公会任务今晚一起刷",
    "欧米伽角色太难出了",
    "这局节奏很快",
    "Rick的箱子看起来很危险",
    "Dark Lord如果进活动，奖励必须高",
    "EXO公司的市场规则很严格",
    "不要乱挂价格，系统会拒绝",
    "公会聊天现在更像真正的大厅",
    "水晶箱很亮，但别冲动",
    "市场机器人买得很快",
  ],
  arap: [
    "السوق اليوم غالي شوي",
    "من يدخل حدث البطولة؟",
    "مفتاح البطولة لا تبيعه برخيص",
    "الصندوق هذا حظه قوي",
    "نحتاج لاعب للدردشة والكلان",
    "الرنك صعب بدون فريق",
    "اللعبة صارت حية أكثر",
    "حقيبة ريك شكلها خطير",
    "دارك لورد لو صار حدث بيكسر اللعبة",
    "شركة EXO تتحكم بالسوق بقوة",
    "لا تحط سعر غير منطقي النظام يرفضه",
    "الدردشة صارت أسرع وأوضح",
    "صندوق الكريستال يلمع كثير بس الحظ مهم",
    "بوت السوق يشتري السعر المنطقي بسرعة",
  ],
};

const CHAT_SPEED_MS: Record<ChatSpeed, number> = {
  slow: 2200,
  medium: 1050,
  fast: 520,
};

const CLAN_CHAT_LINES = [
  "klan görevi için 3 kişi hazır olsun",
  "bugün hedefimiz akademi anahtarı kasmak",
  "pazardan ucuz point görürsen haber ver",
  "event başlayınca herkes turnuvaya girsin",
  "rank düşen moral bozmasın, akşam toparlarız",
  "savunma oyuncusu eksik, tank karakter seçin",
  "klan kasası için günlük görevleri unutmayın",
  "sadece klandakiler yazıyor, dışarıdan spam yok",
  "Rick'in Bavulu indirime girerse klan fonundan alalım",
  "Dark Lord event gelirse herkes rolünü önceden seçsin",
  "EXO görevleri gelirse ilk gün bitiririz",
  "pazar fiyatı mantıklıysa klan adına alın",
  "klan chat hızlı akmasın, önemli mesajlar kayboluyor",
  "bugün liderlik tablosuna oynuyoruz",
  "support seçen yoksa Mia alıyorum",
  "turnuva anahtarı boşa harcanmasın, tam kadro girilecek",
  "Omega hedefleyenler önce günlükleri bitirsin",
  "pazar dolandırıcılığı yok, sistem zaten kilitliyor",
  "akşam 21:00 event için herkes hazır olsun",
  "EXO şirketi bizi izliyorsa sponsorluk bekliyoruz",
  "Dark Lord söylentisini globalde büyütmeyin, fiyatlar uçuyor",
];

const DEFAULT_CLANS: ClanInfo[] = [
  {
    id: "crystal-wolves",
    name: "Crystal Wolves",
    tag: "CW",
    level: 7,
    members: ["Klan Lideri", "TankMain", "EventAvcısı", "PazarGözcüsü", "RankçıBatu", "DestekMia"],
    roles: { "Klan Lideri": "Kurucu", TankMain: "Yardımcı" },
    color: "from-cyan-400/22 via-blue-500/10 to-black",
    motto: "Event gir, görev bitir, pazarı takip et.",
    requirement: "Herkese açık",
  },
  {
    id: "omega-table",
    name: "Omega Table",
    tag: "OMG",
    level: 11,
    members: ["OmegaDede", "NovaHakim", "LunaMain", "RickFan62"],
    roles: { OmegaDede: "Kurucu", NovaHakim: "Yardımcı" },
    color: "from-fuchsia-400/24 via-amber-300/12 to-black",
    motto: "Üst kademe oyuncular, temiz pazar, ağır rank.",
    requirement: "Gold+ önerilir",
  },
  {
    id: "pazar-lonca",
    name: "Pazar Loncası",
    tag: "MRK",
    level: 5,
    members: ["MarketciMert", "CoinciCan", "TakasDayi", "PixelDayi"],
    roles: { MarketciMert: "Kurucu", CoinciCan: "Yardımcı" },
    color: "from-amber-300/22 via-orange-500/12 to-black",
    motto: "Ucuz al, mantıklı sat, ekonomiyi bozma.",
    requirement: "Takas aktif",
  },
  {
    id: "shadow-kids",
    name: "Shadow Kids",
    tag: "SHD",
    level: 3,
    members: ["ShadowKid", "NoobAvcisi", "RageQuitAli"],
    roles: { ShadowKid: "Kurucu", NoobAvcisi: "Yardımcı" },
    color: "from-violet-400/22 via-slate-600/12 to-black",
    motto: "Kaos, chat, hızlı görev.",
    requirement: "Serbest",
  },
];

function createSocialMessage(text: string, author?: string, tone?: SocialChatMessage["tone"], clan?: string): SocialChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    author: author ?? SOCIAL_BOT_NAMES[Math.floor(Math.random() * SOCIAL_BOT_NAMES.length)],
    text,
    tone: tone ?? (["normal", "troll", "pro"] as const)[Math.floor(Math.random() * 3)],
    clan,
  };
}

type BotPersona = "troll" | "serious" | "romantic" | "trader" | "pro" | "chaos";

function getBotPersona(name: string): BotPersona {
  const lower = name.toLocaleLowerCase("tr-TR");
  if (lower.includes("market") || lower.includes("pazar") || lower.includes("coin") || lower.includes("takas")) return "trader";
  if (lower.includes("judge") || lower.includes("clara") || lower.includes("rank") || lower.includes("nova") || lower.includes("dedektif")) return "serious";
  if (lower.includes("luna") || lower.includes("mavi") || lower.includes("heart") || lower.includes("panda")) return "romantic";
  if (lower.includes("rage") || lower.includes("keko") || lower.includes("noob") || lower.includes("troll") || lower.includes("cool")) return "troll";
  if (lower.includes("rick") || lower.includes("shadow") || lower.includes("dark")) return "chaos";
  if (lower.includes("taktik") || lower.includes("turbo")) return "pro";
  const personas: BotPersona[] = ["troll", "serious", "romantic", "trader", "pro", "chaos"];
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % 997;
  return personas[hash % personas.length];
}

function getToneFromPersona(persona: BotPersona): SocialChatMessage["tone"] {
  if (persona === "troll" || persona === "chaos") return "troll";
  if (persona === "serious" || persona === "pro" || persona === "trader") return "pro";
  return "normal";
}

function pickLine(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function buildBotAmbientLine(author: string, regionLines: string[], recentText?: string, targetName?: string) {
  const persona = getBotPersona(author);
  const target = targetName && targetName !== author ? targetName : SOCIAL_BOT_NAMES[Math.floor(Math.random() * SOCIAL_BOT_NAMES.length)];
  const lower = (recentText ?? "").toLocaleLowerCase("tr-TR");

  if (lower.includes("pazar") || lower.includes("sat") || lower.includes("kredi")) {
    return persona === "trader"
      ? `${target}, pazar fiyatı mantıklıysa alırım; şişirme varsa ilan vitrine bakar.`
      : `${target} pazara girdi mi fiyatlar ya düşer ya kavga çıkar.`;
  }
  if (lower.includes("klan")) {
    return persona === "romantic"
      ? `${target} bizim klana gelirse sohbet biraz yumuşar gibi.`
      : `${target}, klan işi ciddi; aktif olmayan üye sadece sayı kalabalığı.`;
  }
  if (lower.includes("rick")) return `Rick muhabbeti açıldıysa ${target} kesin deney diye bir şey uydurur.`;
  if (lower.includes("dark") || lower.includes("lord")) return `Dark Lord söylentisi yayılınca ${target} bile bir anda ciddileşti.`;
  if (lower.includes("exo")) return `EXO konusu gelince ${target} fiyat tablosu açıyor, romantizm bitiyor.`;

  const personaLines: Record<BotPersona, string[]> = {
    troll: [
      `${target} yine çok stratejik konuştu ama maçta ilk düşen o olur.`,
      `global sakinleşmişti, ben geldim sorun çözüldü sanmayın.`,
      `${target} bunu ciddiye aldıysa lobi ısınır.`,
      `şu an burada taktikten çok bahane dönüyor.`
    ],
    serious: [
      `${target}, kaynak hesabı yapmadan sandık basmayın.`,
      `lobi verisi net: pazar mantıklı, rastgele karar pahalı.`,
      `evente girecekseniz önce rol dağılımı yapın.`,
      `${target} iyi oynuyor ama ekonomi tarafını ihmal ediyor.`
    ],
    romantic: [
      `${target} çok sert yazıyor ama lobi biraz love ister.`,
      `bu chat kaos ama arada güzel insanlar var ya.`,
      `GürkanHub tarafındaki pembe ışık buraya da sızmış olabilir.`,
      `${target}, sakin oyna; bazen kazanmak değil güzel oynamak önemli.`
    ],
    trader: [
      `${target} ilan açarsa önce fiyatına bakarım, sözüne değil.`,
      `kredi sıcak, point değerli, anahtar ise bugün altın gibi.`,
      `mantıklı ilanı AI bekletmez, pazar affetmez.`,
      `ucuz ürün gördüm mü romantizm biter, satın alırım.`
    ],
    pro: [
      `${target}, takım kompozisyonunu düzeltmeden rank konuşmayalım.`,
      `çark açmadan önce hedef belirleyin; yoksa kaynak erir.`,
      `Dark Lord gelirse tank + support şart.`,
      `bence bugünün meta karakteri sabır.`
    ],
    chaos: [
      `${target}, Rick'in Bavulu'nu açtım; bavul bana baktı.`,
      `EXO bunu duysa log dosyası tutar.`,
      `Dark Lord şu an chat okuyorsa hiçbirimiz güvende değiliz.`,
      `bu lobi normal değil, sadece arayüz güzel saklıyor.`
    ],
  };
  return Math.random() < 0.45 ? pickLine(personaLines[persona]) : pickLine(regionLines);
}

function buildAiReply(input: string, responder = "LobiBot", playerName = "Oyuncu") {
  const lower = input.toLocaleLowerCase("tr-TR");
  const cleanName = playerName.replace(/[_-]+/g, " ").trim() || "Oyuncu";
  const shortName = cleanName.split(/\s+/)[0] ?? cleanName;
  const persona = getBotPersona(responder);
  const targetPrefix = pickLine([
    `${shortName},`,
    `@${playerName}`,
    `${cleanName} bak,`,
    persona === "troll" ? "kanka dürüst olayım," : persona === "serious" ? "net analiz," : persona === "romantic" ? "tatlı ama gerçek," : persona === "trader" ? "pazar gözüyle," : persona === "chaos" ? "çok normal olmayan cevap:" : "bence,",
  ]);

  const topicReplies: string[] = [];

  const add = (lines: string[]) => topicReplies.push(...lines);

  if (lower.includes("rick")) add(persona === "chaos" ? [
    "Rick'in Bavulu açılınca oyun değil deney başlıyor; sonuç mantıklı olmak zorunda değil.",
    "Rick tarafına giriyorsan ya kahkaha ya pişmanlık çıkar, orta yol yok.",
    "Rick bunu görse 'oran değil travma simülasyonu' derdi."
  ] : [
    "Rick konusu eğlenceli ama ekonomi tarafında dikkatli olmak lazım.",
    "Rick sandığı hikaye olarak iyi, ama her ışık iyi drop demek değil.",
  ]);

  if (lower.includes("dark") || lower.includes("lord")) add(persona === "serious" || persona === "pro" ? [
    "Dark Lord evente girerse klansız girmek kaynak yakmak olur.",
    "Dark Lord için önce rol dizilimi, sonra anahtar planı; tersini yapan kaybeder.",
  ] : [
    "Dark Lord adı geçince lobi kararıyor, ben bunu normal bulmuyorum.",
    "Dark Lord gelirse global susmaz, sadece daha korkutucu yazar.",
  ]);

  if (lower.includes("exo")) add(persona === "trader" ? [
    "EXO ekonomisi serttir; yanlış fiyatı hem bot hem oyuncu affetmez.",
    "EXO tarafında her şey kayıt gibi, pazarda saçmalama şansı düşük."
  ] : [
    "EXO şirketi oyuna ciddi hava katıyor ama fazla güvenme.",
    "EXO ismi geçince lobi bir anda kurumsal panik moduna geçiyor."
  ]);

  if (lower.includes("pazar") || lower.includes("sat") || lower.includes("coin") || lower.includes("kredi")) add(persona === "trader" ? [
    "fiyat mantıklıysa AI kapar; saçma fiyat yazarsan ilan sadece dekor olur.",
    "1 krediye dev point yazarsan sistem değil ben bile reddederim.",
    "ucuz koyarsan anında gider, pahalı koyarsan kendinle göz göze kalırsın."
  ] : [
    "pazar işi duygu değil matematik; yanlış fiyatın romantizmi yok.",
    "buna önce fair range bakmak lazım, yoksa pazar seni tokatlar.",
  ]);

  if (lower.includes("klan")) add(persona === "romantic" ? [
    "klan güzel fikir, ama sohbeti canlı olmayan klan sadece tabela kalıyor.",
    "aktif ve iyi niyetli oyuncu bulursan klan gerçekten ev gibi olur."
  ] : [
    "klan kuracaksan aktif üye topla; süs üye sadece sayı şişirir.",
    "klan sohbeti canlıysa event kazanılır, sessiz klan sadece liste."
  ]);

  if (lower.includes("omega")) add([
    "Omega hedefi iyi ama kaynak planı yoksa hayal olarak kalır.",
    "Omega görünce global bağırır ama önce point ekonomisini toparlamak lazım.",
    "Omega için acele eden genelde krediyi yakar."
  ]);

  if (lower.includes("selam") || lower === "sa" || lower.startsWith("sa ")) add(persona === "troll" ? [
    "as, lobi sakin değil; sadece herkes suçunu gizliyor.",
    "as kral, pazara bakmadan sandık basarsan geçmiş olsun."
  ] : persona === "romantic" ? [
    "as, global bugün biraz kaotik ama sen hoş geldin.",
    "as, sakin gir; burada bazen kavga bazen dostluk çıkıyor."
  ] : [
    "as, önce bölgeyi ve hızı doğru seç, sonra kaosa gir.",
    "as, bugün pazar oynak; fiyat kontrol etmeden alma."
  ]);

  if (lower.includes("rank")) add(persona === "pro" || persona === "serious" ? [
    "rank için doğru kompozisyon şart; sadece güçlü karakter yetmez.",
    "rank kasmak istiyorsan takım rolü seç, herkes ego oynarsa düşersin.",
  ] : [
    "rankta sinirleniyorsan mola ver, yoksa klavye gider.",
    "rank bahaneyi sevmez; ya takım kur ya düşüşü izle."
  ]);

  if (lower.includes("anahtar") || lower.includes("çark") || lower.includes("cark")) add([
    "anahtar değerli; özellikle turnuva olanı rastgele harcama.",
    "çark basmadan önce hedefini seç, yoksa sadece animasyon izlemiş olursun.",
    "akademi anahtarı güvenli, turnuva anahtarı prestij işi."
  ]);

  if (lower.includes("sandık") || lower.includes("sandik")) add([
    "sandık açarken son sayaç parlıyorsa kalp ritmi artar, normal.",
    "kalitesiz sandık bile bazen fakir gururuyla sürpriz yapıyor.",
    "premium ışık veriyor diye garanti sanma, oyun psikolojik oynuyor."
  ]);

  if (lower.includes("gürkan") || lower.includes("gurkan")) add(persona === "romantic" ? [
    "GürkanHub tarafı fazla pembe ama kabul, atmosferi var.",
    "Gürkan adı geçince lobi sertleşiyor ama tema yumuşuyor, garip denge."
  ] : [
    "Gürkan adı geçince lobi ya ciddileşiyor ya komple dağılıyor.",
    "YargıçGürkan tarafında karar hızlı çıkar, itiraz zor."
  ]);

  const fallbackByPersona: Record<BotPersona, string[]> = {
    troll: [
      "bunu global not aldı, birazdan biri kesin kavga çıkarır.",
      "iyi dedin ama maçta ilk düşersen bu mesajı arşivlerim.",
      "bu fikir güzel, uygulaması lobi zekasına kalmış; yani tehlikedeyiz.",
      "şimdi biri gelip tamamen alakasız cevap yazacak, bekle."
    ],
    serious: [
      "mantıklı ama kaynak hesabı yapmadan uygulanmaz.",
      "bence önce küçük test et, sonra genele yay.",
      "karar doğru olabilir ama ekonomi etkisini kontrol etmek şart.",
      "bunu klan ve pazar verisiyle birlikte düşünmek lazım."
    ],
    romantic: [
      "bence fikir güzel, ama lobi biraz daha sakin olsa daha iyi anlaşılır.",
      "bu mesajın enerjisi iyi, sadece kaos fazla.",
      "bazen doğru hamle sert değil, temiz hamledir.",
      "global garip ama senin dediğin tutabilir."
    ],
    trader: [
      "bunu pazar fiyatına göre ölçerim; duygu ayrı, kredi ayrı.",
      "mantıklı ilan varsa alıcı çıkar, yoksa sistem bile yüzüne bakmaz.",
      "kredi akışı iyi olursa bu fikir çalışır.",
      "fiyat dengesi kurulmadan global sadece bağırır."
    ],
    pro: [
      "takım kompozisyonuna bağlarsan işe yarar.",
      "rank ve event tarafında karşılığı varsa değerli.",
      "bence bunu meta etkisiyle düşünmek lazım.",
      "doğru oyuncu grubuyla denenirse güçlü olur."
    ],
    chaos: [
      "bu fikir Rick'in laboratuvarında patlar ama eğlenceli olur.",
      "EXO bunu görse önce uyarı, sonra deney yapar.",
      "Dark Lord bunu duysa event açar, sonra kimse çıkamaz.",
      "mantık aramayın, bazen lobi kendi hikayesini yazar."
    ],
  };

  const base = topicReplies.length > 0 ? pickLine(topicReplies) : pickLine(fallbackByPersona[persona]);
  const suffixByPersona: Record<BotPersona, string[]> = {
    troll: ["", " net söylüyorum.", " sonra ağlama ama.", " bunu yazdım kenara."],
    serious: ["", " veri bunu söylüyor.", " acele karar verme.", " önce test şart."],
    romantic: ["", " ama kırmadan oynayın.", " global biraz sevgi görsün.", " güzel olur bence."],
    trader: ["", " fiyatı abartma yeter.", " alıcı mantığa bakar.", " pazar bunu hisseder."],
    pro: ["", " takım işi bu.", " doğru elde güçlü.", " meta buna dönebilir."],
    chaos: ["", " bu normal değil.", " Rick gülüyordur.", " EXO kayıt aldı bile."],
  };

  return `${targetPrefix} ${base}${pickLine(suffixByPersona[persona])}`;
}

function getProfileTitle(profile: InventoryProfile) {
  if (profile.profileTitle && profile.profileTitle.trim().length > 0) return profile.profileTitle.trim();
  const rank = getRankInfo(profile.rankPoints).name;
  if (rank === "Omega") return "Omega Efsanesi";
  if ((profile.items?.length ?? 0) >= 10) return "Koleksiyon Avcısı";
  if ((profile.levelPoints ?? 0) > 2500) return "Güç Yükseltici";
  return "Yeni Nesil Savaşçı";
}

function getProfileBaseGradient(profile: InventoryProfile) {
  const pattern = profile.profilePattern ?? "duz";
  if (pattern === "omega") return "from-fuchsia-500/28 via-amber-300/16 to-black";
  if (pattern === "kristalize") return "from-cyan-300/22 via-fuchsia-300/12 to-black";
  if (pattern === "efsanevi") return "from-amber-300/24 via-orange-500/12 to-black";
  if (pattern === "destansi") return "from-violet-400/22 via-fuchsia-500/10 to-black";
  if (pattern === "ender") return "from-emerald-300/20 via-lime-400/10 to-black";
  return "from-white/10 via-slate-500/8 to-black";
}

function makeMarketListings(fakeAccounts: TradeAccount[], seed = 0): MarketListing[] {
  const sellers = fakeAccounts.slice(0, 60).map((account) => account.name);
  const sellerAt = (index: number) => sellers[(index + seed) % Math.max(1, sellers.length)] ?? "PazarBot";
  const rng = (index: number) => {
    const x = Math.sin((seed + 1) * 9301 + index * 49297) * 233280;
    return x - Math.floor(x);
  };
  const pointAmounts = [180, 260, 360, 450, 620, 800, 950, 1200, 1500, 1800, 2200, 2600];
  const pointDescriptions = [
    "Hızlı yükseltme paketi",
    "Günlük kasma desteği",
    "Rank öncesi güç takviyesi",
    "EXO onaylı point ilanı",
    "Pazar fiyatı dengeli tutuldu",
    "Klan görevi sonrası satış",
  ];
  const keyDescriptions: Record<WheelType, string[]> = {
    acemi: ["Ucuz çark denemesi", "Günlük görev kaçıranlara", "Başlangıç anahtarı", "Düşük riskli şans bileti"],
    akademi: ["Dengeli çark fırsatı", "Orta kalite anahtar", "Klan kasası fazlası", "Event öncesi hazırlık"],
    turnuva: ["Nadir pazar ilanı", "Event ödülü fazlası", "Yüksek değerli anahtar", "Ucuza gitmez, değerli ürün"],
  };
  const qualities: NonNullable<MarketListing["quality"]>[] = ["normal", "good", "rare", "hot"];
  const listings: MarketListing[] = [];

  for (let i = 0; i < 10; i += 1) {
    const amount = pointAmounts[Math.floor(rng(i) * pointAmounts.length)] ?? 450;
    const fair = getFairMarketRange("levelPoints", amount);
    const price = Math.max(2, Math.round(fair.min + rng(i + 21) * (fair.max - fair.min)));
    listings.push({
      id: `m-lp-${seed}-${i}-${amount}`,
      seller: sellerAt(i),
      title: `${amount.toLocaleString("tr-TR")} Seviye Point`,
      description: pointDescriptions[Math.floor(rng(i + 7) * pointDescriptions.length)] ?? "Point ilanı",
      price,
      rewardType: "levelPoints",
      amount,
      quality: price <= Math.ceil((fair.min + fair.max) / 2) ? "hot" : qualities[Math.floor(rng(i + 11) * qualities.length)] ?? "normal",
    });
  }

  const wheelPool: WheelType[] = ["acemi", "acemi", "akademi", "akademi", "akademi", "turnuva"];
  for (let i = 0; i < 8; i += 1) {
    const wheel = wheelPool[Math.floor(rng(i + 40) * wheelPool.length)] ?? "acemi";
    const amount = wheel === "turnuva" ? 1 : rng(i + 41) > 0.78 ? 2 : 1;
    const fair = getFairMarketRange(wheel, amount);
    const price = Math.max(1, Math.round(fair.min + rng(i + 44) * (fair.max - fair.min)));
    listings.push({
      id: `m-key-${seed}-${wheel}-${i}-${amount}`,
      seller: sellerAt(i + 10),
      title: fair.label,
      description: keyDescriptions[wheel][Math.floor(rng(i + 46) * keyDescriptions[wheel].length)] ?? "Anahtar ilanı",
      price,
      rewardType: "wheelKey",
      amount,
      wheel,
      quality: wheel === "turnuva" ? "rare" : price <= Math.ceil((fair.min + fair.max) / 2) ? "hot" : wheel === "akademi" ? "good" : "normal",
    });
  }

  return listings.sort((a, b) => {
    const hotA = a.quality === "hot" ? 0 : a.quality === "rare" ? 1 : a.quality === "good" ? 2 : 3;
    const hotB = b.quality === "hot" ? 0 : b.quality === "rare" ? 1 : b.quality === "good" ? 2 : 3;
    return hotA - hotB || a.price - b.price;
  });
}

function getFairMarketRange(type: PlayerMarketDraftType, amount: number) {
  const safeAmount = Math.max(1, Math.floor(amount));
  if (type === "levelPoints") {
    const min = Math.max(2, Math.ceil(safeAmount / 45));
    const max = Math.max(min + 3, Math.ceil(safeAmount / 12));
    return { min, max, label: `${safeAmount} Seviye Point` };
  }
  const base = type === "acemi" ? 8 : type === "akademi" ? 18 : 68;
  const min = base * safeAmount;
  const max = Math.ceil(base * 2.4 * safeAmount);
  const label = type === "acemi" ? `${safeAmount} Acemi Anahtarı` : type === "akademi" ? `${safeAmount} Akademi Anahtarı` : `${safeAmount} Turnuva Anahtarı`;
  return { min, max, label };
}

function getDraftOwnedAmount(profile: InventoryProfile, type: PlayerMarketDraftType) {
  if (type === "levelPoints") return profile.levelPoints ?? 0;
  const keys = normalizeWheelKeys(profile.wheelKeys);
  return keys[type];
}

function MarketListingVisual({ listing }: { listing: MarketListing }) {
  const isPoint = listing.rewardType === "levelPoints";
  const wheel = listing.wheel ?? "acemi";
  const tone = isPoint
    ? "from-cyan-200 via-sky-400 to-blue-900"
    : wheel === "turnuva"
    ? "from-amber-200 via-orange-500 to-rose-900"
    : wheel === "akademi"
    ? "from-fuchsia-200 via-violet-500 to-indigo-950"
    : "from-slate-200 via-sky-500 to-blue-950";

  return (
    <div className={`relative flex h-28 items-center justify-center overflow-hidden rounded-[26px] border-[4px] border-black bg-gradient-to-br ${tone} shadow-[inset_0_0_36px_rgba(255,255,255,0.28),0_8px_0_rgba(0,0,0,0.34)]`}>
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.8)_0_3px,transparent_4px),radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.45)_0_2px,transparent_3px)] [background-size:28px_28px]" />
      <div className="absolute left-3 top-3 rounded-full border-[3px] border-black bg-white/90 px-3 py-1 text-[10px] font-black text-black">PAZAR ÜRÜNÜ</div>
      {isPoint ? (
        <div className="relative grid h-20 w-20 place-items-center rounded-3xl border-[4px] border-black bg-white/90 text-center text-black shadow-[0_6px_0_rgba(0,0,0,0.35)]">
          <Star className="absolute h-16 w-16 text-sky-300/45" />
          <div className="relative text-3xl font-black tracking-[-0.08em]">LP</div>
        </div>
      ) : (
        <div className="relative scale-110">
          <WheelKeyArt wheel={wheel} size="large" />
        </div>
      )}
      <div className="absolute bottom-2 right-3 rounded-full border-[3px] border-black bg-black/78 px-3 py-1 text-xs font-black text-white">x{listing.amount}</div>
    </div>
  );
}

function SocialClanMarketSection({
  activeProfile,
  profiles,
  setProfiles,
  fakeAccounts,
  setFakeAccounts,
  tradeOnlyAccounts,
  setTradeOnlyAccounts,
  onAddCredits,
  onAddLevelPoints,
  onAddWheelKeys,
  uiSfx,
}: {
  activeProfile: InventoryProfile;
  profiles: InventoryProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<InventoryProfile[]>>;
  fakeAccounts: TradeAccount[];
  setFakeAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
  tradeOnlyAccounts: TradeAccount[];
  setTradeOnlyAccounts: React.Dispatch<React.SetStateAction<TradeAccount[]>>;
  onAddCredits: (id: InventoryProfile["id"], amount: number, matches?: number) => void;
  onAddLevelPoints: (id: InventoryProfile["id"], amount: number) => void;
  onAddWheelKeys: (id: InventoryProfile["id"], wheel: WheelType, amount: number) => void;
  uiSfx: ReturnType<typeof useUiSfx>;
}) {
  const [socialTab, setSocialTab] = useState<"global" | "clan" | "market" | "trades">("global");
  const [chatSpeed, setChatSpeed] = useState<ChatSpeed>("medium");
  const [chatRegion, setChatRegion] = useState<ChatRegion>("tr");
  const [globalMessages, setGlobalMessages] = useState<SocialChatMessage[]>(() => [
    createSocialMessage("LEGOVERSE global kanal açıldı. Bölgeyi seç, hızı ayarla, kaosa kontrollü gir.", "[EXO Server]", "system"),
    createSocialMessage("Rick'in Bavulu bugün kimde patladı?", "RickFan62", "normal"),
    createSocialMessage("Dark Lord söylentisi pazarı bile gerdi", "ShadowKid", "troll"),
    createSocialMessage("EXO şirketi fiyatları izliyor, saçma ilan atma", "PazarBot", "system"),
    createSocialMessage("turnuva anahtarı eventliktir, ucuz koyan pişman olur", "JudgeNova", "pro"),
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [clans, setClans] = useState<ClanInfo[]>(() => DEFAULT_CLANS.map(normalizeClanForGame));
  const [activeClanId, setActiveClanId] = useState<string>("crystal-wolves");
  const [clanMessages, setClanMessages] = useState<SocialChatMessage[]>(() => [
    createSocialMessage("Klan sohbeti aktif. Sadece seçili klanın üyeleri konuşur.", "Klan Sistemi", "system", "crystal-wolves"),
    createSocialMessage("Akşam eventte herkes hazır olsun.", "Klan Lideri", "pro", "crystal-wolves"),
  ]);
  const [clanStorageReady, setClanStorageReady] = useState(false);
  const [clanInput, setClanInput] = useState("");
  const [newClanName, setNewClanName] = useState("");
  const [playerToAdd, setPlayerToAdd] = useState("");
  const [marketStatus, setMarketStatus] = useState("");
  const [playerListings, setPlayerListings] = useState<MarketListing[]>([]);
  const [marketRefreshTick, setMarketRefreshTick] = useState(0);
  const [draftType, setDraftType] = useState<PlayerMarketDraftType>("levelPoints");
  const [draftAmount, setDraftAmount] = useState(250);
  const [draftPrice, setDraftPrice] = useState(12);
  const globalChatEndRef = useRef<HTMLDivElement | null>(null);
  const clanChatEndRef = useRef<HTMLDivElement | null>(null);
  const [liveLobbyStats, setLiveLobbyStats] = useState(() => ({
    activePlayers: 184000 + Math.floor(Math.random() * 72000),
    typingPlayers: 4200 + Math.floor(Math.random() * 6800),
    eventPlayers: 36000 + Math.floor(Math.random() * 54000),
  }));

  const aiListings = useMemo(() => {
    const rotatedAccounts = [...fakeAccounts].sort((a, b) => {
      const left = (a.name.charCodeAt(0) + marketRefreshTick * 17) % 997;
      const right = (b.name.charCodeAt(0) + marketRefreshTick * 31) % 997;
      return left - right;
    });
    return makeMarketListings(rotatedAccounts, marketRefreshTick).map((listing, index) => ({
      ...listing,
      id: `ai-market-${marketRefreshTick}-${index}-${listing.seller}`,
    }));
  }, [fakeAccounts, marketRefreshTick]);

  const listings = useMemo(() => {
    const playerFirst = playerListings.map((listing) => ({ ...listing, quality: listing.quality === "normal" ? "hot" as const : listing.quality }));
    return [...playerFirst, ...aiListings].slice(0, 18);
  }, [playerListings, aiListings]);
  const activeClan = clans.find((clan) => clan.id === activeClanId) ?? clans[0] ?? DEFAULT_CLANS[0];
  const visibleClanMessages = clanMessages.filter((message) => message.clan === activeClan?.id);
  const ownedDraftAmount = getDraftOwnedAmount(activeProfile, draftType);
  const fairDraft = getFairMarketRange(draftType, draftAmount);
  const getClanMemberRank = (member: string, index: number) => {
    const normalized = normalizePlayerNameForMatch(member);
    const profileMatch = profiles.find((profile) => normalizePlayerNameForMatch(profile.name) === normalized);
    if (profileMatch) return getRankInfo(profileMatch.rankPoints ?? 0);
    const accountMatch = [...fakeAccounts, ...tradeOnlyAccounts].find((account) => normalizePlayerNameForMatch(account.name) === normalized);
    if (accountMatch) return getRankInfo(accountMatch.rankPoints ?? 0);
    const baseByClanLevel = Math.max(0, ((activeClan?.level ?? 1) - 1) * 58);
    const nameScore = member.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
    return getRankInfo(baseByClanLevel + ((nameScore + index * 37) % 520));
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMarketRefreshTick((prev) => prev + 1);
      if (Math.random() < 0.35) {
        setMarketStatus("Pazar yenilendi: satılan ürünler, fiyatlar ve satıcılar güncellendi; oyuncu ilanları korunuyor.");
      }
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const allKnownPlayerNames = useMemo(() => {
    const names = [
      ...profiles.map((profile) => profile.name),
      ...fakeAccounts.map((account) => account.name),
      ...tradeOnlyAccounts.map((account) => account.name),
      ...SOCIAL_BOT_NAMES,
      ...DEFAULT_CLANS.flatMap((clan) => clan.members),
    ];
    return Array.from(new Set(names.filter(Boolean)));
  }, [profiles, fakeAccounts, tradeOnlyAccounts]);
  const activeClanRole = getClanRole(activeClan, activeProfile.name, activeClan?.members.indexOf(activeProfile.name) ?? -1);
  const isActiveClanFounder = activeClanRole === "Kurucu";
  const canAddClanMember = activeClanRole === "Kurucu" || activeClanRole === "Yardımcı";

  useEffect(() => {
    if (typeof window === "undefined") {
      setClanStorageReady(true);
      return;
    }
    try {
      const savedClans = window.localStorage.getItem(SOCIAL_CLAN_STORAGE_KEY);
      const savedActiveClanId = window.localStorage.getItem(SOCIAL_ACTIVE_CLAN_STORAGE_KEY);
      const savedClanMessages = window.localStorage.getItem(SOCIAL_CLAN_MESSAGES_STORAGE_KEY);

      if (savedClans) {
        const parsedClans = JSON.parse(savedClans) as ClanInfo[];
        if (Array.isArray(parsedClans) && parsedClans.length > 0) {
          const cleanClans = parsedClans
            .filter((clan) => clan && typeof clan.id === "string" && typeof clan.name === "string")
            .map(normalizeClanForGame);
          if (cleanClans.length > 0) setClans(cleanClans);
        }
      }

      if (savedActiveClanId && typeof savedActiveClanId === "string") {
        setActiveClanId(savedActiveClanId);
      }

      if (savedClanMessages) {
        const parsedMessages = JSON.parse(savedClanMessages) as SocialChatMessage[];
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setClanMessages(parsedMessages.slice(-160));
        }
      }
    } catch {}
    setClanStorageReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !clanStorageReady) return;
    try {
      window.localStorage.setItem(SOCIAL_CLAN_STORAGE_KEY, JSON.stringify(clans));
      window.localStorage.setItem(SOCIAL_ACTIVE_CLAN_STORAGE_KEY, activeClanId);
      window.localStorage.setItem(SOCIAL_CLAN_MESSAGES_STORAGE_KEY, JSON.stringify(clanMessages.slice(-160)));
    } catch {}
  }, [clans, activeClanId, clanMessages, clanStorageReady]);

  useEffect(() => {
    if (!clanStorageReady || clans.some((clan) => clan.id === activeClanId)) return;
    setActiveClanId(clans[0]?.id ?? DEFAULT_CLANS[0].id);
  }, [clans, activeClanId, clanStorageReady]);

  const scrollChatPanelToBottom = (endRef: React.RefObject<HTMLDivElement | null>) => {
    const scrollPanel = endRef.current?.parentElement?.parentElement;
    if (!scrollPanel) return;
    scrollPanel.scrollTop = scrollPanel.scrollHeight;
  };

  useEffect(() => {
    if (socialTab !== "global") return;
    scrollChatPanelToBottom(globalChatEndRef);
  }, [globalMessages.length, socialTab]);

  useEffect(() => {
    if (socialTab !== "clan") return;
    scrollChatPanelToBottom(clanChatEndRef);
  }, [clanMessages.length, socialTab, activeClanId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveLobbyStats((prev) => ({
        activePlayers: Math.max(148000, prev.activePlayers + Math.floor(Math.random() * 5200) - 2100),
        typingPlayers: Math.max(1800, prev.typingPlayers + Math.floor(Math.random() * 900) - 360),
        eventPlayers: Math.max(9000, prev.eventPlayers + Math.floor(Math.random() * 3400) - 1200),
      }));
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const botName = fakeAccounts.length > 0
        ? fakeAccounts[Math.floor(Math.random() * fakeAccounts.length)]?.name
        : SOCIAL_BOT_NAMES[Math.floor(Math.random() * SOCIAL_BOT_NAMES.length)];
      const regionLines = REGION_CHAT_LINES[chatRegion] ?? REGION_CHAT_LINES.tr;
      const recent = globalMessages[globalMessages.length - 1];
      const targetName = recent?.author && recent.author !== botName ? recent.author : SOCIAL_BOT_NAMES[Math.floor(Math.random() * SOCIAL_BOT_NAMES.length)];
      const line = Math.random() < 0.58
        ? buildBotAmbientLine(botName, regionLines, recent?.text, targetName)
        : regionLines[Math.floor(Math.random() * regionLines.length)];
      setGlobalMessages((prev) => [
        ...prev.slice(-88),
        createSocialMessage(line, botName, getToneFromPersona(getBotPersona(botName))),
      ]);
    }, CHAT_SPEED_MS[chatSpeed]);
    return () => window.clearInterval(interval);
  }, [fakeAccounts, chatRegion, chatSpeed, globalMessages]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClanMessages((prev) => {
        const clan = clans[Math.floor(Math.random() * Math.max(1, clans.length))];
        const members = clan?.members ?? ["KlanBot"];
        return [
          ...prev.slice(-54),
          createSocialMessage(CLAN_CHAT_LINES[Math.floor(Math.random() * CLAN_CHAT_LINES.length)], members[Math.floor(Math.random() * members.length)], "pro", clan?.id),
        ];
      });
    }, 1900);
    return () => window.clearInterval(interval);
  }, [clans]);

  const sendGlobal = () => {
    const text = chatInput.trim();
    if (!text) return;
    const availableBots = [
      ...fakeAccounts.slice(0, 80).map((account) => account.name),
      ...SOCIAL_BOT_NAMES,
    ].filter((name) => name && name !== activeProfile.name);
    const replyCount = 2 + Math.floor(Math.random() * 3);
    const shuffledBots = [...availableBots].sort(() => Math.random() - 0.5).slice(0, replyCount);
    const replies = shuffledBots.map((botName, index) => {
      const reply = buildAiReply(text, botName, activeProfile.name);
      const extra = index === 0 && Math.random() < 0.38
        ? ` ${pickLine(["buna katılan var mı?", "bunu klana da yazın.", "pazar tarafı bunu etkiler.", "Rick bunu duysa gülerdi.", "EXO bunu not eder."])}`
        : "";
      return createSocialMessage(`${reply}${extra}`, botName, getToneFromPersona(getBotPersona(botName)));
    });
    if (Math.random() < 0.45 && replies.length >= 2) {
      replies.push(createSocialMessage(`${replies[0].author} ile aynı fikirde değilim; ${text.toLocaleLowerCase("tr-TR").includes("pazar") ? "fiyatı önce test etmek lazım" : "bence lobi bunu farklı oynar"}.`, replies[1].author, getToneFromPersona(getBotPersona(replies[1].author))));
    }
    setGlobalMessages((prev) => [
      ...prev.slice(-88),
      createSocialMessage(text, activeProfile.name, "normal"),
      ...replies,
    ]);
    setChatInput("");
    uiSfx.tab();
  };

  const sendClan = () => {
    const text = clanInput.trim();
    if (!text || !activeClan) return;
    setClanMessages((prev) => [
      ...prev.slice(-54),
      createSocialMessage(text, activeProfile.name, "normal", activeClan.id),
      createSocialMessage("plan listesine aldım, maçta deneriz.", `${activeClan.tag} Asistan`, "system", activeClan.id),
    ]);
    setClanInput("");
    uiSfx.tab();
  };

  const createClan = () => {
    const name = newClanName.trim();
    if (name.length < 3) {
      setClanMessages((prev) => [...prev.slice(-54), createSocialMessage("Klan adı en az 3 karakter olmalı.", "Klan Sistemi", "system", activeClanId)]);
      uiSfx.fail();
      return;
    }
    const id = `clan-${Date.now()}`;
    const tag = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase() || "NEW";
    const newClan: ClanInfo = {
      id,
      name,
      tag,
      level: 1,
      members: [activeProfile.name],
      roles: { [activeProfile.name]: "Kurucu" },
      color: "from-sky-500/35 via-blue-700/25 to-black",
      motto: "Yeni kuruldu. Hedef: aktif üyeler ve temiz ekonomi.",
      requirement: "Kurucu daveti",
    };
    setClans((prev) => [newClan, ...prev]);
    setActiveClanId(id);
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${name} kuruldu. İlk mesaj kurucudan bekleniyor.`, "Klan Sistemi", "system", id)]);
    setNewClanName("");
    uiSfx.shopBuy();
  };

  const joinClan = (clanId: string) => {
    setClans((prev) =>
      prev.map((clan) =>
        clan.id === clanId && !clan.members.includes(activeProfile.name)
          ? normalizeClanForGame({
              ...clan,
              members: [activeProfile.name, ...clan.members],
              roles: { ...(clan.roles ?? {}), [activeProfile.name]: "Üye" },
            })
          : clan
      )
    );
    setActiveClanId(clanId);
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${activeProfile.name} klana katıldı.`, "Klan Sistemi", "system", clanId)]);
    uiSfx.shopBuy();
  };

  const addClanPlayer = () => {
    const query = playerToAdd.trim();
    if (!query || !activeClan) return;
    if (!canAddClanMember) {
      setClanMessages((prev) => [...prev.slice(-54), createSocialMessage("Oyuncu eklemek için Kurucu veya Yardımcı olmalısın.", "Klan Sistemi", "system", activeClan.id)]);
      uiSfx.fail();
      return;
    }
    const normalizedQuery = normalizePlayerNameForMatch(query);
    const realName = allKnownPlayerNames.find((name) => normalizePlayerNameForMatch(name) === normalizedQuery);
    if (!realName) {
      setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${query} oyunda kayıtlı oyuncu olarak bulunamadı.`, "Klan Sistemi", "system", activeClan.id)]);
      uiSfx.fail();
      return;
    }
    if (activeClan.members.includes(realName)) {
      setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${realName} zaten bu klanda.`, "Klan Sistemi", "system", activeClan.id)]);
      uiSfx.fail();
      return;
    }
    if (activeClan.members.length >= 30) {
      setClanMessages((prev) => [...prev.slice(-54), createSocialMessage("Klan 30/30 dolu.", "Klan Sistemi", "system", activeClan.id)]);
      uiSfx.fail();
      return;
    }
    setClans((prev) =>
      prev.map((clan) =>
        clan.id === activeClan.id
          ? normalizeClanForGame({
              ...clan,
              members: [...clan.members, realName],
              roles: { ...(clan.roles ?? {}), [realName]: "Üye" },
            })
          : clan
      )
    );
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${realName} klana eklendi.`, "Klan Sistemi", "system", activeClan.id)]);
    setPlayerToAdd("");
    uiSfx.shopBuy();
  };

  const promoteClanMember = (member: string) => {
    if (!activeClan || !isActiveClanFounder || member === activeProfile.name) return;
    setClans((prev) =>
      prev.map((clan) =>
        clan.id === activeClan.id
          ? normalizeClanForGame({ ...clan, roles: { ...(clan.roles ?? {}), [member]: "Yardımcı" } })
          : clan
      )
    );
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${member} artık Klan Yardımcısı.`, "Klan Sistemi", "system", activeClan.id)]);
    uiSfx.shopBuy();
  };

  const demoteClanMember = (member: string) => {
    if (!activeClan || !isActiveClanFounder || member === activeProfile.name) return;
    setClans((prev) =>
      prev.map((clan) =>
        clan.id === activeClan.id
          ? normalizeClanForGame({ ...clan, roles: { ...(clan.roles ?? {}), [member]: "Üye" } })
          : clan
      )
    );
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${member} Yardımcı rolünden alındı.`, "Klan Sistemi", "system", activeClan.id)]);
    uiSfx.tab();
  };

  const kickClanMember = (member: string) => {
    if (!activeClan || !isActiveClanFounder || member === activeProfile.name) return;
    const nextRoles = { ...(activeClan.roles ?? {}) };
    delete nextRoles[member];
    setClans((prev) =>
      prev.map((clan) =>
        clan.id === activeClan.id
          ? normalizeClanForGame({ ...clan, members: clan.members.filter((item) => item !== member), roles: nextRoles })
          : clan
      )
    );
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${member} klandan atıldı.`, "Klan Sistemi", "system", activeClan.id)]);
    uiSfx.fail();
  };

  const deleteActiveClan = () => {
    if (!activeClan || !isActiveClanFounder) {
      if (activeClan) {
        setClanMessages((prev) => [...prev.slice(-54), createSocialMessage("Klanı sadece Kurucu silebilir.", "Klan Sistemi", "system", activeClan.id)]);
      }
      uiSfx.fail();
      return;
    }
    const deletedClanId = activeClan.id;
    const remainingClans = clans.filter((clan) => clan.id !== deletedClanId);
    const fallbackClans = remainingClans.length > 0 ? remainingClans : DEFAULT_CLANS.map(normalizeClanForGame);
    setClans(fallbackClans);
    setActiveClanId(fallbackClans[0]?.id ?? DEFAULT_CLANS[0].id);
    setClanMessages((prev) => [...prev.slice(-54), createSocialMessage(`${activeClan.name} klanı silindi.`, "Klan Sistemi", "system", deletedClanId)]);
    uiSfx.fail();
  };

  const buyListing = (listing: MarketListing) => {
    if (activeProfile.credits < listing.price) {
      setMarketStatus("Kredi yetmiyor. Pazar acımasızdır.");
      uiSfx.fail();
      return;
    }
    onAddCredits(activeProfile.id, -listing.price);
    if (listing.rewardType === "levelPoints") onAddLevelPoints(activeProfile.id, listing.amount);
    if (listing.rewardType === "wheelKey" && listing.wheel) onAddWheelKeys(activeProfile.id, listing.wheel, listing.amount);
    setPlayerListings((prev) => prev.filter((item) => item.id !== listing.id));
    setMarketStatus(`${listing.title} satın alındı. Satıcı: ${listing.seller}`);
    uiSfx.shopBuy();
  };

  const listPlayerItem = () => {
    const amount = Math.max(1, Math.floor(Number(draftAmount) || 1));
    const price = Math.max(1, Math.floor(Number(draftPrice) || 1));
    const fair = getFairMarketRange(draftType, amount);
    const owned = getDraftOwnedAmount(activeProfile, draftType);
    if (amount > owned) {
      setMarketStatus(`Bu kadar ürün yok. Elindeki miktar: ${owned}`);
      uiSfx.fail();
      return;
    }
    if (price < fair.min || price > fair.max) {
      setMarketStatus(`Pazar reddetti: ${fair.label} için mantıklı fiyat aralığı ${fair.min}-${fair.max} kredi.`);
      uiSfx.fail();
      return;
    }
    if (draftType === "levelPoints") onAddLevelPoints(activeProfile.id, -amount);
    if (draftType !== "levelPoints") onAddWheelKeys(activeProfile.id, draftType, -amount);
    const listing: MarketListing = {
      id: `player-market-${Date.now()}`,
      seller: activeProfile.name,
      title: fair.label,
      description: "Oyuncu ilanı • AI alıcılar fiyat mantıklıysa satın alabilir.",
      price,
      rewardType: draftType === "levelPoints" ? "levelPoints" : "wheelKey",
      amount,
      wheel: draftType === "levelPoints" ? undefined : draftType,
      quality: price <= Math.ceil((fair.min + fair.max) / 2) ? "hot" : "good",
    };
    setPlayerListings((prev) => [listing, ...prev].slice(0, 12));
    setMarketStatus("İlan pazara koyuldu. AI alıcılar fiyatı tarıyor...");
    uiSfx.shopBuy();
    window.setTimeout(() => {
      setPlayerListings((prev) => prev.filter((item) => item.id !== listing.id));
      onAddCredits(activeProfile.id, price);
      setMarketStatus(`${listing.title} AI oyuncu tarafından satın alındı. +${price} kredi`);
      setGlobalMessages((messages) => [
        ...messages.slice(-62),
        createSocialMessage(`${listing.title} pazardan kapıldı. Fiyat mantıklıydı.`, "PazarBot", "system"),
      ]);
      uiSfx.shopBuy();
    }, 2200 + Math.floor(Math.random() * 2200));
  };

  const renderMessages = (messages: SocialChatMessage[], endRef: React.RefObject<HTMLDivElement | null>, mode: "global" | "clan") => {
    const query = chatSearch.trim().toLocaleLowerCase("tr-TR");
    const shownMessages = (query
      ? messages.filter((message) => `${message.author} ${message.text}`.toLocaleLowerCase("tr-TR").includes(query))
      : messages
    ).slice(-120);

    return (
      <div className={`${mode === "global" ? "h-[680px] bg-[linear-gradient(180deg,#dff8ff,#b3ecff_46%,#7fd3f2)] text-[#082132]" : "h-[540px] bg-[#071d4b]/95 text-white"} overflow-y-auto border-[4px] border-black shadow-[inset_0_0_0_2px_rgba(255,255,255,0.28)]`}>
        <div className="space-y-1.5 p-4 font-mono text-[14px] leading-relaxed">
          {shownMessages.map((message) => {
            const isMine = message.author === activeProfile.name;
            return (
              <div
                key={message.id}
                className={`${isMine ? "ml-auto max-w-[86%] rounded-xl border-[3px] border-black bg-emerald-400 px-3 py-2 font-black text-[#052615] shadow-[0_4px_0_rgba(0,0,0,0.35)]" : message.tone === "system" ? "rounded bg-amber-300/40 px-2 py-1 font-black text-amber-900" : message.tone === "troll" ? "font-bold text-red-700" : mode === "global" ? "text-[#102a3d]" : "text-sky-50"}`}
              >
                <span className="font-black">[{isMine ? "SEN" : message.author}]</span> {message.text}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden border-[5px] border-black bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,180,70,0.22),transparent_30%),linear-gradient(135deg,#07162f,#0d4fb8_48%,#123b85_72%,#ff8a1f)] p-5 shadow-[0_12px_0_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0_18px,transparent_19px)] [background-size:130px_130px]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-[3px_4px_0_rgba(0,0,0,0.75)]">LEGOVERSE SOSYAL MERKEZ</div>
            <div className="mt-1 text-sm font-bold text-sky-100">Global chat, klan lobisi ve oyuncular arası pazar tek yerde.</div>
          </div>
          <div className="rounded-xl border-[4px] border-black bg-[#1d2a4a] px-4 py-3 text-right shadow-[0_5px_0_rgba(0,0,0,0.45)]">
            <div className="text-[11px] font-black uppercase text-sky-200">Aktif Profil</div>
            <div className="text-lg font-black text-white">{activeProfile.name}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["global", "GLOBAL CHAT", "Canlı lobi konuşmaları"],
          ["clan", "KULÜP", "Klan kur, katıl, konuş"],
          ["market", "PAZAR", "İlan koy ve satın al"],
          ["trades", "TAKASLAR", "Krem bordo aktarım merkezi"],
        ].map(([id, title, sub]) => (
          <button
            key={id}
            onClick={() => setSocialTab(id as "global" | "clan" | "market" | "trades")}
            className={`rounded-2xl border border-white/16 px-5 py-4 text-left shadow-[0_14px_38px_rgba(0,0,0,0.24)] backdrop-blur-xl transition active:translate-y-1 ${socialTab === id ? "bg-gradient-to-r from-fuchsia-500/80 via-sky-500/70 to-cyan-300/75 text-white ring-1 ring-white/35" : "bg-white/[0.075] text-white hover:bg-white/[0.12]"}`}
          >
            <div className="text-2xl font-black drop-shadow-[2px_3px_0_rgba(0,0,0,0.6)]">{title}</div>
            <div className="text-xs font-bold text-white/80">{sub}</div>
          </button>
        ))}
      </div>

      {socialTab === "global" && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border-[5px] border-black bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(0,145,255,0.22),transparent_30%),linear-gradient(180deg,#a9eaff,#5fb9e8_55%,#2d76c8)] p-4 shadow-[0_10px_0_rgba(0,0,0,0.45)]">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-black uppercase text-white drop-shadow-[3px_4px_0_rgba(0,0,0,0.9)] [-webkit-text-stroke:1.4px_black]">GLOBAL CHAT</div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[#08385e]">Global Chat</div>
              </div>
              <div className="rounded-lg border-[3px] border-black bg-white/80 px-3 py-2 text-right text-xs font-black text-[#07243a] shadow-[0_4px_0_rgba(0,0,0,0.35)]">
                {chatRegion === "tr" ? "TR LOBİ" : chatRegion === "abd" ? "ABD LOBİ" : chatRegion === "cin" ? "ÇİN LOBİ" : "ARAP LOBİ"}
              </div>
            </div>
            {renderMessages(globalMessages, globalChatEndRef, "global")}
            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendGlobal()}
                placeholder="Mesaj yaz..."
                className="flex-1 border-[3px] border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none"
              />
              <button onClick={sendGlobal} className="border-[3px] border-black bg-[#ff8a00] px-5 py-3 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.45)]">GÖNDER</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-[5px] border-black bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_25%),linear-gradient(180deg,#102b72,#143f9f_58%,#0a1f54)] p-4 text-white shadow-[0_10px_0_rgba(0,0,0,0.45)]">
              <div className="mb-3 text-2xl font-black uppercase drop-shadow-[2px_3px_0_rgba(0,0,0,0.75)]">Lobi Kontrol</div>
              <div className="space-y-3">
                <div className="border-[3px] border-black bg-white/10 p-3 shadow-[0_4px_0_rgba(0,0,0,0.35)]">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">Ara</div>
                  <input value={chatSearch} onChange={(event) => setChatSearch(event.target.value)} placeholder="Mesaj veya oyuncu ara..." className="w-full border-[3px] border-black bg-white px-3 py-2 text-sm font-bold text-black outline-none" />
                </div>
                <div className="border-[3px] border-black bg-white/10 p-3 shadow-[0_4px_0_rgba(0,0,0,0.35)]">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">Akış Hızı</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(["slow", "medium", "fast"] as ChatSpeed[]).map((speed) => (
                      <button key={speed} onClick={() => setChatSpeed(speed)} className={`border-2 border-black px-2 py-2 text-xs font-black ${chatSpeed === speed ? "bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-400 text-white" : "bg-white text-black"}`}>
                        {speed === "slow" ? "Yavaş" : speed === "medium" ? "Orta" : "Hızlı"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-[3px] border-black bg-white/10 p-3 shadow-[0_4px_0_rgba(0,0,0,0.35)]">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">Global Bölge</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["tr", "abd", "cin", "arap"] as ChatRegion[]).map((region) => (
                      <button key={region} onClick={() => setChatRegion(region)} className={`border-2 border-black px-2 py-2 text-xs font-black ${chatRegion === region ? "bg-cyan-300 text-black" : "bg-white text-black"}`}>
                        {region === "tr" ? "TR" : region === "abd" ? "ABD" : region === "cin" ? "ÇİN" : "ARAP"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-[5px] border-black bg-[linear-gradient(135deg,#fff7d6,#ffb64a_48%,#f15d2a)] p-4 text-black shadow-[0_10px_0_rgba(0,0,0,0.45)]">
              <div className="text-xl font-black uppercase">Lobi Nabzı</div>
              <div className="mt-2 space-y-2 text-sm font-black">
                <div className="border-2 border-black bg-white/75 px-3 py-2">Aktif oyuncu: {liveLobbyStats.activePlayers.toLocaleString("tr-TR")}</div>
                <div className="border-2 border-black bg-white/75 px-3 py-2">Şu an yazan: {liveLobbyStats.typingPlayers.toLocaleString("tr-TR")}</div>
                <div className="border-2 border-black bg-white/75 px-3 py-2">Eventte oynayan: {liveLobbyStats.eventPlayers.toLocaleString("tr-TR")}</div>
                <div className="border-2 border-black bg-white/75 px-3 py-2">Bölge: {chatRegion === "tr" ? "Türkiye" : chatRegion === "abd" ? "ABD" : chatRegion === "cin" ? "Çin" : "Arap Lobisi"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {socialTab === "clan" && (
        <div className="border-[5px] border-black bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.22),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,149,0,0.24),transparent_32%),linear-gradient(135deg,#061532,#0646a5,#1b2b78)] p-5 shadow-[0_12px_0_rgba(0,0,0,0.45)]">
          <div className="mb-5 text-center text-5xl font-black uppercase text-white drop-shadow-[4px_5px_0_rgba(0,0,0,0.75)]">KULÜP</div>
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="space-y-4">
              <div className="border-[4px] border-black bg-[#0d7dff] p-4 shadow-[0_7px_0_rgba(0,0,0,0.4)]">
                <div className="text-center text-3xl font-black text-white drop-shadow-[2px_3px_0_rgba(0,0,0,0.7)]">{activeClan?.name ?? "Klan Yok"}</div>
                <div className="mt-3 text-center text-sm font-black text-sky-100">{activeClan?.motto}</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="border-[3px] border-black bg-[#1662c9] p-3 text-center text-white"><div className="text-xs font-black">ÜYE</div><div className="text-xl font-black">{activeClan?.members.length ?? 0}/30</div></div>
                  <div className="border-[3px] border-black bg-[#1662c9] p-3 text-center text-white"><div className="text-xs font-black">LEVEL</div><div className="text-xl font-black">{activeClan?.level ?? 1}</div></div>
                </div>
              </div>

              <div className="border-[4px] border-black bg-[#0d7dff] p-3 shadow-[0_7px_0_rgba(0,0,0,0.4)]">
                <div className="mb-2 text-sm font-black uppercase text-white">Klan kur / yönet</div>
                <input value={newClanName} onChange={(event) => setNewClanName(event.target.value)} placeholder="Yeni klan adı" className="mb-2 w-full border-[3px] border-black bg-white px-3 py-2 text-sm font-bold text-black" />
                <button onClick={createClan} className="mb-3 w-full border-[3px] border-black bg-emerald-500 px-4 py-2 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.35)]">KLAN KUR</button>
                <div className="mb-2 rounded border-[3px] border-black bg-black/25 px-3 py-2 text-xs font-black text-white">Rolün: {activeClanRole} • {canAddClanMember ? "Oyuncu ekleyebilirsin" : "Yönetim yetkin yok"}</div>
                <input value={playerToAdd} onChange={(event) => setPlayerToAdd(event.target.value)} placeholder="Kayıtlı oyuncu adı" className="mb-2 w-full border-[3px] border-black bg-white px-3 py-2 text-sm font-bold text-black" />
                <button onClick={addClanPlayer} className="w-full border-[3px] border-black bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.35)]">KLANA EKLE</button>
                <button onClick={deleteActiveClan} className="mt-3 w-full border-[3px] border-black bg-red-600 px-4 py-2 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.35)]">KLANI SİL</button>
              </div>

              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {clans.map((clan) => (
                  <button key={clan.id} onClick={() => joinClan(clan.id)} className={`w-full border-[3px] border-black p-3 text-left shadow-[0_4px_0_rgba(0,0,0,0.35)] ${activeClanId === clan.id ? "bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-400 text-white" : "bg-[#1168d8] text-white"}`}>
                    <div className="flex items-center justify-between"><span className="text-lg font-black">{clan.name}</span><span className="rounded bg-black/30 px-2 py-1 text-xs font-black">{clan.tag}</span></div>
                    <div className="mt-1 text-xs font-bold text-white/80">{clan.members.length}/30 • {clan.requirement}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-[4px] border-black bg-[#071b4c] p-3 shadow-[0_7px_0_rgba(0,0,0,0.4)]">
                <div className="mb-2 text-xl font-black text-white">ÜYELER: {activeClan?.members.length ?? 0}/30</div>
                <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                  {(activeClan?.members ?? []).slice(0, 30).map((member, index) => {
                    const role = getClanRole(activeClan, member, index);
                    const isSelf = member === activeProfile.name;
                    const memberRank = getClanMemberRank(member, index);
                    return (
                      <div key={`${member}-${index}`} className={`flex flex-wrap items-center justify-between gap-2 border-[3px] border-black px-3 py-2 text-white ${index % 2 === 0 ? "bg-[#7c7280]" : "bg-[#f27122]"}`}>
                        <div><div className="text-lg font-black">{member}</div><div className="text-xs font-black text-white/85">{role}</div></div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 rounded border-2 border-black bg-black/28 px-2 py-1 text-right">
                            <RankLogo rank={memberRank.name} size={20} />
                            <div><div className="text-[10px] font-black uppercase text-white/70">Rank</div><div className="text-sm font-black">{memberRank.name}</div></div>
                          </div>
                          {isActiveClanFounder && !isSelf && (
                            <div className="flex flex-col gap-1">
                              {role === "Yardımcı" ? (
                                <button onClick={() => demoteClanMember(member)} className="border-2 border-black bg-yellow-500 px-2 py-1 text-[10px] font-black text-black">ÜYE YAP</button>
                              ) : (
                                <button onClick={() => promoteClanMember(member)} className="border-2 border-black bg-cyan-300 px-2 py-1 text-[10px] font-black text-black">YARDIMCI</button>
                              )}
                              <button onClick={() => kickClanMember(member)} className="border-2 border-black bg-red-600 px-2 py-1 text-[10px] font-black text-white">AT</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-[4px] border-black bg-[#082057] p-3 shadow-[0_7px_0_rgba(0,0,0,0.4)]">
                <div className="mb-2 text-xl font-black text-white">Klan Sohbeti</div>
                {renderMessages(visibleClanMessages, clanChatEndRef, "clan")}
                <div className="mt-3 flex gap-2">
                  <input value={clanInput} onChange={(event) => setClanInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendClan()} placeholder="Klana mesaj yaz..." className="flex-1 border-[3px] border-black bg-white px-3 py-3 text-sm font-bold text-black" />
                  <button onClick={sendClan} className="border-[3px] border-black bg-[#25a5ff] px-5 py-3 text-sm font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.45)]">YAZ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {socialTab === "market" && (
        <div className="relative overflow-hidden rounded-[32px] border border-white/14 bg-[radial-gradient(circle_at_top_left,rgba(255,229,109,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.15),transparent_32%),linear-gradient(135deg,rgba(8,39,97,0.80),rgba(12,128,255,0.68)_48%,rgba(64,21,104,0.76)_76%,rgba(255,159,28,0.72))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0_16px,transparent_17px)] [background-size:120px_120px]" />
          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><div className="text-5xl font-black uppercase text-white drop-shadow-[4px_5px_0_rgba(0,0,0,0.75)]">PAZAR</div><div className="text-sm font-bold text-sky-100">Oyuncu ilanları en üstte kalır. AI pazarı otomatik yenilenir. Aktif oyuncu ilanı: {playerListings.length}</div></div>
            <div className="flex flex-wrap items-center gap-3"><button onClick={() => setMarketRefreshTick((prev) => prev + 1)} className="border-[4px] border-black bg-cyan-300 px-5 py-3 text-sm font-black text-black shadow-[0_6px_0_rgba(0,0,0,0.4)]">PAZARI YENİLE</button><div className="border-[4px] border-black bg-[#23395f] px-5 py-3 text-white shadow-[0_6px_0_rgba(0,0,0,0.4)]"><div className="text-xs font-black">KREDİ</div><div className="text-2xl font-black">{activeProfile.credits}</div></div></div>
          </div>

          <div className="relative grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="border-[4px] border-black bg-[#0f65d6] p-4 text-white shadow-[0_7px_0_rgba(0,0,0,0.4)]">
              <div className="text-2xl font-black">İlan Aç</div>
              <div className="mt-3 space-y-3">
                <select value={draftType} onChange={(event) => setDraftType(event.target.value as PlayerMarketDraftType)} className="w-full border-[3px] border-black bg-white px-3 py-3 text-sm font-black text-black">
                  <option value="levelPoints">Seviye Point</option>
                  <option value="acemi">Acemi Anahtarı</option>
                  <option value="akademi">Akademi Anahtarı</option>
                  <option value="turnuva">Turnuva Anahtarı</option>
                </select>
                <input type="number" value={draftAmount} onChange={(event) => setDraftAmount(Number(event.target.value))} className="w-full border-[3px] border-black bg-white px-3 py-3 text-sm font-black text-black" placeholder="Miktar" />
                <input type="number" value={draftPrice} onChange={(event) => setDraftPrice(Number(event.target.value))} className="w-full border-[3px] border-black bg-white px-3 py-3 text-sm font-black text-black" placeholder="Fiyat" />
                <div className="border-[3px] border-black bg-[#23395f] p-3 text-sm font-bold">Elindeki: {ownedDraftAmount} • Mantıklı fiyat: {fairDraft.min}-{fairDraft.max} kredi</div>
                <button onClick={listPlayerItem} className="w-full border-[3px] border-black bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-[0_5px_0_rgba(0,0,0,0.45)]">İLANI PAZARA KOY</button>
              </div>
              {marketStatus && <div className="mt-3 border-[3px] border-black bg-white px-3 py-2 text-sm font-black text-black">{marketStatus}</div>}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <div key={listing.id} className={`relative overflow-hidden border-[4px] border-black p-4 text-white shadow-[0_7px_0_rgba(0,0,0,0.45)] ${listing.quality === "hot" ? "bg-gradient-to-b from-orange-400 to-orange-700" : listing.quality === "rare" ? "bg-gradient-to-b from-fuchsia-400 to-purple-800" : listing.quality === "good" ? "bg-gradient-to-b from-emerald-400 to-emerald-800" : "bg-gradient-to-b from-sky-400 to-blue-800"}`}>
                  <MarketListingVisual listing={listing} />
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div className="text-xl font-black drop-shadow-[2px_3px_0_rgba(0,0,0,0.7)]">{listing.title}</div>
                    {listing.seller === activeProfile.name && <span className="border-[2px] border-black bg-rose-100 px-2 py-1 text-[10px] font-black text-rose-700">BENİM İLANIM</span>}
                  </div>
                  <div className="mt-1 min-h-[38px] text-xs font-bold text-white/85">{listing.description}</div>
                  <div className="mt-3 text-xs font-black uppercase text-white/70">Satıcı: {listing.seller}</div>
                  <button onClick={() => buyListing(listing)} className="mt-4 w-full border-[3px] border-black bg-[#1fdd63] px-4 py-3 text-sm font-black text-white shadow-[0_5px_0_rgba(0,0,0,0.45)]">
                    {listing.price} KREDİ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {socialTab === "trades" && (
        <div className="relative overflow-hidden rounded-[32px] border border-[#7b1d35]/45 bg-[radial-gradient(circle_at_top_left,rgba(255,236,194,0.82),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(128,26,45,0.24),transparent_34%),linear-gradient(135deg,rgba(255,243,213,0.82),rgba(247,223,182,0.76)_42%,rgba(123,29,53,0.70)_100%)] p-5 text-[#351018] shadow-[0_24px_70px_rgba(75,17,28,0.32)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(45deg,rgba(75,17,28,0.20)_25%,transparent_25%),linear-gradient(-45deg,rgba(75,17,28,0.14)_25%,transparent_25%)] [background-size:34px_34px]" />
          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-5xl font-black uppercase text-[#4b111c] drop-shadow-[3px_3px_0_rgba(255,255,255,0.75)]">TAKASLAR</div>
              <div className="text-sm font-black text-[#7b1d35]">Krem zemin, bordo merkez. Karakter, kredi, point ve çark anahtarı aktarımı burada.</div>
            </div>
            <div className="border-[4px] border-[#4b111c] bg-[#fff8e7] px-5 py-3 text-[#4b111c] shadow-[0_6px_0_rgba(75,17,28,0.28)]">
              <div className="text-xs font-black uppercase">Aktif Profil</div>
              <div className="text-2xl font-black">{activeProfile.name}</div>
            </div>
          </div>
          <div className="relative [&_.mb-6]:mb-0 [&_.border-white\/10]:border-[#7b1d35]/35 [&_.border-white\/12]:border-[#7b1d35]/35 [&_.border-white\/15]:border-[#7b1d35]/35 [&_.border-white\/20]:border-[#7b1d35]/45 [&_.bg-black\/25]:bg-[#4b111c]/10 [&_.bg-black\/30]:bg-[#4b111c]/12 [&_.bg-black\/35]:bg-[#4b111c]/10 [&_.bg-white\/8]:bg-[#7b1d35]/10 [&_.text-white]:text-[#3a1018] [&_.text-white\/45]:text-[#7b1d35]/70 [&_.text-white\/55]:text-[#7b1d35]/75 [&_.text-white\/62]:text-[#7b1d35]/85">
            <TradeSection
              profiles={profiles}
              setProfiles={setProfiles}
              fakeAccounts={fakeAccounts}
              setFakeAccounts={setFakeAccounts}
              tradeOnlyAccounts={tradeOnlyAccounts}
              setTradeOnlyAccounts={setTradeOnlyAccounts}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PageContent() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("cark");
  const [selectedWheel, setSelectedWheel] = useState<WheelType>(DEFAULT_WHEEL);
  const [selectedModeId, setSelectedModeId] = useState<string>("turnuva");
  const [selectedInventoryProfileId, setSelectedInventoryProfileId] = useState<InventoryProfile["id"]>("founder");
  const [inventoryProfiles, setInventoryProfiles] = useState<InventoryProfile[]>(() => normalizeInventoryProfileCodes(DEFAULT_INVENTORY_PROFILES));
  const [inventoryStorageReady, setInventoryStorageReady] = useState(false);
  const [fakeAccounts, setFakeAccounts] = useState<TradeAccount[]>(() => createFakeAccounts());
  const [tradeOnlyAccounts, setTradeOnlyAccounts] = useState<TradeAccount[]>(() => createTradeOnlyAccounts());
  const [inventoryCodeInput, setInventoryCodeInput] = useState("");
  const [shopCodeInput, setShopCodeInput] = useState("");
  const [history, setHistory] = useState<ResultItem[]>([]);
  const [finalResult, setFinalResult] = useState<ResultItem | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<RarityName | null>(null);
  const [kristalizeSide, setKristalizeSide] = useState<Side | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [adminToolsEnabled, setAdminToolsEnabled] = useState(false);
  const [adminPasswordOpen, setAdminPasswordOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [noHighTierCount, setNoHighTierCount] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [characterPreviewLevel, setCharacterPreviewLevel] = useState(1);
  const [activeRarityFilters, setActiveRarityFilters] = useState<RarityName[]>([]);
  const [activeRoleFilters, setActiveRoleFilters] = useState<RoleType[]>([]);
  const [characterCardView] = useState<"smooth" | "keskin">("keskin");
  const [phase, setPhase] = useState<"idle" | "rarity" | "kristalizeChoice" | "character" | "reveal">("idle");

  const [raritySpinKey, setRaritySpinKey] = useState(0);
  const [charSpinKey, setCharSpinKey] = useState(0);

  const [rarityReel, setRarityReel] = useState(makePlaceholderTrack());
  const [charReel, setCharReel] = useState(makePlaceholderTrack());

  const audio = useEpicAudio(soundOn);
  const uiSfx = useUiSfx(soundOn);
  const selectedWheelTheme = getWheelTheme(selectedWheel);
  const activeInventoryProfile =
    inventoryProfiles.find((profile) => profile.id === selectedInventoryProfileId) ??
    inventoryProfiles[0];
  const founderSelected = selectedInventoryProfileId === "founder";

  const handleToggleAdminTools = () => {
    if (adminToolsEnabled) {
      setAdminToolsEnabled(false);
      setAdminPasswordOpen(false);
      setAdminPasswordInput("");
      setAdminPasswordError("");
      return;
    }

    if (!founderSelected) {
      uiSfx.fail();
      setAdminPasswordError("Admin Tools sadece kurucu hesabında açılabilir.");
      setAdminPasswordOpen(true);
      return;
    }

    setAdminPasswordInput("");
    setAdminPasswordError("");
    setAdminPasswordOpen(true);
    uiSfx.hoverSoft();
  };

  const submitAdminPassword = () => {
    if (adminPasswordInput.trim() === ADMIN_TOOLS_PASSWORD) {
      setAdminToolsEnabled(true);
      setAdminPasswordOpen(false);
      setAdminPasswordInput("");
      setAdminPasswordError("");
      uiSfx.shopBuy();
      return;
    }

    setAdminToolsEnabled(false);
    setAdminPasswordError("Hatalı kod. Admin yetenekleri kilitli kaldı.");
    uiSfx.fail();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ADMIN_TOOLS_KEY);
    setAdminToolsEnabled(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ADMIN_TOOLS_KEY, adminToolsEnabled ? "1" : "0");
  }, [adminToolsEnabled]);

  useEffect(() => {
    if (!adminToolsEnabled && (activeTab === "gurkanhub" || activeTab === "admin")) {
      setActiveTab("cark");
    }
  }, [adminToolsEnabled, activeTab]);


  const addToInventory = (profileId: InventoryProfile["id"], characterName: string) => {
    setInventoryProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId && !profile.items.includes(characterName)
          ? sanitizeProfileCosmetics({ ...profile, items: [...profile.items, characterName] })
          : profile
      )
    );
  };

  const removeFromInventory = (profileId: InventoryProfile["id"], characterName: string) => {
    setInventoryProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId
          ? sanitizeProfileCosmetics({ ...profile, items: profile.items.filter((item) => item !== characterName) })
          : profile
      )
    );
  };

  const clearInventory = (profileId: InventoryProfile["id"]) => {
    setInventoryProfiles((prev) =>
      prev.map((profile) => (profile.id === profileId ? sanitizeProfileCosmetics({ ...profile, items: [] }) : profile))
    );
  };

  const renameProfile = (profileId: InventoryProfile["id"], name: string) => {
    if (profileId === "founder") return;
    setInventoryProfiles((prev) =>
      prev.map((profile) =>
        profile.id === profileId ? { ...profile, name: name.slice(0, 18) || "Oyuncu" } : profile
      )
    );
  };

  const changeInventoryPalette = (profileId: InventoryProfile["id"], palette: string) => {
    setInventoryProfiles((prev) =>
      prev.map((profile) => (profile.id === profileId ? { ...profile, palette } : profile))
    );
  };


  const updateProfileEconomy = (
    id: InventoryProfile["id"],
    updater: (profile: InventoryProfile) => InventoryProfile
  ) => {
    setInventoryProfiles((prev) => prev.map((profile) => (profile.id === id ? updater(profile) : profile)));
  };

  const addCreditsToProfile = (id: InventoryProfile["id"], amount: number, matches = 0) => {
    updateProfileEconomy(id, (profile) => ({
      ...profile,
      credits: profile.credits + amount,
      matchesPlayed: profile.matchesPlayed + matches,
    }));
  };

  const addLevelPointsToProfile = (id: InventoryProfile["id"], amount: number) => {
    updateProfileEconomy(id, (profile) => ({ ...profile, levelPoints: Math.max(0, (profile.levelPoints ?? 0) + amount) }));
  };

  const addWheelKeysToProfile = (id: InventoryProfile["id"], wheel: WheelType, amount: number) => {
    updateProfileEconomy(id, (profile) => {
      const keys = normalizeWheelKeys(profile.wheelKeys);
      return { ...profile, wheelKeys: { ...keys, [wheel]: Math.max(0, keys[wheel] + Math.floor(amount)) } };
    });
  };

  const consumeWheelKeyFromProfile = (id: InventoryProfile["id"], wheel: WheelType) => {
    const target = inventoryProfiles.find((profile) => profile.id === id);
    const keys = normalizeWheelKeys(target?.wheelKeys);
    if (!target || keys[wheel] <= 0) return false;

    setInventoryProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== id) return profile;
        const currentKeys = normalizeWheelKeys(profile.wheelKeys);
        if (currentKeys[wheel] <= 0) return profile;
        return { ...profile, wheelKeys: { ...currentKeys, [wheel]: currentKeys[wheel] - 1 } };
      })
    );

    return true;
  };

  const upgradeProfileCharacter = (id: InventoryProfile["id"], characterName: string) => {
    updateProfileEconomy(id, (profile) => {
      if (!profile.items.includes(characterName)) return profile;
      const currentLevel = getProfileCharacterLevel(profile, characterName);
      if (currentLevel >= MAX_CHARACTER_LEVEL) return profile;
      const cost = getUpgradePointCost(currentLevel + 1);
      if ((profile.levelPoints ?? 0) < cost) return profile;
      return {
        ...profile,
        levelPoints: Math.max(0, (profile.levelPoints ?? 0) - cost),
        characterLevels: { ...(profile.characterLevels ?? {}), [characterName]: currentLevel + 1 },
      };
    });
  };

  const adjustRankForProfile = (id: InventoryProfile["id"], delta: number) => {
    updateProfileEconomy(id, (profile) => ({
      ...profile,
      rankPoints: Math.max(0, (profile.rankPoints ?? 0) + delta),
    }));
  };

  const toggleProfileBan = (id: InventoryProfile["id"]) => {
    if (id === "founder") return;
    setInventoryProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id ? { ...profile, banned: !profile.banned } : profile
      )
    );
  };

  const toggleFakeAccountBan = (id: string) => {
    setFakeAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, banned: !account.banned } : account
      )
    );
  };

  const consumeCreditsFromProfile = (id: InventoryProfile["id"], amount: number) => {
    updateProfileEconomy(id, (profile) => ({
      ...profile,
      credits: Math.max(0, profile.credits - amount),
    }));
  };

  const openInventoryByCode = () => {
    const normalized = inventoryCodeInput.trim();
    if (!normalized) return;

    const directFound = inventoryProfiles.find((profile) => profile.code === normalized);
    if (directFound) {
      setSelectedInventoryProfileId(directFound.id);
      return;
    }

    if (typeof window === "undefined") return;

    try {
      const registryRaw = window.localStorage.getItem(INVENTORY_REGISTRY_KEY);
      const registry = registryRaw ? (JSON.parse(registryRaw) as Record<string, string>) : {};

      if (registry[normalized]) {
        const imported = importProfilePayload(
          selectedInventoryProfileId,
          registry[normalized],
          normalized
        );
        if (imported) {
          setInventoryProfiles((prev) =>
            prev.map((profile) => (profile.id === selectedInventoryProfileId ? sanitizeProfileCosmetics(imported) : profile))
          );
          return;
        }
      }

      const importedFromRaw = importProfilePayload(
        selectedInventoryProfileId,
        normalized,
        activeInventoryProfile.code
      );
      if (importedFromRaw) {
        setInventoryProfiles((prev) =>
          prev.map((profile) => (profile.id === selectedInventoryProfileId ? importedFromRaw : profile))
        );
      }
    } catch {}
  };


  const openShopByCode = () => {
    const normalized = shopCodeInput.trim();
    if (!normalized) return;

    const directFound = inventoryProfiles.find((profile) => profile.code === normalized);
    if (directFound) {
      setSelectedInventoryProfileId(directFound.id);
      return;
    }

    if (typeof window === "undefined") return;

    try {
      const registryRaw = window.localStorage.getItem(INVENTORY_REGISTRY_KEY);
      const registry = registryRaw ? (JSON.parse(registryRaw) as Record<string, string>) : {};

      const payload = registry[normalized] ?? normalized;
      const imported = importProfilePayload(selectedInventoryProfileId, payload, normalized);
      if (imported) {
        setInventoryProfiles((prev) =>
          prev.map((profile) => (profile.id === selectedInventoryProfileId ? sanitizeProfileCosmetics(imported) : profile))
        );
      }
    } catch {}
  };

  const copyInventoryCode = async () => {
    try {
      await navigator.clipboard.writeText(exportProfilePayload(activeInventoryProfile));
    } catch {}
  };


  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    try {
      const savedProfiles = window.localStorage.getItem(INVENTORY_PROFILES_KEY);
      const savedSelected = window.localStorage.getItem(INVENTORY_SELECTED_KEY);

      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles) as InventoryProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInventoryProfiles(
            normalizeInventoryProfileCodes(parsed.map((profile, index) => ({
              ...profile,
              palette: profile.palette || INVENTORY_PALETTES[index % INVENTORY_PALETTES.length],
              credits: typeof profile.credits === "number" ? profile.credits : 0,
              matchesPlayed: typeof profile.matchesPlayed === "number" ? profile.matchesPlayed : 0,
              rankPoints: typeof profile.rankPoints === "number" ? profile.rankPoints : 0,
              levelPoints: typeof (profile as InventoryProfile).levelPoints === "number" ? Math.max(0, (profile as InventoryProfile).levelPoints) : 0,
              characterLevels: (profile as InventoryProfile).characterLevels && typeof (profile as InventoryProfile).characterLevels === "object" ? (profile as InventoryProfile).characterLevels : {},
              wheelKeys: normalizeWheelKeys((profile as InventoryProfile).wheelKeys),
              banned: Boolean((profile as InventoryProfile).banned),
              profileCharacter: typeof (profile as InventoryProfile).profileCharacter === "string" ? (profile as InventoryProfile).profileCharacter : profile.items?.[0],
              surfaceStyle:
                (profile as InventoryProfile).surfaceStyle === "karanlik" || (profile as InventoryProfile).surfaceStyle === "aydinlik" || (profile as InventoryProfile).surfaceStyle === "gecisli"
                  ? (profile as InventoryProfile).surfaceStyle
                  : "gecisli",
              glowLevel:
                (profile as InventoryProfile).glowLevel === "dusuk" || (profile as InventoryProfile).glowLevel === "orta" || (profile as InventoryProfile).glowLevel === "yuksek"
                  ? (profile as InventoryProfile).glowLevel
                  : "orta",
              profilePattern:
                (profile as InventoryProfile).profilePattern === "duz" ||
                (profile as InventoryProfile).profilePattern === "ender" ||
                (profile as InventoryProfile).profilePattern === "destansi" ||
                (profile as InventoryProfile).profilePattern === "efsanevi" ||
                (profile as InventoryProfile).profilePattern === "kristalize" ||
                (profile as InventoryProfile).profilePattern === "omega"
                  ? (profile as InventoryProfile).profilePattern
                  : "duz",
              frameStyle:
                (profile as InventoryProfile).frameStyle === "duz" ||
                (profile as InventoryProfile).frameStyle === "keskin" ||
                (profile as InventoryProfile).frameStyle === "neon"
                  ? (profile as InventoryProfile).frameStyle
                  : "duz",
              slogan:
                typeof (profile as InventoryProfile).slogan === "string"
                  ? ((profile as InventoryProfile).slogan ?? "").slice(0, 36)
                  : "",
              favoriteMode:
                typeof (profile as InventoryProfile).favoriteMode === "string"
                  ? (profile as InventoryProfile).favoriteMode
                  : "turnuva",
              favoriteCharacter:
                typeof (profile as InventoryProfile).favoriteCharacter === "string"
                  ? (profile as InventoryProfile).favoriteCharacter
                  : profile.items?.[0] ?? "",
            }))).map(sanitizeProfileCosmetics)
          );
        }
      }

      if (
        savedSelected === "player1" ||
        savedSelected === "player2" ||
        savedSelected === "founder"
      ) {
        setSelectedInventoryProfileId(savedSelected);
      }
    } catch {}
    setInventoryStorageReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !inventoryStorageReady) return;
    try {
      window.localStorage.setItem(INVENTORY_PROFILES_KEY, JSON.stringify(inventoryProfiles));
      window.localStorage.setItem(INVENTORY_SELECTED_KEY, selectedInventoryProfileId);

      const registry = Object.fromEntries(
        inventoryProfiles.map((profile) => [profile.code, exportProfilePayload(profile)])
      );
      window.localStorage.setItem(INVENTORY_REGISTRY_KEY, JSON.stringify(registry));
    } catch {}
  }, [inventoryProfiles, selectedInventoryProfileId, inventoryStorageReady]);

  useEffect(() => {
    return () => {
      audio.stopAll();
    };
  }, [audio]);

  const stats = useMemo(() => {
    return BASE_RARITIES.map((rarity) => ({
      name: rarity.name,
      count: history.filter((h) => h.rarity === rarity.name).length,
    }));
  }, [history]);

  const filteredCharacters = useMemo(() => {
    const q = characterSearch.trim().toLocaleLowerCase("tr-TR");

    return [...CHARACTER_DATABASE]
      .filter((char) => {
        const matchesSearch = q.length === 0 || char.name.toLocaleLowerCase("tr-TR").includes(q);
        const matchesRarity =
          activeRarityFilters.length === 0 || activeRarityFilters.includes(char.rarity);
        const matchesRole =
          activeRoleFilters.length === 0 || activeRoleFilters.includes(char.role);
        return matchesSearch && matchesRarity && matchesRole;
      })
      .sort((a, b) => {
        const rarityDiff = rarityRank[a.rarity] - rarityRank[b.rarity];
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name, "tr");
      });
  }, [characterSearch, activeRarityFilters, activeRoleFilters]);

  const toggleRarityFilter = (rarity: RarityName) => {
    setActiveRarityFilters((prev) =>
      prev.includes(rarity) ? prev.filter((item) => item !== rarity) : [...prev, rarity]
    );
  };

  const toggleRoleFilter = (role: RoleType) => {
    setActiveRoleFilters((prev) =>
      prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role]
    );
  };


  const startCharacterRoll = (rarity: RarityName, side?: Side | null) => {
    setPhase("character");

    const picked = pickCharacter(rarity, history, side, activeInventoryProfile.items);
    const foundPicked = getCharacterByName(picked.character);
    const actualRarity = foundPicked?.rarity ?? rarity;
    const built = buildCharacterTrack(actualRarity, picked.character, picked.side);

    setCharReel(built);
    setCharSpinKey((k) => k + 1);

    const tickInt = window.setInterval(() => {
      audio.spinTick();
    }, 130);

    window.setTimeout(() => {
      clearInterval(tickInt);
      audio.stopAll();

      const result: ResultItem = {
        rarity: actualRarity,
        side: picked.side,
        character: picked.character,
      };

      setFinalResult(result);
      setPhase("reveal");
      setIsRevealed(true);
      audio.finalReveal(actualRarity);

      if (actualRarity === "Omega" || actualRarity === "Kristalize" || actualRarity === "Efsanevi") {
        setNoHighTierCount(0);
      } else {
        setNoHighTierCount((prev) => prev + 1);
      }

      setHistory((prev) => [result, ...prev].slice(0, 12));
      setIsOpening(false);
    }, 4300);
  };

  const startOpening = () => {
    if (isOpening || !mounted) return;
    if (getWheelKeyCount(activeInventoryProfile, selectedWheel) <= 0) {
      setFinalResult(null);
      setSelectedRarity(null);
      setPhase("idle");
      audio.stopAll();
      return;
    }
    if (!hasAnyUnownedCharacter(activeInventoryProfile.items)) {
      setFinalResult(null);
      setSelectedRarity(null);
      setPhase("idle");
      audio.stopAll();
      return;
    }

    const keyConsumed = consumeWheelKeyFromProfile(activeInventoryProfile.id, selectedWheel);
    if (!keyConsumed) {
      setFinalResult(null);
      setSelectedRarity(null);
      setPhase("idle");
      audio.stopAll();
      return;
    }

    audio.stopAll();
    setIsOpening(true);
    setIsRevealed(false);
    setFinalResult(null);
    setSelectedRarity(null);
    setKristalizeSide(null);
    setCharReel(makePlaceholderTrack());
    setPhase("rarity");

    const initialRarity = pickRarity(history, noHighTierCount, selectedWheel);
    const availableRarities = getAdjustedRarities(history, noHighTierCount, selectedWheel) as { name: RarityName; weight: number }[];
    const pickedRarity = pickAvailableRarityForOwned(initialRarity, activeInventoryProfile.items, availableRarities) ?? initialRarity;
    const built = buildRarityTrack(pickedRarity);

    setRarityReel(built);
    setRaritySpinKey((k) => k + 1);

    const tickInt = window.setInterval(() => {
      audio.spinTick();
    }, 120);

    window.setTimeout(() => {
      clearInterval(tickInt);
      audio.stopAll();

      setSelectedRarity(pickedRarity);
      audio.rarityHit(pickedRarity);

      if (pickedRarity === "Kristalize") {
        window.setTimeout(() => {
          setPhase("kristalizeChoice");
        }, 1000);
        return;
      }

      setKristalizeSide(null);

      window.setTimeout(() => {
        startCharacterRoll(pickedRarity, null);
      }, 1200);
    }, 4300);
  };

  const handleKristalizeChoice = (side: Side) => {
    setKristalizeSide(side);
    audio.stopAll();
    audio.crystalSideReveal(side);

    window.setTimeout(() => {
      startCharacterRoll("Kristalize", side);
    }, 780);
  };

  const overlayClass = selectedRarity
    ? rarityOverlay[selectedRarity]
    : "from-transparent via-transparent to-black";

  return (
    <div className="min-h-screen overflow-hidden bg-[#06070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.10),transparent_25%)]" />

      <AnimatePresence>
        {selectedRarity && activeTab === "cark" && (
          <motion.div
            key={selectedRarity}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${overlayClass}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRarity && activeTab === "cark" && (
          <motion.div
            key={`${selectedRarity}-halo`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity:
                selectedRarity === "Omega"
                  ? [0.18, 0.42, 0.18]
                  : selectedRarity === "Kristalize"
                  ? [0.12, 0.32, 0.12]
                  : selectedRarity === "Efsanevi"
                  ? [0.08, 0.22, 0.08]
                  : [0.04, 0.1, 0.04],
              scale: [1, 1.06, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration:
                selectedRarity === "Omega" ? 2.2 : selectedRarity === "Kristalize" ? 2.6 : 3.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`pointer-events-none absolute inset-0 ${
              selectedRarity === "Omega"
                ? "bg-[radial-gradient(circle_at_center,rgba(255,170,255,0.20),transparent_34%),radial-gradient(circle_at_35%_35%,rgba(255,190,120,0.16),transparent_30%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_50%_75%,rgba(190,190,255,0.14),transparent_34%)]"
                : selectedRarity === "Kristalize"
                ? "bg-[radial-gradient(circle_at_center,rgba(255,120,230,0.18),transparent_52%),radial-gradient(circle_at_35%_25%,rgba(110,220,255,0.16),transparent_24%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.10),transparent_22%)]"
                : selectedRarity === "Efsanevi"
                ? "bg-[radial-gradient(circle_at_center,rgba(255,210,120,0.14),transparent_58%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]"
            }`}
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
<h1 className="text-3xl font-black tracking-tight md:text-5xl">
                LEGOVERSEGAMES
              </h1>
            </div>

            <div className="flex gap-3">
              <button
                className={`flex items-center rounded-2xl border px-4 py-2 transition ${
                  founderSelected
                    ? adminToolsEnabled
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/14"
                      : "border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300/14"
                    : "border-white/10 bg-white/5 text-white/45"
                }`}
                onClick={handleToggleAdminTools}
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                {adminToolsEnabled ? "Admin Tools Açık" : "Admin Tools"}
              </button>

              <button
                className="flex items-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
                onClick={() => setSoundOn((s) => !s)}
              >
                {soundOn ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                {soundOn ? "Ses Açık" : "Ses Kapalı"}
              </button>
            </div>
          </div>

          <div className="inline-flex flex-wrap gap-2 border border-white/20 bg-black/45 p-2 shadow-2xl backdrop-blur-md">
            <TabButton
              active={activeTab === "cark"}
              onClick={() => { setActiveTab("cark"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Sparkles className="h-3.5 w-3.5" />}
              label="Çarklar"
            />
            <TabButton
              active={activeTab === "karakterler"}
              onClick={() => { setActiveTab("karakterler"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<LayoutGrid className="h-3.5 w-3.5" />}
              label="Karakterler"
            />
            <TabButton
              active={activeTab === "oyunModlari"}
              onClick={() => { setActiveTab("oyunModlari"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Swords className="h-3.5 w-3.5" />}
              label="Oyun Modları"
            />
            <TabButton
              active={activeTab === "bilgi"}
              onClick={() => { setActiveTab("bilgi"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Bilgi"
            />
            <TabButton
              active={activeTab === "gorevler"}
              onClick={() => { setActiveTab("gorevler"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<ScrollText className="h-3.5 w-3.5" />}
              label="Görevler"
            />
            <TabButton
              active={activeTab === "envanter"}
              onClick={() => { setActiveTab("envanter"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Package2 className="h-3.5 w-3.5" />}
              label="Envanter"
            />
            <TabButton
              active={activeTab === "sosyal"}
              onClick={() => { setActiveTab("sosyal"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Users className="h-3.5 w-3.5" />}
              label="Sosyal"
            />
            <TabButton
              active={activeTab === "ranklar"}
              onClick={() => { setActiveTab("ranklar"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Trophy className="h-3.5 w-3.5" />}
              label="Ranklar"
            />
            <TabButton
              active={activeTab === "dukkan"}
              onClick={() => { setActiveTab("dukkan"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<ShoppingBag className="h-3.5 w-3.5" />}
              label="Dükkan"
            />
            <TabButton
              active={activeTab === "yenilikler"}
              onClick={() => { setActiveTab("yenilikler"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Megaphone className="h-3.5 w-3.5" />}
              label="Yenilikler
"
            />
            <TabButton
              active={activeTab === "haberler"}
              onClick={() => { setActiveTab("haberler"); uiSfx.tab(); }}
              onHover={uiSfx.hoverSoft}
              icon={<Newspaper className="h-3.5 w-3.5" />}
              label="Haberler"
            />
            {adminToolsEnabled && (
              <>
                <TabButton
                  active={activeTab === "gurkanhub"}
                  onClick={() => { setActiveTab("gurkanhub"); uiSfx.tab(); }}
                  onHover={uiSfx.hoverSoft}
                  icon={<ShieldAlert className="h-3.5 w-3.5" />}
                  label="GürkanHUB"
                />
                <TabButton
                  active={activeTab === "admin"}
                  onClick={() => { setActiveTab("admin"); uiSfx.tab(); }}
                  onHover={uiSfx.hoverSoft}
                  icon={<ShieldAlert className="h-3.5 w-3.5" />}
                  label="Admin"
                />
              </>
            )}
          </div>
        </div>

        <TabScene sceneKey={activeTab}>
        {activeTab === "cark" && (
          <div>
            <WheelSelector selected={selectedWheel} onSelect={setSelectedWheel} />
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <SmallCard className={`relative overflow-hidden ${selectedWheelTheme.frame}`}>
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${selectedWheelTheme.accent}`} />
              <div className={`pointer-events-none absolute inset-0 ${selectedWheelTheme.halo}`} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
              <div className="relative p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className={`mb-2 inline-flex items-center gap-2 border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${selectedWheelTheme.badge}`}>
                      Aktif Çark
                    </div>
                    <div className="text-xl font-semibold">{WHEEL_CONFIGS.find((wheel) => wheel.id === selectedWheel)?.name} Açılım Alanı</div>
                    <div className="mt-3 flex items-center gap-3 border border-white/15 bg-black/35 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                      <WheelKeyArt wheel={selectedWheel} count={getWheelKeyCount(activeInventoryProfile, selectedWheel)} size="small" />
                      <div>
                        <div>{WHEEL_KEY_LABELS[selectedWheel]}</div>
                        <div className="mt-1 text-[10px] text-white/42">Anahtar harcanınca çark animasyonu başlar.</div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="flex items-center rounded-2xl bg-white px-4 py-2 text-black hover:bg-white/90 disabled:opacity-60"
                    onClick={startOpening}
                    disabled={isOpening || !mounted || getWheelKeyCount(activeInventoryProfile, selectedWheel) <= 0}
                  >
                    <span className="mr-2">{isOpening ? "⟳" : "▣"}</span>
                    {isOpening ? "Belirleniyor..." : getWheelKeyCount(activeInventoryProfile, selectedWheel) <= 0 ? "Anahtar Yok" : "Anahtarla Aç"}
                  </button>
                </div>

                <SlotReel
                  spinKey={raritySpinKey}
                  cards={rarityReel.cards}
                  stopIndex={rarityReel.stopIndex}
                  duration={4.3}
                  title="Enderlik Çarkı"
                  status={phase === "rarity" ? "Dönüyor" : selectedRarity ? "Tamamlandı" : "Bekleniyor"}
                  revealColors={phase !== "rarity" && Boolean(selectedRarity)}
                  mode="rarity"
                  wheel={selectedWheel}
                />

                <div className="mb-5 text-center">
                  {selectedRarity ? (
                    <motion.div
                      key={selectedRarity}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-lg font-semibold"
                    >
                      {WHEEL_CONFIGS.find((wheel) => wheel.id === selectedWheel)?.name} • Seçilen enderlik: {selectedRarity}
                    </motion.div>
                  ) : (
                    <div className="text-white/45">Henüz enderlik belirlenmedi.</div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {phase === "kristalizeChoice" && (
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    >
                      <SideSelection onSelect={handleKristalizeChoice} onPreview={(side) => audio.crystalChoiceHover(side)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {(phase === "character" || phase === "reveal") && selectedRarity && (
                    <motion.div
                      key={`char-wrap-${charSpinKey}-${kristalizeSide ?? "none"}`}
                      initial={{ opacity: 0, y: 22, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      className={`mb-5 border border-white/20 bg-gradient-to-b ${
                        selectedRarity === "Kristalize" && kristalizeSide === "İyi"
                          ? "from-cyan-400/18 via-sky-500/10 to-indigo-900/14"
                          : selectedRarity === "Kristalize" && kristalizeSide === "Kötü"
                          ? "from-rose-400/18 via-fuchsia-500/10 to-indigo-900/14"
                          : selectedRarity === "Omega"
                          ? "from-fuchsia-300/24 via-orange-300/16 via-slate-200/10 to-violet-900/18"
                          : selectedRarity === "Efsanevi"
                          ? "from-amber-300/20 via-orange-400/10 to-orange-900/14"
                          : rarityBg[selectedRarity]
                      } p-5 shadow-2xl`}
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                      }}
                    >
                      <div className="mb-2 text-2xl font-bold text-white">
                        {selectedRarity === "Kristalize"
                          ? `${kristalizeSide ?? ""} kristalize karakterini belirle`
                          : `${selectedRarity} karakterini belirle`}
                      </div>

                      <SlotReel
                        spinKey={charSpinKey}
                        cards={charReel.cards}
                        stopIndex={charReel.stopIndex}
                        duration={4.3}
                        title="Karakter Çarkı"
                        status={phase === "character" ? "Dönüyor" : "Tamamlandı"}
                        revealColors={phase === "reveal"}
                        mode="character"
                        wheel={selectedWheel}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {finalResult ? (
                    <div>
                      <LootCard
                        key={`${finalResult.character}-${finalResult.rarity}-${finalResult.side ?? "none"}`}
                        item={finalResult}
                        reveal={isRevealed}
                      />
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => addToInventory(activeInventoryProfile.id, finalResult.character)}
                          disabled={activeInventoryProfile.items.includes(finalResult.character)}
                          className="border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-70"
                          style={{
                            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          }}
                        >
                          {activeInventoryProfile.items.includes(finalResult.character)
                            ? "Envanterde Var"
                            : `${activeInventoryProfile.name} Envanterine Ekle`}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex min-h-[260px] items-center justify-center border bg-white/5 text-white/45 ${selectedWheelTheme.line}` }
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
                      }}
                    >
                      Karakterini belirlemek için bas.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SmallCard>

            <div className="space-y-6">
              <SmallCard className={selectedWheelTheme.frame}>
                <div className="p-6">
                  <div className="mb-4 text-xl font-semibold">Enderlik Sayacı</div>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((s) => (
                      <div key={s.name} className="rounded-2xl border border-white/20 bg-black/20 p-3">
                        <div className="text-xs text-white/50">{s.name}</div>
                        <div className="mt-1 text-xl font-bold text-white">{s.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </SmallCard>

              <SmallCard className={selectedWheelTheme.frame}>
                <div className="p-6">
                  <div className="mb-4 text-xl font-semibold">Son Açılanlar</div>
                  <div className="space-y-3">
                    {history.length === 0 && <div className="text-sm text-white/45">Henüz açılım yok.</div>}
                    {history.map((item, idx) => (
                      <div
                        key={`${item.character}-${idx}`}
                        className="border border-white/20 bg-black/20 p-3"
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10">
                              <RarityLogo rarity={item.rarity} side={item.side} size={20} />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{item.character}</div>
                              <div className="text-xs text-white/50">
                                {item.rarity} {item.side ? `• ${item.side}` : ""}
                              </div>
                            </div>
                          </div>
                          <div className="border border-white/15 bg-white/10 px-3 py-1 text-sm text-white">
                            #{history.length - idx}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SmallCard>
            </div>
          </div>
          </div>
        )}

        {activeTab === "karakterler" && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10">
                <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Karakterler</div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/55">Bilgi Ekranı</div>
              </div>
            </div>

            <CutPanel className="mb-6 p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    İsimle Ara
                  </div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <input
                      value={characterSearch}
                      onChange={(e) => setCharacterSearch(e.target.value)}
                      placeholder="Karakter adı yaz..."
                      className="w-full border border-white/20 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-black/55"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCharacterSearch("");
                    setActiveRarityFilters([]);
                    setActiveRoleFilters([]);
                  }}
                  className="border border-white/20 bg-black/40 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Filtreleri Temizle
                </button>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Enderlik Filtreleri
                </div>
                <div className="flex flex-wrap gap-3">
                  {RARITY_ORDER.map((rarity) => {
                    const active = activeRarityFilters.includes(rarity);

                    return (
                      <button
                        key={rarity}
                        onClick={() => toggleRarityFilter(rarity)}
                        title={rarity}
                        aria-label={`${rarity} filtresini ${active ? "kapat" : "aç"}`}
                        className={`group flex items-center gap-3 border px-3 py-2 transition ${
                          active
                            ? "border-white/30 bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                            : "border-white/10 bg-black/35 text-white/65 hover:border-white/20 hover:bg-white/8 hover:text-white"
                        }`}
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                        }}
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center border transition ${
                            active
                              ? "border-white/25 bg-white/12"
                              : "border-white/10 bg-black/40 group-hover:border-white/20 group-hover:bg-white/10"
                          }`}
                        >
                          <RarityLogo rarity={rarity} size={24} />
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                            Enderlik
                          </div>
                          <div className="text-sm font-semibold text-white">{rarity}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Rol Filtreleri
                </div>
                <div className="flex flex-wrap gap-3">
                  {ROLE_ORDER.map((role) => {
                    const active = activeRoleFilters.includes(role);

                    return (
                      <button
                        key={role}
                        onClick={() => toggleRoleFilter(role)}
                        title={role}
                        aria-label={`${role} filtresini ${active ? "kapat" : "aç"}`}
                        className={`group border px-3 py-2 text-sm transition ${
                          active
                            ? "border-white/30 bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                            : "border-white/10 bg-black/35 text-white/65 hover:border-white/20 hover:bg-white/8 hover:text-white"
                        }`}
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>


              <div className="mt-4 border border-white/10 bg-black/25 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Seviye Ayarla</div>
                    <div className="text-xs text-white/50">Kartlardaki HP ve hasarı bu seviyeye göre önizle.</div>
                  </div>
                  <div className="border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-sm font-black text-amber-100">Lv {characterPreviewLevel}/11</div>
                </div>
                <input type="range" min={1} max={MAX_CHARACTER_LEVEL} value={characterPreviewLevel}
                  onChange={(e) => setCharacterPreviewLevel(clampCharacterLevel(Number(e.target.value)))}
                  className="w-full accent-amber-300" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
                <span>
                  Toplam sonuç: <span className="font-semibold text-white">{filteredCharacters.length}</span>
                </span>
                {activeRarityFilters.length > 0 && (
                  <span>
                    Enderlik filtreleri: <span className="font-semibold text-white">{activeRarityFilters.join(", ")}</span>
                  </span>
                )}
                {activeRoleFilters.length > 0 && (
                  <span>
                    Rol filtreleri: <span className="font-semibold text-white">{activeRoleFilters.join(", ")}</span>
                  </span>
                )}
              </div>
            </CutPanel>

            {filteredCharacters.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCharacters.map((char) => (
                  <CharacterCard key={char.id} char={char} viewMode={characterCardView} displayLevel={characterPreviewLevel} />
                ))}
              </div>
            ) : (
              <CutPanel className="p-8 text-center">
                <div className="text-lg font-semibold text-white">Karakter bulunamadı</div>
                <div className="mt-2 text-sm text-white/55">
                  Arama metnini ya da enderlik filtrelerini değiştir.
                </div>
              </CutPanel>
            )}
          </div>
        )}

        {activeTab === "oyunModlari" && (
          <GameModesSection
            selectedModeId={selectedModeId}
            onSelectMode={setSelectedModeId}
            profiles={inventoryProfiles}
            fakeAccounts={fakeAccounts}
            founderView={selectedInventoryProfileId === "founder"}
            onToggleProfileBan={toggleProfileBan}
            onToggleFakeBan={toggleFakeAccountBan}
            onUpgradeCharacter={upgradeProfileCharacter}
            adminToolsEnabled={adminToolsEnabled}
            onToggleAdminTools={handleToggleAdminTools}
          />
        )}

        {activeTab === "bilgi" && (
          <InfoSection />
        )}

        {activeTab === "gorevler" && <QuestsSection activeProfile={activeInventoryProfile} onAddWheelKeys={addWheelKeysToProfile} />}

        {activeTab === "sosyal" && (
          <SocialClanMarketSection
            activeProfile={activeInventoryProfile}
            profiles={inventoryProfiles}
            setProfiles={setInventoryProfiles}
            fakeAccounts={fakeAccounts}
            setFakeAccounts={setFakeAccounts}
            tradeOnlyAccounts={tradeOnlyAccounts}
            setTradeOnlyAccounts={setTradeOnlyAccounts}
            onAddCredits={addCreditsToProfile}
            onAddLevelPoints={addLevelPointsToProfile}
            onAddWheelKeys={addWheelKeysToProfile}
            uiSfx={uiSfx}
          />
        )}

        {activeTab === "dukkan" && (
          <ShopSection
            profiles={inventoryProfiles}
            selectedProfileId={selectedInventoryProfileId}
            onSelectProfile={setSelectedInventoryProfileId}
            onImportByCode={openShopByCode}
            shopCodeInput={shopCodeInput}
            setShopCodeInput={setShopCodeInput}
            onAddCredits={addCreditsToProfile}
            onConsumeCredits={consumeCreditsFromProfile}
            onAddItem={addToInventory}
            onAdjustRank={adjustRankForProfile}
            onAddLevelPoints={addLevelPointsToProfile}
            onAddWheelKeys={addWheelKeysToProfile}
            uiSfx={uiSfx}
          />
        )}

        {activeTab === "yenilikler" && <UpdatesSection />}

        {activeTab === "haberler" && <NewsSection />}

        {adminToolsEnabled && activeTab === "gurkanhub" && <GurkanHubSection />}

        {adminToolsEnabled && activeTab === "admin" && (
          <AdminSection
            profiles={inventoryProfiles}
            fakeAccounts={fakeAccounts}
            onToggleProfileBan={toggleProfileBan}
            onToggleFakeBan={toggleFakeAccountBan}
            adminToolsEnabled={adminToolsEnabled}
            onToggleAdminTools={handleToggleAdminTools}
          />
        )}

        {activeTab === "ranklar" && (
          <RankSection
            profiles={inventoryProfiles}
            fakeAccounts={fakeAccounts}
            onAddCredits={addCreditsToProfile}
            onAdjustRank={adjustRankForProfile}
            onAddLevelPoints={addLevelPointsToProfile}
            uiSfx={uiSfx}
          />
        )}

        {activeTab === "envanter" && (
          <InventorySection
            profiles={inventoryProfiles}
            selectedProfileId={selectedInventoryProfileId}
            onSelectProfile={setSelectedInventoryProfileId}
            onRenameProfile={renameProfile}
            onClearInventory={clearInventory}
            onRemoveFromInventory={removeFromInventory}
            onAddToInventory={addToInventory}
            onOpenByCode={openInventoryByCode}
            codeInput={inventoryCodeInput}
            setCodeInput={setInventoryCodeInput}
            onCopyCode={copyInventoryCode}
            onChangePalette={changeInventoryPalette}
            uiSfx={uiSfx}
            setProfiles={setInventoryProfiles}
            fakeAccounts={fakeAccounts}
            setFakeAccounts={setFakeAccounts}
            tradeOnlyAccounts={tradeOnlyAccounts}
            setTradeOnlyAccounts={setTradeOnlyAccounts}
            onToggleProfileBan={toggleProfileBan}
            onToggleFakeBan={toggleFakeAccountBan}
            onUpgradeCharacter={upgradeProfileCharacter}
            adminToolsEnabled={adminToolsEnabled}
            onToggleAdminTools={handleToggleAdminTools}
          />
        )}

        <AnimatePresence>
          {adminPasswordOpen && (
            <motion.div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/78 p-4 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.86, y: 28, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 18, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative w-full max-w-xl overflow-hidden border border-amber-200/25 bg-[#09060f] shadow-[0_0_90px_rgba(255,190,80,0.22)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,140,0.22),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(255,80,120,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%,rgba(255,185,80,0.10))]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                <div className="relative p-7 md:p-9">
                  <div className="mb-5 inline-flex items-center gap-2 border border-red-300/25 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-100">
                    <ShieldAlert className="h-4 w-4" />
                    Kurucu Güvenlik Kilidi
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                    ADMIN TOOLS
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/62">
                    Bu panel ban, rank, hesap ve gizli yönetim araçlarını açar. Kod doğru girilmeden hiçbir admin yeteneği aktifleşmez.
                  </p>

                  <div className="mt-6 border border-white/12 bg-black/45 p-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-100/70">
                      Yönetici kodu
                    </label>
                    <input
                      value={adminPasswordInput}
                      onChange={(event) => {
                        setAdminPasswordInput(event.target.value);
                        setAdminPasswordError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") submitAdminPassword();
                        if (event.key === "Escape") setAdminPasswordOpen(false);
                      }}
                      autoFocus
                      type="password"
                      inputMode="numeric"
                      placeholder="•••••"
                      className="mt-3 w-full border border-amber-200/20 bg-black/70 px-4 py-4 text-3xl font-black tracking-[0.35em] text-amber-100 outline-none transition placeholder:text-white/18 focus:border-amber-200/55 focus:shadow-[0_0_35px_rgba(255,205,120,0.18)]"
                    />
                    {adminPasswordError && (
                      <div className="mt-3 border border-red-300/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
                        {adminPasswordError}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <button
                      onClick={submitAdminPassword}
                      className="border border-amber-200/35 bg-amber-300/15 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-amber-100 transition hover:bg-amber-300/24"
                    >
                      Kilidi Aç
                    </button>
                    <button
                      onClick={() => {
                        setAdminPasswordOpen(false);
                        setAdminPasswordInput("");
                        setAdminPasswordError("");
                      }}
                      className="border border-white/12 bg-white/[0.04] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/[0.08]"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </TabScene>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <MaintenanceErrorBoundary>
      <PageContent />
    </MaintenanceErrorBoundary>
  );
}
