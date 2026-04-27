import React from 'react'
import s from './GameOver.module.css'
import { getRank } from './useGameState'

export default function GameOver({ score, hits, misses, bestStreak, accuracy, avgSpeed, onRestart, diff }) {
  const rank = getRank(score)
  return (
    <div className={s.screen}>
      <div className={s.tag}>MISSION DEBRIEF</div>
      <div className={s.rank} style={{color:rank.color}}>{rank.label}</div>
      <div className={s.scoreNum}>{score.toLocaleString()}</div>
      <div className={s.scoreLbl}>THREAT SCORE</div>
      <div className={s.grid}>
        <div className={s.stat}><div className={s.sv} style={{color:'var(--green)'}}>{hits}</div><div className={s.sl}>NEUTRALIZED</div></div>
        <div className={s.stat}><div className={s.sv} style={{color:'var(--red)'}}>{misses}</div><div className={s.sl}>BREACHED</div></div>
        <div className={s.stat}><div className={s.sv} style={{color:'var(--yellow)'}}>{bestStreak}</div><div className={s.sl}>BEST STREAK</div></div>
        <div className={s.stat}><div className={s.sv} style={{color:'var(--blue)'}}>{accuracy}%</div><div className={s.sl}>ACCURACY</div></div>
        <div className={s.stat}><div className={s.sv} style={{color:'var(--orange)'}}>{avgSpeed ? `${avgSpeed}s` : '--'}</div><div className={s.sl}>AVG SPEED</div></div>
        <div className={s.stat}><div className={s.sv}>{diff}</div><div className={s.sl}>DIFFICULTY</div></div>
      </div>
      <button className={s.btn} onClick={onRestart}>[ RUN AGAIN ]</button>
    </div>
  )
}