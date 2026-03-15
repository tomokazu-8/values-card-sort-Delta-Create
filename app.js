const { useState, useCallback } = React;

// ── ユーティリティ ──────────────────────────────────

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function genText(sorted, topTen) {
  const d = new Date();
  const ds = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  let t = "══════════════════════════════════\n  価値観カードソート 結果\n  " + ds + "\n══════════════════════════════════\n\n";
  if (topTen.length > 0) {
    t += `★ 核心的価値観 トップ${topTen.length}（${topTen.length}個）\n──────────────────────────────────\n`;
    topTen.forEach((v, i) => { t += `  ${String(i+1).padStart(2,' ')}. ${v.ja}（${v.en}）\n      ${v.desc}\n`; });
    const rest = sorted.very.filter(v => !topTen.find(x => x.id === v.id));
    if (rest.length) t += `\n◆ とても大切（${rest.length}個）\n──────────────────────────────────\n  ${rest.map(v => v.ja).join('、')}\n`;
  } else {
    t += `◆ とても大切（${sorted.very.length}個）\n──────────────────────────────────\n`;
    sorted.very.forEach((v, i) => { t += `  ${String(i+1).padStart(2,' ')}. ${v.ja}（${v.en}）\n      ${v.desc}\n`; });
  }
  t += `\n◇ まあまあ大切（${sorted.somewhat.length}個）\n──────────────────────────────────\n  ${sorted.somewhat.map(v => v.ja).join('、') || 'なし'}\n`;
  t += `\n○ あまり大切でない（${sorted.not.length}個）\n──────────────────────────────────\n  ${sorted.not.map(v => v.ja).join('、') || 'なし'}\n`;
  t += "\n──────────────────────────────────\n出典: Miller, C'de Baca, Matthews &\nWilbourne (2001) Personal Values Card Sort\n";
  return t;
}

function dlImage(sorted, topTen) {
  const d = new Date();
  const ds = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  const core = topTen.length > 0 ? topTen : sorted.very;
  const veryRest = topTen.length > 0 ? sorted.very.filter(v => !topTen.find(x => x.id === v.id)) : [];
  const W = 1190;
  const cH = core.length * 68 + 120;
  const vrH = veryRest.length ? 60 + Math.ceil(veryRest.length / 5) * 32 : 0;
  const sH = 60 + Math.ceil(Math.max(sorted.somewhat.length, 1) / 5) * 32;
  const nH = 60 + Math.ceil(Math.max(sorted.not.length, 1) / 5) * 32;
  const H = Math.max(1200, 320 + cH + vrH + sH + nH + 120);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1a1a2e'); g.addColorStop(0.4, '#16213e'); g.addColorStop(1, '#0f3460');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.globalAlpha = 0.03; x.fillStyle = '#a0c4ff';
  x.beginPath(); x.arc(900, 200, 300, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(200, H - 300, 250, 0, Math.PI * 2); x.fill();
  x.globalAlpha = 1;
  let y = 80;
  x.textAlign = 'center'; x.fillStyle = '#a0c4ff'; x.font = '300 52px sans-serif'; x.fillText('価値観カードソート', W/2, y); y += 36;
  x.fillStyle = '#506880'; x.font = '300 22px sans-serif'; x.fillText('ACT Personal Values Card Sort', W/2, y); y += 28;
  x.fillStyle = '#405060'; x.font = '300 20px sans-serif'; x.fillText(ds, W/2, y); y += 50;
  x.strokeStyle = 'rgba(160,196,255,0.15)'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(80, y); x.lineTo(W-80, y); x.stroke(); y += 40;
  x.textAlign = 'left';
  const hdr = topTen.length > 0 ? `★ 核心的価値観 トップ${topTen.length}` : '◆ とても大切';
  x.fillStyle = '#a0c4ff'; x.font = 'bold 28px sans-serif'; x.fillText(`${hdr}（${core.length}個）`, 80, y); y += 16;
  core.forEach((v, i) => {
    y += 42;
    x.fillStyle = `rgba(160,196,255,${Math.max(0.05, 0.15 - i * 0.01)})`;
    x.beginPath(); x.arc(110, y-8, 18, 0, Math.PI*2); x.fill();
    x.fillStyle = '#a0c4ff'; x.font = 'bold 18px sans-serif'; x.textAlign = 'center'; x.fillText(String(i+1), 110, y-2); x.textAlign = 'left';
    x.fillStyle = '#d0e0f0'; x.font = 'bold 26px sans-serif'; x.fillText(v.ja, 145, y);
    const jw = x.measureText(v.ja).width;
    x.fillStyle = '#4a6888'; x.font = '400 16px sans-serif'; x.fillText(v.en, 155+jw, y); y += 26;
    x.fillStyle = '#7090a8'; x.font = '400 18px sans-serif'; x.fillText(v.desc, 145, y);
  });
  const wrap = (txt, sx, sy, mw, lh, col) => {
    x.fillStyle = col; x.font = '400 17px sans-serif'; let ly = sy, ln = '';
    for (const ch of txt) {
      if (x.measureText(ln + ch).width > mw) { x.fillText(ln, sx, ly); ly += lh; ln = ch; }
      else ln += ch;
    }
    if (ln) { x.fillText(ln, sx, ly); ly += lh; }
    return ly;
  };
  const sect = (lbl, items, col) => {
    y += 50;
    x.strokeStyle = 'rgba(160,196,255,0.08)';
    x.beginPath(); x.moveTo(80, y); x.lineTo(W-80, y); x.stroke(); y += 32;
    x.fillStyle = col; x.font = 'bold 22px sans-serif'; x.fillText(`${lbl}（${items.length}個）`, 80, y); y += 30;
    y = wrap(items.map(v => v.ja).join('、') || 'なし', 80, y, W-160, 26, col + 'aa');
  };
  if (veryRest.length) sect('◆ とても大切', veryRest, '#e08050');
  sect('◇ まあまあ大切', sorted.somewhat, '#c0a040');
  sect('○ あまり大切でない', sorted.not, '#6a9a80');
  x.textAlign = 'center'; x.fillStyle = '#304058'; x.font = '300 14px sans-serif';
  x.fillText("出典: Miller, C'de Baca, Matthews & Wilbourne (2001) Personal Values Card Sort", W/2, Math.max(y+60, H-40));
  const a = document.createElement('a');
  a.download = `価値観カードソート_${d.toISOString().slice(0,10)}.png`;
  a.href = c.toDataURL('image/png');
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── 定数 ───────────────────────────────────────────

const TIER_LABEL = {
  top:      '★ Top',
  very:     '◆ 大切',
  somewhat: '◇ まあまあ',
  not:      '○ あまり',
};

// ── App コンポーネント ──────────────────────────────

function App() {
  const [deck,        setDeck]        = useState(() => shuffle(VALUES));
  const [sorted,      setSorted]      = useState({ very: [], somewhat: [], not: [] });
  const [history,     setHistory]     = useState([]);
  const [topTen,      setTopTen]      = useState([]);
  const [moveTarget,  setMoveTarget]  = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [showText,    setShowText]    = useState(false);
  const [showNarrow,  setShowNarrow]  = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  // ドラッグ状態
  const [dragging,  setDragging]  = useState(false);
  const [dragOver,  setDragOver]  = useState(null); // どのボックスにホバー中か

  const cur      = deck[0] || null;
  const done     = deck.length === 0;
  const total    = VALUES.length;
  const progress = total - deck.length;

  const sortCard = useCallback((cat) => {
    if (!cur) return;
    setHistory(p => [...p, { card: cur, category: cat }]);
    setSorted(p => ({ ...p, [cat]: [...p[cat], cur] }));
    setDeck(p => p.slice(1));
  }, [cur]);

  const undo = useCallback(() => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setHistory(p => p.slice(0, -1));
    setSorted(p => ({ ...p, [last.category]: p[last.category].filter(c => c.id !== last.card.id) }));
    setDeck(p => [last.card, ...p]);
  }, [history]);

  const moveCard = (card, from, to) => {
    if (from === to) return;
    if (from === 'top') {
      setTopTen(p => p.filter(c => c.id !== card.id));
      if (to !== 'very') setSorted(p => ({ ...p, [to]: [...p[to], card], very: p.very.filter(c => c.id !== card.id) }));
    } else if (to === 'top') {
      setTopTen(p => [...p, card]);
      if (from !== 'very') setSorted(p => ({ ...p, [from]: p[from].filter(c => c.id !== card.id), very: [...p.very, card] }));
    } else {
      setSorted(p => ({ ...p, [from]: p[from].filter(c => c.id !== card.id), [to]: [...p[to], card] }));
      setTopTen(p => p.filter(c => c.id !== card.id));
    }
    setMoveTarget(null);
  };

  const toggleTopTen = (card) => {
    setTopTen(p => {
      if (p.find(c => c.id === card.id)) return p.filter(c => c.id !== card.id);
      if (p.length >= 10) return p;
      return [...p, card];
    });
  };

  const restart = () => {
    setDeck(shuffle(VALUES));
    setSorted({ very: [], somewhat: [], not: [] });
    setHistory([]);
    setTopTen([]);
    setMoveTarget(null);
    setShowNarrow(false);
    setExpandedCat(null);
  };

  const handleCopy = () => {
    const t = genText(sorted, topTen);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(() => fallbackCopy(t));
    } else {
      fallbackCopy(t);
    }
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch(e) {}
    document.body.removeChild(ta);
  };

  const handleDownload = () => { try { dlImage(sorted, topTen); } catch(e) { console.error(e); } };

  // ドラッグ & ドロップ ハンドラ
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  };
  const handleDragEnd = () => {
    setDragging(false);
    setDragOver(null);
  };
  const handleBoxDragEnter = (k, e) => {
    e.preventDefault();
    setDragOver(k);
  };
  const handleBoxDragOver = (e) => {
    e.preventDefault(); // ドロップを許可するために必須
  };
  const handleBoxesLeave = (e) => {
    // ボックス群の外に出たときだけリセット
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
  };
  const handleBoxDrop = (k, e) => {
    e.preventDefault();
    setDragging(false);
    setDragOver(null);
    sortCard(k);
  };

  const veryRest = sorted.very.filter(v => !topTen.find(x => x.id === v.id));
  const allTiers = [
    { key: 'top',      label: `★ トップ${topTen.length}`,  items: topTen,                                    show: topTen.length > 0 },
    { key: 'very',     label: '◆ とても大切',               items: topTen.length > 0 ? veryRest : sorted.very, show: true },
    { key: 'somewhat', label: '◇ まあまあ大切',             items: sorted.somewhat,                           show: true },
    { key: 'not',      label: '○ あまり大切でない',         items: sorted.not,                                show: true },
  ];

  const getMoveTargets = (fromKey) => ['top', 'very', 'somewhat', 'not'].filter(k => k !== fromKey);

  // トップ10バナーの表示条件
  const showTop10Banner = done && sorted.very.length > 10 && !showNarrow;

  return (
    <div className="app">
      {/* ── Header ── */}
      <div className="header">
        <h1 className="header__title">価値観カードソート</h1>
        <p className="header__sub">ACT Personal Values Card Sort</p>
      </div>

      <div className="container">

        {/* ── Progress ── */}
        <div className="progress">
          <div className="progress__labels">
            <span>{progress}/{total} 完了</span>
            {!done && <span>残り {deck.length} 枚</span>}
            {done && <span className="progress__done-label">✓ 仕分け完了</span>}
          </div>
          <div className="progress__track">
            <div
              className={`progress__fill${done ? ' progress__fill--done' : ''}`}
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>

        {/* ── 仕分けカード（ドラッグ対応） ── */}
        {!done && (
          <div className="card-area">
            {/* 戻るボタン */}
            <div>
              <button
                onClick={undo}
                disabled={!history.length}
                className={`btn-undo ${history.length ? 'btn-undo--active' : 'btn-undo--inactive'}`}
              >
                ← 戻る
              </button>
            </div>

            {/* カード（つかんで移動可能） */}
            <div
              className={`card card--draggable${dragging ? ' card--dragging' : ''}`}
              draggable={true}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="card__drag-hint">つかんで下のボックスへ</div>
              <div className="card__ja">{cur.ja}</div>
              <div className="card__en">{cur.en}</div>
              <div className="card__desc">{cur.desc}</div>
            </div>

            {/* ソートボックス（クリック or ドロップ） */}
            <div
              className={`sort-boxes${dragging ? ' sort-boxes--active' : ''}`}
              onDragLeave={handleBoxesLeave}
            >
              {CAT_KEYS.map(k => (
                <div
                  key={k}
                  className={`sort-box sort-box--${k}${dragOver === k ? ' sort-box--dragover' : ''}`}
                  onDragEnter={(e) => handleBoxDragEnter(k, e)}
                  onDragOver={handleBoxDragOver}
                  onDrop={(e) => handleBoxDrop(k, e)}
                  onClick={() => sortCard(k)}
                >
                  <div className="sort-box__icon">{CATS[k].icon}</div>
                  <div className="sort-box__label">{CATS[k].label}</div>
                  <div className="sort-box__hint">クリックまたはドロップ</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── トップ10バナー（完了後・大切が10枚超のとき） ── */}
        {showTop10Banner && (
          <div className="top10-banner">
            <div className="top10-banner__icon">★</div>
            <div className="top10-banner__title">核心的価値観を絞り込みましょう</div>
            <div className="top10-banner__desc">
              「とても大切」に
              <span className="top10-banner__count">{sorted.very.length}個</span>
              選びました。<br />
              その中からさらに<strong>トップ10</strong>を選ぶことで、<br />
              本当に大切な価値観が明確になります。
            </div>
            <button className="btn-top10" onClick={() => setShowNarrow(true)}>
              トップ10を選ぶ →
            </button>
          </div>
        )}

        {/* ── トップ10絞り込みパネル ── */}
        {done && showNarrow && (
          <div className="narrow-panel">
            <div className="narrow-panel__header">
              <div className="narrow-panel__title">
                「とても大切」から<strong>トップ10</strong>を選択
              </div>
              <div className={`narrow-panel__count${topTen.length >= 10 ? ' narrow-panel__count--full' : ''}`}>
                {topTen.length}/10
              </div>
            </div>
            <div className="narrow-tags">
              {sorted.very.map(v => {
                const sel      = topTen.find(c => c.id === v.id);
                const disabled = topTen.length >= 10 && !sel;
                return (
                  <span
                    key={v.id}
                    onClick={() => toggleTopTen(v)}
                    className={`narrow-tag${sel ? ' narrow-tag--selected' : ''}${disabled ? ' narrow-tag--disabled' : ''}`}
                  >
                    {v.ja}
                  </span>
                );
              })}
            </div>
            <div className="narrow-panel__footer">
              <button onClick={() => setShowNarrow(false)} className="btn-close">閉じる</button>
            </div>
          </div>
        )}

        {/* ── カテゴリ一覧 ── */}
        <div className="tiers">
          {allTiers.filter(t => t.show).map(tier => {
            const isExpanded = expandedCat === tier.key;
            const canEdit    = done;
            return (
              <div
                key={tier.key}
                className={`tier tier--${tier.key}${tier.items.length ? ' tier--has-items' : ''}`}
              >
                <div className="tier__header" onClick={() => setExpandedCat(isExpanded ? null : tier.key)}>
                  <div className="tier__label-group">
                    <span className="tier__label">{tier.label}</span>
                    <span className="tier__badge">{tier.items.length}</span>
                  </div>
                  <span className={`tier__chevron${isExpanded ? ' tier__chevron--open' : ''}`}>▼</span>
                </div>

                {!isExpanded && tier.items.length > 0 && (
                  <div className="tier__preview">
                    {tier.items.slice(0, 20).map(v => (
                      <span key={v.id} className="tier__preview-tag">{v.ja}</span>
                    ))}
                    {tier.items.length > 20 && <span className="tier__more">+{tier.items.length - 20}</span>}
                  </div>
                )}

                {isExpanded && (
                  <div className="tier__content">
                    {tier.items.length === 0 && <div className="tier__empty">カードがありません</div>}
                    <div className="tier-tags">
                      {tier.items.map(v => {
                        const isSelected = moveTarget?.card.id === v.id && moveTarget?.fromCat === tier.key;
                        return (
                          <div key={v.id}>
                            <span
                              onClick={() => { if (!canEdit) return; setMoveTarget(isSelected ? null : { card: v, fromCat: tier.key }); }}
                              className={`tier-item__tag${isSelected ? ' tier-item__tag--selected' : ''}${!canEdit ? ' tier-item__tag--readonly' : ''}`}
                            >
                              {v.ja}
                              {canEdit && <span className="tier-item__icon">↕</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {canEdit && moveTarget && moveTarget.fromCat === tier.key && (
                      <div className="move-menu">
                        <div className="move-menu__label">「{moveTarget.card.ja}」を移動 →</div>
                        <div className="move-menu__buttons">
                          {getMoveTargets(tier.key).map(k => (
                            <button
                              key={k}
                              onClick={() => moveCard(moveTarget.card, tier.key, k)}
                              className={`move-btn move-btn--${k}`}
                            >
                              {TIER_LABEL[k]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!canEdit && tier.items.length > 0 && (
                      <div className="tier__hint">全カードの仕分け後に編集できます</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 結果保存 ── */}
        {done && (
          <div className="save-section">
            <div className="save-section__title">結果を保存</div>
            <div className="save-buttons">
              <button onClick={handleDownload} className="btn-download">
                📄 画像で保存
              </button>
              <button onClick={handleCopy} className={`btn-copy${copied ? ' btn-copy--done' : ''}`}>
                {copied ? '✓ コピー完了' : '📋 テキストコピー'}
              </button>
            </div>
            <div className="save-section__preview-toggle">
              <button onClick={() => setShowText(!showText)} className="btn-text-toggle">
                {showText ? '閉じる' : 'テキストプレビュー'}
              </button>
            </div>
            {showText && (
              <pre className="text-preview">{genText(sorted, topTen)}</pre>
            )}
          </div>
        )}

        {/* ── リスタート ── */}
        {done && (
          <div className="bottom-actions">
            <button onClick={restart} className="btn-restart">最初からやり直す</button>
          </div>
        )}

        <div className="footer">
          出典: Miller, C'de Baca, Matthews & Wilbourne (2001) Personal Values Card Sort
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
