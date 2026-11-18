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
        <h1 className="text-3xl font-black font-heading text-[#172033]">
          CAMPAIGN <span className="text-gold-gradient">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Official bulletins and procedural updates published by the Draw Directorate.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#D6A63A] font-mono">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-[#E8EAF0] text-center text-[#667085]">
          No new announcements posted at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white border border-[#E8EAF0] rounded-2xl p-6 sm:p-8 space-y-3 shadow-card-light hover:border-[#D6A63A]/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#667085]">
                <span className="px-2.5 py-1 rounded bg-[#FAF7EE] text-[#946708] font-bold uppercase tracking-wider">
                  {ann.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#667085]" />
                  <span>{new Date(ann.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#172033] font-heading">{ann.title}</h3>
              <p className="text-sm text-[#667085] leading-relaxed">{ann.content}</p>
              <div className="pt-2 text-xs text-[#946708] font-mono">
                Issued by: {ann.author || 'Draw Directorate'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantAnnouncements;
