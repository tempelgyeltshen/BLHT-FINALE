import React from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

/** Reusable search input with leading Search icon (admin filter bars). */

export const SearchInput: React.FC<SearchInputProps> = ({
  containerClassName = '',
  className = '',
  ...rest
}) => {
  return (
    <div className={`relative w-full md:w-96 ${containerClassName}`}>
      <Search className="w-4 h-4 text-amber-700 absolute left-3 top-3 pointer-events-none" />
      <input
        type="text"
        className={`w-full bg-white border border-amber-300 rounded-xl py-2 pl-9 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner ${className}`}
        {...rest}
      />
    </div>
  );
};
