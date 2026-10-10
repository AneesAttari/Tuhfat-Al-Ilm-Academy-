import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  Plus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import heroImg from '../../assets/images/quran_hero_learning_1791212029554.jpg';
import studyImg from '../../assets/images/quran_tajweed_reading_1791212054850.jpg';
import geomImg from '../../assets/images/islamic_geometry_texture_1791212043809.jpg';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  title: string;
  size: string;
  category: string;
  canDelete: boolean;
  updated_at?: string;
}

export const AdminMediaView: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fallback initial list if API not loaded
  const fallbackItems: MediaItem[] = [
    {
      id: 'branding-logo',
      filename: 'Tuhfat_Al_Ilm_Academy_Logo.png',
      url: '/Tuhfat_Al_Ilm_Academy_Logo.png',
      title: 'Tuhfat Al-Ilm Academy Official Logo',
      size: '298 KB',
      category: 'Official Branding',
      canDelete: false
    },
    {
      id: 'asset-hero',
      filename: 'quran_hero_learning_1791212029554.jpg',
      url: heroImg,
      title: 'Quran Hero Showcase (Authentic Carved Stand)',
      size: '220 KB',
      category: 'Curriculum & Themes',
      canDelete: false
    },
    {
      id: 'asset-study',
      filename: 'quran_tajweed_reading_1791212054850.jpg',
      url: studyImg,
      title: 'Tajweed Study & Reading Atmosphere',
      size: '185 KB',
      category: 'Curriculum & Themes',
      canDelete: false
    },
    {
      id: 'asset-geom',
      filename: 'islamic_geometry_texture_1791212043809.jpg',
      url: geomImg,
      title: 'Traditional Islamic Geometric Texture',
      size: '142 KB',
      category: 'Curriculum & Themes',
      canDelete: false
    }
  ];

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        if (data.media && Array.isArray(data.media)) {
          setMediaList(data.media);
        } else {
          setMediaList(fallbackItems);
        }
      } else {
        setMediaList(fallbackItems);
      }
    } catch {
      setMediaList(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (urlStr: string) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedUrl(urlStr);
    setFeedback({ type: 'success', message: `Copied URL: "${urlStr}" to clipboard!` });
    setTimeout(() => {
      setCopiedUrl(null);
      setFeedback(null);
    }, 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG).' });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'File size exceeds 15 MB limit. Please choose a smaller image.' });
      return;
    }

    setUploading(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setFeedback({ type: 'success', message: `Image "${file.name}" uploaded successfully!` });
          fetchMedia();
        } else {
          setFeedback({ type: 'error', message: data.error || 'Failed to upload image.' });
        }
      } catch {
        setFeedback({ type: 'error', message: 'Network error uploading image.' });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!item.canDelete) {
      alert('System branding and core assets cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${item.filename}"? Any page referencing this image will no longer display it.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/media/${encodeURIComponent(item.filename)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `Deleted asset "${item.filename}".` });
        fetchMedia();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to delete file.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error deleting file.' });
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(mediaList.map((m) => m.category)));

  return (
    <div className="space-y-6">
      {/* Top Banner & Upload Action */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Media &amp; Image Assets Manager</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Upload new images for teachers, courses, and homepage banners, or copy image URLs to use anywhere.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#043D2E] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading Image...' : 'Upload Image'}</span>
          </button>

          <button
            type="button"
            onClick={fetchMedia}
            className="p-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#064E3B] hover:bg-neutral-50 transition-colors cursor-pointer"
            title="Refresh media list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B]'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            All Assets ({mediaList.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] space-y-3">
          <FolderOpen className="w-12 h-12 mx-auto text-[#94A3B8]" />
          <h3 className="font-bold text-base text-[#0F172A]">No Media Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            No images match your search criteria. Click "Upload Image" above to upload photos from your device.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#A7F3D0] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 bg-neutral-50"
                    onError={(e: any) => {
                      e.target.src = '/Tuhfat_Al_Ilm_Academy_Logo.png';
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm text-[#0F172A] line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-mono text-[11px] truncate max-w-[170px]" title={item.filename}>
                      {item.filename}
                    </span>
                    <span className="font-semibold text-emerald-700">{item.size}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors cursor-pointer"
                >
                  {copiedUrl === item.url ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                      <span>URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Image URL</span>
                    </>
                  )}
                </button>

                {item.canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Uploaded Asset</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
