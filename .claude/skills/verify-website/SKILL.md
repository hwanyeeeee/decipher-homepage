---
name: verify-website
description: HTML 구조, 내부 링크, 에셋 참조, 네비게이션 동기화, 인증 섹션 정합성을 검증합니다. 페이지 수정 후 사용.
---

# 웹사이트 무결성 검증

## Purpose

1. **에셋 참조 무결성** — img/script/link가 실제 존재하는 파일을 가리키는지
2. **내부 링크 무결성** — href가 실제 존재하는 앵커(id) 또는 파일을 가리키는지
3. **네비게이션 동기화** — 데스크톱 nav, 모바일 메뉴, footer의 링크가 일관적인지
4. **인증 섹션 정합성** — 등록번호, 날짜 등 인증 정보가 정확하게 표시되는지
5. **HTML 기본 구조** — 필수 meta 태그, lang 속성 등 기본 요소가 있는지

## When to Run

- `index.html` 또는 `products/*.html` 수정 후
- 에셋 파일(이미지, PDF 등)을 추가/삭제/이름 변경한 후
- 네비게이션 메뉴 구조를 변경한 후
- 인증 관련 정보를 수정한 후

## Related Files

| File | Purpose |
|------|---------|
| `index.html` | 메인 페이지 (히어로, 제품, 기능, 인증, 로드맵) |
| `products/ikakao.html` | iKakao 제품 상세 페이지 |
| `products/iline.html` | iLine 제품 상세 페이지 |
| `products/itelegram.html` | iTelegram 제품 상세 페이지 |
| `js/main.js` | 메인 JavaScript |
| `assets/DECIPHER-iOS.jpg` | 로고 이미지 |
| `assets/DECIPHER-iKakao.png` | iKakao 아이콘 |
| `assets/DECIPHER-iLine.png` | iLine 아이콘 |
| `assets/DECIPHER-iTelegram.jpg` | iTelegram 아이콘 |
| `assets/copyright-cert.png` | 저작권 등록증 이미지 |
| `assets/copyright-cert.pdf` | 저작권 등록증 원본 PDF |

## Workflow

### Step 1: 에셋 참조 무결성 검증

**도구:** Grep, Bash

**검사:** 모든 HTML 파일에서 `src=` 및 `href=` 속성의 로컬 파일 참조가 실제 존재하는지 확인합니다.

```bash
# index.html에서 로컬 에셋 참조 추출 후 존재 확인
grep -oP '(?:src|href)="(?!https?://|#|mailto:)([^"]+)"' index.html | \
  sed 's/.*="//' | sed 's/"//' | sort -u | \
  while read f; do ls "$f" 2>/dev/null || echo "MISSING: $f"; done
```

각 `products/*.html`에도 동일하게 실행합니다 (상대 경로는 `products/` 기준).

**PASS:** 모든 참조 파일이 존재
**FAIL:** `MISSING:` 출력이 있으면 실패 — 해당 파일을 추가하거나 경로를 수정

### Step 2: 내부 앵커 링크 검증

**도구:** Grep, Bash

**검사:** `href="#xxx"` 형태의 앵커 링크가 동일 파일 내 `id="xxx"`와 매칭되는지 확인합니다.

```bash
# index.html에서 앵커 링크 추출
grep -oP 'href="#([^"]+)"' index.html | sed 's/href="#//' | sed 's/"//' | sort -u > /tmp/anchors.txt

# index.html에서 id 속성 추출
grep -oP 'id="([^"]+)"' index.html | sed 's/id="//' | sed 's/"//' | sort -u > /tmp/ids.txt

# 매칭 확인
while read anchor; do
  grep -q "^${anchor}$" /tmp/ids.txt || echo "BROKEN ANCHOR: #$anchor"
done < /tmp/anchors.txt
```

**PASS:** 모든 앵커가 대응하는 id를 가짐
**FAIL:** `BROKEN ANCHOR:` 출력이 있으면 — 해당 id를 추가하거나 링크를 수정

### Step 3: 네비게이션 동기화 검증

**도구:** Read, Grep

**검사:** 데스크톱 nav, 모바일 메뉴, footer의 링크 목록이 동일한지 확인합니다.

`index.html`에서 3개 영역의 내부 링크를 각각 추출하여 비교:
1. `<nav>` 내 `hidden md:flex` 블록 — 데스크톱 메뉴
2. `id="mobileMenu"` 블록 — 모바일 메뉴
3. `<footer>` 블록 — 푸터 링크

**PASS:** 3개 영역의 내부 링크 목록이 일치 (순서 무관)
**FAIL:** 어느 한 영역에 빠지거나 추가된 링크가 있으면 — 누락된 링크를 추가

### Step 4: 인증 섹션 정합성 검증

**도구:** Grep

**검사:** 인증 관련 핵심 데이터가 일관되게 표시되는지 확인합니다.

```bash
# 등록번호가 올바르게 표기되는지
grep -c "C-2026-010422" index.html
```

확인 항목:
- 등록번호 `C-2026-010422`가 인증 섹션에 존재
- 등록증 이미지 `assets/copyright-cert.png`가 참조됨
- PDF 다운로드 링크 `assets/copyright-cert.pdf`가 참조됨
- 모달 `id="certModal"`이 존재하고 이미지를 포함

**PASS:** 모든 인증 데이터가 존재하고 일관적
**FAIL:** 누락된 항목이 있으면 — 해당 데이터를 추가

### Step 5: HTML 기본 구조 검증

**도구:** Grep

**검사:** 각 HTML 파일에 필수 요소가 있는지 확인합니다.

```bash
for f in index.html products/*.html; do
  echo "=== $f ==="
  grep -c '<!DOCTYPE html>' "$f" || echo "MISSING: DOCTYPE"
  grep -c 'charset="UTF-8"' "$f" || echo "MISSING: charset"
  grep -c 'viewport' "$f" || echo "MISSING: viewport"
  grep -c '<title>' "$f" || echo "MISSING: title"
done
```

**PASS:** 모든 파일에 DOCTYPE, charset, viewport, title이 존재
**FAIL:** 누락된 요소를 추가

## Output Format

```markdown
## verify-website 검증 결과

| # | 검사 | 상태 | 상세 |
|---|------|------|------|
| 1 | 에셋 참조 무결성 | PASS/FAIL | 상세... |
| 2 | 내부 앵커 링크 | PASS/FAIL | 상세... |
| 3 | 네비게이션 동기화 | PASS/FAIL | 상세... |
| 4 | 인증 섹션 정합성 | PASS/FAIL | 상세... |
| 5 | HTML 기본 구조 | PASS/FAIL | 상세... |
```

## Exceptions

다음은 **위반이 아닙니다**:

1. **외부 CDN 링크** — `https://cdn.tailwindcss.com`, Google Fonts 등 외부 URL은 로컬 파일 존재 검사에서 제외
2. **`#` 단독 링크** — 로고의 `href="#"` 같은 현재 페이지 최상단 링크는 앵커 검증에서 제외
3. **JavaScript 동적 생성 요소** — `main.js`에서 동적으로 생성하는 요소(파티클, 바이너리 레인)는 HTML 정적 검사에서 제외
4. **모바일 메뉴에만 있는 Download 링크** — 모바일 메뉴는 데스크톱 nav의 버튼형 링크와 텍스트형으로 다를 수 있음
