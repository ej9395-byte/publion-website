"""배너 조판기 — 생성 배경 위에 실제 표지를 얹습니다.

실행: python3 build/compose_banners.py

규칙 (Design SOP)
  - 표지가 화면에서 가장 강한 색이 되도록 배경은 뒤로 물러납니다 (1장).
  - 장식은 넣지 않습니다. 표지 아래 아주 옅은 접지 그림자만 둡니다 (8장).
  - 히어로는 왼쪽 40%를 비웁니다. 흰 텍스트 판이 덮는 자리입니다.

배치
  row     표지를 한 줄로 늘어놓습니다. 캔버스 폭을 넘으면 자동으로 줄입니다.
  fan     세로로 긴 타일(시리즈)에서 표지를 겹쳐 놓습니다.
  single  한 권만 크게 놓습니다.
"""
import json, os, subprocess, sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BG   = "assets/img/_bg"
OUT  = "assets/img/banners"
SIDE = 0.075          # 좌우 안전 여백 비율
os.makedirs(OUT, exist_ok=True)

_cover_cache = {}
def cover(i):
    if i not in _cover_cache:
        _cover_cache[i] = Image.open(f"assets/img/covers/cover-{i}.jpg").convert("RGB")
    return _cover_cache[i]

def fit_h(im, h):
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)

def cover_fit(im, W, H):
    """배경을 W×H 에 꽉 차게. 여백(검은 띠)이 생기지 않도록 긴 쪽을 잘라냅니다."""
    s = max(W / im.width, H / im.height)
    im = im.resize((max(W, round(im.width * s)), max(H, round(im.height * s))), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((l, t, l + W, t + H))

def ground(canvas, box, blur, alpha):
    x, y, w, h = box
    sh = Image.new("L", canvas.size, 0)
    pad = round(w * 0.04)
    sh.paste(Image.new("L", (w + pad * 2, max(1, round(h * 0.10))), alpha),
             (x - pad, y + h - round(h * 0.03)))
    canvas.paste(Image.new("RGB", canvas.size, (0, 0, 0)), (0, 0),
                 sh.filter(ImageFilter.GaussianBlur(blur)))

def place_row(canvas, ids, W, H, want_h, gap_ratio, y_bias, blur, alpha):
    """한 줄 배치. 폭을 넘으면 표지 높이를 줄여서 맞춥니다."""
    safe = W - round(W * SIDE * 2)
    gap  = round(W * gap_ratio)
    h    = want_h
    while True:
        ws = [round(cover(i).width * h / cover(i).height) for i in ids]
        if sum(ws) + gap * (len(ids) - 1) <= safe or h <= 80:
            break
        h -= 6
    h = min(h, round(H * 0.86))
    ims = [fit_h(cover(i), h) for i in ids]
    total = sum(im.width for im in ims) + gap * (len(ims) - 1)
    x = (W - total) // 2
    y = round((H - h) * y_bias)
    for im in ims:
        ground(canvas, (x, y, im.width, h), blur, alpha)
        canvas.paste(im, (x, y))
        x += im.width + gap
    return h, total

FAN_STEP = 0.60   # 앞 권이 뒤 권을 가리는 정도. 값이 클수록 덜 가립니다.

def place_fan(canvas, ids, W, H, want_h, blur, alpha):
    """세로로 긴 타일용 겹침 배치. 마지막(최신) 권이 앞에 옵니다.
    뒤 권도 알아볼 수 있도록 겹침을 40%로 제한합니다."""
    safe = W - round(W * SIDE * 2)
    h = min(want_h, round(H * 0.56))
    while True:
        w0 = round(cover(ids[0]).width * h / cover(ids[0]).height)
        step = round(w0 * FAN_STEP)
        span = w0 + step * (len(ids) - 1)
        if span <= safe or h <= 80:
            break
        h -= 6
    ims = [fit_h(cover(i), h) for i in ids]
    step = round(ims[0].width * FAN_STEP)
    span = ims[0].width + step * (len(ims) - 1)
    x = (W - span) // 2
    y = (H - h) // 2
    for im in ims:                       # 뒤에서 앞으로
        ground(canvas, (x, y, im.width, h), blur, alpha)
        canvas.paste(im, (x, y))
        x += step
    return h, span

def build(slot, W, H, ids, want_h, mode="row", gap_ratio=0.030,
          y_bias=0.5, blur=16, alpha=80, x_center=None):
    c = cover_fit(Image.open(f"{BG}/{slot}.png").convert("RGB"), W, H)
    if mode == "single":
        h = min(want_h, round(H * 0.86))
        im = fit_h(cover(ids[0]), h)
        x = round(W * (x_center if x_center is not None else 0.5)) - im.width // 2
        x = max(round(W * SIDE), min(x, W - round(W * SIDE) - im.width))
        y = (H - h) // 2
        ground(c, (x, y, im.width, h), blur, alpha)
        c.paste(im, (x, y))
        used = im.width
    elif mode == "fan":
        h, used = place_fan(c, ids, W, H, want_h, blur, alpha)
    else:
        h, used = place_row(c, ids, W, H, want_h, gap_ratio, y_bias, blur, alpha)
    p = f"{OUT}/{slot}.jpg"
    c.save(p, "JPEG", quality=85, optimize=True, progressive=True)
    safe = W - round(W * SIDE * 2)
    print(f"  {slot:<18} {W}x{H:<5} 표지 {len(ids)}권  차지 {used:>4}/{safe:<4}  {os.path.getsize(p)//1024}KB")
    assert used <= safe, f"{slot}: 표지가 안전 폭을 넘습니다"

# 히어로 — 그 책 1권. 왼쪽 40%는 흰 텍스트 판이 덮는 자리로 비웁니다.
#
# 히어로만 높이가 620px 로 고정이고 폭은 화면을 따라갑니다. object-fit:cover 라
# 화면이 좁아질수록 좌우가 잘립니다. 그래서 캔버스 비율(2.5)을 실제 박스 비율에
# 가깝게 잡고, 표지를 68% 지점에 두어 박스 비율 1.5 까지 잘리지 않게 했습니다.
HERO_W, HERO_H, HERO_X = 2000, 800, 0.68
build("hero-1", HERO_W, HERO_H, [41], 560, "single", x_center=HERO_X, blur=22, alpha=90)
build("hero-2", HERO_W, HERO_H, [23], 560, "single", x_center=HERO_X, blur=22, alpha=90)
build("hero-3", HERO_W, HERO_H, [30], 560, "single", x_center=HERO_X, blur=22, alpha=90)

# 분야 타일 — 그 분야 최신 3권 (어린이는 2권)
build("subject-1", 1000, 750, [41, 40, 28], 430, gap_ratio=0.024)
build("subject-2", 1000, 750, [37, 32, 20], 430, gap_ratio=0.024)
build("subject-3", 1000, 750, [39, 38, 34], 430, gap_ratio=0.024)
build("subject-4", 1000, 750, [36, 29, 25], 430, gap_ratio=0.024)
build("subject-5", 1000, 750, [35, 16],     430, gap_ratio=0.024)

# 시리즈 타일 — 세로로 길어 한 줄로는 안 들어갑니다. 겹쳐 놓습니다.
build("series-1", 800, 1000, [18, 27, 41], 620, "fan")   # TREND INSIGHT
build("series-2", 800, 1000, [33, 35, 39], 620, "fan")   # 명상의 정수
build("series-3", 800, 1000, [20, 32],     620, "fan")   # 기록 시리즈

# 저널 썸네일 — 그 글이 다루는 책
build("journal-1", 1000, 625, [37, 38, 39, 40], 400, gap_ratio=0.020)
build("journal-2", 1000, 625, [40], 430, "single")
build("journal-3", 1000, 625, [23], 430, "single")

# 피처 · 프로모 · 메가메뉴
build("feature-main",     1600, 900, [23],         620, "single", x_center=0.62, blur=24, alpha=90)
build("promo-literature", 1200, 900, [36, 29, 23], 560)
build("promo-store",      1200, 900, [20, 32],     600)
build("mega-card-1",       800, 600, [41, 27, 12], 380)

print("\n배너 18종 조판 완료")
