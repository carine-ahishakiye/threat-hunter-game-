import React from 'react'
import styles from './HUD.module.css'

export default function HUD({ score, timeLeft, lives, round, maxLives }) {
  const life = Array.from({ length: maxLives }, (_, i) => i < lives)
  const cls  = timeLeft <= 10 ? styles.danger : timeLeft <= 20 ? styles.warn : styles.ok
  return (
    <header className={styles.hud}>
      <div className={styles.logo}><span>THREAT</span><span className={styles.dim}> HUNTER</span></div>
      <div className={styles.stat}><div className={styles.label}>SCORE</div><div className={`${styles.value} ${styles.ok}`}>{score.toLocaleString()}</div></div>
      <div className={styles.stat}><div className={styles.label}>TIMER</div><div className={`${styles.value} ${cls}`}>{timeLeft}</div></div>
      <div className={styles.stat}>
        <div className={styles.label}>LIVES</div>
        <div className={styles.lives}>{life.map((a,i) => <span key={i} className={a ? styles.on : styles.off}>■</span>)}</div>
      </div>
      <div className={styles.stat}><div className={styles.label}>ROUND</div><div className={`${styles.value} ${styles.ok}`}>{round}</div></div>
    </header>
  )
}