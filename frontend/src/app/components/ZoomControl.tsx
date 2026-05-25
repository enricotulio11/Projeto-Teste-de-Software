import { useState } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

export function ZoomControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      const newZoom = zoomLevel + 10;
      setZoomLevel(newZoom);
      document.body.style.zoom = `${newZoom}%`;
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      const newZoom = zoomLevel - 10;
      setZoomLevel(newZoom);
      document.body.style.zoom = `${newZoom}%`;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        {isOpen && (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 flex flex-col gap-2">
            <div className="text-center font-semibold text-lg mb-1">
              {zoomLevel}%
            </div>
            <Button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              size="lg"
              className="w-12 h-12"
              aria-label="Aumentar zoom"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              size="lg"
              className="w-12 h-12"
              aria-label="Diminuir zoom"
            >
              <Minus className="h-6 w-6" />
            </Button>
          </div>
        )}
        
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg"
          aria-label={isOpen ? "Fechar ferramenta de zoom" : "Abrir ferramenta de zoom"}
        >
          <Search className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
