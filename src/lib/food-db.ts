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
  { id: 'b-278', name: '감', calories: 60, protein: 0.4, carbs: 16, fat: 0.1, servingSize: '1개 100g' },
  { id: 'b-279', name: '단감', calories: 60, protein: 0.4, carbs: 16, fat: 0.1, servingSize: '1개 100g' },
  { id: 'b-280a', name: '홍시', calories: 55, protein: 0.5, carbs: 14, fat: 0.1, servingSize: '1개 80g' },
  { id: 'b-280b', name: '아보카도', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: '1/2개 75g' },
  { id: 'b-280c', name: '자몽', calories: 52, protein: 0.8, carbs: 13, fat: 0.2, servingSize: '1/2개 150g' },
  { id: 'b-280d', name: '석류', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, servingSize: '100g' },
  { id: 'b-280e', name: '무화과', calories: 74, protein: 0.8, carbs: 19, fat: 0.3, servingSize: '1개 50g' },
  { id: 'b-280f', name: '살구', calories: 48, protein: 1.4, carbs: 11, fat: 0.4, servingSize: '100g' },
  { id: 'b-280g', name: '라임', calories: 30, protein: 0.7, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'b-280h', name: '용과', calories: 60, protein: 1.2, carbs: 13, fat: 0.4, servingSize: '100g' },
  { id: 'b-280i', name: '리치', calories: 66, protein: 0.8, carbs: 17, fat: 0.4, servingSize: '100g' },
  { id: 'b-280j', name: '감귤', calories: 37, protein: 0.6, carbs: 9.4, fat: 0.1, servingSize: '1개 80g' },

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

  /* ══════════════════════════════════════════
   * 카페 음료 — 기본 커피
   * ══════════════════════════════════════════ */
  { id: 'c-001', name: '에스프레소', calories: 5, protein: 0.3, carbs: 0.5, fat: 0.1, servingSize: '1샷 30ml' },
  { id: 'c-002', name: '더블에스프레소', calories: 10, protein: 0.6, carbs: 1, fat: 0.2, servingSize: '2샷 60ml' },
  { id: 'c-003', name: '콜드브루', calories: 15, protein: 0.3, carbs: 2, fat: 0, servingSize: '350ml' },
  { id: 'c-004', name: '콜드브루 라떼', calories: 150, protein: 5, carbs: 17, fat: 7, servingSize: '350ml' },
  { id: 'c-005', name: '플랫화이트', calories: 120, protein: 6, carbs: 10, fat: 6, servingSize: '230ml' },
  { id: 'c-006', name: '룽고', calories: 8, protein: 0.4, carbs: 1, fat: 0.1, servingSize: '110ml' },
  { id: 'c-007', name: '리스트레토', calories: 4, protein: 0.2, carbs: 0.4, fat: 0.1, servingSize: '25ml' },
  { id: 'c-008', name: '드립커피', calories: 5, protein: 0.3, carbs: 0.8, fat: 0, servingSize: '240ml' },
  { id: 'c-009', name: '핸드드립 커피', calories: 5, protein: 0.3, carbs: 0.8, fat: 0, servingSize: '250ml' },
  { id: 'c-010', name: '더치커피', calories: 10, protein: 0.3, carbs: 1.5, fat: 0, servingSize: '150ml' },

  /* ── 라떼 / 모카 계열 ─────────────────────── */
  { id: 'c-011', name: '카페모카', calories: 290, protein: 7, carbs: 42, fat: 11, servingSize: '350ml' },
  { id: 'c-012', name: '아이스카페모카', calories: 280, protein: 7, carbs: 40, fat: 11, servingSize: '350ml' },
  { id: 'c-013', name: '화이트초콜릿모카', calories: 330, protein: 7, carbs: 50, fat: 12, servingSize: '350ml' },
  { id: 'c-014', name: '헤이즐넛라떼', calories: 200, protein: 5, carbs: 30, fat: 7, servingSize: '350ml' },
  { id: 'c-015', name: '시나몬라떼', calories: 180, protein: 5.5, carbs: 26, fat: 6.5, servingSize: '350ml' },
  { id: 'c-016', name: '라벤더라떼', calories: 170, protein: 5, carbs: 25, fat: 6, servingSize: '350ml' },
  { id: 'c-017', name: '흑당라떼', calories: 250, protein: 5, carbs: 38, fat: 8, servingSize: '350ml' },
  { id: 'c-018', name: '흑임자라떼', calories: 220, protein: 6, carbs: 30, fat: 9, servingSize: '350ml' },
  { id: 'c-019', name: '고구마라떼', calories: 230, protein: 5, carbs: 38, fat: 6, servingSize: '350ml' },
  { id: 'c-020', name: '쑥라떼', calories: 210, protein: 5.5, carbs: 32, fat: 7, servingSize: '350ml' },
  { id: 'c-021', name: '단호박라떼', calories: 220, protein: 5, carbs: 34, fat: 7, servingSize: '350ml' },
  { id: 'c-022', name: '말차라떼', calories: 200, protein: 6, carbs: 30, fat: 6, servingSize: '350ml' },
  { id: 'c-023', name: '얼그레이라떼', calories: 160, protein: 5, carbs: 22, fat: 6, servingSize: '350ml' },
  { id: 'c-024', name: '런던포그라떼', calories: 170, protein: 5.5, carbs: 24, fat: 6.5, servingSize: '350ml' },
  { id: 'c-025', name: '로얄밀크티', calories: 180, protein: 5, carbs: 26, fat: 7, servingSize: '350ml' },

  /* ── 프라푸치노 / 블렌디드 ─────────────────── */
  { id: 'c-030', name: '카라멜프라푸치노', calories: 390, protein: 5, carbs: 63, fat: 13, servingSize: '350ml' },
  { id: 'c-031', name: '모카프라푸치노', calories: 410, protein: 6, carbs: 65, fat: 15, servingSize: '350ml' },
  { id: 'c-032', name: '자바칩프라푸치노', calories: 440, protein: 7, carbs: 68, fat: 17, servingSize: '350ml' },
  { id: 'c-033', name: '녹차프라푸치노', calories: 370, protein: 6, carbs: 58, fat: 13, servingSize: '350ml' },
  { id: 'c-034', name: '딸기프라푸치노', calories: 360, protein: 4, carbs: 60, fat: 12, servingSize: '350ml' },
  { id: 'c-035', name: '바닐라프라푸치노', calories: 380, protein: 5, carbs: 62, fat: 13, servingSize: '350ml' },
  { id: 'c-036', name: '쿠키앤크림프라푸치노', calories: 420, protein: 6, carbs: 66, fat: 16, servingSize: '350ml' },
  { id: 'c-037', name: '망고패션프라푸치노', calories: 310, protein: 2, carbs: 56, fat: 7, servingSize: '350ml' },

  /* ── 에이드 / 주스 ───────────────────────── */
  { id: 'c-040', name: '레몬에이드', calories: 120, protein: 0, carbs: 31, fat: 0, servingSize: '350ml' },
  { id: 'c-041', name: '자몽에이드', calories: 130, protein: 0.5, carbs: 33, fat: 0, servingSize: '350ml' },
  { id: 'c-042', name: '청포도에이드', calories: 140, protein: 0, carbs: 36, fat: 0, servingSize: '350ml' },
  { id: 'c-043', name: '복숭아에이드', calories: 135, protein: 0, carbs: 35, fat: 0, servingSize: '350ml' },
  { id: 'c-044', name: '딸기에이드', calories: 130, protein: 0.5, carbs: 33, fat: 0, servingSize: '350ml' },
  { id: 'c-045', name: '블루레몬에이드', calories: 120, protein: 0, carbs: 31, fat: 0, servingSize: '350ml' },
  { id: 'c-046', name: '패션후르츠에이드', calories: 145, protein: 0.5, carbs: 37, fat: 0, servingSize: '350ml' },
  { id: 'c-047', name: '오렌지주스', calories: 110, protein: 1.7, carbs: 26, fat: 0.5, servingSize: '250ml' },
  { id: 'c-048', name: '사과주스', calories: 115, protein: 0.3, carbs: 28, fat: 0.2, servingSize: '250ml' },
  { id: 'c-049', name: '포도주스', calories: 130, protein: 0.6, carbs: 32, fat: 0.3, servingSize: '250ml' },
  { id: 'c-050', name: '수박주스', calories: 80, protein: 1, carbs: 19, fat: 0.3, servingSize: '300ml' },
  { id: 'c-051', name: '당근주스', calories: 95, protein: 2, carbs: 22, fat: 0.5, servingSize: '250ml' },
  { id: 'c-052', name: '녹즙', calories: 45, protein: 2, carbs: 9, fat: 0.5, servingSize: '200ml' },

  /* ── 티 ─────────────────────────────────── */
  { id: 'c-060', name: '얼그레이티', calories: 2, protein: 0, carbs: 0.5, fat: 0, servingSize: '240ml' },
  { id: 'c-061', name: '캐모마일티', calories: 2, protein: 0, carbs: 0.4, fat: 0, servingSize: '240ml' },
  { id: 'c-062', name: '페퍼민트티', calories: 2, protein: 0, carbs: 0.4, fat: 0, servingSize: '240ml' },
  { id: 'c-063', name: '루이보스티', calories: 2, protein: 0.1, carbs: 0.3, fat: 0, servingSize: '240ml' },
  { id: 'c-064', name: '히비스커스티', calories: 3, protein: 0, carbs: 0.6, fat: 0, servingSize: '240ml' },
  { id: 'c-065', name: '자스민티', calories: 2, protein: 0.1, carbs: 0.4, fat: 0, servingSize: '240ml' },
  { id: 'c-066', name: '유자차', calories: 90, protein: 0.3, carbs: 23, fat: 0.1, servingSize: '240ml' },
  { id: 'c-067', name: '생강차', calories: 60, protein: 0.2, carbs: 15, fat: 0.1, servingSize: '240ml' },
  { id: 'c-068', name: '쌍화차', calories: 80, protein: 1, carbs: 18, fat: 0.5, servingSize: '240ml' },
  { id: 'c-069', name: '대추차', calories: 85, protein: 0.5, carbs: 21, fat: 0.2, servingSize: '240ml' },
  { id: 'c-070', name: '레몬티', calories: 70, protein: 0.2, carbs: 18, fat: 0, servingSize: '240ml' },
  { id: 'c-071', name: '복숭아아이스티', calories: 100, protein: 0, carbs: 26, fat: 0, servingSize: '350ml' },
  { id: 'c-072', name: '아이스티 (레몬)', calories: 90, protein: 0, carbs: 23, fat: 0, servingSize: '350ml' },

  /* ── 스무디 / 요거트 ──────────────────────── */
  { id: 'c-080', name: '망고스무디', calories: 200, protein: 3, carbs: 44, fat: 2, servingSize: '350ml' },
  { id: 'c-081', name: '블루베리스무디', calories: 190, protein: 4, carbs: 40, fat: 2, servingSize: '350ml' },
  { id: 'c-082', name: '그린스무디', calories: 150, protein: 4, carbs: 32, fat: 1.5, servingSize: '350ml' },
  { id: 'c-083', name: '아사이볼', calories: 280, protein: 6, carbs: 52, fat: 6, servingSize: '300g' },
  { id: 'c-084', name: '요거트스무디', calories: 220, protein: 8, carbs: 40, fat: 4, servingSize: '350ml' },
  { id: 'c-085', name: '플레인요거트', calories: 100, protein: 6, carbs: 12, fat: 3, servingSize: '150g' },
  { id: 'c-086', name: '그릭요거트', calories: 130, protein: 12, carbs: 9, fat: 4, servingSize: '150g' },
  { id: 'c-087', name: '요거트파르페', calories: 320, protein: 10, carbs: 52, fat: 9, servingSize: '300g' },
  { id: 'c-088', name: '아사이스무디볼', calories: 340, protein: 7, carbs: 60, fat: 8, servingSize: '350g' },

  /* ══════════════════════════════════════════
   * 카페 디저트 / 베이커리
   * ══════════════════════════════════════════ */
  { id: 'c-100', name: '크루아상', calories: 270, protein: 5.5, carbs: 30, fat: 14, servingSize: '1개 70g' },
  { id: 'c-101', name: '버터크루아상', calories: 310, protein: 6, carbs: 33, fat: 17, servingSize: '1개 80g' },
  { id: 'c-102', name: '아몬드크루아상', calories: 380, protein: 9, carbs: 38, fat: 22, servingSize: '1개 90g' },
  { id: 'c-103', name: '크림치즈베이글', calories: 340, protein: 12, carbs: 54, fat: 9, servingSize: '1개 135g' },
  { id: 'c-104', name: '에그베이글', calories: 360, protein: 14, carbs: 55, fat: 10, servingSize: '1개 145g' },
  { id: 'c-105', name: '어니언베이글', calories: 280, protein: 10, carbs: 54, fat: 3, servingSize: '1개 110g' },
  { id: 'c-106', name: '스콘', calories: 350, protein: 6, carbs: 46, fat: 16, servingSize: '1개 90g' },
  { id: 'c-107', name: '블루베리스콘', calories: 360, protein: 6, carbs: 50, fat: 16, servingSize: '1개 95g' },
  { id: 'c-108', name: '치즈스콘', calories: 370, protein: 9, carbs: 44, fat: 18, servingSize: '1개 95g' },
  { id: 'c-109', name: '머핀 (블루베리)', calories: 320, protein: 5, carbs: 50, fat: 11, servingSize: '1개 100g' },
  { id: 'c-110', name: '머핀 (초콜릿)', calories: 360, protein: 5.5, carbs: 54, fat: 14, servingSize: '1개 105g' },
  { id: 'c-111', name: '바나나브레드', calories: 290, protein: 4.5, carbs: 46, fat: 10, servingSize: '1조각 90g' },
  { id: 'c-112', name: '파운드케이크', calories: 400, protein: 5, carbs: 50, fat: 20, servingSize: '1조각 100g' },
  { id: 'c-113', name: '레몬파운드케이크', calories: 390, protein: 5, carbs: 52, fat: 18, servingSize: '1조각 100g' },
  { id: 'c-114', name: '브라우니', calories: 400, protein: 5.5, carbs: 52, fat: 20, servingSize: '1조각 90g' },
  { id: 'c-115', name: '블론디', calories: 380, protein: 5, carbs: 54, fat: 16, servingSize: '1조각 90g' },
  { id: 'c-116', name: '쿠키 (초콜릿칩)', calories: 200, protein: 2.5, carbs: 28, fat: 9, servingSize: '2개 50g' },
  { id: 'c-117', name: '쿠키 (오트밀)', calories: 180, protein: 3, carbs: 27, fat: 7, servingSize: '2개 50g' },
  { id: 'c-118', name: '크림치즈쿠키', calories: 210, protein: 3, carbs: 28, fat: 10, servingSize: '2개 55g' },
  { id: 'c-119', name: '에그타르트', calories: 280, protein: 6, carbs: 32, fat: 14, servingSize: '1개 80g' },
  { id: 'c-120', name: '다쿠아즈', calories: 220, protein: 5, carbs: 28, fat: 10, servingSize: '1개 60g' },
  { id: 'c-121', name: '마들렌', calories: 180, protein: 3, carbs: 23, fat: 9, servingSize: '2개 50g' },
  { id: 'c-122', name: '피낭시에', calories: 190, protein: 4, carbs: 22, fat: 10, servingSize: '2개 50g' },
  { id: 'c-123', name: '카눌레', calories: 230, protein: 4, carbs: 38, fat: 7, servingSize: '1개 60g' },
  { id: 'c-124', name: '크렘브륄레', calories: 280, protein: 5, carbs: 32, fat: 15, servingSize: '1개 120g' },
  { id: 'c-125', name: '판나코타', calories: 230, protein: 4, carbs: 28, fat: 12, servingSize: '1개 130g' },
  { id: 'c-126', name: '수플레 치즈케이크', calories: 260, protein: 8, carbs: 28, fat: 13, servingSize: '1조각 100g' },
  { id: 'c-127', name: '바스크 치즈케이크', calories: 360, protein: 9, carbs: 26, fat: 25, servingSize: '1조각 120g' },
  { id: 'c-128', name: '뉴욕 치즈케이크', calories: 400, protein: 7, carbs: 36, fat: 26, servingSize: '1조각 130g' },
  { id: 'c-129', name: '오페라케이크', calories: 380, protein: 6, carbs: 44, fat: 20, servingSize: '1조각 100g' },
  { id: 'c-130', name: '몽블랑', calories: 320, protein: 5, carbs: 42, fat: 15, servingSize: '1개 100g' },
  { id: 'c-131', name: '딸기케이크', calories: 290, protein: 4.5, carbs: 42, fat: 12, servingSize: '1조각 100g' },
  { id: 'c-132', name: '초코케이크', calories: 380, protein: 5.5, carbs: 52, fat: 18, servingSize: '1조각 110g' },
  { id: 'c-133', name: '당근케이크', calories: 350, protein: 5, carbs: 48, fat: 16, servingSize: '1조각 110g' },
  { id: 'c-134', name: '레드벨벳케이크', calories: 360, protein: 5, carbs: 50, fat: 16, servingSize: '1조각 110g' },

  /* ── 아이스크림 / 빙수 ──────────────────── */
  { id: 'c-140', name: '아이스크림 (바닐라)', calories: 200, protein: 3.5, carbs: 24, fat: 10, servingSize: '1스쿱 100g' },
  { id: 'c-141', name: '아이스크림 (초콜릿)', calories: 220, protein: 3.5, carbs: 26, fat: 12, servingSize: '1스쿱 100g' },
  { id: 'c-142', name: '딸기빙수', calories: 380, protein: 5, carbs: 72, fat: 8, servingSize: '1인분 400g' },
  { id: 'c-143', name: '팥빙수', calories: 420, protein: 7, carbs: 82, fat: 7, servingSize: '1인분 400g' },
  { id: 'c-144', name: '녹차빙수', calories: 350, protein: 6, carbs: 64, fat: 8, servingSize: '1인분 380g' },
  { id: 'c-145', name: '망고빙수', calories: 360, protein: 4, carbs: 70, fat: 7, servingSize: '1인분 380g' },
  { id: 'c-146', name: '소프트아이스크림 (바닐라)', calories: 160, protein: 3, carbs: 24, fat: 6, servingSize: '1개 100g' },
  { id: 'c-147', name: '소프트아이스크림 (초코)', calories: 170, protein: 3, carbs: 26, fat: 6.5, servingSize: '1개 100g' },
  { id: 'c-148', name: '젤라또', calories: 180, protein: 4, carbs: 28, fat: 6, servingSize: '1스쿱 100g' },

  /* ══════════════════════════════════════════
   * 프랜차이즈 카페 추가 메뉴
   * ══════════════════════════════════════════ */
  { id: 'c-200', name: '스타벅스 콜드브루 (톨)', calories: 15, protein: 0.5, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'c-201', name: '스타벅스 리저브 콜드브루 (톨)', calories: 15, protein: 0.5, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'c-202', name: '스타벅스 말차라떼 (톨)', calories: 200, protein: 8, carbs: 28, fat: 6.5, servingSize: '355ml' },
  { id: 'c-203', name: '스타벅스 돌체라떼 (톨)', calories: 270, protein: 7, carbs: 40, fat: 8, servingSize: '355ml' },
  { id: 'c-204', name: '스타벅스 콜드폼 아메리카노 (톨)', calories: 60, protein: 2, carbs: 7, fat: 3, servingSize: '355ml' },
  { id: 'c-205', name: '스타벅스 리저브 에스프레소 (1샷)', calories: 5, protein: 0.3, carbs: 0.5, fat: 0.1, servingSize: '30ml' },
  { id: 'c-206', name: '이디야 흑당밀크티 (레귤러)', calories: 270, protein: 5, carbs: 42, fat: 8, servingSize: '350ml' },
  { id: 'c-207', name: '이디야 딸기라떼 (레귤러)', calories: 220, protein: 6, carbs: 34, fat: 6, servingSize: '350ml' },
  { id: 'c-208', name: '메가커피 흑당버블라떼 (레귤러)', calories: 310, protein: 7, carbs: 48, fat: 9, servingSize: '400ml' },
  { id: 'c-209', name: '메가커피 아이스크림라떼 (레귤러)', calories: 340, protein: 8, carbs: 52, fat: 11, servingSize: '400ml' },
  { id: 'c-210', name: '컴포즈 아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'c-211', name: '컴포즈 아이스크림라떼 (레귤러)', calories: 320, protein: 7, carbs: 48, fat: 10, servingSize: '400ml' },
  { id: 'c-212', name: '빽다방 아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '400ml' },
  { id: 'c-213', name: '빽다방 빽스치노 (레귤러)', calories: 380, protein: 5, carbs: 60, fat: 14, servingSize: '400ml' },
  { id: 'c-214', name: '투썸 딸기폭탄생크림케이크 (1조각)', calories: 450, protein: 6, carbs: 54, fat: 24, servingSize: '1조각 140g' },
  { id: 'c-215', name: '투썸 아이스박스 케이크 (1조각)', calories: 420, protein: 5.5, carbs: 52, fat: 22, servingSize: '1조각 130g' },
  { id: 'c-216', name: '할리스 카라멜마키아토 (레귤러)', calories: 240, protein: 7, carbs: 36, fat: 7.5, servingSize: '355ml' },
  { id: 'c-217', name: '폴바셋 아메리카노 (레귤러)', calories: 10, protein: 0.3, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'c-218', name: '폴바셋 플랫화이트', calories: 130, protein: 6.5, carbs: 11, fat: 6.5, servingSize: '230ml' },
  { id: 'c-219', name: '공차 버블밀크티 (레귤러)', calories: 310, protein: 3, carbs: 54, fat: 8, servingSize: '500ml' },
  { id: 'c-220', name: '공차 타로밀크티 (레귤러)', calories: 330, protein: 4, carbs: 56, fat: 9, servingSize: '500ml' },
  { id: 'c-221', name: '공차 흑당타피오카라떼 (레귤러)', calories: 350, protein: 5, carbs: 58, fat: 10, servingSize: '500ml' },
  { id: 'c-222', name: '더벤티 아메리카노 (레귤러)', calories: 10, protein: 0.2, carbs: 2, fat: 0, servingSize: '400ml' },
  { id: 'c-223', name: '더벤티 달고나라떼 (레귤러)', calories: 250, protein: 6, carbs: 38, fat: 8, servingSize: '400ml' },
  { id: 'c-224', name: '파스쿠찌 아메리카노 (레귤러)', calories: 10, protein: 0.3, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'c-225', name: '블루보틀 카페라떼 (12oz)', calories: 140, protein: 7, carbs: 14, fat: 6, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * 한식 반찬 — 나물 / 조림 / 볶음 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-001', name: '시금치나물', calories: 28, protein: 2.5, carbs: 3.5, fat: 0.8, servingSize: '100g' },
  { id: 'd-002', name: '콩나물무침', calories: 35, protein: 3.5, carbs: 3, fat: 1.2, servingSize: '100g' },
  { id: 'd-003', name: '도라지무침', calories: 45, protein: 1.5, carbs: 8, fat: 1, servingSize: '100g' },
  { id: 'd-004', name: '고사리나물', calories: 55, protein: 3, carbs: 7, fat: 1.5, servingSize: '100g' },
  { id: 'd-005', name: '취나물', calories: 30, protein: 2.5, carbs: 4, fat: 0.8, servingSize: '100g' },
  { id: 'd-006', name: '애호박나물', calories: 38, protein: 2, carbs: 5, fat: 1.2, servingSize: '100g' },
  { id: 'd-007', name: '가지나물', calories: 40, protein: 2, carbs: 5.5, fat: 1.5, servingSize: '100g' },
  { id: 'd-008', name: '숙주나물', calories: 25, protein: 2.5, carbs: 2.5, fat: 0.5, servingSize: '100g' },
  { id: 'd-009', name: '파래무침', calories: 40, protein: 3, carbs: 5, fat: 1, servingSize: '100g' },
  { id: 'd-010', name: '미역무침', calories: 30, protein: 1.5, carbs: 4.5, fat: 0.8, servingSize: '100g' },
  { id: 'd-011', name: '김조림', calories: 60, protein: 4, carbs: 6, fat: 2.5, servingSize: '50g' },
  { id: 'd-012', name: '멸치볶음', calories: 180, protein: 22, carbs: 8, fat: 7, servingSize: '100g' },
  { id: 'd-013', name: '건새우볶음', calories: 160, protein: 28, carbs: 4, fat: 3.5, servingSize: '80g' },
  { id: 'd-014', name: '두부조림', calories: 130, protein: 10, carbs: 6, fat: 7, servingSize: '150g' },
  { id: 'd-015', name: '감자조림', calories: 130, protein: 2.5, carbs: 24, fat: 3.5, servingSize: '100g' },
  { id: 'd-016', name: '연근조림', calories: 120, protein: 2, carbs: 26, fat: 1.5, servingSize: '100g' },
  { id: 'd-017', name: '우엉조림', calories: 100, protein: 1.5, carbs: 20, fat: 2, servingSize: '100g' },
  { id: 'd-018', name: '메추리알조림', calories: 150, protein: 10, carbs: 8, fat: 9, servingSize: '100g' },
  { id: 'd-019', name: '깻잎무침', calories: 55, protein: 2.5, carbs: 6, fat: 2.5, servingSize: '100g' },
  { id: 'd-020', name: '깻잎장아찌', calories: 50, protein: 2.5, carbs: 5.5, fat: 2, servingSize: '50g' },
  { id: 'd-021', name: '오이무침', calories: 30, protein: 1, carbs: 5, fat: 0.8, servingSize: '100g' },
  { id: 'd-022', name: '오이소박이', calories: 25, protein: 1.5, carbs: 3.5, fat: 0.5, servingSize: '100g' },
  { id: 'd-023', name: '파김치', calories: 35, protein: 1.5, carbs: 5, fat: 0.8, servingSize: '100g' },
  { id: 'd-024', name: '열무김치', calories: 20, protein: 1.5, carbs: 3, fat: 0.3, servingSize: '100g' },
  { id: 'd-025', name: '총각김치', calories: 25, protein: 1.5, carbs: 3.5, fat: 0.5, servingSize: '100g' },
  { id: 'd-026', name: '깍두기', calories: 22, protein: 1.2, carbs: 4, fat: 0.3, servingSize: '100g' },
  { id: 'd-027', name: '동치미', calories: 15, protein: 0.8, carbs: 3, fat: 0.2, servingSize: '200g' },
  { id: 'd-028', name: '나박김치', calories: 18, protein: 0.8, carbs: 3.5, fat: 0.2, servingSize: '200g' },
  { id: 'd-029', name: '묵은지', calories: 20, protein: 1.5, carbs: 3, fat: 0.5, servingSize: '100g' },
  { id: 'd-030', name: '갈치조림', calories: 200, protein: 22, carbs: 8, fat: 9, servingSize: '1인분 150g' },
  { id: 'd-031', name: '고등어무조림', calories: 220, protein: 20, carbs: 12, fat: 11, servingSize: '1인분 200g' },
  { id: 'd-032', name: '꽁치조림', calories: 195, protein: 19, carbs: 8, fat: 10, servingSize: '1인분 150g' },
  { id: 'd-033', name: '돼지고기두루치기', calories: 360, protein: 24, carbs: 14, fat: 24, servingSize: '1인분 200g' },
  { id: 'd-034', name: '주꾸미볶음', calories: 220, protein: 22, carbs: 14, fat: 9, servingSize: '1인분 200g' },
  { id: 'd-035', name: '오징어볶음', calories: 200, protein: 20, carbs: 12, fat: 8, servingSize: '1인분 200g' },
  { id: 'd-036', name: '낙지볶음', calories: 190, protein: 22, carbs: 10, fat: 7, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 한식 — 국밥 / 해장국
   * ══════════════════════════════════════════ */
  { id: 'd-050', name: '순대국밥', calories: 560, protein: 28, carbs: 62, fat: 22, servingSize: '1인분 700g' },
  { id: 'd-051', name: '돼지국밥', calories: 540, protein: 30, carbs: 58, fat: 22, servingSize: '1인분 700g' },
  { id: 'd-052', name: '소머리국밥', calories: 580, protein: 32, carbs: 60, fat: 24, servingSize: '1인분 700g' },
  { id: 'd-053', name: '해장국', calories: 480, protein: 26, carbs: 52, fat: 18, servingSize: '1인분 650g' },
  { id: 'd-054', name: '뼈다귀해장국', calories: 520, protein: 30, carbs: 52, fat: 22, servingSize: '1인분 700g' },
  { id: 'd-055', name: '우거지해장국', calories: 350, protein: 20, carbs: 36, fat: 14, servingSize: '1인분 600g' },
  { id: 'd-056', name: '선지국밥', calories: 480, protein: 28, carbs: 52, fat: 18, servingSize: '1인분 700g' },
  { id: 'd-057', name: '곰탕', calories: 450, protein: 30, carbs: 38, fat: 18, servingSize: '1인분 600g' },
  { id: 'd-058', name: '설렁탕', calories: 480, protein: 32, carbs: 40, fat: 20, servingSize: '1인분 650g' },
  { id: 'd-059', name: '도가니탕', calories: 420, protein: 28, carbs: 34, fat: 18, servingSize: '1인분 600g' },
  { id: 'd-060', name: '꼬리곰탕', calories: 550, protein: 34, carbs: 36, fat: 28, servingSize: '1인분 650g' },
  { id: 'd-061', name: '삼계탕', calories: 540, protein: 42, carbs: 44, fat: 18, servingSize: '1인분 800g' },
  { id: 'd-062', name: '백숙', calories: 480, protein: 40, carbs: 36, fat: 16, servingSize: '1인분 600g' },
  { id: 'd-063', name: '닭곰탕', calories: 400, protein: 34, carbs: 32, fat: 14, servingSize: '1인분 600g' },

  /* ══════════════════════════════════════════
   * 한식 — 찜 / 조림 (메인 요리)
   * ══════════════════════════════════════════ */
  { id: 'd-070', name: '아귀찜', calories: 380, protein: 34, carbs: 18, fat: 20, servingSize: '1인분 350g' },
  { id: 'd-071', name: '코다리찜', calories: 340, protein: 36, carbs: 14, fat: 16, servingSize: '1인분 300g' },
  { id: 'd-072', name: '돼지등뼈찜', calories: 480, protein: 36, carbs: 22, fat: 28, servingSize: '1인분 400g' },
  { id: 'd-073', name: '닭볶음탕 (매운)', calories: 400, protein: 34, carbs: 24, fat: 18, servingSize: '1인분 300g' },
  { id: 'd-074', name: '쭈꾸미삼겹살볶음', calories: 440, protein: 30, carbs: 16, fat: 30, servingSize: '1인분 250g' },
  { id: 'd-075', name: '우삼겹볶음', calories: 420, protein: 24, carbs: 14, fat: 32, servingSize: '1인분 200g' },
  { id: 'd-076', name: '매운갈비찜', calories: 560, protein: 40, carbs: 30, fat: 32, servingSize: '1인분 350g' },
  { id: 'd-077', name: '생선구이 (임연수)', calories: 180, protein: 24, carbs: 0, fat: 9, servingSize: '1토막 150g' },
  { id: 'd-078', name: '생선구이 (삼치)', calories: 190, protein: 25, carbs: 0, fat: 10, servingSize: '1토막 150g' },

  /* ══════════════════════════════════════════
   * 중식 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-100', name: '짜장면', calories: 550, protein: 18, carbs: 86, fat: 14, servingSize: '1인분 480g' },
  { id: 'd-101', name: '짬뽕', calories: 560, protein: 24, carbs: 72, fat: 18, servingSize: '1인분 500g' },
  { id: 'd-102', name: '볶음밥 (중식)', calories: 580, protein: 16, carbs: 82, fat: 20, servingSize: '1인분 400g' },
  { id: 'd-103', name: '탕수육', calories: 580, protein: 22, carbs: 62, fat: 28, servingSize: '1인분 250g' },
  { id: 'd-104', name: '깐풍기', calories: 520, protein: 28, carbs: 44, fat: 26, servingSize: '1인분 250g' },
  { id: 'd-105', name: '유린기', calories: 500, protein: 28, carbs: 36, fat: 28, servingSize: '1인분 250g' },
  { id: 'd-106', name: '마파두부', calories: 380, protein: 20, carbs: 22, fat: 24, servingSize: '1인분 300g' },
  { id: 'd-107', name: '마라탕', calories: 620, protein: 28, carbs: 52, fat: 36, servingSize: '1인분 500g' },
  { id: 'd-108', name: '마라샹궈', calories: 700, protein: 32, carbs: 44, fat: 48, servingSize: '1인분 450g' },
  { id: 'd-109', name: '훠궈', calories: 580, protein: 34, carbs: 42, fat: 32, servingSize: '1인분 500g' },
  { id: 'd-110', name: '양장피', calories: 460, protein: 22, carbs: 48, fat: 22, servingSize: '1인분 350g' },
  { id: 'd-111', name: '팔보채', calories: 380, protein: 26, carbs: 30, fat: 18, servingSize: '1인분 300g' },
  { id: 'd-112', name: '깐쇼새우', calories: 440, protein: 24, carbs: 38, fat: 22, servingSize: '1인분 250g' },
  { id: 'd-113', name: '동파육', calories: 680, protein: 28, carbs: 20, fat: 54, servingSize: '1인분 250g' },
  { id: 'd-114', name: '북경오리', calories: 420, protein: 24, carbs: 28, fat: 26, servingSize: '1인분 200g' },
  { id: 'd-115', name: '고추잡채', calories: 380, protein: 22, carbs: 28, fat: 22, servingSize: '1인분 250g' },
  { id: 'd-116', name: '중국식 만두 (물만두)', calories: 280, protein: 14, carbs: 36, fat: 9, servingSize: '10개 200g' },
  { id: 'd-117', name: '딤섬 (하가우)', calories: 200, protein: 10, carbs: 26, fat: 6, servingSize: '3개 90g' },
  { id: 'd-118', name: '딤섬 (슈마이)', calories: 180, protein: 12, carbs: 20, fat: 6, servingSize: '3개 90g' },
  { id: 'd-119', name: '군만두 (중식)', calories: 320, protein: 14, carbs: 38, fat: 13, servingSize: '5개 180g' },
  { id: 'd-120', name: '완탕수프', calories: 280, protein: 16, carbs: 28, fat: 12, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 서양식 — 파스타 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-140', name: '스파게티 볼로네제', calories: 580, protein: 26, carbs: 68, fat: 22, servingSize: '1인분 400g' },
  { id: 'd-141', name: '스파게티 까르보나라', calories: 650, protein: 22, carbs: 70, fat: 30, servingSize: '1인분 380g' },
  { id: 'd-142', name: '스파게티 알리오올리오', calories: 500, protein: 14, carbs: 72, fat: 18, servingSize: '1인분 360g' },
  { id: 'd-143', name: '스파게티 아마트리치아나', calories: 560, protein: 20, carbs: 72, fat: 20, servingSize: '1인분 380g' },
  { id: 'd-144', name: '스파게티 봉골레', calories: 480, protein: 22, carbs: 68, fat: 14, servingSize: '1인분 380g' },
  { id: 'd-145', name: '펜네 아라비아타', calories: 520, protein: 16, carbs: 76, fat: 16, servingSize: '1인분 380g' },
  { id: 'd-146', name: '페투치네 알프레도', calories: 680, protein: 20, carbs: 72, fat: 34, servingSize: '1인분 400g' },
  { id: 'd-147', name: '파스타 (봉골레)', calories: 480, protein: 22, carbs: 68, fat: 14, servingSize: '1인분 380g' },
  { id: 'd-148', name: '리조또 (버섯)', calories: 520, protein: 14, carbs: 76, fat: 18, servingSize: '1인분 380g' },
  { id: 'd-149', name: '리조또 (트러플)', calories: 560, protein: 14, carbs: 74, fat: 24, servingSize: '1인분 380g' },
  { id: 'd-150', name: '리조또 (토마토새우)', calories: 500, protein: 18, carbs: 74, fat: 16, servingSize: '1인분 380g' },
  { id: 'd-151', name: '뇨끼', calories: 480, protein: 12, carbs: 78, fat: 14, servingSize: '1인분 350g' },
  { id: 'd-152', name: '라자냐', calories: 620, protein: 26, carbs: 62, fat: 30, servingSize: '1인분 350g' },

  /* ══════════════════════════════════════════
   * 서양식 — 스테이크 / 메인 요리
   * ══════════════════════════════════════════ */
  { id: 'd-160', name: '티본스테이크 (250g)', calories: 560, protein: 52, carbs: 0, fat: 38, servingSize: '250g' },
  { id: 'd-161', name: '립아이스테이크 (200g)', calories: 500, protein: 46, carbs: 0, fat: 36, servingSize: '200g' },
  { id: 'd-162', name: '안심스테이크 (200g)', calories: 400, protein: 48, carbs: 0, fat: 24, servingSize: '200g' },
  { id: 'd-163', name: '채끝스테이크 (200g)', calories: 460, protein: 46, carbs: 0, fat: 30, servingSize: '200g' },
  { id: 'd-164', name: '함박스테이크', calories: 420, protein: 26, carbs: 22, fat: 26, servingSize: '1인분 250g' },
  { id: 'd-165', name: '치킨스테이크', calories: 340, protein: 36, carbs: 8, fat: 18, servingSize: '1인분 200g' },
  { id: 'd-166', name: '포크스테이크', calories: 380, protein: 34, carbs: 4, fat: 26, servingSize: '1인분 200g' },
  { id: 'd-167', name: '연어스테이크', calories: 380, protein: 38, carbs: 2, fat: 24, servingSize: '1인분 200g' },
  { id: 'd-168', name: '쉬림프파스타', calories: 520, protein: 24, carbs: 68, fat: 18, servingSize: '1인분 380g' },
  { id: 'd-169', name: '씨푸드파스타', calories: 540, protein: 26, carbs: 68, fat: 18, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 서양식 — 샐러드 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-180', name: '시저샐러드', calories: 280, protein: 10, carbs: 16, fat: 20, servingSize: '1인분 250g' },
  { id: 'd-181', name: '그릭샐러드', calories: 220, protein: 7, carbs: 14, fat: 16, servingSize: '1인분 250g' },
  { id: 'd-182', name: '코브샐러드', calories: 380, protein: 26, carbs: 12, fat: 28, servingSize: '1인분 300g' },
  { id: 'd-183', name: '니수아즈샐러드', calories: 320, protein: 22, carbs: 18, fat: 18, servingSize: '1인분 300g' },
  { id: 'd-184', name: '카프레제', calories: 260, protein: 14, carbs: 6, fat: 20, servingSize: '1인분 200g' },
  { id: 'd-185', name: '루꼴라샐러드', calories: 180, protein: 8, carbs: 10, fat: 12, servingSize: '1인분 200g' },
  { id: 'd-186', name: '콥샐러드', calories: 360, protein: 24, carbs: 10, fat: 26, servingSize: '1인분 300g' },
  { id: 'd-187', name: '닭가슴살샐러드', calories: 240, protein: 28, carbs: 12, fat: 9, servingSize: '1인분 280g' },
  { id: 'd-188', name: '연어샐러드', calories: 300, protein: 22, carbs: 10, fat: 20, servingSize: '1인분 280g' },
  { id: 'd-189', name: '아보카도샐러드', calories: 280, protein: 6, carbs: 14, fat: 24, servingSize: '1인분 250g' },
  { id: 'd-190', name: '참치샐러드', calories: 220, protein: 24, carbs: 10, fat: 10, servingSize: '1인분 250g' },
  { id: 'd-191', name: '콘샐러드', calories: 180, protein: 4, carbs: 28, fat: 6, servingSize: '1인분 200g' },
  { id: 'd-192', name: '과일샐러드', calories: 120, protein: 1.5, carbs: 28, fat: 0.5, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 멕시칸 / 타코
   * ══════════════════════════════════════════ */
  { id: 'd-200', name: '타코 (소고기)', calories: 380, protein: 22, carbs: 34, fat: 18, servingSize: '2개 200g' },
  { id: 'd-201', name: '타코 (치킨)', calories: 340, protein: 24, carbs: 32, fat: 14, servingSize: '2개 200g' },
  { id: 'd-202', name: '부리또 (소고기)', calories: 620, protein: 28, carbs: 68, fat: 24, servingSize: '1개 350g' },
  { id: 'd-203', name: '부리또 (치킨)', calories: 580, protein: 30, carbs: 66, fat: 20, servingSize: '1개 350g' },
  { id: 'd-204', name: '퀘사디아', calories: 500, protein: 22, carbs: 48, fat: 26, servingSize: '1인분 300g' },
  { id: 'd-205', name: '나초', calories: 480, protein: 10, carbs: 56, fat: 24, servingSize: '1인분 150g' },
  { id: 'd-206', name: '과카몰리', calories: 160, protein: 2, carbs: 10, fat: 14, servingSize: '100g' },
  { id: 'd-207', name: '살사소스', calories: 35, protein: 1.5, carbs: 7, fat: 0.5, servingSize: '100g' },
  { id: 'd-208', name: '치폴레볼', calories: 640, protein: 32, carbs: 72, fat: 24, servingSize: '1인분 450g' },

  /* ══════════════════════════════════════════
   * 인도 / 동남아
   * ══════════════════════════════════════════ */
  { id: 'd-220', name: '버터치킨카레', calories: 480, protein: 28, carbs: 28, fat: 30, servingSize: '1인분 300g' },
  { id: 'd-221', name: '팔락파니르', calories: 380, protein: 16, carbs: 18, fat: 28, servingSize: '1인분 280g' },
  { id: 'd-222', name: '치킨티카마살라', calories: 460, protein: 34, carbs: 22, fat: 28, servingSize: '1인분 300g' },
  { id: 'd-223', name: '난', calories: 280, protein: 8, carbs: 50, fat: 5, servingSize: '1장 100g' },
  { id: 'd-224', name: '비리야니', calories: 560, protein: 24, carbs: 72, fat: 20, servingSize: '1인분 400g' },
  { id: 'd-225', name: '팟타이', calories: 520, protein: 20, carbs: 66, fat: 20, servingSize: '1인분 380g' },
  { id: 'd-226', name: '그린카레', calories: 480, protein: 24, carbs: 26, fat: 32, servingSize: '1인분 350g' },
  { id: 'd-227', name: '똠얌꿍', calories: 320, protein: 22, carbs: 18, fat: 18, servingSize: '1인분 400g' },
  { id: 'd-228', name: '나시고랭', calories: 580, protein: 18, carbs: 76, fat: 24, servingSize: '1인분 400g' },
  { id: 'd-229', name: '미고랭', calories: 540, protein: 16, carbs: 72, fat: 22, servingSize: '1인분 380g' },
  { id: 'd-230', name: '쌀국수 (포)', calories: 420, protein: 18, carbs: 68, fat: 8, servingSize: '1인분 500g' },
  { id: 'd-231', name: '반미', calories: 480, protein: 22, carbs: 58, fat: 18, servingSize: '1개 250g' },
  { id: 'd-232', name: '분짜', calories: 460, protein: 24, carbs: 54, fat: 16, servingSize: '1인분 450g' },
  { id: 'd-233', name: '스프링롤 (생)', calories: 180, protein: 8, carbs: 26, fat: 6, servingSize: '2개 120g' },
  { id: 'd-234', name: '스프링롤 (튀김)', calories: 280, protein: 8, carbs: 30, fat: 15, servingSize: '2개 120g' },
  { id: 'd-235', name: '인도네시아식 사테', calories: 320, protein: 26, carbs: 12, fat: 20, servingSize: '5꼬치 200g' },

  /* ══════════════════════════════════════════
   * 포장마차 / 길거리 음식 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-250', name: '어묵탕', calories: 280, protein: 16, carbs: 28, fat: 10, servingSize: '1인분 400g' },
  { id: 'd-251', name: '호떡', calories: 260, protein: 4.5, carbs: 44, fat: 8, servingSize: '1개 100g' },
  { id: 'd-252', name: '붕어빵', calories: 180, protein: 4, carbs: 34, fat: 3.5, servingSize: '2개 100g' },
  { id: 'd-253', name: '계란빵', calories: 200, protein: 8, carbs: 28, fat: 7, servingSize: '1개 90g' },
  { id: 'd-254', name: '핫도그 (길거리)', calories: 360, protein: 12, carbs: 40, fat: 16, servingSize: '1개 150g' },
  { id: 'd-255', name: '옥수수 (찐)', calories: 130, protein: 4, carbs: 28, fat: 1.5, servingSize: '1개 150g' },
  { id: 'd-256', name: '군고구마', calories: 150, protein: 2.5, carbs: 35, fat: 0.5, servingSize: '1개 130g' },
  { id: 'd-257', name: '군밤', calories: 200, protein: 3.5, carbs: 44, fat: 1.5, servingSize: '10개 100g' },
  { id: 'd-258', name: '타코야키', calories: 280, protein: 10, carbs: 34, fat: 11, servingSize: '6개 150g' },
  { id: 'd-259', name: '꽈배기', calories: 300, protein: 5, carbs: 44, fat: 11, servingSize: '2개 100g' },
  { id: 'd-260', name: '도넛 (글레이즈드)', calories: 260, protein: 4, carbs: 36, fat: 12, servingSize: '1개 70g' },
  { id: 'd-261', name: '도넛 (초콜릿)', calories: 290, protein: 4, carbs: 38, fat: 14, servingSize: '1개 75g' },
  { id: 'd-262', name: '슈크림빵', calories: 250, protein: 6, carbs: 36, fat: 10, servingSize: '1개 90g' },
  { id: 'd-263', name: '멜론빵', calories: 280, protein: 5.5, carbs: 46, fat: 9, servingSize: '1개 90g' },
  { id: 'd-264', name: '달고나커피', calories: 160, protein: 2, carbs: 30, fat: 4, servingSize: '1잔 200ml' },

  /* ══════════════════════════════════════════
   * 돈가스 / 튀김 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-280', name: '로스가스', calories: 620, protein: 32, carbs: 56, fat: 30, servingSize: '1인분 350g' },
  { id: 'd-281', name: '치즈돈가스', calories: 680, protein: 34, carbs: 58, fat: 35, servingSize: '1인분 370g' },
  { id: 'd-282', name: '고구마치즈돈가스', calories: 720, protein: 30, carbs: 70, fat: 36, servingSize: '1인분 380g' },
  { id: 'd-283', name: '새우튀김', calories: 240, protein: 16, carbs: 22, fat: 10, servingSize: '3개 120g' },
  { id: 'd-284', name: '오징어튀김', calories: 280, protein: 18, carbs: 24, fat: 12, servingSize: '1인분 150g' },
  { id: 'd-285', name: '고구마튀김', calories: 240, protein: 2, carbs: 40, fat: 9, servingSize: '100g' },
  { id: 'd-286', name: '야채튀김', calories: 200, protein: 3.5, carbs: 28, fat: 9, servingSize: '100g' },
  { id: 'd-287', name: '닭튀김', calories: 290, protein: 22, carbs: 18, fat: 14, servingSize: '100g' },
  { id: 'd-288', name: '텐동', calories: 680, protein: 22, carbs: 88, fat: 26, servingSize: '1인분 450g' },
  { id: 'd-289', name: '새우덴푸라', calories: 200, protein: 14, carbs: 18, fat: 8, servingSize: '3개 100g' },
  { id: 'd-290', name: '탕수육 (새우)', calories: 420, protein: 18, carbs: 50, fat: 18, servingSize: '1인분 200g' },
  { id: 'd-291', name: '치킨까스', calories: 440, protein: 28, carbs: 36, fat: 20, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 건강식 / 다이어트 / 헬스 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-310', name: '닭가슴살 도시락', calories: 320, protein: 35, carbs: 28, fat: 8, servingSize: '1개 300g' },
  { id: 'd-311', name: '현미밥', calories: 340, protein: 7, carbs: 74, fat: 2.5, servingSize: '1공기 200g' },
  { id: 'd-312', name: '귀리밥', calories: 320, protein: 8, carbs: 68, fat: 3.5, servingSize: '1공기 200g' },
  { id: 'd-313', name: '두부면', calories: 80, protein: 9, carbs: 3, fat: 4, servingSize: '200g' },
  { id: 'd-314', name: '곤약', calories: 10, protein: 0.5, carbs: 2, fat: 0.1, servingSize: '100g' },
  { id: 'd-315', name: '곤약볶음밥', calories: 180, protein: 5, carbs: 28, fat: 6, servingSize: '1인분 250g' },
  { id: 'd-316', name: '닭가슴살 볶음밥', calories: 380, protein: 30, carbs: 42, fat: 10, servingSize: '1인분 300g' },
  { id: 'd-317', name: '야채볶음밥', calories: 360, protein: 8, carbs: 58, fat: 10, servingSize: '1인분 300g' },
  { id: 'd-318', name: '프로틴바', calories: 200, protein: 20, carbs: 22, fat: 7, servingSize: '1개 60g' },
  { id: 'd-319', name: '단백질셰이크 (바닐라)', calories: 160, protein: 25, carbs: 10, fat: 3, servingSize: '1팩 300ml' },
  { id: 'd-320', name: '단백질셰이크 (초코)', calories: 170, protein: 25, carbs: 12, fat: 3.5, servingSize: '1팩 300ml' },
  { id: 'd-321', name: '에그화이트오믈렛', calories: 120, protein: 18, carbs: 2, fat: 4, servingSize: '1인분 150g' },
  { id: 'd-322', name: '치아씨드푸딩', calories: 200, protein: 6, carbs: 22, fat: 10, servingSize: '1개 200g' },
  { id: 'd-323', name: '오트밀볼', calories: 280, protein: 8, carbs: 46, fat: 8, servingSize: '1인분 200g' },
  { id: 'd-324', name: '그래놀라볼', calories: 240, protein: 6, carbs: 38, fat: 9, servingSize: '1인분 80g' },
  { id: 'd-325', name: '저칼로리도시락', calories: 400, protein: 28, carbs: 44, fat: 12, servingSize: '1개 350g' },
  { id: 'd-326', name: '닭가슴살 소시지', calories: 130, protein: 16, carbs: 6, fat: 5, servingSize: '2개 80g' },
  { id: 'd-327', name: '두부스테이크', calories: 180, protein: 14, carbs: 8, fat: 10, servingSize: '1인분 200g' },
  { id: 'd-328', name: '현미채소죽', calories: 220, protein: 5, carbs: 44, fat: 2, servingSize: '1인분 400g' },
  { id: 'd-329', name: '생식 (분말)', calories: 180, protein: 6, carbs: 34, fat: 3, servingSize: '1봉 50g' },
  { id: 'd-330', name: '케일스무디', calories: 130, protein: 4, carbs: 26, fat: 2, servingSize: '300ml' },
  { id: 'd-331', name: '당근사과주스', calories: 110, protein: 1.5, carbs: 26, fat: 0.4, servingSize: '250ml' },

  /* ══════════════════════════════════════════
   * 분식 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-350', name: '엽기떡볶이', calories: 520, protein: 16, carbs: 88, fat: 14, servingSize: '1인분 400g' },
  { id: 'd-351', name: '로제떡볶이', calories: 560, protein: 16, carbs: 86, fat: 18, servingSize: '1인분 400g' },
  { id: 'd-352', name: '궁중떡볶이', calories: 480, protein: 18, carbs: 76, fat: 14, servingSize: '1인분 400g' },
  { id: 'd-353', name: '치즈떡볶이', calories: 600, protein: 18, carbs: 88, fat: 20, servingSize: '1인분 400g' },
  { id: 'd-354', name: '오뎅꼬치', calories: 80, protein: 5, carbs: 9, fat: 2.5, servingSize: '1개 60g' },
  { id: 'd-355', name: '순대 (일반)', calories: 280, protein: 14, carbs: 28, fat: 12, servingSize: '150g' },
  { id: 'd-356', name: '순대볶음', calories: 440, protein: 20, carbs: 38, fat: 24, servingSize: '1인분 300g' },
  { id: 'd-357', name: '우동 (분식집)', calories: 400, protein: 14, carbs: 68, fat: 8, servingSize: '1인분 500g' },
  { id: 'd-358', name: '라볶이', calories: 600, protein: 18, carbs: 102, fat: 14, servingSize: '1인분 500g' },
  { id: 'd-359', name: '치즈볼', calories: 280, protein: 10, carbs: 28, fat: 15, servingSize: '5개 120g' },
  { id: 'd-360', name: '떡꼬치', calories: 160, protein: 2.5, carbs: 32, fat: 2, servingSize: '1개 80g' },
  { id: 'd-361', name: '핫바', calories: 280, protein: 12, carbs: 28, fat: 14, servingSize: '1개 100g' },
  { id: 'd-362', name: '고로케 (감자)', calories: 280, protein: 6, carbs: 38, fat: 12, servingSize: '1개 100g' },
  { id: 'd-363', name: '고로케 (카레)', calories: 290, protein: 6.5, carbs: 38, fat: 13, servingSize: '1개 100g' },

  /* ══════════════════════════════════════════
   * 술 / 주류
   * ══════════════════════════════════════════ */
  { id: 'd-400', name: '소주 (1잔)', calories: 64, protein: 0, carbs: 0, fat: 0, servingSize: '1잔 50ml' },
  { id: 'd-401', name: '소주 (1병)', calories: 400, protein: 0, carbs: 0, fat: 0, servingSize: '1병 360ml' },
  { id: 'd-402', name: '맥주 (캔 500ml)', calories: 210, protein: 1.5, carbs: 14, fat: 0, servingSize: '500ml' },
  { id: 'd-403', name: '맥주 (생맥주 500ml)', calories: 220, protein: 1.5, carbs: 15, fat: 0, servingSize: '500ml' },
  { id: 'd-404', name: '막걸리 (1병)', calories: 340, protein: 3, carbs: 44, fat: 0.5, servingSize: '750ml' },
  { id: 'd-405', name: '와인 (레드 1잔)', calories: 125, protein: 0.1, carbs: 3.8, fat: 0, servingSize: '150ml' },
  { id: 'd-406', name: '와인 (화이트 1잔)', calories: 120, protein: 0.1, carbs: 3.2, fat: 0, servingSize: '150ml' },
  { id: 'd-407', name: '하이볼', calories: 160, protein: 0, carbs: 14, fat: 0, servingSize: '300ml' },
  { id: 'd-408', name: '사케 (1잔)', calories: 130, protein: 0.5, carbs: 5, fat: 0, servingSize: '180ml' },
  { id: 'd-409', name: '제로소주', calories: 240, protein: 0, carbs: 0, fat: 0, servingSize: '360ml' },
  { id: 'd-410', name: '맥주 (제로 500ml)', calories: 50, protein: 0.5, carbs: 3.5, fat: 0, servingSize: '500ml' },

  /* ══════════════════════════════════════════
   * 야식 / 안주
   * ══════════════════════════════════════════ */
  { id: 'd-420', name: '치킨 (반반)', calories: 900, protein: 56, carbs: 52, fat: 52, servingSize: '1마리 700g' },
  { id: 'd-421', name: '피자 (콤비네이션 1조각)', calories: 280, protein: 13, carbs: 32, fat: 12, servingSize: '1조각 120g' },
  { id: 'd-422', name: '피자 (불고기 1조각)', calories: 260, protein: 14, carbs: 30, fat: 10, servingSize: '1조각 120g' },
  { id: 'd-423', name: '피자 (마르게리타 1조각)', calories: 240, protein: 12, carbs: 28, fat: 10, servingSize: '1조각 110g' },
  { id: 'd-424', name: '닭발', calories: 350, protein: 28, carbs: 12, fat: 24, servingSize: '1인분 200g' },
  { id: 'd-425', name: '막창구이', calories: 380, protein: 26, carbs: 4, fat: 30, servingSize: '1인분 200g' },
  { id: 'd-426', name: '곱창전골', calories: 520, protein: 32, carbs: 24, fat: 36, servingSize: '1인분 400g' },
  { id: 'd-427', name: '새우깡', calories: 510, protein: 7, carbs: 68, fat: 24, servingSize: '1봉 90g' },
  { id: 'd-428', name: '먹태', calories: 280, protein: 58, carbs: 4, fat: 2.5, servingSize: '100g' },
  { id: 'd-429', name: '쥐포', calories: 300, protein: 52, carbs: 8, fat: 6, servingSize: '100g' },
  { id: 'd-430', name: '치즈볼 (냉동)', calories: 320, protein: 12, carbs: 32, fat: 17, servingSize: '6개 150g' },
  { id: 'd-431', name: '소떡소떡', calories: 360, protein: 10, carbs: 52, fat: 14, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 일식 — 라멘 / 우동 / 소바
   * ══════════════════════════════════════════ */
  { id: 'd-500', name: '쇼유라멘', calories: 500, protein: 24, carbs: 66, fat: 16, servingSize: '1인분 500g' },
  { id: 'd-501', name: '미소라멘', calories: 540, protein: 22, carbs: 68, fat: 20, servingSize: '1인분 500g' },
  { id: 'd-502', name: '시오라멘', calories: 460, protein: 20, carbs: 66, fat: 14, servingSize: '1인분 500g' },
  { id: 'd-503', name: '돈코츠라멘', calories: 620, protein: 28, carbs: 70, fat: 26, servingSize: '1인분 550g' },
  { id: 'd-504', name: '삿포로 버터콘라멘', calories: 680, protein: 22, carbs: 76, fat: 30, servingSize: '1인분 550g' },
  { id: 'd-505', name: '가케우동', calories: 380, protein: 12, carbs: 72, fat: 4, servingSize: '1인분 450g' },
  { id: 'd-506', name: '야키우동', calories: 520, protein: 18, carbs: 78, fat: 16, servingSize: '1인분 450g' },
  { id: 'd-507', name: '자루소바', calories: 320, protein: 14, carbs: 64, fat: 2, servingSize: '1인분 280g' },
  { id: 'd-508', name: '따뜻한소바', calories: 340, protein: 14, carbs: 66, fat: 3, servingSize: '1인분 450g' },
  { id: 'd-509', name: '냉소바', calories: 310, protein: 13, carbs: 62, fat: 2, servingSize: '1인분 280g' },
  { id: 'd-510', name: '모리소바', calories: 315, protein: 14, carbs: 63, fat: 2, servingSize: '1인분 280g' },
  { id: 'd-511', name: '탄탄멘', calories: 680, protein: 30, carbs: 68, fat: 32, servingSize: '1인분 550g' },
  { id: 'd-512', name: '차슈라멘', calories: 640, protein: 32, carbs: 72, fat: 24, servingSize: '1인분 550g' },

  /* ══════════════════════════════════════════
   * 일식 — 초밥 / 롤 / 사시미
   * ══════════════════════════════════════════ */
  { id: 'd-520', name: '연어초밥 (2피스)', calories: 150, protein: 10, carbs: 22, fat: 4, servingSize: '2피스 80g' },
  { id: 'd-521', name: '참치초밥 (2피스)', calories: 140, protein: 12, carbs: 22, fat: 2.5, servingSize: '2피스 80g' },
  { id: 'd-522', name: '새우초밥 (2피스)', calories: 130, protein: 8, carbs: 22, fat: 2, servingSize: '2피스 75g' },
  { id: 'd-523', name: '광어초밥 (2피스)', calories: 120, protein: 10, carbs: 20, fat: 1.5, servingSize: '2피스 75g' },
  { id: 'd-524', name: '성게초밥 (2피스)', calories: 160, protein: 8, carbs: 22, fat: 5, servingSize: '2피스 80g' },
  { id: 'd-525', name: '이카초밥 (2피스)', calories: 115, protein: 9, carbs: 21, fat: 1.2, servingSize: '2피스 75g' },
  { id: 'd-526', name: '스파이시참치롤 (8피스)', calories: 420, protein: 20, carbs: 54, fat: 14, servingSize: '8피스 200g' },
  { id: 'd-527', name: '캘리포니아롤 (8피스)', calories: 380, protein: 14, carbs: 56, fat: 12, servingSize: '8피스 200g' },
  { id: 'd-528', name: '드래곤롤 (8피스)', calories: 480, protein: 18, carbs: 58, fat: 20, servingSize: '8피스 220g' },
  { id: 'd-529', name: '오마카세 (10피스)', calories: 650, protein: 36, carbs: 80, fat: 20, servingSize: '10피스 350g' },
  { id: 'd-530', name: '연어사시미 (5피스)', calories: 180, protein: 22, carbs: 0, fat: 10, servingSize: '5피스 120g' },
  { id: 'd-531', name: '참치사시미 (5피스)', calories: 150, protein: 25, carbs: 0, fat: 5, servingSize: '5피스 120g' },
  { id: 'd-532', name: '모둠사시미 (10피스)', calories: 300, protein: 38, carbs: 2, fat: 12, servingSize: '10피스 240g' },

  /* ══════════════════════════════════════════
   * 일식 — 돈부리 / 정식
   * ══════════════════════════════════════════ */
  { id: 'd-540', name: '규동 (소)', calories: 560, protein: 22, carbs: 74, fat: 22, servingSize: '1인분 380g' },
  { id: 'd-541', name: '규동 (중)', calories: 680, protein: 26, carbs: 90, fat: 26, servingSize: '1인분 480g' },
  { id: 'd-542', name: '오야코동', calories: 640, protein: 28, carbs: 80, fat: 24, servingSize: '1인분 450g' },
  { id: 'd-543', name: '가츠동', calories: 720, protein: 30, carbs: 86, fat: 28, servingSize: '1인분 480g' },
  { id: 'd-544', name: '마구로동', calories: 580, protein: 32, carbs: 76, fat: 16, servingSize: '1인분 400g' },
  { id: 'd-545', name: '카이센동', calories: 620, protein: 34, carbs: 78, fat: 18, servingSize: '1인분 450g' },
  { id: 'd-546', name: '덴동 (새우)', calories: 680, protein: 22, carbs: 92, fat: 24, servingSize: '1인분 480g' },
  { id: 'd-547', name: '야키니쿠동', calories: 660, protein: 28, carbs: 82, fat: 26, servingSize: '1인분 450g' },
  { id: 'd-548', name: '카레우동', calories: 560, protein: 18, carbs: 88, fat: 16, servingSize: '1인분 500g' },
  { id: 'd-549', name: '일본식 카레', calories: 580, protein: 16, carbs: 94, fat: 14, servingSize: '1인분 450g' },
  { id: 'd-550', name: '히츠마부시 (장어)', calories: 640, protein: 28, carbs: 84, fat: 24, servingSize: '1인분 420g' },
  { id: 'd-551', name: '돈카츠 정식', calories: 750, protein: 34, carbs: 84, fat: 34, servingSize: '1인분 450g' },
  { id: 'd-552', name: '사바 정식 (고등어구이)', calories: 520, protein: 32, carbs: 62, fat: 18, servingSize: '1인분 400g' },
  { id: 'd-553', name: '야키토리 5꼬치', calories: 320, protein: 28, carbs: 12, fat: 18, servingSize: '5꼬치 200g' },
  { id: 'd-554', name: '타코야키 8개', calories: 380, protein: 14, carbs: 44, fat: 16, servingSize: '8개 200g' },
  { id: 'd-555', name: '오코노미야키', calories: 460, protein: 18, carbs: 58, fat: 18, servingSize: '1인분 300g' },
  { id: 'd-556', name: '모찌 (떡 아이스크림)', calories: 130, protein: 2, carbs: 22, fat: 4, servingSize: '1개 60g' },
  { id: 'd-557', name: '다이후쿠 (딸기)', calories: 120, protein: 2, carbs: 26, fat: 1, servingSize: '1개 50g' },

  /* ══════════════════════════════════════════
   * 편의점 / 간편식
   * ══════════════════════════════════════════ */
  { id: 'd-600', name: '편의점 도시락 (제육)', calories: 680, protein: 26, carbs: 84, fat: 24, servingSize: '1개 430g' },
  { id: 'd-601', name: '편의점 도시락 (치킨)', calories: 650, protein: 28, carbs: 80, fat: 22, servingSize: '1개 410g' },
  { id: 'd-602', name: '편의점 도시락 (돈가스)', calories: 730, protein: 24, carbs: 92, fat: 28, servingSize: '1개 450g' },
  { id: 'd-603', name: '편의점 삼각김밥 (참치마요)', calories: 220, protein: 7, carbs: 38, fat: 5, servingSize: '1개 105g' },
  { id: 'd-604', name: '편의점 삼각김밥 (불고기)', calories: 210, protein: 7, carbs: 38, fat: 4, servingSize: '1개 105g' },
  { id: 'd-605', name: '편의점 샌드위치 (햄치즈)', calories: 340, protein: 14, carbs: 40, fat: 14, servingSize: '1개 170g' },
  { id: 'd-606', name: '편의점 샌드위치 (참치)', calories: 320, protein: 12, carbs: 40, fat: 12, servingSize: '1개 165g' },
  { id: 'd-607', name: '컵라면 (신라면)', calories: 375, protein: 9, carbs: 54, fat: 14, servingSize: '1개 68g' },
  { id: 'd-608', name: '컵라면 (진라면)', calories: 370, protein: 8, carbs: 55, fat: 13, servingSize: '1개 65g' },
  { id: 'd-609', name: '컵볶음면 (불닭)', calories: 395, protein: 8, carbs: 54, fat: 16, servingSize: '1개 70g' },
  { id: 'd-610', name: '냉동만두 (군만두 6개)', calories: 360, protein: 14, carbs: 44, fat: 14, servingSize: '6개 200g' },
  { id: 'd-611', name: '냉동피자 (개인)', calories: 580, protein: 22, carbs: 66, fat: 24, servingSize: '1판 250g' },
  { id: 'd-612', name: '즉석밥 (햇반)', calories: 313, protein: 5.5, carbs: 69, fat: 0.5, servingSize: '1개 210g' },
  { id: 'd-613', name: '즉석국 (된장국)', calories: 30, protein: 2, carbs: 4, fat: 0.8, servingSize: '1봉 150ml' },
  { id: 'd-614', name: '레토르트 카레', calories: 200, protein: 8, carbs: 28, fat: 7, servingSize: '1봉 200g' },
  { id: 'd-615', name: '편의점 핫도그', calories: 350, protein: 12, carbs: 36, fat: 17, servingSize: '1개 120g' },
  { id: 'd-616', name: '편의점 온면', calories: 410, protein: 12, carbs: 68, fat: 10, servingSize: '1개 400g' },
  { id: 'd-617', name: '편의점 우동', calories: 390, protein: 11, carbs: 70, fat: 8, servingSize: '1개 400g' },

  /* ══════════════════════════════════════════
   * 라면 (봉지)
   * ══════════════════════════════════════════ */
  { id: 'd-630', name: '신라면', calories: 505, protein: 10, carbs: 74, fat: 18, servingSize: '1봉 120g' },
  { id: 'd-631', name: '진라면 (매운맛)', calories: 505, protein: 9, carbs: 76, fat: 17, servingSize: '1봉 120g' },
  { id: 'd-632', name: '안성탕면', calories: 505, protein: 9, carbs: 76, fat: 17, servingSize: '1봉 125g' },
  { id: 'd-633', name: '짜파게티', calories: 540, protein: 10, carbs: 79, fat: 20, servingSize: '1봉 140g' },
  { id: 'd-634', name: '불닭볶음면', calories: 530, protein: 12, carbs: 73, fat: 22, servingSize: '1봉 140g' },
  { id: 'd-635', name: '너구리', calories: 510, protein: 9, carbs: 76, fat: 18, servingSize: '1봉 120g' },
  { id: 'd-636', name: '삼양라면', calories: 495, protein: 9, carbs: 73, fat: 17, servingSize: '1봉 120g' },
  { id: 'd-637', name: '팔도비빔면', calories: 450, protein: 9, carbs: 70, fat: 14, servingSize: '1봉 130g' },
  { id: 'd-638', name: '나가사끼짬뽕', calories: 500, protein: 10, carbs: 76, fat: 17, servingSize: '1봉 120g' },
  { id: 'd-639', name: '육개장사발면', calories: 380, protein: 8, carbs: 58, fat: 13, servingSize: '1개 86g' },

  /* ══════════════════════════════════════════
   * 과자 / 스낵
   * ══════════════════════════════════════════ */
  { id: 'd-650', name: '감자칩 (오리지널)', calories: 530, protein: 6, carbs: 52, fat: 34, servingSize: '100g' },
  { id: 'd-651', name: '감자칩 (허니버터)', calories: 540, protein: 5.5, carbs: 58, fat: 32, servingSize: '100g' },
  { id: 'd-652', name: '프링글스 (오리지널)', calories: 540, protein: 5, carbs: 52, fat: 34, servingSize: '100g' },
  { id: 'd-653', name: '나초칩', calories: 480, protein: 7, carbs: 62, fat: 22, servingSize: '100g' },
  { id: 'd-654', name: '오레오', calories: 480, protein: 5, carbs: 70, fat: 20, servingSize: '100g' },
  { id: 'd-655', name: '초코파이', calories: 180, protein: 2.5, carbs: 28, fat: 7, servingSize: '1개 39g' },
  { id: 'd-656', name: '빼빼로 (초코)', calories: 480, protein: 7, carbs: 72, fat: 18, servingSize: '100g' },
  { id: 'd-657', name: '새우깡', calories: 515, protein: 7, carbs: 68, fat: 23, servingSize: '100g' },
  { id: 'd-658', name: '꼬깔콘', calories: 520, protein: 6, carbs: 68, fat: 24, servingSize: '100g' },
  { id: 'd-659', name: '칙촉', calories: 490, protein: 5.5, carbs: 65, fat: 22, servingSize: '100g' },
  { id: 'd-660', name: '포카칩', calories: 520, protein: 6, carbs: 56, fat: 30, servingSize: '100g' },
  { id: 'd-661', name: '쿠크다스', calories: 500, protein: 6, carbs: 64, fat: 24, servingSize: '100g' },
  { id: 'd-662', name: '육포 (소)', calories: 300, protein: 48, carbs: 8, fat: 8, servingSize: '100g' },
  { id: 'd-663', name: '아몬드 (볶음)', calories: 590, protein: 22, carbs: 22, fat: 50, servingSize: '100g' },
  { id: 'd-664', name: '땅콩', calories: 570, protein: 26, carbs: 16, fat: 48, servingSize: '100g' },
  { id: 'd-665', name: '캐슈너트', calories: 560, protein: 18, carbs: 28, fat: 44, servingSize: '100g' },
  { id: 'd-666', name: '마카다미아', calories: 720, protein: 8, carbs: 14, fat: 76, servingSize: '100g' },
  { id: 'd-667', name: '견과류 믹스', calories: 580, protein: 16, carbs: 20, fat: 52, servingSize: '100g' },
  { id: 'd-668', name: '젤리 (하리보)', calories: 340, protein: 7, carbs: 78, fat: 0.5, servingSize: '100g' },
  { id: 'd-669', name: '사탕 (캐러멜)', calories: 390, protein: 2, carbs: 80, fat: 6, servingSize: '100g' },
  { id: 'd-670', name: '쌀과자 (뻥튀기)', calories: 375, protein: 8, carbs: 82, fat: 1, servingSize: '100g' },
  { id: 'd-671', name: '홈런볼', calories: 490, protein: 6, carbs: 66, fat: 22, servingSize: '100g' },
  { id: 'd-672', name: '에이스 크래커', calories: 480, protein: 8, carbs: 66, fat: 20, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 빵 / 베이커리 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-700', name: '식빵 (1장)', calories: 80, protein: 3, carbs: 15, fat: 1, servingSize: '1장 30g' },
  { id: 'd-701', name: '통밀식빵 (1장)', calories: 75, protein: 3.5, carbs: 14, fat: 1, servingSize: '1장 30g' },
  { id: 'd-702', name: '크루아상', calories: 280, protein: 5, carbs: 30, fat: 16, servingSize: '1개 60g' },
  { id: 'd-703', name: '베이글 (플레인)', calories: 240, protein: 9, carbs: 48, fat: 1.5, servingSize: '1개 90g' },
  { id: 'd-704', name: '베이글 (크림치즈)', calories: 350, protein: 10, carbs: 50, fat: 13, servingSize: '1개 120g' },
  { id: 'd-705', name: '치아바타', calories: 220, protein: 7, carbs: 42, fat: 2.5, servingSize: '1개 80g' },
  { id: 'd-706', name: '바게트 (4조각)', calories: 260, protein: 9, carbs: 52, fat: 1.5, servingSize: '4조각 100g' },
  { id: 'd-707', name: '소금빵', calories: 240, protein: 5, carbs: 32, fat: 11, servingSize: '1개 70g' },
  { id: 'd-708', name: '단팥빵', calories: 280, protein: 6, carbs: 50, fat: 6, servingSize: '1개 90g' },
  { id: 'd-709', name: '크림빵', calories: 290, protein: 6, carbs: 44, fat: 10, servingSize: '1개 90g' },
  { id: 'd-710', name: '마늘빵', calories: 300, protein: 5.5, carbs: 38, fat: 14, servingSize: '2조각 90g' },
  { id: 'd-711', name: '스콘 (플레인)', calories: 320, protein: 6, carbs: 44, fat: 14, servingSize: '1개 90g' },
  { id: 'd-712', name: '브리오슈', calories: 340, protein: 8, carbs: 44, fat: 15, servingSize: '1개 90g' },
  { id: 'd-713', name: '시나몬롤', calories: 400, protein: 6, carbs: 58, fat: 17, servingSize: '1개 120g' },
  { id: 'd-714', name: '포카치아', calories: 260, protein: 7, carbs: 42, fat: 8, servingSize: '1조각 90g' },
  { id: 'd-715', name: '프레첼', calories: 380, protein: 10, carbs: 74, fat: 4, servingSize: '100g' },
  { id: 'd-716', name: '마들렌', calories: 180, protein: 3, carbs: 22, fat: 9, servingSize: '1개 40g' },
  { id: 'd-717', name: '휘낭시에', calories: 190, protein: 4, carbs: 24, fat: 9, servingSize: '1개 40g' },
  { id: 'd-718', name: '크레이프', calories: 180, protein: 5, carbs: 26, fat: 7, servingSize: '1장 80g' },
  { id: 'd-719', name: '에그타르트', calories: 260, protein: 5.5, carbs: 28, fat: 14, servingSize: '1개 75g' },
  { id: 'd-720', name: '팬케이크 (2장)', calories: 420, protein: 10, carbs: 60, fat: 16, servingSize: '2장 200g' },
  { id: 'd-721', name: '와플', calories: 380, protein: 8, carbs: 52, fat: 16, servingSize: '1개 150g' },
  { id: 'd-722', name: '프렌치토스트', calories: 320, protein: 10, carbs: 40, fat: 14, servingSize: '2장 160g' },
  { id: 'd-723', name: '베이글샌드위치 (연어)', calories: 480, protein: 26, carbs: 52, fat: 18, servingSize: '1개 220g' },

  /* ══════════════════════════════════════════
   * 아침식사 / 브런치
   * ══════════════════════════════════════════ */
  { id: 'd-740', name: '에그베네딕트', calories: 540, protein: 24, carbs: 36, fat: 34, servingSize: '1인분 250g' },
  { id: 'd-741', name: '스크램블에그', calories: 220, protein: 14, carbs: 2, fat: 18, servingSize: '2개 분량 120g' },
  { id: 'd-742', name: '수란 (포치드에그)', calories: 80, protein: 6, carbs: 0.5, fat: 6, servingSize: '1개 60g' },
  { id: 'd-743', name: '아메리칸 브렉퍼스트', calories: 780, protein: 34, carbs: 58, fat: 46, servingSize: '1인분 450g' },
  { id: 'd-744', name: '오믈렛', calories: 280, protein: 18, carbs: 4, fat: 22, servingSize: '1인분 180g' },
  { id: 'd-745', name: '시리얼 (콘플레이크)', calories: 380, protein: 7, carbs: 84, fat: 1, servingSize: '100g' },
  { id: 'd-746', name: '시리얼 (그래놀라)', calories: 450, protein: 10, carbs: 68, fat: 16, servingSize: '100g' },
  { id: 'd-747', name: '오트밀 (우유)', calories: 280, protein: 10, carbs: 42, fat: 8, servingSize: '1인분 250g' },
  { id: 'd-748', name: '그릭요거트', calories: 120, protein: 12, carbs: 8, fat: 4, servingSize: '170g' },
  { id: 'd-749', name: '그릭요거트 (꿀)', calories: 160, protein: 11, carbs: 18, fat: 4, servingSize: '200g' },
  { id: 'd-750', name: '아사이볼', calories: 320, protein: 6, carbs: 52, fat: 10, servingSize: '1개 300g' },
  { id: 'd-751', name: '스무디볼', calories: 300, protein: 8, carbs: 54, fat: 8, servingSize: '1개 280g' },
  { id: 'd-752', name: '아보카도토스트', calories: 340, protein: 8, carbs: 30, fat: 22, servingSize: '1인분 180g' },
  { id: 'd-753', name: '수프 (크림스프)', calories: 280, protein: 6, carbs: 22, fat: 18, servingSize: '1그릇 300g' },
  { id: 'd-754', name: '수프 (토마토)', calories: 160, protein: 4, carbs: 24, fat: 6, servingSize: '1그릇 300g' },
  { id: 'd-755', name: '수프 (양파)', calories: 200, protein: 5, carbs: 28, fat: 8, servingSize: '1그릇 300g' },
  { id: 'd-756', name: '수프 (클램차우더)', calories: 300, protein: 10, carbs: 26, fat: 18, servingSize: '1그릇 300g' },

  /* ══════════════════════════════════════════
   * 초콜릿 / 아이스크림 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-770', name: '다크초콜릿 (70%)', calories: 600, protein: 8, carbs: 46, fat: 44, servingSize: '100g' },
  { id: 'd-771', name: '밀크초콜릿', calories: 540, protein: 8, carbs: 58, fat: 32, servingSize: '100g' },
  { id: 'd-772', name: '화이트초콜릿', calories: 560, protein: 6, carbs: 60, fat: 34, servingSize: '100g' },
  { id: 'd-773', name: '아이스크림 (바닐라)', calories: 200, protein: 3.5, carbs: 24, fat: 10, servingSize: '1스쿱 100g' },
  { id: 'd-774', name: '아이스크림 (초코)', calories: 210, protein: 3.5, carbs: 26, fat: 11, servingSize: '1스쿱 100g' },
  { id: 'd-775', name: '아이스크림 (딸기)', calories: 190, protein: 3, carbs: 24, fat: 9, servingSize: '1스쿱 100g' },
  { id: 'd-776', name: '소르베 (레몬)', calories: 120, protein: 0.5, carbs: 30, fat: 0.2, servingSize: '1스쿱 100g' },
  { id: 'd-777', name: '젤라또 (피스타치오)', calories: 220, protein: 5, carbs: 26, fat: 12, servingSize: '1스쿱 100g' },
  { id: 'd-778', name: '소프트크림 (바닐라)', calories: 160, protein: 3, carbs: 22, fat: 6.5, servingSize: '1개 90g' },
  { id: 'd-779', name: '아이스바 (누가바)', calories: 170, protein: 2.5, carbs: 24, fat: 7, servingSize: '1개 80g' },

  /* ══════════════════════════════════════════
   * 한식 구이 / 고기 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-800', name: '삼겹살 구이 (200g)', calories: 660, protein: 30, carbs: 0, fat: 60, servingSize: '200g' },
  { id: 'd-801', name: '목살 구이 (200g)', calories: 580, protein: 32, carbs: 0, fat: 50, servingSize: '200g' },
  { id: 'd-802', name: '항정살 구이 (200g)', calories: 600, protein: 32, carbs: 0, fat: 52, servingSize: '200g' },
  { id: 'd-803', name: '갈비살 구이 (200g)', calories: 580, protein: 34, carbs: 2, fat: 48, servingSize: '200g' },
  { id: 'd-804', name: '차돌박이 구이 (150g)', calories: 580, protein: 24, carbs: 0, fat: 54, servingSize: '150g' },
  { id: 'd-805', name: '대패삼겹살 (150g)', calories: 560, protein: 22, carbs: 0, fat: 52, servingSize: '150g' },
  { id: 'd-806', name: '소고기 불고기 (200g)', calories: 420, protein: 32, carbs: 18, fat: 24, servingSize: '200g' },
  { id: 'd-807', name: '소갈비 (1대)', calories: 560, protein: 36, carbs: 10, fat: 40, servingSize: '1대 250g' },
  { id: 'd-808', name: '돼지갈비 (200g)', calories: 500, protein: 30, carbs: 12, fat: 38, servingSize: '200g' },
  { id: 'd-809', name: '양념갈비 (200g)', calories: 540, protein: 30, carbs: 22, fat: 38, servingSize: '200g' },
  { id: 'd-810', name: '껍데기 구이 (150g)', calories: 420, protein: 30, carbs: 0, fat: 34, servingSize: '150g' },
  { id: 'd-811', name: '닭꼬치', calories: 200, protein: 20, carbs: 8, fat: 10, servingSize: '2꼬치 120g' },
  { id: 'd-812', name: '양꼬치 (5개)', calories: 380, protein: 28, carbs: 4, fat: 28, servingSize: '5개 200g' },
  { id: 'd-813', name: '오리불고기', calories: 480, protein: 28, carbs: 14, fat: 34, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 패스트푸드 추가 (버거킹 / 롯데리아 / KFC)
   * ══════════════════════════════════════════ */
  { id: 'd-830', name: '버거킹 와퍼', calories: 680, protein: 36, carbs: 52, fat: 38, servingSize: '1개 290g' },
  { id: 'd-831', name: '버거킹 치즈와퍼', calories: 740, protein: 40, carbs: 54, fat: 43, servingSize: '1개 305g' },
  { id: 'd-832', name: '버거킹 불고기와퍼', calories: 640, protein: 32, carbs: 56, fat: 34, servingSize: '1개 280g' },
  { id: 'd-833', name: '롯데리아 롯데리아버거', calories: 620, protein: 26, carbs: 54, fat: 34, servingSize: '1개 250g' },
  { id: 'd-834', name: '롯데리아 새우버거', calories: 430, protein: 18, carbs: 48, fat: 19, servingSize: '1개 190g' },
  { id: 'd-835', name: 'KFC 오리지널치킨 (2피스)', calories: 520, protein: 36, carbs: 28, fat: 30, servingSize: '2피스 240g' },
  { id: 'd-836', name: 'KFC 징거버거', calories: 560, protein: 28, carbs: 48, fat: 28, servingSize: '1개 240g' },
  { id: 'd-837', name: '맘스터치 싸이버거', calories: 740, protein: 38, carbs: 62, fat: 38, servingSize: '1개 290g' },
  { id: 'd-838', name: '쉐이크쉑 쉑버거', calories: 780, protein: 42, carbs: 52, fat: 48, servingSize: '1개 310g' },
  { id: 'd-839', name: '파이브가이즈 버거', calories: 840, protein: 44, carbs: 54, fat: 52, servingSize: '1개 340g' },
  { id: 'd-840', name: '맥도날드 해피밀', calories: 480, protein: 18, carbs: 56, fat: 20, servingSize: '1세트 320g' },
  { id: 'd-841', name: '서브웨이 이탈리안 BMT (15cm)', calories: 430, protein: 22, carbs: 48, fat: 18, servingSize: '1개 240g' },
  { id: 'd-842', name: '서브웨이 터키 (15cm)', calories: 360, protein: 24, carbs: 46, fat: 10, servingSize: '1개 230g' },
  { id: 'd-843', name: '서브웨이 베지 딜라이트 (15cm)', calories: 280, protein: 10, carbs: 44, fat: 6, servingSize: '1개 200g' },

  /* ══════════════════════════════════════════
   * 피자 (상세)
   * ══════════════════════════════════════════ */
  { id: 'd-860', name: '도미노 슈퍼시드 (1조각)', calories: 295, protein: 14, carbs: 34, fat: 12, servingSize: '1조각 130g' },
  { id: 'd-861', name: '피자헛 슈프림 (1조각)', calories: 310, protein: 15, carbs: 36, fat: 13, servingSize: '1조각 135g' },
  { id: 'd-862', name: '미스터피자 포테이토 (1조각)', calories: 280, protein: 12, carbs: 36, fat: 11, servingSize: '1조각 125g' },
  { id: 'd-863', name: '피자 마르게리타 (1판)', calories: 1200, protein: 56, carbs: 140, fat: 48, servingSize: '1판 600g' },
  { id: 'd-864', name: '피자 페퍼로니 (1판)', calories: 1400, protein: 60, carbs: 140, fat: 66, servingSize: '1판 640g' },
  { id: 'd-865', name: '피자 하와이안 (1판)', calories: 1250, protein: 58, carbs: 148, fat: 50, servingSize: '1판 620g' },
  { id: 'd-866', name: '화덕피자 나폴리 (1판)', calories: 900, protein: 40, carbs: 110, fat: 34, servingSize: '1판 440g' },

  /* ══════════════════════════════════════════
   * 영양제 / 보조식품
   * ══════════════════════════════════════════ */
  { id: 'd-880', name: '종합비타민 (1정)', calories: 5, protein: 0, carbs: 1, fat: 0, servingSize: '1정 1g' },
  { id: 'd-881', name: '비타민C (500mg)', calories: 2, protein: 0, carbs: 0.5, fat: 0, servingSize: '1정 0.5g' },
  { id: 'd-882', name: '오메가3 (1캡슐)', calories: 10, protein: 0, carbs: 0, fat: 1, servingSize: '1캡슐 1g' },
  { id: 'd-883', name: '프로틴파우더 1스쿱', calories: 120, protein: 24, carbs: 3, fat: 2, servingSize: '1스쿱 30g' },
  { id: 'd-884', name: 'BCAA 1스쿱', calories: 20, protein: 5, carbs: 0, fat: 0, servingSize: '1스쿱 5g' },
  { id: 'd-885', name: '크레아틴 1스쿱', calories: 16, protein: 0, carbs: 4, fat: 0, servingSize: '1스쿱 4g' },

  /* ══════════════════════════════════════════
   * 에너지음료 / 스포츠음료 / 건강음료
   * ══════════════════════════════════════════ */
  { id: 'e-001', name: '레드불 (250ml)', calories: 113, protein: 0.9, carbs: 28, fat: 0, servingSize: '250ml' },
  { id: 'e-002', name: '몬스터에너지 (355ml)', calories: 160, protein: 0, carbs: 38, fat: 0, servingSize: '355ml' },
  { id: 'e-003', name: '핫식스 (250ml)', calories: 120, protein: 0, carbs: 30, fat: 0, servingSize: '250ml' },
  { id: 'e-004', name: '포카리스웨트 (500ml)', calories: 130, protein: 0, carbs: 31, fat: 0, servingSize: '500ml' },
  { id: 'e-005', name: '게토레이 (600ml)', calories: 150, protein: 0, carbs: 38, fat: 0, servingSize: '600ml' },
  { id: 'e-006', name: '파워에이드 (600ml)', calories: 168, protein: 0, carbs: 42, fat: 0, servingSize: '600ml' },
  { id: 'e-007', name: '비타500 (100ml)', calories: 30, protein: 0, carbs: 7.5, fat: 0, servingSize: '100ml' },
  { id: 'e-008', name: '박카스 (120ml)', calories: 50, protein: 0, carbs: 12, fat: 0, servingSize: '120ml' },
  { id: 'e-009', name: '컨디션 (100ml)', calories: 60, protein: 0, carbs: 14, fat: 0, servingSize: '100ml' },
  { id: 'e-010', name: '이온음료 (500ml)', calories: 100, protein: 0, carbs: 25, fat: 0, servingSize: '500ml' },
  { id: 'e-011', name: '코카콜라 (355ml)', calories: 140, protein: 0, carbs: 39, fat: 0, servingSize: '355ml' },
  { id: 'e-012', name: '코카콜라 제로 (500ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '500ml' },
  { id: 'e-013', name: '펩시 (355ml)', calories: 150, protein: 0, carbs: 41, fat: 0, servingSize: '355ml' },
  { id: 'e-014', name: '칠성사이다 (355ml)', calories: 142, protein: 0, carbs: 35, fat: 0, servingSize: '355ml' },
  { id: 'e-015', name: '환타 오렌지 (355ml)', calories: 170, protein: 0, carbs: 46, fat: 0, servingSize: '355ml' },
  { id: 'e-016', name: '스프라이트 (355ml)', calories: 146, protein: 0, carbs: 38, fat: 0, servingSize: '355ml' },
  { id: 'e-017', name: '밀키스 (250ml)', calories: 130, protein: 1.5, carbs: 29, fat: 1.5, servingSize: '250ml' },
  { id: 'e-018', name: '오렌지주스 (200ml)', calories: 88, protein: 1.2, carbs: 21, fat: 0.2, servingSize: '200ml' },
  { id: 'e-019', name: '사과주스 (200ml)', calories: 96, protein: 0.2, carbs: 24, fat: 0.1, servingSize: '200ml' },
  { id: 'e-020', name: '포도주스 (200ml)', calories: 130, protein: 0.5, carbs: 33, fat: 0.1, servingSize: '200ml' },
  { id: 'e-021', name: '토마토주스 (200ml)', calories: 40, protein: 1.8, carbs: 8, fat: 0.2, servingSize: '200ml' },
  { id: 'e-022', name: '제주 감귤주스 (200ml)', calories: 90, protein: 0.8, carbs: 22, fat: 0.2, servingSize: '200ml' },
  { id: 'e-023', name: '두유 (190ml)', calories: 90, protein: 5, carbs: 10, fat: 3, servingSize: '190ml' },
  { id: 'e-024', name: '아몬드브리즈 (190ml)', calories: 40, protein: 1.5, carbs: 3.5, fat: 2.5, servingSize: '190ml' },
  { id: 'e-025', name: '오트밀크 (200ml)', calories: 60, protein: 1.5, carbs: 9, fat: 1.5, servingSize: '200ml' },
  { id: 'e-026', name: '코코넛워터 (330ml)', calories: 60, protein: 0.5, carbs: 15, fat: 0.5, servingSize: '330ml' },
  { id: 'e-027', name: '생수 (500ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '500ml' },
  { id: 'e-028', name: '탄산수 (350ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '350ml' },

  /* ══════════════════════════════════════════
   * 한식 면류 추가
   * ══════════════════════════════════════════ */
  { id: 'e-050', name: '물냉면', calories: 490, protein: 16, carbs: 90, fat: 6, servingSize: '1인분 500g' },
  { id: 'e-051', name: '비빔냉면', calories: 530, protein: 16, carbs: 96, fat: 8, servingSize: '1인분 500g' },
  { id: 'e-052', name: '쟁반냉면', calories: 560, protein: 18, carbs: 100, fat: 8, servingSize: '1인분 550g' },
  { id: 'e-053', name: '막국수', calories: 460, protein: 14, carbs: 84, fat: 6, servingSize: '1인분 450g' },
  { id: 'e-054', name: '비빔막국수', calories: 490, protein: 14, carbs: 90, fat: 8, servingSize: '1인분 450g' },
  { id: 'e-055', name: '콩국수', calories: 470, protein: 20, carbs: 74, fat: 10, servingSize: '1인분 500g' },
  { id: 'e-056', name: '잔치국수', calories: 420, protein: 13, carbs: 76, fat: 6, servingSize: '1인분 450g' },
  { id: 'e-057', name: '비빔국수', calories: 460, protein: 12, carbs: 86, fat: 8, servingSize: '1인분 430g' },
  { id: 'e-058', name: '칼국수', calories: 520, protein: 16, carbs: 84, fat: 10, servingSize: '1인분 500g' },
  { id: 'e-059', name: '수제비', calories: 490, protein: 14, carbs: 80, fat: 10, servingSize: '1인분 500g' },
  { id: 'e-060', name: '닭칼국수', calories: 560, protein: 26, carbs: 74, fat: 16, servingSize: '1인분 550g' },
  { id: 'e-061', name: '해물칼국수', calories: 540, protein: 22, carbs: 80, fat: 12, servingSize: '1인분 550g' },

  /* ══════════════════════════════════════════
   * 한식 찜 / 구이 추가
   * ══════════════════════════════════════════ */
  { id: 'e-070', name: '찜닭', calories: 560, protein: 40, carbs: 46, fat: 22, servingSize: '1인분 400g' },
  { id: 'e-071', name: '안동찜닭', calories: 580, protein: 40, carbs: 50, fat: 22, servingSize: '1인분 400g' },
  { id: 'e-072', name: '해물탕', calories: 460, protein: 34, carbs: 24, fat: 22, servingSize: '1인분 500g' },
  { id: 'e-073', name: '갈비찜', calories: 580, protein: 42, carbs: 28, fat: 34, servingSize: '1인분 380g' },
  { id: 'e-074', name: '보쌈', calories: 480, protein: 38, carbs: 8, fat: 32, servingSize: '1인분 250g' },
  { id: 'e-075', name: '족발 (앞다리)', calories: 420, protein: 36, carbs: 6, fat: 28, servingSize: '1인분 250g' },
  { id: 'e-076', name: '족발 (뒷다리)', calories: 450, protein: 38, carbs: 4, fat: 30, servingSize: '1인분 250g' },
  { id: 'e-077', name: '수육', calories: 360, protein: 32, carbs: 2, fat: 24, servingSize: '1인분 200g' },
  { id: 'e-078', name: '제육볶음', calories: 440, protein: 28, carbs: 16, fat: 28, servingSize: '1인분 250g' },
  { id: 'e-079', name: '잡채', calories: 320, protein: 10, carbs: 50, fat: 9, servingSize: '1인분 200g' },
  { id: 'e-080', name: '떡갈비', calories: 380, protein: 24, carbs: 22, fat: 22, servingSize: '1인분 200g' },
  { id: 'e-081', name: '해물파전', calories: 380, protein: 16, carbs: 42, fat: 16, servingSize: '1인분 250g' },
  { id: 'e-082', name: '김치전', calories: 360, protein: 10, carbs: 46, fat: 16, servingSize: '1인분 200g' },
  { id: 'e-083', name: '계란말이', calories: 200, protein: 12, carbs: 4, fat: 15, servingSize: '1인분 100g' },
  { id: 'e-084', name: '계란찜', calories: 120, protein: 10, carbs: 2, fat: 8, servingSize: '1인분 150g' },
  { id: 'e-085', name: '참치김치찌개', calories: 260, protein: 18, carbs: 14, fat: 14, servingSize: '1인분 350g' },
  { id: 'e-086', name: '불고기전골', calories: 460, protein: 30, carbs: 26, fat: 28, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 죽류 추가
   * ══════════════════════════════════════════ */
  { id: 'e-100', name: '전복죽', calories: 280, protein: 14, carbs: 46, fat: 5, servingSize: '1인분 400g' },
  { id: 'e-101', name: '닭죽', calories: 260, protein: 16, carbs: 42, fat: 4, servingSize: '1인분 400g' },
  { id: 'e-102', name: '야채죽', calories: 200, protein: 5, carbs: 40, fat: 2, servingSize: '1인분 400g' },
  { id: 'e-103', name: '버섯죽', calories: 220, protein: 6, carbs: 42, fat: 2.5, servingSize: '1인분 400g' },
  { id: 'e-104', name: '단팥죽', calories: 320, protein: 8, carbs: 66, fat: 2, servingSize: '1인분 350g' },
  { id: 'e-105', name: '호박죽', calories: 180, protein: 3, carbs: 40, fat: 1, servingSize: '1인분 350g' },
  { id: 'e-106', name: '새우죽', calories: 250, protein: 14, carbs: 40, fat: 4, servingSize: '1인분 400g' },
  { id: 'e-107', name: '소고기죽', calories: 270, protein: 16, carbs: 42, fat: 5, servingSize: '1인분 400g' },
  { id: 'e-108', name: '녹두죽', calories: 230, protein: 10, carbs: 44, fat: 2, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 덮밥 추가
   * ══════════════════════════════════════════ */
  { id: 'e-120', name: '제육덮밥', calories: 640, protein: 26, carbs: 88, fat: 20, servingSize: '1인분 460g' },
  { id: 'e-121', name: '오징어덮밥', calories: 580, protein: 24, carbs: 88, fat: 12, servingSize: '1인분 440g' },
  { id: 'e-122', name: '참치마요덮밥', calories: 600, protein: 22, carbs: 84, fat: 20, servingSize: '1인분 420g' },
  { id: 'e-123', name: '스팸마요덮밥', calories: 660, protein: 20, carbs: 86, fat: 26, servingSize: '1인분 430g' },
  { id: 'e-124', name: '카레덮밥', calories: 560, protein: 14, carbs: 92, fat: 14, servingSize: '1인분 450g' },
  { id: 'e-125', name: '스테이크덮밥', calories: 720, protein: 38, carbs: 80, fat: 28, servingSize: '1인분 450g' },
  { id: 'e-126', name: '두부김치덮밥', calories: 520, protein: 18, carbs: 76, fat: 16, servingSize: '1인분 400g' },

  /* ══════════════════════════════════════════
   * 치킨 브랜드 상세
   * ══════════════════════════════════════════ */
  { id: 'e-140', name: '교촌 허니오리지날 (반마리)', calories: 760, protein: 42, carbs: 38, fat: 48, servingSize: '반마리 450g' },
  { id: 'e-141', name: '교촌 레드 (반마리)', calories: 800, protein: 44, carbs: 36, fat: 52, servingSize: '반마리 450g' },
  { id: 'e-142', name: 'BBQ 황금올리브치킨 (반마리)', calories: 820, protein: 46, carbs: 32, fat: 54, servingSize: '반마리 480g' },
  { id: 'e-143', name: 'BHC 뿌링클 (반마리)', calories: 830, protein: 44, carbs: 42, fat: 50, servingSize: '반마리 480g' },
  { id: 'e-144', name: 'BHC 맛초킹 (반마리)', calories: 850, protein: 46, carbs: 40, fat: 54, servingSize: '반마리 490g' },
  { id: 'e-145', name: '굽네 고추바사삭 (반마리)', calories: 680, protein: 44, carbs: 24, fat: 46, servingSize: '반마리 420g' },
  { id: 'e-146', name: '치킨무 (소)', calories: 40, protein: 0.5, carbs: 9, fat: 0.1, servingSize: '100g' },
  { id: 'e-147', name: '치킨봉 (순살)', calories: 240, protein: 18, carbs: 14, fat: 12, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * 카페 추가 (브랜드별)
   * ══════════════════════════════════════════ */
  { id: 'e-160', name: '스타벅스 돌체라떼 (톨)', calories: 280, protein: 10, carbs: 38, fat: 10, servingSize: '355ml' },
  { id: 'e-161', name: '스타벅스 그린티라떼 (톨)', calories: 240, protein: 10, carbs: 36, fat: 6, servingSize: '355ml' },
  { id: 'e-162', name: '스타벅스 딸기라떼 (톨)', calories: 310, protein: 9, carbs: 46, fat: 9, servingSize: '355ml' },
  { id: 'e-163', name: '스타벅스 망고패션티 (그란데)', calories: 200, protein: 0, carbs: 50, fat: 0, servingSize: '473ml' },
  { id: 'e-164', name: '이디야 블루베리라떼', calories: 260, protein: 7, carbs: 40, fat: 7, servingSize: '355ml' },
  { id: 'e-165', name: '메가MGC 아이스아메리카노', calories: 10, protein: 0.5, carbs: 2, fat: 0, servingSize: '355ml' },
  { id: 'e-166', name: '빽다방 빽아이스아메리카노 (500ml)', calories: 15, protein: 0.5, carbs: 3, fat: 0, servingSize: '500ml' },
  { id: 'e-167', name: '컴포즈 달고나라떼', calories: 220, protein: 6, carbs: 34, fat: 6, servingSize: '355ml' },
  { id: 'e-168', name: '투썸 딸기생크림케이크 (1조각)', calories: 480, protein: 6, carbs: 58, fat: 24, servingSize: '1조각 120g' },
  { id: 'e-169', name: '폴바셋 아이스커피', calories: 20, protein: 1, carbs: 3, fat: 0.5, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * 편의점 아이스크림 / 디저트
   * ══════════════════════════════════════════ */
  { id: 'e-180', name: '빠삐코', calories: 90, protein: 1, carbs: 17, fat: 2.5, servingSize: '1개 55ml' },
  { id: 'e-181', name: '메로나', calories: 110, protein: 1, carbs: 22, fat: 2, servingSize: '1개 70ml' },
  { id: 'e-182', name: '월드콘', calories: 250, protein: 3, carbs: 34, fat: 12, servingSize: '1개 140ml' },
  { id: 'e-183', name: '하겐다즈 바닐라 (1컵)', calories: 280, protein: 4, carbs: 26, fat: 18, servingSize: '100ml' },
  { id: 'e-184', name: '베스킨라빈스 싱글컵', calories: 220, protein: 3.5, carbs: 28, fat: 11, servingSize: '1컵 113g' },
  { id: 'e-185', name: '설레임', calories: 120, protein: 1.5, carbs: 20, fat: 4, servingSize: '1개 130ml' },
  { id: 'e-186', name: '포켓몬빵', calories: 310, protein: 5, carbs: 50, fat: 10, servingSize: '1개 100g' },
  { id: 'e-187', name: '삼각김밥 (스팸)', calories: 230, protein: 7, carbs: 40, fat: 5, servingSize: '1개 105g' },
  { id: 'e-188', name: '편의점 핫바 (오리지널)', calories: 180, protein: 8, carbs: 20, fat: 8, servingSize: '1개 75g' },

  /* ══════════════════════════════════════════
   * 건강식 추가
   * ══════════════════════════════════════════ */
  { id: 'e-200', name: '현미밥+닭가슴살+야채', calories: 420, protein: 36, carbs: 52, fat: 8, servingSize: '1인분 300g' },
  { id: 'e-201', name: '고구마+닭가슴살', calories: 300, protein: 28, carbs: 38, fat: 3, servingSize: '1인분 250g' },
  { id: 'e-202', name: '단백질 도시락 (헬스)', calories: 480, protein: 42, carbs: 40, fat: 14, servingSize: '1개 380g' },
  { id: 'e-203', name: '곤약젤리', calories: 15, protein: 0, carbs: 3.5, fat: 0, servingSize: '1봉 130g' },
  { id: 'e-204', name: '저칼로리 요거트', calories: 60, protein: 5, carbs: 8, fat: 0.5, servingSize: '100g' },
  { id: 'e-205', name: '두부면 비빔국수', calories: 180, protein: 12, carbs: 24, fat: 4, servingSize: '1인분 250g' },
  { id: 'e-206', name: '닭가슴살 스테이크 (100g)', calories: 160, protein: 28, carbs: 2, fat: 5, servingSize: '100g' },
  { id: 'e-207', name: '아보카도 에그볼', calories: 240, protein: 10, carbs: 8, fat: 20, servingSize: '1인분 150g' },

  /* ══════════════════════════════════════════
   * 전 / 부침개 추가
   * ══════════════════════════════════════════ */
  { id: 'e-220', name: '고기전', calories: 280, protein: 16, carbs: 18, fat: 16, servingSize: '1인분 150g' },
  { id: 'e-221', name: '동태전', calories: 240, protein: 18, carbs: 16, fat: 10, servingSize: '1인분 150g' },
  { id: 'e-222', name: '두부전', calories: 200, protein: 12, carbs: 14, fat: 10, servingSize: '1인분 150g' },
  { id: 'e-223', name: '감자전', calories: 260, protein: 4, carbs: 36, fat: 12, servingSize: '1인분 180g' },
  { id: 'e-224', name: '녹두빈대떡', calories: 380, protein: 14, carbs: 44, fat: 17, servingSize: '1인분 200g' },

  /* ══════════════════════════════════════════
   * 음료 추가 (탄산/주스)
   * ══════════════════════════════════════════ */
  { id: 'e-240', name: '오렌지주스 (500ml)', calories: 220, protein: 3, carbs: 52, fat: 0.5, servingSize: '500ml' },
  { id: 'e-241', name: '토마토주스 (300ml)', calories: 60, protein: 2.7, carbs: 12, fat: 0.3, servingSize: '300ml' },
  { id: 'e-242', name: '딸기주스 (300ml)', calories: 140, protein: 1, carbs: 34, fat: 0.3, servingSize: '300ml' },
  { id: 'e-243', name: '수박주스 (300ml)', calories: 100, protein: 1, carbs: 24, fat: 0.2, servingSize: '300ml' },
  { id: 'e-244', name: '복숭아아이스티 (500ml)', calories: 130, protein: 0, carbs: 33, fat: 0, servingSize: '500ml' },
  { id: 'e-245', name: '레몬에이드 (300ml)', calories: 120, protein: 0.2, carbs: 30, fat: 0, servingSize: '300ml' },
  { id: 'e-246', name: '자두에이드 (300ml)', calories: 130, protein: 0.2, carbs: 32, fat: 0, servingSize: '300ml' },
  { id: 'e-247', name: '패션후르츠에이드 (300ml)', calories: 140, protein: 0.3, carbs: 34, fat: 0, servingSize: '300ml' },

  /* ══════════════════════════════════════════
   * g-001~060: 빵 / 베이커리 브랜드 상세
   * ══════════════════════════════════════════ */
  { id: 'g-001', name: '파리바게트 소보로빵', calories: 310, protein: 6, carbs: 48, fat: 11, servingSize: '1개 90g' },
  { id: 'g-002', name: '파리바게트 크림치즈빵', calories: 340, protein: 7, carbs: 46, fat: 14, servingSize: '1개 95g' },
  { id: 'g-003', name: '파리바게트 단팥크림빵', calories: 320, protein: 6.5, carbs: 52, fat: 10, servingSize: '1개 90g' },
  { id: 'g-004', name: '파리바게트 치아바타샌드위치', calories: 460, protein: 18, carbs: 52, fat: 20, servingSize: '1개 200g' },
  { id: 'g-005', name: '파리바게트 크루아상', calories: 290, protein: 5.5, carbs: 32, fat: 16, servingSize: '1개 65g' },
  { id: 'g-006', name: '파리바게트 휘낭시에', calories: 200, protein: 4, carbs: 26, fat: 10, servingSize: '1개 45g' },
  { id: 'g-007', name: '파리바게트 마카롱 (2개)', calories: 160, protein: 2.5, carbs: 24, fat: 6.5, servingSize: '2개 40g' },
  { id: 'g-008', name: '파리바게트 딸기케이크 (1조각)', calories: 420, protein: 5, carbs: 54, fat: 20, servingSize: '1조각 110g' },
  { id: 'g-009', name: '뚜레쥬르 야채빵', calories: 280, protein: 7, carbs: 40, fat: 10, servingSize: '1개 90g' },
  { id: 'g-010', name: '뚜레쥬르 치즈케이크 (1조각)', calories: 450, protein: 7, carbs: 48, fat: 26, servingSize: '1조각 120g' },
  { id: 'g-011', name: '뚜레쥬르 생크림빵', calories: 340, protein: 5.5, carbs: 44, fat: 16, servingSize: '1개 95g' },
  { id: 'g-012', name: '뚜레쥬르 바게트', calories: 270, protein: 9, carbs: 54, fat: 2, servingSize: '1/3개 100g' },
  { id: 'g-013', name: '성심당 튀김소시지빵', calories: 380, protein: 10, carbs: 46, fat: 18, servingSize: '1개 120g' },
  { id: 'g-014', name: '마카롱 (1개)', calories: 80, protein: 1.5, carbs: 12, fat: 3.5, servingSize: '1개 20g' },
  { id: 'g-015', name: '에그타르트 (포르투갈식)', calories: 280, protein: 6, carbs: 30, fat: 15, servingSize: '1개 80g' },
  { id: 'g-016', name: '티라미수 (1조각)', calories: 380, protein: 7, carbs: 38, fat: 22, servingSize: '1조각 120g' },
  { id: 'g-017', name: '뉴욕치즈케이크 (1조각)', calories: 480, protein: 8, carbs: 42, fat: 32, servingSize: '1조각 130g' },
  { id: 'g-018', name: '가나슈케이크 (1조각)', calories: 500, protein: 6, carbs: 52, fat: 30, servingSize: '1조각 120g' },
  { id: 'g-019', name: '레몬케이크 (1조각)', calories: 380, protein: 5, carbs: 50, fat: 18, servingSize: '1조각 110g' },
  { id: 'g-020', name: '당근케이크 (1조각)', calories: 420, protein: 5, carbs: 54, fat: 20, servingSize: '1조각 120g' },
  { id: 'g-021', name: '파운드케이크 (1조각)', calories: 360, protein: 5, carbs: 46, fat: 18, servingSize: '1조각 100g' },
  { id: 'g-022', name: '브라우니 (1조각)', calories: 340, protein: 4.5, carbs: 44, fat: 17, servingSize: '1조각 80g' },
  { id: 'g-023', name: '쿠키 (버터)', calories: 480, protein: 6, carbs: 64, fat: 22, servingSize: '100g' },
  { id: 'g-024', name: '쿠키 (초코칩)', calories: 500, protein: 5.5, carbs: 66, fat: 24, servingSize: '100g' },
  { id: 'g-025', name: '머핀 (블루베리)', calories: 320, protein: 5, carbs: 48, fat: 13, servingSize: '1개 100g' },
  { id: 'g-026', name: '머핀 (초코)', calories: 350, protein: 5, carbs: 50, fat: 15, servingSize: '1개 100g' },
  { id: 'g-027', name: '타르트 (과일)', calories: 340, protein: 5, carbs: 46, fat: 15, servingSize: '1개 100g' },
  { id: 'g-028', name: '바움쿠헨', calories: 400, protein: 7, carbs: 54, fat: 18, servingSize: '100g' },
  { id: 'g-029', name: '도라야키', calories: 260, protein: 5.5, carbs: 48, fat: 5, servingSize: '1개 80g' },
  { id: 'g-030', name: '갈레트 브르통', calories: 540, protein: 6, carbs: 60, fat: 30, servingSize: '100g' },

  /* ══════════════════════════════════════════
   * g-031~090: 유제품 상세
   * ══════════════════════════════════════════ */
  { id: 'g-031', name: '우유 (전지, 200ml)', calories: 130, protein: 6.6, carbs: 9.6, fat: 7.4, servingSize: '200ml' },
  { id: 'g-032', name: '우유 (저지방, 200ml)', calories: 100, protein: 6.8, carbs: 10.4, fat: 3, servingSize: '200ml' },
  { id: 'g-033', name: '우유 (무지방, 200ml)', calories: 70, protein: 6.8, carbs: 10.4, fat: 0.3, servingSize: '200ml' },
  { id: 'g-034', name: '딸기우유 (200ml)', calories: 140, protein: 5, carbs: 22, fat: 4, servingSize: '200ml' },
  { id: 'g-035', name: '초코우유 (200ml)', calories: 150, protein: 5.5, carbs: 23, fat: 4.5, servingSize: '200ml' },
  { id: 'g-036', name: '바나나우유 (240ml)', calories: 160, protein: 5.5, carbs: 28, fat: 3.5, servingSize: '240ml' },
  { id: 'g-037', name: '요구르트 (액상, 65ml)', calories: 50, protein: 1, carbs: 11, fat: 0.2, servingSize: '65ml' },
  { id: 'g-038', name: '호상요거트 (80g)', calories: 70, protein: 3.5, carbs: 10, fat: 1.5, servingSize: '80g' },
  { id: 'g-039', name: '그릭요거트 플레인 (200g)', calories: 130, protein: 13, carbs: 9, fat: 4, servingSize: '200g' },
  { id: 'g-040', name: '케피어 (200ml)', calories: 120, protein: 7, carbs: 10, fat: 5, servingSize: '200ml' },
  { id: 'g-041', name: '체다치즈 (1장 20g)', calories: 80, protein: 5, carbs: 0.5, fat: 6.5, servingSize: '1장 20g' },
  { id: 'g-042', name: '모짜렐라치즈 (100g)', calories: 280, protein: 20, carbs: 2, fat: 22, servingSize: '100g' },
  { id: 'g-043', name: '파마산치즈 (10g)', calories: 40, protein: 3.5, carbs: 0.4, fat: 2.8, servingSize: '10g' },
  { id: 'g-044', name: '크림치즈 (30g)', calories: 105, protein: 2, carbs: 1.2, fat: 10, servingSize: '30g' },
  { id: 'g-045', name: '코티지치즈 (100g)', calories: 100, protein: 12, carbs: 3, fat: 4.5, servingSize: '100g' },
  { id: 'g-046', name: '리코타치즈 (100g)', calories: 170, protein: 11, carbs: 3, fat: 13, servingSize: '100g' },
  { id: 'g-047', name: '버터 (10g)', calories: 74, protein: 0.1, carbs: 0, fat: 8.2, servingSize: '10g' },
  { id: 'g-048', name: '생크림 (100ml)', calories: 320, protein: 2.5, carbs: 3, fat: 34, servingSize: '100ml' },
  { id: 'g-049', name: '아이스크림 (홈런볼형, 100g)', calories: 180, protein: 3.5, carbs: 22, fat: 9, servingSize: '100g' },
  { id: 'g-050', name: '사워크림 (30g)', calories: 62, protein: 0.7, carbs: 1.5, fat: 6, servingSize: '30g' },
  { id: 'g-051', name: '카망베르치즈 (30g)', calories: 90, protein: 5.5, carbs: 0.2, fat: 7.5, servingSize: '30g' },
  { id: 'g-052', name: '브리치즈 (30g)', calories: 95, protein: 5.5, carbs: 0.1, fat: 8, servingSize: '30g' },
  { id: 'g-053', name: '고다치즈 (30g)', calories: 110, protein: 7.5, carbs: 0.5, fat: 8.5, servingSize: '30g' },
  { id: 'g-054', name: '치즈 퐁듀 (1인분)', calories: 520, protein: 28, carbs: 14, fat: 38, servingSize: '1인분 200g' },
  { id: 'g-055', name: '마스카포네 (50g)', calories: 170, protein: 2, carbs: 1.5, fat: 18, servingSize: '50g' },

  /* ══════════════════════════════════════════
   * g-056~110: 가공육 / 햄 / 소시지
   * ══════════════════════════════════════════ */
  { id: 'g-056', name: '스팸 (200g)', calories: 540, protein: 26, carbs: 8, fat: 46, servingSize: '200g' },
  { id: 'g-057', name: '스팸 라이트 (200g)', calories: 360, protein: 26, carbs: 8, fat: 26, servingSize: '200g' },
  { id: 'g-058', name: '베이컨 (30g 2장)', calories: 150, protein: 8, carbs: 0.5, fat: 13, servingSize: '2장 30g' },
  { id: 'g-059', name: '터키햄 (50g)', calories: 70, protein: 10, carbs: 2, fat: 2.5, servingSize: '50g' },
  { id: 'g-060', name: '소시지 (프랑크, 50g)', calories: 160, protein: 7, carbs: 3, fat: 14, servingSize: '50g' },
  { id: 'g-061', name: '비엔나소시지 (30g 3개)', calories: 120, protein: 5, carbs: 2, fat: 10, servingSize: '3개 30g' },
  { id: 'g-062', name: '핫도그 소시지 (80g)', calories: 220, protein: 9, carbs: 5, fat: 19, servingSize: '1개 80g' },
  { id: 'g-063', name: '살라미 (30g)', calories: 120, protein: 7, carbs: 1, fat: 10, servingSize: '30g' },
  { id: 'g-064', name: '프로슈토 (30g)', calories: 90, protein: 9, carbs: 0.5, fat: 6, servingSize: '30g' },
  { id: 'g-065', name: '페퍼로니 (30g)', calories: 140, protein: 7, carbs: 1, fat: 12, servingSize: '30g' },
  { id: 'g-066', name: '닭가슴살 소시지 (60g)', calories: 80, protein: 10, carbs: 4, fat: 2.5, servingSize: '1개 60g' },
  { id: 'g-067', name: '오리 훈제 (100g)', calories: 220, protein: 22, carbs: 2, fat: 14, servingSize: '100g' },
  { id: 'g-068', name: '훈제연어 (100g)', calories: 180, protein: 22, carbs: 0, fat: 10, servingSize: '100g' },
  { id: 'g-069', name: '통조림 참치 (100g)', calories: 130, protein: 28, carbs: 0, fat: 1.5, servingSize: '100g' },
  { id: 'g-070', name: '통조림 꽁치 (100g)', calories: 180, protein: 20, carbs: 4, fat: 9, servingSize: '100g' },
  { id: 'g-071', name: '통조림 고등어 (100g)', calories: 200, protein: 20, carbs: 2, fat: 13, servingSize: '100g' },
  { id: 'g-072', name: '통조림 골뱅이 (100g)', calories: 70, protein: 14, carbs: 2, fat: 0.5, servingSize: '100g' },
  { id: 'g-073', name: '어묵 (판, 100g)', calories: 100, protein: 9, carbs: 11, fat: 2.5, servingSize: '100g' },
  { id: 'g-074', name: '맛살 (100g)', calories: 100, protein: 10, carbs: 12, fat: 1.5, servingSize: '100g' },
  { id: 'g-075', name: '오징어채 (20g)', calories: 60, protein: 12, carbs: 2.5, fat: 0.5, servingSize: '20g' },

  /* ══════════════════════════════════════════
   * g-076~130: 수산물 상세
   * ══════════════════════════════════════════ */
  { id: 'g-076', name: '생굴 (100g)', calories: 70, protein: 9, carbs: 5, fat: 2, servingSize: '100g' },
  { id: 'g-077', name: '전복구이 (1개)', calories: 90, protein: 14, carbs: 5, fat: 1.5, servingSize: '1개 80g' },
  { id: 'g-078', name: '바지락조개 (100g)', calories: 75, protein: 12, carbs: 4, fat: 1, servingSize: '100g' },
  { id: 'g-079', name: '홍합찜 (100g)', calories: 85, protein: 12, carbs: 5, fat: 2, servingSize: '100g' },
  { id: 'g-080', name: '꽃게찜 (1마리)', calories: 200, protein: 26, carbs: 4, fat: 5, servingSize: '1마리 300g' },
  { id: 'g-081', name: '대게 (1마리)', calories: 180, protein: 28, carbs: 2, fat: 2.5, servingSize: '1마리 500g' },
  { id: 'g-082', name: '킹크랩 (1인분)', calories: 240, protein: 34, carbs: 4, fat: 4, servingSize: '1인분 400g' },
  { id: 'g-083', name: '새우 (중하, 100g)', calories: 90, protein: 20, carbs: 1, fat: 0.8, servingSize: '100g' },
  { id: 'g-084', name: '대하구이 (5마리)', calories: 180, protein: 28, carbs: 2, fat: 4, servingSize: '5마리 200g' },
  { id: 'g-085', name: '랍스터 (1마리)', calories: 280, protein: 42, carbs: 4, fat: 5, servingSize: '1마리 600g' },
  { id: 'g-086', name: '문어숙회 (100g)', calories: 95, protein: 18, carbs: 2, fat: 1.5, servingSize: '100g' },
  { id: 'g-087', name: '낙지볶음 (1인분)', calories: 220, protein: 24, carbs: 14, fat: 8, servingSize: '1인분 200g' },
  { id: 'g-088', name: '산낙지 (1인분)', calories: 100, protein: 18, carbs: 3, fat: 1.5, servingSize: '1인분 150g' },
  { id: 'g-089', name: '병어조림', calories: 220, protein: 22, carbs: 10, fat: 10, servingSize: '1인분 200g' },
  { id: 'g-090', name: '도미회 (100g)', calories: 110, protein: 22, carbs: 0, fat: 2, servingSize: '100g' },
  { id: 'g-091', name: '광어회 (100g)', calories: 100, protein: 21, carbs: 0, fat: 1.5, servingSize: '100g' },
  { id: 'g-092', name: '연어회 (100g)', calories: 180, protein: 20, carbs: 0, fat: 11, servingSize: '100g' },
  { id: 'g-093', name: '방어회 (100g)', calories: 200, protein: 22, carbs: 0, fat: 12, servingSize: '100g' },
  { id: 'g-094', name: '굴구이 (100g)', calories: 80, protein: 10, carbs: 6, fat: 2, servingSize: '100g' },
  { id: 'g-095', name: '가리비구이 (3개)', calories: 90, protein: 12, carbs: 4, fat: 1.5, servingSize: '3개 120g' },

  /* ══════════════════════════════════════════
   * g-096~155: 한식 가정식 추가
   * ══════════════════════════════════════════ */
  { id: 'g-096', name: '김치찜', calories: 320, protein: 18, carbs: 16, fat: 20, servingSize: '1인분 300g' },
  { id: 'g-097', name: '부대찌개 (라면 추가)', calories: 580, protein: 24, carbs: 60, fat: 26, servingSize: '1인분 600g' },
  { id: 'g-098', name: '된장국 (콩나물)', calories: 70, protein: 4, carbs: 7, fat: 2.5, servingSize: '1인분 300g' },
  { id: 'g-099', name: '시래기국', calories: 80, protein: 5, carbs: 8, fat: 2.5, servingSize: '1인분 300g' },
  { id: 'g-100', name: '선지국', calories: 100, protein: 10, carbs: 6, fat: 4, servingSize: '1인분 300g' },
  { id: 'g-101', name: '어묵국', calories: 110, protein: 8, carbs: 10, fat: 3.5, servingSize: '1인분 350g' },
  { id: 'g-102', name: '두부된장찌개', calories: 140, protein: 10, carbs: 12, fat: 6, servingSize: '1인분 350g' },
  { id: 'g-103', name: '참치찌개', calories: 210, protein: 18, carbs: 10, fat: 10, servingSize: '1인분 350g' },
  { id: 'g-104', name: '고등어김치찌개', calories: 280, protein: 20, carbs: 12, fat: 16, servingSize: '1인분 350g' },
  { id: 'g-105', name: '달걀국', calories: 80, protein: 6, carbs: 4, fat: 4, servingSize: '1인분 300g' },
  { id: 'g-106', name: '냉이된장국', calories: 65, protein: 4, carbs: 7, fat: 2, servingSize: '1인분 300g' },
  { id: 'g-107', name: '북어채볶음', calories: 180, protein: 24, carbs: 6, fat: 7, servingSize: '100g' },
  { id: 'g-108', name: '진미채볶음', calories: 200, protein: 26, carbs: 8, fat: 7, servingSize: '100g' },
  { id: 'g-109', name: '소고기무국', calories: 140, protein: 12, carbs: 10, fat: 6, servingSize: '1인분 350g' },
  { id: 'g-110', name: '닭볶음탕 (순한)', calories: 380, protein: 32, carbs: 22, fat: 18, servingSize: '1인분 300g' },
  { id: 'g-111', name: '오리훈제볶음', calories: 420, protein: 26, carbs: 14, fat: 30, servingSize: '1인분 250g' },
  { id: 'g-112', name: '간장게장 (1인분)', calories: 140, protein: 14, carbs: 6, fat: 6, servingSize: '1인분 200g' },
  { id: 'g-113', name: '양념게장 (1인분)', calories: 160, protein: 14, carbs: 10, fat: 6, servingSize: '1인분 200g' },
  { id: 'g-114', name: '전어구이 (100g)', calories: 170, protein: 18, carbs: 0, fat: 10, servingSize: '100g' },
  { id: 'g-115', name: '고등어구이 (1토막)', calories: 200, protein: 22, carbs: 0, fat: 13, servingSize: '1토막 150g' },
  { id: 'g-116', name: '삼치구이 (1토막)', calories: 190, protein: 24, carbs: 0, fat: 10, servingSize: '1토막 150g' },
  { id: 'g-117', name: '임연수구이 (1토막)', calories: 175, protein: 23, carbs: 0, fat: 9, servingSize: '1토막 150g' },
  { id: 'g-118', name: '굴비 (1마리)', calories: 150, protein: 20, carbs: 2, fat: 7, servingSize: '1마리 100g' },
  { id: 'g-119', name: '건대구포 (20g)', calories: 60, protein: 13, carbs: 0, fat: 0.5, servingSize: '20g' },
  { id: 'g-120', name: '명란젓 (30g)', calories: 70, protein: 8, carbs: 2, fat: 3, servingSize: '30g' },
  { id: 'g-121', name: '오이소박이무침', calories: 25, protein: 1.2, carbs: 3.5, fat: 0.4, servingSize: '100g' },
  { id: 'g-122', name: '쌈채소 (100g)', calories: 25, protein: 2, carbs: 3.5, fat: 0.5, servingSize: '100g' },
  { id: 'g-123', name: '된장 (10g)', calories: 20, protein: 1.5, carbs: 2.5, fat: 0.5, servingSize: '10g' },
  { id: 'g-124', name: '고추장 (10g)', calories: 30, protein: 1, carbs: 5.5, fat: 0.5, servingSize: '10g' },
  { id: 'g-125', name: '간장 (10ml)', calories: 6, protein: 1, carbs: 0.8, fat: 0, servingSize: '10ml' },

  /* ══════════════════════════════════════════
   * g-126~185: 세계 음식 추가
   * ══════════════════════════════════════════ */
  { id: 'g-126', name: '케밥 (터키식)', calories: 560, protein: 30, carbs: 50, fat: 26, servingSize: '1인분 300g' },
  { id: 'g-127', name: '샤와르마', calories: 580, protein: 28, carbs: 52, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-128', name: '팔라펠 (5개)', calories: 340, protein: 14, carbs: 40, fat: 16, servingSize: '5개 150g' },
  { id: 'g-129', name: '후무스 (100g)', calories: 160, protein: 7, carbs: 16, fat: 8, servingSize: '100g' },
  { id: 'g-130', name: '타불레 (100g)', calories: 110, protein: 3, carbs: 14, fat: 5, servingSize: '100g' },
  { id: 'g-131', name: '파에야 (해물)', calories: 520, protein: 28, carbs: 72, fat: 14, servingSize: '1인분 400g' },
  { id: 'g-132', name: '타파스 모둠', calories: 480, protein: 20, carbs: 32, fat: 30, servingSize: '1인분 250g' },
  { id: 'g-133', name: '가스파초', calories: 80, protein: 2, carbs: 12, fat: 3, servingSize: '1컵 250ml' },
  { id: 'g-134', name: '감바스 알 아히요', calories: 420, protein: 22, carbs: 8, fat: 34, servingSize: '1인분 200g' },
  { id: 'g-135', name: '무사카', calories: 480, protein: 22, carbs: 28, fat: 32, servingSize: '1인분 300g' },
  { id: 'g-136', name: '수블라키', calories: 380, protein: 28, carbs: 14, fat: 24, servingSize: '1인분 250g' },
  { id: 'g-137', name: '미국식 BBQ립 (200g)', calories: 680, protein: 44, carbs: 20, fat: 46, servingSize: '200g' },
  { id: 'g-138', name: '버팔로윙 (6개)', calories: 520, protein: 32, carbs: 16, fat: 36, servingSize: '6개 240g' },
  { id: 'g-139', name: '맥앤치즈', calories: 540, protein: 18, carbs: 68, fat: 22, servingSize: '1인분 300g' },
  { id: 'g-140', name: '클럽샌드위치', calories: 560, protein: 28, carbs: 52, fat: 26, servingSize: '1인분 300g' },
  { id: 'g-141', name: 'BLT샌드위치', calories: 480, protein: 22, carbs: 48, fat: 24, servingSize: '1인분 280g' },
  { id: 'g-142', name: '피시앤칩스', calories: 680, protein: 28, carbs: 72, fat: 32, servingSize: '1인분 400g' },
  { id: 'g-143', name: '스카치에그 (2개)', calories: 560, protein: 28, carbs: 24, fat: 40, servingSize: '2개 220g' },
  { id: 'g-144', name: '잉글리시브렉퍼스트', calories: 820, protein: 38, carbs: 48, fat: 50, servingSize: '1인분 500g' },
  { id: 'g-145', name: '솔트비프 (200g)', calories: 360, protein: 40, carbs: 4, fat: 20, servingSize: '200g' },
  { id: 'g-146', name: '타코스 미트 (100g)', calories: 260, protein: 18, carbs: 12, fat: 16, servingSize: '100g' },
  { id: 'g-147', name: '엔칠라다 (1개)', calories: 420, protein: 20, carbs: 44, fat: 20, servingSize: '1개 250g' },
  { id: 'g-148', name: '촙스이 (미국식)', calories: 380, protein: 22, carbs: 30, fat: 18, servingSize: '1인분 300g' },
  { id: 'g-149', name: '우동 (일본 가정식)', calories: 360, protein: 12, carbs: 66, fat: 5, servingSize: '1인분 400g' },
  { id: 'g-150', name: '포크 카레 (인도식)', calories: 520, protein: 28, carbs: 32, fat: 30, servingSize: '1인분 350g' },
  { id: 'g-151', name: '탄두리치킨 (1인분)', calories: 380, protein: 40, carbs: 8, fat: 22, servingSize: '1인분 250g' },
  { id: 'g-152', name: '치킨 마크니', calories: 440, protein: 28, carbs: 20, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-153', name: '달 마크니 (렌틸커리)', calories: 320, protein: 14, carbs: 36, fat: 14, servingSize: '1인분 300g' },
  { id: 'g-154', name: '사모사 (2개)', calories: 280, protein: 7, carbs: 34, fat: 14, servingSize: '2개 120g' },
  { id: 'g-155', name: '차파티 (2장)', calories: 200, protein: 6, carbs: 38, fat: 3, servingSize: '2장 100g' },

  /* ══════════════════════════════════════════
   * g-156~210: 전통음료 / 버블티 / 건강음료
   * ══════════════════════════════════════════ */
  { id: 'g-156', name: '식혜 (200ml)', calories: 120, protein: 0.5, carbs: 29, fat: 0, servingSize: '200ml' },
  { id: 'g-157', name: '수정과 (200ml)', calories: 100, protein: 0.3, carbs: 25, fat: 0, servingSize: '200ml' },
  { id: 'g-158', name: '매실청 (30ml+물)', calories: 60, protein: 0, carbs: 15, fat: 0, servingSize: '300ml' },
  { id: 'g-159', name: '유자차 (300ml)', calories: 80, protein: 0.2, carbs: 20, fat: 0, servingSize: '300ml' },
  { id: 'g-160', name: '생강차 (300ml)', calories: 60, protein: 0.3, carbs: 15, fat: 0, servingSize: '300ml' },
  { id: 'g-161', name: '대추차 (300ml)', calories: 90, protein: 0.3, carbs: 22, fat: 0, servingSize: '300ml' },
  { id: 'g-162', name: '쌍화차 (300ml)', calories: 80, protein: 0.5, carbs: 19, fat: 0.5, servingSize: '300ml' },
  { id: 'g-163', name: '오미자차 (300ml)', calories: 70, protein: 0.2, carbs: 17, fat: 0, servingSize: '300ml' },
  { id: 'g-164', name: '보리차 (300ml)', calories: 5, protein: 0.1, carbs: 1, fat: 0, servingSize: '300ml' },
  { id: 'g-165', name: '옥수수수염차 (300ml)', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '300ml' },
  { id: 'g-166', name: '버블티 타로 (500ml)', calories: 380, protein: 4, carbs: 66, fat: 10, servingSize: '500ml' },
  { id: 'g-167', name: '버블티 밀크티 (500ml)', calories: 360, protein: 4.5, carbs: 62, fat: 10, servingSize: '500ml' },
  { id: 'g-168', name: '버블티 딸기 (500ml)', calories: 340, protein: 3, carbs: 64, fat: 8, servingSize: '500ml' },
  { id: 'g-169', name: '버블티 흑당 (500ml)', calories: 420, protein: 5, carbs: 76, fat: 10, servingSize: '500ml' },
  { id: 'g-170', name: '버블티 말차 (500ml)', calories: 350, protein: 5, carbs: 62, fat: 9, servingSize: '500ml' },
  { id: 'g-171', name: '타피오카펄 (30g)', calories: 100, protein: 0, carbs: 25, fat: 0, servingSize: '30g' },
  { id: 'g-172', name: '콤부차 (330ml)', calories: 40, protein: 0.5, carbs: 9, fat: 0, servingSize: '330ml' },
  { id: 'g-173', name: '아몬드라떼 (300ml)', calories: 100, protein: 2, carbs: 12, fat: 5, servingSize: '300ml' },
  { id: 'g-174', name: '오트라떼 (300ml)', calories: 140, protein: 4, carbs: 20, fat: 5, servingSize: '300ml' },
  { id: 'g-175', name: '코코넛라떼 (300ml)', calories: 180, protein: 2.5, carbs: 22, fat: 9, servingSize: '300ml' },
  { id: 'g-176', name: '차이티라떼 (300ml)', calories: 200, protein: 5, carbs: 32, fat: 6, servingSize: '300ml' },
  { id: 'g-177', name: '런던포그라떼 (300ml)', calories: 180, protein: 5, carbs: 26, fat: 6, servingSize: '300ml' },
  { id: 'g-178', name: '말차라떼 (300ml)', calories: 190, protein: 6, carbs: 28, fat: 6, servingSize: '300ml' },
  { id: 'g-179', name: '흑당밀크티 (300ml)', calories: 280, protein: 4, carbs: 46, fat: 8, servingSize: '300ml' },
  { id: 'g-180', name: '히비스커스티 (300ml)', calories: 20, protein: 0, carbs: 5, fat: 0, servingSize: '300ml' },

  /* ══════════════════════════════════════════
   * g-181~230: 디저트 / 한과 / 떡
   * ══════════════════════════════════════════ */
  { id: 'g-181', name: '약과', calories: 340, protein: 4, carbs: 62, fat: 9, servingSize: '100g' },
  { id: 'g-182', name: '강정 (쌀)', calories: 380, protein: 4, carbs: 82, fat: 5, servingSize: '100g' },
  { id: 'g-183', name: '한과 (유과)', calories: 460, protein: 4, carbs: 70, fat: 18, servingSize: '100g' },
  { id: 'g-184', name: '식혜떡 (가래떡)', calories: 220, protein: 4, carbs: 48, fat: 0.5, servingSize: '100g' },
  { id: 'g-185', name: '인절미', calories: 230, protein: 4.5, carbs: 48, fat: 1.5, servingSize: '100g' },
  { id: 'g-186', name: '떡볶이떡 (100g)', calories: 200, protein: 3, carbs: 44, fat: 0.5, servingSize: '100g' },
  { id: 'g-187', name: '송편', calories: 170, protein: 3, carbs: 36, fat: 1.5, servingSize: '3개 90g' },
  { id: 'g-188', name: '찹쌀도넛', calories: 300, protein: 4, carbs: 50, fat: 10, servingSize: '1개 80g' },
  { id: 'g-189', name: '수수팥떡', calories: 240, protein: 5, carbs: 50, fat: 1.5, servingSize: '100g' },
  { id: 'g-190', name: '팥빙수 (소)', calories: 420, protein: 6, carbs: 88, fat: 4, servingSize: '1인분 350g' },
  { id: 'g-191', name: '망고빙수', calories: 480, protein: 5, carbs: 98, fat: 6, servingSize: '1인분 400g' },
  { id: 'g-192', name: '크레이프케이크 (1조각)', calories: 460, protein: 7, carbs: 54, fat: 24, servingSize: '1조각 120g' },
  { id: 'g-193', name: '몽블랑 (1개)', calories: 420, protein: 5, carbs: 52, fat: 22, servingSize: '1개 100g' },
  { id: 'g-194', name: '에클레어 (1개)', calories: 350, protein: 7, carbs: 38, fat: 18, servingSize: '1개 100g' },
  { id: 'g-195', name: '파리브레스트 (1개)', calories: 480, protein: 8, carbs: 42, fat: 32, servingSize: '1개 120g' },
  { id: 'g-196', name: '오페라케이크 (1조각)', calories: 490, protein: 6.5, carbs: 52, fat: 28, servingSize: '1조각 110g' },
  { id: 'g-197', name: '밀푀유 (1조각)', calories: 440, protein: 5, carbs: 46, fat: 26, servingSize: '1조각 100g' },
  { id: 'g-198', name: '크림브륄레 (1개)', calories: 380, protein: 6, carbs: 36, fat: 24, servingSize: '1개 150g' },
  { id: 'g-199', name: '푸딩 (캐러멜)', calories: 200, protein: 5, carbs: 28, fat: 8, servingSize: '1개 120g' },
  { id: 'g-200', name: '판나코타 (1개)', calories: 280, protein: 4, carbs: 28, fat: 17, servingSize: '1개 150g' },

  /* ══════════════════════════════════════════
   * g-201~250: 과일/채소 더
   * ══════════════════════════════════════════ */
  { id: 'g-201', name: '두리안 (100g)', calories: 150, protein: 1.5, carbs: 27, fat: 5, servingSize: '100g' },
  { id: 'g-202', name: '구아바 (100g)', calories: 68, protein: 2.5, carbs: 14, fat: 1, servingSize: '100g' },
  { id: 'g-203', name: '파파야 (100g)', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, servingSize: '100g' },
  { id: 'g-204', name: '망고스틴 (100g)', calories: 73, protein: 0.5, carbs: 18, fat: 0.6, servingSize: '100g' },
  { id: 'g-205', name: '자두 (100g)', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, servingSize: '100g' },
  { id: 'g-206', name: '모과 (100g)', calories: 26, protein: 0.4, carbs: 6.5, fat: 0.1, servingSize: '100g' },
  { id: 'g-207', name: '대추 (건, 10개)', calories: 80, protein: 1, carbs: 20, fat: 0.2, servingSize: '10개 30g' },
  { id: 'g-208', name: '호두 (30g)', calories: 200, protein: 4.5, carbs: 4, fat: 20, servingSize: '30g' },
  { id: 'g-209', name: '피칸 (30g)', calories: 210, protein: 2.5, carbs: 4, fat: 22, servingSize: '30g' },
  { id: 'g-210', name: '잣 (30g)', calories: 210, protein: 4.5, carbs: 4.5, fat: 21, servingSize: '30g' },
  { id: 'g-211', name: '해바라기씨 (30g)', calories: 170, protein: 6, carbs: 6, fat: 14, servingSize: '30g' },
  { id: 'g-212', name: '호박씨 (30g)', calories: 160, protein: 8, carbs: 5, fat: 13, servingSize: '30g' },
  { id: 'g-213', name: '치아씨드 (15g)', calories: 75, protein: 2.5, carbs: 6.5, fat: 4.5, servingSize: '15g' },
  { id: 'g-214', name: '아마씨 (15g)', calories: 80, protein: 2.5, carbs: 4, fat: 6, servingSize: '15g' },
  { id: 'g-215', name: '건무화과 (30g)', calories: 75, protein: 1, carbs: 18, fat: 0.3, servingSize: '30g' },
  { id: 'g-216', name: '건망고 (30g)', calories: 100, protein: 0.5, carbs: 25, fat: 0.1, servingSize: '30g' },
  { id: 'g-217', name: '건블루베리 (30g)', calories: 90, protein: 0.5, carbs: 22, fat: 0.5, servingSize: '30g' },
  { id: 'g-218', name: '건크랜베리 (30g)', calories: 100, protein: 0, carbs: 25, fat: 0.1, servingSize: '30g' },
  { id: 'g-219', name: '건자두 (3개)', calories: 60, protein: 0.6, carbs: 15, fat: 0.1, servingSize: '3개 30g' },
  { id: 'g-220', name: '아로니아 (100g)', calories: 50, protein: 1.5, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'g-221', name: '고수 (10g)', calories: 2, protein: 0.2, carbs: 0.4, fat: 0, servingSize: '10g' },
  { id: 'g-222', name: '바질잎 (10g)', calories: 3, protein: 0.4, carbs: 0.5, fat: 0.1, servingSize: '10g' },
  { id: 'g-223', name: '루꼴라 (50g)', calories: 12, protein: 1.3, carbs: 1.8, fat: 0.3, servingSize: '50g' },
  { id: 'g-224', name: '비트 (100g)', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, servingSize: '100g' },
  { id: 'g-225', name: '래디시 (100g)', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, servingSize: '100g' },
  { id: 'g-226', name: '아스파라거스 (5대)', calories: 20, protein: 2.2, carbs: 3.7, fat: 0.1, servingSize: '5대 80g' },
  { id: 'g-227', name: '브뤼셀 새싹양배추 (100g)', calories: 43, protein: 3.4, carbs: 9, fat: 0.3, servingSize: '100g' },
  { id: 'g-228', name: '케일 (50g)', calories: 18, protein: 1.5, carbs: 3, fat: 0.4, servingSize: '50g' },
  { id: 'g-229', name: '엔다이브 (50g)', calories: 8, protein: 0.6, carbs: 1.5, fat: 0.1, servingSize: '50g' },
  { id: 'g-230', name: '아티초크 (1개)', calories: 60, protein: 4, carbs: 13, fat: 0.2, servingSize: '1개 120g' },

  /* ══════════════════════════════════════════
   * g-231~280: 가정 요리 / 반찬 추가
   * ══════════════════════════════════════════ */
  { id: 'g-231', name: '두부 (100g)', calories: 76, protein: 8, carbs: 1.5, fat: 4, servingSize: '100g' },
  { id: 'g-232', name: '연두부 (100g)', calories: 50, protein: 5.5, carbs: 1, fat: 2.5, servingSize: '100g' },
  { id: 'g-233', name: '순두부 (100g)', calories: 40, protein: 4.5, carbs: 0.8, fat: 2, servingSize: '100g' },
  { id: 'g-234', name: '콩나물 (100g)', calories: 30, protein: 3.5, carbs: 3, fat: 0.5, servingSize: '100g' },
  { id: 'g-235', name: '된장 (쌈장 포함, 20g)', calories: 35, protein: 2.5, carbs: 4, fat: 1, servingSize: '20g' },
  { id: 'g-236', name: '쌈장 (20g)', calories: 38, protein: 2, carbs: 5, fat: 1.2, servingSize: '20g' },
  { id: 'g-237', name: '마요네즈 (15g)', calories: 110, protein: 0.2, carbs: 0.3, fat: 12, servingSize: '15g' },
  { id: 'g-238', name: '케첩 (20g)', calories: 22, protein: 0.3, carbs: 5, fat: 0, servingSize: '20g' },
  { id: 'g-239', name: '머스타드 (10g)', calories: 12, protein: 0.6, carbs: 1.2, fat: 0.6, servingSize: '10g' },
  { id: 'g-240', name: '참기름 (5ml)', calories: 44, protein: 0, carbs: 0, fat: 5, servingSize: '5ml' },
  { id: 'g-241', name: '올리브오일 (10ml)', calories: 90, protein: 0, carbs: 0, fat: 10, servingSize: '10ml' },
  { id: 'g-242', name: '들기름 (5ml)', calories: 44, protein: 0, carbs: 0, fat: 5, servingSize: '5ml' },
  { id: 'g-243', name: '허니머스타드 드레싱 (15ml)', calories: 70, protein: 0.3, carbs: 8, fat: 4, servingSize: '15ml' },
  { id: 'g-244', name: '발사믹드레싱 (15ml)', calories: 40, protein: 0.2, carbs: 7, fat: 1, servingSize: '15ml' },
  { id: 'g-245', name: '시저드레싱 (20ml)', calories: 100, protein: 0.8, carbs: 2, fat: 10, servingSize: '20ml' },
  { id: 'g-246', name: '랜치드레싱 (20ml)', calories: 90, protein: 0.5, carbs: 2, fat: 9, servingSize: '20ml' },
  { id: 'g-247', name: '타르타르소스 (20g)', calories: 90, protein: 0.5, carbs: 3, fat: 9, servingSize: '20g' },
  { id: 'g-248', name: '홀그레인머스타드 (10g)', calories: 18, protein: 1, carbs: 1.5, fat: 1, servingSize: '10g' },
  { id: 'g-249', name: '스리라차소스 (10g)', calories: 10, protein: 0.3, carbs: 2, fat: 0.2, servingSize: '10g' },
  { id: 'g-250', name: '핫소스 (10ml)', calories: 5, protein: 0.2, carbs: 1, fat: 0.1, servingSize: '10ml' },

  /* ══════════════════════════════════════════
   * g-251~300: 닭/오리/계란 요리 상세
   * ══════════════════════════════════════════ */
  { id: 'g-251', name: '프라이드치킨 (1조각)', calories: 280, protein: 20, carbs: 16, fat: 16, servingSize: '1조각 120g' },
  { id: 'g-252', name: '양념치킨 (1조각)', calories: 310, protein: 18, carbs: 22, fat: 18, servingSize: '1조각 120g' },
  { id: 'g-253', name: '간장치킨 (1조각)', calories: 290, protein: 20, carbs: 18, fat: 16, servingSize: '1조각 120g' },
  { id: 'g-254', name: '마늘치킨 (1조각)', calories: 295, protein: 20, carbs: 18, fat: 16, servingSize: '1조각 120g' },
  { id: 'g-255', name: '닭강정 (100g)', calories: 280, protein: 16, carbs: 28, fat: 12, servingSize: '100g' },
  { id: 'g-256', name: '닭꼬치 (간장)', calories: 180, protein: 18, carbs: 10, fat: 8, servingSize: '2꼬치 120g' },
  { id: 'g-257', name: '삼계탕 (영계)', calories: 480, protein: 40, carbs: 36, fat: 16, servingSize: '1인분 700g' },
  { id: 'g-258', name: '백숙 (일반)', calories: 440, protein: 38, carbs: 32, fat: 14, servingSize: '1인분 600g' },
  { id: 'g-259', name: '닭볶음탕 (1인분)', calories: 420, protein: 32, carbs: 24, fat: 22, servingSize: '1인분 350g' },
  { id: 'g-260', name: '오리로스 (200g)', calories: 440, protein: 28, carbs: 4, fat: 36, servingSize: '200g' },
  { id: 'g-261', name: '계란 삶은 것 (1개)', calories: 70, protein: 6, carbs: 0.6, fat: 5, servingSize: '1개 50g' },
  { id: 'g-262', name: '계란 반숙 (1개)', calories: 68, protein: 6, carbs: 0.6, fat: 4.8, servingSize: '1개 50g' },
  { id: 'g-263', name: '계란 프라이 (1개)', calories: 90, protein: 6, carbs: 0.6, fat: 7, servingSize: '1개 50g' },
  { id: 'g-264', name: '스크램블 계란 (2개)', calories: 160, protein: 12, carbs: 1.5, fat: 12, servingSize: '2개 120g' },
  { id: 'g-265', name: '메추리알 삶은 것 (10개)', calories: 90, protein: 8, carbs: 0.8, fat: 6, servingSize: '10개 80g' },

  /* ══════════════════════════════════════════
   * g-266~315: 분식/패스트푸드 세부
   * ══════════════════════════════════════════ */
  { id: 'g-266', name: '핫도그 (오리지널)', calories: 350, protein: 12, carbs: 38, fat: 16, servingSize: '1개 120g' },
  { id: 'g-267', name: '핫도그 (모짜렐라)', calories: 380, protein: 13, carbs: 38, fat: 20, servingSize: '1개 120g' },
  { id: 'g-268', name: '핫도그 (감자)', calories: 400, protein: 10, carbs: 48, fat: 19, servingSize: '1개 130g' },
  { id: 'g-269', name: '떡꼬치 2개', calories: 320, protein: 5, carbs: 64, fat: 4, servingSize: '2개 160g' },
  { id: 'g-270', name: '와플 (아이스크림)', calories: 480, protein: 8, carbs: 66, fat: 22, servingSize: '1개 200g' },
  { id: 'g-271', name: '크로플', calories: 380, protein: 6, carbs: 46, fat: 19, servingSize: '1개 130g' },
  { id: 'g-272', name: '허니콤보 (치킨+파이)', calories: 820, protein: 42, carbs: 74, fat: 40, servingSize: '1인분 500g' },
  { id: 'g-273', name: '치즈스틱 (5개)', calories: 320, protein: 10, carbs: 28, fat: 20, servingSize: '5개 120g' },
  { id: 'g-274', name: '감자웨지 (150g)', calories: 300, protein: 5, carbs: 44, fat: 13, servingSize: '150g' },
  { id: 'g-275', name: '어니언링 (5개)', calories: 280, protein: 4, carbs: 34, fat: 14, servingSize: '5개 120g' },
  { id: 'g-276', name: '콘도그 미니 (5개)', calories: 360, protein: 10, carbs: 42, fat: 18, servingSize: '5개 150g' },
  { id: 'g-277', name: '치킨너겟 (10개)', calories: 320, protein: 18, carbs: 22, fat: 18, servingSize: '10개 150g' },
  { id: 'g-278', name: '모짜렐라스틱 (3개)', calories: 280, protein: 12, carbs: 24, fat: 15, servingSize: '3개 100g' },
  { id: 'g-279', name: '잡채튀김', calories: 300, protein: 8, carbs: 42, fat: 12, servingSize: '1인분 150g' },
  { id: 'g-280', name: '떡튀김 (2개)', calories: 240, protein: 4, carbs: 40, fat: 8, servingSize: '2개 100g' },

  /* ══════════════════════════════════════════
   * g-281~330: 아침/간식 더
   * ══════════════════════════════════════════ */
  { id: 'g-281', name: '시리얼 (오트밀+우유)', calories: 300, protein: 9, carbs: 50, fat: 7, servingSize: '1인분 250g' },
  { id: 'g-282', name: '시리얼바 (오트)', calories: 190, protein: 4, carbs: 34, fat: 5, servingSize: '1개 45g' },
  { id: 'g-283', name: '그래놀라바', calories: 210, protein: 4.5, carbs: 30, fat: 9, servingSize: '1개 55g' },
  { id: 'g-284', name: '라이스케이크 (쌀과자 2장)', calories: 70, protein: 1.5, carbs: 15, fat: 0.5, servingSize: '2장 15g' },
  { id: 'g-285', name: '멀티그레인크래커 (5장)', calories: 120, protein: 3, carbs: 22, fat: 3, servingSize: '5장 30g' },
  { id: 'g-286', name: '피넛버터 (20g)', calories: 120, protein: 5, carbs: 4, fat: 10, servingSize: '20g' },
  { id: 'g-287', name: '잼 (딸기, 15g)', calories: 40, protein: 0.1, carbs: 10, fat: 0, servingSize: '15g' },
  { id: 'g-288', name: '누텔라 (20g)', calories: 110, protein: 1.5, carbs: 12, fat: 6.5, servingSize: '20g' },
  { id: 'g-289', name: '과일잼 (블루베리, 15g)', calories: 35, protein: 0.1, carbs: 9, fat: 0, servingSize: '15g' },
  { id: 'g-290', name: '꿀 (15g)', calories: 45, protein: 0, carbs: 12, fat: 0, servingSize: '15g' },
  { id: 'g-291', name: '아가베시럽 (15ml)', calories: 50, protein: 0, carbs: 14, fat: 0, servingSize: '15ml' },
  { id: 'g-292', name: '메이플시럽 (15ml)', calories: 50, protein: 0, carbs: 13, fat: 0, servingSize: '15ml' },
  { id: 'g-293', name: '흑임자죽 (1인분)', calories: 260, protein: 6, carbs: 42, fat: 8, servingSize: '1인분 350g' },
  { id: 'g-294', name: '미숫가루 (30g)', calories: 120, protein: 3.5, carbs: 24, fat: 1.5, servingSize: '30g' },
  { id: 'g-295', name: '선식 (30g+우유)', calories: 200, protein: 7, carbs: 36, fat: 3, servingSize: '300ml' },
  { id: 'g-296', name: '단호박 스프 (300ml)', calories: 160, protein: 4, carbs: 28, fat: 4, servingSize: '300ml' },
  { id: 'g-297', name: '콘스프 (200ml)', calories: 140, protein: 3.5, carbs: 22, fat: 4.5, servingSize: '200ml' },
  { id: 'g-298', name: '버섯크림수프 (300ml)', calories: 220, protein: 5, carbs: 18, fat: 14, servingSize: '300ml' },
  { id: 'g-299', name: '미소수프 (200ml)', calories: 40, protein: 2.5, carbs: 5, fat: 1, servingSize: '200ml' },
  { id: 'g-300', name: '팩 삼계탕', calories: 440, protein: 36, carbs: 34, fat: 16, servingSize: '1팩 700g' },

  /* ══════════════════════════════════════════
   * g-301~355: 패스트푸드/편의점 추가
   * ══════════════════════════════════════════ */
  { id: 'g-301', name: '롯데리아 모짜렐라버거', calories: 560, protein: 24, carbs: 58, fat: 26, servingSize: '1개 220g' },
  { id: 'g-302', name: '맥도날드 맥스파이시 상하이버거 세트', calories: 1050, protein: 36, carbs: 128, fat: 44, servingSize: '1세트 650g' },
  { id: 'g-303', name: '노브랜드버거 시그니처 버거', calories: 640, protein: 30, carbs: 54, fat: 34, servingSize: '1개 240g' },
  { id: 'g-304', name: '고피자 개인피자', calories: 620, protein: 26, carbs: 72, fat: 26, servingSize: '1판 270g' },
  { id: 'g-305', name: '도미노 포테이토피자 (1조각)', calories: 305, protein: 12, carbs: 36, fat: 13, servingSize: '1조각 130g' },
  { id: 'g-306', name: 'BBQ 황금올리브치킨 (후라이드, 1조각)', calories: 290, protein: 22, carbs: 16, fat: 16, servingSize: '1조각 130g' },
  { id: 'g-307', name: '굽네 고추바사삭 (순살, 100g)', calories: 240, protein: 22, carbs: 10, fat: 14, servingSize: '100g' },
  { id: 'g-308', name: '파파이스 치킨 (2조각)', calories: 560, protein: 34, carbs: 30, fat: 36, servingSize: '2조각 220g' },
  { id: 'g-309', name: '편의점 피자빵', calories: 380, protein: 12, carbs: 52, fat: 14, servingSize: '1개 130g' },
  { id: 'g-310', name: '편의점 불닭볶음면 (큰컵)', calories: 560, protein: 12, carbs: 76, fat: 22, servingSize: '1개 105g' },
  { id: 'g-311', name: '냉동 닭강정 (200g)', calories: 560, protein: 28, carbs: 52, fat: 28, servingSize: '200g' },
  { id: 'g-312', name: '냉동 군만두 (10개)', calories: 600, protein: 22, carbs: 74, fat: 24, servingSize: '10개 330g' },
  { id: 'g-313', name: '냉동 스프링롤 (5개)', calories: 400, protein: 10, carbs: 50, fat: 18, servingSize: '5개 200g' },
  { id: 'g-314', name: '냉동 탕수육 (200g)', calories: 480, protein: 18, carbs: 60, fat: 20, servingSize: '200g' },
  { id: 'g-315', name: '냉동 갈비 (200g)', calories: 520, protein: 32, carbs: 16, fat: 36, servingSize: '200g' },

  /* ══════════════════════════════════════════
   * g-316~365: 건강/다이어트 추가
   * ══════════════════════════════════════════ */
  { id: 'g-316', name: '아사이베리 파우더 (10g)', calories: 60, protein: 1, carbs: 6, fat: 3.5, servingSize: '10g' },
  { id: 'g-317', name: '스피룰리나 (5g)', calories: 18, protein: 3.5, carbs: 1.5, fat: 0.5, servingSize: '5g' },
  { id: 'g-318', name: '클로렐라 (5g)', calories: 16, protein: 3.5, carbs: 1, fat: 0.4, servingSize: '5g' },
  { id: 'g-319', name: '마카 파우더 (10g)', calories: 35, protein: 1.5, carbs: 7, fat: 0.5, servingSize: '10g' },
  { id: 'g-320', name: '콜라겐 파우더 (10g)', calories: 38, protein: 9.5, carbs: 0, fat: 0, servingSize: '10g' },
  { id: 'g-321', name: '이너뷰티 음료 (200ml)', calories: 30, protein: 3, carbs: 4, fat: 0, servingSize: '200ml' },
  { id: 'g-322', name: '다이어트 셰이크 (초코)', calories: 190, protein: 20, carbs: 18, fat: 4, servingSize: '1팩 250ml' },
  { id: 'g-323', name: '다이어트 셰이크 (바닐라)', calories: 180, protein: 20, carbs: 16, fat: 4, servingSize: '1팩 250ml' },
  { id: 'g-324', name: '저탄고지 도시락', calories: 420, protein: 32, carbs: 12, fat: 28, servingSize: '1개 320g' },
  { id: 'g-325', name: '간헐적단식 식사 (OMAD)', calories: 600, protein: 40, carbs: 50, fat: 24, servingSize: '1식 450g' },
  { id: 'g-326', name: '포만감스프 (단호박)', calories: 120, protein: 3, carbs: 22, fat: 2.5, servingSize: '300ml' },
  { id: 'g-327', name: '두부소면', calories: 180, protein: 14, carbs: 22, fat: 4, servingSize: '1인분 250g' },
  { id: 'g-328', name: '닭가슴살 큐브 (냉동)', calories: 110, protein: 22, carbs: 1.5, fat: 2.5, servingSize: '100g' },
  { id: 'g-329', name: '채식 비건 버거', calories: 480, protein: 20, carbs: 52, fat: 22, servingSize: '1개 220g' },
  { id: 'g-330', name: '채식 비건 소시지', calories: 120, protein: 10, carbs: 10, fat: 4, servingSize: '1개 60g' },

  /* ══════════════════════════════════════════
   * g-331~385: 어린이/청소년 간식
   * ══════════════════════════════════════════ */
  { id: 'g-331', name: '포키 (초코, 1갑)', calories: 200, protein: 3, carbs: 28, fat: 9, servingSize: '1갑 45g' },
  { id: 'g-332', name: '킨더부에노 (1개)', calories: 220, protein: 4, carbs: 24, fat: 12, servingSize: '1개 43g' },
  { id: 'g-333', name: '킷캣 (4개)', calories: 210, protein: 2.5, carbs: 27, fat: 11, servingSize: '4개 41.5g' },
  { id: 'g-334', name: '스니커즈 (1개)', calories: 250, protein: 4, carbs: 33, fat: 12, servingSize: '1개 52g' },
  { id: 'g-335', name: '트윅스 (1개)', calories: 250, protein: 2.5, carbs: 34, fat: 12, servingSize: '1개 50g' },
  { id: 'g-336', name: '허쉬 초콜릿바 (43g)', calories: 220, protein: 3, carbs: 26, fat: 13, servingSize: '43g' },
  { id: 'g-337', name: 'M&M 땅콩 (100g)', calories: 500, protein: 10, carbs: 62, fat: 24, servingSize: '100g' },
  { id: 'g-338', name: '해태 연양갱', calories: 260, protein: 3.5, carbs: 60, fat: 0.5, servingSize: '100g' },
  { id: 'g-339', name: '남양 초코에몽 (200ml)', calories: 140, protein: 4, carbs: 26, fat: 2.5, servingSize: '200ml' },
  { id: 'g-340', name: '매일 바나나맛우유 (240ml)', calories: 150, protein: 5, carbs: 26, fat: 3, servingSize: '240ml' },
  { id: 'g-341', name: '서울우유 초코우유 (190ml)', calories: 150, protein: 5.5, carbs: 23, fat: 4, servingSize: '190ml' },
  { id: 'g-342', name: '뚱카롱 (마카롱)', calories: 180, protein: 3, carbs: 26, fat: 8, servingSize: '1개 45g' },
  { id: 'g-343', name: '와플 아이스크림', calories: 380, protein: 5, carbs: 52, fat: 17, servingSize: '1개 150g' },
  { id: 'g-344', name: '롤케이크 (1조각)', calories: 280, protein: 5, carbs: 40, fat: 12, servingSize: '1조각 80g' },
  { id: 'g-345', name: '탕후루 (딸기 5개)', calories: 180, protein: 0.5, carbs: 44, fat: 0.2, servingSize: '5개 120g' },
  { id: 'g-346', name: '탕후루 (포도)', calories: 200, protein: 0.5, carbs: 50, fat: 0.2, servingSize: '120g' },
  { id: 'g-347', name: '탕후루 (샤인머스켓)', calories: 220, protein: 0.8, carbs: 54, fat: 0.3, servingSize: '120g' },
  { id: 'g-348', name: '추로스 (2개)', calories: 340, protein: 5, carbs: 50, fat: 14, servingSize: '2개 120g' },
  { id: 'g-349', name: '솜사탕', calories: 100, protein: 0, carbs: 25, fat: 0, servingSize: '1개 25g' },
  { id: 'g-350', name: '아이스팝 (딸기)', calories: 80, protein: 0.3, carbs: 20, fat: 0, servingSize: '1개 70ml' },

  /* ══════════════════════════════════════════
   * g-351~400: 인기 음식 검색어 대응
   * ══════════════════════════════════════════ */
  { id: 'g-351', name: '마라로우웨이', calories: 580, protein: 20, carbs: 52, fat: 34, servingSize: '1인분 450g' },
  { id: 'g-352', name: '마라 반짱', calories: 540, protein: 18, carbs: 54, fat: 30, servingSize: '1인분 400g' },
  { id: 'g-353', name: '마라 전골', calories: 680, protein: 30, carbs: 44, fat: 44, servingSize: '1인분 600g' },
  { id: 'g-354', name: '양꼬치+쯔란 (10개)', calories: 760, protein: 56, carbs: 8, fat: 56, servingSize: '10개 400g' },
  { id: 'g-355', name: '중국식 꿔바로우', calories: 620, protein: 24, carbs: 68, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-356', name: '랍스터 볶음밥', calories: 680, protein: 28, carbs: 84, fat: 26, servingSize: '1인분 450g' },
  { id: 'g-357', name: '연어 포케', calories: 540, protein: 28, carbs: 64, fat: 20, servingSize: '1인분 400g' },
  { id: 'g-358', name: '참치 포케', calories: 500, protein: 30, carbs: 62, fat: 16, servingSize: '1인분 380g' },
  { id: 'g-359', name: '쉬림프 포케', calories: 520, protein: 24, carbs: 66, fat: 18, servingSize: '1인분 400g' },
  { id: 'g-360', name: '포케볼 (베이스+토핑)', calories: 560, protein: 26, carbs: 68, fat: 20, servingSize: '1인분 420g' },
  { id: 'g-361', name: '아보카도볼 (라이스)', calories: 580, protein: 16, carbs: 78, fat: 24, servingSize: '1인분 400g' },
  { id: 'g-362', name: '연어 아보카도 덮밥', calories: 620, protein: 26, carbs: 76, fat: 26, servingSize: '1인분 420g' },
  { id: 'g-363', name: '오마카세 런치 (10피스)', calories: 700, protein: 38, carbs: 84, fat: 22, servingSize: '10피스 380g' },
  { id: 'g-364', name: '회덮밥', calories: 580, protein: 28, carbs: 82, fat: 16, servingSize: '1인분 420g' },
  { id: 'g-365', name: '생선까스 덮밥', calories: 660, protein: 26, carbs: 86, fat: 24, servingSize: '1인분 430g' },
  { id: 'g-366', name: '크랩롤 샐러드', calories: 380, protein: 16, carbs: 48, fat: 16, servingSize: '1인분 300g' },
  { id: 'g-367', name: '스시 오마카세 (15피스)', calories: 980, protein: 54, carbs: 112, fat: 28, servingSize: '15피스 520g' },
  { id: 'g-368', name: '하이라이스', calories: 560, protein: 16, carbs: 88, fat: 16, servingSize: '1인분 420g' },
  { id: 'g-369', name: '드미그라스 함박', calories: 460, protein: 26, carbs: 24, fat: 28, servingSize: '1인분 280g' },
  { id: 'g-370', name: '비프 스튜', calories: 520, protein: 32, carbs: 34, fat: 28, servingSize: '1인분 350g' },
  { id: 'g-371', name: '치킨 콘소메 수프', calories: 80, protein: 10, carbs: 4, fat: 2, servingSize: '1인분 300ml' },
  { id: 'g-372', name: '미네스트로네', calories: 160, protein: 7, carbs: 26, fat: 4, servingSize: '1인분 350ml' },
  { id: 'g-373', name: '크림파스타 (트러플)', calories: 680, protein: 18, carbs: 76, fat: 34, servingSize: '1인분 400g' },
  { id: 'g-374', name: '뇨끼 (트러플소스)', calories: 540, protein: 12, carbs: 80, fat: 20, servingSize: '1인분 360g' },
  { id: 'g-375', name: '멘보샤 (4개)', calories: 360, protein: 14, carbs: 32, fat: 20, servingSize: '4개 160g' },
  { id: 'g-376', name: '쇼콜라 (4개)', calories: 440, protein: 8, carbs: 52, fat: 24, servingSize: '4개 120g' },
  { id: 'g-377', name: '군고구마 라떼', calories: 240, protein: 6, carbs: 42, fat: 6, servingSize: '355ml' },
  { id: 'g-378', name: '흑임자 라떼', calories: 220, protein: 6, carbs: 34, fat: 7, servingSize: '355ml' },
  { id: 'g-379', name: '옥수수 라떼', calories: 230, protein: 6, carbs: 36, fat: 7, servingSize: '355ml' },
  { id: 'g-380', name: '호지차 라떼', calories: 200, protein: 6, carbs: 30, fat: 6, servingSize: '355ml' },

  /* ══════════════════════════════════════════
   * g-381~435: 다국적 음식 더
   * ══════════════════════════════════════════ */
  { id: 'g-381', name: '초밥 세트 (12피스)', calories: 640, protein: 28, carbs: 88, fat: 18, servingSize: '12피스 380g' },
  { id: 'g-382', name: '연어알 군함말이 (2개)', calories: 140, protein: 6, carbs: 24, fat: 3, servingSize: '2개 80g' },
  { id: 'g-383', name: '게살 군함말이 (2개)', calories: 120, protein: 5, carbs: 22, fat: 2, servingSize: '2개 75g' },
  { id: 'g-384', name: '우니 군함말이 (2개)', calories: 170, protein: 8, carbs: 26, fat: 5, servingSize: '2개 85g' },
  { id: 'g-385', name: '아나고초밥 (2피스)', calories: 160, protein: 10, carbs: 24, fat: 4, servingSize: '2피스 80g' },
  { id: 'g-386', name: '타마고초밥 (2피스)', calories: 120, protein: 4, carbs: 22, fat: 2.5, servingSize: '2피스 80g' },
  { id: 'g-387', name: '유부초밥 (4개)', calories: 320, protein: 8, carbs: 54, fat: 8, servingSize: '4개 180g' },
  { id: 'g-388', name: '오니기리 (연어)', calories: 200, protein: 8, carbs: 36, fat: 3, servingSize: '1개 100g' },
  { id: 'g-389', name: '오니기리 (참치마요)', calories: 220, protein: 7, carbs: 36, fat: 6, servingSize: '1개 100g' },
  { id: 'g-390', name: '카이센동 대 (1인분)', calories: 720, protein: 38, carbs: 86, fat: 22, servingSize: '1인분 500g' },
  { id: 'g-391', name: '리즈떡 (바질새우)', calories: 480, protein: 20, carbs: 62, fat: 18, servingSize: '1인분 320g' },
  { id: 'g-392', name: '팟씨유', calories: 540, protein: 18, carbs: 72, fat: 22, servingSize: '1인분 400g' },
  { id: 'g-393', name: '카오팟 (태국볶음밥)', calories: 520, protein: 16, carbs: 76, fat: 18, servingSize: '1인분 380g' },
  { id: 'g-394', name: '똠카가이', calories: 360, protein: 22, carbs: 16, fat: 26, servingSize: '1인분 350ml' },
  { id: 'g-395', name: '레드카레 (태국)', calories: 440, protein: 22, carbs: 22, fat: 30, servingSize: '1인분 300g' },
  { id: 'g-396', name: '옐로우카레 (태국)', calories: 420, protein: 20, carbs: 24, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-397', name: '파인애플볶음밥 (태국)', calories: 580, protein: 16, carbs: 82, fat: 22, servingSize: '1인분 420g' },
  { id: 'g-398', name: '솜땀 (태국파파야샐러드)', calories: 160, protein: 6, carbs: 28, fat: 4, servingSize: '1인분 250g' },
  { id: 'g-399', name: '카오만가이', calories: 520, protein: 32, carbs: 64, fat: 16, servingSize: '1인분 420g' },
  { id: 'g-400', name: '콸로프 (말레이식 라이스)', calories: 560, protein: 22, carbs: 74, fat: 20, servingSize: '1인분 420g' },

  /* ══════════════════════════════════════════
   * g-401~450: 음료 (에너지/주스/기능성)
   * ══════════════════════════════════════════ */
  { id: 'g-401', name: '레드불 (250ml)', calories: 113, protein: 1, carbs: 28, fat: 0, servingSize: '250ml' },
  { id: 'g-402', name: '몬스터 에너지 (355ml)', calories: 160, protein: 1, carbs: 40, fat: 0, servingSize: '355ml' },
  { id: 'g-403', name: '게토레이 (600ml)', calories: 138, protein: 0, carbs: 35, fat: 0, servingSize: '600ml' },
  { id: 'g-404', name: '포카리스웨트 (500ml)', calories: 120, protein: 0, carbs: 30, fat: 0, servingSize: '500ml' },
  { id: 'g-405', name: '박카스 (100ml)', calories: 82, protein: 0, carbs: 20, fat: 0, servingSize: '100ml' },
  { id: 'g-406', name: '비타500 (100ml)', calories: 38, protein: 0, carbs: 9.5, fat: 0, servingSize: '100ml' },
  { id: 'g-407', name: '핫식스 (250ml)', calories: 113, protein: 0.5, carbs: 28, fat: 0, servingSize: '250ml' },
  { id: 'g-408', name: '오렌지주스 100% (200ml)', calories: 88, protein: 1.2, carbs: 20, fat: 0.2, servingSize: '200ml' },
  { id: 'g-409', name: '포도주스 (200ml)', calories: 110, protein: 0.8, carbs: 27, fat: 0.2, servingSize: '200ml' },
  { id: 'g-410', name: '사과주스 (200ml)', calories: 96, protein: 0.3, carbs: 24, fat: 0, servingSize: '200ml' },
  { id: 'g-411', name: '당근주스 (200ml)', calories: 80, protein: 1.5, carbs: 18, fat: 0.3, servingSize: '200ml' },
  { id: 'g-412', name: '토마토주스 (200ml)', calories: 38, protein: 1.6, carbs: 7.5, fat: 0.2, servingSize: '200ml' },
  { id: 'g-413', name: '녹즙 (150ml)', calories: 30, protein: 1.5, carbs: 5, fat: 0.2, servingSize: '150ml' },
  { id: 'g-414', name: '망고주스 (200ml)', calories: 120, protein: 0.5, carbs: 29, fat: 0.3, servingSize: '200ml' },
  { id: 'g-415', name: '파인애플주스 (200ml)', calories: 110, protein: 0.6, carbs: 26, fat: 0.1, servingSize: '200ml' },
  { id: 'g-416', name: '콜드브루 블랙 (300ml)', calories: 5, protein: 0.3, carbs: 0.5, fat: 0, servingSize: '300ml' },
  { id: 'g-417', name: '콜드브루 라떼 (300ml)', calories: 100, protein: 5, carbs: 11, fat: 4, servingSize: '300ml' },
  { id: 'g-418', name: '달고나 커피 (450ml)', calories: 220, protein: 7, carbs: 32, fat: 7, servingSize: '450ml' },
  { id: 'g-419', name: '코코아 핫초코 (300ml)', calories: 200, protein: 7, carbs: 32, fat: 6, servingSize: '300ml' },
  { id: 'g-420', name: '플랫화이트 (180ml)', calories: 110, protein: 5.5, carbs: 10, fat: 5.5, servingSize: '180ml' },

  /* ══════════════════════════════════════════
   * g-421~460: 면/파스타/국수 상세
   * ══════════════════════════════════════════ */
  { id: 'g-421', name: '모리소바', calories: 280, protein: 10, carbs: 52, fat: 1.5, servingSize: '1인분 300g' },
  { id: 'g-422', name: '붓카케 우동', calories: 340, protein: 12, carbs: 64, fat: 3, servingSize: '1인분 380g' },
  { id: 'g-423', name: '카레우동', calories: 480, protein: 16, carbs: 78, fat: 12, servingSize: '1인분 450g' },
  { id: 'g-424', name: '야키소바', calories: 520, protein: 16, carbs: 74, fat: 18, servingSize: '1인분 380g' },
  { id: 'g-425', name: '하카타 라멘', calories: 620, protein: 26, carbs: 74, fat: 26, servingSize: '1인분 500g' },
  { id: 'g-426', name: '삿포로 미소라멘', calories: 640, protein: 24, carbs: 76, fat: 28, servingSize: '1인분 500g' },
  { id: 'g-427', name: '쇼유라멘', calories: 580, protein: 22, carbs: 74, fat: 22, servingSize: '1인분 500g' },
  { id: 'g-428', name: '츠케멘', calories: 540, protein: 28, carbs: 70, fat: 20, servingSize: '1인분 400g' },
  { id: 'g-429', name: '파스타 아마트리치아나', calories: 620, protein: 22, carbs: 78, fat: 26, servingSize: '1인분 350g' },
  { id: 'g-430', name: '파스타 보나라', calories: 680, protein: 24, carbs: 74, fat: 34, servingSize: '1인분 370g' },
  { id: 'g-431', name: '파스타 아라비아타', calories: 520, protein: 14, carbs: 80, fat: 16, servingSize: '1인분 340g' },
  { id: 'g-432', name: '라자냐 (1조각)', calories: 480, protein: 24, carbs: 44, fat: 24, servingSize: '1조각 250g' },
  { id: 'g-433', name: '뇨끼 알포모도로', calories: 460, protein: 12, carbs: 76, fat: 14, servingSize: '1인분 360g' },
  { id: 'g-434', name: '분짜 쌀국수', calories: 460, protein: 24, carbs: 62, fat: 12, servingSize: '1인분 400g' },
  { id: 'g-435', name: '분보훼', calories: 500, protein: 26, carbs: 66, fat: 14, servingSize: '1인분 420g' },
  { id: 'g-436', name: '미고렝', calories: 580, protein: 18, carbs: 78, fat: 22, servingSize: '1인분 380g' },
  { id: 'g-437', name: '바미 (말레이식 면)', calories: 520, protein: 18, carbs: 72, fat: 18, servingSize: '1인분 380g' },
  { id: 'g-438', name: '평양냉면', calories: 360, protein: 12, carbs: 68, fat: 4, servingSize: '1인분 500g' },
  { id: 'g-439', name: '수제비', calories: 340, protein: 10, carbs: 62, fat: 5, servingSize: '1인분 500g' },
  { id: 'g-440', name: '바지락칼국수', calories: 420, protein: 16, carbs: 72, fat: 7, servingSize: '1인분 500g' },

  /* ══════════════════════════════════════════
   * g-441~480: 고기구이 상세
   * ══════════════════════════════════════════ */
  { id: 'g-441', name: '삼겹살 (200g 생)', calories: 680, protein: 36, carbs: 0, fat: 60, servingSize: '200g' },
  { id: 'g-442', name: '목살 (200g 생)', calories: 560, protein: 40, carbs: 0, fat: 44, servingSize: '200g' },
  { id: 'g-443', name: '갈비살 (200g 생)', calories: 640, protein: 38, carbs: 0, fat: 54, servingSize: '200g' },
  { id: 'g-444', name: '우삼겹 (150g)', calories: 480, protein: 26, carbs: 0, fat: 42, servingSize: '150g' },
  { id: 'g-445', name: '차돌박이 (150g)', calories: 560, protein: 24, carbs: 0, fat: 50, servingSize: '150g' },
  { id: 'g-446', name: '항정살 (200g)', calories: 600, protein: 38, carbs: 0, fat: 50, servingSize: '200g' },
  { id: 'g-447', name: '소 등심 (200g)', calories: 500, protein: 44, carbs: 0, fat: 34, servingSize: '200g' },
  { id: 'g-448', name: '소 안심 (200g)', calories: 440, protein: 46, carbs: 0, fat: 28, servingSize: '200g' },
  { id: 'g-449', name: '닭 가슴살 (200g)', calories: 220, protein: 44, carbs: 0, fat: 4, servingSize: '200g' },
  { id: 'g-450', name: '닭 다리살 (200g)', calories: 320, protein: 36, carbs: 0, fat: 18, servingSize: '200g' },
  { id: 'g-451', name: '닭 날개 (4개)', calories: 360, protein: 28, carbs: 0, fat: 26, servingSize: '4개 200g' },
  { id: 'g-452', name: '오리 가슴살 (150g)', calories: 260, protein: 30, carbs: 0, fat: 14, servingSize: '150g' },
  { id: 'g-453', name: '양고기 갈비 (200g)', calories: 540, protein: 36, carbs: 0, fat: 44, servingSize: '200g' },
  { id: 'g-454', name: '소 스테이크 안심 (200g)', calories: 380, protein: 44, carbs: 0, fat: 22, servingSize: '200g' },
  { id: 'g-455', name: '티본 스테이크 (300g)', calories: 700, protein: 60, carbs: 0, fat: 50, servingSize: '300g' },
  { id: 'g-456', name: '돼지불고기 (150g)', calories: 320, protein: 22, carbs: 12, fat: 20, servingSize: '150g' },
  { id: 'g-457', name: '소불고기 (150g)', calories: 290, protein: 22, carbs: 14, fat: 16, servingSize: '150g' },
  { id: 'g-458', name: '제육볶음 (150g)', calories: 360, protein: 24, carbs: 14, fat: 24, servingSize: '150g' },
  { id: 'g-459', name: '꽃살 (앞다리, 200g)', calories: 460, protein: 42, carbs: 0, fat: 30, servingSize: '200g' },
  { id: 'g-460', name: '뒷다리살 (200g)', calories: 360, protein: 46, carbs: 0, fat: 18, servingSize: '200g' },

  /* ══════════════════════════════════════════
   * g-461~500: 채소/과일/곡물 상세
   * ══════════════════════════════════════════ */
  { id: 'g-461', name: '양상추 (50g)', calories: 8, protein: 0.7, carbs: 1.5, fat: 0.1, servingSize: '50g' },
  { id: 'g-462', name: '방울토마토 (10개)', calories: 30, protein: 1.5, carbs: 5.5, fat: 0.3, servingSize: '10개 100g' },
  { id: 'g-463', name: '파프리카 (100g)', calories: 30, protein: 1, carbs: 6, fat: 0.3, servingSize: '100g' },
  { id: 'g-464', name: '오이 (100g)', calories: 12, protein: 0.6, carbs: 2, fat: 0.1, servingSize: '100g' },
  { id: 'g-465', name: '당근 (100g)', calories: 40, protein: 0.9, carbs: 9.5, fat: 0.2, servingSize: '100g' },
  { id: 'g-466', name: '브로콜리 (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: '100g' },
  { id: 'g-467', name: '양배추 (100g)', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, servingSize: '100g' },
  { id: 'g-468', name: '시금치 (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g' },
  { id: 'g-469', name: '상추 (50g)', calories: 10, protein: 0.7, carbs: 1.5, fat: 0.2, servingSize: '50g' },
  { id: 'g-470', name: '부추 (50g)', calories: 18, protein: 1.5, carbs: 2.5, fat: 0.4, servingSize: '50g' },
  { id: 'g-471', name: '귀리 (건, 100g)', calories: 380, protein: 13, carbs: 66, fat: 7, servingSize: '100g' },
  { id: 'g-472', name: '퀴노아 (건, 100g)', calories: 370, protein: 14, carbs: 64, fat: 6, servingSize: '100g' },
  { id: 'g-473', name: '렌틸콩 (건, 100g)', calories: 352, protein: 26, carbs: 60, fat: 1, servingSize: '100g' },
  { id: 'g-474', name: '병아리콩 (건, 100g)', calories: 364, protein: 19, carbs: 61, fat: 6, servingSize: '100g' },
  { id: 'g-475', name: '검은콩 (건, 100g)', calories: 340, protein: 20, carbs: 60, fat: 1.5, servingSize: '100g' },
  { id: 'g-476', name: '아몬드 (30g)', calories: 180, protein: 6.5, carbs: 6, fat: 16, servingSize: '30g' },
  { id: 'g-477', name: '캐슈넛 (30g)', calories: 165, protein: 5, carbs: 9, fat: 13, servingSize: '30g' },
  { id: 'g-478', name: '피스타치오 (30g)', calories: 170, protein: 6, carbs: 8, fat: 14, servingSize: '30g' },
  { id: 'g-479', name: '마카다미아 (30g)', calories: 210, protein: 2, carbs: 4, fat: 22, servingSize: '30g' },
  { id: 'g-480', name: '땅콩 (30g)', calories: 175, protein: 8, carbs: 6, fat: 15, servingSize: '30g' },

  /* ══════════════════════════════════════════
   * g-481~520: 과일 상세
   * ══════════════════════════════════════════ */
  { id: 'g-481', name: '포도 (100g)', calories: 67, protein: 0.6, carbs: 17, fat: 0.4, servingSize: '100g' },
  { id: 'g-482', name: '체리 (100g)', calories: 63, protein: 1, carbs: 16, fat: 0.2, servingSize: '100g' },
  { id: 'g-483', name: '무화과 (1개)', calories: 50, protein: 0.5, carbs: 13, fat: 0.2, servingSize: '1개 65g' },
  { id: 'g-484', name: '리치 (10개)', calories: 80, protein: 0.8, carbs: 20, fat: 0.4, servingSize: '10개 100g' },
  { id: 'g-485', name: '파인애플 (100g)', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, servingSize: '100g' },
  { id: 'g-486', name: '감 (1개)', calories: 110, protein: 0.7, carbs: 28, fat: 0.2, servingSize: '1개 150g' },
  { id: 'g-487', name: '배 (1/2개)', calories: 80, protein: 0.4, carbs: 21, fat: 0.1, servingSize: '1/2개 160g' },
  { id: 'g-488', name: '복숭아 (1개)', calories: 60, protein: 1.5, carbs: 14, fat: 0.2, servingSize: '1개 200g' },
  { id: 'g-489', name: '참외 (1/2개)', calories: 45, protein: 0.8, carbs: 10.5, fat: 0.1, servingSize: '1/2개 150g' },
  { id: 'g-490', name: '딸기 (10개)', calories: 32, protein: 0.7, carbs: 7.5, fat: 0.3, servingSize: '10개 100g' },
  { id: 'g-491', name: '블루베리 (100g)', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: '100g' },
  { id: 'g-492', name: '라즈베리 (100g)', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, servingSize: '100g' },
  { id: 'g-493', name: '두리안 (100g)', calories: 150, protein: 1.5, carbs: 27, fat: 5, servingSize: '100g' },
  { id: 'g-494', name: '구아바 (100g)', calories: 68, protein: 2.5, carbs: 14, fat: 1, servingSize: '100g' },
  { id: 'g-495', name: '망고스틴 (100g)', calories: 73, protein: 0.5, carbs: 18, fat: 0.6, servingSize: '100g' },
  { id: 'g-496', name: '자두 (100g)', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, servingSize: '100g' },
  { id: 'g-497', name: '석류 (100g)', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, servingSize: '100g' },
  { id: 'g-498', name: '수박 (200g)', calories: 60, protein: 1.2, carbs: 15, fat: 0.2, servingSize: '200g' },
  { id: 'g-499', name: '사과 (1/2개)', calories: 80, protein: 0.3, carbs: 21, fat: 0.2, servingSize: '1/2개 150g' },
  { id: 'g-500', name: '코코넛 과육 (50g)', calories: 175, protein: 1.5, carbs: 7.5, fat: 17, servingSize: '50g' },

  /* ══════════════════════════════════════════
   * g-501~540: 편의점/패스트푸드 추가
   * ══════════════════════════════════════════ */
  { id: 'g-501', name: '편의점 삼각김밥 (참치마요)', calories: 200, protein: 7, carbs: 34, fat: 5, servingSize: '1개 105g' },
  { id: 'g-502', name: '편의점 삼각김밥 (소고기)', calories: 195, protein: 6, carbs: 36, fat: 4, servingSize: '1개 100g' },
  { id: 'g-503', name: '편의점 계란 샌드위치', calories: 320, protein: 12, carbs: 38, fat: 14, servingSize: '1개 120g' },
  { id: 'g-504', name: '편의점 참치 샌드위치', calories: 340, protein: 14, carbs: 40, fat: 14, servingSize: '1개 130g' },
  { id: 'g-505', name: '편의점 컵라면 (신라면)', calories: 380, protein: 9, carbs: 54, fat: 14, servingSize: '1개 68g' },
  { id: 'g-506', name: '편의점 육개장컵밥', calories: 440, protein: 14, carbs: 72, fat: 12, servingSize: '1개 240g' },
  { id: 'g-507', name: '편의점 도시락 (백반)', calories: 580, protein: 20, carbs: 84, fat: 18, servingSize: '1개 340g' },
  { id: 'g-508', name: '편의점 삶은계란 (2개)', calories: 140, protein: 12, carbs: 1, fat: 10, servingSize: '2개 100g' },
  { id: 'g-509', name: '편의점 치킨강정 (100g)', calories: 280, protein: 16, carbs: 28, fat: 12, servingSize: '100g' },
  { id: 'g-510', name: '편의점 떡볶이컵 (165g)', calories: 360, protein: 8, carbs: 66, fat: 8, servingSize: '165g' },
  { id: 'g-511', name: '롯데리아 새우버거', calories: 450, protein: 16, carbs: 56, fat: 18, servingSize: '1개 180g' },
  { id: 'g-512', name: '맥도날드 더블쿼터파운더', calories: 760, protein: 50, carbs: 48, fat: 44, servingSize: '1개 280g' },
  { id: 'g-513', name: '버거킹 와퍼주니어', calories: 440, protein: 20, carbs: 40, fat: 24, servingSize: '1개 180g' },
  { id: 'g-514', name: '맥도날드 에그맥머핀', calories: 310, protein: 18, carbs: 30, fat: 13, servingSize: '1개 135g' },
  { id: 'g-515', name: 'KFC 치킨박스 3조각', calories: 780, protein: 48, carbs: 54, fat: 40, servingSize: '3조각 330g' },
  { id: 'g-516', name: '교촌 오리지날 순살 (200g)', calories: 440, protein: 38, carbs: 16, fat: 26, servingSize: '200g' },
  { id: 'g-517', name: '교촌 허니순살 (200g)', calories: 520, protein: 36, carbs: 24, fat: 32, servingSize: '200g' },
  { id: 'g-518', name: 'BBQ 황금올리브 (200g)', calories: 460, protein: 38, carbs: 16, fat: 28, servingSize: '200g' },
  { id: 'g-519', name: '굽네 고추바사삭 (200g)', calories: 480, protein: 38, carbs: 20, fat: 28, servingSize: '200g' },
  { id: 'g-520', name: '네네치킨 옛날통닭 (200g)', calories: 420, protein: 36, carbs: 16, fat: 24, servingSize: '200g' },

  /* ══════════════════════════════════════════
   * g-521~565: 아이스크림/과자/기타
   * ══════════════════════════════════════════ */
  { id: 'g-521', name: '아이스크림 비비빅', calories: 110, protein: 1, carbs: 18, fat: 3.5, servingSize: '1개 70ml' },
  { id: 'g-522', name: '아이스크림 스크류바', calories: 70, protein: 0.5, carbs: 17, fat: 0.5, servingSize: '1개 60ml' },
  { id: 'g-523', name: '아이스크림 더위사냥', calories: 130, protein: 1, carbs: 22, fat: 4, servingSize: '1개 90ml' },
  { id: 'g-524', name: '아이스크림 메로나', calories: 120, protein: 0.5, carbs: 22, fat: 3.5, servingSize: '1개 75ml' },
  { id: 'g-525', name: '아이스크림 구구콘', calories: 200, protein: 3, carbs: 28, fat: 9, servingSize: '1개 80ml' },
  { id: 'g-526', name: '아이스크림 월드콘', calories: 250, protein: 3.5, carbs: 34, fat: 11, servingSize: '1개 100ml' },
  { id: 'g-527', name: '킷캣 (4개입)', calories: 210, protein: 2.5, carbs: 27, fat: 11, servingSize: '41.5g' },
  { id: 'g-528', name: '스니커즈 (1개)', calories: 250, protein: 4, carbs: 33, fat: 12, servingSize: '52g' },
  { id: 'g-529', name: '킨더부에노 (1개)', calories: 220, protein: 4, carbs: 24, fat: 12, servingSize: '43g' },
  { id: 'g-530', name: '연양갱', calories: 260, protein: 3.5, carbs: 60, fat: 0.5, servingSize: '100g' },
  { id: 'g-531', name: '탕후루 딸기 (5개)', calories: 180, protein: 0.5, carbs: 44, fat: 0.2, servingSize: '120g' },
  { id: 'g-532', name: '탕후루 포도', calories: 200, protein: 0.5, carbs: 50, fat: 0.2, servingSize: '120g' },
  { id: 'g-533', name: '탕후루 샤인머스켓', calories: 220, protein: 0.8, carbs: 54, fat: 0.3, servingSize: '120g' },
  { id: 'g-534', name: '추로스 (2개)', calories: 340, protein: 5, carbs: 50, fat: 14, servingSize: '2개 120g' },
  { id: 'g-535', name: '프로틴바 초코', calories: 200, protein: 20, carbs: 20, fat: 6, servingSize: '1개 60g' },
  { id: 'g-536', name: '프로틴바 피넛버터', calories: 210, protein: 20, carbs: 18, fat: 8, servingSize: '1개 60g' },
  { id: 'g-537', name: '오트밀 (30g+물)', calories: 120, protein: 4, carbs: 20, fat: 2.5, servingSize: '30g+물 250ml' },
  { id: 'g-538', name: '흑미밥', calories: 310, protein: 7, carbs: 66, fat: 1.5, servingSize: '1공기 210g' },
  { id: 'g-539', name: '보리밥', calories: 295, protein: 6.5, carbs: 64, fat: 1, servingSize: '1공기 210g' },
  { id: 'g-540', name: '찰밥', calories: 380, protein: 7, carbs: 82, fat: 0.8, servingSize: '1공기 210g' },
  { id: 'g-541', name: '두부스테이크', calories: 260, protein: 18, carbs: 10, fat: 16, servingSize: '1인분 200g' },
  { id: 'g-542', name: '콩불 (콩고기볶음)', calories: 320, protein: 24, carbs: 22, fat: 14, servingSize: '1인분 250g' },
  { id: 'g-543', name: '비건 버거', calories: 500, protein: 22, carbs: 52, fat: 24, servingSize: '1개 230g' },
  { id: 'g-544', name: '콩국수', calories: 380, protein: 18, carbs: 56, fat: 10, servingSize: '1인분 400g' },
  { id: 'g-545', name: '두부김치', calories: 320, protein: 20, carbs: 16, fat: 18, servingSize: '1인분 300g' },
  { id: 'g-546', name: '마라로우웨이', calories: 580, protein: 20, carbs: 52, fat: 34, servingSize: '1인분 450g' },
  { id: 'g-547', name: '마라 전골', calories: 680, protein: 30, carbs: 44, fat: 44, servingSize: '1인분 600g' },
  { id: 'g-548', name: '양꼬치+쯔란 (10개)', calories: 760, protein: 56, carbs: 8, fat: 56, servingSize: '10개 400g' },
  { id: 'g-549', name: '꿔바로우', calories: 620, protein: 24, carbs: 68, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-550', name: '연어 포케', calories: 540, protein: 28, carbs: 64, fat: 20, servingSize: '1인분 400g' },
  { id: 'g-551', name: '참치 포케', calories: 500, protein: 30, carbs: 62, fat: 16, servingSize: '1인분 380g' },
  { id: 'g-552', name: '아보카도볼 라이스', calories: 580, protein: 16, carbs: 78, fat: 24, servingSize: '1인분 400g' },
  { id: 'g-553', name: '솜땀 (태국파파야샐러드)', calories: 160, protein: 6, carbs: 28, fat: 4, servingSize: '1인분 250g' },
  { id: 'g-554', name: '카오만가이', calories: 520, protein: 32, carbs: 64, fat: 16, servingSize: '1인분 420g' },
  { id: 'g-555', name: '팟씨유', calories: 540, protein: 18, carbs: 72, fat: 22, servingSize: '1인분 400g' },
  { id: 'g-556', name: '레드카레 (태국)', calories: 440, protein: 22, carbs: 22, fat: 30, servingSize: '1인분 300g' },
  { id: 'g-557', name: '샤와르마', calories: 580, protein: 28, carbs: 52, fat: 28, servingSize: '1인분 300g' },
  { id: 'g-558', name: '팔라펠 (5개)', calories: 340, protein: 14, carbs: 40, fat: 16, servingSize: '5개 150g' },
  { id: 'g-559', name: '후무스 (100g)', calories: 160, protein: 7, carbs: 16, fat: 8, servingSize: '100g' },
  { id: 'g-560', name: '감바스 알 아히요', calories: 420, protein: 22, carbs: 8, fat: 34, servingSize: '1인분 200g' },
  { id: 'g-561', name: '탄두리치킨 (1인분)', calories: 380, protein: 40, carbs: 8, fat: 22, servingSize: '1인분 250g' },
  { id: 'g-562', name: '버팔로윙 (6개)', calories: 520, protein: 32, carbs: 16, fat: 36, servingSize: '6개 240g' },
  { id: 'g-563', name: '피시앤칩스', calories: 680, protein: 28, carbs: 72, fat: 32, servingSize: '1인분 400g' },
  { id: 'g-564', name: '잉글리시브렉퍼스트', calories: 820, protein: 38, carbs: 48, fat: 50, servingSize: '1인분 500g' },
  { id: 'g-565', name: '맥앤치즈', calories: 540, protein: 18, carbs: 68, fat: 22, servingSize: '1인분 300g' },
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

/** 카테고리 키워드 → 해당 음식 id 목록 (카테고리명으로 검색 지원) */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '과일': ['b-260','b-261','b-262','b-263','b-264','b-265','b-266','b-267','b-268',
            'b-269','b-270','b-271','b-272','b-273','b-274','b-275','b-276','b-277',
            'b-278','b-279','b-280a','b-280b','b-280c','b-280d','b-280e','b-280f',
            'b-280g','b-280h','b-280i','b-280j'],
  '채소': ['b-220','b-221','b-222','b-223','b-224','b-225','b-226','b-227','b-228',
            'b-229','b-230','b-231','b-232','b-233','b-234','b-235','b-236','b-237',
            'b-238','b-239','b-240','b-241','b-242','b-243','b-244','b-245','b-246',
            'b-247','b-248','b-249','b-250'],
  '육류': ['b-001','b-002','b-003','b-004','b-013','b-014','b-015','b-023','b-024','b-025'],
  '해산물': ['b-040','b-041','b-042','b-043','b-044','b-045'],
  '유제품': ['b-280','b-281','b-282','b-283'],
  '카페': ['c-001','c-003','c-011','c-030','c-040','c-060','c-080','c-100','c-106',
            'c-109','c-114','c-116','c-119','c-127','c-131','c-140','c-142','c-146'],
  '커피': ['c-001','c-002','c-003','c-004','c-005','c-006','c-007','c-008','c-009','c-010',
            'b-340','b-341','b-342','b-505','b-506'],
  '디저트': ['c-100','c-101','c-106','c-109','c-114','c-116','c-119','c-120','c-121',
              'c-122','c-123','c-124','c-126','c-127','c-128','c-131','c-132','c-133',
              'c-134','b-313','b-314','b-570','b-571','d-260','d-261','d-262','d-263'],
  '케이크': ['c-126','c-127','c-128','c-131','c-132','c-133','c-134','b-313','b-570',
              'b-571','b-575','c-214','c-215'],
  '음료': ['c-040','c-041','c-042','c-043','c-044','c-045','c-046','c-047','c-048',
            'c-049','c-060','c-061','c-062','c-063','c-080','c-081','c-082','c-084',
            'd-400','d-401','d-402','d-403','d-404','d-405','d-406','d-407','d-408'],
  // 반찬
  '반찬': ['d-001','d-002','d-003','d-004','d-005','d-006','d-007','d-008','d-009','d-010',
            'd-011','d-012','d-013','d-014','d-015','d-016','d-017','d-018','d-019','d-020',
            'd-021','d-022','d-023','d-024','d-025','d-026','d-027','d-028','d-029'],
  '나물': ['d-001','d-002','d-003','d-004','d-005','d-006','d-007','d-008','d-009','d-010'],
  '조림': ['d-011','d-014','d-015','d-016','d-017','d-018','d-030','d-031','d-032'],
  '김치': ['d-023','d-024','d-025','d-026','d-027','d-028','d-029'],
  // 국밥 / 탕
  '국밥': ['d-050','d-051','d-052','d-053','d-054','d-055','d-056','d-057','d-058',
            'd-059','d-060','d-061','d-062','d-063'],
  '탕': ['d-053','d-054','d-055','d-057','d-058','d-059','d-060','d-061','d-063'],
  '해장국': ['d-053','d-054','d-055'],
  '삼계탕': ['d-061'],
  // 중식
  '중식': ['d-100','d-101','d-102','d-103','d-104','d-105','d-106','d-107','d-108',
            'd-109','d-110','d-111','d-112','d-113','d-114','d-115','d-116','d-117',
            'd-118','d-119','d-120'],
  '마라': ['d-107','d-108','d-109'],
  '마라탕': ['d-107'],
  '마라샹궈': ['d-108'],
  '탕수육': ['d-103','d-290'],
  '짜장': ['d-100'],
  '짬뽕': ['d-101'],
  // 파스타 / 이탈리안
  '파스타': ['d-140','d-141','d-142','d-143','d-144','d-145','d-146','d-147','d-148',
              'd-149','d-150','d-151','d-152','d-168','d-169'],
  '리조또': ['d-148','d-149','d-150'],
  '이탈리안': ['d-140','d-141','d-142','d-143','d-144','d-145','d-146','d-147','d-148',
                'd-149','d-150','d-151','d-152'],
  // 스테이크
  '스테이크': ['d-160','d-161','d-162','d-163','d-164','d-165','d-166','d-167'],
  '서양식': ['d-140','d-141','d-142','d-143','d-144','d-145','d-146','d-147','d-148',
              'd-149','d-150','d-151','d-152','d-160','d-161','d-162','d-163','d-164',
              'd-165','d-166','d-167','d-168','d-169','d-180','d-181','d-182','d-183',
              'd-184','d-185','d-186','d-187','d-188','d-189'],
  // 샐러드
  '샐러드': ['d-180','d-181','d-182','d-183','d-184','d-185','d-186','d-187','d-188',
              'd-189','d-190','d-191','d-192'],
  // 멕시칸
  '멕시칸': ['d-200','d-201','d-202','d-203','d-204','d-205','d-206','d-207','d-208'],
  '타코': ['d-200','d-201'],
  '부리또': ['d-202','d-203'],
  // 동남아 / 인도
  '동남아': ['d-225','d-226','d-227','d-228','d-229','d-230','d-231','d-232','d-233','d-234','d-235'],
  '인도': ['d-220','d-221','d-222','d-223','d-224'],
  '카레': ['d-220','d-221','d-222','d-224','d-226'],
  '태국': ['d-225','d-226','d-227'],
  '쌀국수': ['d-230','d-232'],
  '베트남': ['d-230','d-231','d-232','d-233','d-234'],
  // 길거리 / 포장마차
  '포장마차': ['d-250','d-251','d-252','d-253','d-254','d-255','d-256','d-257','d-258',
                'd-259','d-260','d-261','d-262','d-263','d-264'],
  '길거리음식': ['d-250','d-251','d-252','d-253','d-254','d-255','d-256','d-257','d-258',
                  'd-259','d-260','d-261','d-262','d-263','d-264'],
  '붕어빵': ['d-252'],
  '호떡': ['d-251'],
  '도넛': ['d-260','d-261'],
  // 돈가스 / 튀김
  '돈가스': ['d-280','d-281','d-282','d-287','d-291'],
  '튀김': ['d-283','d-284','d-285','d-286','d-287','d-288','d-289','d-290','d-291'],
  '일식': ['d-258','d-288','d-289','d-408','d-500','d-501','d-502','d-503','d-504',
            'd-505','d-506','d-507','d-508','d-509','d-510','d-511','d-512','d-520',
            'd-521','d-522','d-523','d-524','d-525','d-526','d-527','d-528','d-529',
            'd-530','d-531','d-532','d-540','d-541','d-542','d-543','d-544','d-545',
            'd-546','d-547','d-548','d-549','d-550','d-551','d-552','d-553','d-554',
            'd-555','d-556','d-557'],
  '텐동': ['d-288'],
  // 건강식 / 다이어트
  '건강식': ['d-310','d-311','d-312','d-313','d-314','d-315','d-316','d-317','d-318',
              'd-319','d-320','d-321','d-322','d-323','d-324','d-325','d-326','d-327',
              'd-328','d-329','d-330','d-331'],
  '다이어트': ['d-310','d-313','d-314','d-315','d-316','d-318','d-319','d-320','d-321',
                'd-322','d-325','d-326','d-327','d-328'],
  '닭가슴살': ['d-310','d-316','d-321','d-326'],
  '헬스': ['d-318','d-319','d-320','d-321','d-322','d-323','d-324','d-326','d-327'],
  '단백질': ['d-318','d-319','d-320','d-326'],
  // 분식
  '분식': ['d-350','d-351','d-352','d-353','d-354','d-355','d-356','d-357','d-358',
            'd-359','d-360','d-361','d-362','d-363'],
  '떡볶이': ['d-350','d-351','d-352','d-353'],
  '순대': ['d-355','d-356'],
  // 술 / 주류
  '술': ['d-400','d-401','d-402','d-403','d-404','d-405','d-406','d-407','d-408','d-409','d-410'],
  '주류': ['d-400','d-401','d-402','d-403','d-404','d-405','d-406','d-407','d-408','d-409','d-410'],
  '소주': ['d-400','d-401','d-409'],
  '맥주': ['d-402','d-403','d-410'],
  '막걸리': ['d-404'],
  '와인': ['d-405','d-406'],
  // 야식 / 안주
  '야식': ['d-420','d-421','d-422','d-423','d-424','d-425','d-426','d-427','d-428',
            'd-429','d-430','d-431'],
  '안주': ['d-424','d-425','d-426','d-427','d-428','d-429','d-430','d-431'],
  '치킨': ['d-420'],
  '피자': ['d-421','d-422','d-423','d-860','d-861','d-862','d-863','d-864','d-865','d-866'],
  // 일식 상세
  '라멘': ['d-500','d-501','d-502','d-503','d-504','d-511','d-512'],
  '돈코츠': ['d-503'],
  '우동': ['d-505','d-506','d-548'],
  '소바': ['d-507','d-508','d-509','d-510'],
  '초밥': ['d-520','d-521','d-522','d-523','d-524','d-525','d-529'],
  '스시': ['d-520','d-521','d-522','d-523','d-524','d-525','d-526','d-527','d-528','d-529'],
  '사시미': ['d-530','d-531','d-532'],
  '롤': ['d-526','d-527','d-528'],
  '돈부리': ['d-540','d-541','d-542','d-543','d-544','d-545','d-546','d-547'],
  '규동': ['d-540','d-541'],
  '오야코동': ['d-542'],
  '가츠동': ['d-543'],
  '야키토리': ['d-553'],
  '오코노미야키': ['d-555'],
  // 편의점
  '편의점': ['d-600','d-601','d-602','d-603','d-604','d-605','d-606','d-607','d-608',
              'd-609','d-610','d-611','d-612','d-613','d-614','d-615','d-616','d-617'],
  '간편식': ['d-600','d-601','d-602','d-610','d-611','d-612','d-613','d-614'],
  '컵라면': ['d-607','d-608','d-609'],
  // 라면
  '라면': ['d-630','d-631','d-632','d-633','d-634','d-635','d-636','d-637','d-638',
            'd-639','d-607','d-608','d-609'],
  '신라면': ['d-630'],
  '짜파게티': ['d-633'],
  '불닭': ['d-634','d-609'],
  // 과자
  '과자': ['d-650','d-651','d-652','d-653','d-654','d-655','d-656','d-657','d-658',
            'd-659','d-660','d-661','d-662','d-663','d-664','d-665','d-666','d-667',
            'd-668','d-669','d-670','d-671','d-672'],
  '스낵': ['d-650','d-651','d-652','d-653','d-657','d-658','d-659','d-660','d-661',
            'd-670','d-671','d-672'],
  '초콜릿': ['d-770','d-771','d-772','d-655','d-656'],
  '너트': ['d-663','d-664','d-665','d-666','d-667'],
  '견과': ['d-663','d-664','d-665','d-666','d-667'],
  // 빵/베이커리
  '빵': ['d-700','d-701','d-702','d-703','d-704','d-705','d-706','d-707','d-708',
          'd-709','d-710','d-711','d-712','d-713','d-714','d-715','d-716','d-717',
          'd-718','d-719','d-720','d-721','d-722','d-723'],
  '베이커리': ['d-700','d-701','d-702','d-703','d-704','d-705','d-706','d-707','d-708',
               'd-709','d-710','d-711','d-712','d-713','d-714','d-716','d-717','d-719'],
  '크루아상': ['d-702'],
  '베이글': ['d-703','d-704','d-723'],
  '팬케이크': ['d-720'],
  '와플': ['d-721'],
  // 아침식사 / 브런치
  '아침식사': ['d-720','d-721','d-722','d-740','d-741','d-742','d-743','d-744','d-745',
               'd-746','d-747','d-748','d-749','d-750','d-751','d-752'],
  '브런치': ['d-740','d-741','d-742','d-743','d-744','d-752','d-753','d-754'],
  '에그베네딕트': ['d-740'],
  '오믈렛': ['d-744'],
  '그릭요거트': ['d-748','d-749'],
  '시리얼': ['d-745','d-746'],
  '오트밀': ['d-747','d-323'],
  '수프': ['d-753','d-754','d-755','d-756'],
  // 아이스크림
  '아이스크림': ['d-773','d-774','d-775','d-776','d-777','d-778','d-779','d-556'],
  '아이스': ['d-773','d-774','d-775','d-776','d-777','d-778','d-779'],
  // 구이
  '구이': ['d-800','d-801','d-802','d-803','d-804','d-805','d-806','d-807','d-808',
            'd-809','d-810','d-811','d-812','d-813'],
  '삼겹살': ['d-800','d-805'],
  '갈비': ['d-807','d-808','d-809'],
  '양꼬치': ['d-812'],
  // 패스트푸드
  '패스트푸드': ['f-100','f-101','f-102','f-103','f-104','f-105','f-106','f-107',
                  'd-830','d-831','d-832','d-833','d-834','d-835','d-836','d-837',
                  'd-838','d-839','d-840','d-841','d-842','d-843'],
  '버거': ['f-100','f-101','f-102','f-103','d-830','d-831','d-832','d-833','d-834',
            'd-836','d-837','d-838','d-839'],
  '버거킹': ['d-830','d-831','d-832'],
  '롯데리아': ['d-833','d-834'],
  'kfc': ['d-835','d-836'],
  '맘스터치': ['d-837'],
  '서브웨이': ['d-841','d-842','d-843'],
  '쉐이크쉑': ['d-838'],
  // 영양제
  '영양제': ['d-880','d-881','d-882','d-883','d-884','d-885'],
  '보조식품': ['d-880','d-881','d-882','d-883','d-884','d-885'],
  '프로틴': ['d-883','d-319','d-320'],
  // 에너지/스포츠음료
  '에너지음료': ['e-001','e-002','e-003'],
  '스포츠음료': ['e-004','e-005','e-006','e-010'],
  '탄산음료': ['e-011','e-012','e-013','e-014','e-015','e-016','e-017'],
  '콜라': ['e-011','e-012','e-013'],
  '사이다': ['e-014','e-016'],
  '주스': ['e-018','e-019','e-020','e-021','e-022','e-240','e-241','e-242','e-243'],
  '에이드': ['e-245','e-246','e-247'],
  '식물성음료': ['e-023','e-024','e-025','e-026'],
  '두유': ['e-023'],
  // 냉면/막국수
  '냉면': ['e-050','e-051','e-052'],
  '막국수': ['e-053','e-054'],
  // 한식 찜
  '찜닭': ['e-070','e-071'],
  '보쌈': ['e-074'],
  '족발': ['e-075','e-076'],
  '잡채': ['e-079'],
  '전': ['e-081','e-082','e-220','e-221','e-222','e-223','e-224'],
  '죽': ['e-100','e-101','e-102','e-103','e-104','e-105','e-106','e-107','e-108'],
  '전복죽': ['e-100'],
  // 치킨 브랜드
  '교촌': ['e-140','e-141'],
  'bbq': ['e-142'],
  'bhc': ['e-143','e-144'],
  '굽네': ['e-145'],
  // 카페 브랜드
  '스타벅스': ['c-200','c-201','c-202','c-203','c-204','e-160','e-161','e-162','e-163'],
  '이디야': ['e-164'],
  '메가커피': ['e-165'],
  '빽다방': ['e-166'],
  '투썸': ['e-168'],
  // 아이스크림
  '빠삐코': ['e-180'],
  '메로나': ['e-181'],
  '하겐다즈': ['e-183'],
  '베스킨라빈스': ['e-184'],
}

/** 쿼리 문자열로 식품 검색
 *  - 카테고리 검색: 과일, 채소, 육류 등
 *  - 일반 검색: 이름에 쿼리 포함 여부
 *  - 초성 검색: ㅂㅁ → 빅맥, ㄱㅊㅈ → 김치찌개
 */
export function searchBuiltinFoods(q: string, limit = 6): BuiltinFood[] {
  const query = q.trim().toLowerCase()
  if (!query) return []

  // 카테고리 검색: "과일", "채소" 등
  const categoryIds = CATEGORY_KEYWORDS[query]
  if (categoryIds) {
    const idSet = new Set(categoryIds)
    return BUILTIN_FOODS.filter(f => idSet.has(f.id)).slice(0, limit)
  }

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
