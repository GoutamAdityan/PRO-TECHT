
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Link, Flag } from 'lucide-react';
import { DURATION_MEDIUM, SMOOTH_EASE } from '@/lib/animations/motion';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; filename: string; uploaded: string }[];
  startIndex?: number;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ isOpen, onClose, images, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="bg-black/50 backdrop-blur-lg border-0 p-0 max-w-none w-full h-full flex items-center justify-center">
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION_MEDIUM, ease: SMOOTH_EASE }}
            >
              {/* Close Button */}
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50 text-white hover:text-green-400" onClick={onClose}>
                <X className="w-8 h-8" />
              </Button>

              {/* Image Display */}
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.img
                  key={currentImage.url}
                  src={currentImage.url}
                  alt={currentImage.filename}
                  className="max-h-[90vh] max-w-[70vw] object-contain rounded-lg shadow-2xl shadow-green-500/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: DURATION_MEDIUM, ease: SMOOTH_EASE }}
                />
              </div>

              {/* Metadata Panel */}
              <motion.div
                className="w-[300px] bg-black/30 backdrop-blur-xl border-l border-green-500/20 h-full p-6 flex flex-col text-white"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: DURATION_MEDIUM, ease: SMOOTH_EASE, delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-green-400">Details</h3>
                <div className="mt-4 text-sm space-y-2 text-gray-300">
                  <p><strong>Filename:</strong> {currentImage.filename}</p>
                  <p><strong>Uploaded:</strong> {currentImage.uploaded}</p>
                  <p><strong>Camera:</strong> Not available</p>
                </div>
                <div className="mt-auto space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                  <Button className="w-full bg-gray-700 hover:bg-gray-600">
                    <Link className="w-4 h-4 mr-2" /> Copy Link
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Flag className="w-4 h-4 mr-2" /> Report Image
                  </Button>
                </div>
              </motion.div>

              {/* Navigation */}
              <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-green-400" onClick={handlePrev}>
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-[316px] top-1/2 -translate-y-1/2 z-50 text-white hover:text-green-400" onClick={handleNext}>
                <ChevronRight className="w-10 h-10" />
              </Button>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ImageLightbox;
