'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  id?: string;
  name: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Search...',
  className = '',
  loading = false,
}: SearchableSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = options.filter(opt =>
      opt.name.toLowerCase().includes(searchLower)
    );
    setFiltered(filtered);
  }, [search, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.name === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus-within:border-gray-500 bg-white cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? search : (selectedOption?.name || '')}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange('');
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearch('');
          }}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
          disabled={loading}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg bg-white shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-gray-500 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No cities found</div>
          ) : (
            filtered.map(option => (
              <button
                key={option.id || option.name}
                type="button"
                onClick={() => {
                  onChange(option.name);
                  setSearch('');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition ${
                  value === option.name
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {option.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
