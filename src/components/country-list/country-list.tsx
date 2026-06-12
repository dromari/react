import { useMemo, useState, useEffect, useRef } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

const ITEM_HEIGHT = 300;
const WINDOW_HEIGHT = 800;
const BUFFER = 5;

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(query);
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    if (sortField === 'name') {
      return filtered.sort((a, b) => {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      });
    } else {
      const popMap = new Map<string, number>();
      filtered.forEach((c) => {
        const pop = getPopulationForYear(createYearDataMap(c.data), selectedYear) || 0;
        popMap.set(c.id, pop);
      });

      return filtered.sort((a, b) => {
        const popA = popMap.get(a.id) || 0;
        const popB = popMap.get(b.id) || 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      });
    }
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const { startIndex, endIndex, paddingTop, paddingBottom } = useMemo(() => {
    const totalItems = filteredCountries.length;
    const rawStartIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const rawEndIndex = Math.ceil((scrollTop + WINDOW_HEIGHT) / ITEM_HEIGHT);
    const start = Math.max(0, rawStartIndex - BUFFER);
    const end = Math.min(totalItems, rawEndIndex + BUFFER);
    const top = start * ITEM_HEIGHT;
    const bottom = Math.max(0, (totalItems - end) * ITEM_HEIGHT);

    return {
      startIndex: start,
      endIndex: end,
      paddingTop: top,
      paddingBottom: bottom,
    };
  }, [scrollTop, filteredCountries.length]);

  const visibleCountries = useMemo(() => {
    return filteredCountries.slice(startIndex, endIndex);
  }, [filteredCountries, startIndex, endIndex]);

  if (filteredCountries.length === 0) {
    return <div className={styles.noData}>No countries found</div>;
  }

  return (
    <div
      ref={containerRef}
      className={styles.countryListContainer}
      style={{ height: WINDOW_HEIGHT, overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ paddingTop, paddingBottom }}>
        {visibleCountries.map((country) => (
          <div key={country.id} style={{ height: ITEM_HEIGHT }}>
            <CountryCard
              country={country}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
