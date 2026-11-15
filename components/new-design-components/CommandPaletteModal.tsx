'use client';

import * as React from 'react';
import { useSearchContext } from './search-context';
import { SearchModal } from './SearchModal';
import { ALL_SHOWCASE_ITEMS } from './CuratedGallery';

export function CommandPaletteModal() {
  const { openSearch, setOpenSearch } = useSearchContext();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpenSearch(!openSearch);
      }
      if (e.key === 'Escape') {
        setOpenSearch(false);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [openSearch, setOpenSearch]);

  return (
    <SearchModal
      isOpen={openSearch}
      onClose={() => setOpenSearch(false)}
      items={ALL_SHOWCASE_ITEMS}
    />
  );
}

export default CommandPaletteModal;
