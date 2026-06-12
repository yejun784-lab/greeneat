import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1a1a18] dark:bg-[#1c1a17] text-[#9a9690] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 상단 — 고객센터 + 메뉴 + 회사정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* 고객센터 */}
          <div>
            <p className="text-white font-bold text-lg mb-3">고객센터</p>
            <p className="text-white text-3xl font-bold tracking-tight mb-2">1555-5952</p>
            <p className="text-sm leading-relaxed text-[#b8b4ae]">
              평일 09:30 – 17:30<br />
              점심 12:00 – 13:00<br />
              토, 일, 공휴일 휴무
            </p>
          </div>

          {/* 메뉴 */}
          <div>
            <p className="text-white font-medium mb-3">서비스</p>
            <ul className="space-y-2 text-sm text-[#b8b4ae]">
              <li><Link href="/products"      className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">도시락 쇼핑</Link></li>
              <li><Link href="/subscription"  className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">구독 플랜</Link></li>
              <li><Link href="/my/orders"     className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">주문 내역</Link></li>
              <li><Link href="/terms"         className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">이용약관</Link></li>
              <li><Link href="/privacy"       className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/faq"           className="inline-block py-1.5 -my-1.5 hover:text-white transition-colors">이용안내</Link></li>
            </ul>
          </div>

          {/* 입금안내 */}
          <div>
            <p className="text-white font-medium mb-3">입금안내</p>
            <p className="text-sm leading-relaxed text-[#b8b4ae]">
              신한은행 140015394516<br />
              예금주: 그린잇
            </p>
            <p className="text-xs mt-3 leading-relaxed text-[#8a8680]">
              구매안전서비스: 고객님은 안전거래를 위해 현금 등으로 결제 시
              저희 쇼핑몰이 가입한 PG에스크로 구매안전서비스를 이용하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="border-t border-[#2e2c28] pt-6 text-xs text-[#8a8680] leading-relaxed space-y-1">
          <p>
            법인명: 그린잇&nbsp;&nbsp;|&nbsp;&nbsp;
            대표자: 오안시&nbsp;&nbsp;|&nbsp;&nbsp;
            전화: 1555-5952&nbsp;&nbsp;|&nbsp;&nbsp;
            사업자등록번호: 601-85-17320&nbsp;&nbsp;|&nbsp;&nbsp;
            통신판매업 신고: 2025-서울금천-1242
          </p>
          <p>
            주소: 08506 서울특별시 금천구 가산디지털로 145 (가산동) 3차동 지하층 B108-B111호
          </p>
          <p>
            개인정보관리책임: 주식회사 그린잇 (greeneat0419@naver.com)
          </p>
          <p className="mt-3 text-[#6e6a64]">
            Copyright © 2026 그린잇. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
