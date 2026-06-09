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

  /* ══════════════════════════════════════════
   * 육류 / 단백질
   * ══════════════════════════════════════════ */
  { id: 'b-001', name: '닭가슴살', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
  { id: 'b-002', name: '닭가슴살구이', calories: 148, protein: 29, carbs: 0, fat: 3, servingSize: '100g' },
  { id: 'b-003', name: '닭다리살', calories: 185, protein: 26, carbs: 0, fat: 9, servingSize: '100g' },
  { id: 'b-004', name: '닭날개', calories: 203, protein: 18, carbs: 0, fat: 14, servingSize: '100g' },
  { id: 'b-005', name: '닭볶음탕', calories: 380, protein: 32, carbs: 22, fat: 16, servingSize: '1인분 300g' },
  { id: 'b-006', name: '닭갈비', calories: 340, protein: 28, carbs: 24, fat: 14, servingSize: '1인분 250g' },
  { id: 'b-007', name: '닭강정', calories: 420, protein: 22, carbs: 44, fat: 16, servingSize: '1인분 200g' },
  { id: 'b-008', name: '찜닭', calories: 360, protein: 30, carbs: 28, fat: 14, servingSize: '1인분 300g' },
  { id: 'b-009', name: '치킨 (후라이드)', calories: 250, protein: 22, carbs: 14, fat: 12, servingSize: '100g' },
  { id: 'b-010', name: '치킨 (양념)', calories: 280, protein: 20, carbs: 20, fat: 13, servingSize: '100g' },
  { id: 'b-011', name: '오리로스', calories: 210, protein: 20, carbs: 0, fat: 14, servingSize: '100g' },
  { id: 'b-012', name: '오리훈제', calories: 235, protein: 20, carbs: 2, fat: 16, servingSize: '100g' },
  { id: 'b-013', name: '삼겹살', calories: 331, protein: 18, carbs: 0, fat: 29, servingSize: '100g' },
  { id: 'b-014', name: '돼지고기 목살', calories: 230, protein: 20, carbs: 0, fat: 16, servingSize: '100g' },
  { id: 'b-015', name: '돼지고기 등심', calories: 173, protein: 22, carbs: 0, fat: 9, servingSize: '100g' },
  { id: 'b-016', name: '돼지고기 항정살', calories: 280, protein: 19, carbs: 0, fat: 22, servingSize: '100g' },
  { id: 'b-017', name: '돼지고기 앞다리', calories: 190, protein: 21, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'b-018', name: '제육볶음', calories: 380, protein: 24, carbs: 18, fat: 22, servingSize: '1인분 200g' },
  { id: 'b-019', name: '돼지갈비구이', calories: 310, protein: 24, carbs: 10, fat: 19, servingSize: '1인분 200g' },
  { id: 'b-020', name: '수육 (돼지)', calories: 260, protein: 26, carbs: 0, fat: 17, servingSize: '100g' },
  { id: 'b-021', name: '보쌈', calories: 340, protein: 26, carbs: 8, fat: 22, servingSize: '1인분 200g' },
  { id: 'b-022', name: '족발', calories: 280, protein: 28, carbs: 6, fat: 16, servingSize: '100g' },
  { id: 'b-023', name: '소고기 등심', calories: 250, protein: 22, carbs: 0, fat: 17, servingSize: '100g' },
  { id: 'b-024', name: '소고기 안심', calories: 200, protein: 23, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'b-025', name: '소고기 채끝', calories: 270, protein: 22, carbs: 0, fat: 19, servingSize: '100g' },
  { id: 'b-026', name: '차돌박이', calories: 350, protein: 15, carbs: 0, fat: 32, servingSize: '100g' },
  { id: 'b-027', name: '우삼겹', calories: 330, protein: 16, carbs: 0, fat: 30, servingSize: '100g' },
  { id: 'b-028', name: '불고기', calories: 310, protein: 28, carbs: 18, fat: 13, servingSize: '1인분 200g' },
  { id: 'b-029', name: '갈비구이', calories: 400, protein: 30, carbs: 10, fat: 26, servingSize: '1인분 200g' },
  { id: 'b-030', name: '갈비찜', calories: 520, protein: 38, carbs: 28, fat: 28, servingSize: '1인분 300g' },
  { id: 'b-031', name: '소고기 장조림', calories: 200, protein: 24, carbs: 10, fat: 7, servingSize: '100g' },
  { id: 'b-032', name: '육회', calories: 180, protein: 22, carbs: 6, fat: 8, servingSize: '100g' },

  /* ── 해산물 ─────────────────────────────── */
  { id: 'b-040', name: '참치캔', calories: 119, protein: 26, carbs: 0, fat: 1, servingSize: '100g' },
  { id: 'b-041', name: '고등어구이', calories: 184, protein: 21, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'b-042', name: '고등어조림', calories: 200, protein: 19, carbs: 8, fat: 10, servingSize: '100g' },
  { id: 'b-043', name: '갈치구이', calories: 155, protein: 23, carbs: 0, fat: 6.5, servingSize: '100g' },
  { id: 'b-044', name: '조기구이', calories: 130, protein: 22, carbs: 0, fat: 4.5, servingSize: '100g' },
  { id: 'b-045', name: '꽁치구이', calories: 172, protein: 21, carbs: 0, fat: 9.5, servingSize: '100g' },
  { id: 'b-046', name: '장어구이', calories: 255, protein: 19, carbs: 0, fat: 19, servingSize: '100g' },
  { id: 'b-047', name: '연어', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g' },
  { id: 'b-048', name: '연어스테이크', calories: 220, protein: 22, carbs: 0, fat: 14, servingSize: '100g' },
  { id: 'b-049', name: '새우', calories: 99, protein: 21, carbs: 0.9, fat: 1.1, servingSize: '100g' },
  { id: 'b-050', name: '새우볶음', calories: 160, protein: 19, carbs: 8, fat: 5, servingSize: '100g' },
  { id: 'b-051', name: '오징어볶음', calories: 220, protein: 20, carbs: 14, fat: 8, servingSize: '1인분 200g' },
  { id: 'b-052', name: '오징어', calories: 92, protein: 19, carbs: 1.5, fat: 1.2, servingSize: '100g' },
  { id: 'b-053', name: '낙지볶음', calories: 300, protein: 28, carbs: 20, fat: 8, servingSize: '1인분 250g' },
  { id: 'b-054', name: '문어숙회', calories: 82, protein: 18, carbs: 0.5, fat: 1, servingSize: '100g' },
  { id: 'b-055', name: '꼴뚜기무침', calories: 140, protein: 16, carbs: 10, fat: 3, servingSize: '100g' },
  { id: 'b-056', name: '게장 (간장)', calories: 120, protein: 14, carbs: 6, fat: 4, servingSize: '100g' },
  { id: 'b-057', name: '게장 (양념)', calories: 130, protein: 13, carbs: 8, fat: 4.5, servingSize: '100g' },
  { id: 'b-058', name: '홍합', calories: 86, protein: 12, carbs: 3.7, fat: 2.2, servingSize: '100g' },
  { id: 'b-059', name: '바지락', calories: 70, protein: 12, carbs: 2.4, fat: 1, servingSize: '100g' },
  { id: 'b-060', name: '조개구이', calories: 85, protein: 13, carbs: 3, fat: 2, servingSize: '100g' },
  { id: 'b-061', name: '굴', calories: 68, protein: 8, carbs: 4.9, fat: 2, servingSize: '100g' },

  /* ── 계란 / 두부 ─────────────────────────── */
  { id: 'b-070', name: '계란', calories: 77, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: '1개 50g' },
  { id: 'b-071', name: '계란프라이', calories: 92, protein: 6.3, carbs: 0.4, fat: 7, servingSize: '1개' },
  { id: 'b-072', name: '삶은달걀', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: '2개 100g' },
  { id: 'b-073', name: '스크램블에그', calories: 148, protein: 9.2, carbs: 2.3, fat: 11, servingSize: '2개 분량' },
  { id: 'b-074', name: '계란말이', calories: 150, protein: 10, carbs: 3, fat: 11, servingSize: '100g' },
  { id: 'b-075', name: '계란찜', calories: 80, protein: 7.5, carbs: 1.5, fat: 5, servingSize: '100g' },
  { id: 'b-076', name: '두부', calories: 76, protein: 8, carbs: 1.9, fat: 4.2, servingSize: '100g' },
  { id: 'b-077', name: '연두부', calories: 42, protein: 4.2, carbs: 1.3, fat: 2.3, servingSize: '100g' },
  { id: 'b-078', name: '두부조림', calories: 130, protein: 9, carbs: 7, fat: 7.5, servingSize: '100g' },
  { id: 'b-079', name: '두부김치', calories: 200, protein: 12, carbs: 10, fat: 10, servingSize: '1인분 200g' },
  { id: 'b-080', name: '순두부', calories: 50, protein: 5, carbs: 1.5, fat: 2.5, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 밥류
   * ══════════════════════════════════════════ */
  { id: 'b-100', name: '흰쌀밥', calories: 313, protein: 5.5, carbs: 69, fat: 0.5, servingSize: '1공기 210g' },
  { id: 'b-101', name: '현미밥', calories: 340, protein: 6, carbs: 72, fat: 2, servingSize: '1공기 210g' },
  { id: 'b-102', name: '잡곡밥', calories: 320, protein: 6.5, carbs: 68, fat: 1.5, servingSize: '1공기 210g' },
  { id: 'b-103', name: '흑미밥', calories: 330, protein: 6, carbs: 70, fat: 1.5, servingSize: '1공기 210g' },
  { id: 'b-104', name: '볶음밥', calories: 420, protein: 9, carbs: 75, fat: 10, servingSize: '1인분 250g' },
  { id: 'b-105', name: '김치볶음밥', calories: 450, protein: 10, carbs: 76, fat: 12, servingSize: '1인분 250g' },
  { id: 'b-106', name: '새우볶음밥', calories: 440, protein: 14, carbs: 74, fat: 11, servingSize: '1인분 250g' },
  { id: 'b-107', name: '해물볶음밥', calories: 430, protein: 13, carbs: 73, fat: 10, servingSize: '1인분 250g' },
  { id: 'b-108', name: '김밥', calories: 400, protein: 12, carbs: 68, fat: 8, servingSize: '1줄 250g' },
  { id: 'b-109', name: '참치김밥', calories: 420, protein: 16, carbs: 68, fat: 9, servingSize: '1줄 250g' },
  { id: 'b-110', name: '비빔밥', calories: 550, protein: 18, carbs: 95, fat: 12, servingSize: '1인분 500g' },
  { id: 'b-111', name: '돌솥비빔밥', calories: 580, protein: 19, carbs: 98, fat: 14, servingSize: '1인분 500g' },
  { id: 'b-112', name: '초밥', calories: 250, protein: 10, carbs: 46, fat: 3, servingSize: '5피스 150g' },
  { id: 'b-113', name: '오므라이스', calories: 490, protein: 14, carbs: 72, fat: 16, servingSize: '1인분 350g' },
  { id: 'b-114', name: '카레라이스', calories: 540, protein: 14, carbs: 92, fat: 13, servingSize: '1인분 450g' },
  { id: 'b-115', name: '소불고기덮밥', calories: 580, protein: 22, carbs: 88, fat: 14, servingSize: '1인분 450g' },
  { id: 'b-116', name: '제육덮밥', calories: 600, protein: 24, carbs: 86, fat: 16, servingSize: '1인분 450g' },
  { id: 'b-117', name: '낙지덮밥', calories: 520, protein: 24, carbs: 84, fat: 10, servingSize: '1인분 450g' },
  { id: 'b-118', name: '장어덮밥', calories: 620, protein: 26, carbs: 88, fat: 18, servingSize: '1인분 450g' },
  { id: 'b-119', name: '닭갈비덮밥', calories: 580, protein: 26, carbs: 88, fat: 14, servingSize: '1인분 450g' },
  { id: 'b-120', name: '쌈밥', calories: 480, protein: 22, carbs: 72, fat: 14, servingSize: '1인분 400g' },
  { id: 'b-121', name: '삼각김밥', calories: 180, protein: 4.5, carbs: 36, fat: 2, servingSize: '1개 100g' },
  { id: 'b-122', name: '주먹밥', calories: 200, protein: 5, carbs: 40, fat: 2.5, servingSize: '1개 110g' },
  { id: 'b-123', name: '영양밥', calories: 340, protein: 8, carbs: 68, fat: 3, servingSize: '1공기 210g' },
  { id: 'b-124', name: '콩나물밥', calories: 310, protein: 7, carbs: 64, fat: 2, servingSize: '1공기 210g' },

  /* ══════════════════════════════════════════
   * 국 / 찌개 / 탕
   * ══════════════════════════════════════════ */
  { id: 'b-130', name: '김치찌개', calories: 210, protein: 15, carbs: 12, fat: 10, servingSize: '1인분 350g' },
  { id: 'b-131', name: '된장찌개', calories: 130, protein: 10, carbs: 12, fat: 5, servingSize: '1인분 350g' },
  { id: 'b-132', name: '순두부찌개', calories: 180, protein: 12, carbs: 10, fat: 9, servingSize: '1인분 350g' },
  { id: 'b-133', name: '청국장찌개', calories: 160, protein: 13, carbs: 12, fat: 7, servingSize: '1인분 350g' },
  { id: 'b-134', name: '고추장찌개', calories: 170, protein: 11, carbs: 14, fat: 7, servingSize: '1인분 350g' },
  { id: 'b-135', name: '부대찌개', calories: 450, protein: 22, carbs: 42, fat: 19, servingSize: '1인분 500g' },
  { id: 'b-136', name: '동태찌개', calories: 140, protein: 18, carbs: 8, fat: 4, servingSize: '1인분 350g' },
  { id: 'b-137', name: '동태탕', calories: 130, protein: 17, carbs: 7, fat: 3.5, servingSize: '1인분 350g' },
  { id: 'b-138', name: '미역국', calories: 60, protein: 5, carbs: 6, fat: 2, servingSize: '1인분 350g' },
  { id: 'b-139', name: '콩나물국', calories: 50, protein: 3.5, carbs: 5.5, fat: 1.2, servingSize: '1인분 300g' },
  { id: 'b-140', name: '황태국', calories: 70, protein: 10, carbs: 4, fat: 1.5, servingSize: '1인분 300g' },
  { id: 'b-141', name: '콩나물해장국', calories: 90, protein: 7, carbs: 8, fat: 2.5, servingSize: '1인분 400g' },
  { id: 'b-142', name: '육개장', calories: 190, protein: 18, carbs: 10, fat: 8, servingSize: '1인분 350g' },
  { id: 'b-143', name: '닭개장', calories: 180, protein: 20, carbs: 8, fat: 7, servingSize: '1인분 350g' },
  { id: 'b-144', name: '삼계탕', calories: 620, protein: 55, carbs: 42, fat: 22, servingSize: '1인분 800g' },
  { id: 'b-145', name: '설렁탕', calories: 380, protein: 28, carbs: 28, fat: 18, servingSize: '1인분 600g' },
  { id: 'b-146', name: '갈비탕', calories: 420, protein: 32, carbs: 24, fat: 22, servingSize: '1인분 600g' },
  { id: 'b-147', name: '곰탕', calories: 340, protein: 26, carbs: 22, fat: 16, servingSize: '1인분 600g' },
  { id: 'b-148', name: '꼬리곰탕', calories: 440, protein: 30, carbs: 20, fat: 26, servingSize: '1인분 600g' },
  { id: 'b-149', name: '도가니탕', calories: 360, protein: 28, carbs: 18, fat: 18, servingSize: '1인분 600g' },
  { id: 'b-150', name: '감자탕', calories: 480, protein: 32, carbs: 30, fat: 24, servingSize: '1인분 600g' },
  { id: 'b-151', name: '해장국', calories: 280, protein: 20, carbs: 22, fat: 12, servingSize: '1인분 500g' },
  { id: 'b-152', name: '우거지탕', calories: 200, protein: 16, carbs: 16, fat: 8, servingSize: '1인분 450g' },
  { id: 'b-153', name: '전골 (곱창)', calories: 380, protein: 24, carbs: 22, fat: 20, servingSize: '1인분 400g' },
  { id: 'b-154', name: '부대전골', calories: 430, protein: 22, carbs: 38, fat: 18, servingSize: '1인분 500g' },

  /* ══════════════════════════════════════════
   * 면류
   * ══════════════════════════════════════════ */
  { id: 'b-160', name: '라면', calories: 510, protein: 11, carbs: 77, fat: 17, servingSize: '1봉 120g' },
  { id: 'b-161', name: '짜파게티', calories: 490, protein: 10, carbs: 76, fat: 15, servingSize: '1봉 140g' },
  { id: 'b-162', name: '컵라면', calories: 300, protein: 7, carbs: 46, fat: 10, servingSize: '1개 65g' },
  { id: 'b-163', name: '짜장면', calories: 760, protein: 20, carbs: 130, fat: 16, servingSize: '1인분 650g' },
  { id: 'b-164', name: '짬뽕', calories: 640, protein: 28, carbs: 90, fat: 18, servingSize: '1인분 700g' },
  { id: 'b-165', name: '탕수육', calories: 520, protein: 18, carbs: 62, fat: 22, servingSize: '1인분 250g' },
  { id: 'b-166', name: '칼국수', calories: 480, protein: 16, carbs: 88, fat: 8, servingSize: '1인분 600g' },
  { id: 'b-167', name: '수제비', calories: 440, protein: 13, carbs: 82, fat: 7, servingSize: '1인분 600g' },
  { id: 'b-168', name: '잔치국수', calories: 380, protein: 12, carbs: 72, fat: 5, servingSize: '1인분 500g' },
  { id: 'b-169', name: '비빔국수', calories: 410, protein: 12, carbs: 78, fat: 7, servingSize: '1인분 500g' },
  { id: 'b-170', name: '열무국수', calories: 360, protein: 11, carbs: 70, fat: 4, servingSize: '1인분 500g' },
  { id: 'b-171', name: '물냉면', calories: 540, protein: 14, carbs: 108, fat: 5, servingSize: '1인분 650g' },
  { id: 'b-172', name: '비빔냉면', calories: 560, protein: 13, carbs: 110, fat: 7, servingSize: '1인분 600g' },
  { id: 'b-173', name: '우동', calories: 420, protein: 13, carbs: 78, fat: 7, servingSize: '1인분 550g' },
  { id: 'b-174', name: '볶음우동', calories: 520, protein: 16, carbs: 82, fat: 14, servingSize: '1인분 500g' },
  { id: 'b-175', name: '쌀국수', calories: 320, protein: 10, carbs: 64, fat: 3, servingSize: '1인분 500g' },
  { id: 'b-176', name: '팟타이', calories: 490, protein: 18, carbs: 72, fat: 14, servingSize: '1인분 400g' },
  { id: 'b-177', name: '스파게티', calories: 380, protein: 14, carbs: 62, fat: 9, servingSize: '1인분 250g' },
  { id: 'b-178', name: '크림파스타', calories: 520, protein: 14, carbs: 62, fat: 24, servingSize: '1인분 280g' },
  { id: 'b-179', name: '명란파스타', calories: 470, protein: 16, carbs: 63, fat: 17, servingSize: '1인분 260g' },
  { id: 'b-180', name: '로제파스타', calories: 500, protein: 14, carbs: 62, fat: 22, servingSize: '1인분 270g' },
  { id: 'b-181', name: '떡국', calories: 460, protein: 16, carbs: 80, fat: 8, servingSize: '1인분 550g' },
  { id: 'b-182', name: '만두국', calories: 420, protein: 16, carbs: 72, fat: 9, servingSize: '1인분 500g' },

  /* ══════════════════════════════════════════
   * 분식 / 간식
   * ══════════════════════════════════════════ */
  { id: 'b-190', name: '떡볶이', calories: 420, protein: 12, carbs: 78, fat: 8, servingSize: '1인분 300g' },
  { id: 'b-191', name: '로제떡볶이', calories: 480, protein: 13, carbs: 80, fat: 14, servingSize: '1인분 300g' },
  { id: 'b-192', name: '궁중떡볶이', calories: 390, protein: 14, carbs: 72, fat: 7, servingSize: '1인분 300g' },
  { id: 'b-193', name: '순대', calories: 310, protein: 14, carbs: 28, fat: 16, servingSize: '1인분 150g' },
  { id: 'b-194', name: '어묵', calories: 100, protein: 8, carbs: 13, fat: 1.5, servingSize: '100g' },
  { id: 'b-195', name: '어묵국', calories: 120, protein: 9, carbs: 14, fat: 2, servingSize: '1인분 300g' },
  { id: 'b-196', name: '튀김', calories: 380, protein: 8, carbs: 42, fat: 19, servingSize: '1인분 150g' },
  { id: 'b-197', name: '감자튀김', calories: 312, protein: 3.8, carbs: 42, fat: 15, servingSize: '중간 100g' },
  { id: 'b-198', name: '치즈스틱', calories: 260, protein: 10, carbs: 26, fat: 13, servingSize: '3개 100g' },
  { id: 'b-199', name: '모짜렐라스틱', calories: 240, protein: 11, carbs: 22, fat: 13, servingSize: '3개 100g' },
  { id: 'b-200', name: '만두 (찐)', calories: 230, protein: 10, carbs: 32, fat: 7, servingSize: '5개 150g' },
  { id: 'b-201', name: '만두 (군)', calories: 290, protein: 10, carbs: 34, fat: 12, servingSize: '5개 150g' },
  { id: 'b-202', name: '핫도그', calories: 280, protein: 9, carbs: 30, fat: 14, servingSize: '1개 120g' },
  { id: 'b-203', name: '호떡', calories: 300, protein: 5, carbs: 52, fat: 8, servingSize: '1개 100g' },
  { id: 'b-204', name: '붕어빵', calories: 180, protein: 4, carbs: 34, fat: 3.5, servingSize: '1개 80g' },
  { id: 'b-205', name: '호빵', calories: 230, protein: 6, carbs: 42, fat: 4, servingSize: '1개 100g' },
  { id: 'b-206', name: '잡채', calories: 220, protein: 5, carbs: 38, fat: 6, servingSize: '1인분 150g' },

  /* ══════════════════════════════════════════
   * 패스트푸드 / 서양식
   * ══════════════════════════════════════════ */
  { id: 'b-210', name: '햄버거', calories: 450, protein: 22, carbs: 45, fat: 20, servingSize: '1개 200g' },
  { id: 'b-211', name: '치즈버거', calories: 500, protein: 25, carbs: 46, fat: 24, servingSize: '1개 210g' },
  { id: 'b-212', name: '피자 (1조각)', calories: 280, protein: 12, carbs: 34, fat: 10, servingSize: '1조각 120g' },
  { id: 'b-213', name: '피자 (콤비네이션 1조각)', calories: 300, protein: 14, carbs: 34, fat: 12, servingSize: '1조각 130g' },
  { id: 'b-214', name: '토스트', calories: 280, protein: 9, carbs: 40, fat: 9, servingSize: '1개' },
  { id: 'b-215', name: '샌드위치', calories: 320, protein: 14, carbs: 42, fat: 10, servingSize: '1개 180g' },
  { id: 'b-216', name: '클럽샌드위치', calories: 400, protein: 18, carbs: 44, fat: 16, servingSize: '1개 220g' },
  { id: 'b-217', name: 'BLT샌드위치', calories: 380, protein: 16, carbs: 40, fat: 16, servingSize: '1개 200g' },
  { id: 'b-218', name: '핫도그 (소시지)', calories: 290, protein: 11, carbs: 28, fat: 15, servingSize: '1개 130g' },
  { id: 'b-219', name: '샐러드 (그린)', calories: 80, protein: 3, carbs: 10, fat: 3, servingSize: '1인분 200g' },
  { id: 'b-220', name: '닭가슴살샐러드', calories: 200, protein: 28, carbs: 12, fat: 5, servingSize: '1인분 300g' },
  { id: 'b-221', name: '계란샐러드', calories: 180, protein: 12, carbs: 8, fat: 11, servingSize: '1인분 200g' },
  { id: 'b-222', name: '스테이크', calories: 300, protein: 28, carbs: 0, fat: 20, servingSize: '150g' },

  /* ══════════════════════════════════════════
   * 채소
   * ══════════════════════════════════════════ */
  { id: 'b-230', name: '브로콜리', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: '100g' },
  { id: 'b-231', name: '시금치', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g' },
  { id: 'b-232', name: '콩나물', calories: 30, protein: 3.2, carbs: 4.6, fat: 0.2, servingSize: '100g' },
  { id: 'b-233', name: '양배추', calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, servingSize: '100g' },
  { id: 'b-234', name: '당근', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'b-235', name: '오이', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: '100g' },
  { id: 'b-236', name: '양파', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, servingSize: '100g' },
  { id: 'b-237', name: '파프리카', calories: 31, protein: 1, carbs: 7.2, fat: 0.3, servingSize: '100g' },
  { id: 'b-238', name: '고구마', calories: 128, protein: 1.6, carbs: 30, fat: 0.1, servingSize: '100g' },
  { id: 'b-239', name: '감자', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: '100g' },
  { id: 'b-240', name: '아보카도', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: '100g' },
  { id: 'b-241', name: '토마토', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: '100g' },
  { id: 'b-242', name: '상추', calories: 14, protein: 1.3, carbs: 2.4, fat: 0.2, servingSize: '100g' },
  { id: 'b-243', name: '깻잎', calories: 36, protein: 3.5, carbs: 5.5, fat: 0.7, servingSize: '100g' },
  { id: 'b-244', name: '부추', calories: 30, protein: 2.5, carbs: 5.2, fat: 0.4, servingSize: '100g' },
  { id: 'b-245', name: '애호박', calories: 20, protein: 1.4, carbs: 4, fat: 0.2, servingSize: '100g' },
  { id: 'b-246', name: '가지', calories: 25, protein: 1, carbs: 6, fat: 0.2, servingSize: '100g' },
  { id: 'b-247', name: '무', calories: 20, protein: 0.6, carbs: 4.6, fat: 0.1, servingSize: '100g' },
  { id: 'b-248', name: '배추', calories: 15, protein: 1.5, carbs: 2.8, fat: 0.1, servingSize: '100g' },
  { id: 'b-249', name: '고사리나물', calories: 55, protein: 4, carbs: 8, fat: 1.5, servingSize: '100g' },
  { id: 'b-250', name: '도라지나물', calories: 60, protein: 1.5, carbs: 10, fat: 1.5, servingSize: '100g' },
  { id: 'b-251', name: '시금치나물', calories: 50, protein: 3.5, carbs: 6, fat: 1.5, servingSize: '100g' },
  { id: 'b-252', name: '취나물', calories: 45, protein: 3, carbs: 7, fat: 1, servingSize: '100g' },
  { id: 'b-253', name: '두릅나물', calories: 40, protein: 3.5, carbs: 5.5, fat: 0.5, servingSize: '100g' },
  { id: 'b-254', name: '아스파라거스', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, servingSize: '100g' },
  { id: 'b-255', name: '옥수수', calories: 365, protein: 8.5, carbs: 73, fat: 4.7, servingSize: '100g 건' },
  { id: 'b-256', name: '찐옥수수', calories: 130, protein: 4, carbs: 27, fat: 1.5, servingSize: '1개 200g' },

  /* ══════════════════════════════════════════
   * 과일
   * ══════════════════════════════════════════ */
  { id: 'b-260', name: '바나나', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '1개 100g' },
  { id: 'b-261', name: '사과', calories: 104, protein: 0.5, carbs: 28, fat: 0.3, servingSize: '1개 200g' },
  { id: 'b-262', name: '귤', calories: 37, protein: 0.6, carbs: 9.4, fat: 0.1, servingSize: '1개 80g' },
  { id: 'b-263', name: '포도', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, servingSize: '100g' },
  { id: 'b-264', name: '수박', calories: 60, protein: 1.2, carbs: 15, fat: 0.2, servingSize: '200g' },
  { id: 'b-265', name: '딸기', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, servingSize: '100g' },
  { id: 'b-266', name: '블루베리', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: '100g' },
  { id: 'b-267', name: '오렌지', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, servingSize: '1개 150g' },
  { id: 'b-268', name: '키위', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, servingSize: '1개 100g' },
  { id: 'b-269', name: '복숭아', calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, servingSize: '1개 150g' },
  { id: 'b-270', name: '망고', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, servingSize: '100g' },
  { id: 'b-271', name: '파인애플', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, servingSize: '100g' },
  { id: 'b-272', name: '멜론', calories: 34, protein: 0.8, carbs: 8, fat: 0.2, servingSize: '100g' },
  { id: 'b-273', name: '참외', calories: 31, protein: 0.8, carbs: 7.5, fat: 0.1, servingSize: '1개 200g' },
  { id: 'b-274', name: '배', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, servingSize: '1개 200g' },
  { id: 'b-275', name: '자두', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, servingSize: '1개 80g' },
  { id: 'b-276', name: '체리', calories: 63, protein: 1, carbs: 16, fat: 0.2, servingSize: '100g' },
  { id: 'b-277', name: '레몬', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 유제품 / 단백질
   * ══════════════════════════════════════════ */
  { id: 'b-280', name: '우유', calories: 122, protein: 6.2, carbs: 9.6, fat: 6.6, servingSize: '200ml' },
  { id: 'b-281', name: '저지방우유', calories: 86, protein: 6.8, carbs: 9.8, fat: 2.4, servingSize: '200ml' },
  { id: 'b-282', name: '초코우유', calories: 140, protein: 5, carbs: 22, fat: 4, servingSize: '200ml' },
  { id: 'b-283', name: '딸기우유', calories: 130, protein: 4.5, carbs: 21, fat: 3.5, servingSize: '200ml' },
  { id: 'b-284', name: '두유', calories: 80, protein: 4, carbs: 10, fat: 2.5, servingSize: '200ml' },
  { id: 'b-285', name: '플레인요거트', calories: 90, protein: 5.3, carbs: 13, fat: 2, servingSize: '150g' },
  { id: 'b-286', name: '그릭요거트', calories: 130, protein: 12, carbs: 7, fat: 5, servingSize: '150g' },
  { id: 'b-287', name: '아이스크림 (바닐라)', calories: 200, protein: 3.5, carbs: 26, fat: 9.5, servingSize: '1개 100g' },
  { id: 'b-288', name: '아이스크림 (초코)', calories: 210, protein: 4, carbs: 26, fat: 10, servingSize: '1개 100g' },
  { id: 'b-289', name: '슬라이스치즈', calories: 70, protein: 4.5, carbs: 1, fat: 5.5, servingSize: '1장 20g' },
  { id: 'b-290', name: '크림치즈', calories: 342, protein: 6, carbs: 4.1, fat: 34, servingSize: '30g' },
  { id: 'b-291', name: '모짜렐라치즈', calories: 280, protein: 22, carbs: 2.2, fat: 20, servingSize: '100g' },
  { id: 'b-292', name: '버터', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, servingSize: '10g' },
  { id: 'b-293', name: '프로틴바', calories: 190, protein: 20, carbs: 20, fat: 6, servingSize: '1개 50g' },
  { id: 'b-294', name: '프로틴쉐이크', calories: 160, protein: 28, carbs: 8, fat: 3, servingSize: '1컵 250ml' },

  /* ══════════════════════════════════════════
   * 빵 / 시리얼 / 디저트
   * ══════════════════════════════════════════ */
  { id: 'b-300', name: '식빵', calories: 158, protein: 5.2, carbs: 31, fat: 2, servingSize: '2장 60g' },
  { id: 'b-301', name: '바게트', calories: 275, protein: 9, carbs: 55, fat: 1.5, servingSize: '100g' },
  { id: 'b-302', name: '크로와상', calories: 406, protein: 8, carbs: 46, fat: 21, servingSize: '1개 80g' },
  { id: 'b-303', name: '단팥빵', calories: 250, protein: 6, carbs: 46, fat: 5, servingSize: '1개 100g' },
  { id: 'b-304', name: '크림빵', calories: 280, protein: 6.5, carbs: 42, fat: 9, servingSize: '1개 100g' },
  { id: 'b-305', name: '소보로빵', calories: 310, protein: 7, carbs: 48, fat: 10, servingSize: '1개 110g' },
  { id: 'b-306', name: '카스텔라', calories: 310, protein: 8, carbs: 56, fat: 7, servingSize: '100g' },
  { id: 'b-307', name: '도넛', calories: 350, protein: 5, carbs: 46, fat: 17, servingSize: '1개 100g' },
  { id: 'b-308', name: '와플', calories: 290, protein: 7, carbs: 42, fat: 11, servingSize: '1개 100g' },
  { id: 'b-309', name: '팬케이크', calories: 260, protein: 6.5, carbs: 40, fat: 9, servingSize: '2장 100g' },
  { id: 'b-310', name: '오트밀', calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: '100g 건' },
  { id: 'b-311', name: '그래놀라', calories: 450, protein: 11, carbs: 65, fat: 17, servingSize: '100g' },
  { id: 'b-312', name: '시리얼', calories: 370, protein: 8, carbs: 80, fat: 3, servingSize: '100g' },
  { id: 'b-313', name: '케이크 (생크림)', calories: 320, protein: 4.5, carbs: 42, fat: 15, servingSize: '1조각 100g' },
  { id: 'b-314', name: '마카롱', calories: 120, protein: 2.5, carbs: 16, fat: 5.5, servingSize: '1개 30g' },
  { id: 'b-315', name: '쿠키', calories: 480, protein: 6, carbs: 64, fat: 22, servingSize: '100g' },
  { id: 'b-316', name: '초콜릿', calories: 546, protein: 5, carbs: 60, fat: 31, servingSize: '40g' },
  { id: 'b-317', name: '포카칩', calories: 540, protein: 5, carbs: 62, fat: 30, servingSize: '66g' },
  { id: 'b-318', name: '새우깡', calories: 480, protein: 6, carbs: 68, fat: 20, servingSize: '90g' },

  /* ══════════════════════════════════════════
   * 한식 반찬
   * ══════════════════════════════════════════ */
  { id: 'b-320', name: '김치', calories: 30, protein: 2, carbs: 6, fat: 0.5, servingSize: '100g' },
  { id: 'b-321', name: '깍두기', calories: 28, protein: 1.3, carbs: 6.5, fat: 0.3, servingSize: '100g' },
  { id: 'b-322', name: '멸치볶음', calories: 110, protein: 14, carbs: 8, fat: 3, servingSize: '50g' },
  { id: 'b-323', name: '콩조림', calories: 180, protein: 13, carbs: 22, fat: 4, servingSize: '100g' },
  { id: 'b-324', name: '감자조림', calories: 130, protein: 2.5, carbs: 24, fat: 3.5, servingSize: '100g' },
  { id: 'b-325', name: '달걀조림', calories: 160, protein: 11, carbs: 6, fat: 10, servingSize: '100g' },
  { id: 'b-326', name: '마파두부', calories: 160, protein: 11, carbs: 8, fat: 9, servingSize: '1인분 200g' },
  { id: 'b-327', name: '김구이', calories: 270, protein: 9, carbs: 27, fat: 15, servingSize: '10장 10g' },
  { id: 'b-328', name: '북어채무침', calories: 100, protein: 16, carbs: 5, fat: 2, servingSize: '100g' },
  { id: 'b-329', name: '오징어채볶음', calories: 130, protein: 15, carbs: 12, fat: 2.5, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 음료
   * ══════════════════════════════════════════ */
  { id: 'b-340', name: '아메리카노', calories: 10, protein: 0.1, carbs: 2, fat: 0.1, servingSize: '1잔 350ml' },
  { id: 'b-341', name: '카페라떼', calories: 130, protein: 5, carbs: 15, fat: 5.5, servingSize: '1잔 350ml' },
  { id: 'b-342', name: '카푸치노', calories: 110, protein: 5.5, carbs: 11, fat: 5, servingSize: '1잔 300ml' },
  { id: 'b-343', name: '녹차', calories: 2, protein: 0.2, carbs: 0.5, fat: 0, servingSize: '1잔 200ml' },
  { id: 'b-344', name: '홍차', calories: 2, protein: 0.1, carbs: 0.5, fat: 0, servingSize: '1잔 200ml' },
  { id: 'b-345', name: '콜라 (355ml)', calories: 155, protein: 0, carbs: 40, fat: 0, servingSize: '355ml' },
  { id: 'b-346', name: '사이다 (355ml)', calories: 145, protein: 0, carbs: 37, fat: 0, servingSize: '355ml' },
  { id: 'b-347', name: '오렌지주스', calories: 110, protein: 1.7, carbs: 26, fat: 0.5, servingSize: '200ml' },
  { id: 'b-348', name: '이온음료 (포카리)', calories: 50, protein: 0, carbs: 12.5, fat: 0, servingSize: '240ml' },
  { id: 'b-349', name: '에너지드링크', calories: 110, protein: 1, carbs: 27, fat: 0, servingSize: '250ml' },
  { id: 'b-350', name: '맥주', calories: 150, protein: 1.3, carbs: 13, fat: 0, servingSize: '350ml' },
  { id: 'b-351', name: '소주', calories: 143, protein: 0, carbs: 0.2, fat: 0, servingSize: '1잔 50ml × 6' },
  { id: 'b-352', name: '막걸리', calories: 190, protein: 2, carbs: 22, fat: 0, servingSize: '1컵 200ml' },
  { id: 'b-353', name: '두유', calories: 80, protein: 4, carbs: 10, fat: 2.5, servingSize: '200ml' },
  { id: 'b-354', name: '프로틴음료', calories: 100, protein: 20, carbs: 5, fat: 1, servingSize: '200ml' },
  { id: 'b-355', name: '스무디 (바나나)', calories: 160, protein: 4, carbs: 34, fat: 2, servingSize: '300ml' },

  /* ══════════════════════════════════════════
   * 기타 재료 / 견과류
   * ══════════════════════════════════════════ */
  { id: 'b-360', name: '아몬드', calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: '30g' },
  { id: 'b-361', name: '호두', calories: 654, protein: 15, carbs: 14, fat: 65, servingSize: '30g' },
  { id: 'b-362', name: '땅콩', calories: 567, protein: 26, carbs: 16, fat: 49, servingSize: '30g' },
  { id: 'b-363', name: '캐슈넛', calories: 553, protein: 18, carbs: 30, fat: 44, servingSize: '30g' },
  { id: 'b-364', name: '쌀떡', calories: 225, protein: 4, carbs: 50, fat: 0.5, servingSize: '100g' },
  { id: 'b-365', name: '떡볶이떡', calories: 225, protein: 4, carbs: 50, fat: 0.5, servingSize: '100g' },
  { id: 'b-366', name: '현미떡', calories: 210, protein: 4.5, carbs: 46, fat: 1, servingSize: '100g' },
  { id: 'b-367', name: '에너지바', calories: 210, protein: 6, carbs: 32, fat: 7, servingSize: '1개 60g' },
  { id: 'b-368', name: '닭가슴살소시지', calories: 130, protein: 16, carbs: 8, fat: 4, servingSize: '1개 75g' },
  { id: 'b-369', name: '비엔나소시지', calories: 290, protein: 11, carbs: 3, fat: 26, servingSize: '100g' },
  { id: 'b-370', name: '햄 (슬라이스)', calories: 180, protein: 16, carbs: 3, fat: 11, servingSize: '100g' },
  { id: 'b-371', name: '베이컨', calories: 540, protein: 37, carbs: 1.4, fat: 42, servingSize: '100g' },
  { id: 'b-372', name: '참기름', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '1큰술 14g' },
  { id: 'b-373', name: '올리브오일', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '1큰술 14g' },
  { id: 'b-374', name: '꿀', calories: 304, protein: 0.3, carbs: 82, fat: 0, servingSize: '1큰술 21g' },
  { id: 'b-375', name: '설탕', calories: 387, protein: 0, carbs: 100, fat: 0, servingSize: '1큰술 12g' },

  /* ══════════════════════════════════════════
   * 편의점 / 즉석식
   * ══════════════════════════════════════════ */
  { id: 'b-380', name: '편의점 도시락', calories: 580, protein: 20, carbs: 88, fat: 14, servingSize: '1개 380g' },
  { id: 'b-381', name: '컵밥', calories: 380, protein: 9, carbs: 72, fat: 6, servingSize: '1개 260g' },
  { id: 'b-382', name: '즉석국밥', calories: 440, protein: 14, carbs: 78, fat: 9, servingSize: '1개 350g' },
  { id: 'b-383', name: '즉석카레', calories: 180, protein: 5, carbs: 28, fat: 5.5, servingSize: '1개 200g' },
  { id: 'b-384', name: '햄김밥', calories: 420, protein: 13, carbs: 70, fat: 9, servingSize: '1줄 250g' },
  { id: 'b-385', name: '치즈김밥', calories: 440, protein: 14, carbs: 70, fat: 11, servingSize: '1줄 250g' },
  { id: 'b-386', name: '소불고기김밥', calories: 450, protein: 15, carbs: 72, fat: 11, servingSize: '1줄 260g' },

  /* ══════════════════════════════════════════
   * 전 / 부침개
   * ══════════════════════════════════════════ */
  { id: 'b-390', name: '파전', calories: 380, protein: 8, carbs: 52, fat: 16, servingSize: '1인분 250g' },
  { id: 'b-391', name: '해물파전', calories: 420, protein: 16, carbs: 54, fat: 16, servingSize: '1인분 280g' },
  { id: 'b-392', name: '김치전', calories: 360, protein: 9, carbs: 50, fat: 14, servingSize: '1인분 200g' },
  { id: 'b-393', name: '부추전', calories: 320, protein: 8, carbs: 48, fat: 11, servingSize: '1인분 200g' },
  { id: 'b-394', name: '호박전', calories: 250, protein: 6, carbs: 36, fat: 9, servingSize: '1인분 150g' },
  { id: 'b-395', name: '감자전', calories: 300, protein: 5, carbs: 48, fat: 10, servingSize: '1인분 200g' },
  { id: 'b-396', name: '동그랑땡', calories: 240, protein: 14, carbs: 14, fat: 14, servingSize: '100g' },
  { id: 'b-397', name: '빈대떡', calories: 380, protein: 14, carbs: 46, fat: 16, servingSize: '1인분 200g' },
  { id: 'b-398', name: '계란빵', calories: 200, protein: 8, carbs: 30, fat: 6, servingSize: '1개 100g' },
  { id: 'b-399', name: '녹두전', calories: 350, protein: 13, carbs: 44, fat: 14, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 곱창 / 내장 / 특수부위
   * ══════════════════════════════════════════ */
  { id: 'b-400', name: '곱창볶음', calories: 340, protein: 22, carbs: 16, fat: 22, servingSize: '1인분 200g' },
  { id: 'b-401', name: '소곱창구이', calories: 290, protein: 20, carbs: 2, fat: 22, servingSize: '100g' },
  { id: 'b-402', name: '대창구이', calories: 380, protein: 20, carbs: 2, fat: 32, servingSize: '100g' },
  { id: 'b-403', name: '막창구이', calories: 320, protein: 22, carbs: 4, fat: 24, servingSize: '100g' },
  { id: 'b-404', name: '돼지껍데기', calories: 340, protein: 28, carbs: 0, fat: 26, servingSize: '100g' },
  { id: 'b-405', name: '닭발', calories: 215, protein: 22, carbs: 0.5, fat: 14, servingSize: '100g' },
  { id: 'b-406', name: '소간', calories: 137, protein: 21, carbs: 5, fat: 4, servingSize: '100g' },
  { id: 'b-407', name: '염통구이', calories: 165, protein: 27, carbs: 0.1, fat: 6, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 돈가스 / 튀김류
   * ══════════════════════════════════════════ */
  { id: 'b-410', name: '돈가스', calories: 480, protein: 22, carbs: 38, fat: 26, servingSize: '1인분 200g' },
  { id: 'b-411', name: '치즈돈가스', calories: 520, protein: 24, carbs: 38, fat: 30, servingSize: '1인분 210g' },
  { id: 'b-412', name: '왕돈가스', calories: 650, protein: 30, carbs: 50, fat: 36, servingSize: '1인분 280g' },
  { id: 'b-413', name: '새우튀김', calories: 280, protein: 14, carbs: 26, fat: 13, servingSize: '3개 150g' },
  { id: 'b-414', name: '오징어튀김', calories: 320, protein: 18, carbs: 28, fat: 15, servingSize: '1인분 150g' },
  { id: 'b-415', name: '치킨커틀렛', calories: 440, protein: 26, carbs: 36, fat: 20, servingSize: '1인분 200g' },
  { id: 'b-416', name: '고구마튀김', calories: 240, protein: 2, carbs: 42, fat: 7.5, servingSize: '100g' },
  { id: 'b-417', name: '야채튀김', calories: 250, protein: 4, carbs: 34, fat: 11, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 일식
   * ══════════════════════════════════════════ */
  { id: 'b-420', name: '돈카츠', calories: 480, protein: 22, carbs: 38, fat: 26, servingSize: '1인분 200g' },
  { id: 'b-421', name: '가라아게', calories: 280, protein: 22, carbs: 14, fat: 15, servingSize: '100g' },
  { id: 'b-422', name: '오야코동', calories: 560, protein: 28, carbs: 72, fat: 16, servingSize: '1인분 400g' },
  { id: 'b-423', name: '규동', calories: 580, protein: 24, carbs: 76, fat: 18, servingSize: '1인분 400g' },
  { id: 'b-424', name: '텐동', calories: 620, protein: 20, carbs: 80, fat: 24, servingSize: '1인분 400g' },
  { id: 'b-425', name: '라멘 (돈코츠)', calories: 580, protein: 26, carbs: 72, fat: 20, servingSize: '1인분 700g' },
  { id: 'b-426', name: '라멘 (쇼유)', calories: 520, protein: 24, carbs: 70, fat: 16, servingSize: '1인분 700g' },
  { id: 'b-427', name: '미소라멘', calories: 540, protein: 24, carbs: 70, fat: 18, servingSize: '1인분 700g' },
  { id: 'b-428', name: '야키소바', calories: 460, protein: 16, carbs: 72, fat: 13, servingSize: '1인분 400g' },
  { id: 'b-429', name: '오코노미야키', calories: 420, protein: 16, carbs: 50, fat: 18, servingSize: '1인분 250g' },
  { id: 'b-430', name: '회덮밥', calories: 520, protein: 24, carbs: 82, fat: 10, servingSize: '1인분 450g' },
  { id: 'b-431', name: '연어덮밥', calories: 560, protein: 26, carbs: 76, fat: 16, servingSize: '1인분 400g' },
  { id: 'b-432', name: '소바 (냉)', calories: 360, protein: 14, carbs: 68, fat: 3, servingSize: '1인분 450g' },
  { id: 'b-433', name: '소바 (온)', calories: 380, protein: 14, carbs: 72, fat: 4, servingSize: '1인분 500g' },
  { id: 'b-434', name: '나베', calories: 280, protein: 22, carbs: 18, fat: 12, servingSize: '1인분 500g' },
  { id: 'b-435', name: '야키토리', calories: 200, protein: 22, carbs: 8, fat: 9, servingSize: '3꼬치 150g' },
  { id: 'b-436', name: '스키야키', calories: 480, protein: 28, carbs: 36, fat: 22, servingSize: '1인분 400g' },
  { id: 'b-437', name: '초밥 (연어)', calories: 50, protein: 3.5, carbs: 8, fat: 1, servingSize: '1피스 30g' },
  { id: 'b-438', name: '초밥 (참치)', calories: 52, protein: 4, carbs: 8, fat: 0.5, servingSize: '1피스 30g' },
  { id: 'b-439', name: '초밥 (새우)', calories: 45, protein: 3, carbs: 8, fat: 0.3, servingSize: '1피스 30g' },

  /* ══════════════════════════════════════════
   * 중식
   * ══════════════════════════════════════════ */
  { id: 'b-440', name: '마라탕', calories: 520, protein: 22, carbs: 50, fat: 26, servingSize: '1인분 600g' },
  { id: 'b-441', name: '마라샹궈', calories: 580, protein: 28, carbs: 40, fat: 36, servingSize: '1인분 500g' },
  { id: 'b-442', name: '양꼬치', calories: 280, protein: 22, carbs: 4, fat: 20, servingSize: '100g' },
  { id: 'b-443', name: '깐풍기', calories: 380, protein: 24, carbs: 28, fat: 18, servingSize: '1인분 200g' },
  { id: 'b-444', name: '유린기', calories: 320, protein: 26, carbs: 18, fat: 16, servingSize: '1인분 200g' },
  { id: 'b-445', name: '팔보채', calories: 280, protein: 20, carbs: 22, fat: 12, servingSize: '1인분 250g' },
  { id: 'b-446', name: '동파육', calories: 480, protein: 18, carbs: 14, fat: 40, servingSize: '1인분 200g' },
  { id: 'b-447', name: '훠궈', calories: 450, protein: 26, carbs: 32, fat: 24, servingSize: '1인분 500g' },
  { id: 'b-448', name: '중화풍볶음밥', calories: 480, protein: 12, carbs: 72, fat: 16, servingSize: '1인분 300g' },
  { id: 'b-449', name: '중화냉면', calories: 500, protein: 14, carbs: 88, fat: 10, servingSize: '1인분 600g' },

  /* ══════════════════════════════════════════
   * 서양식 / 브런치
   * ══════════════════════════════════════════ */
  { id: 'b-450', name: '리조또', calories: 420, protein: 12, carbs: 60, fat: 14, servingSize: '1인분 300g' },
  { id: 'b-451', name: '뇨끼', calories: 380, protein: 10, carbs: 66, fat: 9, servingSize: '1인분 300g' },
  { id: 'b-452', name: '아보카도토스트', calories: 280, protein: 8, carbs: 30, fat: 15, servingSize: '1인분 180g' },
  { id: 'b-453', name: '에그베네딕트', calories: 380, protein: 18, carbs: 32, fat: 20, servingSize: '1인분 220g' },
  { id: 'b-454', name: '시저샐러드', calories: 200, protein: 10, carbs: 14, fat: 12, servingSize: '1인분 250g' },
  { id: 'b-455', name: '그릭샐러드', calories: 180, protein: 6, carbs: 12, fat: 13, servingSize: '1인분 250g' },
  { id: 'b-456', name: '카프레제', calories: 220, protein: 12, carbs: 6, fat: 16, servingSize: '1인분 200g' },
  { id: 'b-457', name: '랩', calories: 320, protein: 16, carbs: 38, fat: 12, servingSize: '1개 200g' },
  { id: 'b-458', name: '타코', calories: 290, protein: 14, carbs: 32, fat: 12, servingSize: '2개 180g' },
  { id: 'b-459', name: '부리또', calories: 500, protein: 20, carbs: 68, fat: 16, servingSize: '1개 300g' },

  /* ══════════════════════════════════════════
   * 죽류
   * ══════════════════════════════════════════ */
  { id: 'b-460', name: '흰죽', calories: 100, protein: 2.5, carbs: 22, fat: 0.5, servingSize: '1인분 300g' },
  { id: 'b-461', name: '닭죽', calories: 160, protein: 12, carbs: 22, fat: 3, servingSize: '1인분 350g' },
  { id: 'b-462', name: '전복죽', calories: 180, protein: 10, carbs: 26, fat: 4, servingSize: '1인분 350g' },
  { id: 'b-463', name: '야채죽', calories: 120, protein: 3, carbs: 24, fat: 1.5, servingSize: '1인분 350g' },
  { id: 'b-464', name: '팥죽', calories: 250, protein: 8, carbs: 48, fat: 2, servingSize: '1인분 350g' },
  { id: 'b-465', name: '호박죽', calories: 130, protein: 2.5, carbs: 28, fat: 1, servingSize: '1인분 350g' },
  { id: 'b-466', name: '잣죽', calories: 210, protein: 5, carbs: 28, fat: 9, servingSize: '1인분 350g' },
  { id: 'b-467', name: '흑임자죽', calories: 220, protein: 5, carbs: 30, fat: 9, servingSize: '1인분 300g' },
  { id: 'b-468', name: '소고기죽', calories: 170, protein: 12, carbs: 22, fat: 4, servingSize: '1인분 350g' },
  { id: 'b-469', name: '단호박죽', calories: 140, protein: 2.5, carbs: 30, fat: 1.5, servingSize: '1인분 350g' },

  /* ══════════════════════════════════════════
   * 전통음식 / 한과
   * ══════════════════════════════════════════ */
  { id: 'b-470', name: '인절미', calories: 220, protein: 4, carbs: 46, fat: 2, servingSize: '100g' },
  { id: 'b-471', name: '가래떡', calories: 230, protein: 4, carbs: 52, fat: 0.5, servingSize: '100g' },
  { id: 'b-472', name: '약식', calories: 290, protein: 4, carbs: 58, fat: 6, servingSize: '100g' },
  { id: 'b-473', name: '식혜', calories: 80, protein: 0.5, carbs: 20, fat: 0, servingSize: '1컵 200ml' },
  { id: 'b-474', name: '수정과', calories: 90, protein: 0.3, carbs: 22, fat: 0.1, servingSize: '1컵 200ml' },
  { id: 'b-475', name: '약과', calories: 350, protein: 5, carbs: 58, fat: 12, servingSize: '100g' },
  { id: 'b-476', name: '강정', calories: 400, protein: 8, carbs: 62, fat: 14, servingSize: '100g' },
  { id: 'b-477', name: '유과', calories: 380, protein: 6, carbs: 62, fat: 12, servingSize: '100g' },
  { id: 'b-478', name: '한과', calories: 360, protein: 5, carbs: 60, fat: 11, servingSize: '100g' },
  { id: 'b-479', name: '시루떡', calories: 240, protein: 5, carbs: 50, fat: 2.5, servingSize: '100g' },
  { id: 'b-480', name: '찹쌀떡', calories: 250, protein: 4, carbs: 54, fat: 1.5, servingSize: '1개 80g' },
  { id: 'b-481', name: '절편', calories: 210, protein: 3.5, carbs: 48, fat: 0.5, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 건강식 / 저칼로리
   * ══════════════════════════════════════════ */
  { id: 'b-485', name: '곤약면', calories: 10, protein: 0.1, carbs: 2.5, fat: 0, servingSize: '200g' },
  { id: 'b-486', name: '곤약밥', calories: 25, protein: 0, carbs: 6, fat: 0, servingSize: '150g' },
  { id: 'b-487', name: '두부면', calories: 35, protein: 4, carbs: 1, fat: 1.5, servingSize: '100g' },
  { id: 'b-488', name: '누룽지', calories: 370, protein: 7, carbs: 78, fat: 1, servingSize: '100g' },
  { id: 'b-489', name: '미숫가루', calories: 370, protein: 12, carbs: 68, fat: 6, servingSize: '3큰술 30g' },
  { id: 'b-490', name: '닭가슴살소시지', calories: 130, protein: 16, carbs: 8, fat: 4, servingSize: '1개 75g' },
  { id: 'b-491', name: '현미떡', calories: 210, protein: 4.5, carbs: 46, fat: 1, servingSize: '100g' },
  { id: 'b-492', name: '단백질팬케이크', calories: 200, protein: 18, carbs: 22, fat: 5, servingSize: '2장 100g' },

  /* ══════════════════════════════════════════
   * 버섯류
   * ══════════════════════════════════════════ */
  { id: 'b-495', name: '느타리버섯', calories: 25, protein: 2.6, carbs: 4.7, fat: 0.3, servingSize: '100g' },
  { id: 'b-496', name: '표고버섯', calories: 34, protein: 2.2, carbs: 7, fat: 0.5, servingSize: '100g' },
  { id: 'b-497', name: '팽이버섯', calories: 37, protein: 2.7, carbs: 7.4, fat: 0.3, servingSize: '100g' },
  { id: 'b-498', name: '새송이버섯', calories: 27, protein: 2.1, carbs: 6, fat: 0.3, servingSize: '100g' },
  { id: 'b-499', name: '양송이버섯', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, servingSize: '100g' },
  { id: 'b-500', name: '버섯볶음', calories: 80, protein: 3.5, carbs: 8, fat: 4, servingSize: '100g' },
  { id: 'b-501', name: '버섯전골', calories: 160, protein: 10, carbs: 16, fat: 6, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 커피 / 음료 추가
   * ══════════════════════════════════════════ */
  { id: 'b-505', name: '아이스아메리카노', calories: 10, protein: 0.1, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'b-506', name: '바닐라라떼', calories: 200, protein: 5, carbs: 28, fat: 7, servingSize: '350ml' },
  { id: 'b-507', name: '카라멜마끼아또', calories: 230, protein: 6, carbs: 33, fat: 8, servingSize: '350ml' },
  { id: 'b-508', name: '그린티라떼', calories: 190, protein: 6, carbs: 30, fat: 5, servingSize: '350ml' },
  { id: 'b-509', name: '딸기라떼', calories: 210, protein: 5, carbs: 34, fat: 6, servingSize: '350ml' },
  { id: 'b-510', name: '핫초코', calories: 200, protein: 6, carbs: 28, fat: 7, servingSize: '300ml' },
  { id: 'b-511', name: '바나나우유', calories: 140, protein: 4, carbs: 24, fat: 3.5, servingSize: '240ml' },
  { id: 'b-512', name: '아이스티', calories: 80, protein: 0, carbs: 20, fat: 0, servingSize: '350ml' },
  { id: 'b-513', name: '사과주스', calories: 115, protein: 0.3, carbs: 28, fat: 0.3, servingSize: '250ml' },
  { id: 'b-514', name: '포도주스', calories: 140, protein: 0.4, carbs: 34, fat: 0.1, servingSize: '250ml' },
  { id: 'b-515', name: '토마토주스', calories: 40, protein: 1.8, carbs: 8, fat: 0.2, servingSize: '200ml' },
  { id: 'b-516', name: '탄산수', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '250ml' },
  { id: 'b-517', name: '프로틴음료', calories: 100, protein: 20, carbs: 5, fat: 1, servingSize: '200ml' },
  { id: 'b-518', name: '유자차', calories: 60, protein: 0.2, carbs: 15, fat: 0, servingSize: '1잔 200ml' },
  { id: 'b-519', name: '매실차', calories: 45, protein: 0.1, carbs: 11, fat: 0, servingSize: '1잔 200ml' },
  { id: 'b-520', name: '생강차', calories: 30, protein: 0.1, carbs: 7.5, fat: 0, servingSize: '1잔 200ml' },
  { id: 'b-521', name: '버블티 (밀크티)', calories: 300, protein: 3, carbs: 52, fat: 8, servingSize: '500ml' },
  { id: 'b-522', name: '스무디 (딸기)', calories: 180, protein: 3, carbs: 38, fat: 2, servingSize: '300ml' },
  { id: 'b-523', name: '와인 (레드)', calories: 85, protein: 0.1, carbs: 2.6, fat: 0, servingSize: '1잔 150ml' },
  { id: 'b-524', name: '와인 (화이트)', calories: 82, protein: 0.1, carbs: 2.6, fat: 0, servingSize: '1잔 150ml' },
  { id: 'b-525', name: '하이볼', calories: 120, protein: 0, carbs: 10, fat: 0, servingSize: '300ml' },
  { id: 'b-526', name: '매실주', calories: 170, protein: 0.2, carbs: 20, fat: 0, servingSize: '1잔 50ml' },

  /* ══════════════════════════════════════════
   * 반찬 추가
   * ══════════════════════════════════════════ */
  { id: 'b-530', name: '연근조림', calories: 140, protein: 2, carbs: 32, fat: 1, servingSize: '100g' },
  { id: 'b-531', name: '우엉조림', calories: 150, protein: 2.5, carbs: 30, fat: 2.5, servingSize: '100g' },
  { id: 'b-532', name: '마늘쫑볶음', calories: 90, protein: 2.5, carbs: 14, fat: 2.5, servingSize: '100g' },
  { id: 'b-533', name: '무생채', calories: 40, protein: 0.8, carbs: 8.5, fat: 0.5, servingSize: '100g' },
  { id: 'b-534', name: '오이무침', calories: 35, protein: 1, carbs: 6.5, fat: 0.8, servingSize: '100g' },
  { id: 'b-535', name: '총각김치', calories: 28, protein: 1.5, carbs: 5.5, fat: 0.3, servingSize: '100g' },
  { id: 'b-536', name: '열무김치', calories: 25, protein: 1.5, carbs: 5, fat: 0.2, servingSize: '100g' },
  { id: 'b-537', name: '오이소박이', calories: 25, protein: 1, carbs: 5.5, fat: 0.2, servingSize: '100g' },
  { id: 'b-538', name: '파김치', calories: 30, protein: 2, carbs: 6, fat: 0.4, servingSize: '100g' },
  { id: 'b-539', name: '갓김치', calories: 28, protein: 1.8, carbs: 5.8, fat: 0.3, servingSize: '100g' },
  { id: 'b-540', name: '나박김치', calories: 18, protein: 1, carbs: 4, fat: 0.1, servingSize: '100g' },
  { id: 'b-541', name: '무말랭이무침', calories: 95, protein: 2, carbs: 20, fat: 1.5, servingSize: '50g' },
  { id: 'b-542', name: '북어포무침', calories: 100, protein: 16, carbs: 5, fat: 2, servingSize: '100g' },
  { id: 'b-543', name: '어묵볶음', calories: 130, protein: 9, carbs: 14, fat: 4.5, servingSize: '100g' },
  { id: 'b-544', name: '소시지볶음', calories: 260, protein: 10, carbs: 8, fat: 21, servingSize: '100g' },
  { id: 'b-545', name: '햄볶음', calories: 230, protein: 14, carbs: 6, fat: 17, servingSize: '100g' },
  { id: 'b-546', name: '두부부침', calories: 120, protein: 9, carbs: 4, fat: 7, servingSize: '100g' },
  { id: 'b-547', name: '가지볶음', calories: 70, protein: 1.5, carbs: 7, fat: 4, servingSize: '100g' },
  { id: 'b-548', name: '애호박볶음', calories: 55, protein: 1.5, carbs: 7, fat: 2.5, servingSize: '100g' },
  { id: 'b-549', name: '버섯나물', calories: 50, protein: 2.5, carbs: 7, fat: 1.5, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 포장마차 / 길거리음식
   * ══════════════════════════════════════════ */
  { id: 'b-550', name: '꼬치어묵', calories: 150, protein: 9, carbs: 18, fat: 4.5, servingSize: '1개 100g' },
  { id: 'b-551', name: '닭꼬치', calories: 220, protein: 20, carbs: 8, fat: 11, servingSize: '1꼬치 100g' },
  { id: 'b-552', name: '떡꼬치', calories: 210, protein: 4, carbs: 42, fat: 3.5, servingSize: '1꼬치 130g' },
  { id: 'b-553', name: '군고구마', calories: 128, protein: 1.6, carbs: 30, fat: 0.1, servingSize: '100g' },
  { id: 'b-554', name: '군밤', calories: 245, protein: 4, carbs: 53, fat: 2.4, servingSize: '100g' },
  { id: 'b-555', name: '꽈배기', calories: 380, protein: 6, carbs: 60, fat: 13, servingSize: '1개 100g' },
  { id: 'b-556', name: '찐빵', calories: 240, protein: 7, carbs: 44, fat: 4, servingSize: '1개 100g' },
  { id: 'b-557', name: '타코야키', calories: 260, protein: 10, carbs: 30, fat: 11, servingSize: '6개 150g' },

  /* ══════════════════════════════════════════
   * 과자 / 스낵 추가
   * ══════════════════════════════════════════ */
  { id: 'b-560', name: '감자칩', calories: 530, protein: 6, carbs: 56, fat: 32, servingSize: '60g' },
  { id: 'b-561', name: '초코파이', calories: 235, protein: 2.5, carbs: 40, fat: 8, servingSize: '1개 50g' },
  { id: 'b-562', name: '빼빼로', calories: 500, protein: 8, carbs: 62, fat: 24, servingSize: '54g' },
  { id: 'b-563', name: '오징어집', calories: 460, protein: 14, carbs: 68, fat: 14, servingSize: '78g' },
  { id: 'b-564', name: '뻥튀기', calories: 360, protein: 7, carbs: 78, fat: 1, servingSize: '100g' },
  { id: 'b-565', name: '쌀과자', calories: 380, protein: 7, carbs: 78, fat: 4, servingSize: '100g' },
  { id: 'b-566', name: '누룽지과자', calories: 390, protein: 6, carbs: 80, fat: 5, servingSize: '100g' },
  { id: 'b-567', name: '곡물바', calories: 190, protein: 4, carbs: 32, fat: 6, servingSize: '1개 50g' },
  { id: 'b-568', name: '치토스', calories: 540, protein: 7, carbs: 56, fat: 32, servingSize: '62g' },
  { id: 'b-569', name: '양파링', calories: 510, protein: 6, carbs: 64, fat: 25, servingSize: '84g' },

  /* ══════════════════════════════════════════
   * 디저트 추가
   * ══════════════════════════════════════════ */
  { id: 'b-570', name: '치즈케이크', calories: 320, protein: 7, carbs: 32, fat: 19, servingSize: '1조각 100g' },
  { id: 'b-571', name: '티라미수', calories: 280, protein: 5, carbs: 30, fat: 16, servingSize: '1조각 100g' },
  { id: 'b-572', name: '에클레어', calories: 290, protein: 6, carbs: 32, fat: 15, servingSize: '1개 100g' },
  { id: 'b-573', name: '타르트', calories: 300, protein: 5, carbs: 36, fat: 15, servingSize: '1조각 90g' },
  { id: 'b-574', name: '마들렌', calories: 380, protein: 6, carbs: 46, fat: 18, servingSize: '2개 60g' },
  { id: 'b-575', name: '롤케이크', calories: 290, protein: 5, carbs: 38, fat: 13, servingSize: '1조각 80g' },
  { id: 'b-576', name: '슈크림', calories: 220, protein: 5, carbs: 26, fat: 11, servingSize: '1개 70g' },
  { id: 'b-577', name: '푸딩', calories: 130, protein: 3.5, carbs: 22, fat: 4, servingSize: '1개 120g' },
  { id: 'b-578', name: '젤리', calories: 80, protein: 1.5, carbs: 18, fat: 0, servingSize: '1봉 50g' },
  { id: 'b-579', name: '쿠키 (초코칩)', calories: 490, protein: 6, carbs: 62, fat: 24, servingSize: '100g' },
  { id: 'b-580', name: '아이스크림 바', calories: 180, protein: 2.5, carbs: 22, fat: 9, servingSize: '1개 70g' },
  { id: 'b-581', name: '소프트아이스크림', calories: 150, protein: 3.5, carbs: 22, fat: 5.5, servingSize: '1개 100g' },
  { id: 'b-582', name: '팥빙수', calories: 340, protein: 5, carbs: 68, fat: 5, servingSize: '1인분 300g' },
  { id: 'b-583', name: '빙수 (망고)', calories: 380, protein: 4, carbs: 76, fat: 6, servingSize: '1인분 300g' },

  /* ══════════════════════════════════════════
   * 추가 식재료 / 곡물
   * ══════════════════════════════════════════ */
  { id: 'b-590', name: '당면', calories: 360, protein: 0.3, carbs: 88, fat: 0.1, servingSize: '100g 건' },
  { id: 'b-591', name: '천사채', calories: 5, protein: 0, carbs: 1.5, fat: 0, servingSize: '100g' },
  { id: 'b-592', name: '곤약', calories: 6, protein: 0.1, carbs: 1.5, fat: 0, servingSize: '100g' },
  { id: 'b-593', name: '낫토', calories: 195, protein: 17, carbs: 14, fat: 10, servingSize: '100g' },
  { id: 'b-594', name: '두부강정', calories: 280, protein: 14, carbs: 24, fat: 14, servingSize: '1인분 150g' },
  { id: 'b-595', name: '콩국수', calories: 380, protein: 16, carbs: 56, fat: 10, servingSize: '1인분 500g' },
  { id: 'b-596', name: '숙주나물', calories: 26, protein: 2.6, carbs: 4.2, fat: 0.2, servingSize: '100g' },
  { id: 'b-597', name: '미나리무침', calories: 30, protein: 2.4, carbs: 5.2, fat: 0.3, servingSize: '100g' },
  { id: 'b-598', name: '비트', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'b-599', name: '셀러리', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 과자 / 스낵 (브랜드 상품)
   * ══════════════════════════════════════════ */
  { id: 'b-600', name: '허니버터칩', calories: 555, protein: 5, carbs: 65, fat: 30, servingSize: '60g' },
  { id: 'b-601', name: '프링글스 (오리지널)', calories: 540, protein: 5, carbs: 56, fat: 34, servingSize: '57g' },
  { id: 'b-602', name: '꼬깔콘', calories: 500, protein: 7, carbs: 65, fat: 23, servingSize: '72g' },
  { id: 'b-603', name: '홈런볼', calories: 515, protein: 6, carbs: 65, fat: 26, servingSize: '74g' },
  { id: 'b-604', name: '오레오', calories: 480, protein: 5, carbs: 71, fat: 20, servingSize: '100g' },
  { id: 'b-605', name: '에이스', calories: 495, protein: 8, carbs: 64, fat: 23, servingSize: '100g' },
  { id: 'b-606', name: '리츠크래커', calories: 510, protein: 7, carbs: 63, fat: 26, servingSize: '100g' },
  { id: 'b-607', name: '칸초', calories: 520, protein: 7, carbs: 67, fat: 25, servingSize: '84g' },
  { id: 'b-608', name: '카라멜콘 (땅콩)', calories: 490, protein: 8, carbs: 68, fat: 20, servingSize: '90g' },
  { id: 'b-609', name: '오징어땅콩', calories: 490, protein: 14, carbs: 65, fat: 19, servingSize: '90g' },
  { id: 'b-610', name: '고래밥', calories: 460, protein: 7, carbs: 70, fat: 17, servingSize: '80g' },
  { id: 'b-611', name: 'ABC초코', calories: 505, protein: 7, carbs: 68, fat: 24, servingSize: '100g' },
  { id: 'b-612', name: '마가렛트', calories: 510, protein: 6.5, carbs: 67, fat: 25, servingSize: '100g' },
  { id: 'b-613', name: '버터링', calories: 530, protein: 6, carbs: 65, fat: 28, servingSize: '100g' },
  { id: 'b-614', name: '칙촉', calories: 520, protein: 6.5, carbs: 67, fat: 26, servingSize: '100g' },
  { id: 'b-615', name: '몽쉘', calories: 480, protein: 5.5, carbs: 60, fat: 24, servingSize: '4개 96g' },
  { id: 'b-616', name: '카스타드', calories: 415, protein: 6, carbs: 56, fat: 19, servingSize: '5개 150g' },
  { id: 'b-617', name: '초코송이', calories: 520, protein: 6, carbs: 66, fat: 27, servingSize: '90g' },
  { id: 'b-618', name: '꼬북칩', calories: 555, protein: 6, carbs: 63, fat: 31, servingSize: '55g' },
  { id: 'b-619', name: '사또밥', calories: 380, protein: 7, carbs: 80, fat: 3, servingSize: '90g' },
  { id: 'b-620', name: '꿀꽈배기', calories: 470, protein: 7, carbs: 72, fat: 17, servingSize: '90g' },
  { id: 'b-621', name: '와클', calories: 540, protein: 6, carbs: 62, fat: 30, servingSize: '70g' },
  { id: 'b-622', name: '다이제', calories: 490, protein: 8, carbs: 70, fat: 20, servingSize: '100g' },
  { id: 'b-623', name: '롯데샌드', calories: 505, protein: 6, carbs: 67, fat: 25, servingSize: '100g' },
  { id: 'b-624', name: '빠다코코낫', calories: 500, protein: 7.5, carbs: 65, fat: 24, servingSize: '100g' },
  { id: 'b-625', name: '크라운산도', calories: 510, protein: 6, carbs: 66, fat: 26, servingSize: '100g' },
  { id: 'b-626', name: '참붕어빵 (냉동)', calories: 250, protein: 5, carbs: 46, fat: 5, servingSize: '3개 90g' },
  { id: 'b-627', name: '핫브레이크', calories: 520, protein: 7, carbs: 60, fat: 28, servingSize: '74g' },
  { id: 'b-628', name: '포스틱', calories: 490, protein: 8, carbs: 66, fat: 22, servingSize: '83g' },
  { id: 'b-629', name: '자가비', calories: 520, protein: 5.5, carbs: 62, fat: 28, servingSize: '90g' },

  /* ══════════════════════════════════════════
   * 사탕 / 젤리 / 초콜릿
   * ══════════════════════════════════════════ */
  { id: 'b-630', name: '아이셔 (레몬)', calories: 350, protein: 0, carbs: 88, fat: 0, servingSize: '1봉 100g' },
  { id: 'b-631', name: '하리보 젤리', calories: 340, protein: 6.5, carbs: 76, fat: 0, servingSize: '100g' },
  { id: 'b-632', name: '마이쮸', calories: 360, protein: 0.5, carbs: 88, fat: 1, servingSize: '1봉 100g' },
  { id: 'b-633', name: '가나초콜릿', calories: 550, protein: 7, carbs: 56, fat: 33, servingSize: '50g' },
  { id: 'b-634', name: '킷캣', calories: 515, protein: 7, carbs: 63, fat: 26, servingSize: '45g' },
  { id: 'b-635', name: '투유 초콜릿', calories: 530, protein: 7, carbs: 58, fat: 30, servingSize: '45g' },
  { id: 'b-636', name: '페레로로쉐', calories: 575, protein: 7, carbs: 54, fat: 37, servingSize: '3개 37.5g' },
  { id: 'b-637', name: '허쉬 초콜릿', calories: 545, protein: 6, carbs: 60, fat: 32, servingSize: '43g' },
  { id: 'b-638', name: '누가바', calories: 210, protein: 1.5, carbs: 38, fat: 6, servingSize: '1개 55g' },
  { id: 'b-639', name: '롤리팝 사탕', calories: 280, protein: 0, carbs: 70, fat: 0, servingSize: '1봉 70g' },

  /* ══════════════════════════════════════════
   * 아이스크림 (브랜드)
   * ══════════════════════════════════════════ */
  { id: 'b-640', name: '메로나', calories: 110, protein: 1, carbs: 20, fat: 3, servingSize: '1개 80ml' },
  { id: 'b-641', name: '죠스바', calories: 95, protein: 0, carbs: 23, fat: 0.5, servingSize: '1개 100ml' },
  { id: 'b-642', name: '스크류바', calories: 95, protein: 0, carbs: 24, fat: 0, servingSize: '1개 100ml' },
  { id: 'b-643', name: '돼지바', calories: 210, protein: 2.5, carbs: 28, fat: 10, servingSize: '1개 80ml' },
  { id: 'b-644', name: '더위사냥', calories: 105, protein: 0.5, carbs: 25, fat: 1, servingSize: '1개 100ml' },
  { id: 'b-645', name: '빵또아', calories: 175, protein: 2.5, carbs: 26, fat: 7, servingSize: '1개 70ml' },
  { id: 'b-646', name: '월드콘', calories: 250, protein: 3, carbs: 33, fat: 12, servingSize: '1개 160ml' },
  { id: 'b-647', name: '구구콘', calories: 230, protein: 3, carbs: 30, fat: 11, servingSize: '1개 140ml' },
  { id: 'b-648', name: '투게더 (바닐라)', calories: 220, protein: 3.5, carbs: 26, fat: 12, servingSize: '1/6개 100g' },
  { id: 'b-649', name: '나뚜루 (딸기)', calories: 195, protein: 3, carbs: 26, fat: 9, servingSize: '1스쿱 100g' },
  { id: 'b-650', name: '하겐다즈 (바닐라)', calories: 269, protein: 5, carbs: 23, fat: 18, servingSize: '100ml' },
  { id: 'b-651', name: '배스킨라빈스 싱글', calories: 220, protein: 4, carbs: 27, fat: 11, servingSize: '1스쿱 100g' },
  { id: 'b-652', name: '밀키스 아이스크림', calories: 145, protein: 2.5, carbs: 19, fat: 7, servingSize: '1개 80ml' },
  { id: 'b-653', name: '찰떡아이스', calories: 145, protein: 2, carbs: 28, fat: 3, servingSize: '1개 75ml' },

  /* ══════════════════════════════════════════
   * 음료 — 탄산 / 제로
   * ══════════════════════════════════════════ */
  { id: 'b-660', name: '콜라 제로 (355ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '355ml' },
  { id: 'b-661', name: '사이다 제로 (350ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '350ml' },
  { id: 'b-662', name: '콜라 (500ml)', calories: 215, protein: 0, carbs: 54, fat: 0, servingSize: '500ml' },
  { id: 'b-663', name: '사이다 (500ml)', calories: 200, protein: 0, carbs: 51, fat: 0, servingSize: '500ml' },
  { id: 'b-664', name: '펩시 (355ml)', calories: 150, protein: 0, carbs: 41, fat: 0, servingSize: '355ml' },
  { id: 'b-665', name: '환타 오렌지 (355ml)', calories: 170, protein: 0, carbs: 44, fat: 0, servingSize: '355ml' },
  { id: 'b-666', name: '밀키스 (250ml)', calories: 145, protein: 1.5, carbs: 34, fat: 1.5, servingSize: '250ml' },
  { id: 'b-667', name: '데미소다 (250ml)', calories: 100, protein: 0, carbs: 25, fat: 0, servingSize: '250ml' },
  { id: 'b-668', name: '스프라이트 (355ml)', calories: 145, protein: 0, carbs: 37, fat: 0, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * 음료 — 에너지 / 스포츠
   * ══════════════════════════════════════════ */
  { id: 'b-670', name: '레드불 (250ml)', calories: 113, protein: 1.2, carbs: 28, fat: 0, servingSize: '250ml' },
  { id: 'b-671', name: '몬스터에너지 (355ml)', calories: 160, protein: 0, carbs: 40, fat: 0, servingSize: '355ml' },
  { id: 'b-672', name: '핫식스 (250ml)', calories: 95, protein: 0.5, carbs: 23, fat: 0, servingSize: '250ml' },
  { id: 'b-673', name: '박카스D (120ml)', calories: 73, protein: 0, carbs: 17, fat: 0, servingSize: '120ml' },
  { id: 'b-674', name: '비타500 (100ml)', calories: 40, protein: 0, carbs: 10, fat: 0, servingSize: '100ml' },
  { id: 'b-675', name: '게토레이 (600ml)', calories: 140, protein: 0, carbs: 36, fat: 0, servingSize: '600ml' },
  { id: 'b-676', name: '파워에이드 (600ml)', calories: 150, protein: 0, carbs: 39, fat: 0, servingSize: '600ml' },
  { id: 'b-677', name: '포카리스웨트 (500ml)', calories: 105, protein: 0, carbs: 26, fat: 0, servingSize: '500ml' },
  { id: 'b-678', name: '비타민워터 (500ml)', calories: 100, protein: 0, carbs: 27, fat: 0, servingSize: '500ml' },

  /* ══════════════════════════════════════════
   * 음료 — 커피 (캔 / 병)
   * ══════════════════════════════════════════ */
  { id: 'b-680', name: '레쓰비 (175ml)', calories: 71, protein: 0.7, carbs: 13, fat: 1.7, servingSize: '175ml' },
  { id: 'b-681', name: '조지아 오리지널 (240ml)', calories: 108, protein: 1.2, carbs: 21, fat: 1.6, servingSize: '240ml' },
  { id: 'b-682', name: '스타벅스 프라푸치노 (281ml)', calories: 200, protein: 4.5, carbs: 37, fat: 3.5, servingSize: '281ml' },
  { id: 'b-683', name: '바리스타 아메리카노 (300ml)', calories: 15, protein: 0.5, carbs: 2.5, fat: 0.3, servingSize: '300ml' },
  { id: 'b-684', name: '카누 (더블 샷 RTD 240ml)', calories: 90, protein: 2, carbs: 17, fat: 1.5, servingSize: '240ml' },
  { id: 'b-685', name: '맥심 TOP (275ml)', calories: 115, protein: 0.5, carbs: 22, fat: 2.5, servingSize: '275ml' },
  { id: 'b-686', name: '스타벅스 아이스커피 (330ml)', calories: 130, protein: 3, carbs: 26, fat: 1.5, servingSize: '330ml' },

  /* ══════════════════════════════════════════
   * 음료 — 주스 / 과채음료
   * ══════════════════════════════════════════ */
  { id: 'b-690', name: '아침에주스 (오렌지 180ml)', calories: 88, protein: 0.7, carbs: 21, fat: 0, servingSize: '180ml' },
  { id: 'b-691', name: '델몬트 포도주스 (200ml)', calories: 130, protein: 0.5, carbs: 32, fat: 0, servingSize: '200ml' },
  { id: 'b-692', name: '복숭아 아이스티 (500ml)', calories: 130, protein: 0, carbs: 33, fat: 0, servingSize: '500ml' },
  { id: 'b-693', name: '레몬에이드 (450ml)', calories: 150, protein: 0, carbs: 38, fat: 0, servingSize: '450ml' },
  { id: 'b-694', name: '알로에음료 (240ml)', calories: 80, protein: 0, carbs: 21, fat: 0, servingSize: '240ml' },
  { id: 'b-695', name: '코코넛워터 (330ml)', calories: 65, protein: 1, carbs: 15, fat: 0.5, servingSize: '330ml' },
  { id: 'b-696', name: '제주삼다수 (500ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '500ml' },
  { id: 'b-697', name: '토마토주스 (200ml)', calories: 40, protein: 1.8, carbs: 8, fat: 0.2, servingSize: '200ml' },
  { id: 'b-698', name: '식혜 (캔 240ml)', calories: 100, protein: 0.3, carbs: 25, fat: 0, servingSize: '240ml' },
  { id: 'b-699', name: '수정과 (캔 240ml)', calories: 95, protein: 0, carbs: 24, fat: 0, servingSize: '240ml' },

  /* ══════════════════════════════════════════
   * 음료 — 유제품 음료
   * ══════════════════════════════════════════ */
  { id: 'b-700', name: '바나나우유 (240ml)', calories: 168, protein: 4.8, carbs: 31, fat: 3, servingSize: '240ml' },
  { id: 'b-701', name: '딸기우유 (200ml)', calories: 130, protein: 4, carbs: 22, fat: 3, servingSize: '200ml' },
  { id: 'b-702', name: '초코우유 (200ml)', calories: 135, protein: 4.5, carbs: 22, fat: 3.5, servingSize: '200ml' },
  { id: 'b-703', name: '흰우유 (200ml)', calories: 130, protein: 6.4, carbs: 9.6, fat: 7.2, servingSize: '200ml' },
  { id: 'b-704', name: '저지방우유 (200ml)', calories: 90, protein: 7, carbs: 10, fat: 2, servingSize: '200ml' },
  { id: 'b-705', name: '야쿠르트 (65ml)', calories: 50, protein: 0.8, carbs: 11, fat: 0.2, servingSize: '65ml' },
  { id: 'b-706', name: '요플레 (150g)', calories: 130, protein: 4.5, carbs: 22, fat: 2.8, servingSize: '150g' },
  { id: 'b-707', name: '그릭요거트 (100g)', calories: 100, protein: 10, carbs: 6, fat: 3.5, servingSize: '100g' },
  { id: 'b-708', name: '프로바이오틱 음료 (150ml)', calories: 75, protein: 1.5, carbs: 15, fat: 0.5, servingSize: '150ml' },
  { id: 'b-709', name: '연유 (1큰술)', calories: 60, protein: 1.4, carbs: 10, fat: 1.6, servingSize: '20g' },

  /* ══════════════════════════════════════════
   * 편의점 / 가공 간식
   * ══════════════════════════════════════════ */
  { id: 'b-710', name: '삼각김밥 (참치마요)', calories: 280, protein: 8, carbs: 42, fat: 9, servingSize: '1개 120g' },
  { id: 'b-711', name: '삼각김밥 (김치참치)', calories: 265, protein: 7, carbs: 42, fat: 8, servingSize: '1개 120g' },
  { id: 'b-712', name: '삼각김밥 (불고기)', calories: 270, protein: 8.5, carbs: 42, fat: 7, servingSize: '1개 120g' },
  { id: 'b-713', name: '핫바', calories: 210, protein: 8, carbs: 18, fat: 12, servingSize: '1개 80g' },
  { id: 'b-714', name: '소떡소떡', calories: 290, protein: 8, carbs: 38, fat: 12, servingSize: '1꼬치 120g' },
  { id: 'b-715', name: '편의점 샌드위치 (햄치즈)', calories: 340, protein: 14, carbs: 44, fat: 13, servingSize: '1개 130g' },
  { id: 'b-716', name: '편의점 샌드위치 (에그)', calories: 300, protein: 11, carbs: 42, fat: 10, servingSize: '1개 120g' },
  { id: 'b-717', name: '미니핫도그 (3개입)', calories: 390, protein: 12, carbs: 45, fat: 18, servingSize: '3개 150g' },
  { id: 'b-718', name: '컵라면 (신라면)', calories: 350, protein: 8, carbs: 52, fat: 12, servingSize: '1개 68g' },
  { id: 'b-719', name: '컵라면 (불닭볶음면)', calories: 400, protein: 10, carbs: 55, fat: 15, servingSize: '1개 70g' },
  { id: 'b-720', name: '컵라면 (참깨라면)', calories: 335, protein: 7.5, carbs: 50, fat: 11, servingSize: '1개 65g' },
  { id: 'b-721', name: '컵밥 (곤드레밥)', calories: 320, protein: 7, carbs: 58, fat: 6, servingSize: '1개 195g' },
  { id: 'b-722', name: '컵밥 (낙지볶음)', calories: 350, protein: 11, carbs: 58, fat: 8, servingSize: '1개 210g' },
  { id: 'b-723', name: '편의점 도시락 (불고기)', calories: 520, protein: 18, carbs: 72, fat: 18, servingSize: '1개 330g' },
  { id: 'b-724', name: '냉동 붕어빵 (5개)', calories: 310, protein: 7, carbs: 58, fat: 6, servingSize: '5개 150g' },
  { id: 'b-725', name: '찐빵', calories: 220, protein: 5.5, carbs: 44, fat: 2.5, servingSize: '1개 90g' },
  { id: 'b-726', name: '호떡', calories: 280, protein: 5, carbs: 52, fat: 7, servingSize: '1개 100g' },
  { id: 'b-727', name: '어묵 (1개)', calories: 75, protein: 5, carbs: 8, fat: 2.5, servingSize: '1개 50g' },
  { id: 'b-728', name: '맛살 (게맛살)', calories: 90, protein: 9, carbs: 10, fat: 1, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 가공식품 — 라면 (봉지)
   * ══════════════════════════════════════════ */
  { id: 'b-730', name: '신라면 (1개)', calories: 500, protein: 10, carbs: 74, fat: 17, servingSize: '1봉 120g' },
  { id: 'b-731', name: '짜파게티 (1개)', calories: 540, protein: 11, carbs: 78, fat: 20, servingSize: '1봉 140g' },
  { id: 'b-732', name: '불닭볶음면 (1개)', calories: 530, protein: 12, carbs: 76, fat: 18, servingSize: '1봉 140g' },
  { id: 'b-733', name: '너구리 (1개)', calories: 530, protein: 11, carbs: 78, fat: 18, servingSize: '1봉 120g' },
  { id: 'b-734', name: '안성탕면 (1개)', calories: 490, protein: 10, carbs: 74, fat: 16, servingSize: '1봉 125g' },
  { id: 'b-735', name: '진라면 (1개)', calories: 500, protein: 10.5, carbs: 75, fat: 17, servingSize: '1봉 120g' },
  { id: 'b-736', name: '삼양라면 (1개)', calories: 500, protein: 10, carbs: 74, fat: 17, servingSize: '1봉 120g' },

  /* ══════════════════════════════════════════
   * 가공식품 — 냉동식품 / 즉석식품
   * ══════════════════════════════════════════ */
  { id: 'b-740', name: '냉동 피자 (1/4)', calories: 320, protein: 14, carbs: 38, fat: 13, servingSize: '1/4판 130g' },
  { id: 'b-741', name: '냉동 만두 (왕만두 3개)', calories: 360, protein: 14, carbs: 46, fat: 13, servingSize: '3개 180g' },
  { id: 'b-742', name: '냉동 군만두 (4개)', calories: 320, protein: 12, carbs: 40, fat: 12, servingSize: '4개 140g' },
  { id: 'b-743', name: '냉동 돈카츠', calories: 340, protein: 15, carbs: 36, fat: 16, servingSize: '1개 140g' },
  { id: 'b-744', name: '냉동 치킨너겟 (5개)', calories: 290, protein: 14, carbs: 26, fat: 14, servingSize: '5개 110g' },
  { id: 'b-745', name: '냉동 새우튀김', calories: 270, protein: 13, carbs: 28, fat: 12, servingSize: '5개 120g' },
  { id: 'b-746', name: '즉석 볶음밥 (새우)', calories: 420, protein: 12, carbs: 70, fat: 11, servingSize: '1봉 230g' },
  { id: 'b-747', name: '즉석 카레 (하우스 3분)', calories: 155, protein: 4, carbs: 22, fat: 5.5, servingSize: '1봉 200g' },
  { id: 'b-748', name: '즉석 짜장 (오뚜기 3분)', calories: 185, protein: 5, carbs: 30, fat: 5, servingSize: '1봉 200g' },
  { id: 'b-749', name: '참치캔 (오일)', calories: 200, protein: 25, carbs: 0, fat: 12, servingSize: '1캔 100g' },
  { id: 'b-750', name: '참치캔 (물)', calories: 130, protein: 28, carbs: 0, fat: 2, servingSize: '1캔 100g' },
  { id: 'b-751', name: '스팸 (200g)', calories: 660, protein: 28, carbs: 4, fat: 58, servingSize: '1/3캔 67g' },
  { id: 'b-752', name: '런천미트', calories: 290, protein: 13, carbs: 3, fat: 26, servingSize: '100g' },
  { id: 'b-753', name: '꽁치 통조림', calories: 160, protein: 20, carbs: 0.5, fat: 9, servingSize: '1/2캔 100g' },
  { id: 'b-754', name: '골뱅이 통조림', calories: 105, protein: 19, carbs: 4, fat: 1.5, servingSize: '1캔 기준 130g' },

  /* ══════════════════════════════════════════
   * 유제품 — 치즈
   * ══════════════════════════════════════════ */
  { id: 'b-760', name: '체다 슬라이스 치즈 (1장)', calories: 70, protein: 4, carbs: 0.5, fat: 5.5, servingSize: '1장 20g' },
  { id: 'b-761', name: '스트링치즈', calories: 85, protein: 7, carbs: 0.5, fat: 6, servingSize: '1개 28g' },
  { id: 'b-762', name: '크림치즈 (1큰술)', calories: 100, protein: 2, carbs: 1.5, fat: 10, servingSize: '2큰술 30g' },
  { id: 'b-763', name: '코티지치즈 (100g)', calories: 100, protein: 11, carbs: 3.4, fat: 4.5, servingSize: '100g' },
  { id: 'b-764', name: '리코타치즈 (100g)', calories: 175, protein: 11, carbs: 3, fat: 13, servingSize: '100g' },
  { id: 'b-765', name: '모차렐라치즈 (100g)', calories: 280, protein: 22, carbs: 2, fat: 22, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 빵 — 시판 / 베이커리
   * ══════════════════════════════════════════ */
  { id: 'b-770', name: '삼립 호빵 (팥)', calories: 255, protein: 5.5, carbs: 48, fat: 4.5, servingSize: '1개 105g' },
  { id: 'b-771', name: '삼립 호빵 (피자)', calories: 275, protein: 8, carbs: 44, fat: 7.5, servingSize: '1개 105g' },
  { id: 'b-772', name: '샤니 초코롤', calories: 290, protein: 5, carbs: 40, fat: 13, servingSize: '1개 80g' },
  { id: 'b-773', name: '브레드 (머핀)', calories: 380, protein: 5.5, carbs: 54, fat: 17, servingSize: '1개 130g' },
  { id: 'b-774', name: '모닝빵 (6개입)', calories: 300, protein: 8, carbs: 52, fat: 6.5, servingSize: '3개 90g' },
  { id: 'b-775', name: '핫도그빵 (번)', calories: 250, protein: 8, carbs: 46, fat: 4, servingSize: '1개 90g' },
  { id: 'b-776', name: '베이글', calories: 270, protein: 11, carbs: 52, fat: 2, servingSize: '1개 105g' },
  { id: 'b-777', name: '잉글리쉬머핀', calories: 210, protein: 7.5, carbs: 40, fat: 2.5, servingSize: '1개 85g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 맥도날드
   * ══════════════════════════════════════════ */
  { id: 'f-100', name: '맥도날드 빅맥', calories: 550, protein: 26, carbs: 46, fat: 30, servingSize: '1개 209g' },
  { id: 'f-101', name: '맥도날드 맥스파이시 상하이버거', calories: 560, protein: 27, carbs: 52, fat: 27, servingSize: '1개 220g' },
  { id: 'f-102', name: '맥도날드 더블 쿼터파운더 치즈', calories: 740, protein: 47, carbs: 44, fat: 43, servingSize: '1개 280g' },
  { id: 'f-103', name: '맥도날드 불고기버거', calories: 400, protein: 17, carbs: 50, fat: 14, servingSize: '1개 163g' },
  { id: 'f-104', name: '맥도날드 에그맥머핀', calories: 310, protein: 18, carbs: 31, fat: 13, servingSize: '1개 140g' },
  { id: 'f-105', name: '맥도날드 맥너겟 6조각', calories: 280, protein: 16, carbs: 17, fat: 17, servingSize: '6개 103g' },
  { id: 'f-106', name: '맥도날드 감자튀김 (중)', calories: 340, protein: 4, carbs: 44, fat: 16, servingSize: '117g' },
  { id: 'f-107', name: '맥도날드 감자튀김 (대)', calories: 470, protein: 6, carbs: 61, fat: 22, servingSize: '154g' },
  { id: 'f-108', name: '맥도날드 맥플러리 (오레오)', calories: 350, protein: 8, carbs: 56, fat: 10, servingSize: '1개 175g' },
  { id: 'f-109', name: '맥도날드 코카콜라 (중)', calories: 210, protein: 0, carbs: 56, fat: 0, servingSize: '500ml' },
  { id: 'f-110', name: '맥도날드 아이스아메리카노', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '350ml' },
  { id: 'f-111', name: '맥도날드 맥모닝 소시지에그머핀', calories: 420, protein: 21, carbs: 34, fat: 22, servingSize: '1개 165g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 롯데리아
   * ══════════════════════════════════════════ */
  { id: 'f-120', name: '롯데리아 새우버거', calories: 470, protein: 16, carbs: 55, fat: 21, servingSize: '1개 183g' },
  { id: 'f-121', name: '롯데리아 불고기버거', calories: 415, protein: 17, carbs: 52, fat: 16, servingSize: '1개 165g' },
  { id: 'f-122', name: '롯데리아 한우불고기버거', calories: 480, protein: 22, carbs: 50, fat: 21, servingSize: '1개 190g' },
  { id: 'f-123', name: '롯데리아 치킨버거', calories: 490, protein: 19, carbs: 53, fat: 22, servingSize: '1개 185g' },
  { id: 'f-124', name: '롯데리아 모짜렐라인더버거', calories: 590, protein: 25, carbs: 54, fat: 30, servingSize: '1개 220g' },
  { id: 'f-125', name: '롯데리아 감자튀김 (중)', calories: 320, protein: 4, carbs: 43, fat: 15, servingSize: '110g' },
  { id: 'f-126', name: '롯데리아 오징어버거', calories: 440, protein: 15, carbs: 55, fat: 19, servingSize: '1개 175g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 버거킹
   * ══════════════════════════════════════════ */
  { id: 'f-130', name: '버거킹 와퍼', calories: 660, protein: 32, carbs: 50, fat: 38, servingSize: '1개 270g' },
  { id: 'f-131', name: '버거킹 더블와퍼', calories: 890, protein: 55, carbs: 50, fat: 56, servingSize: '1개 370g' },
  { id: 'f-132', name: '버거킹 통새우와퍼', calories: 620, protein: 24, carbs: 60, fat: 32, servingSize: '1개 255g' },
  { id: 'f-133', name: '버거킹 치킨킹', calories: 590, protein: 28, carbs: 58, fat: 27, servingSize: '1개 235g' },
  { id: 'f-134', name: '버거킹 갈릭너겟 (8개)', calories: 380, protein: 20, carbs: 28, fat: 21, servingSize: '8개 145g' },
  { id: 'f-135', name: '버거킹 어니언링 (중)', calories: 320, protein: 4, carbs: 42, fat: 15, servingSize: '중 120g' },
  { id: 'f-136', name: '버거킹 감자튀김 (중)', calories: 340, protein: 4.5, carbs: 46, fat: 15, servingSize: '중 120g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — KFC
   * ══════════════════════════════════════════ */
  { id: 'f-140', name: 'KFC 오리지널 치킨 (1조각)', calories: 320, protein: 23, carbs: 14, fat: 19, servingSize: '1조각 130g' },
  { id: 'f-141', name: 'KFC 핫크리스피 치킨 (1조각)', calories: 350, protein: 23, carbs: 17, fat: 21, servingSize: '1조각 135g' },
  { id: 'f-142', name: 'KFC 징거버거', calories: 570, protein: 28, carbs: 57, fat: 26, servingSize: '1개 225g' },
  { id: 'f-143', name: 'KFC 타워버거', calories: 640, protein: 32, carbs: 62, fat: 30, servingSize: '1개 255g' },
  { id: 'f-144', name: 'KFC 코울슬로', calories: 155, protein: 1.5, carbs: 19, fat: 8, servingSize: '1컵 120g' },
  { id: 'f-145', name: 'KFC 감자튀김 (중)', calories: 330, protein: 4, carbs: 44, fat: 15, servingSize: '중 115g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 맘스터치
   * ══════════════════════════════════════════ */
  { id: 'f-150', name: '맘스터치 싸이버거', calories: 640, protein: 31, carbs: 62, fat: 30, servingSize: '1개 255g' },
  { id: 'f-151', name: '맘스터치 불싸이버거', calories: 670, protein: 31, carbs: 66, fat: 30, servingSize: '1개 260g' },
  { id: 'f-152', name: '맘스터치 통새우버거', calories: 590, protein: 22, carbs: 65, fat: 27, servingSize: '1개 240g' },
  { id: 'f-153', name: '맘스터치 베이컨치즈버거', calories: 700, protein: 35, carbs: 60, fat: 35, servingSize: '1개 270g' },
  { id: 'f-154', name: '맘스터치 치킨너겟 (5개)', calories: 310, protein: 17, carbs: 22, fat: 17, servingSize: '5개 125g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 서브웨이
   * ══════════════════════════════════════════ */
  { id: 'f-160', name: '서브웨이 이탈리안 BMT (15cm)', calories: 430, protein: 22, carbs: 46, fat: 17, servingSize: '1개 235g' },
  { id: 'f-161', name: '서브웨이 터키 (15cm)', calories: 320, protein: 20, carbs: 44, fat: 7, servingSize: '1개 215g' },
  { id: 'f-162', name: '서브웨이 풀드포크 (15cm)', calories: 440, protein: 24, carbs: 50, fat: 16, servingSize: '1개 250g' },
  { id: 'f-163', name: '서브웨이 에그마요 (15cm)', calories: 420, protein: 19, carbs: 44, fat: 19, servingSize: '1개 230g' },
  { id: 'f-164', name: '서브웨이 쉬림프 (15cm)', calories: 370, protein: 20, carbs: 46, fat: 11, servingSize: '1개 220g' },
  { id: 'f-165', name: '서브웨이 베지 딜라이트 (15cm)', calories: 240, protein: 9, carbs: 42, fat: 4.5, servingSize: '1개 180g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 피자헛 / 도미노
   * ══════════════════════════════════════════ */
  { id: 'f-170', name: '피자헛 슈퍼슈프림 (1조각)', calories: 290, protein: 14, carbs: 34, fat: 11, servingSize: '1조각 130g' },
  { id: 'f-171', name: '피자헛 페퍼로니 (1조각)', calories: 280, protein: 13, carbs: 32, fat: 12, servingSize: '1조각 125g' },
  { id: 'f-172', name: '피자헛 치즈크러스트 (1조각)', calories: 320, protein: 15, carbs: 36, fat: 13, servingSize: '1조각 140g' },
  { id: 'f-173', name: '도미노 포테이토 피자 (1조각)', calories: 270, protein: 11, carbs: 35, fat: 10, servingSize: '1조각 120g' },
  { id: 'f-174', name: '도미노 고구마 피자 (1조각)', calories: 280, protein: 10, carbs: 38, fat: 10, servingSize: '1조각 125g' },
  { id: 'f-175', name: '도미노 불고기 피자 (1조각)', calories: 295, protein: 14, carbs: 36, fat: 11, servingSize: '1조각 130g' },
  { id: 'f-176', name: '피자나라치킨공주 콤보 (1조각)', calories: 260, protein: 12, carbs: 32, fat: 10, servingSize: '1조각 115g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 치킨 (교촌 / BBQ / BHC)
   * ══════════════════════════════════════════ */
  { id: 'f-180', name: '교촌 허니오리지날 (1조각)', calories: 190, protein: 14, carbs: 10, fat: 10, servingSize: '1조각 90g' },
  { id: 'f-181', name: '교촌 레드오리지날 (1조각)', calories: 185, protein: 14, carbs: 9, fat: 10, servingSize: '1조각 88g' },
  { id: 'f-182', name: 'BBQ 황금올리브치킨 (1조각)', calories: 200, protein: 15, carbs: 9, fat: 11, servingSize: '1조각 95g' },
  { id: 'f-183', name: 'BBQ 마늘치킨 (1조각)', calories: 210, protein: 15, carbs: 11, fat: 11, servingSize: '1조각 95g' },
  { id: 'f-184', name: 'BHC 맛초킹 (1조각)', calories: 215, protein: 15, carbs: 12, fat: 11, servingSize: '1조각 95g' },
  { id: 'f-185', name: 'BHC 뿌링클 (1조각)', calories: 205, protein: 14, carbs: 11, fat: 11, servingSize: '1조각 93g' },
  { id: 'f-186', name: '굽네 고추바사삭 (1조각)', calories: 170, protein: 15, carbs: 7, fat: 9, servingSize: '1조각 90g' },
  { id: 'f-187', name: '네네치킨 살살치킨 (1조각)', calories: 195, protein: 14, carbs: 10, fat: 11, servingSize: '1조각 90g' },
  { id: 'f-188', name: '호식이두마리치킨 (1조각)', calories: 180, protein: 14, carbs: 8, fat: 10, servingSize: '1조각 85g' },
  { id: 'f-189', name: '치킨 윙 (반마리 8조각)', calories: 780, protein: 60, carbs: 36, fat: 44, servingSize: '8조각 380g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 스타벅스
   * ══════════════════════════════════════════ */
  { id: 'f-200', name: '스타벅스 아메리카노 (톨)', calories: 10, protein: 0.5, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'f-201', name: '스타벅스 카페라떼 (톨)', calories: 150, protein: 8, carbs: 16, fat: 6, servingSize: '355ml' },
  { id: 'f-202', name: '스타벅스 카라멜 마키아토 (톨)', calories: 250, protein: 8, carbs: 37, fat: 7, servingSize: '355ml' },
  { id: 'f-203', name: '스타벅스 자바칩 프라푸치노 (톨)', calories: 430, protein: 7, carbs: 64, fat: 17, servingSize: '355ml' },
  { id: 'f-204', name: '스타벅스 그린티 프라푸치노 (톨)', calories: 360, protein: 6, carbs: 56, fat: 13, servingSize: '355ml' },
  { id: 'f-205', name: '스타벅스 딸기라떼 (톨)', calories: 290, protein: 8, carbs: 47, fat: 7.5, servingSize: '355ml' },
  { id: 'f-206', name: '스타벅스 초콜릿크림콜드브루 (톨)', calories: 290, protein: 5, carbs: 39, fat: 13, servingSize: '355ml' },
  { id: 'f-207', name: '스타벅스 바닐라크림콜드브루 (톨)', calories: 200, protein: 3, carbs: 27, fat: 9, servingSize: '355ml' },
  { id: 'f-208', name: '스타벅스 핑크드링크 (톨)', calories: 140, protein: 2, carbs: 27, fat: 2.5, servingSize: '355ml' },
  { id: 'f-209', name: '스타벅스 버터크루아상', calories: 310, protein: 7, carbs: 36, fat: 15, servingSize: '1개 90g' },
  { id: 'f-210', name: '스타벅스 치즈케이크 (1조각)', calories: 420, protein: 8, carbs: 42, fat: 24, servingSize: '1조각 130g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 이디야 / 메가커피 / 빽다방
   * ══════════════════════════════════════════ */
  { id: 'f-220', name: '이디야 아메리카노 (레귤러)', calories: 10, protein: 0.3, carbs: 2, fat: 0, servingSize: '350ml' },
  { id: 'f-221', name: '이디야 카페라떼 (레귤러)', calories: 135, protein: 7, carbs: 15, fat: 5.5, servingSize: '350ml' },
  { id: 'f-222', name: '이디야 블루베리요거트스무디', calories: 290, protein: 5, carbs: 56, fat: 4, servingSize: '450ml' },
  { id: 'f-223', name: '메가커피 아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'f-224', name: '메가커피 메가라떼 (레귤러)', calories: 160, protein: 8, carbs: 18, fat: 6, servingSize: '355ml' },
  { id: 'f-225', name: '빽다방 빽스아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '350ml' },
  { id: 'f-226', name: '빽다방 달달크림라떼', calories: 310, protein: 6, carbs: 48, fat: 10, servingSize: '450ml' },
  { id: 'f-227', name: '투썸플레이스 아메리카노 (레귤러)', calories: 10, protein: 0.3, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'f-228', name: '투썸플레이스 스트로베리초콜릿케이크', calories: 490, protein: 7, carbs: 62, fat: 24, servingSize: '1조각 150g' },
  { id: 'f-229', name: '할리스 아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 공차 / 커피빈
   * ══════════════════════════════════════════ */
  { id: 'f-230', name: '공차 타피오카밀크티 (레귤러)', calories: 330, protein: 3, carbs: 65, fat: 5, servingSize: '500ml' },
  { id: 'f-231', name: '공차 복숭아아이스티 (레귤러)', calories: 200, protein: 0, carbs: 52, fat: 0, servingSize: '500ml' },
  { id: 'f-232', name: '공차 딸기밀크티 (레귤러)', calories: 310, protein: 3, carbs: 60, fat: 5, servingSize: '500ml' },
  { id: 'f-233', name: '커피빈 바닐라라떼 (레귤러)', calories: 280, protein: 9, carbs: 42, fat: 8.5, servingSize: '355ml' },
  { id: 'f-234', name: '커피빈 아이스블렌디드 (모카)', calories: 450, protein: 7, carbs: 68, fat: 17, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 던킨 / 파리바게뜨 / 뚜레쥬르
   * ══════════════════════════════════════════ */
  { id: 'f-240', name: '던킨 글레이즈드 도넛', calories: 260, protein: 4, carbs: 33, fat: 13, servingSize: '1개 75g' },
  { id: 'f-241', name: '던킨 초코링 도넛', calories: 290, protein: 4, carbs: 38, fat: 14, servingSize: '1개 80g' },
  { id: 'f-242', name: '던킨 스트로베리크림 도넛', calories: 310, protein: 4.5, carbs: 40, fat: 15, servingSize: '1개 90g' },
  { id: 'f-243', name: '파리바게뜨 단팥크림빵', calories: 285, protein: 7, carbs: 46, fat: 8.5, servingSize: '1개 110g' },
  { id: 'f-244', name: '파리바게뜨 소시지빵', calories: 320, protein: 11, carbs: 42, fat: 12, servingSize: '1개 120g' },
  { id: 'f-245', name: '파리바게뜨 크루아상 (버터)', calories: 370, protein: 7, carbs: 38, fat: 22, servingSize: '1개 85g' },
  { id: 'f-246', name: '뚜레쥬르 촉촉한 초코케이크 (1조각)', calories: 380, protein: 5.5, carbs: 52, fat: 17, servingSize: '1조각 120g' },
  { id: 'f-247', name: '뚜레쥬르 버터스콘', calories: 390, protein: 6, carbs: 50, fat: 19, servingSize: '1개 110g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 한식 (본죽 / 한솥 / 김가네)
   * ══════════════════════════════════════════ */
  { id: 'f-250', name: '본죽 전복죽 (1인분)', calories: 320, protein: 14, carbs: 54, fat: 6, servingSize: '1인분 400g' },
  { id: 'f-251', name: '본죽 채소죽 (1인분)', calories: 260, protein: 6, carbs: 52, fat: 3, servingSize: '1인분 380g' },
  { id: 'f-252', name: '본죽 닭죽 (1인분)', calories: 310, protein: 18, carbs: 50, fat: 5, servingSize: '1인분 400g' },
  { id: 'f-253', name: '한솥 제육볶음 도시락', calories: 680, protein: 28, carbs: 88, fat: 22, servingSize: '1개 400g' },
  { id: 'f-254', name: '한솥 돈가스 도시락', calories: 720, protein: 26, carbs: 90, fat: 26, servingSize: '1개 410g' },
  { id: 'f-255', name: '한솥 김치찌개 도시락', calories: 620, protein: 22, carbs: 85, fat: 18, servingSize: '1개 390g' },
  { id: 'f-256', name: '김가네 김밥 (1줄)', calories: 480, protein: 14, carbs: 82, fat: 11, servingSize: '1줄 330g' },
  { id: 'f-257', name: '김가네 참치김밥 (1줄)', calories: 540, protein: 20, carbs: 82, fat: 15, servingSize: '1줄 350g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 쌀국수 / 일식 (베트남·일식 체인)
   * ══════════════════════════════════════════ */
  { id: 'f-260', name: '호아빈 쌀국수 (소)', calories: 420, protein: 20, carbs: 68, fat: 7, servingSize: '1인분 500g' },
  { id: 'f-261', name: '호아빈 분짜 (1인분)', calories: 480, protein: 25, carbs: 60, fat: 14, servingSize: '1인분 450g' },
  { id: 'f-262', name: '미가 쌀국수 (1인분)', calories: 440, protein: 22, carbs: 66, fat: 8, servingSize: '1인분 500g' },
  { id: 'f-263', name: '요시노야 규동 (보통)', calories: 630, protein: 24, carbs: 82, fat: 22, servingSize: '1인분 380g' },
  { id: 'f-264', name: '스시로 연어초밥 (2개)', calories: 150, protein: 10, carbs: 20, fat: 3.5, servingSize: '2개 90g' },
  { id: 'f-265', name: '스시로 참치초밥 (2개)', calories: 140, protein: 11, carbs: 20, fat: 2, servingSize: '2개 85g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 — 샐러드 / 건강식 체인
   * ══════════════════════════════════════════ */
  { id: 'f-270', name: '써브웨이 참치 샐러드', calories: 230, protein: 14, carbs: 12, fat: 14, servingSize: '1개 250g' },
  { id: 'f-271', name: '샐러디 닭가슴살 샐러드', calories: 280, protein: 28, carbs: 20, fat: 10, servingSize: '1개 300g' },
  { id: 'f-272', name: '이삭토스트 에그치즈 (1개)', calories: 410, protein: 16, carbs: 52, fat: 16, servingSize: '1개 185g' },
  { id: 'f-273', name: '이삭토스트 스테이크 (1개)', calories: 480, protein: 22, carbs: 54, fat: 20, servingSize: '1개 215g' },
  { id: 'f-274', name: '바르다 김선생 참치마요 (1줄)', calories: 520, protein: 18, carbs: 82, fat: 14, servingSize: '1줄 340g' },
]

/* ─────────────────────────────────────────
 * 초성 검색 유틸
 * ───────────────────────────────────────── */
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'] as const

/** 경음(된소리)을 평음으로 정규화: ㄲ→ㄱ ㄸ→ㄷ ㅃ→ㅂ ㅆ→ㅅ ㅉ→ㅈ */
const TENSE_MAP: Record<string, string> = { ㄲ:'ㄱ', ㄸ:'ㄷ', ㅃ:'ㅂ', ㅆ:'ㅅ', ㅉ:'ㅈ' }
function normalizeConsonants(s: string): string {
  return s.split('').map(c => TENSE_MAP[c] ?? c).join('')
}

/** 한글 문자열에서 초성만 추출 (비한글 문자는 그대로) */
function extractChosung(str: string): string {
  return Array.from(str).map(ch => {
    const code = ch.charCodeAt(0)
    if (code >= 0xAC00 && code <= 0xD7A3) {
      return CHOSUNG[Math.floor((code - 0xAC00) / (21 * 28))]
    }
    return ch
  }).join('')
}

/** 입력이 초성만으로 이루어져 있는지 확인 */
function isChosungOnly(str: string): boolean {
  return str.length > 0 && /^[ㄱ-ㅎ]+$/.test(str)
}

/** 이름을 정규화 (괄호·공백 제거, 소문자) — dedup용 */
export function normalizeFoodName(name: string): string {
  return name
    .replace(/[（(【\[〔][^）)】\]〕]*[）)】\]〕]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
    .trim()
}

/** 쿼리 문자열로 식품 검색
 *  - 일반 검색: 이름에 쿼리 포함 여부
 *  - 초성 검색: ㅂㅁ → 빅맥, ㄱㅊㅈ → 김치찌개
 */
export function searchBuiltinFoods(q: string, limit = 6): BuiltinFood[] {
  const query = q.trim().toLowerCase()
  if (!query) return []

  if (isChosungOnly(query)) {
    // 초성 모드: 경음 정규화 후 초성 포함 여부 확인
    // 예) ㄱㅊㅈ → 김치찌개 (ㅉ→ㅈ 정규화로 매칭)
    const normQuery = normalizeConsonants(query)
    return BUILTIN_FOODS
      .filter(f => normalizeConsonants(extractChosung(f.name)).includes(normQuery))
      .slice(0, limit)
  }

  // 일반 모드: 이름에 쿼리 포함 여부 (부분 일치)
  return BUILTIN_FOODS
    .filter(f => f.name.toLowerCase().includes(query))
    .slice(0, limit)
}
