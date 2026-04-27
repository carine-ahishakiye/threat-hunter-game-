import React from 'react'
import s from './Sidebar.module.css'

export default function Sidebar({ streak, accuracy, avgSpeed, feed }) {
  const spdWidth = avgSpeed ? `${Math.min(100, Math.max(0, 100-(avgSpeed/15)*100))}%` : '0%'
  return (
    <aside className={s.sidebar}>
      <div className={s.block}>
        <div className={s.label}>STREAK</div>
        <div className={s.streakNum}>{streak}</div>
        <div className={s.streakSub}>CONSECUTIVE KILLS</div>
        {streak >= 3 && <div className={s.mult}>{streak >= 5 ? '2× MULTIPLIER' : '1.5× MULTIPLIER'}</div>}
      </div>
      <div className={s.block}>
        <div className={s.label}>PERFORMANCE</div>
        <div className={s.row}><span>HIT RATE</span><span className={s.val}>{accuracy}%</span></div>
        <div className={s.barWrap}><div className={s.bar} style={{width:`${accuracy}%`,background:'var(--green)'}} /></div>
        <div className={s.row}><span>AVG SPEED</span><span className={s.val}>{avgSpeed ? `${avgSpeed}s` : '--'}</span></div>
        <div className={s.barWrap}><div className={s.bar} style={{width:spdWidth,background:'var(--blue)'}} /></div>
      </div>
      <div className={`${s.block} ${s.feedBlock}`}>
        <div className={s.label}>EVENT LOG</div>
        <div className={s.feed}>
          {feed.length === 0 && <div className={s.empty}>awaiting events...</div>}
          {feed.map(item => (
            <div key={item.id} className={`${s.item} ${s[item.type]}`}>
              <span className={s.icon}>{item.type==='good'?'▶':item.type==='bad'?'✕':'~'}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}