/* 퍼블리온 홈페이지 — 브라우저 쪽 동작
 *
 * 화면은 build/prerender.mjs 가 미리 찍어둔 정적 HTML 로 이미 그려져 있습니다.
 * 이 파일은 그 위에 상호작용만 얹습니다. 자바스크립트가 없어도 모든 페이지가
 * 읽히고 링크로 이동합니다. 크롤러와 자바스크립트를 끈 방문자에게도 같습니다.
 *
 *   - 화면 간 이동은 실제 주소입니다. 링크를 가로채 다시 그리기만 합니다.
 *   - 도서 목록의 분야·정렬은 주소의 쿼리에 남습니다.
 *   - 히어로 자동 전환, 메가메뉴, 뉴스레터는 여기서 붙입니다.
 */

import { BOOKS, HERO, SUBJECTS } from './data.js';
import * as V from './views.js';
import './image-slot.js';

const HERO_INTERVAL = 7000;
const NEWSLETTER_KEY = 'publion.newsletter';

/* ── 상태 ───────────────────────────────────────────────────── */

const state = {
  view: readViewFromDom(),
  subs: loadSubs(),
  email: '',
  subMsg: '',
  subOk: false,
};

function readViewFromDom() {
  const app = document.getElementById('app');
  const page = app?.dataset.page || 'home';
  if (page === 'detail') return { page, bookId: Number(app.dataset.book) };
  if (page === 'books') {
    return { page, subject: app.dataset.subject || '전체', sort: app.dataset.sort || '신간순' };
  }
  return { page, heroIndex: 0 };
}

function viewFromUrl(url) {
  const u = new URL(url, location.origin);
  // 하위 경로에 배포된 경우 기준 경로를 떼고 판별합니다.
  let raw = u.pathname;
  if (V.BASE && raw.startsWith(V.BASE)) raw = raw.slice(V.BASE.length) || '/';
  const path = raw.replace(/\/+$/, '') || '/';
  if (path === '/books') {
    const s = u.searchParams.get('subject');
    const o = u.searchParams.get('sort');
    return { page: 'books',
             subject: SUBJECTS.includes(s) ? s : '전체',
             sort: V.SORTS.includes(o) ? o : '신간순' };
  }
  const m = path.match(/^\/book\/(\d+)$/);
  if (m) {
    const id = Number(m[1]);
    return { page: 'detail', bookId: BOOKS.some((b) => b.id === id) ? id : BOOKS[0].id };
  }
  if (path === '/about') return { page: 'about' };
  if (path === '/journal') return { page: 'journal' };
  if (path === '/authors') return { page: 'authors' };
  return { page: 'home', heroIndex: 0 };
}

/* ── 뉴스레터 ───────────────────────────────────────────────── */

function loadSubs() {
  try { return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveSubs(list) {
  state.subs = list;
  try { localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list)); } catch (e) {}
}

function subscribe() {
  const v = (state.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    state.subMsg = '이메일 주소를 확인해 주세요.';
    state.subOk = false;
  } else if (state.subs.some((x) => x.email.toLowerCase() === v.toLowerCase())) {
    state.subMsg = '이미 구독 중인 주소입니다.';
    state.subOk = false;
    state.email = '';
  } else {
    saveSubs(state.subs.concat([{ email: v, at: new Date().toISOString().slice(0, 10) }]));
    state.email = '';
    state.subMsg = '구독 신청이 접수됐습니다. 첫 뉴스레터를 보내드립니다.';
    state.subOk = true;
  }
  renderNewsletter();
}

function downloadSubs() {
  if (!state.subs.length) return;
  const csv = 'email,subscribed_at\n' + state.subs.map((x) => x.email + ',' + x.at).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'publion-newsletter.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderNewsletter() {
  const mount = document.getElementById('newsletter-mount');
  if (!mount) return;
  mount.innerHTML = V.newsletterHTML({
    email: state.email, subMsg: state.subMsg, subOk: state.subOk, subsCount: state.subs.length,
  });
  const input = document.getElementById('newsletter-email');
  if (input) {
    input.addEventListener('input', (ev) => { state.email = ev.target.value; });
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') subscribe(); });
  }
  document.getElementById('newsletter-submit')?.addEventListener('click', subscribe);
  document.getElementById('newsletter-csv')?.addEventListener('click', downloadSubs);
}

/* ── 히어로 ─────────────────────────────────────────────────── */

let heroTimer = null;

function renderHero() {
  const mount = document.getElementById('hero-mount');
  if (mount) mount.innerHTML = V.heroHTML(state.view.heroIndex || 0);
}

function startHero() {
  clearInterval(heroTimer);
  heroTimer = null;
  if (state.view.page !== 'home') return;
  heroTimer = setInterval(() => {
    state.view.heroIndex = ((state.view.heroIndex || 0) + 1) % HERO.length;
    renderHero();
  }, HERO_INTERVAL);
}

/* ── 메가메뉴 ───────────────────────────────────────────────── */

let megaOpen = false;

function renderMega() {
  const mount = document.getElementById('mega-mount');
  if (mount) mount.innerHTML = megaOpen ? V.megaHTML() : '';
}

function wireHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.querySelectorAll('[data-nav]').forEach((el) => {
    const item = V.NAV_ITEMS[Number(el.dataset.nav)];
    const open = () => {
      const next = Boolean(item.mega);
      if (next !== megaOpen) { megaOpen = next; renderMega(); }
    };
    el.addEventListener('mouseenter', open);
    el.addEventListener('focus', open);
  });
  header.addEventListener('mouseleave', () => {
    if (megaOpen) { megaOpen = false; renderMega(); }
  });
}

/* ── 화면 전환 ──────────────────────────────────────────────── */

function render(scrollTop = true) {
  const app = document.getElementById('app');
  const view = state.view;
  app.dataset.page = view.page;
  app.innerHTML = V.pageHTML({ ...view, megaOpen: false });
  megaOpen = false;

  const m = V.meta(view);
  document.title = m.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', V.SITE.origin + m.path);

  wireHeader();
  if (view.page === 'home') { renderHero(); renderNewsletter(); }
  startHero();
  if (scrollTop) window.scrollTo(0, 0);
}

function navigate(href, push = true) {
  const url = new URL(href, location.origin);
  if (url.origin !== location.origin) { location.href = href; return; }
  state.view = viewFromUrl(url);
  state.subMsg = '';
  if (push) history.pushState(null, '', url.pathname + url.search);
  render();
}

/* 같은 사이트 링크는 가로채 다시 그립니다.
   자바스크립트가 없으면 그냥 평범한 링크로 동작합니다. */
document.addEventListener('click', (ev) => {
  if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

  const dot = ev.target.closest('[data-hero-dot]');
  if (dot) { state.view.heroIndex = Number(dot.dataset.heroDot); renderHero(); return; }

  const arrow = ev.target.closest('[data-hero]');
  if (arrow) {
    const step = arrow.dataset.hero === 'prev' ? HERO.length - 1 : 1;
    state.view.heroIndex = ((state.view.heroIndex || 0) + step) % HERO.length;
    renderHero();
    return;
  }

  /* 영상 섬네일을 누르면 그 자리에 재생기를 붙입니다.
     쿠키를 남기지 않는 주소를 쓰고, 누르기 전에는 유튜브를 부르지 않습니다. */
  const vid = ev.target.closest('[data-video]');
  if (vid) {
    const id = vid.dataset.video;
    const frame = document.createElement('div');
    frame.className = 'video__player';
    frame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0" title="퍼블리온 영상" frameborder="0" allowfullscreen ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"></iframe>';
    vid.replaceWith(frame);
    return;
  }

  const a = ev.target.closest('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.getAttribute('href'), location.href);
  if (url.origin !== location.origin) return;
  if (url.hash && url.pathname === location.pathname) return;
  ev.preventDefault();
  navigate(url.href);
});

window.addEventListener('popstate', () => {
  state.view = viewFromUrl(location.href);
  render(false);
});

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && megaOpen) { megaOpen = false; renderMega(); }
});

/* 미리 찍힌 HTML 위에 동작만 얹습니다. 다시 그리지 않습니다. */
wireHeader();
if (state.view.page === 'home') { renderHero(); renderNewsletter(); }
startHero();
