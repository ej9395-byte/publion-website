# 코덱스 배포 프롬프트 — Vercel

갱신 2026-09-02

깃허브는 이미 끝났습니다. 저장소가 공개 상태로 올라가 있습니다.
남은 것은 Vercel 연결뿐입니다.

**사전 조건** — 터미널에서 `gh auth status`가 로그인 상태일 것. Vercel 로그인은 프롬프트 안에서 안내합니다.

아래 코드 블록을 **통째로 복사해** 코덱스에 붙여넣으세요.

```
퍼블리온 출판사 홈페이지를 Vercel 에 배포해줘.

작업 디렉터리: ~/workspace/퍼블리온

── 현재 상태 (이미 끝난 것) ─────────────────────────
- GitHub 공개 저장소: https://github.com/gamsungsecretary-glitch/publion-website
- main 브랜치에 전부 푸시됨. origin 과 발산 없음
- vercel.json 있음 (캐시 헤더 + 보안 헤더 + trailingSlash)
- .gitignore 있음

── 저장소 성격 ─────────────────────────────────────
- 빌드 도구가 없는 순수 정적 사이트다. 프레임워크도 번들러도 package.json 도 없다
- 46개 주소가 이미 HTML 파일로 존재한다
  index.html, books/, book/1~41/, journal/, about/, authors/
- 따라서 Vercel 빌드 명령은 없어야 한다. Output Directory 도 루트다

── 반드시 지킬 것 ──────────────────────────────────
1. 파일을 고치지 마라. vercel.json, .gitignore, HTML, CSS, JS 전부 읽기만 해라
   설정이 잘못됐다고 판단되면 고치지 말고 나에게 말해라
2. 프로덕션 배포(--prod)를 내 확인 없이 하지 마라
   프리뷰 배포까지만 하고 주소를 알려줘라
3. 도메인을 사거나 연결하지 마라. publion.co.kr 을 붙이지 마라
   Vercel 이 도메인 구매를 권해도 거절해라
4. 저장소를 새로 만들지 마라. 이미 있는 저장소에 연결만 해라

── 할 일 ──────────────────────────────────────────
1. Vercel CLI 확인. 없으면 설치 방법만 알려주고 멈춰라
     which vercel || npm i -g vercel
2. Vercel 로그인 상태 확인 (vercel whoami)
   로그인이 안 돼 있으면 `vercel login` 안내하고 멈춰라
3. 위 GitHub 저장소를 Vercel 프로젝트로 연결
   - Framework Preset: Other (또는 No Framework)
   - Build Command: 비움
   - Output Directory: 비움 (루트)
   - Install Command: 비움
   - Root Directory: 비움 (저장소 루트)
4. 프리뷰 배포 1회 실행
5. 배포된 주소로 아래를 확인하고 결과를 표로 보고해라

── 배포 후 확인 항목 ───────────────────────────────
각 항목을 실제로 요청해서 상태 코드를 확인해라. 추측하지 마라.

  a) /                          200 이고 CSS 가 실제로 적용되는가
  b) /assets/css/styles.css     200
  c) /assets/js/app.js          200
  d) /assets/img/covers/cover-41.jpg   200
  e) /book/41/                  200
  f) /books/  /journal/  /about/  /authors/   전부 200
  g) /sitemap.xml               200, 46개 <loc>
  h) /robots.txt                200
  i) 없는 주소 (/zzz/)          404

  CSS 적용 여부는 파일 200 만으로 판단하지 마라.
  페이지를 열어 배경이 흰색이고 링크가 기본 파란색이 아닌지 눈으로 확인해라.

── 알아둘 것 ──────────────────────────────────────
- HTML 안의 자산 경로는 루트 기준 절대경로(/assets/...)다.
  Vercel 은 루트에서 서빙하므로 그대로 맞는다. 하위 경로 서빙에서는 깨진다
- HTML 의 canonical 과 sitemap 은 https://publion.co.kr 을 가리킨다.
  아직 연결되지 않은 도메인이다. 지금은 그대로 두고 고치지 마라.
  Vercel 프리뷰 배포에는 noindex 가 붙으므로 색인 문제는 없다
- 한글 파일명이 저장소에 있다. 배포에서 빠지지 않는지 확인해라

── 보고 형식 ──────────────────────────────────────
- 프리뷰 주소
- 위 a~i 확인 결과를 표로. 실패한 항목은 원인까지
- 프로덕션 배포를 진행할지 나에게 물어보고 멈춰라
```

---

## 참고 — 깃허브 페이지 미리보기는 깨져 있습니다

`https://gamsungsecretary-glitch.github.io/publion-website/` 는 **스타일이 전혀 적용되지 않습니다.**

원인은 경로입니다. HTML 이 자산을 `/assets/css/styles.css` 처럼 루트 기준으로 부르는데,
깃허브 페이지는 사이트를 `/publion-website/` 하위에서 서빙합니다.
그래서 브라우저가 `github.io/assets/...` 를 찾고 404 를 받습니다.

측정한 값입니다.

| 확인 | 결과 |
|---|---|
| `/publion-website/assets/css/styles.css` | 200 (파일은 있음) |
| `/assets/css/styles.css` (실제 요청 주소) | 404 |
| 브라우저에서 적용된 CSS 규칙 수 | 0 |
| 로드된 이미지 | 0 |

**Vercel 은 루트에서 서빙하므로 이 문제가 없습니다.** 배포하면 그대로 정상입니다.
깃허브 페이지를 계속 쓰려면 `BASE_PATH=/publion-website` 로 다시 빌드해야 하는데,
그 산출물은 Vercel 에서 깨집니다. 둘 중 하나만 골라야 합니다.
