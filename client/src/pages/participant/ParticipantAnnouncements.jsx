import React, { useState, useEffect } from 'react';
import { Bell, Megaphone, Calendar } from 'lucide-react';
import api from '../../services/api';

const ParticipantAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (res.data.success) {
          setAnnouncements(res.data.data);
        }
      } catch (err) {
        console.error('[Announcements Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black font-heading text-white">
          CAMPAIGN <span className="text-gold-gradient">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Official bulletins and procedural updates published by Independent Medias.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gold-400 font-mono">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="p-8 rounded-2xl bg-dark-900 border border-gray-800 text-center text-gray-400">
          No new announcements posted at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="luxury-card rounded-2xl p-6 sm:p-8 space-y-3 hover:border-gold-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="px-2.5 py-1 rounded bg-gold-500/10 text-gold-400 font-semibold uppercase tracking-wider">
                  {ann.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>{new Date(ann.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">{ann.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{ann.content}</p>
              <div className="pt-2 text-xs text-gold-400/80 font-mono">
                Issued by: {ann.author || 'Independent Medias Directorate'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantAnnouncements;
