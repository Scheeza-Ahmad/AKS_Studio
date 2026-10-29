import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { UploadCloud, Sparkles, Scissors, Camera, LogOut, Loader2, CheckCircle2, Bookmark } from 'lucide-react';
import { generateOutfitAndText } from '../utils/aiService';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createPreview } from '../utils/imagePreview';
import { signOut } from 'firebase/auth';

export const Dashboard = ({ navigateTo }) => {
  const [error, setError] = useState('');
  const [base64Fabric, setBase64Fabric] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("A-Line Kurta");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    e.target.value = '';
    if (!selectedFile || isProcessing) return;
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(selectedFile.type) || selectedFile.size > 10 * 1024 * 1024) {
      setError('Choose a PNG, JPEG or WebP image up to 10 MB.');
      return;
    }
    setIsProcessing(true);
    setResultReady(false);
    setIsSaved(false);
    try {
      const preview = await createPreview(selectedFile);
      setBase64Fabric(preview);
      const result = await generateOutfitAndText(preview, selectedTemplate);
      setAiData(result);
      setResultReady(true);
    } catch (error) {
      setError(error.message || 'Failed to analyze fabric. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetStudio = () => {
    setError('');
    setBase64Fabric('');
    setResultReady(false);
    setIsProcessing(false);
    setAiData(null);
    setIsSaved(false);
  };

  const saveReportToDatabase = async () => {
    if (!auth.currentUser || !aiData || !base64Fabric || isSaving || isSaved) return;

    setError('');
    setIsSaving(true);
    try {
      if (new TextEncoder().encode(JSON.stringify({ fabricImage: base64Fabric, aiData })).length > 900000) {
        throw new Error('Report is too large to save.');
      }
      await addDoc(collection(db, 'saved_reports'), {
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        fabricImage: base64Fabric,
        aiData: aiData
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save report:", error);
      setError('Failed to save report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out", error);
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 md:py-6 flex justify-between items-center glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-vintage-charcoal rounded-full flex items-center justify-center">
            <Sparkles className="text-vintage-gold w-4 h-4 md:w-5 md:h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-serif tracking-widest uppercase">Aks</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button aria-label="My Collection" variant="ghost" onClick={() => navigateTo('collection')} className="text-sm px-2 md:px-4">
            <Bookmark size={18} className="md:mr-2" />
            <span className="hidden md:inline">My Collection</span>
          </Button>
          <Button aria-label="Sign Out" variant="ghost" onClick={handleSignOut} className="text-sm px-2 md:px-4">
            <LogOut size={18} className="md:mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {error && <p role="alert" className="text-red-700 mb-4">{error}</p>}
        <AnimatePresence mode="wait">
          {!isProcessing && !resultReady && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl w-full"
            >
              <div className="text-center mb-12">
                <h2 className="text-5xl mb-4 text-vintage-charcoal">The Atelier</h2>
                <p className="text-lg text-vintage-charcoal/60 font-light">Upload an unstitched fabric to envision your bespoke masterpiece.</p>
              </div>

              {/* Template Selection */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {["Modern Lehenga", "A-Line Kurta", "Classic Gharara"].map(template => (
                  <button
                    key={template}
                    type="button"
                    aria-pressed={selectedTemplate === template}
                    onClick={() => setSelectedTemplate(template)}
                    className={`px-6 py-2 rounded-full font-serif transition-all duration-300 ${selectedTemplate === template
                      ? 'bg-vintage-charcoal text-vintage-gold shadow-md'
                      : 'bg-white text-vintage-charcoal border border-vintage-charcoal/20 hover:border-vintage-gold'
                      }`}
                  >
                    {template}
                  </button>
                ))}
              </div>

              <div
                onClick={handleUploadClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUploadClick(); } }}
                className="group relative cursor-pointer glass-panel rounded-3xl p-16 flex flex-col items-center justify-center border-2 border-dashed border-vintage-charcoal/20 hover:border-vintage-gold/50 transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-vintage-rose/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-24 h-24 bg-white rounded-full shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out z-10">
                  <UploadCloud size={40} className="text-vintage-charcoal/80" />
                </div>
                <h3 className="text-xl font-serif mb-2 z-10">Choose your fabric image</h3>
                <p className="text-sm text-vintage-charcoal/50 z-10">PNG, JPG or WebP up to 10MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-vintage-gold/20 rounded-full blur-xl"
                ></motion.div>
                <div className="w-32 h-32 bg-white rounded-full shadow-cinematic flex items-center justify-center relative z-10">
                  <Scissors size={48} className="text-vintage-charcoal animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-serif">Processing Fabric & Styling...</h2>
              <p className="text-vintage-charcoal/60 font-light tracking-wide">Crafting your silhouette in the studio</p>
            </motion.div>
          )}

          {resultReady && aiData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl w-full mx-auto"
            >
              <div className="glass-panel rounded-3xl p-10 md:p-14 shadow-cinematic relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-vintage-rose/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-12">
                    <Sparkles className="text-vintage-gold" size={28} />
                    <h2 className="text-4xl font-serif text-center text-vintage-charcoal">
                      {aiData.design_name || "Bespoke Masterpiece"}
                    </h2>
                    <Sparkles className="text-vintage-gold" size={28} />
                  </div>

                  <div className="space-y-8">
                    {/* FIXED FABRIC ANALYSIS SECTION */}
                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm">
                      <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-3">Fabric Analysis</h3>
                      <div className="text-vintage-charcoal/90 font-light text-lg leading-relaxed space-y-2">
                        {aiData.fabric_analysis && typeof aiData.fabric_analysis === 'object' ? (
                          Object.entries(aiData.fabric_analysis).map(([key, value]) => (
                            <p key={key}>
                              <strong className="capitalize text-vintage-charcoal">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                            </p>
                          ))
                        ) : (
                          <p>{String(aiData.fabric_analysis || "No specific analysis provided.")}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-vintage-charcoal rounded-2xl p-6 shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10">
                        <Scissors size={120} className="text-white transform rotate-45 -mt-6 -mr-6" />
                      </div>
                      <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-3 relative z-10">Tailoring Instructions</h3>
                      <ul className="text-white/90 font-serif text-lg leading-relaxed relative z-10 space-y-2 list-none">
                        {aiData.tailoring_instructions && typeof aiData.tailoring_instructions === 'object' ? (
                          Object.entries(aiData.tailoring_instructions).map(([key, value]) => (
                            <li key={key}>
                              <strong className="text-vintage-gold capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                            </li>
                          ))
                        ) : (
                          <li>{String(aiData.tailoring_instructions || "No specific instructions provided.")}</li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm">
                      <h3 className="text-xs uppercase tracking-widest text-vintage-gold font-bold mb-3">Styling & Accessories</h3>
                      <ul className="text-vintage-charcoal/90 font-light text-lg leading-relaxed space-y-2 list-none">
                        {aiData.styling_accessories && typeof aiData.styling_accessories === 'object' ? (
                          Object.entries(aiData.styling_accessories).map(([key, value]) => (
                            <li key={key}>
                              <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                            </li>
                          ))
                        ) : (
                          <li>{String(aiData.styling_accessories || "No specific accessories provided.")}</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-vintage-charcoal/10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={resetStudio} className="flex-1 max-w-xs">
                      <Camera size={18} className="mr-2" />
                      Consult Another Fabric
                    </Button>
                    <Button variant="secondary" className="flex-1 max-w-xs flex items-center justify-center gap-2" onClick={saveReportToDatabase} disabled={isSaving || isSaved}>
                      {isSaving && <Loader2 size={16} className="animate-spin" />}
                      {isSaved && <CheckCircle2 size={16} className="text-green-600" />}
                      {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Style Report'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
