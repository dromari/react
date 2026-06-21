import { fetchDetailedPokemons } from '@/services/api';
import SearchBar from '@/components/SearchBar/SearchBar';
import ResultsContainer from '@/components/ResultsContainer/ResultsContainer';
import Flyout from '@/components/Flyout/Flyout';
import PokemonDetails from '@/components/PokemonDetails/PokemonDetails';
import { PokemonListItem } from '@/types/pokemonTypes';
import { Link } from '@/i18n/routing';
import ThemeButton from '@/components/Theme/ThemeButton';
import styles from './page.module.css';

import { getTranslations } from 'next-intl/server';
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ query?: string; page?: string; id?: string }>;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  await params;
  const { query = '', page = '1', id } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const tNav = await getTranslations('Navigation');

  const data = await fetchDetailedPokemons(query, currentPage);
  const isError = 'isError' in data;
  const pokemons = isError ? [] : data.pokemons;
  const totalCount = isError ? 0 : data.count;

  let selectedPokemon: PokemonListItem | null = null;
  if (id) {
    const detailData = await fetchDetailedPokemons(id);
    if (
      detailData &&
      !('isError' in detailData) &&
      detailData.pokemons.length > 0
    ) {
      selectedPokemon = detailData.pokemons[0];
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <button className={styles.refreshButton} title={tNav('refresh')}>
        {tNav('refresh')}
      </button>
      <LanguageSelector />

      <ThemeButton />

      <button className={styles.aboutButton}>
        <Link href="/about" className={styles.navLinkAbout}>
          {tNav('about')}
        </Link>
      </button>

      <button className={styles.errorButton} title={tNav('test')}>
        {tNav('test')}
      </button>

      <div className={styles.smallLights}>
        <div className={styles.redLight} />
        <div className={styles.yellowLight} />
        <div className={styles.greenLight} />
      </div>

      <h1 className={styles.title}>Pokédex v1.0</h1>

      <div className={`${styles.screenInner} ${styles.splitLayout}`}>
        <div className={id ? styles.leftColumn : styles.leftColumnFull}>
          <SearchBar initialQuery={query} />

          {isError ? (
            <div className={styles.errorBanner}>{data.message}</div>
          ) : (
            <ResultsContainer
              pokemons={pokemons}
              totalCount={totalCount}
              currentPage={currentPage}
            />
          )}
        </div>

        {id && (
          <div className={styles.rightColumn}>
            <PokemonDetails pokemon={selectedPokemon} />
          </div>
        )}
      </div>

      <Flyout />
    </div>
  );
}
