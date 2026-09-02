/* <image-slot> — 사용자가 채우는 이미지 자리
 *
 * Claude Design 캔버스의 image-slot 을 이 사이트에서 쓸 수 있게 다시 만든 것입니다.
 * 원본은 omelette 런타임의 사이드카 파일에 저장하지만, 여기서는 브라우저
 * localStorage 에 저장합니다. Design SOP 7장의 규칙은 그대로입니다.
 *
 *   - 슬롯마다 고유 id. 같은 id 는 같은 이미지를 공유합니다.
 *     표지를 한 번 넣으면 홈·목록·상세·관련도서에 모두 반영됩니다.
 *   - fit="contain" 은 표지(잘리지 않게), fit="cover" 는 배너·타일(꽉 차게).
 *
 * 속성
 *   id           저장 키. 필수.
 *   fit          contain | cover            (기본 cover)
 *   placeholder  비어 있을 때 보여줄 설명
 *   src          미리 채워둘 이미지 경로. 사용자가 놓은 이미지가 우선합니다.
 *   eager        첫 화면에 보이는 이미지(히어로)에 붙입니다. 지연 로딩을 끕니다.
 */

const STORE_KEY = 'publion.imageSlots';
const MAX_EDGE = 1600;            // 저장 전 긴 변을 이 크기로 줄입니다
const listeners = new Set();      // 같은 id 슬롯끼리 동기화

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  } catch (e) {
    // 용량 초과. 저장은 못 해도 현재 화면에는 보이게 둡니다.
    console.warn('[image-slot] 저장 공간이 부족합니다. 이미지가 새로고침 후 사라집니다.', e);
    return false;
  }
}

function getSaved(id) {
  return readStore()[id] || null;
}

function save(id, dataUrl) {
  const store = readStore();
  store[id] = dataUrl;
  writeStore(store);
  listeners.forEach((fn) => fn(id));
}

function clear(id) {
  const store = readStore();
  delete store[id];
  writeStore(store);
  listeners.forEach((fn) => fn(id));
}

/* 파일을 읽어 긴 변 MAX_EDGE 이하로 줄인 data URL 로 만듭니다. */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('이미지 파일이 아닙니다.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const raw = String(reader.result);
      // SVG 는 벡터라 줄이지 않고 그대로 씁니다.
      if (file.type === 'image/svg+xml') { resolve(raw); return; }

      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        if (scale === 1 && raw.length < 400_000) { resolve(raw); return; }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 투명도가 필요한 표지가 있으므로 PNG 를 유지합니다.
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(type, 0.86));
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

class ImageSlot extends HTMLElement {
  static get observedAttributes() { return ['src', 'fit', 'placeholder', 'eager']; }

  connectedCallback() {
    if (this.__built) { this.render(); return; }
    this.__built = true;

    this.tabIndex = 0;
    this.setAttribute('role', 'button');
    this.__sync = (id) => { if (id === this.getAttribute('id')) this.render(); };
    listeners.add(this.__sync);

    this.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      this.dataset.dragging = 'true';
    });
    this.addEventListener('dragleave', () => { delete this.dataset.dragging; });
    this.addEventListener('drop', (ev) => {
      ev.preventDefault();
      delete this.dataset.dragging;
      const file = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
      if (file) this.accept(file);
    });

    this.addEventListener('click', (ev) => { ev.stopPropagation(); this.browse(); });
    this.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); this.browse(); }
      if (ev.key === 'Backspace' || ev.key === 'Delete') {
        ev.preventDefault();
        const id = this.getAttribute('id');
        if (id) clear(id);
      }
    });

    this.render();
  }

  disconnectedCallback() { listeners.delete(this.__sync); }
  attributeChangedCallback() { if (this.__built) this.render(); }

  browse() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
      if (input.files && input.files[0]) this.accept(input.files[0]);
    });
    input.click();
  }

  async accept(file) {
    const id = this.getAttribute('id');
    if (!id) { console.warn('[image-slot] id 가 없어 저장할 수 없습니다.'); return; }
    try {
      save(id, await fileToDataUrl(file));
    } catch (e) {
      console.warn('[image-slot]', e.message);
    }
  }

  render() {
    const id = this.getAttribute('id') || '';
    const fit = this.getAttribute('fit') === 'contain' ? 'contain' : 'cover';
    const placeholder = this.getAttribute('placeholder') || '이미지';
    const source = getSaved(id) || this.getAttribute('src') || '';

    this.setAttribute('aria-label', source
      ? `${placeholder} 이미지. 다시 놓으면 교체, Delete 로 비우기`
      : `${placeholder} 이미지 자리. 이미지를 끌어다 놓거나 눌러서 선택`);

    if (source) {
      this.innerHTML = '';
      const img = document.createElement('img');
      img.src = source;
      img.alt = placeholder;
      img.className = 'image-slot__img';
      const eager = this.hasAttribute('eager');
      img.loading = eager ? 'eager' : 'lazy';
      img.decoding = eager ? 'sync' : 'async';
      if (eager) img.fetchPriority = 'high';
      img.style.objectFit = fit;
      this.appendChild(img);
    } else {
      this.innerHTML = '';
      const box = document.createElement('span');
      box.className = 'image-slot__empty';
      box.textContent = placeholder;
      this.appendChild(box);
    }
  }
}

if (!customElements.get('image-slot')) {
  customElements.define('image-slot', ImageSlot);
}

export { clear as clearImageSlot, readStore as readImageSlots };
