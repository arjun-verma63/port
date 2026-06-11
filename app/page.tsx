'use client';

import dynamic from 'next/dynamic';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { AnimatePresence, motion } from 'framer-motion';

const UnlockScreen = dynamic(
  () => import('@/components/unlock/UnlockScreen'),
  { ssr: false }
);

const MainPortfolio = dynamic(
  () => import('@/components/MainPortfolio'),
  { ssr: false }
);

import CustomCursor from '@/components/ui/CustomCursor';

export default function Home() {
  const isUnlocked = usePortfolioStore((state) => state.isUnlocked);

  return (
    <main>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="unlock"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UnlockScreen />
          </motion.div>
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <MainPortfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
