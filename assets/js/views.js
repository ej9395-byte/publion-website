/* 화면 템플릿 — 브라우저와 빌드 스크립트가 함께 쓰는 순수 함수 모음
 *
 * 여기에는 document, window, location 이 들어오지 않습니다.
 * 덕분에 같은 코드로 브라우저에서 그리고, Node 에서 정적 HTML 로 미리 찍습니다.
 * 미리 찍는 이유는 GEO·AEO 때문입니다. ChatGPT·Claude·Perplexity 크롤러는
 * 자바스크립트를 실행하지 않으므로, 첫 HTML 에 본문이 없으면 사이트가 없는 것과 같습니다.
 */

import { BOOKS, SUBJECTS, HERO, SERIES } from './data.js';
import { INTROS } from './intros.js';
import { POSTS, POSTS_BY_BOOK } from './posts.js';

export const SITE = {
  name: '퍼블리온',
  nameEn: 'Publion',
  origin: 'https://publion.co.kr',      // 배포 도메인이 정해지면 여기만 고칩니다
  store: 'https://smartstore.naver.com/publion',
  blog: 'https://blog.naver.com/publion',
  tistory: 'https://publion.tistory.com',
  youtube: 'https://www.youtube.com/channel/UCiAnjLlaS08ncxTel_Pd3EQ',
  instagram: 'https://instagram.com/publion_book',
  facebook: 'https://www.facebook.com/publionbooks',
  email: 'publion2030@gmail.com',
  tel: '010-3207-0033',
  ceo: '박선영',
  founded: '2020-02-26',
  regNo: '제2022-000096호',
  catalogPdf: 'https://drive.google.com/file/d/14xDhg0Z7kjXStwnNtX0qU1RH-K25IBED/view',
};

export const SORTS = ['신간순', '가나다순', '가격순'];
export const COVER_DIR = '/assets/img/covers';
export const BANNER_DIR = '/assets/img/banners';

/* ── 문자열 도구 ────────────────────────────────────────────── */

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

export const money = (n) => (n ? '₩' + n.toLocaleString('ko-KR') : '출간 예정');
export const byline = (b) => [b.author, b.trans].filter(Boolean).join(' · ');

export const decorate = (b) => ({
  ...b,
  priceLabel: money(b.price),
  byline: byline(b),
  en: b.sub || '',
  blurb: b.sub || '',
  slotId: 'cover-' + b.id,
  cover: `${COVER_DIR}/cover-${b.id}.jpg`,
  href: bookHref(b.id),
});

/* ── 주소 ───────────────────────────────────────────────────── */

export const homeHref = () => '/';
export const aboutHref = () => '/about/';
export const authorsHref = () => '/authors/';
export const journalHref = () => '/journal/';
export const bookHref = (id) => `/book/${id}/`;

export function booksHref(subject, sort) {
  const q = [];
  if (subject && subject !== '전체') q.push('subject=' + encodeURIComponent(subject));
  if (sort && sort !== '신간순') q.push('sort=' + encodeURIComponent(sort));
  return '/books/' + (q.length ? '?' + q.join('&') : '');
}

/* ── 조각 ───────────────────────────────────────────────────── */

const slot = (id, fit, placeholder, src, eager) =>
  `<image-slot id="${esc(id)}" fit="${fit}" placeholder="${esc(placeholder)}"` +
  (src ? ` src="${esc(src)}"` : '') + (eager ? ' eager' : '') + `></image-slot>`;

const coverSlot = (b, placeholder) => slot(b.slotId, 'contain', placeholder || b.title, b.cover);

const LOGO_PATH = 'M2 3.5 L11 3.5 L17 9 L23 3.5 L32 3.5 L32 22.5 L23 22.5 L17 17 L11 22.5 L2 22.5 Z';

export const SOCIAL = [
  { label: 'Instagram',    href: SITE.instagram },
  { label: 'Facebook',     href: SITE.facebook },
  { label: 'YouTube',      href: SITE.youtube },
  { label: '네이버 블로그', href: SITE.blog },
  { label: '대표 블로그',   href: SITE.tistory },
  { label: '스마트스토어',  href: SITE.store },
];

export const JOURNAL = [
  { kicker: '대표의 기록', date: '2026.06', slotId: 'journal-1',
    title: '2026년 상반기를 돌아보며',
    excerpt: '올해 펴낸 네 권이 서로 다른 분야였는데도 같은 방향을 보고 있었습니다.',
    href: SITE.tistory + '/11' },
  { kicker: '대표의 기록', date: '2026.06', slotId: 'journal-2',
    title: '왜 지금 『현금경영』일까요',
    excerpt: '좋은 책을 만드는 일과 회사를 계속 운영하는 일은 전혀 다른 문제였습니다.',
    href: SITE.tistory + '/5' },
  { kicker: '저자 인터뷰', date: '2023.10', slotId: 'journal-3',
    title: '김초엽 신작 장편소설 『파견자들』 출간 비하인드',
    excerpt: '인간과 인간 바깥의 경계를 지워보고 싶었다는 작가의 말에서 이 소설이 시작됐습니다.',
    href: 'https://ch.yes24.com/Article/Details/54880' },
];

export const NAV_ITEMS = [
  { label: '도서 Books',       href: booksHref('전체'),          mega: true,  match: 'books' },
  { label: '신간 New',         href: booksHref('전체', '신간순'), mega: false, match: null },
  { label: '저자 Authors',     href: authorsHref(),              mega: false, match: 'authors' },
  { label: '저널 Journal',     href: journalHref(),              mega: false, match: 'journal' },
  { label: '출판사 소개 About', href: aboutHref(),                mega: false, match: 'about' },
];

const MEGA_COLS = [
  { title: '분야 Subject', links: SUBJECTS.map((x) => ({ label: x, href: booksHref(x) })) },
  { title: '모아보기 Collections', links: [
    { label: 'TREND INSIGHT 시리즈 (김용섭)', href: booksHref('경제경영 Business') },
    { label: '루퍼트 스파이라 명상 시리즈',    href: booksHref('인문 Humanities') },
    { label: '일하는 사람의 책',              href: booksHref('자기계발 Self-development') },
    { label: '출간 예정',                     href: booksHref('전체') },
  ] },
  { title: '서비스 Service', links: [
    { label: '단체·도매 주문',   href: aboutHref() },
    { label: '투고 안내',        href: aboutHref() },
    { label: '판권 문의 Rights', href: aboutHref() },
    { label: '강연 요청',        href: aboutHref() },
  ] },
];

const MEGA_CARDS = [
  { kicker: '시리즈', title: 'TREND INSIGHT', slotId: 'mega-card-1', fit: 'cover',
    src: `${BANNER_DIR}/mega-card-1.jpg`, href: booksHref('경제경영 Business') },
  { kicker: '신간', title: '인간이 유리하다', slotId: 'cover-41', fit: 'contain',
    src: `${COVER_DIR}/cover-41.jpg`, href: bookHref(41) },
];

/* 서점 링크 — 책이 있으면 그 책의 상품 페이지로 바로 갑니다.
 *   교보문고 : 상품ID(data.js 의 kyobo). ISBN 으로는 열리지 않습니다.
 *   알라딘   : ISBN 으로 바로 열립니다.
 *   예스24   : ISBN 검색. dispNo 파라미터가 없으면 첫 화면으로 튕깁니다.
 * 책 없이 부르면(푸터 등) 퍼블리온 전체 검색으로 갑니다. */
export function retailersFor(book) {
  if (book && book.isbn) {
    return [
      { label: '교보문고', href: 'https://product.kyobobook.co.kr/detail/' + book.kyobo },
      { label: '예스24',  href: 'https://www.yes24.com/product/search?domain=BOOK&query=' + book.isbn + '&dispNo=' },
      { label: '알라딘',  href: 'https://www.aladin.co.kr/shop/wproduct.aspx?ISBN=' + book.isbn },
    ];
  }
  const q = encodeURIComponent('퍼블리온');
  return [
    { label: '교보문고', href: 'https://search.kyobobook.co.kr/search?keyword=' + q + '&target=total' },
    { label: '예스24',  href: 'https://www.yes24.com/product/search?domain=BOOK&query=' + q + '&dispNo=' },
    { label: '알라딘',  href: 'https://www.aladin.co.kr/search/wsearchresult.aspx?SearchWord=' + q },
  ];
}

/* ── 머리말 ─────────────────────────────────────────────────── */

function headerHTML(view) {
  const currentIndex = NAV_ITEMS.findIndex((n) => n.match === view.page);
  const nav = NAV_ITEMS.map((n, i) => `
    <a class="nav__item" href="${n.href}" data-nav="${i}"${n.external ? ' target="_blank" rel="noopener"' : ''}
       ${i === currentIndex ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');

  return `
  <div class="topbar">
    <span>경제경영 · 인문 · 문학 &nbsp;·&nbsp; Books for the next decade</span>
    <div class="topbar__right">
      <span>3만원 이상 무료배송</span>
      <span class="topbar__sep" aria-hidden="true">|</span>
      <span class="topbar__lang">KO / EN</span>
    </div>
  </div>

  <header class="header" id="site-header">
    <div class="header__bar">
      <div class="header__left"><button type="button">검색 Search</button></div>
      <a class="header__brand" href="/" aria-label="퍼블리온 홈">
        <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
          <path d="${LOGO_PATH}" fill="#111111"></path>
        </svg>
        <div>
          <div class="header__wordmark">Publion</div>
          <div class="header__ko">퍼 블 리 온</div>
        </div>
      </a>
      <div class="header__right">
        <button type="button">계정 Account</button>
        <a href="${SITE.store}" target="_blank" rel="noopener">스마트스토어 Store</a>
      </div>
    </div>
    <nav class="nav" aria-label="주요 메뉴">${nav}</nav>
    <div id="mega-mount">${view.megaOpen ? megaHTML() : ''}</div>
  </header>`;
}

export function megaHTML() {
  const cols = MEGA_COLS.map((col) => `
    <div>
      <div class="mega__title">${esc(col.title)}</div>
      <div class="mega__links">
        ${col.links.map((l) => `<a class="mega__link" href="${l.href}">${esc(l.label)}</a>`).join('')}
      </div>
    </div>`).join('');
  const cards = MEGA_CARDS.map((c) => `
    <a class="mega__card" href="${c.href}">
      <div class="mega__card-img">${slot(c.slotId, c.fit, c.title, c.src)}</div>
      <div class="mega__card-kicker">${esc(c.kicker)}</div>
      <div class="mega__card-title">${esc(c.title)}</div>
    </a>`).join('');
  return `<div class="mega"><div class="mega__inner">${cols}<div class="mega__cards">${cards}</div></div></div>`;
}

/* ── 히어로 · 뉴스레터 (홈에서 다시 그려지는 조각) ──────────── */

export function heroHTML(heroIndex) {
  const h = HERO[heroIndex];
  const dots = HERO.map((_, i) => `
    <button type="button" class="hero__dot" data-hero-dot="${i}"
            aria-current="${i === heroIndex}" aria-label="${i + 1}번 배너 보기"></button>`).join('');
  return `
  <section class="hero" aria-roledescription="carousel" aria-label="주요 도서">
    <div class="hero__bg">${slot(h.slotId, 'cover', h.title + ' 배너 이미지', `${BANNER_DIR}/${h.slotId}.jpg`, true)}</div>
    <div class="hero__wrap">
      <div class="hero__panel">
        <div class="hero__kicker">${esc(h.kicker)}</div>
        <h1 class="hero__title">${esc(h.title)}</h1>
        <p class="hero__desc">${esc(h.desc)}</p>
        <a class="btn hero__cta" href="${bookHref(h.bookId)}">자세히 보기 Discover</a>
      </div>
    </div>
    <div class="hero__dots">${dots}</div>
    <div class="hero__arrows">
      <button type="button" class="hero__arrow" data-hero="prev" aria-label="이전 배너">←</button>
      <button type="button" class="hero__arrow" data-hero="next" aria-label="다음 배너">→</button>
    </div>
  </section>`;
}

export function newsletterHTML(view) {
  const countLabel = view.subsCount ? `구독자 ${view.subsCount}명 · CSV 내려받기` : '';
  return `
  <section class="newsletter">
    <div>
      <h2 class="newsletter__title">뉴스레터 구독</h2>
      <p class="newsletter__text">매달 신간 소식과 저자의 글, 편집자가 고른 문장을 보내드립니다.</p>
    </div>
    <div>
      <div class="newsletter__field">
        <label class="u-sr-only" for="newsletter-email">이메일 주소</label>
        <input class="newsletter__input" id="newsletter-email" type="email"
               placeholder="이메일 주소 Email address" value="${esc(view.email || '')}">
        <button type="button" class="newsletter__submit" id="newsletter-submit">구독 Subscribe</button>
      </div>
      <div class="newsletter__foot">
        <span class="newsletter__msg" data-ok="${Boolean(view.subOk)}" role="status">${esc(view.subMsg || '')}</span>
        <button type="button" class="newsletter__csv" id="newsletter-csv"
                ${countLabel ? '' : 'hidden'}>${esc(countLabel)}</button>
      </div>
    </div>
  </section>`;
}

/* ── 화면 ───────────────────────────────────────────────────── */

const cardHTML = (b) => `
  <a class="card" href="${b.href}">
    <div class="card__cover">${coverSlot(b)}</div>
    <div class="card__title">${esc(b.title)}</div>
    <div class="card__byline">${esc(b.byline)}</div>
    <div class="card__price">${esc(b.priceLabel)}</div>
  </a>`;

function homeHTML(view) {
  const newBooks = BOOKS.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(decorate);
  const subjectTiles = SUBJECTS.map((x, i) => ({
    ko: x.split(' ')[0], en: x.split(' ').slice(1).join(' '),
    count: BOOKS.filter((b) => b.subject === x).length + '종',
    slotId: 'subject-' + (i + 1), href: booksHref(x),
  }));

  return `
  <main>
    <div id="hero-mount">${heroHTML(view.heroIndex || 0)}</div>

    <section class="section">
      <div class="section-head">
        <h2 class="t-h2">신간 <span class="t-en">New Releases</span></h2>
        <a class="link-underline" href="${booksHref('전체')}">전체 보기 Shop all</a>
      </div>
      <div class="grid-new">${newBooks.map(cardHTML).join('')}</div>
    </section>

    <section class="feature">
      <div class="feature__panel">
        <div class="feature__kicker">저널 · Feature</div>
        <h2 class="feature__title">김초엽 신작 장편소설 『파견자들』 출간 비하인드</h2>
        <p class="feature__text">2024 문학나눔 선정도서. 원고가 책이 되기까지의 과정을 편집부가 기록했습니다.</p>
        <a class="feature__link" href="https://ch.yes24.com/Article/Details/54880" target="_blank" rel="noopener">읽기 Read</a>
      </div>
      <div class="feature__img">${slot('feature-main', 'cover', '피처 기사 이미지', `${BANNER_DIR}/feature-main.jpg`)}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="t-h2">분야별 탐색 <span class="t-en">Explore our Subjects</span></h2>
        <a class="link-underline" href="${booksHref('전체')}">전체 보기 Browse all</a>
      </div>
      <div class="grid-subjects">
        ${subjectTiles.map((s) => `
          <a class="subject" href="${s.href}">
            <div class="subject__img">${slot(s.slotId, 'cover', s.ko, `${BANNER_DIR}/${s.slotId}.jpg`)}</div>
            <div class="subject__meta">
              <div>
                <div class="subject__ko">${esc(s.ko)}</div>
                <div class="subject__en">${esc(s.en)}</div>
              </div>
              <div class="subject__count">${esc(s.count)}</div>
            </div>
          </a>`).join('')}
      </div>
    </section>

    <section class="section section--gray">
      <h2 class="t-h2" style="margin-bottom:38px">시리즈 <span class="t-en">Explore our Series</span></h2>
      <div class="grid-series">
        ${SERIES.map((x) => `
          <a class="series" href="${booksHref(x.subject)}">
            <div class="series__img">${slot(x.slotId, 'cover', x.name, `${BANNER_DIR}/${x.slotId}.jpg`)}</div>
            <div class="series__name">${esc(x.name)}</div>
            <div class="series__note">${esc(x.note)}</div>
          </a>`).join('')}
      </div>
    </section>

    <section class="promo">
      <div class="promo__img">${slot('promo-literature', 'cover', '문학 프로모션 이미지', `${BANNER_DIR}/promo-literature.jpg`)}</div>
      <div class="promo__text">
        <h2 class="promo__title">퍼블리온 문학</h2>
        <p class="promo__body">2023년 김초엽 『파견자들』을 시작으로, 한국 소설과 해외 소설을 함께 소개합니다.</p>
        <a class="promo__link" href="${booksHref('문학 Literature')}">둘러보기 Explore</a>
      </div>
      <div class="promo__text promo__text--row2">
        <h2 class="promo__title">퍼블리온 스토어</h2>
        <p class="promo__body">『독서의 기록 다이어리』를 비롯한 퍼블리온 굿즈와 도서를 스마트스토어에서 만나실 수 있습니다.</p>
        <a class="promo__link" href="${SITE.store}" target="_blank" rel="noopener">스토어 가기 Shop</a>
      </div>
      <div class="promo__img promo__img--row2">${slot('promo-store', 'cover', '독서의 기록 다이어리 이미지', `${BANNER_DIR}/promo-store.jpg`)}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="t-h2">저널 <span class="t-en">News &amp; Features</span></h2>
        <a class="link-underline" href="${journalHref()}">전체 보기 View all</a>
      </div>
      <div class="grid-journal">
        ${JOURNAL.map((j) => `
          <a class="journal" href="${j.href}" target="_blank" rel="noopener">
            <div class="journal__img">${slot(j.slotId, 'cover', j.kicker, `${BANNER_DIR}/${j.slotId}.jpg`)}</div>
            <h3 class="journal__title">${esc(j.title)}</h3>
            <p class="journal__excerpt">${esc(j.excerpt)}</p>
            <div class="journal__meta">
              <span>${esc(j.kicker)}</span>
              <span class="journal__date">${esc(j.date)}</span>
            </div>
          </a>`).join('')}
      </div>
    </section>

    <section class="catalog">
      <div class="catalog__text">
        <h2 class="catalog__title">2026년 도서목록</h2>
        <p class="catalog__body">퍼블리온이 펴낸 ${BOOKS.length}종을 분야별로 정리한 목록입니다. 서점과 도서관, 단체 주문 담당자분께 보내드리는 자료를 그대로 공개합니다.</p>
      </div>
      <a class="btn catalog__btn" href="${SITE.catalogPdf}" target="_blank" rel="noopener">도서목록 내려받기 PDF</a>
    </section>

    <div id="newsletter-mount">${newsletterHTML(view)}</div>
  </main>`;
}

export function filterBooks(subject, sort) {
  const filtered = BOOKS.filter((b) => subject === '전체' || b.subject === subject);
  return filtered.slice().sort((a, b) =>
    sort === '신간순'   ? b.date.localeCompare(a.date) :
    sort === '가나다순' ? a.title.localeCompare(b.title, 'ko') :
    (a.price || 999999) - (b.price || 999999));
}

function booksHTML(view) {
  const { subject, sort } = view;
  const sorted = filterBooks(subject, sort);

  const chips = ['전체'].concat(SUBJECTS).map((x) => `
    <a class="chip" href="${booksHref(x, sort)}" aria-pressed="${x === subject}">${esc(x)}</a>`).join('');
  const sorts = SORTS.map((x) => `
    <a class="sort" href="${booksHref(subject, x)}" aria-pressed="${x === sort}">${esc(x)}</a>`).join('');

  const grid = sorted.map(decorate).map((b) => `
    <a class="book" href="${b.href}">
      <div class="card__cover card__cover--soft">${coverSlot(b)}</div>
      <div class="book__subject">${esc(b.subject)}</div>
      <div class="book__title">${esc(b.title)}</div>
      ${b.en ? `<div class="book__en">${esc(b.en)}</div>` : ''}
      <div class="book__byline">${esc(b.byline)}</div>
      <div class="book__price">${esc(b.priceLabel)}</div>
      ${b.award ? `<div class="book__award">${esc(b.award)}</div>` : ''}
    </a>`).join('');

  return `
  <main class="books">
    <nav class="t-crumb" aria-label="위치"><a href="/">홈</a> / 도서</nav>
    <h1 class="t-h1-page">도서 <span class="t-en">Books</span></h1>
    <div class="books__count">${sorted.length}종 · ${esc(subject)} · ${esc(sort)}</div>
    <div class="books__toolbar">
      <div class="chips">${chips}</div>
      <div class="sorts"><span>정렬</span>${sorts}</div>
    </div>
    <div class="grid-books">${grid}</div>
  </main>`;
}

/* 이 책을 다룬 글 — 블로그 글을 도서 상세에 붙입니다. */
function storyHTML(bookId) {
  const hrefs = POSTS_BY_BOOK[String(bookId)] || [];
  if (!hrefs.length) return '';
  const items = hrefs.map((h) => POSTS.find((p) => p.href === h)).filter(Boolean);
  if (!items.length) return '';
  return `
    <section class="story">
      <h2 class="story__head">이 책의 이야기 <span class="t-en">Behind the book</span></h2>
      <ul class="story__list">
        ${items.map((p) => `
          <li class="story__row">
            <a class="story__link" href="${p.href}" target="_blank" rel="noopener">
              <span class="story__source">${esc(p.source)}</span>
              <span class="story__title">${esc(p.title)}</span>
              <span class="story__date">${esc(p.date)}</span>
            </a>
          </li>`).join('')}
      </ul>
    </section>`;
}

function detailHTML(view) {
  const raw = BOOKS.find((b) => b.id === view.bookId) || BOOKS[0];
  const book = decorate(raw);
  const intro = INTROS[raw.id] ||
    '이 책의 소개글은 준비 중입니다. 먼저 궁금한 점이 있으시면 publion2030@gmail.com 으로 알려주세요.';

  const specs = [
    { k: '분야',     v: raw.subject },
    { k: '지은이',   v: raw.author },
    { k: '옮긴이',   v: raw.trans || '—' },
    { k: '발행일',   v: raw.date + ' · 퍼블리온' },
    { k: 'ISBN',     v: raw.isbn || '—' },
    { k: '정가',     v: money(raw.price) },
    { k: '수상·선정', v: raw.award || '—' },
  ];
  const related = BOOKS.filter((b) => b.subject === raw.subject && b.id !== raw.id).slice(0, 4).map(decorate);

  return `
  <main>
    <nav class="detail__back" aria-label="위치">
      <a href="${booksHref('전체')}">← 도서 목록으로 Back to books</a>
    </nav>

    <section class="detail__hero">
      <div class="detail__cover-wrap">
        <div class="detail__cover">${coverSlot(book, book.title + ' 표지')}</div>
      </div>
      <div class="detail__info">
        <div class="detail__subject">${esc(raw.subject)}</div>
        <h1 class="detail__title">${esc(book.title)}</h1>
        ${book.en ? `<div class="detail__en">${esc(book.en)}</div>` : ''}
        <div class="detail__byline">${esc(book.byline)}</div>
        <p class="detail__blurb">${esc(book.blurb)}</p>
        <div class="detail__price">${esc(book.priceLabel)}</div>
        <a class="detail__buy" href="${SITE.store}" target="_blank" rel="noopener">스마트스토어에서 구매</a>
      </div>
    </section>

    <section class="detail__body">
      <div>
        <h2 class="detail__sublabel">책 소개 About this book</h2>
        <p class="detail__prose">${esc(intro)}</p>

        <div class="buy">
          <h3 class="buy__title">구매하기 <span class="t-en">Where to buy</span></h3>
          <div class="buy__list">
            <a class="buy__item buy__item--own" href="${SITE.store}" target="_blank" rel="noopener">
              <span class="buy__name">퍼블리온 스마트스토어</span>
              <span class="buy__note">출판사 직영</span>
            </a>
            ${retailersFor(raw).map((r) => `
              <a class="buy__item" href="${r.href}" target="_blank" rel="noopener">
                <span class="buy__name">${esc(r.label)}</span>
                <span class="buy__note">${esc(book.priceLabel)}</span>
              </a>`).join('')}
          </div>
        </div>
      </div>
      <div>
        <h2 class="detail__sublabel">사양 Specifications</h2>
        ${specs.map((row) => `
          <div class="spec"><span class="spec__k">${esc(row.k)}</span><span>${esc(row.v)}</span></div>`).join('')}
      </div>
    </section>

    ${storyHTML(raw.id)}

    <section class="detail__related">
      <h2>함께 보면 좋은 책 <span class="t-en">Related titles</span></h2>
      <div class="grid-related">
        ${related.map((b) => `
          <a class="card" href="${b.href}">
            <div class="card__cover card__cover--soft related__cover">${coverSlot(b)}</div>
            <div class="card__title">${esc(b.title)}</div>
            <div class="related__price">${esc(b.priceLabel)}</div>
          </a>`).join('')}
      </div>
    </section>
  </main>`;
}

const STATS = () => [
  { n: '2020', label: '설립 Founded' },
  { n: String(BOOKS.length), label: '출간 도서 Titles' },
  { n: String(SUBJECTS.length), label: '분야 Subjects' },
  { n: String(BOOKS.filter((b) => b.award).length), label: '수상·선정 Awards' },
];

const PILLARS = [
  { title: '경제경영 · 자기계발',
    text: '김용섭 소장의 TREND INSIGHT 시리즈를 비롯해 변화의 방향을 먼저 말하는 책을 펴냅니다.' },
  { title: '인문',
    text: '문자와 문명, 명상과 의식을 다루는 번역서를 중심으로 목록을 쌓아 갑니다.' },
  { title: '문학',
    text: '2023년 김초엽 『파견자들』을 시작으로 한국 문학과 해외 소설을 함께 소개합니다.' },
];

function aboutHTML() {
  return `
  <main>
    <section class="about__lead">
      <div class="about__kicker">출판사 소개 · About</div>
      <h1 class="about__title">퍼블리온은 새롭고, 필요하고,<br>읽는 즐거움이 담긴 책을 만듭니다.</h1>
      <p class="about__sub">Publion would like to create novel, necessary, and enjoyable books.</p>
    </section>

    <section class="about__stats">
      ${STATS().map((s) => `
        <div class="stat">
          <div class="stat__n">${esc(s.n)}</div>
          <div class="stat__label">${esc(s.label)}</div>
        </div>`).join('')}
    </section>

    <section class="about__what">
      <h2 class="t-label t-label--accent" style="letter-spacing:.18em">우리가 하는 일 What we do</h2>
      <div>
        ${PILLARS.map((p) => `
          <div class="pillar">
            <div class="pillar__title">${esc(p.title)}</div>
            <div class="pillar__text">${esc(p.text)}</div>
          </div>`).join('')}
      </div>
    </section>

    <section class="about__contact">
      <div>
        <h2 class="detail__sublabel">투고 안내 Submissions</h2>
        <p>기획안, 목차, 원고 일부를 이메일로 보내주세요. 검토 후 회신드립니다.</p>
        <div class="about__strong"><a href="mailto:${SITE.email}">${SITE.email}</a></div>
      </div>
      <div>
        <h2 class="detail__sublabel">문의 Contact</h2>
        <p>판권·강연·제휴 문의는 대표 직통으로 연락 바랍니다.</p>
        <div class="about__strong">${SITE.ceo} 대표 · <a href="tel:01032070033">${SITE.tel}</a></div>
        <div class="about__fine">팩스 032-232-6300<br>출판등록 2020년 2월 26일 ${SITE.regNo}</div>
      </div>
    </section>
  </main>`;
}

export function authorList() {
  const names = [];
  BOOKS.forEach((b) => { if (b.author && !names.includes(b.author)) names.push(b.author); });
  names.sort((x, y) => BOOKS.filter((b) => b.author === y).length - BOOKS.filter((b) => b.author === x).length);
  return names.map((name) => {
    const list = BOOKS.filter((b) => b.author === name);
    return { name, role: list[0].subject, count: list.length, href: bookHref(list[0].id) };
  });
}

/* 저널 — 대표 블로그와 퍼블리온 블로그에 올린 글 전부.
   누르면 해당 블로그로 이동합니다. */
function journalHTML() {
  const groups = [
    { source: '대표의 기록', lead: '박선영 대표가 쓰는 작은회사 경영수업입니다.', href: SITE.tistory },
    { source: '퍼블리온 블로그', lead: '신간 소식, 저자 인터뷰, 북토크와 행사 기록입니다.', href: SITE.blog },
  ];
  return `
  <main class="journal-page">
    <nav class="t-crumb" aria-label="위치"><a href="/">홈</a> / 저널</nav>
    <h1 class="t-h1-page">저널 <span class="t-en">Journal</span></h1>
    <p class="journal-page__lead">퍼블리온이 블로그에 올린 글 ${POSTS.length}편입니다. 제목을 누르면 해당 글로 이동합니다.</p>

    ${groups.map((g) => {
      const list = POSTS.filter((p) => p.source === g.source);
      if (!list.length) return '';
      return `
      <section class="journal-group">
        <div class="journal-group__head">
          <div>
            <h2 class="journal-group__title">${esc(g.source)}</h2>
            <p class="journal-group__lead">${esc(g.lead)}</p>
          </div>
          <a class="link-underline" href="${g.href}" target="_blank" rel="noopener">블로그 가기 Visit</a>
        </div>
        <ul class="journal-list">
          ${list.map((p) => `
            <li class="journal-list__row">
              <a class="journal-list__link" href="${p.href}" target="_blank" rel="noopener">
                <span class="journal-list__date">${esc(p.date)}</span>
                <span class="journal-list__title">${esc(p.title)}</span>
              </a>
            </li>`).join('')}
        </ul>
      </section>`;
    }).join('')}
  </main>`;
}

function authorsHTML() {
  const cards = authorList().map((a) => `
    <a class="author" href="${a.href}">
      <div class="author__avatar" aria-hidden="true"></div>
      <div class="author__name">${esc(a.name)}</div>
      <div class="author__role">${esc(a.role)}</div>
      <div class="author__count">${a.count}종</div>
    </a>`).join('');
  return `
  <main class="authors">
    <nav class="t-crumb" aria-label="위치"><a href="/">홈</a> / 저자</nav>
    <h1 class="t-h1-page">저자 <span class="t-en">Authors</span></h1>
    <div class="grid-authors">${cards}</div>
  </main>`;
}

/* ── 푸터 ───────────────────────────────────────────────────── */

const FOOTER_COLS = [
  { title: '도서 Books',
    links: SUBJECTS.map((x) => ({ label: x, href: booksHref(x) }))
      .concat([{ label: '출간 예정', href: booksHref('전체') }]) },
  { title: '출판사 About', links: [
    { label: '소개',     href: aboutHref() },
    { label: '투고 안내', href: aboutHref() },
    { label: '판권 문의', href: aboutHref() },
    { label: '채용',     href: null },
  ] },
  { title: '구매 Buy', links: [
    { label: '퍼블리온 스마트스토어', href: SITE.store, external: true },
    { label: '교보문고', href: retailersFor()[0].href, external: true },
    { label: '예스24',  href: retailersFor()[1].href, external: true },
    { label: '알라딘',  href: retailersFor()[2].href, external: true },
  ] },
];

function footerHTML() {
  const cols = FOOTER_COLS.map((col) => `
    <div>
      <div class="footer__coltitle">${esc(col.title)}</div>
      <div class="footer__links">
        ${col.links.map((l) => l.href
          ? `<a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`
          : `<span>${esc(l.label)}</span>`).join('')}
      </div>
    </div>`).join('');

  return `
  <footer class="footer">
    <div class="footer__top">
      <div>
        <div class="footer__brand">
          <svg width="30" height="23" viewBox="0 0 34 26" fill="none" aria-hidden="true">
            <path d="${LOGO_PATH}" fill="#FFFFFF"></path>
          </svg>
          <div class="footer__wordmark">Publion</div>
        </div>
        <p class="footer__contact">퍼블리온 · ${SITE.ceo} 대표<br>${SITE.tel}<br>${SITE.email}</p>
        <div class="footer__social">
          ${SOCIAL.map((x) => `<a href="${x.href}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join('')}
        </div>
      </div>
      ${cols}
    </div>
    <div class="footer__bottom">
      <span>© 2026 퍼블리온 Publion</span>
      <span>개인정보처리방침 · 이용약관 · Instagram · YouTube</span>
    </div>
  </footer>`;
}

/* ── 조립 ───────────────────────────────────────────────────── */

export function bodyHTML(view) {
  switch (view.page) {
    case 'books':   return booksHTML(view);
    case 'detail':  return detailHTML(view);
    case 'about':   return aboutHTML();
    case 'authors': return authorsHTML();
    case 'journal': return journalHTML();
    default:        return homeHTML(view);
  }
}

export function pageHTML(view) {
  return headerHTML(view) + bodyHTML(view) + footerHTML();
}

/* 페이지별 제목·설명·정규주소. 미리 찍을 때와 브라우저에서 함께 씁니다. */
export function meta(view) {
  if (view.page === 'detail') {
    const b = BOOKS.find((x) => x.id === view.bookId) || BOOKS[0];
    const intro = INTROS[b.id] || b.sub || '';
    return {
      title: `${b.title} · ${b.author} — 퍼블리온`,
      description: intro.slice(0, 155),
      path: bookHref(b.id),
      image: `${COVER_DIR}/cover-${b.id}.jpg`,
    };
  }
  if (view.page === 'books') {
    return {
      title: '도서 Books — 퍼블리온',
      description: `퍼블리온이 펴낸 ${BOOKS.length}종을 분야와 출간순으로 봅니다. 경제경영·자기계발·인문·문학·어린이.`,
      path: '/books/',
    };
  }
  if (view.page === 'about') {
    return {
      title: '출판사 소개 About — 퍼블리온',
      description: '퍼블리온은 새롭고, 필요하고, 읽는 즐거움이 담긴 책을 만듭니다. 2020년 설립, 박선영 대표. 투고와 판권 문의 안내.',
      path: '/about/',
    };
  }
  if (view.page === 'journal') {
    return {
      title: '저널 Journal — 퍼블리온',
      description: `퍼블리온이 블로그에 올린 글 ${POSTS.length}편. 대표가 쓰는 작은회사 경영수업, 신간 소식, 저자 인터뷰와 북토크 기록.`,
      path: '/journal/',
    };
  }
  if (view.page === 'authors') {
    return {
      title: '저자 Authors — 퍼블리온',
      description: `퍼블리온과 함께한 저자 ${authorList().length}명. 김용섭, 김초엽, 루퍼트 스파이라, 안예진 등.`,
      path: '/authors/',
    };
  }
  return {
    title: '퍼블리온 Publion — 경제경영 · 인문 · 문학',
    description: '퍼블리온은 새롭고, 필요하고, 읽는 즐거움이 담긴 책을 만듭니다. 2020년 설립 이후 41종을 펴냈습니다.',
    path: '/',
  };
}
