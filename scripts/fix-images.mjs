import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// HEAD 요청으로 URL 유효성 확인
async function ok(id) {
  try {
    const r = await fetch(`https://images.unsplash.com/${id}?w=100`, { method: 'HEAD' })
    return r.status === 200
  } catch { return false }
}

function url(id) {
  return `https://images.unsplash.com/${id}?auto=format&w=800&q=80`
}

// 각 음식별 우선순위 후보 (앞에서부터 검증 후 첫 번째 유효한 것 사용)
const MENU = {
  // ── 한식 ──────────────────────────────────────────────────
  '부대찌개': [
    'photo-1777113310299-c3e41dec4e0f', // bubbling Korean stew with noodles & tofu
    'photo-1583623025817-d180a2221d0a', // spicy Korean stew fallback
  ],
  '된장찌개': [
    'photo-1746718547557-1a0e05bed94b', // hot bubbling Korean soup
    'photo-1760228865341-675704c22a5b', // Korean stew with tofu & scallions
    'photo-1547592180-85f173990554',    // warm soup bowl
  ],
  '불고기': [
    'photo-1677029969065-c9f4003a9ad5', // Korean BBQ grilling on grill (tagged bulgogi)
    'photo-1529042410759-befb1204b468', // grilled beef
  ],
  '비빔밥': [
    'photo-1553163147-622ab57be1c7',    // ✅ bibimbap
  ],
  // ── 양식 ──────────────────────────────────────────────────
  '파스타 카르보나라': [
    'photo-1612874742237-6526221588e3', // ✅ creamy pasta
  ],
  '토마토 볼로네제': [
    'photo-1622973536968-3ead9e780960', // pasta with meat sauce (spaghetti bolognese)
    'photo-1555949258-eb67b1ef0ceb',    // red sauce pasta fallback
  ],
  '크림 리조또': [
    'photo-1476124369491-e7addf5db371', // ✅ risotto
  ],
  // ── 샐러드 ────────────────────────────────────────────────
  '그릭 샐러드': [
    'photo-1540420773420-3366772f4999', // ✅ greek salad
  ],
  '닭가슴살 퀴노아볼': [
    'photo-1546069901-ba9599a7e63c',    // ✅ grain bowl
  ],
  '코브 샐러드': [
    'photo-1512621776951-a57141f2eefd', // ✅ salad
  ],
  // ── 채식 ──────────────────────────────────────────────────
  '채식 두부스테이크': [
    'photo-1765295218809-784d6c2fe39c', // fried tofu with green onions (Japanese style)
    'photo-1591522913962-3ecfa6b271f1', // pad thai with glazed tofu
    'photo-1559847844-5315695dadae',    // tofu dish fallback
  ],
  '채식 카레': [
    'photo-1565557623262-b51c2513a641', // ✅ curry
  ],
}

const { data: products } = await supabase.from('products').select('id, name')

let updated = 0
for (const product of products) {
  const candidates = MENU[product.name]
  if (!candidates) continue

  let chosen = null
  for (const id of candidates) {
    if (await ok(id)) { chosen = id; break }
  }

  if (!chosen) { console.log(`✗ ${product.name}: 유효한 이미지 없음`); continue }

  const { error } = await supabase
    .from('products')
    .update({ image_url: url(chosen) })
    .eq('id', product.id)

  if (error) console.error(`✗ ${product.name}:`, error.message)
  else { console.log(`✓ ${product.name}  →  ${chosen}`); updated++ }
}
console.log(`\n${updated}개 완료`)
