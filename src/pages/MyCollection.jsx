import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Button } from '../components/ui/Button';
import { Loader2, ArrowLeft, Bookmark, Sparkles, Scissors, X } from 'lucide-react';

const reportText = (value) => typeof value === 'string' ? value : value && typeof value === 'object'
  ? Object.entries(value).map(([key, item]) => `${key.replace(/_/g, ' ')}: ${String(item)}`).join(' • ')
  : '';

export const MyCollection = ({ navigateTo }) => {
  const [error, setError] = useState('');
  const [savedReports, setSavedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (!selectedReport) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedReport(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedReport]);

  useEffect(() => {
    let active = true;
    const fetchReports = async () => {
      if (!auth.currentUser) {
        navigateTo('login');
        return;
      }
      
      try {
        const q = query(
          collection(db, 'saved_reports'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const reports = [];
        querySnapshot.forEach((doc) => {
          reports.push({ id: doc.id, ...doc.data() });
        });
        
        if (active) setSavedReports(reports);
      } catch (error) {
        console.error('Error fetching collection:', error);
        if (active) setError('Unable to load your collection. Please reload and try again.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchReports();
    return () => { active = false; };
  }, [navigateTo]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-vintage-cream flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-vintage-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-vintage-rose/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-vintage-sage/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vintage-charcoal rounded-full flex items-center justify-center">
            <Bookmark className="text-vintage-gold" size={20} />
          </div>
          <h1 className="text-2xl font-serif tracking-widest uppercase">My Atelier</h1>
        </div>
        <Button variant="ghost" onClick={() => navigateTo('dashboard')} className="text-sm flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Studio
        </Button>
      </header>

      <main className="flex-1 p-8 relative z-10 max-w-7xl mx-auto w-full">
        {error ? <p role="alert" className="text-red-700">{error}</p> : savedReports.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
          >
            <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-vintage-charcoal/10">
              <Sparkles className="text-vintage-gold" size={40} />
            </div>
            <h2 className="text-3xl font-serif text-vintage-charcoal mb-4">Your atelier is empty</h2>
            <p className="text-vintage-charcoal/60 mb-8 max-w-md mx-auto font-light text-lg">
              You haven't saved any bespoke designs yet. Head back to the studio and envision your first masterpiece.
            </p>
            <Button onClick={() => navigateTo('dashboard')} className="px-8">
              Go Design
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-vintage-charcoal/5 flex flex-col h-full"
              >
                {typeof report.fabricImage === 'string' && report.fabricImage.startsWith('data:image/') && (
                  <img src={report.fabricImage} alt="Saved fabric" className="w-full h-40 object-cover rounded-2xl mb-4" />
                )}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h3 className="text-xl font-serif text-vintage-charcoal line-clamp-1" title={report.aiData?.design_name}>
                    {report.aiData?.design_name || "Bespoke Design"}
                  </h3>
                </div>
                
                <p className="text-vintage-charcoal/70 text-sm mb-6 line-clamp-3 font-light leading-relaxed flex-grow">
                  {reportText(report.aiData?.fabric_analysis)}
                </p>

                <Button variant="secondary" className="w-full text-sm" onClick={() => setSelectedReport(report)}>
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-title"
              className="bg-vintage-cream w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="p-6 border-b border-vintage-charcoal/10 flex justify-between items-center relative z-10 bg-vintage-cream/80 backdrop-blur-md">
                <h2 id="report-title" className="text-2xl font-serif text-vintage-charcoal flex items-center gap-2 line-clamp-1" title={selectedReport.aiData?.design_name}>
                  <Sparkles className="text-vintage-gold" size={20} />
                  <span className="truncate">{selectedReport.aiData?.design_name}</span>
                </h2>
                <button type="button" aria-label="Close report"
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-vintage-charcoal/5 rounded-full transition-colors text-vintage-charcoal/60 hover:text-vintage-charcoal flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto relative z-10 space-y-8 custom-scrollbar">
                <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-2">Fabric Analysis</h3>
                  <p className="text-vintage-charcoal/90 font-light leading-relaxed">
                    {reportText(selectedReport.aiData?.fabric_analysis)}
                  </p>
                </div>

                <div className="bg-vintage-charcoal rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10">
                    <Scissors size={80} className="text-white transform rotate-45 -mt-4 -mr-4" />
                  </div>
                  <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-3 relative z-10">Tailoring Instructions</h3>
                  <ul className="text-white/90 font-serif leading-relaxed relative z-10 space-y-2 list-none">
                    {selectedReport.aiData?.tailoring_instructions && typeof selectedReport.aiData.tailoring_instructions === 'object' ? (
                      Object.entries(selectedReport.aiData.tailoring_instructions).map(([key, value]) => (
                        <li key={key}>
                          <strong className="text-vintage-gold capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                        </li>
                      ))
                    ) : (
                      <li>{String(selectedReport.aiData?.tailoring_instructions || "No specific instructions provided.")}</li>
                    )}
                  </ul>
                </div>

                <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-2">Styling & Accessories</h3>
                  <ul className="text-vintage-charcoal/90 font-light leading-relaxed space-y-2 list-none">
                    {selectedReport.aiData?.styling_accessories && typeof selectedReport.aiData.styling_accessories === 'object' ? (
                      Object.entries(selectedReport.aiData.styling_accessories).map(([key, value]) => (
                        <li key={key}>
                          <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                        </li>
                      ))
                    ) : (
                      <li>{String(selectedReport.aiData?.styling_accessories || "No specific accessories provided.")}</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
