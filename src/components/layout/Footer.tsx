import React from 'react';
import { Language } from '../../types/orleans';
import { FleurDeLisIcon } from '../common/Icons';

export function Footer({ language }: { language: Language }) {
  return (
    <footer className="mt-16 border-t border-stone-800/80 bg-stone-950 text-stone-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FleurDeLisIcon size={18} className="text-amber-500" />
          <span className="font-semibold text-stone-300">Orléans Companion</span>
          <span className="text-stone-600">·</span>
          <span>{language === 'sr' ? 'Besplatan digitalni pomoćnik za društvenu igru' : 'Free board game companion app'}</span>
        </div>

        <div className="text-center sm:text-right text-stone-500 text-[11px]">
          {language === 'sr' 
            ? 'Zasnovano na pravilima igre Orléans (Autor: Reiner Stockhausen, Izdavač: dlp games).' 
            : 'Based on the board game Orléans (Author: Reiner Stockhausen, Publisher: dlp games).'}
        </div>
      </div>
    </footer>
  );
}
