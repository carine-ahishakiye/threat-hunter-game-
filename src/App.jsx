import React from 'react'
import styles from './App.module.css'
import { useGameState } from './useGameState'
import { DIFF_CONFIG } from './threats'
import HUD          from './HUD'
import ThreatCard   from './ThreatCard'
import Sidebar      from './Sidebar'
import StartScreen  from './StartScreen'
import GameOver     from './GameOver'

export default function App() {
  const g = useGameState()
  return (
    <div className={styles.app}>
      <div className={styles.scanline} />
      <div className={styles.gridBg} />
      {g.feedback && (
        <div key={g.feedback.key} className={styles.feedback} style={{ color: g.feedback.color }}>
          {g.feedback.text}
        </div>
      )}
      {g.screen === 'start' && <StartScreen diff={g.diff} setDiff={g.setDiff} onStart={g.startGame} />}
      {g.screen === 'over'  && (
        <GameOver
          score={g.score} hits={g.hits} misses={g.misses}
          bestStreak={g.bestStreak} accuracy={g.accuracy}
          avgSpeed={g.avgSpeed} diff={g.diff} onRestart={g.restartGame}
        />
      )}
      {g.screen === 'game' && (
        <>
          <HUD score={g.score} timeLeft={g.timeLeft} lives={g.lives} round={g.round} maxLives={DIFF_CONFIG[g.diff].lives} />
          <div className={styles.main}>
            <div className={styles.threatPanel}>
              <div className={styles.sectionLabel}>INCOMING THREAT</div>
              <ThreatCard
                threat={g.threat} options={g.options} qProgress={g.qProgress}
                answered={g.answered} selected={g.selected} onAnswer={g.answer}
              />
            </div>
            <Sidebar streak={g.streak} accuracy={g.accuracy} avgSpeed={g.avgSpeed} feed={g.feed} />
          </div>
        </>
      )}
    </div>
  )
}