/* 정적 페이지 생성기
 *
 * 왜 필요한가: ChatGPT·Claude·Perplexity 크롤러는 자바스크립트를 실행하지 않습니다
 * (Vercel + MERJ 측정, 2025. 벤더 확인은 없음). 첫 HTML 에 본문이 없으면
 * 이 크롤러들에게는 빈 페이지입니다. Gemini 는 Googlebot 기반이라 예외입니다.
 *
 * 그래서 브라우저에서 쓰는 것과 같은 템플릿으로 45개 주소를 미리 찍습니다.
 * 실행: node build/prerender.mjs
 */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { BOOKS, SUBJECTS } = await import(join(ROOT, 'assets/js/data.js'));
const V = await import(join(ROOT, 'assets/js/views.js'));
const { INTROS } = await import(join(ROOT, 'assets/js/intros.js'));

const { SITE, esc, meta, pageHTML, authorList } = V;
const BUILT = new Date().toISOString().slice(0, 10);
const BASE = process.env.BASE_PATH || '';   // 예: /publion-website

/* ── 구조화 데이터 ──────────────────────────────────────────────
   검색 결과에 실제로 렌더링되는 기능과 데이터 정합을 위해 넣습니다.
   구조화 데이터가 AI 인용을 늘린다는 동료평가 근거는 없습니다.
   (유일한 실험 arXiv:2603.10700 은 구조화 데이터 벤더가 수행했고
    JSON-LD 단독 효과는 d=0.18 로 미미했습니다.) 그래서 그런 주장은 하지 않습니다.
   ───────────────────────────────────────────────────────────── */

const ORG = {
  '@type': 'Organization',
  '@id': SITE.origin + '/#org',
  name: SITE.name,
  alternateName: SITE.nameEn,
  url: SITE.origin + '/',
  email: SITE.email,
  telephone: '+82-10-3207-0033',
  foundingDate: SITE.founded,
  founder: { '@type': 'Person', name: SITE.ceo },
  sameAs: [SITE.instagram, SITE.facebook, SITE.youtube, SITE.blog, SITE.tistory, SITE.store],
};

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.name,
    item: SITE.origin + it.path,
  })),
});

function jsonLdFor(view) {
  const graph = [ORG];

  if (view.page === 'home') {
    graph.push({
      '@type': 'WebSite', '@id': SITE.origin + '/#site',
      url: SITE.origin + '/', name: `${SITE.name} ${SITE.nameEn}`,
      inLanguage: 'ko-KR', publisher: { '@id': SITE.origin + '/#org' },
    });
  }

  if (view.page === 'books') {
    graph.push(crumbs([{ name: '홈', path: '/' }, { name: '도서', path: '/books/' }]));
    graph.push({
      '@type': 'CollectionPage', url: SITE.origin + '/books/', name: '도서 Books',
      inLanguage: 'ko-KR',
      mainEntity: {
        '@type': 'ItemList', numberOfItems: BOOKS.length,
        itemListElement: BOOKS.slice().sort((a, b) => b.date.localeCompare(a.date)).map((b, i) => ({
          '@type': 'ListItem', position: i + 1, name: b.title,
          url: SITE.origin + '/book/' + b.id + '/',
        })),
      },
    });
  }

  if (view.page === 'detail') {
    const b = BOOKS.find((x) => x.id === view.bookId);
    graph.push(crumbs([
      { name: '홈', path: '/' }, { name: '도서', path: '/books/' },
      { name: b.title, path: '/book/' + b.id + '/' },
    ]));
    const book = {
      '@type': 'Book', '@id': SITE.origin + '/book/' + b.id + '/#book',
      name: b.title, url: SITE.origin + '/book/' + b.id + '/',
      isbn: b.isbn, bookFormat: 'https://schema.org/Paperback', inLanguage: 'ko',
      datePublished: b.date.replace(/\./g, '-'),
      publisher: { '@id': SITE.origin + '/#org' },
      author: { '@type': 'Person', name: b.author },
      image: SITE.origin + '/assets/img/covers/cover-' + b.id + '.jpg',
      description: INTROS[b.id] || b.sub || undefined,
      genre: b.subject.split(' ')[0],
      offers: {
        '@type': 'Offer', price: b.price, priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock', url: SITE.store,
        seller: { '@id': SITE.origin + '/#org' },
      },
    };
    if (b.sub) book.alternativeHeadline = b.sub;
    if (b.trans) book.translator = { '@type': 'Person', name: b.trans.replace(/\s*옮김$/, '') };
    if (b.award) book.award = b.award;
    graph.push(book);
  }

  if (view.page === 'about') {
    graph.push(crumbs([{ name: '홈', path: '/' }, { name: '출판사 소개', path: '/about/' }]));
    graph.push({ '@type': 'AboutPage', url: SITE.origin + '/about/', name: '출판사 소개',
                 inLanguage: 'ko-KR', mainEntity: { '@id': SITE.origin + '/#org' } });
  }

  if (view.page === 'journal') {
    graph.push(crumbs([{ name: '홈', path: '/' }, { name: '저널', path: '/journal/' }]));
    graph.push({ '@type': 'CollectionPage', url: SITE.origin + '/journal/', name: '저널 Journal',
                 inLanguage: 'ko-KR', publisher: { '@id': SITE.origin + '/#org' } });
  }
  if (view.page === 'authors') {
    graph.push(crumbs([{ name: '홈', path: '/' }, { name: '저자', path: '/authors/' }]));
    graph.push({
      '@type': 'CollectionPage', url: SITE.origin + '/authors/', name: '저자 Authors',
      inLanguage: 'ko-KR',
      mainEntity: { '@type': 'ItemList', numberOfItems: authorList().length,
        itemListElement: authorList().map((a, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'Person', name: a.name } })) },
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ── HTML 껍데기 ────────────────────────────────────────────── */

function document_(view) {
  const m = meta(view);
  const canonical = SITE.origin + m.path;
  const image = SITE.origin + (m.image || '/assets/img/covers/cover-41.jpg');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.description)}">
<link rel="canonical" href="${esc(canonical)}">

<meta property="og:type" content="${view.page === 'detail' ? 'book' : 'website'}">
<meta property="og:site_name" content="퍼블리온 Publion">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600&family=Archivo:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/css/styles.css">

<script type="application/ld+json">${jsonLdFor(view)}</script>
</head>
<body>
<script>window.__BASE__=${JSON.stringify(BASE)};</script>\n<a class="u-skip" href="#main-content">본문으로 건너뛰기</a>
<div id="app" data-page="${esc(view.page)}"${view.page === 'detail' ? ` data-book="${view.bookId}"` : ''}${view.page === 'books' ? ` data-subject="${esc(view.subject)}" data-sort="${esc(view.sort)}"` : ''}>${pageHTML(view)}</div>
<script type="module" src="${BASE}/assets/js/app.js"></script>
</body>
</html>
`;
}

/* ── 쓰기 ───────────────────────────────────────────────────── */

async function write(path, body) {
  const file = join(ROOT, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  return path;
}

const views = [
  { page: 'home', heroIndex: 0 },
  { page: 'books', subject: '전체', sort: '신간순' },
  { page: 'about' },
  { page: 'authors' },
  { page: 'journal' },
  ...BOOKS.map((b) => ({ page: 'detail', bookId: b.id })),
];

const written = [];
for (const view of views) {
  const p = meta(view).path;
  written.push(await write((p === '/' ? '/index.html' : p + 'index.html').slice(1), document_(view)));
}

/* sitemap.xml — 정적 주소만 넣습니다. 쿼리로 거르는 목록은 넣지 않습니다. */
const urls = views.map((v) => {
  const p = meta(v).path;
  const priority = p === '/' ? '1.0' : p === '/books/' ? '0.9' : '0.7';
  return `  <url>\n    <loc>${SITE.origin}${p}</loc>\n    <lastmod>${BUILT}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');
written.push(await write('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemap-image/1.1 http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:default="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
`));
// 위 네임스페이스는 잘못되기 쉬우므로 단순한 형태로 다시 씁니다.
written[written.length - 1] = await write('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

/* robots.txt — 차단하지 않습니다.
   AI 크롤러를 막으면 인용이 줄어든다는 동료평가 측정이 있습니다 (arXiv:2604.27790, SIGIR 2026).
   Google-Extended 는 크롤러가 아니라 robots.txt 토큰이며,
   막아도 AI Overviews 에서 빠지지 않습니다. 여기서는 아무것도 막지 않습니다. */
written.push(await write('robots.txt',
`User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`));

console.log(`정적 페이지 ${views.length}개 + sitemap + robots 생성`);
console.log('  홈 · 도서목록 · 소개 · 저자 + 도서 상세 ' + BOOKS.length + '종');
