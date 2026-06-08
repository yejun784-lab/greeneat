/**
 * 내장 한국 식품 영양 DB
 * 출처: 식품안전처 식품영양성분 DB 기반 대표값
 * 외부 API 없이도 일반식 검색이 가능하도록 사용
 */
export interface BuiltinFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
}

export const BUILTIN_FOODS: BuiltinFood[] = [
  /* ── 단백질 식품 ─────────────────────────── */
  { id: 'b-001', name: '닭가슴살', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
  { id: 'b-002', name: '닭가슴살구이', calories: 148, protein: 29, carbs: 0, fat: 3, servingSize: '100g' },
  { id: 'b-003', name: '닭다리살', calories: 185, protein: 26, carbs: 0, fat: 9, servingSize: '100g' },
  { id: 'b-004', name: '닭볶음탕', calories: 380, protein: 32, carbs: 22, fat: 16, servingSize: '1인분 300g' },
  { id: 'b-005', name: '계란', calories: 77, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: '1개 50g' },
  { id: 'b-006', name: '계란말이', calories: 150, protein: 10, carbs: 3, fat: 11, servingSize: '100g' },
  { id: 'b-007', name: '스크램블에그', calories: 148, protein: 9.2, carbs: 2.3, fat: 11, servingSize: '2개 분량' },
  { id: 'b-008', name: '삶은달걀', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: '2개 100g' },
  { id: 'b-009', name: '두부', calories: 76, protein: 8, carbs: 1.9, fat: 4.2, servingSize: '100g' },
  { id: 'b-010', name: '연두부', calories: 42, protein: 4.2, carbs: 1.3, fat: 2.3, servingSize: '100g' },
  { id: 'b-011', name: '두부조림', calories: 130, protein: 9, carbs: 7, fat: 7.5, servingSize: '100g' },
  { id: 'b-012', name: '삼겹살', calories: 331, protein: 18, carbs: 0, fat: 29, servingSize: '100g' },
  { id: 'b-013', name: '돼지고기 등심', calories: 173, protein: 22, carbs: 0, fat: 9, servingSize: '100g' },
  { id: 'b-014', name: '제육볶음', calories: 380, protein: 24, carbs: 18, fat: 22, servingSize: '1인분 200g' },
  { id: 'b-015', name: '소고기 등심', calories: 250, protein: 22, carbs: 0, fat: 17, servingSize: '100g' },
  { id: 'b-016', name: '소고기 안심', calories: 200, protein: 23, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'b-017', name: '불고기', calories: 310, protein: 28, carbs: 18, fat: 13, servingSize: '1인분 200g' },
  { id: 'b-018', name: '갈비찜', calories: 520, protein: 38, carbs: 28, fat: 28, servingSize: '1인분 300g' },
  { id: 'b-019', name: '참치캔', calories: 119, protein: 26, carbs: 0, fat: 1, servingSize: '100g' },
  { id: 'b-020', name: '고등어구이', calories: 184, protein: 21, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'b-021', name: '연어', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g' },
  { id: 'b-022', name: '새우', calories: 99, protein: 21, carbs: 0.9, fat: 1.1, servingSize: '100g' },
  { id: 'b-023', name: '오징어볶음', calories: 220, protein: 20, carbs: 14, fat: 8, servingSize: '1인분 200g' },
  { id: 'b-024', name: '낙지볶음', calories: 300, protein: 28, carbs: 20, fat: 8, servingSize: '1인분 250g' },

  /* ── 밥류 ────────────────────────────────── */
  { id: 'b-030', name: '흰쌀밥', calories: 313, protein: 5.5, carbs: 69, fat: 0.5, servingSize: '1공기 210g' },
  { id: 'b-031', name: '현미밥', calories: 340, protein: 6, carbs: 72, fat: 2, servingSize: '1공기 210g' },
  { id: 'b-032', name: '잡곡밥', calories: 320, protein: 6.5, carbs: 68, fat: 1.5, servingSize: '1공기 210g' },
  { id: 'b-033', name: '볶음밥', calories: 420, protein: 9, carbs: 75, fat: 10, servingSize: '1인분 250g' },
  { id: 'b-034', name: '김밥', calories: 400, protein: 12, carbs: 68, fat: 8, servingSize: '1줄 250g' },
  { id: 'b-035', name: '비빔밥', calories: 550, protein: 18, carbs: 95, fat: 12, servingSize: '1인분 500g' },
  { id: 'b-036', name: '초밥', calories: 250, protein: 10, carbs: 46, fat: 3, servingSize: '5피스 150g' },
  { id: 'b-037', name: '오므라이스', calories: 490, protein: 14, carbs: 72, fat: 16, servingSize: '1인분 350g' },
  { id: 'b-038', name: '덮밥 (소불고기)', calories: 580, protein: 22, carbs: 88, fat: 14, servingSize: '1인분 450g' },
  { id: 'b-039', name: '카레라이스', calories: 540, protein: 14, carbs: 92, fat: 13, servingSize: '1인분 450g' },

  /* ── 국/찌개 ─────────────────────────────── */
  { id: 'b-040', name: '김치찌개', calories: 210, protein: 15, carbs: 12, fat: 10, servingSize: '1인분 350g' },
  { id: 'b-041', name: '된장찌개', calories: 130, protein: 10, carbs: 12, fat: 5, servingSize: '1인분 350g' },
  { id: 'b-042', name: '순두부찌개', calories: 180, protein: 12, carbs: 10, fat: 9, servingSize: '1인분 350g' },
  { id: 'b-043', name: '부대찌개', calories: 450, protein: 22, carbs: 42, fat: 19, servingSize: '1인분 500g' },
  { id: 'b-044', name: '미역국', calories: 60, protein: 5, carbs: 6, fat: 2, servingSize: '1인분 350g' },
  { id: 'b-045', name: '육개장', calories: 190, protein: 18, carbs: 10, fat: 8, servingSize: '1인분 350g' },
  { id: 'b-046', name: '삼계탕', calories: 620, protein: 55, carbs: 42, fat: 22, servingSize: '1인분 800g' },
  { id: 'b-047', name: '설렁탕', calories: 380, protein: 28, carbs: 28, fat: 18, servingSize: '1인분 600g' },
  { id: 'b-048', name: '갈비탕', calories: 420, protein: 32, carbs: 24, fat: 22, servingSize: '1인분 600g' },
  { id: 'b-049', name: '콩나물국', calories: 50, protein: 3.5, carbs: 5.5, fat: 1.2, servingSize: '1인분 300g' },
  { id: 'b-050', name: '해장국', calories: 280, protein: 20, carbs: 22, fat: 12, servingSize: '1인분 500g' },

  /* ── 면류 ────────────────────────────────── */
  { id: 'b-060', name: '라면', calories: 510, protein: 11, carbs: 77, fat: 17, servingSize: '1봉 120g' },
  { id: 'b-061', name: '짜장면', calories: 760, protein: 20, carbs: 130, fat: 16, servingSize: '1인분 650g' },
  { id: 'b-062', name: '짬뽕', calories: 640, protein: 28, carbs: 90, fat: 18, servingSize: '1인분 700g' },
  { id: 'b-063', name: '칼국수', calories: 480, protein: 16, carbs: 88, fat: 8, servingSize: '1인분 600g' },
  { id: 'b-064', name: '물냉면', calories: 540, protein: 14, carbs: 108, fat: 5, servingSize: '1인분 650g' },
  { id: 'b-065', name: '비빔냉면', calories: 560, protein: 13, carbs: 110, fat: 7, servingSize: '1인분 600g' },
  { id: 'b-066', name: '잔치국수', calories: 380, protein: 12, carbs: 72, fat: 5, servingSize: '1인분 500g' },
  { id: 'b-067', name: '우동', calories: 420, protein: 13, carbs: 78, fat: 7, servingSize: '1인분 550g' },
  { id: 'b-068', name: '스파게티', calories: 380, protein: 14, carbs: 62, fat: 9, servingSize: '1인분 250g' },
  { id: 'b-069', name: '파스타', calories: 400, protein: 14, carbs: 65, fat: 11, servingSize: '1인분 260g' },
  { id: 'b-070', name: '쌀국수', calories: 320, protein: 10, carbs: 64, fat: 3, servingSize: '1인분 500g' },

  /* ── 분식/간식 ────────────────────────────── */
  { id: 'b-080', name: '떡볶이', calories: 420, protein: 12, carbs: 78, fat: 8, servingSize: '1인분 300g' },
  { id: 'b-081', name: '순대', calories: 310, protein: 14, carbs: 28, fat: 16, servingSize: '1인분 150g' },
  { id: 'b-082', name: '튀김', calories: 380, protein: 8, carbs: 42, fat: 19, servingSize: '1인분 150g' },
  { id: 'b-083', name: '치킨 (후라이드)', calories: 250, protein: 22, carbs: 14, fat: 12, servingSize: '100g' },
  { id: 'b-084', name: '치킨 (양념)', calories: 280, protein: 20, carbs: 20, fat: 13, servingSize: '100g' },
  { id: 'b-085', name: '피자 (1조각)', calories: 280, protein: 12, carbs: 34, fat: 10, servingSize: '1조각 120g' },
  { id: 'b-086', name: '햄버거', calories: 450, protein: 22, carbs: 45, fat: 20, servingSize: '1개 200g' },
  { id: 'b-087', name: '핫도그', calories: 280, protein: 9, carbs: 30, fat: 14, servingSize: '1개 120g' },
  { id: 'b-088', name: '토스트', calories: 280, protein: 9, carbs: 40, fat: 9, servingSize: '1개' },
  { id: 'b-089', name: '샌드위치', calories: 320, protein: 14, carbs: 42, fat: 10, servingSize: '1개 180g' },
  { id: 'b-090', name: '샐러드 (그린)', calories: 80, protein: 3, carbs: 10, fat: 3, servingSize: '1인분 200g' },

  /* ── 채소 ────────────────────────────────── */
  { id: 'b-100', name: '브로콜리', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: '100g' },
  { id: 'b-101', name: '시금치', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g' },
  { id: 'b-102', name: '콩나물', calories: 30, protein: 3.2, carbs: 4.6, fat: 0.2, servingSize: '100g' },
  { id: 'b-103', name: '양배추', calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, servingSize: '100g' },
  { id: 'b-104', name: '당근', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'b-105', name: '오이', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: '100g' },
  { id: 'b-106', name: '양파', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, servingSize: '100g' },
  { id: 'b-107', name: '파프리카', calories: 31, protein: 1, carbs: 7.2, fat: 0.3, servingSize: '100g' },
  { id: 'b-108', name: '고구마', calories: 128, protein: 1.6, carbs: 30, fat: 0.1, servingSize: '100g' },
  { id: 'b-109', name: '감자', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: '100g' },
  { id: 'b-110', name: '아보카도', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: '100g' },
  { id: 'b-111', name: '토마토', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: '100g' },

  /* ── 과일 ────────────────────────────────── */
  { id: 'b-120', name: '바나나', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '1개 100g' },
  { id: 'b-121', name: '사과', calories: 104, protein: 0.5, carbs: 28, fat: 0.3, servingSize: '1개 200g' },
  { id: 'b-122', name: '귤', calories: 37, protein: 0.6, carbs: 9.4, fat: 0.1, servingSize: '1개 80g' },
  { id: 'b-123', name: '포도', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, servingSize: '100g' },
  { id: 'b-124', name: '수박', calories: 60, protein: 1.2, carbs: 15, fat: 0.2, servingSize: '200g' },
  { id: 'b-125', name: '딸기', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, servingSize: '100g' },
  { id: 'b-126', name: '블루베리', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: '100g' },
  { id: 'b-127', name: '오렌지', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, servingSize: '1개 150g' },
  { id: 'b-128', name: '키위', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, servingSize: '1개 100g' },
  { id: 'b-129', name: '복숭아', calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, servingSize: '1개 150g' },

  /* ── 유제품 / 단백질 보충 ───────────────────── */
  { id: 'b-140', name: '우유', calories: 122, protein: 6.2, carbs: 9.6, fat: 6.6, servingSize: '200ml' },
  { id: 'b-141', name: '저지방우유', calories: 86, protein: 6.8, carbs: 9.8, fat: 2.4, servingSize: '200ml' },
  { id: 'b-142', name: '플레인요거트', calories: 90, protein: 5.3, carbs: 13, fat: 2, servingSize: '150g' },
  { id: 'b-143', name: '그릭요거트', calories: 130, protein: 12, carbs: 7, fat: 5, servingSize: '150g' },
  { id: 'b-144', name: '프로틴바', calories: 190, protein: 20, carbs: 20, fat: 6, servingSize: '1개 50g' },
  { id: 'b-145', name: '프로틴쉐이크', calories: 160, protein: 28, carbs: 8, fat: 3, servingSize: '1컵 250ml' },
  { id: 'b-146', name: '치즈 (슬라이스)', calories: 70, protein: 4.5, carbs: 1, fat: 5.5, servingSize: '1장 20g' },
  { id: 'b-147', name: '아이스크림', calories: 200, protein: 3.5, carbs: 26, fat: 9.5, servingSize: '1개 100g' },

  /* ── 빵 / 시리얼 ─────────────────────────── */
  { id: 'b-150', name: '식빵', calories: 158, protein: 5.2, carbs: 31, fat: 2, servingSize: '2장 60g' },
  { id: 'b-151', name: '바게트', calories: 275, protein: 9, carbs: 55, fat: 1.5, servingSize: '100g' },
  { id: 'b-152', name: '크로와상', calories: 406, protein: 8, carbs: 46, fat: 21, servingSize: '1개 80g' },
  { id: 'b-153', name: '오트밀', calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: '100g 건' },
  { id: 'b-154', name: '그래놀라', calories: 450, protein: 11, carbs: 65, fat: 17, servingSize: '100g' },
  { id: 'b-155', name: '시리얼', calories: 370, protein: 8, carbs: 80, fat: 3, servingSize: '100g' },

  /* ── 한식 반찬 ────────────────────────────── */
  { id: 'b-160', name: '김치', calories: 30, protein: 2, carbs: 6, fat: 0.5, servingSize: '100g' },
  { id: 'b-161', name: '깍두기', calories: 28, protein: 1.3, carbs: 6.5, fat: 0.3, servingSize: '100g' },
  { id: 'b-162', name: '멸치볶음', calories: 110, protein: 14, carbs: 8, fat: 3, servingSize: '50g' },
  { id: 'b-163', name: '콩조림', calories: 180, protein: 13, carbs: 22, fat: 4, servingSize: '100g' },
  { id: 'b-164', name: '시금치나물', calories: 50, protein: 3.5, carbs: 6, fat: 1.5, servingSize: '100g' },
  { id: 'b-165', name: '도라지나물', calories: 60, protein: 1.5, carbs: 10, fat: 1.5, servingSize: '100g' },
  { id: 'b-166', name: '잡채', calories: 220, protein: 5, carbs: 38, fat: 6, servingSize: '1인분 150g' },

  /* ── 기타 / 음료 ─────────────────────────── */
  { id: 'b-170', name: '아메리카노', calories: 10, protein: 0.1, carbs: 2, fat: 0.1, servingSize: '1잔 350ml' },
  { id: 'b-171', name: '라떼 (카페)', calories: 130, protein: 5, carbs: 15, fat: 5.5, servingSize: '1잔 350ml' },
  { id: 'b-172', name: '콜라 (355ml)', calories: 155, protein: 0, carbs: 40, fat: 0, servingSize: '355ml' },
  { id: 'b-173', name: '오렌지주스', calories: 110, protein: 1.7, carbs: 26, fat: 0.5, servingSize: '200ml' },
  { id: 'b-174', name: '프로틴음료', calories: 100, protein: 20, carbs: 5, fat: 1, servingSize: '200ml' },
  { id: 'b-175', name: '에너지바', calories: 210, protein: 6, carbs: 32, fat: 7, servingSize: '1개 60g' },
]

/** 쿼리 문자열로 식품 검색 (이름 포함 여부) */
export function searchBuiltinFoods(q: string, limit = 6): BuiltinFood[] {
  const query = q.trim().toLowerCase()
  if (!query) return []
  return BUILTIN_FOODS
    .filter(f => f.name.toLowerCase().includes(query))
    .slice(0, limit)
}
