'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { THEMES } from '@civique/shared';
import { computeLevelsForTheme } from '@/lib/shuffleChoices';
import { useProgressionStore } from '@/lib/stores/progressionStore';

interface Props {
  countByTheme: Record<number, number>;
}

const THEME_DESCRIPTIONS: Record<number, string> = {
  1: 'Devise nationale, laïcité, symboles républicains.',
  2: "Pouvoirs, élections, collectivités, l'Europe.",
  3: 'Le vote, la justice, le service civique.',
  4: 'Grandes dates, régions, patrimoine, culture.',
  5: 'Travail, santé, école, vie quotidienne.',
};

export function ThemePathsClient({ countByTheme }: Props) {
  const loadProgress = useProgressionStore((s) => s.loadProgress);
  const loaded = useProgressionStore((s) => s.loaded);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <div className="space-y-7">
      {THEMES.map((theme) => {
        const total = countByTheme[theme.id] ?? 0;
        const totalLevels = computeLevelsForTheme(total);
        return (
          <ThemeRow
            key={theme.id}
            themeId={theme.id}
            themeName={theme.nameFr}
            themeColor={theme.color}
            description={THEME_DESCRIPTIONS[theme.id]}
            totalQuestions={total}
            totalLevels={totalLevels}
            loaded={loaded}
          />
        );
      })}
    </div>
  );
}

function ThemeRow({
  themeId,
  themeName,
  themeColor,
  description,
  totalQuestions,
  totalLevels,
  loaded,
}: {
  themeId: number;
  themeName: string;
  themeColor: string;
  description: string;
  totalQuestions: number;
  totalLevels: number;
  loaded: boolean;
}) {
  const getLevelProgress = useProgressionStore((s) => s.getLevelProgress);
  const isLevelUnlocked = useProgressionStore((s) => s.isLevelUnlocked);
  const getThemeCrowns = useProgressionStore((s) => s.getThemeCrowns);

  const crowns = loaded ? getThemeCrowns(themeId, totalLevels) : { earned: 0, total: totalLevels * 3 };
  const completedLevels = loaded
    ? Array.from({ length: totalLevels }, (_, i) => getLevelProgress(themeId, i + 1).crowns >= 1).filter(Boolean).length
    : 0;

  return (
    <article className="card !rounded-3xl !p-6 sm:!p-7">
      <header className="flex items-start gap-4 mb-5">
        <div
          className="
            flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
            font-display text-2xl font-medium text-bone
            shadow-[0_2px_0_rgb(45_27_46)]
          "
          style={{ backgroundColor: themeColor, fontVariationSettings: "'opsz' 36" }}
          aria-hidden
        >
          {themeId}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl sm:text-2xl font-medium leading-tight" style={{ fontVariationSettings: "'opsz' 36" }}>
            {themeName}
          </h3>
          <p className="text-sm text-ink-mute mt-1">{description}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <CrownDisplay earned={crowns.earned} total={crowns.total} />
          <span className="text-xs text-ink-mute">
            {completedLevels} / {totalLevels} niveaux
          </span>
        </div>
      </header>

      {totalQuestions === 0 ? (
        <p className="text-sm text-ink-mute italic">
          Aucune question disponible pour cet examen.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-1 px-1 pb-2">
          <ol className="flex items-center gap-2 sm:gap-3">
            {Array.from({ length: totalLevels }, (_, i) => i + 1).map((levelNum) => (
              <LevelBubble
                key={levelNum}
                themeId={themeId}
                themeColor={themeColor}
                levelNum={levelNum}
                progress={loaded ? getLevelProgress(themeId, levelNum) : { themeId, levelNum, crowns: 0, bestScore: 0, attempts: 0 }}
                isUnlocked={loaded ? isLevelUnlocked(themeId, levelNum, totalLevels) : levelNum === 1}
                isLast={levelNum === totalLevels}
              />
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function LevelBubble({
  themeId,
  themeColor,
  levelNum,
  progress,
  isUnlocked,
  isLast,
}: {
  themeId: number;
  themeColor: string;
  levelNum: number;
  progress: { crowns: number; bestScore: number };
  isUnlocked: boolean;
  isLast: boolean;
}) {
  const isCompleted = progress.crowns >= 1;
  const bgColor = isCompleted ? themeColor : 'transparent';
  const borderColor = isUnlocked ? themeColor : 'rgb(45 27 46 / 0.20)';

  const inner = (
    <div className="flex flex-col items-center shrink-0">
      <div
        className={`
          relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center
          rounded-2xl border-[1.5px] transition-all
          ${isUnlocked ? 'hover:-translate-y-1' : ''}
          ${isCompleted ? 'shadow-[0_3px_0_rgb(45_27_46)]' : ''}
        `}
        style={{
          backgroundColor: bgColor,
          borderColor,
          opacity: isUnlocked ? 1 : 0.5,
        }}
      >
        {!isUnlocked ? (
          <svg className="h-5 w-5 text-aubergine/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.10457 0 2-.8954 2-2V7a2 2 0 10-4 0v2c0 1.1046.8954 2 2 2zm-3 0V7a3 3 0 116 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
          </svg>
        ) : (
          <span
            className={`
              font-display text-lg sm:text-xl font-medium
              ${isCompleted ? 'text-bone' : 'text-aubergine'}
            `}
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {levelNum}
          </span>
        )}
      </div>
      <div className="h-4 mt-1 flex items-center justify-center">
        {isUnlocked && progress.crowns > 0 ? <Stars count={progress.crowns} /> : null}
      </div>
    </div>
  );

  if (!isUnlocked) {
    return (
      <>
        <li>{inner}</li>
        {!isLast ? <Connector /> : null}
      </>
    );
  }

  return (
    <>
      <li>
        <Link
          href={`/app/train/${themeId}/${levelNum}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone rounded-2xl"
        >
          {inner}
        </Link>
      </li>
      {!isLast ? <Connector /> : null}
    </>
  );
}

function Connector() {
  return (
    <li className="shrink-0 mt-[-22px] sm:mt-[-24px]">
      <span className="block h-[1.5px] w-4 sm:w-6 bg-aubergine/15" aria-hidden />
    </li>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i <= count ? 'text-saffron' : 'text-aubergine/15'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

function CrownDisplay({ earned, total }: { earned: number; total: number }) {
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">👑</span>
      <span className="font-display font-semibold text-aubergine">
        {earned} <span className="text-ink-mute font-normal">/ {total}</span>
      </span>
      <span className="text-xs text-ink-mute">({pct}%)</span>
    </div>
  );
}
