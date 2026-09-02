# 코덱스 배포 프롬프트

아래 블록을 통째로 복사해 코덱스에 붙여넣으세요.

사전 조건
- `gh auth status` 가 로그인 상태
- Vercel 계정 (로그인은 프롬프트 안에서 안내합니다)

---

퍼블리온 출판사 홈페이지를 GitHub 에 올리고 Vercel 에 배포해줘.

작업 디렉터리: ~/workspace/퍼블리온

저장소 성격
- 빌드 도구가 없는 정적 사이트다. 프레임워크도 번들러도 없다.
- 46개 주소가 이미 HTML 파일로 있다 (index.html, books/, book/1~41/, journal/, about/, authors/).
- .gitignore 와 vercel.json 은 이미 있다. 새로 만들거나 고치지 마라.
- 저장소에 들어갈 것은 파일 122개, 약 6.9MB 다.

순서

1) git 초기화 + 첫 커밋
   - 브랜치 main, 커밋 메시지 "퍼블리온 홈페이지 초기 배포"
   - 커밋 전에 git status --short 로 assets/img/_bg 와 *.pdf 가 빠졌는지 확인.
     들어가 있으면 멈추고 알려줘.

2) GitHub 비공개 저장소 생성 + 푸시
   gh repo create publion-website --private --source . --remote origin --push

3) Vercel 프리뷰 배포
   - vercel CLI 없으면 npm i -g vercel
   - vercel login 이 필요하면 안내만 하고 멈춰라. 내가 직접 로그인한다.
   - 프로젝트 이름 publion / Framework Preset 은 Other /
     Build Command 비움 / Output Directory 는 저장소 루트
   - vercel 로 프리뷰만 배포하고 URL 을 알려줘.

4) 프리뷰 URL 로 검증하고 표로 보고
   - / /books/ /book/23/ /journal/ /about/ /authors/ 가 모두 200 인가
   - /robots.txt 200, /sitemap.xml 200 이고 <loc> 이 46개인가
   - /assets/img/covers/cover-23.jpg 가 200 인가
   - curl 로 /book/23/ 를 받아 태그를 걷어낸 본문이 1,000자 이상인가
     (자바스크립트를 실행하지 않는 AI 크롤러가 보는 내용이다. 기준값 1,159자)

5) 내가 확인하고 좋다고 하면 그때 vercel --prod 로 운영 배포
   끝나면 GitHub 주소와 운영 URL 을 알려줘.
   그리고 assets/js/views.js 의 SITE.origin 이 https://publion.co.kr 로
   박혀 있으니 실제 도메인으로 바꾸고 node build/prerender.mjs 를 다시 돌려야
   canonical 과 sitemap 이 맞는다는 것도 다시 알려줘.

하지 말 것
- 파일 내용을 고치지 마라. 배포만 해라.
- 내 확인 없이 운영 배포하지 마라.
- 도메인을 사거나 연결하지 마라.

---

## 배포 후

### 1. 도메인 반영

`assets/js/views.js` 의 `SITE.origin` 이 `https://publion.co.kr` 로 박혀 있습니다.

```bash
# SITE.origin 을 실제 주소로 고친 뒤
node build/prerender.mjs
git add -A && git commit -m "배포 도메인 반영" && git push
```

### 2. 크롤러 접근 확인

CDN 이나 방화벽이 특정 크롤러만 조용히 막는 경우가 있습니다.
robots.txt 에는 흔적이 남지 않으므로 실제 응답을 봐야 합니다.

```bash
SITE=https://실제도메인
for UA in GPTBot OAI-SearchBot ChatGPT-User ClaudeBot Claude-SearchBot \
          Claude-User Googlebot PerplexityBot CCBot Chrome; do
  printf "%-18s " "$UA"
  curl -s -o /dev/null -w "%{http_code} %{size_download}B\n" -A "$UA/1.0" "$SITE/"
done
```

응답 코드나 크기가 다른 크롤러가 있으면 그것이 발견 사항입니다.
