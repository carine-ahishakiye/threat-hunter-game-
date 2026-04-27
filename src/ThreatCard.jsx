import React from 'react'
import s from './ThreatCard.module.css'

const SEV = { CRITICAL: s.critical, HIGH: s.high, MEDIUM: s.medium, LOW: s.low }

export default function ThreatCard({ threat, options, qProgress, answered, selected, onAnswer }) {
  if (!threat) return null
  const barColor = qProgress > 0.5 ? 'var(--green)' : qProgress > 0.25 ? 'var(--yellow)' : 'var(--red)'
  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.type}>{threat.type}</div>
        <div className={`${s.badge} ${SEV[threat.severity]}`}>{threat.severity}</div>
      </div>
      <div className={s.dataGrid}>
        {threat.data.map((r,i) => (
          <div key={i} className={s.row}><span className={s.dl}>{r.label}</span><span className={s.dv}>{r.value}</span></div>
        ))}
      </div>
      <div className={s.logs}>{threat.logs.map((l,i) => <div key={i} className={s.log}>{l}</div>)}</div>
      <div className={s.timerWrap}><div className={s.timerBar} style={{ width:`${qProgress*100}%`, background:barColor }} /></div>
      <div className={s.choices}>
        {options.map((opt,i) => {
          let cls = s.btn
          if (answered) {
            if (opt === threat.correct) cls += ' ' + s.correct
            else if (selected?.choice === opt) cls += ' ' + s.wrong
            else cls += ' ' + s.dimmed
          }
          return (
            <button key={i} className={cls} onClick={() => !answered && onAnswer(opt)} disabled={answered}>
              <span className={s.key}>{String.fromCharCode(65+i)}</span>{opt}
            </button>
          )
        })}
      </div>
      {answered && selected && (
        <div className={`${s.exp} ${selected.correct ? s.expOk : s.expBad}`}>
          <span>{selected.correct ? '✔' : '✘'}</span> {threat.explanation}
        </div>
      )}
    </div>
  )
}