
import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
  isAddress
} from "viem";
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  ShieldCheck,
  Wallet,
  Zap
} from "lucide-react";
import { robinhoodChain } from "./network";

const explorer = "https://robinhoodchain.blockscout.com";

export default function App() {
  const { login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();

  const [tab, setTab] = useState<"swap" | "send">("swap");
  const [fromAmount, setFromAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(
    "Connect your wallet to get started."
  );
  const [showNetwork, setShowNetwork] = useState(false);

  const address = wallets[0]?.address as `0x${string}` | undefined;

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  async function sendNative() {
    if (!wallets[0] || !address) {
      setNotice("Connect your wallet first.");
      return;
    }

    if (!isAddress(recipient)) {
      setNotice("Enter a valid destination wallet address.");
      return;
    }

    if (!sendAmount || Number(sendAmount) <= 0) {
      setNotice("Enter an amount greater than zero.");
      return;
    }

    setBusy(true);
    setNotice("Please confirm the transaction in your wallet…");

    try {
      await wallets[0].switchChain(robinhoodChain.id);

      const provider =
        await wallets[0].getEthereumProvider();

      const walletClient = createWalletClient({
        account: address,
        chain: robinhoodChain,
        transport: custom(provider)
      });

      const publicClient = createPublicClient({
        chain: robinhoodChain,
        transport: http()
      });

      const hash = await walletClient.sendTransaction({
        account: address,
        chain: robinhoodChain,
        to: recipient as `0x${string}`,
        value: parseEther(sendAmount)
      });

      setNotice(`Transaction submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({
        hash
      });

      setNotice(
        `Transfer confirmed: ${explorer}/tx/${hash}`
      );

      setSendAmount("");
      setRecipient("");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Transfer failed."
      );
    } finally {
      setBusy(false);
    }
  }

  function requestSwap() {
    setNotice(
      "Swap is not enabled yet. A verified Robinhood Chain router and live quote provider must be configured first. Your funds are not deposited or moved."
    );
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">Y</span>
          <span>
            YALO<span className="brand-light">DEX</span>
          </span>
        </a>

        <nav>
          <button
            className={tab === "swap" ? "nav-active" : ""}
            onClick={() => setTab("swap")}
          >
            Swap
          </button>

          <button
            className={tab === "send" ? "nav-active" : ""}
            onClick={() => setTab("send")}
          >
            Send
          </button>

          <a href="#about">About</a>
        </nav>

        <div className="header-actions">
          <button
            className="network-pill"
            onClick={() => setShowNetwork(!showNetwork)}
          >
            <span className="network-dot" />
            Robinhood
            <ChevronDown size={14} />
          </button>

          {showNetwork && (
            <div className="network-pop">
              Connected network
              <br />
              <b>Robinhood Chain · 4663</b>
            </div>
          )}

          {authenticated ? (
            <button
              className="connect-btn connected"
              onClick={() => logout()}
            >
              <span className="online-dot" />
              {shortAddress}
            </button>
          ) : (
            <button
              className="connect-btn"
              onClick={login}
            >
              <Wallet size={16} />
              Connect wallet
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            THE NEXT WAY TO EXCHANGE
            <span className="eyebrow-line" />
          </div>

          <h1>
            Trade freely.
            <br />
            <span>Move with YALO.</span>
          </h1>

          <p>
            A cleaner way to swap and send digital assets
            on Robinhood Chain.
          </p>

          <div className="hero-tags">
            <span>
              <ShieldCheck size={14} />
              Self-custody
            </span>
            <span>
              <Zap size={14} />
              On-chain
            </span>
            <span>
              <ArrowDownUp size={14} />
              Simple swaps
            </span>
          </div>
        </section>

        <section className="trade-layout">
          <div className="trade-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">
                  EXCHANGE
                </span>
                <h2>
                  {tab === "swap"
                    ? "Swap tokens"
                    : "Send assets"}
                </h2>
              </div>

              <div className="card-icon">
                <ArrowDownUp size={18} />
              </div>
            </div>

            {tab === "swap" ? (
              <>
                <div className="amount-box">
                  <div className="amount-label">
                    <span>You pay</span>
                    <span className="muted">
                      Balance —
                    </span>
                  </div>

                  <div className="amount-row">
                    <input
                      value={fromAmount}
                      onChange={(e) =>
                        setFromAmount(e.target.value)
                      }
                      placeholder="0.00"
                      inputMode="decimal"
                    />

                    <button className="token-select">
                      <span className="coin-icon eth">
                        Ξ
                      </span>
                      ETH
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="amount-foot">
                    <span>On Robinhood Chain</span>
                    <span>≈ $—</span>
                  </div>
                </div>

                <div className="swap-direction">
                  <span />
                  <button aria-label="Switch tokens">
                    <ArrowDownUp size={17} />
                  </button>
                  <span />
                </div>

                <div className="amount-box">
                  <div className="amount-label">
                    <span>You receive</span>
                    <span className="muted">
                      Estimated
                    </span>
                  </div>

                  <div className="amount-row">
                    <input
                      placeholder="—"
                      readOnly
                    />

                    <button className="token-select">
                      <span className="coin-icon yalo">
                        Y
                      </span>
                      Select token
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="amount-foot">
                    <span>
                      Choose a destination token
                    </span>
                    <span>≈ $—</span>
                  </div>
                </div>

                <div className="trade-details">
                  <div>
                    <span>Network</span>
                    <b>Robinhood Chain</b>
                  </div>

                  <div>
                    <span>Network fee</span>
                    <b>Calculated before swap</b>
                  </div>

                  <div>
                    <span>Price impact</span>
                    <b>Shown with live quote</b>
                  </div>
                </div>

                <button
                  className="primary-action"
                  onClick={
                    authenticated
                      ? requestSwap
                      : login
                  }
                >
                  {authenticated
                    ? "Swap coming soon"
                    : "Connect wallet"}
                  <ArrowUpRight size={17} />
                </button>

                <p className="disclaimer">
                  Swaps will activate after the router,
                  token list and live quote checks are
                  configured.
                </p>
              </>
            ) : (
              <>
                <div className="amount-box">
                  <div className="amount-label">
                    <span>Asset</span>
                    <span className="muted">
                      Native token
                    </span>
                  </div>

                  <div className="amount-row">
                    <div className="static-amount">
                      ETH
                    </div>

                    <span className="token-select">
                      <span className="coin-icon eth">
                        Ξ
                      </span>
                      ETH
                    </span>
                  </div>

                  <div className="amount-foot">
                    <span>Robinhood Chain</span>
                    <span>Native ETH</span>
                  </div>
                </div>

                <label className="field-label">
                  Recipient address
                </label>

                <input
                  className="text-field"
                  value={recipient}
                  onChange={(e) =>
                    setRecipient(e.target.value)
                  }
                  placeholder="0x…"
                />

                <label className="field-label">
                  Amount (ETH)
                </label>

                <input
                  className="text-field"
                  value={sendAmount}
                  onChange={(e) =>
                    setSendAmount(e.target.value)
                  }
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <button
                  className="primary-action"
                  disabled={busy}
                  onClick={sendNative}
                >
                  {busy ? "Processing…" : "Review & send"}
                  <ArrowUpRight size={17} />
                </button>

                <p className="disclaimer">
                  Transfers are signed by your connected
                  wallet. Check the address and network
                  before confirming.
                </p>
              </>
            )}

            {notice && (
              <div className="notice">
                <CircleHelp size={15} />
                <span>{notice}</span>
              </div>
            )}
          </div>

          <aside className="side-column">
            <div className="info-card highlight">
              <div className="info-icon">
                <ShieldCheck size={19} />
              </div>

              <h3>Your keys. Your control.</h3>

              <p>
                YALO is designed around self-custody.
                Transactions are approved in your wallet.
              </p>

              <span className="learn-link">
                SELF-CUSTODY FIRST
                <ArrowUpRight size={13} />
              </span>
            </div>

            <div className="info-card">
              <div className="info-top">
                <span>NETWORK</span>
                <span className="live-label">
                  <i />
                  LIVE NETWORK
                </span>
              </div>

              <h3>Robinhood Chain</h3>
              <p>Chain ID <b>4663</b></p>

              <a
                className="explorer-link"
                href={explorer}
                target="_blank"
                rel="noreferrer"
              >
                Block explorer
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="info-card mini-stats">
              <div>
                <span>DESIGNED FOR</span>
                <b>Simple trading</b>
              </div>

              <div>
                <span>WALLET MODEL</span>
                <b>Self-custody</b>
              </div>
            </div>
          </aside>
        </section>

        <section className="bottom-strip" id="about">
          <div>
            <span className="strip-mark">Y</span>
            <div>
              <b>YALO DEX</b>
              <p>Trade with clarity. Stay in control.</p>
            </div>
          </div>

          <span>BUILT FOR ROBINHOOD CHAIN</span>
        </section>
      </main>

      <footer>
        © 2026 YALO DEX
        <span>
          Always verify transaction details before
          confirming.
        </span>
      </footer>
    </div>
  );
}
