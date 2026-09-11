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
import { NOTES } from './notes.js';
import { VIDEOS, PRESS, YOUTUBE_CHANNEL } from './media.js';
import { EXTERNAL_LINKS } from './external.js';
import { TOC, AUTHOR_BIO } from './contents.js';

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
  founded: '2020-02-26',          // 출판등록일
  regNo: '제2022-000096호',        // 출판등록번호
  // 사업자등록번호는 하나온 진단컨설팅 보고서(문서 확인)에서 가져왔고
  // bizno.net 이 상호·대표·개업일까지 같게 확인해 줬습니다.
  // 개업일 2020-04-01 은 위 출판등록일(2020-02-26)과 별개 항목입니다.
  bizNo: '867-78-00208',
  // 주소는 대표 확인값입니다. 온라인 기업명부(bizno·사람인)에는
  // 서울 영등포 주소가 남아 있는데 옛 소재지입니다.
  // 컨설팅 문서의 팩스 032-232-6300 도 인천 지역번호로 이쪽과 맞습니다.
  // 시·군·구까지만 씁니다.
  address: '인천광역시 남동구',
  catalogPdf: '/assets/catalog/publion-catalog-2026.pdf',
  // 뉴스레터 구독 폼 (외부 서비스).
  // 비어 있으면 뉴스레터 자리는 '준비 중'으로 남고,
  // 개인정보처리방침도 '수집 없음' 문안을 그대로 씁니다.
  // 주소를 넣으면 구독 버튼과 방침 문안이 함께 켜집니다.
  newsletterForm: '',
  // 폼을 어느 서비스로 만들었는지 (예: '구글 폼', 'Tally').
  // 방침에 '어디에 저장되는지'를 밝혀야 하므로 주소와 함께 채웁니다.
  newsletterFormName: '',
  // 보관 기간 (대표 결정 2026-09-08). 폼 주소가 들어와야 방침에 나타납니다.
  newsletterRetention: '구독을 취소하실 때까지',
};

export const SORTS = ['신간순', '가나다순'];

/* 기준 경로 — 사이트가 도메인 루트가 아니라 하위 경로에 놓일 때 씁니다.
   (예: GitHub Pages 의 /publion-website/)
   브라우저는 head 에 심어둔 window.__BASE__ 를, 빌드는 BASE_PATH 환경변수를 읽습니다.
   비어 있으면 지금까지와 똑같이 루트 기준으로 동작합니다. */
export const BASE =
  (typeof window !== 'undefined' && window.__BASE__) ||
  (typeof process !== 'undefined' && process.env && process.env.BASE_PATH) || '';

export const COVER_DIR = BASE + '/assets/img/covers';
export const BANNER_DIR = BASE + '/assets/img/banners';

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

export const homeHref = () => BASE + '/';
export const aboutHref = () => BASE + '/about/';
export const authorsHref = () => BASE + '/authors/';
export const journalHref = () => BASE + '/journal/';
export const bookHref = (id) => `${BASE}/book/${id}/`;

/* 영문 섹션 — 해외 에이전시·출판사가 보는 화면입니다.
   AI·검색 크롤러가 자바스크립트를 실행하지 않으므로 한국어 화면과 똑같이
   주소마다 정적으로 찍습니다. */
export const enHomeHref   = () => BASE + '/en/';
export const enBooksHref  = () => BASE + '/en/books/';
export const enRightsHref = () => BASE + '/en/rights/';

/* 같은 내용의 반대 언어 주소. 상단 KO/EN 전환에 씁니다. */
export function counterpartHref(view) {
  if (view.lang === 'en') {
    return view.page === 'en-books' ? booksHref('전체') : homeHref();
  }
  return view.page === 'books' ? enBooksHref() : enHomeHref();
}

export function booksHref(subject, sort) {
  const q = [];
  if (subject && subject !== '전체') q.push('subject=' + encodeURIComponent(subject));
  if (sort && sort !== '신간순') q.push('sort=' + encodeURIComponent(sort));
  return BASE + '/books/' + (q.length ? '?' + q.join('&') : '');
}

/* ── 조각 ───────────────────────────────────────────────────── */

/* 이미지 자리.
 * 예전에는 <image-slot> 커스텀 요소를 찍고 자바스크립트가 <img> 를 만들었습니다.
 * 두 가지가 잘못됐습니다.
 *   1. 클릭하면 파일 선택 창이 떴습니다. 표지를 눌러도 상세로 넘어가지 않았습니다.
 *   2. 자바스크립트를 실행하지 않는 크롤러에게는 이미지가 아예 없었습니다.
 * 이제 서버에서 <img> 를 그대로 찍습니다. 클릭은 감싸는 <a> 가 받습니다.
 */
const slot = (id, fit, placeholder, src, eager) => {
  const alt = esc(placeholder);
  if (!src) {
    return `<span class="image-slot" data-slot="${esc(id)}">` +
           `<span class="image-slot__empty">${alt}</span></span>`;
  }
  // fit=contain 은 표지입니다. 3:4 칸에 맞추면 판형이 다른 표지마다
  // 회색 여백이 남으므로, 높이만 맞추고 너비는 표지 원래 비율을 따릅니다.
  const cls = fit === 'contain' ? 'image-slot image-slot--fit' : 'image-slot';
  return `<span class="${cls}" data-slot="${esc(id)}">` +
    `<img class="image-slot__img" src="${esc(src)}" alt="${alt}"` +
    ` style="object-fit:${fit}"` +
    (eager
      ? ' loading="eager" decoding="async" fetchpriority="high"'
      : ' loading="lazy" decoding="async"') +
    `></span>`;
};

/* eager 는 첫 화면에 보이는 표지에만 붙입니다.
 * 지연 로딩이면 회색 자리가 잠깐 비쳤다가 그림이 들어옵니다. */
const coverSlot = (b, placeholder, eager) =>
  slot(b.slotId, 'contain', placeholder || b.title, b.cover, eager);

export const SOCIAL = [
  { label: 'Instagram',    href: SITE.instagram },
  { label: 'Facebook',     href: SITE.facebook },
  { label: 'YouTube',      href: SITE.youtube },
  { label: '네이버 블로그', href: SITE.blog },
  { label: '대표 블로그',   href: SITE.tistory },
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

export const EN_NAV = [
  { label: 'Catalogue', href: enBooksHref(),  match: 'en-books' },
  { label: 'Rights',    href: enRightsHref(), match: 'en-rights' },
  { label: 'About',     href: enHomeHref(),   match: 'en-home' },
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
  const en = view.lang === 'en';
  const items = en ? EN_NAV : NAV_ITEMS;
  const currentIndex = items.findIndex((n) => n.match === view.page);
  // 좁은 화면에서는 영문 병기를 숨깁니다. 그래서 영문만 따로 감쌉니다.
  // '도서 Books' → 도서 + <span>Books</span>
  const splitLabel = (label) => {
    const m = /^(.*?)\s+([A-Za-z][A-Za-z ]*)$/.exec(label);
    return m
      ? `${esc(m[1])} <span class="nav__en">${esc(m[2])}</span>`
      : esc(label);
  };
  const nav = items.map((n, i) => `
    <a class="nav__item" href="${n.href}" data-nav="${i}"${n.external ? ' target="_blank" rel="noopener"' : ''}
       ${i === currentIndex ? 'aria-current="page"' : ''}>${splitLabel(n.label)}</a>`).join('');

  /* KO/EN 전환 — 지금 보는 언어는 글자로, 반대 언어는 링크로 둡니다. */
  const other = counterpartHref(view);
  const lang = en
    ? `<a class="topbar__lang" href="${other}">KO</a><span class="topbar__sep" aria-hidden="true">/</span><span class="topbar__lang topbar__lang--on">EN</span>`
    : `<span class="topbar__lang topbar__lang--on">KO</span><span class="topbar__sep" aria-hidden="true">/</span><a class="topbar__lang" href="${other}">EN</a>`;

  return `
  <div class="topbar">
    <span>${en
      ? 'Business &middot; Humanities &middot; Literature &nbsp;·&nbsp; Books for the next decade'
      : '경제경영 · 인문 · 문학 &nbsp;·&nbsp; Books for the next decade'}</span>
    <div class="topbar__right">
      ${lang}
    </div>
  </div>

  <header class="header" id="site-header">
    <div class="header__bar">
      <div class="header__left"><a href="${en ? enBooksHref() : booksHref('전체') + '#book-search'}">${en ? 'Catalogue' : '검색 Search'}</a></div>
      <a class="header__brand" href="${en ? enHomeHref() : BASE + '/'}" aria-label="${en ? 'Publion home' : '퍼블리온 홈'}">
        <span class="brand-logo-crop brand-logo-crop--header" aria-hidden="true">
          <img src="${BASE}/assets/img/publion-logo-green.png" alt="" decoding="async">
        </span>
      </a>
      <div class="header__right"></div>
    </div>
    <nav class="nav" aria-label="${en ? 'Main menu' : '주요 메뉴'}">${nav}</nav>
    <div id="mega-mount">${!en && view.megaOpen ? megaHTML() : ''}</div>
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

/* 뉴스레터 — 준비 중.
 *
 * 입력 양식을 걷어냈습니다. 발송 서비스에 연결되기 전까지는 주소를 받아도
 * 출판사에 닿지 않는데, 화면에는 접수됐다고 나왔습니다. 지키지 못할 약속을
 * 하느니 받지 않는 편이 낫습니다.
 *
 * 발송 서비스(스티비·메일침프 등)를 붙일 때 이 함수를 다시 양식으로 되돌리고
 * 그쪽 폼 action 을 연결하면 됩니다. localStorage 는 쓰지 않습니다.
 */
export function newsletterHTML() {
  /* 구독은 외부 폼 서비스로 받습니다 (대표 결정 2026-09-08).
     정적 사이트라 주소를 저장할 곳이 없어, 폼 주소를 SITE.newsletterForm 에 넣으면
     아래 신청 버튼이 열리고 비어 있으면 지금까지처럼 '준비 중'으로 남습니다. */
  const form = SITE.newsletterForm;

  const right = form
    ? `<a class="newsletter__cta" href="${form}" target="_blank" rel="noopener">구독 신청 <span class="t-en">Subscribe</span></a>
       <p class="newsletter__aside">지난 소식은 <a href="${SITE.blog}" target="_blank" rel="noopener">네이버 블로그</a>에서 보실 수 있습니다.</p>`
    : `<p class="newsletter__soon">준비 중 <span class="t-en">Coming soon</span></p>
       <p class="newsletter__aside">그동안의 소식은 <a href="${SITE.blog}" target="_blank" rel="noopener">네이버 블로그</a>에서 보실 수 있습니다.</p>`;

  return `
  <section class="newsletter">
    <div>
      <h2 class="newsletter__title">뉴스레터</h2>
      <p class="newsletter__text">신간 소식과 편집자가 고른 문장을 전하는 뉴스레터입니다.</p>
    </div>
    <div>
      ${right}
    </div>
  </section>`;
}

/* ── 화면 ───────────────────────────────────────────────────── */

const cardHTML = (b) => `
  <a class="card" href="${b.href}">
    <div class="card__cover">${coverSlot(b)}</div>
    <div class="card__title">${esc(b.title)}</div>
    <div class="card__byline">${esc(b.byline)}</div>
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
        <h2 class="promo__title">서점에서 만나기</h2>
        <p class="promo__body">퍼블리온의 책은 온라인 서점에서 만나실 수 있습니다.</p>
        <div class="detail__buy-list">
          ${retailersFor().map((r) => `
            <a class="detail__buy-item" href="${r.href}" target="_blank" rel="noopener">${esc(r.label)}</a>`).join('')}
        </div>
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
      <a class="btn catalog__btn" href="${BASE}${SITE.catalogPdf}" target="_blank" rel="noopener">도서목록 내려받기 PDF</a>
    </section>

    <div id="newsletter-mount">${newsletterHTML(view)}</div>
  </main>`;
}

/* 41종이라 서버 없이 앞에서 거릅니다.
   제목·부제·지은이·옮긴이·분야를 훑고, 띄어쓰기는 무시합니다. */
const squash = (t) => (t || '').toLowerCase().replace(/\s+/g, '');

export function matchesQuery(b, q) {
  if (!q) return true;
  const needle = squash(q);
  return [b.title, b.sub, b.author, b.trans, b.subject]
    .some((f) => squash(f).includes(needle));
}

export function filterBooks(subject, sort, q) {
  const filtered = BOOKS.filter((b) =>
    (subject === '전체' || b.subject === subject) && matchesQuery(b, q));
  return filtered.slice().sort((a, b) =>
    sort === '신간순' ? b.date.localeCompare(a.date)
                      : a.title.localeCompare(b.title, 'ko'));
}

function booksHTML(view) {
  const { subject, sort } = view;
  const sorted = filterBooks(subject, sort, view.q);

  const q = view.q || '';
  const search = `
    <form class="search" id="book-search" role="search" action="${booksHref('전체')}" method="get">
      <label class="u-sr-only" for="book-search-input">도서 검색</label>
      <input class="search__input" id="book-search-input" name="q" type="search"
             value="${esc(q)}" placeholder="제목 · 지은이 · 분야 Search" autocomplete="off">
      <button class="search__go" type="submit">검색 Search</button>
      ${q ? `<a class="search__clear" href="${booksHref(subject, sort)}">지우기 Clear</a>` : ''}
    </form>`;

  const chips = ['전체'].concat(SUBJECTS).map((x) => `
    <a class="chip" href="${booksHref(x, sort)}" aria-pressed="${x === subject}">${esc(x)}</a>`).join('');
  const sorts = SORTS.map((x) => `
    <a class="sort" href="${booksHref(subject, x)}" aria-pressed="${x === sort}">${esc(x)}</a>`).join('');

  // .grid-books 는 4열이므로 첫 줄은 앞 4장입니다.
  const grid = sorted.map(decorate).map((b, i) => `
    <a class="book" href="${b.href}">
      <div class="card__cover card__cover--soft">${coverSlot(b, null, i < 4)}</div>
      <div class="book__subject">${esc(b.subject)}</div>
      <div class="book__title">${esc(b.title)}</div>
      ${b.en ? `<div class="book__en">${esc(b.en)}</div>` : ''}
      <div class="book__byline">${esc(b.byline)}</div>
      ${b.award ? `<div class="book__award">${esc(b.award)}</div>` : ''}
    </a>`).join('');

  return `
  <main class="books">
    <nav class="t-crumb" aria-label="위치"><a href="${BASE}/">홈</a> / 도서</nav>
    <h1 class="t-h1-page">도서 <span class="t-en">Books</span></h1>
    <div class="books__count">${sorted.length}종 · ${esc(subject)}${q ? ` · "${esc(q)}"` : ''} · ${esc(sort)}</div>
    ${search}
    <div class="books__toolbar">
      <div class="chips">${chips}</div>
      <div class="sorts"><span>정렬</span>${sorts}</div>
    </div>
    ${sorted.length
      ? `<div class="grid-books">${grid}</div>`
      : `<p class="books__empty">찾는 책이 없습니다. 다른 낱말로 찾아보시거나 <a href="${booksHref('전체')}">전체 목록</a>을 보세요.</p>`}
  </main>`;
}

/* 목차 — 길이가 제각각이라 12줄이 넘으면 접습니다.
   details 를 쓰므로 자바스크립트 없이도 펼쳐집니다. */
function tocHTML(bookId) {
  const raw = TOC[String(bookId)];
  if (!raw) return '';
  const lines = raw.split('\n').filter(Boolean);
  const list = (arr) => arr.map((l) => `<li>${esc(l)}</li>`).join('');
  const head = lines.slice(0, 12);
  const rest = lines.slice(12);
  return `
    <section class="toc">
      <h2 class="detail__sublabel">목차 <span class="t-en">Contents</span></h2>
      <ol class="toc__list">${list(head)}</ol>
      ${rest.length ? `
        <details class="toc__more">
          <summary>나머지 ${rest.length}줄 더 보기</summary>
          <ol class="toc__list" start="13">${list(rest)}</ol>
        </details>` : ''}
    </section>`;
}

/* 저자 소개 — 지은이·옮긴이가 여럿이면 예스24 원문이 이미 나눠 놓았습니다.
   '저 :' '역 :' 로 시작하는 줄을 사람 단위 구분으로 씁니다. */
function authorHTML(bookId) {
  const raw = AUTHOR_BIO[String(bookId)];
  if (!raw) return '';
  const people = [];
  for (const line of raw.split('\n')) {
    if (/^(저|역|글|그림|사진|감수|편)\s*:/.test(line)) people.push({ name: line, body: [] });
    else if (people.length) people[people.length - 1].body.push(line);
  }
  const blocks = people.length
    ? people.map((p) => `
        <div class="author-bio__one">
          <div class="author-bio__name">${esc(p.name)}</div>
          <p class="author-bio__text">${esc(p.body.join(' '))}</p>
        </div>`).join('')
    : `<p class="author-bio__text">${esc(raw.replace(/\n/g, ' '))}</p>`;
  return `
    <section class="author-bio">
      <h2 class="detail__sublabel">저자 소개 <span class="t-en">About the author</span></h2>
      ${blocks}
    </section>`;
}

/* 편집자·대표의 말 — 왜 이 책을 펴냈는지. */
function noteHTML(bookId) {
  const note = NOTES[bookId];
  if (!note) return '';
  return `
    <section class="note">
      <div class="note__inner">
        <h2 class="note__head">편집자·대표의 말 <span class="t-en">Why we published this</span></h2>
        <p class="note__body">${esc(note)}</p>
      </div>
    </section>`;
}

/* 영상 — 유튜브를 바로 불러오지 않고 섬네일만 먼저 보여줍니다.
   누르면 그때 재생기를 붙입니다. 페이지를 열 때마다 유튜브를 부르지 않기 위해서입니다. */
function videoHTML(bookId, title) {
  const list = VIDEOS[String(bookId)] || [];
  if (!list.length) return '';
  return `
    <section class="video">
      <div class="video__head">
        <h2 class="t-h2" style="font-size:24px">영상 <span class="t-en">Watch</span></h2>
        <a class="link-underline" href="${YOUTUBE_CHANNEL}" target="_blank" rel="noopener">채널 가기 YouTube</a>
      </div>
      <div class="video__grid">
        ${list.map((v) => `
          <button type="button" class="video__item" data-video="${esc(v.id)}"
                  aria-label="${esc(v.title)} 재생">
            <span class="video__thumb">
              <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg"
                   alt="" loading="lazy" decoding="async">
              <span class="video__play" aria-hidden="true">▶</span>
            </span>
            <span class="video__title">${esc(v.title)}</span>
            <span class="video__date">${esc(v.date)}</span>
          </button>`).join('')}
      </div>
    </section>`;
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

const EXTERNAL_KIND = {
  video: '영상',
  article: '글',
  review: '리뷰',
};

/* 외부 소개 — 공식 채널 바깥에서 책을 다룬 콘텐츠입니다. */
function externalHTML(bookId) {
  const list = EXTERNAL_LINKS[String(bookId)] || [];
  if (!list.length) return '';
  return `
    <section class="external">
      <h2 class="external__head">외부 소개 <span class="t-en">External reviews</span></h2>
      <ul class="external__list">
        ${list.map((p) => `
          <li class="external__row">
            <a class="external__link" href="${p.href}" target="_blank" rel="noopener">
              <span class="external__source">${esc(p.source)} · ${esc(EXTERNAL_KIND[p.type] || '소개')}</span>
              <span class="external__title">${esc(p.title)}</span>
              <span class="external__date">${esc(p.date)}</span>
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
    { k: '쪽수·판형', v: raw.pages && raw.mm ? `${raw.pages}쪽 · ${raw.mm}` : '—' },
    { k: 'ISBN',     v: raw.isbn || '—' },
    { k: '수상·선정', v: raw.award || '—' },
  ];
  const press = PRESS[String(raw.id)] || [];
  if (press.length) specs.push({ k: '미디어·기관 추천', v: press.join(' · ') });
  const related = BOOKS.filter((b) => b.subject === raw.subject && b.id !== raw.id).slice(0, 4).map(decorate);

  return `
  <main>
    <nav class="detail__back" aria-label="위치">
      <a href="${booksHref('전체')}">← 도서 목록으로 Back to books</a>
    </nav>

    <section class="detail__hero">
      <div class="detail__cover-wrap">
        <div class="detail__cover">${coverSlot(book, book.title + ' 표지', true)}</div>
      </div>
      <div class="detail__info">
        <div class="detail__subject">${esc(raw.subject)}</div>
        <h1 class="detail__title">${esc(book.title)}</h1>
        ${book.en ? `<div class="detail__en">${esc(book.en)}</div>` : ''}
        <div class="detail__byline">${esc(book.byline)}</div>
        <p class="detail__blurb">${esc(book.blurb)}</p>
        <div class="detail__buy-block">
          <div class="detail__buy-label">구매하기 <span class="t-en">Where to buy</span></div>
          <div class="detail__buy-list">
            ${retailersFor(raw).map((r) => `
              <a class="detail__buy-item" href="${r.href}" target="_blank" rel="noopener">${esc(r.label)}</a>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="detail__body">
      <div>
        <h2 class="detail__sublabel">책 소개 About this book</h2>
        <p class="detail__prose">${esc(intro)}</p>
      </div>
      <div>
        <h2 class="detail__sublabel">사양 Specifications</h2>
        ${specs.map((row) => `
          <div class="spec"><span class="spec__k">${esc(row.k)}</span><span>${esc(row.v)}</span></div>`).join('')}
      </div>
    </section>

    <div class="detail__cols">
      ${tocHTML(raw.id)}
      ${authorHTML(raw.id)}
    </div>

    ${noteHTML(raw.id)}
    ${videoHTML(raw.id, book.title)}
    ${storyHTML(raw.id)}
    ${externalHTML(raw.id)}

    <section class="detail__related">
      <h2>함께 보면 좋은 책 <span class="t-en">Related titles</span></h2>
      <div class="grid-related">
        ${related.map((b) => `
          <a class="card" href="${b.href}">
            <div class="card__cover card__cover--soft related__cover">${coverSlot(b)}</div>
            <div class="card__title">${esc(b.title)}</div>
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

/* 강연 가능 저자 — 대표 확인 명단이 오면 이 배열만 채웁니다.
   이름은 data.js 의 author 값과 정확히 같아야 짝이 맞습니다.
   topic 은 선택입니다. 비어 있으면 저자 페이지에 아무 표시도 나오지 않습니다.
   예: { name: '김용섭', topic: '트렌드·미래 전망' }
   문의는 대표 메일로 연결합니다. */
export const SPEAKERS = [];

const speakerOf = (name) => SPEAKERS.find((x) => x.name === name);

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
    <nav class="t-crumb" aria-label="위치"><a href="${BASE}/">홈</a> / 저널</nav>
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
  const cards = authorList().map((a) => {
    const sp = speakerOf(a.name);
    return `
    <a class="author" href="${a.href}">
      <div class="author__avatar" aria-hidden="true"></div>
      <div class="author__name">${esc(a.name)}${sp ? '<span class="author__talk">강연</span>' : ''}</div>
      <div class="author__role">${esc(a.role)}</div>
      <div class="author__count">${a.count}종</div>
    </a>`;
  }).join('');

  /* 강연 안내는 명단이 있을 때만 나옵니다. 비어 있으면 지금까지와 똑같습니다. */
  const talk = SPEAKERS.length ? `
    <section class="talk">
      <h2 class="talk__head">저자 강연 <span class="t-en">Author talks</span></h2>
      <p class="talk__lead">아래 저자는 강연·북토크·기업 특강을 진행합니다.
        일정과 주제는 메일로 문의해 주세요.</p>
      <ul class="talk__list">
        ${SPEAKERS.map((sp) => `
          <li class="talk__row">
            <span class="talk__name">${esc(sp.name)}</span>
            ${sp.topic ? `<span class="talk__topic">${esc(sp.topic)}</span>` : ''}
          </li>`).join('')}
      </ul>
      <a class="talk__cta" href="mailto:${SITE.email}?subject=${encodeURIComponent('강연 문의')}">강연 문의 <span class="t-en">Request a talk</span></a>
    </section>` : '';

  return `
  <main class="authors">
    <nav class="t-crumb" aria-label="위치"><a href="${BASE}/">홈</a> / 저자</nav>
    <h1 class="t-h1-page">저자 <span class="t-en">Authors</span></h1>
    <div class="grid-authors">${cards}</div>
    ${talk}
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
    { label: '판권 문의 Rights', href: enRightsHref() },

  ] },
  { title: '구매 Buy', links: [
    { label: '교보문고', href: retailersFor()[0].href, external: true },
    { label: '예스24',  href: retailersFor()[1].href, external: true },
    { label: '알라딘',  href: retailersFor()[2].href, external: true },
  ] },
];

const EN_FOOTER_COLS = [
  { title: 'Publion', links: [
    { label: 'About',     href: enHomeHref() },
    { label: 'Catalogue', href: enBooksHref() },
    { label: 'Rights',    href: enRightsHref() },
  ] },
  { title: 'Korean site', links: [
    { label: '한국어 홈', href: homeHref() },
    { label: '도서 목록', href: booksHref('전체') },
  ] },
  { title: 'Follow', links: [
    { label: 'Instagram', href: SITE.instagram, external: true },
    { label: 'YouTube',   href: SITE.youtube,   external: true },
  ] },
];

function footerHTML(view) {
  const en = view && view.lang === 'en';
  const cols = (en ? EN_FOOTER_COLS : FOOTER_COLS).map((col) => `
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
          <span class="brand-logo-crop brand-logo-crop--footer">
            <img src="${BASE}/assets/img/publion-logo-white.png" alt="퍼블리온 Publion" loading="lazy" decoding="async">
          </span>
        </div>
        <p class="footer__contact">${en
          ? `Publion &middot; Park Sun-young, Publisher<br>${SITE.email}`
          : `퍼블리온 · ${SITE.ceo} 대표<br>${SITE.tel}<br>${SITE.email}`}</p>
        ${en ? '' : `<div class="footer__social">
          ${SOCIAL.map((x) => `<a href="${x.href}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join('')}
        </div>`}
      </div>
      ${cols}
    </div>
    <div class="footer__biz">
      ${en
        ? `<span>Publion Publishing</span><span>Est. 2020</span><span>Namdong-gu, Incheon, Republic of Korea</span>`
        : `<span>상호 ${esc(SITE.name)}</span>
      <span>대표 ${esc(SITE.ceo)}</span>
      <span>사업자등록번호 ${esc(SITE.bizNo)}</span>
      <span>${esc(SITE.address)}</span>`}
    </div>
    <div class="footer__bottom">
      <span>© 2026 퍼블리온 Publion</span>
      <span>
        <a href="${BASE}/privacy/">${en ? 'Privacy' : '개인정보처리방침'}</a> ·
        <a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a> ·
        <a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube</a>
      </span>
    </div>
  </footer>`;
}

/* 개인정보처리방침.
 * 지어낸 문구가 아니라 이 사이트가 실제로 하는 일만 적습니다.
 * 확인한 사실: 폼 0개 · 쿠키 0개 · 분석 도구 0개 · 회원 기능 없음.
 * 외부에서 받아오는 것은 구글 폰트와 유튜브 섬네일 둘뿐이고, 그 서버들은
 * 방문자 IP 를 보게 되므로 그대로 밝힙니다.
 * 수집을 시작하면(예: 뉴스레터 재개) 이 글도 함께 고쳐야 합니다. */
function privacyHTML() {
  /* 뉴스레터 폼이 연결되면 '수집 없음' 문안을 쓸 수 없습니다.
     주소가 들어오는 순간 아래 문안이 함께 바뀌도록 묶어 둡니다.
     그래야 방침과 실제 동작이 어긋나는 일이 생기지 않습니다. */
  const nl = SITE.newsletterForm;
  const svc = SITE.newsletterFormName || '외부 폼 서비스';

  const lead = nl
    ? '퍼블리온 홈페이지는 뉴스레터 구독을 신청하신 분의 이메일 주소만 받습니다. 그 밖에는 방문자의 개인정보를 수집하지 않습니다. 아래는 이 사이트가 실제로 하는 일을 그대로 적은 것입니다.'
    : '퍼블리온 홈페이지는 방문자의 개인정보를 수집하지 않습니다. 아래는 이 사이트가 실제로 하는 일을 그대로 적은 것입니다.';

  const collect = nl
    ? `뉴스레터 구독을 신청하실 때 이메일 주소를 받습니다. 신청은 홈페이지가 아니라 ${svc}에서 이루어지고, 받은 주소도 ${svc}에 저장됩니다. 이 홈페이지 자체에는 회원가입, 로그인, 문의 양식이 없습니다.`
    : '없습니다. 회원가입, 로그인, 문의 양식, 뉴스레터 구독 같은 입력 기능을 두지 않았습니다.';

  const items = [
    { k: '수집하는 개인정보', v: collect },
    { k: '쿠키', v: '쓰지 않습니다.' },
    { k: '방문 분석', v: '구글 애널리틱스를 비롯한 어떤 방문 분석 도구도 넣지 않았습니다.' },
    { k: '외부에서 받아오는 것', v: '글꼴은 구글 폰트, 영상 섬네일은 유튜브에서 받아옵니다. 이때 두 서버가 방문자의 IP 주소와 브라우저 정보를 보게 됩니다. 각 서비스의 방침이 따로 적용됩니다.' },
    { k: '바깥으로 나가는 링크', v: `서점, 네이버 블로그, 유튜브, 인스타그램${nl ? `, 뉴스레터 신청 폼(${svc})` : ''}으로 가는 링크가 있습니다. 그곳에서는 그 회사의 방침이 적용됩니다.` },
    { k: '브라우저에 남기는 것', v: '없습니다. 예전 뉴스레터 양식이 남긴 기록이 있다면 방문 시 자동으로 지웁니다.' },
  ];

  if (nl) {
    items.splice(1, 0, { k: '이용 목적', v: '받은 이메일 주소는 신간 소식과 뉴스레터를 보내는 데에만 씁니다. 다른 목적으로 쓰거나 다른 곳에 넘기지 않습니다.' });
    if (SITE.newsletterRetention) {
      items.splice(2, 0, { k: '보관 기간', v: `${SITE.newsletterRetention} 보관하고, 그 뒤에는 지웁니다.` });
    }
    items.splice(SITE.newsletterRetention ? 3 : 2, 0,
      { k: '구독 취소', v: `${SITE.email} 로 알려주시면 명단에서 지웁니다. 뉴스레터 아래쪽의 수신 거부 링크로도 취소하실 수 있습니다.` });
  }
  return `
  <main class="prose-page">
    <div class="t-crumb"><a href="${BASE}/">홈</a> / 개인정보처리방침</div>
    <h1 class="t-h1-page">개인정보처리방침 <span class="t-en">Privacy</span></h1>
    <p class="prose-page__lead">${esc(lead)}</p>
    <dl class="prose-page__list">
      ${items.map((x) => `
        <div class="prose-page__row">
          <dt>${esc(x.k)}</dt>
          <dd>${esc(x.v)}</dd>
        </div>`).join('')}
    </dl>
    <p class="prose-page__foot">문의는 <a href="mailto:${SITE.email}">${esc(SITE.email)}</a> 로 보내주세요.<br>이 방침은 ${nl ? '뉴스레터 구독을 시작한 날' : '2026년 9월 2일'} 기준입니다. 수집 항목이 생기면 이 쪽을 먼저 고칩니다.</p>
  </main>`;
}

/* ── 조립 ───────────────────────────────────────────────────── */

/* ── 영문 화면 ───────────────────────────────────────────────
   판권을 팔 수 있는 것은 국내 저자 원작뿐입니다. 번역서는 해외 판권이
   원저작권자에게 있으므로 'Translation' 으로 구분해 표시하고,
   판권 안내에서는 제외합니다. */

const isOriginal = (b) => !/옮김/.test(b.trans || '');

const EN_SUBJECTS = [
  ['경제경영 Business',          'Business'],
  ['자기계발 Self-development',  'Self-development'],
  ['인문 Humanities',            'Humanities'],
  ['문학 Literature',            'Literature'],
  ["어린이 Children's",          "Children's"],
];
const enSubject = (s) => (EN_SUBJECTS.find((x) => x[0] === s) || [null, s])[1];

/* 수상 이름 영문 대역.
   기관의 공식 영문 표기가 아니라 뜻을 옮긴 것이라, 대표 확인 후 확정합니다.
   확인 전까지 원문을 괄호로 함께 남겨 검증할 수 있게 둡니다. */
const EN_AWARDS = [
  ['교보문고 올해의책',                  'Kyobo Book Centre — Book of the Year'],
  ['예스24 올해의책',                   'Yes24 — Book of the Year'],
  ['알라딘 올해의책',                   'Aladin — Book of the Year'],
  ['세종도서 교양부문 선정',              'Sejong Book Award — Non-fiction'],
  ['문학나눔 도서 선정',                 'Munhaknanum Selection (Arts Council Korea)'],
  ['진중문고 선정',                     'Armed Forces Library Selection'],
  ['중소출판사 출판콘텐츠 창작지원사업 선정',   'KPIPA Publishing Content Grant'],
];

function enAward(award) {
  return award.split(' · ').map((part) => {
    const year = (part.match(/^(\d{4})\s*/) || [])[1] || '';
    const name = part.replace(/^\d{4}\s*/, '');
    const hit = EN_AWARDS.find((x) => x[0] === name);
    return hit ? `${hit[1]}${year ? ', ' + year : ''}` : part;
  }).join(' &middot; ');
}

const sortedBooks = () => BOOKS.slice().sort((a, b) => b.date.localeCompare(a.date));

function enHomeHTML() {
  const total = BOOKS.length;
  const owned = BOOKS.filter(isOriginal).length;
  const counts = EN_SUBJECTS
    .map(([ko, en]) => [en, BOOKS.filter((b) => b.subject === ko).length])
    .filter(([, n]) => n > 0);
  const awarded = sortedBooks().filter((b) => b.award);

  return `
  <section class="en-hero">
    <p class="en-kicker">Publion &middot; Incheon, Republic of Korea</p>
    <h1 class="en-title">Korean books for<br>the next decade</h1>
    <p class="en-lede">Publion is an independent publisher founded in 2020. We publish
      business, self-development, humanities and literary titles by Korean authors,
      and we are looking for publishing partners abroad.</p>
    <a class="en-cta" href="${enRightsHref()}">Rights &amp; foreign editions</a>
  </section>

  <section class="en-section">
    <h2 class="en-h2">What we publish</h2>
    <div class="en-stats">
      ${counts.map(([en, n]) => `
        <div class="en-stat">
          <div class="en-stat__n">${n}</div>
          <div class="en-stat__k">${esc(en)}</div>
        </div>`).join('')}
    </div>
    <p class="en-note">${total} titles published since 2020, of which
      <strong>${owned}</strong> are original works by Korean authors with world
      rights available. The remaining ${total - owned} are Korean translations of
      foreign works.</p>
  </section>

  <section class="en-section">
    <h2 class="en-h2">Recognition</h2>
    <ul class="en-list">
      ${awarded.map((b) => `
        <li class="en-list__row">
          <span class="en-list__t">${esc(b.title)}</span>
          <span class="en-list__m">${esc(b.author)} &middot; ${enAward(b.award)}</span>
        </li>`).join('')}
    </ul>
  </section>

  <section class="en-section">
    <h2 class="en-h2">Contact</h2>
    <p class="en-note">Rights enquiries and catalogue requests:
      <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </section>`;
}

function enBooksHTML() {
  const rows = sortedBooks();
  return `
  <section class="en-section en-section--top">
    <p class="en-kicker">Catalogue</p>
    <h1 class="en-h1">${rows.length} titles</h1>
    <p class="en-lede en-lede--sm">Titles are listed in their original Korean.
      English synopses and sample translations are prepared on request.
      <strong>Rights available</strong> marks original works by Korean authors;
      translations are licensed from their original publishers and are shown for
      reference only.</p>

    <div class="en-table" role="table" aria-label="Publion catalogue">
      <div class="en-table__head" role="row">
        <span role="columnheader">Title</span>
        <span role="columnheader">Author</span>
        <span role="columnheader">Category</span>
        <span role="columnheader">Year</span>
        <span role="columnheader">Rights</span>
      </div>
      ${rows.map((b) => `
        <div class="en-table__row" role="row">
          <span role="cell" class="en-table__t">${esc(b.title)}${b.award ? '<span class="en-award" title="Award-winning">&#9733;</span>' : ''}</span>
          <span role="cell">${esc(b.author)}</span>
          <span role="cell">${esc(enSubject(b.subject))}</span>
          <span role="cell" class="en-num">${esc(b.year)}</span>
          <span role="cell">${isOriginal(b)
            ? '<span class="en-tag en-tag--on">Rights available</span>'
            : '<span class="en-tag">Translation</span>'}</span>
        </div>`).join('')}
    </div>
  </section>`;
}

function enRightsHTML() {
  const owned = sortedBooks().filter(isOriginal);
  const highlights = owned.filter((b) => b.award);
  return `
  <section class="en-section en-section--top">
    <p class="en-kicker">Rights guide</p>
    <h1 class="en-h1">Foreign rights</h1>
    <p class="en-lede en-lede--sm">Publion holds world rights, excluding Korea, to
      ${owned.length} original titles by Korean authors. We welcome enquiries from
      publishers, agents and scouts.</p>
  </section>

  <section class="en-section">
    <h2 class="en-h2">Award-winning titles</h2>
    <ul class="en-list">
      ${highlights.map((b) => `
        <li class="en-list__row">
          <span class="en-list__t">${esc(b.title)}</span>
          <span class="en-list__m">${esc(b.author)} &middot; ${esc(enSubject(b.subject))} &middot; ${esc(b.year)}<br>${enAward(b.award)}</span>
        </li>`).join('')}
    </ul>
    <p class="en-note"><a href="${enBooksHref()}">See the full catalogue &rarr;</a></p>
  </section>

  <section class="en-section">
    <h2 class="en-h2">Materials on request</h2>
    <ul class="en-bullets">
      <li>English synopsis and author biography</li>
      <li>Sample translation</li>
      <li>Full Korean text and cover files</li>
      <li>Sales record and press coverage in Korea</li>
    </ul>
    <p class="en-note">Materials are prepared per title on request. Please tell us
      which title and which territory you are enquiring about.</p>
  </section>

  <section class="en-section">
    <h2 class="en-h2">Contact</h2>
    <p class="en-contact"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
    <p class="en-note">Publion Publishing &middot; Namdong-gu, Incheon, Republic of Korea<br>
      Correspondence in English or Korean is welcome.</p>
  </section>`;
}

export function bodyHTML(view) {
  switch (view.page) {
    case 'books':   return booksHTML(view);
    case 'detail':  return detailHTML(view);
    case 'about':   return aboutHTML();
    case 'authors': return authorsHTML();
    case 'journal': return journalHTML();
    case 'privacy': return privacyHTML();
    case 'en-home':   return enHomeHTML();
    case 'en-books':  return enBooksHTML();
    case 'en-rights': return enRightsHTML();
    default:        return homeHTML(view);
  }
}

export function pageHTML(view) {
  return headerHTML(view) + bodyHTML(view) + footerHTML(view);
}

/* 페이지별 제목·설명·정규주소. 미리 찍을 때와 브라우저에서 함께 씁니다. */
export function meta(view) {
  if (view.page === 'detail') {
    const b = BOOKS.find((x) => x.id === view.bookId) || BOOKS[0];
    const intro = INTROS[b.id] || b.sub || '';
    return {
      title: `${b.title} · ${b.author} — 퍼블리온`,
      description: intro.slice(0, 155),
      // path 는 사이트 기준 경로입니다. 기준 경로(BASE)를 붙이지 않습니다.
      // 파일이 놓이는 자리와 canonical 주소를 정하는 값이라, 여기에 BASE 를 넣으면
      // 정적 파일이 한 단계 더 깊은 폴더에 만들어집니다.
      path: `/book/${b.id}/`,
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
  if (view.page === 'privacy') {
    return {
      title: '개인정보처리방침 Privacy — 퍼블리온',
      description: '퍼블리온 홈페이지는 방문자의 개인정보를 수집하지 않습니다. 회원가입·입력 양식·쿠키·방문 분석 도구가 없습니다.',
      path: '/privacy/',
    };
  }
  if (view.page === 'authors') {
    return {
      title: '저자 Authors — 퍼블리온',
      description: `퍼블리온과 함께한 저자 ${authorList().length}명. 김용섭, 김초엽, 루퍼트 스파이라, 안예진 등.`,
      path: '/authors/',
    };
  }
  if (view.page === 'en-home') {
    return {
      title: 'Publion — Korean books for the next decade',
      description: `Publion is an independent Korean publisher founded in 2020. ${BOOKS.length} titles in business, self-development, humanities and literature. Foreign rights available.`,
      path: '/en/',
    };
  }
  if (view.page === 'en-books') {
    return {
      title: `Catalogue — Publion (${BOOKS.length} titles)`,
      description: `The full Publion catalogue: ${BOOKS.length} Korean titles with author, category and year. Original works by Korean authors are marked as rights available.`,
      path: '/en/books/',
    };
  }
  if (view.page === 'en-rights') {
    return {
      title: 'Foreign rights — Publion',
      description: 'Publion holds world rights excluding Korea to original titles by Korean authors. English synopses and sample translations on request.',
      path: '/en/rights/',
    };
  }
  return {
    title: '퍼블리온 Publion — 경제경영 · 인문 · 문학',
    description: '퍼블리온은 새롭고, 필요하고, 읽는 즐거움이 담긴 책을 만듭니다. 2020년 설립 이후 41종을 펴냈습니다.',
    path: '/',
  };
}
