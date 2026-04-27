import { useState, useEffect, useRef, useCallback } from 'react'
import { THREATS, DIFF_CONFIG } from './threats'

const RANKS = [
  { min: 5000, label: 'ELITE OPERATOR',  color: '#00ff88' },
  { min: 3000, label: 'SENIOR ANALYST',  color: '#00ccff' },
  { min: 1500, label: 'THREAT ANALYST',  color: '#ffcc00' },
  { min: 500,  label: 'JUNIOR ANALYST',  color: '#ff8c00' },
  { min: 0,    label: 'SECURITY INTERN', color: '#ff3355' },
]

export function getRank(score) {
  return RANKS.find(r => score >= r.min) || RANKS[RANKS.length - 1]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useGameState() {
  const [screen, setScreen]         = useState('start')
  const [diff, setDiff]             = useState('OPERATOR')
  const [score, setScore]           = useState(0)
  const [lives, setLives]           = useState(3)
  const [timeLeft, setTimeLeft]     = useState(60)
  const [round, setRound]           = useState(0)
  const [streak, setStreak]         = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [hits, setHits]             = useState(0)
  const [misses, setMisses]         = useState(0)
  const [total, setTotal]           = useState(0)
  const [threat, setThreat]         = useState(null)
  const [options, setOptions]       = useState([])
  const [answered, setAnswered]     = useState(false)
  const [selected, setSelected]     = useState(null)
  const [qProgress, setQProgress]   = useState(1)
  const [feed, setFeed]             = useState([])
  const [feedback, setFeedback]     = useState(null)
  const [speedList, setSpeedList]   = useState([])
  const [avgSpeed, setAvgSpeed]     = useState(null)

  const mainTimerRef = useRef(null)
  const qTimerRef    = useRef(null)
  const usedRef      = useRef([])
  const qStartRef    = useRef(0)
  const stateRef     = useRef({})

  stateRef.current = { lives, score, streak, hits, misses, total, diff, speedList, bestStreak, answered }

  const addFeed = useCallback((type, text) => {
    setFeed(f => [{ type, text, id: Date.now() }, ...f].slice(0, 10))
  }, [])

  const showFeedback = useCallback((text, color) => {
    setFeedback({ text, color, key: Date.now() })
    setTimeout(() => setFeedback(null), 800)
  }, [])

  const endGame = useCallback(() => {
    clearInterval(mainTimerRef.current)
    clearInterval(qTimerRef.current)
    setScreen('over')
  }, [])

  const loadNextThreat = useCallback(() => {
    clearInterval(qTimerRef.current)
    setAnswered(false)
    setSelected(null)
    setQProgress(1)

    if (usedRef.current.length >= THREATS.length) usedRef.current = []
    let idx
    do { idx = Math.floor(Math.random() * THREATS.length) }
    while (usedRef.current.includes(idx))
    usedRef.current.push(idx)

    const t = THREATS[idx]
    setThreat(t)
    setOptions(shuffle(t.options))
    setRound(r => r + 1)

    const cfg = DIFF_CONFIG[stateRef.current.diff]
    qStartRef.current = Date.now()
    let elapsed = 0

    qTimerRef.current = setInterval(() => {
      if (stateRef.current.answered) return
      elapsed += 100
      setQProgress(Math.max(0, 1 - elapsed / (cfg.qTime * 1000)))
      if (elapsed >= cfg.qTime * 1000) {
        clearInterval(qTimerRef.current)
        if (!stateRef.current.answered) handleTimeout()
      }
    }, 100)
  }, [])

  const handleTimeout = useCallback(() => {
    if (stateRef.current.answered) return
    setAnswered(true)
    const newLives = stateRef.current.lives - 1
    setLives(newLives)
    setStreak(0)
    setMisses(m => m + 1)
    setTotal(t => t + 1)
    showFeedback('TIMEOUT', 'var(--yellow)')
    addFeed('miss', '[~] TIMEOUT — threat breached perimeter')
    if (newLives <= 0) { setTimeout(endGame, 700); return }
    setTimeout(loadNextThreat, 1100)
  }, [addFeed, endGame, loadNextThreat, showFeedback])

  const answer = useCallback((choice) => {
    if (stateRef.current.answered) return
    setAnswered(true)
    clearInterval(qTimerRef.current)
    const elapsed = (Date.now() - qStartRef.current) / 1000
    const cfg = DIFF_CONFIG[stateRef.current.diff]

    setThreat(currentThreat => {
      const correct = choice === currentThreat.correct
      setSelected({ choice, correct })
      setTotal(t => t + 1)
      if (correct) {
        const newStreak = stateRef.current.streak + 1
        setStreak(newStreak)
        setBestStreak(b => Math.max(b, newStreak))
        setHits(h => h + 1)
        const speedBonus = Math.max(0, Math.floor((cfg.qTime - elapsed) * 10))
        const mult = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1
        setScore(s => s + Math.floor((100 + speedBonus) * mult))
        setSpeedList(sl => [...sl, elapsed])
        showFeedback(`+${Math.floor((100 + speedBonus) * mult)}`, 'var(--green)')
        addFeed('good', `[+] NEUTRALIZED — ${currentThreat.type}`)
      } else {
        const newLives = stateRef.current.lives - 1
        setLives(newLives)
        setStreak(0)
        setMisses(m => m + 1)
        showFeedback('BREACH', 'var(--red)')
        addFeed('bad', `[!] BREACH — wrong call on ${currentThreat.type}`)
        if (newLives <= 0) { setTimeout(endGame, 800); return currentThreat }
      }
      setTimeout(loadNextThreat, 1200)
      return currentThreat
    })
  }, [addFeed, endGame, loadNextThreat, showFeedback])

  const startGame = useCallback(() => {
    const cfg = DIFF_CONFIG[diff]
    usedRef.current = []
    clearInterval(mainTimerRef.current)
    clearInterval(qTimerRef.current)
    setScore(0); setLives(cfg.lives); setRound(0); setStreak(0)
    setBestStreak(0); setHits(0); setMisses(0); setTotal(0)
    setTimeLeft(cfg.time); setFeed([]); setSpeedList([])
    setScreen('game')
    loadNextThreat()
    let t = cfg.time
    mainTimerRef.current = setInterval(() => {
      t--
      setTimeLeft(t)
      if (t <= 0) endGame()
    }, 1000)
  }, [diff, endGame, loadNextThreat])

  useEffect(() => {
    if (speedList.length === 0) { setAvgSpeed(null); return }
    setAvgSpeed((speedList.reduce((a, b) => a + b, 0) / speedList.length).toFixed(1))
  }, [speedList])

  const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0

  return {
    screen, diff, score, lives, timeLeft, round, streak, bestStreak,
    hits, misses, total, threat, options, answered, selected,
    qProgress, feed, feedback, avgSpeed, accuracy,
    diffConfig: DIFF_CONFIG[diff],
    setDiff, startGame, answer, setScreen,
    restartGame: startGame,
  }
}