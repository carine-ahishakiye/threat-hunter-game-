import React from 'react'
import s from './StartScreen.module.css'
import { DIFF_CONFIG } from './threats'

export default function StartScreen({ diff, setDiff, onStart }) {
  return (
    <div className={s.screen}>
      <div className={s.tag}>ANTHROPIC SECURITY OPS // v2.4.1</div>
      <div className={s.title}><span>THREAT</span><span className={s.dim}> HUNTER</span></div>
      <div className={s.sub}>Classify cyberattacks before they breach the perimeter.<br/>Analyze logs. Identify vectors. Respond correctly.</div>
      <div className={s.diffLabel}>SELECT DIFFICULTY</div>
      <div className={s.diffRow}>
        {Object.entries(DIFF_CONFIG).map(([key, cfg]) => (
          <button key={key} className={`${s.diffBtn} ${diff===key ? s.active : ''}`}
            style={diff===key ? {borderColor:cfg.color,color:cfg.color} : {}} onClick={() => setDiff(key)}>
            <div className={s.diffName}>{key}</div>
            <div className={s.diffInfo}>{cfg.time}s · {cfg.qTime}s/Q · {cfg.lives} lives</div>
          </button>
        ))}
      </div>
      <button className={s.startBtn} onClick={onStart}>[ INITIALIZE HUNT ]</button>
      <div className={s.hint}>base 100pts + speed bonus · streak multiplier up to 2×</div>
    </div>
  )
}