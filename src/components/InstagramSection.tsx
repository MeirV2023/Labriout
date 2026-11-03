import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { STORE_DETAILS } from '../data/menuData';

export const InstagramSection: React.FC = () => {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/bd8dcf58db7e-double-smash-burger.webp',
      caption: 'Double Smash Burger maison saisi minute sur la plancha... 🍔🔥 100% Casher Badatz de Brunoy !',
      likes: '1.4k',
      comments: '84',
    },
    {
      id: 2,
      image: 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/d3b33d1f5265-laffa-shawarma.webp',
      caption: 'Laffa Shawarma bien chaude garnie de houmous, tahina et viandes rôties à la broche ! 🥙✨',
      likes: '1.2k',
      comments: '68',
    },
    {
      id: 3,
      image: 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/4a334603274e-assiette-duo-2-viandes.webp',
      caption: 'Assiette Duo Parguit & Schnitzel croustillant aux graines de sésame avec frites de patates douces ! 🍽️🔥',
      likes: '1.8k',
      comments: '112',
    },
    {
      id: 4,
      image: 'https://ik.imagekit.io/3l9prqiky/eatview/migrated/labriout/0fe48647b6ed-houmous-bassar.webp',
      caption: 'Houmous Bassar crémeux préparé chaque matin avec émincé de viande grillée et huile d’olive. 🫒🥩',
      likes: '2.1k',
      comments: '143',
    },
  ];

  return (
    <section className="py-12 bg-[#0a0b0e] border-t border-b border-[#1c1e27] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#ff5500] text-xs uppercase font-extrabold tracking-wider mb-1">
              <Instagram className="w-4 h-4" />
              <span>Seguici su Instagram</span>
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              {STORE_DETAILS.instagramHandle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Identifiez vos photos avec <span className="text-[#ff7722] font-semibold">#Labriout94</span> pour être partagé dans nos stories !
            </p>
          </div>

          <a
            href={STORE_DETAILS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-[#ff5500] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/20 transition transform active:scale-95"
          >
            <Instagram className="w-4 h-4" />
            <span>Vedi su Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Instagram photo cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {instagramPosts.map(post => (
            <a
              key={post.id}
              href={STORE_DETAILS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#161821] border border-[#232733] shadow-md"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 sm:p-4 text-white">
                <div className="flex items-center justify-end">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <p className="text-[11px] line-clamp-2 text-neutral-200">{post.caption}</p>
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
