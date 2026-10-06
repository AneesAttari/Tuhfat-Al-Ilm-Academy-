import React, { useState, useEffect } from 'react';
import { Image, Copy, CheckCircle2, ExternalLink, FileText } from 'lucide-react';
import heroImg from '../../assets/images/quran_hero_learning_1791212029554.jpg';
import studyImg from '../../assets/images/quran_tajweed_reading_1791212054850.jpg';
import geomImg from '../../assets/images/islamic_geometry_texture_1791212043809.jpg';

interface MediaItem {
  filename: string;
  path: string;
  title: string;
  size: string;
  src: string;
}

export const AdminMediaView: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const mediaItems: MediaItem[] = [
    {
      filename: 'quran_hero_learning_1791212029554.jpg',
      path: '/src/assets/images/quran_hero_learning_1791212029554.jpg',
      title: 'Quran Hero Showcase (Authentic Carved Stand)',
      size: '220 KB',
      src: heroImg
    },
    {
      filename: 'quran_tajweed_reading_1791212054850.jpg',
      path: '/src/assets/images/quran_tajweed_reading_1791212054850.jpg',
      title: 'Tajweed Study & Reading Atmosphere',
      size: '185 KB',
      src: studyImg
    },
    {
      filename: 'islamic_geometry_texture_1791212043809.jpg',
      path: '/src/assets/images/islamic_geometry_texture_1791212043809.jpg',
      title: 'Traditional Islamic Geometric Texture',
      size: '142 KB',
      src: geomImg
    }
  ];

  const handleCopy = (pathStr: string) => {
    navigator.clipboard.writeText(pathStr);
    setCopiedPath(pathStr);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Media &amp; Image Assets</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Photographic assets and visual textures used across academy hero banners, course previews, and about sections.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0]">
          {mediaItems.length} Assets Registered
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#A7F3D0] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-sm text-[#0F172A]">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-mono text-[11px] truncate max-w-[180px]">{item.filename}</span>
                  <span className="font-semibold">{item.size}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleCopy(item.path)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors cursor-pointer"
              >
                {copiedPath === item.path ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Path Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Asset Path</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
