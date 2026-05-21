import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | GreenEat',
  description: 'GreenEat 개인정보처리방침',
}

const TOC = [
  { id: 'section1', title: '1. 수집하는 개인정보 항목' },
  { id: 'section2', title: '2. 개인정보 수집 목적' },
  { id: 'section3', title: '3. 개인정보 보유 및 이용 기간' },
  { id: 'section4', title: '4. 제3자 제공' },
  { id: 'section5', title: '5. 이용자 권리' },
  { id: 'section6', title: '6. 쿠키 사용' },
  { id: 'section7', title: '7. 개인정보 보호책임자' },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 헤더 */}
      <div className="mb-10">
        <span className="inline-block bg-[#e8f5ee] text-[#2d7a4f] text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Legal
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-gray-500 text-sm">최종 업데이트: 2026년 5월 21일</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* 목차 */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-6 bg-[#f8faf9] border border-[#d0e8da] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-wide mb-3">목차</p>
            <nav className="flex flex-col gap-2">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-gray-600 hover:text-[#2d7a4f] transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* 본문 */}
        <article className="flex-1 prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">
            GreenEat(이하 &quot;회사&quot;)는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」,
            「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.
            본 방침은 회사가 제공하는 서비스(웹사이트, 앱 등)에 적용됩니다.
          </p>

          {/* 섹션 1 */}
          <section id="section1" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              1. 수집하는 개인정보 항목
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-1">필수 수집 항목</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>이름(실명), 이메일 주소, 비밀번호(암호화 저장)</li>
                  <li>휴대폰 번호</li>
                  <li>배송지 주소 (도로명 주소, 상세 주소, 우편번호)</li>
                  <li>결제 정보: 신용·체크카드 정보(카드번호, 유효기간 — 토스페이먼츠를 통해 처리, 회사는 저장하지 않음)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">선택 수집 항목</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>생년월일 (연령 확인, 맞춤 혜택 제공)</li>
                  <li>음식 알레르기·식이 제한 정보 (밀키트 추천 목적)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">자동 수집 항목</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>IP 주소, 접속 기기 정보, 브라우저 종류</li>
                  <li>서비스 이용 기록, 구매 내역, 쿠키</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 섹션 2 */}
          <section id="section2" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              2. 개인정보 수집 목적
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>회원 관리:</strong> 회원 가입·탈퇴, 본인 확인, 부정 이용 방지</li>
              <li><strong>서비스 제공:</strong> 주문 처리, 결제, 배송 및 배송 현황 안내</li>
              <li><strong>구독 서비스 운영:</strong> 정기 구독 관리, 구독 갱신·해지 처리</li>
              <li><strong>고객 지원:</strong> 문의 접수 및 응대, 분쟁 해결</li>
              <li><strong>마케팅 및 광고 (동의 시):</strong> 이벤트·프로모션 안내, 맞춤 상품 추천</li>
              <li><strong>서비스 개선:</strong> 접속 통계 분석, 서비스 품질 향상</li>
            </ul>
          </section>

          {/* 섹션 3 */}
          <section id="section3" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              3. 개인정보 보유 및 이용 기간
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다.
              단, 아래의 경우 해당 기간 동안 보관합니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f8faf9]">
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">보유 근거</th>
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">보유 항목</th>
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">기간</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td className="p-3 border border-[#d0e8da]">계약·청약철회 기록</td>
                    <td className="p-3 border border-[#d0e8da]">5년</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td className="p-3 border border-[#d0e8da]">대금 결제·재화 공급 기록</td>
                    <td className="p-3 border border-[#d0e8da]">5년</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td className="p-3 border border-[#d0e8da]">소비자 불만·분쟁 처리 기록</td>
                    <td className="p-3 border border-[#d0e8da]">3년</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">통신비밀보호법</td>
                    <td className="p-3 border border-[#d0e8da]">서비스 접속 로그</td>
                    <td className="p-3 border border-[#d0e8da]">3개월</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 섹션 4 */}
          <section id="section4" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              4. 개인정보 제3자 제공
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              단, 서비스 이행을 위해 아래 업체에 최소한의 정보를 제공합니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f8faf9]">
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">제공 대상</th>
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">제공 항목</th>
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">제공 목적</th>
                    <th className="text-left p-3 border border-[#d0e8da] font-semibold text-gray-700">보유 기간</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">토스페이먼츠(주)</td>
                    <td className="p-3 border border-[#d0e8da]">이름, 결제 정보</td>
                    <td className="p-3 border border-[#d0e8da]">결제 처리 및 환불</td>
                    <td className="p-3 border border-[#d0e8da]">관련 법령 준수</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#d0e8da]">배송 대행사</td>
                    <td className="p-3 border border-[#d0e8da]">이름, 연락처, 배송지 주소</td>
                    <td className="p-3 border border-[#d0e8da]">밀키트 배송</td>
                    <td className="p-3 border border-[#d0e8da]">배송 완료 후 즉시 파기</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 섹션 5 */}
          <section id="section5" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              5. 이용자 권리 및 행사 방법
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>이용자는 언제든지 자신의 개인정보를 <strong>조회·수정·삭제</strong>할 수 있습니다.</li>
              <li>회원 탈퇴 시 개인정보는 즉시 파기됩니다(단, 법령에 따라 보존이 필요한 정보 제외).</li>
              <li>개인정보 처리에 대한 동의를 거부할 수 있으며, 이 경우 일부 서비스 이용이 제한될 수 있습니다.</li>
              <li>권리 행사는 이메일(<strong>support@greeneat.kr</strong>) 또는 마이페이지에서 직접 처리 가능합니다.</li>
              <li>개인정보 관련 민원은 개인정보보호위원회(privacy.go.kr) 또는 한국인터넷진흥원(privacy.kisa.or.kr)에 신고할 수 있습니다.</li>
            </ul>
          </section>

          {/* 섹션 6 */}
          <section id="section6" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              6. 쿠키(Cookie) 사용
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                회사는 로그인 상태 유지, 장바구니 저장, 서비스 개선을 위해 쿠키를 사용합니다.
              </p>
              <p>
                이용자는 브라우저 설정(도구 → 인터넷 옵션 → 개인정보)을 통해 쿠키 저장을 거부할 수 있습니다.
                단, 쿠키를 거부하면 로그인이 필요한 서비스 이용이 어려울 수 있습니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>필수 쿠키:</strong> 로그인 세션 유지, 장바구니 정보 (거부 불가)</li>
                <li><strong>분석 쿠키:</strong> 방문 통계 수집 (거부 가능)</li>
                <li><strong>마케팅 쿠키:</strong> 맞춤 광고 (동의 시 사용, 거부 가능)</li>
              </ul>
            </div>
          </section>

          {/* 섹션 7 */}
          <section id="section7" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              7. 개인정보 보호책임자
            </h2>
            <div className="bg-[#f8faf9] border border-[#d0e8da] rounded-xl p-5 text-sm text-gray-700">
              <p className="mb-1"><strong>회사명:</strong> GreenEat</p>
              <p className="mb-1"><strong>담당 부서:</strong> 서비스 운영팀</p>
              <p className="mb-1"><strong>이메일:</strong> support@greeneat.kr</p>
              <p><strong>처리 시간:</strong> 영업일 기준 3일 이내 답변</p>
            </div>
          </section>

          <p className="text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
            본 방침은 2026년 5월 21일부터 시행되며, 내용이 변경될 경우 서비스 공지사항을 통해 안내합니다.
          </p>
        </article>
      </div>
    </div>
  )
}
