'use client'

import { useState } from 'react'

const universityClubs = [
  { name: "WHU Entrepreneurship Club", members: "500+", abbrev: "WHU", link: "https://whu.edu", logoUrl: "https://asset.brandfetch.io/idC8X5E0CK/idwCzf3v9J.svg" },
  { name: "HEC Entrepreneurs", members: "400+", abbrev: "HEC", link: "https://hec.edu", logoUrl: "https://asset.brandfetch.io/idAOqDqMgf/idlKAcCHqp.svg" },
  { name: "INSEAD PE/VC Club", members: "600+", abbrev: "INSEAD", link: "https://insead.edu", logoUrl: "https://asset.brandfetch.io/idqvd6fxF_/id7hQP_1xM.svg" },
  { name: "LBS Private Equity Club", members: "450+", abbrev: "LBS", link: "https://london.edu", logoUrl: "https://asset.brandfetch.io/idBfbL7qX7/idlBwvmcqx.svg" },
  { name: "HSG Founders Club", members: "350+", abbrev: "HSG", link: "https://unisg.ch", logoUrl: "https://asset.brandfetch.io/idB3zVoOqp/idHXdGvWup.svg" },
  { name: "CBS Entrepreneurship", members: "300+", abbrev: "CBS", link: "https://cbs.dk", logoUrl: "https://asset.brandfetch.io/id5xj0q_XB/idHj6CmZjU.svg" },
]

function UniversityCard({ club }: { club: typeof universityClubs[0] }) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={club.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
    >
      <div className="h-12 flex items-center justify-center mb-3">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.logoUrl}
            alt={club.abbrev}
            className="h-10 w-auto max-w-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{club.abbrev}</span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{club.name}</h4>
      <p className="text-xs text-slate-400">{club.members} members</p>
    </a>
  )
}

export function UniversityLogos() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {universityClubs.map((club, index) => (
        <UniversityCard key={index} club={club} />
      ))}
    </div>
  )
}
