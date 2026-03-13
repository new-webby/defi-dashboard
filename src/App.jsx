import { useState, useEffect, useRef } from 'react'
import './index.css'

const ETH_TOKENS = [
  { symbol: 'ETH',  name: 'Ethereum',       balance: '4.821',    value: '$17,284', change: '+2.4%',  up: true  },
  { symbol: 'USDC', name: 'USD Coin',        balance: '3,420.00', value: '$3,420',  change: '0.0%',   up: null  },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.142',    value: '$9,104',  change: '+1.8%',  up: true  },
  { symbol: 'UNI',  name: 'Uniswap',         balance: '210.5',    value: '$842',    change: '-0.9%',  up: false },
]
const MULTI_TOKENS = [
  { symbol: 'ETH',  name: 'Ethereum',       balance: '4.821',    value: '$17,284', change: '+2.4%',  up: true,  chain: 'ethereum' },
  { symbol: 'SOL',  name: 'Solana',         balance: '84.2',     value: '$11,230', change: '+5.1%',  up: true,  chain: 'solana'   },
  { symbol: 'USDC', name: 'USD Coin',        balance: '3,420.00', value: '$3,420',  change: '0.0%',   up: null,  chain: 'ethereum' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.142',    value: '$9,104',  change: '+1.8%',  up: true,  chain: 'ethereum' },
  { symbol: 'ATOM', name: 'Cosmos',          balance: '320.0',    value: '$2,144',  change: '+3.2%',  up: true,  chain: 'cosmos'   },
  { symbol: 'APT',  name: 'Aptos',           balance: '150.0',    value: '$1,050',  change: '-1.2%',  up: false, chain: 'aptos'    },
  { symbol: 'UNI',  name: 'Uniswap',         balance: '210.5',    value: '$842',    change: '-0.9%',  up: false, chain: 'ethereum' },
]
const ETH_TXS = [
  { hash: '0x9e621f...a8a9', to: '0xA0b8...6e48',   amount: '1.24 ETH',  time: '2m ago',  type: 'send',    status: 'success', chain: 'ethereum' },
  { hash: '0x4f2b8c...1b2c', to: 'Uniswap V3',      amount: '500 USDC',  time: '8m ago',  type: 'swap',    status: 'success', chain: 'ethereum' },
  { hash: '0xab1234...9876', to: 'Aave Pool',        amount: '2.5 ETH',   time: '15m ago', type: 'deposit', status: 'success', chain: 'ethereum' },
  { hash: '0x7c9d3f...4e5f', to: '0x9876fe...dcba',  amount: '0.08 ETH',  time: '31m ago', type: 'send',    status: 'success', chain: 'ethereum' },
  { hash: '0x2e5f8b...3a7e', to: 'Compound V2',      amount: '1000 DAI',  time: '52m ago', type: 'deposit', status: 'failed',  chain: 'ethereum' },
]
const MULTI_TXS = [
  { hash: '0x9e621f...a8a9', to: '0xA0b8...6e48',   amount: '1.24 ETH',  time: '2m ago',  type: 'send',    status: 'success', chain: 'ethereum' },
  { hash: '5ZvGTs...sY1t',   to: '9WzDX5...kPn',    amount: '42 SOL',    time: '4m ago',  type: 'send',    status: 'success', chain: 'solana'   },
  { hash: '0x4f2b8c...1b2c', to: 'Uniswap V3',      amount: '500 USDC',  time: '8m ago',  type: 'swap',    status: 'success', chain: 'ethereum' },
  { hash: 'A1B2C3...A1B2',   to: 'cosmos1...4nkp',  amount: '120 ATOM',  time: '13m ago', type: 'send',    status: 'success', chain: 'cosmos'   },
  { hash: '0xab1234...9876', to: 'Aave Pool',        amount: '2.5 ETH',   time: '15m ago', type: 'deposit', status: 'success', chain: 'ethereum' },
  { hash: '0xabcdef...90ab', to: '0x7e8f9a...1b2c',  amount: '300 APT',   time: '22m ago', type: 'send',    status: 'success', chain: 'aptos'    },
]
const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', color: '#627eea', encoding: 'ABI'      },
  { id: 'solana',   name: 'Solana',   color: '#9945ff', encoding: 'Borsh'    },
  { id: 'cosmos',   name: 'Cosmos',   color: '#6f7bf7', encoding: 'Protobuf' },
  { id: 'aptos',    name: 'Aptos',    color: '#00d4aa', encoding: 'BCS'      },
]
const INSTALL_LINES = [
  { text: '$ npm install chainmerge-sdk',                    cls: 'tl-cmd' },
  { text: '',                                                 cls: ''       },
  { text: 'npm warn deprecated glob@7.2.3',                  cls: 'tl-dim' },
  { text: 'added 1 package, audited 312 packages in 1.8s',   cls: 'tl-dim' },
  { text: '',                                                 cls: ''       },
  { text: 'Initializing chainmerge-sdk v0.1.0...',           cls: 'tl-txt' },
  { text: '  registering: ethereum  (ABI encoding)',          cls: 'tl-txt' },
  { text: '  registering: solana    (Borsh encoding)',        cls: 'tl-txt' },
  { text: '  registering: cosmos    (Protobuf encoding)',     cls: 'tl-txt' },
  { text: '  registering: aptos     (BCS encoding)',          cls: 'tl-txt' },
  { text: '',                                                 cls: ''       },
  { text: '✓ chainmerge-sdk ready — 4 chains active',        cls: 'tl-ok'  },
]
const TOKEN_ICONS = { ETH: '⟠', SOL: '◎', USDC: '$', WBTC: '₿', ATOM: '⚛', APT: '▲', UNI: '🦄' }
const TYPE_ICON   = { send: '↑', swap: '⇄', deposit: '↓' }
const TYPE_COLOR  = { send: '#f87171', swap: '#fbbf24', deposit: '#34d399' }

export default function App() {
  // ── top-level state only ────────────────────────────────────────
  const [phase,        setPhase]        = useState('eth')        // 'eth' | 'modal' | 'multi'
  const [activePage,   setActivePage]   = useState('portfolio')  // 'portfolio' | 'swap' | 'history'
  const [termLines,    setTermLines]    = useState([])
  const [termDone,     setTermDone]     = useState(false)
  const [activeTab,    setActiveTab]    = useState('all')
  const [decodeChain,  setDecodeChain]  = useState('ethereum')
  const [decodeHash,   setDecodeHash]   = useState('')
  const [decoding,     setDecoding]     = useState(false)
  const [decodeResult, setDecodeResult] = useState(null)
  const [decodeError,  setDecodeError]  = useState(null)
  const termRef  = useRef(null)
  const timerRef = useRef(null)

  const sdkActive      = phase === 'multi'
  const tokens         = sdkActive ? MULTI_TOKENS : ETH_TOKENS
  const availChains    = sdkActive ? CHAINS : [CHAINS[0]]
  const txs            = sdkActive
    ? (activeTab === 'all' ? MULTI_TXS : MULTI_TXS.filter(t => t.chain === activeTab))
    : ETH_TXS

  // ── start install ───────────────────────────────────────────────
  function openModal() {
    setTermLines([])
    setTermDone(false)
    setPhase('modal')
  }

  // ── terminal animation — runs when modal opens ──────────────────
  useEffect(() => {
    if (phase !== 'modal') return
    let i = 0
    timerRef.current = setInterval(() => {
      if (i < INSTALL_LINES.length) {
        const line = INSTALL_LINES[i]
        setTermLines(prev => [...prev, line])
        i++
      } else {
        clearInterval(timerRef.current)
        setTermDone(true)
      }
    }, 180)
    return () => clearInterval(timerRef.current)
  }, [phase])

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [termLines])

  // ── confirm → switch to multi ───────────────────────────────────
  function confirmInstall() {
    setPhase('multi')
    setActiveTab('all')
  }

  // ── decode ──────────────────────────────────────────────────────
  async function onDecode() {
    const hash = decodeHash.trim()
    if (!hash) return
    setDecoding(true)
    setDecodeResult(null)
    setDecodeError(null)
    try {
      const res  = await fetch(`http://localhost:3000/api/decode?chain=${decodeChain}&hash=${encodeURIComponent(hash)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setDecodeResult(data)
    } catch (err) {
      setDecodeError(err.message)
    } finally {
      setDecoding(false)
    }
  }

  const dcMeta = CHAINS.find(c => c.id === decodeChain)

  return (
    <div className="page">

      {/* ── Modal overlay ── */}
      {phase === 'modal' && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-titlebar">
              <div className="mac-dots">
                <span className="mac-r" />
                <span className="mac-y" />
                <span className="mac-g" />
              </div>
              <span className="modal-title">chainmerge-sdk — install</span>
              <span />
            </div>
            <div className="modal-meta">
              <span className="mm-key">package</span>
              <a href="https://pypi.org/project/chainmerge-sdk/" target="_blank" rel="noreferrer" className="mm-val">
                chainmerge-sdk @ pypi.org ↗
              </a>
            </div>
            <div className="term" ref={termRef}>
              {termLines.map((l, i) => (
                <div key={i} className={'tl ' + l.cls}>{l.text || '\u00a0'}</div>
              ))}
              {!termDone && <span className="tcursor" />}
            </div>
            {termDone && (
              <div className="modal-done">
                <div className="done-chains">
                  {CHAINS.map(c => (
                    <span key={c.id} className="done-chip"
                      style={{ color: c.color, borderColor: c.color + '40', background: c.color + '0e' }}>
                      <span className="done-dot" style={{ background: c.color }} />
                      {c.name}
                    </span>
                  ))}
                </div>
                <button className="done-btn" onClick={confirmInstall}>
                  Open multichain dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="tb-inner">
          <div className="tb-left">
            <div className="tb-logo">Meridian</div>
            <nav className="tb-nav">
              <span
                className={'tb-nl' + (activePage === 'portfolio' ? ' active' : '')}
                onClick={() => setActivePage('portfolio')}
              >
                Portfolio
              </span>
              <span
                className={'tb-nl' + (activePage === 'swap' ? ' active' : '')}
                onClick={() => setActivePage('swap')}
              >
                Swap
              </span>
              <span
                className={'tb-nl' + (activePage === 'history' ? ' active' : '')}
                onClick={() => setActivePage('history')}
              >
                History
              </span>
            </nav>
          </div>
          <div className="tb-right">
            <div className="tb-wallet"><span className="tb-wdot" />0xd8dA…6045</div>
            {phase === 'eth' && (
              <button className="btn-add" onClick={openModal}>⊕ Add multichain support</button>
            )}
            {phase === 'modal' && (
              <button className="btn-add busy" disabled><span className="spin-xs" />installing…</button>
            )}
            {phase === 'multi' && (
              <div className="badge-on"><span className="badge-dot" />chainmerge-sdk</div>
            )}
          </div>
        </div>
      </header>

      {/* ── Portfolio header ── */}
      <div className="port-header">
        <div className="ph-inner">
          <div>
            {activePage === 'portfolio' && (
              <>
                <div className="ph-label">{sdkActive ? 'Total portfolio' : 'Ethereum portfolio'}</div>
                <div className="ph-total">{sdkActive ? '$44,074' : '$30,650'}</div>
                <div className="ph-change">{sdkActive ? '+$1,842 (4.4%)' : '+$642 (2.1%)'} today</div>
              </>
            )}
            {activePage === 'swap' && (
              <>
                <div className="ph-label">Swap</div>
                <div className="ph-total">Cross-chain token routing</div>
                <div className="ph-change">Simulated flows · no funds move</div>
              </>
            )}
            {activePage === 'history' && (
              <>
                <div className="ph-label">History</div>
                <div className="ph-total">Unified transaction log</div>
                <div className="ph-change">
                  {sdkActive ? 'Across Ethereum, Solana, Cosmos, Aptos' : 'Ethereum only · add more chains'}
                </div>
              </>
            )}
          </div>
          <div className="ph-right">
            {sdkActive
              ? CHAINS.map(c => (
                  <div key={c.id} className="ph-pill"
                    style={{ borderColor: c.color + '40', background: c.color + '0d' }}>
                    <span className="ph-dot" style={{ background: c.color }} />
                    <span style={{ color: c.color, fontSize: 11, fontWeight: 500 }}>{c.name}</span>
                  </div>
                ))
              : <div className="ph-eth">Ethereum only · <button className="ph-add" onClick={openModal}>add more chains →</button></div>
            }
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="content">
        {activePage === 'portfolio' && (
          <>
            <div className="left-col">

              {/* Holdings */}
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Holdings</span>
                  <span className="card-count">{tokens.length} assets</span>
                </div>
                {tokens.map((t, i) => {
                  const ch = CHAINS.find(c => c.id === t.chain)
                  return (
                    <div key={i} className="tok-row">
                      <div className="tok-ico">{TOKEN_ICONS[t.symbol] || t.symbol[0]}</div>
                      <div className="tok-info">
                        <div className="tok-name">{t.name}</div>
                        <div className="tok-bal">{t.balance} {t.symbol}</div>
                      </div>
                      {sdkActive && ch && (
                        <div className="tok-chain"
                          style={{ color: ch.color, background: ch.color + '12', borderColor: ch.color + '35' }}>
                          {ch.name}
                        </div>
                      )}
                      <div className="tok-right">
                        <div className="tok-val">{t.value}</div>
                        <div className={'tok-chg' + (t.up === true ? ' up' : t.up === false ? ' dn' : '')}>{t.change}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Transactions */}
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Transactions</span>
                  {sdkActive && (
                    <div className="ctabs">
                      {[{ id: 'all', name: 'All', color: '#718096' }, ...CHAINS].map(c => (
                        <button key={c.id}
                          className={'ctab' + (activeTab === c.id ? ' on' : '')}
                          style={activeTab === c.id && c.id !== 'all'
                            ? { color: c.color, borderColor: c.color + '50', background: c.color + '0d' } : {}}
                          onClick={() => setActiveTab(c.id)}>
                          {c.id !== 'all' && <span className="ctab-dot" style={{ background: c.color }} />}
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {txs.map((tx, i) => {
                  const ch = CHAINS.find(c => c.id === tx.chain)
                  return (
                    <div key={i} className="tx-row">
                      <div className="tx-ico"
                        style={{ color: TYPE_COLOR[tx.type], background: TYPE_COLOR[tx.type] + '15' }}>
                        {TYPE_ICON[tx.type] || '·'}
                      </div>
                      <div className="tx-info">
                        <div className="tx-top">
                          <span className="tx-type">{tx.type}</span>
                          {sdkActive && ch && (
                            <span className="tx-badge"
                              style={{ color: ch.color, background: ch.color + '12', borderColor: ch.color + '35' }}>
                              {ch.name}
                            </span>
                          )}
                          <span className={'tx-st ' + tx.status}>{tx.status}</span>
                          <span className="tx-time">{tx.time}</span>
                        </div>
                        <div className="tx-sub">
                          <span className="tx-hash">{tx.hash}</span>
                          <span className="tx-sep">·</span>
                          <span className="tx-to">to {tx.to}</span>
                        </div>
                      </div>
                      <div className="tx-amt">{tx.amount}</div>
                    </div>
                  )
                })}
                {!sdkActive && (
                  <div className="card-foot">
                    Showing Ethereum only ·
                    <button className="foot-link" onClick={openModal}>Add multichain →</button>
                  </div>
                )}
              </div>

            </div>

            {/* Decoder */}
            <div className="right-col">
              <div className="card">
                <div className="card-head"><span className="card-title">Decode Transaction</span></div>
                <div className="dec-body">

                  <div className="field">
                    <div className="field-lbl">chain</div>
                    <div className="cpick-grid">
                      {availChains.map(c => (
                        <button key={c.id}
                          className={'cpick' + (decodeChain === c.id ? ' sel' : '')}
                          style={decodeChain === c.id
                            ? { borderColor: c.color, background: c.color + '10', color: c.color } : {}}
                          onClick={() => { setDecodeChain(c.id); setDecodeResult(null); setDecodeError(null) }}>
                          <span className="cpick-dot" style={{ background: c.color }} />
                          {c.name}
                        </button>
                      ))}
                      {!sdkActive && (
                        <div className="cpick-lock" onClick={openModal}>
                          <span>🔒</span><span>install SDK to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <div className="field-lbl">transaction hash</div>
                    <input className="hash-in" placeholder="paste tx hash..."
                      value={decodeHash}
                      onChange={e => { setDecodeHash(e.target.value); setDecodeError(null) }}
                      onKeyDown={e => e.key === 'Enter' && onDecode()} />
                  </div>

                  <button className={'dec-btn' + (decoding ? ' busy' : '')}
                    disabled={!decodeHash.trim() || decoding}
                    style={dcMeta && decodeHash.trim()
                      ? { borderColor: dcMeta.color + '40', background: dcMeta.color + '08', color: dcMeta.color } : {}}
                    onClick={onDecode}>
                    {decoding
                      ? <><span className="spin" />decoding…</>
                      : `Decode${dcMeta ? ' on ' + dcMeta.name : ''}`}
                  </button>

                  {sdkActive && (
                    <div className="sdk-note">powered by <span>chainmerge-sdk</span> · {dcMeta?.encoding}</div>
                  )}

                  {decodeError && (
                    <div className="err-box">
                      <div className="err-t">Failed</div>
                      <div className="err-m">{decodeError}</div>
                      <div className="err-h">Make sure ChainMerge API is running on :3000</div>
                    </div>
                  )}

                  {decodeResult && (
                    <div className="res-box">
                      <div className="res-head">
                        <span className="res-chain" style={{ color: CHAINS.find(c => c.id === decodeResult.chain)?.color }}>
                          {CHAINS.find(c => c.id === decodeResult.chain)?.name || decodeResult.chain}
                        </span>
                        <span className={'res-st ' + (decodeResult.status === 'success' ? 'ok' : 'fail')}>
                          {decodeResult.status}
                        </span>
                      </div>
                      <div className="res-rows">
                        {decodeResult.tx_hash  && <div className="res-row"><span className="rk">hash</span>  <span className="rv">{decodeResult.tx_hash.slice(0,18)}…</span></div>}
                        {decodeResult.sender   && <div className="res-row"><span className="rk">from</span>  <span className="rv">{decodeResult.sender.slice(0,14)}…</span></div>}
                        {decodeResult.receiver && <div className="res-row"><span className="rk">to</span>    <span className="rv">{decodeResult.receiver.slice(0,14)}…</span></div>}
                        {decodeResult.fee      && <div className="res-row"><span className="rk">fee</span>   <span className="rv">{decodeResult.fee.amount} {decodeResult.fee.symbol}</span></div>}
                        <div className="res-row"><span className="rk">events</span><span className="rv">{decodeResult.events?.length || 0} decoded</span></div>
                      </div>
                      <pre className="res-raw">{JSON.stringify(decodeResult, null, 2)}</pre>
                    </div>
                  )}

                  {!sdkActive && !decodeResult && !decodeError && (
                    <div className="dec-note">Install chainmerge-sdk to unlock Solana, Cosmos, Aptos and more.</div>
                  )}

                </div>
              </div>
            </div>
          </>
        )}

        {activePage === 'swap' && (
          <>
            <div className="left-col">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Swap</span>
                  <span className="card-count">{sdkActive ? 'Multichain routing' : 'Ethereum only'}</span>
                </div>
                <div className="dec-body">
                  <div className="field">
                    <div className="field-lbl">from chain</div>
                    <div className="cpick-grid">
                      {availChains.map(c => (
                        <button
                          key={c.id}
                          className="cpick"
                          style={{ borderColor: c.color + '50', background: c.color + '08', color: c.color }}
                        >
                          <span className="cpick-dot" style={{ background: c.color }} />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <div className="field-lbl">amount</div>
                    <input className="hash-in" placeholder="0.00" />
                  </div>
                  <div className="field">
                    <div className="field-lbl">to token</div>
                    <input className="hash-in" placeholder="Select token…" />
                  </div>
                  <button className="dec-btn" disabled>
                    Preview route (demo only)
                  </button>
                  {!sdkActive && (
                    <div className="dec-note">
                      Install chainmerge-sdk to simulate realistic cross-chain swap paths.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Recent swaps</span>
                  <span className="card-count">{txs.filter(t => t.type === 'swap').length} sample routes</span>
                </div>
                {txs.filter(t => t.type === 'swap').map((tx, i) => {
                  const ch = CHAINS.find(c => c.id === tx.chain)
                  return (
                    <div key={i} className="tx-row">
                      <div className="tx-ico"
                        style={{ color: TYPE_COLOR[tx.type], background: TYPE_COLOR[tx.type] + '15' }}>
                        {TYPE_ICON[tx.type] || '·'}
                      </div>
                      <div className="tx-info">
                        <div className="tx-top">
                          <span className="tx-type">swap</span>
                          {sdkActive && ch && (
                            <span className="tx-badge"
                              style={{ color: ch.color, background: ch.color + '12', borderColor: ch.color + '35' }}>
                              {ch.name}
                            </span>
                          )}
                          <span className={'tx-st ' + tx.status}>{tx.status}</span>
                          <span className="tx-time">{tx.time}</span>
                        </div>
                        <div className="tx-sub">
                          <span className="tx-hash">{tx.hash}</span>
                          <span className="tx-sep">·</span>
                          <span className="tx-to">to {tx.to}</span>
                        </div>
                      </div>
                      <div className="tx-amt">{tx.amount}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {activePage === 'history' && (
          <>
            <div className="left-col">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Activity</span>
                  <span className="card-count">
                    {sdkActive ? 'All chains' : 'Ethereum only'}
                  </span>
                </div>
                {txs.map((tx, i) => {
                  const ch = CHAINS.find(c => c.id === tx.chain)
                  return (
                    <div key={i} className="tx-row">
                      <div className="tx-ico"
                        style={{ color: TYPE_COLOR[tx.type], background: TYPE_COLOR[tx.type] + '15' }}>
                        {TYPE_ICON[tx.type] || '·'}
                      </div>
                      <div className="tx-info">
                        <div className="tx-top">
                          <span className="tx-type">{tx.type}</span>
                          {sdkActive && ch && (
                            <span className="tx-badge"
                              style={{ color: ch.color, background: ch.color + '12', borderColor: ch.color + '35' }}>
                              {ch.name}
                            </span>
                          )}
                          <span className={'tx-st ' + tx.status}>{tx.status}</span>
                          <span className="tx-time">{tx.time}</span>
                        </div>
                        <div className="tx-sub">
                          <span className="tx-hash">{tx.hash}</span>
                          <span className="tx-sep">·</span>
                          <span className="tx-to">to {tx.to}</span>
                        </div>
                      </div>
                      <div className="tx-amt">{tx.amount}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="right-col">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Filters</span>
                  <span className="card-count">Static demo</span>
                </div>
                <div className="dec-body">
                  <div className="field">
                    <div className="field-lbl">chain</div>
                    <div className="cpick-grid">
                      {[{ id: 'all', name: 'All', color: '#718096' }, ...CHAINS].map(c => (
                        <button
                          key={c.id}
                          className="cpick"
                          style={c.id === 'all'
                            ? {}
                            : { borderColor: c.color + '40', background: c.color + '08', color: c.color }}
                        >
                          {c.id !== 'all' && <span className="cpick-dot" style={{ background: c.color }} />}
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <div className="field-lbl">type</div>
                    <div className="cpick-grid">
                      {['send', 'swap', 'deposit'].map(t => (
                        <button key={t} className="cpick">
                          <span className="cpick-dot" />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="dec-note">
                    In a real app this would drive server-side or on-chain history queries.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}