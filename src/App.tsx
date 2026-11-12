
import { useState } from 'react'
import {
  ArrowDownUp,
  Wallet,
  ChevronDown,
  Settings,
  ExternalLink,
  Menu,
  X,
  Zap,
  ShieldCheck,
  Globe,
} from 'lucide-react'

import { robinhoodChain } from './network'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [fromAmount, setFromAmount] = useState('1')
  const [toAmount, setToAmount] = useState('')
  const [connected, setConnected] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)

  const estimate = Number(fromAmount) > 0
    ? (Number(fromAmount) * 1).toFixed(4)
    : ''

  const updateAmount = (value: string) => {
    setFromAmount(value)
    setToAmount(value ? (Number(value) * 1).toFixed(4) : '')
  }

  return (
    <main className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">Y</span>
          <span>YALO<span className="yellow">DEX</span></span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a className="active" href="#swap">Swap</a>
          <a href="#about">About</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>

        <div className="nav-actions">
          <button
            className="network-button"
            onClick={() => setNetworkOpen(!networkOpen)}
          >
            <span className="status-dot" />
            Robinhood
            <ChevronDown size={15} />
          </button>

          <button
            className="connect-button"
            onClick={() => setConnected(!connected)}
          >
            <Wallet size={16} />
            {connected ? 'Wallet connected' : 'Connect wallet'}
          </button>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {networkOpen && (
        <div className="network-notice">
          <strong>{robinhoodChain.name}</strong>
          <span>Chain ID: {robinhoodChain.id}</span>
          <span>Testnet configuration</span>
        </div>
      )}

      <section className="hero">
        <div className="hero-tag">
          <span className="status-dot" />
          BUILT FOR ROBINHOOD CHAIN
        </div>

        <h1>
          Trade without
          <br />
          <span className="yellow">friction.</span>
        </h1>

        <p className="hero-description">
          A new way to swap digital assets.
          Simple, transparent and built for the next
          generation of decentralized finance.
        </p>

        <div className="hero-buttons">
          <a href="#swap" className="primary-button">
            Start swapping <ArrowDownUp size={17} />
          </a>
          <a href="#about" className="secondary-button">
            Explore YALO <ExternalLink size={15} />
          </a>
        </div>
      </section>

      <section className="swap-section" id="swap">
        <div className="swap-card">
          <div className="swap-heading">
            <div>
              <h2>Swap tokens</h2>
              <p>Exchange assets on Robinhood Chain</p>
            </div>
            <button className="icon-button" aria-label="Settings">
              <Settings size={20} />
            </button>
          </div>

          <div className="token-box">
            <div className="token-label">
              <span>You pay</span>
              <span>Balance: —</span>
            </div>

            <div className="token-input-row">
              <input
                type="number"
                min="0"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => updateAmount(e.target.value)}
              />

              <button className="token-select">
                <span className="eth-icon">Ξ</span>
                ETH
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="token-usd">Wallet balance unavailable</div>
          </div>

          <div className="swap-direction">
            <button aria-label="Reverse swap">
              <ArrowDownUp size={18} />
            </button>
          </div>

          <div className="token-box">
            <div className="token-label">
              <span>You receive</span>
              <span>Estimated amount</span>
            </div>

            <div className="token-input-row">
              <input
                type="text"
                placeholder="0.0"
                value={toAmount || estimate}
                readOnly
              />

              <button className="token-select">
                <span className="yalo-token">Y</span>
                YALO
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="token-usd">Indicative estimate only</div>
          </div>

          <div className="swap-details">
            <div>
              <span>Network</span>
              <strong>Robinhood Chain</strong>
            </div>
            <div>
              <span>Network fee</span>
              <strong>Calculated at execution</strong>
            </div>
            <div>
              <span>Exchange rate</span>
              <strong>Not available</strong>
            </div>
          </div>

          <button
            className="swap-button"
            onClick={() => {
              alert(
                'YALO DEX preview: live swapping is not enabled yet. Connect a verified wallet and configure a swap router first.'
              )
            }}
          >
            {connected ? 'Swap unavailable' : 'Connect wallet to continue'}
          </button>

          <p className="disclaimer">
            Preview interface. No real transactions are executed.
          </p>
        </div>
      </section>

      <section className="features" id="about">
        <div className="feature">
          <ShieldCheck size={25} />
          <h3>Self-custody</h3>
          <p>Your assets remain under your control.</p>
        </div>

        <div className="feature">
          <Zap size={25} />
          <h3>Built for speed</h3>
          <p>Designed for the Robinhood Chain ecosystem.</p>
        </div>

        <div className="feature" id="ecosystem">
          <Globe size={25} />
          <h3>Open ecosystem</h3>
          <p>Connecting users to decentralized finance.</p>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#">
          <span className="brand-icon">Y</span>
          YALO<span className="yellow">DEX</span>
        </a>

        <p>© 2026 YALO. Built for the decentralized future.</p>

        <span className="footer-network">
          <span className="status-dot" />
          Robinhood Chain
        </span>
      </footer>
    </main>
  )
}

export default App
            
