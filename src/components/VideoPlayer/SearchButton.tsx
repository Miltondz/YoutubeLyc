import React from 'react';
import { Button } from '../ui/button';
import { Search, Loader2 } from 'lucide-react';

interface SearchButtonProps {
  onSearch: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ 
  onSearch, 
  isLoading,
  disabled 
}) => {
  return (
    <Button 
      onClick={onSearch}
      disabled={isLoading || disabled}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Search Lyrics & Trivia
        </>
      )}
    </Button>
  );
};