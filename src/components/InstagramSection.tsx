import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { STORE_DETAILS } from '../data/menuData';

export const InstagramSection: React.FC = () => {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
      caption: 'Il momento esatto in cui apri un vero Panzarotto Pompei... 🧀🔥 Filante e dorato!',
      likes: '1.4k',
      comments: '84',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
      caption: 'Diavolo lovers! Salamino piccante campano e mozzarella filante. Pronto da mordere! 🌶️',
      likes: '980',
      comments: '52',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600&q=80',
      caption: 'Arancino napoletano con cuore di provola affumicata e speck. Uno tira l’altro! 🍚✨',
      likes: '1.8k',
      comments: '112',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      caption: 'Gran fritto misto per la serata di sabato. Chi taggheresti per finirlo tutto? 🍟',
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
              Tagga le tue foto con <span className="text-[#ff7722] font-semibold">#PanzarottoPompei</span> per essere ripostato nelle nostre storie!
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
