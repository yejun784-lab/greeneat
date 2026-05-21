import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | GreenEat',
  description: 'GreenEat 서비스 이용약관',
}

const TOC = [
  { id: 'section1', title: '1. 서비스 이용 조건' },
  { id: 'section2', title: '2. 회원가입 및 탈퇴' },
  { id: 'section3', title: '3. 주문·결제·취소·환불' },
  { id: 'section4', title: '4. 구독 서비스 규정' },
  { id: 'section5', title: '5. 면책조항' },
  { id: 'section6', title: '6. 기타' },
]

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 헤더 */}
      <div className="mb-10">
        <span className="inline-block bg-[#e8f5ee] text-[#2d7a4f] text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Legal
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
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
            본 약관은 GreenEat(이하 &quot;회사&quot;)가 제공하는 밀키트 구독 및 쇼핑 서비스(이하 &quot;서비스&quot;)의
            이용 조건 및 절차, 회사와 이용자 간의 권리·의무 관계를 규정합니다.
            서비스에 가입하거나 이용함으로써 본 약관에 동의한 것으로 간주합니다.
          </p>

          {/* 섹션 1 */}
          <section id="section1" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              1. 서비스 이용 조건
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제1조 (목적)</strong><br />
                본 약관은 회사가 운영하는 GreenEat 서비스를 이용함에 있어 회사와 이용자 간의 권리·의무 및
                책임사항을 규정함을 목적으로 합니다.
              </p>
              <p>
                <strong>제2조 (서비스 내용)</strong><br />
                회사는 다음 서비스를 제공합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>밀키트 상품 구매 서비스</li>
                <li>정기 구독 서비스 (베이직·스탠다드·프리미엄)</li>
                <li>레시피 제공 및 식단 추천 서비스</li>
                <li>주문 현황 조회 및 배송 추적 서비스</li>
              </ul>
              <p>
                <strong>제3조 (이용 자격)</strong><br />
                만 14세 이상이면 누구나 서비스를 이용할 수 있습니다.
                만 14세 미만은 법정대리인의 동의를 받아야 합니다.
              </p>
              <p>
                <strong>제4조 (약관 변경)</strong><br />
                회사는 약관을 변경할 경우 시행일 7일 전 공지사항을 통해 안내합니다.
                변경에 동의하지 않으면 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 섹션 2 */}
          <section id="section2" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              2. 회원가입 및 탈퇴
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제5조 (회원가입)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>이용자는 이메일 주소와 비밀번호를 등록하거나 소셜 계정으로 가입할 수 있습니다.</li>
                <li>이메일 인증을 완료해야 서비스 이용이 가능합니다.</li>
                <li>타인의 정보를 도용하거나 허위 정보를 등록한 경우 서비스 이용이 제한됩니다.</li>
                <li>1인 1계정 원칙을 준수해야 합니다.</li>
              </ul>
              <p>
                <strong>제6조 (계정 관리)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>계정 정보는 마이페이지에서 수정할 수 있습니다.</li>
                <li>비밀번호는 암호화되어 저장되며, 분실 시 이메일 재설정 기능을 이용하세요.</li>
                <li>계정을 제3자와 공유하거나 양도할 수 없습니다.</li>
              </ul>
              <p>
                <strong>제7조 (회원 탈퇴)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>마이페이지 → 계정 설정에서 언제든지 탈퇴할 수 있습니다.</li>
                <li>탈퇴 시 진행 중인 주문이나 유효 구독이 있으면 처리 완료 후 탈퇴가 가능합니다.</li>
                <li>탈퇴 후 개인정보는 즉시 파기되며, 미사용 포인트·쿠폰은 소멸됩니다.</li>
              </ul>
            </div>
          </section>

          {/* 섹션 3 */}
          <section id="section3" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              3. 주문·결제·취소·환불
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제8조 (주문 및 결제)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>주문은 결제 완료 시 확정됩니다.</li>
                <li>결제 수단: 신용카드, 체크카드, 간편결제(토스페이, 카카오페이 등)</li>
                <li>결제는 토스페이먼츠를 통해 처리됩니다.</li>
                <li>주문 확인 이메일이 발송되지 않은 경우 고객센터로 문의하세요.</li>
              </ul>
              <p>
                <strong>제9조 (배송)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>배송은 결제 완료 후 영업일 기준 1~3일 이내 출고됩니다.</li>
                <li>신선 식품 특성상 제주·도서 산간 지역은 배송이 제한될 수 있습니다.</li>
                <li>배송비: 주문 금액 40,000원 이상 무료, 미만 시 3,000원</li>
              </ul>
              <p>
                <strong>제10조 (취소)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>주문 확정 후 <strong>출고 전</strong>까지 마이페이지에서 취소할 수 있습니다.</li>
                <li>출고 이후에는 취소가 불가하며, 환불 절차를 이용해야 합니다.</li>
              </ul>
              <p>
                <strong>제11조 (환불)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>수령 후 <strong>24시간 이내</strong>, 제품에 하자가 있거나 오배송된 경우 사진 첨부 후 고객센터로 신청하세요.</li>
                <li>신선 식품 특성상 단순 변심 환불은 제한될 수 있습니다.</li>
                <li>환불 승인 시 카드 결제는 영업일 3~5일, 간편결제는 결제사 정책에 따라 처리됩니다.</li>
                <li>쿠폰·포인트 사용분은 환불 시 복원됩니다.</li>
              </ul>
            </div>
          </section>

          {/* 섹션 4 */}
          <section id="section4" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              4. 구독 서비스 규정
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제12조 (구독 플랜)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>베이직:</strong> 39,900원/월, 주 2회 배송</li>
                <li><strong>스탠다드:</strong> 69,900원/월, 주 4회 배송</li>
                <li><strong>프리미엄:</strong> 99,900원/월, 주 6회 배송</li>
                <li>모든 구독 플랜은 무료 배송이 적용됩니다.</li>
              </ul>
              <p>
                <strong>제13조 (구독 결제 및 갱신)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>구독은 매월 가입일 기준으로 자동 갱신됩니다.</li>
                <li>갱신 3일 전 이메일로 결제 예정 안내를 발송합니다.</li>
                <li>결제 실패 시 3일 이내 재시도되며, 재시도 실패 시 구독이 일시 정지됩니다.</li>
              </ul>
              <p>
                <strong>제14조 (구독 변경 및 해지)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>플랜 변경은 마이페이지에서 언제든지 가능하며, 다음 결제 주기부터 적용됩니다.</li>
                <li>해지는 다음 결제일 <strong>하루 전</strong>까지 신청해야 이번 달 요금이 청구되지 않습니다.</li>
                <li>해지 후 남은 기간의 서비스는 정상 제공되며, 잔여 일수에 대한 환불은 제공되지 않습니다.</li>
                <li>구독 해지 후 30일 이내 재가입 시 기존 혜택이 유지됩니다.</li>
              </ul>
              <p>
                <strong>제15조 (배송 일정 변경)</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>출고 예정일 <strong>48시간 전</strong>까지 마이페이지에서 배송 일정을 변경할 수 있습니다.</li>
                <li>배송 건너뛰기(스킵)는 월 최대 2회까지 가능하며, 해당 회차 밀키트는 제공되지 않습니다.</li>
              </ul>
            </div>
          </section>

          {/* 섹션 5 */}
          <section id="section5" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              5. 면책조항
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제16조 (서비스 중단)</strong><br />
                회사는 다음 경우 서비스 제공을 일시 중단할 수 있으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>시스템 정기점검, 교체, 고장 등</li>
                <li>천재지변, 국가 비상 사태, 정전 등 불가항력적 사유</li>
                <li>서비스 구조 변경이 불가피한 경우</li>
              </ul>
              <p>
                <strong>제17조 (배송 지연)</strong><br />
                천재지변, 기상 악화, 물류사 사정 등으로 인한 배송 지연에 대해 회사는 최대한 안내하되,
                직접적인 손해에 대한 책임은 제한될 수 있습니다.
              </p>
              <p>
                <strong>제18조 (알레르기 및 건강)</strong><br />
                밀키트 제품의 알레르기 유발 성분은 상품 상세 페이지에 표기됩니다.
                이용자는 구매 전 반드시 확인해야 하며, 확인 없는 섭취로 인한 건강 문제에 대해 회사는 책임을 지지 않습니다.
              </p>
              <p>
                <strong>제19조 (이용자 귀책)</strong><br />
                이용자의 부주의, 잘못된 정보 입력(배송지 오류 등)으로 발생한 손해에 대해 회사는 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          {/* 섹션 6 */}
          <section id="section6" className="mb-10 scroll-mt-6">
            <h2 className="text-xl font-bold text-[#2d7a4f] mb-4 pb-2 border-b border-[#d0e8da]">
              6. 기타
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>제20조 (분쟁 해결)</strong><br />
                서비스 이용으로 발생한 분쟁은 상호 협의로 해결하며,
                협의가 이루어지지 않을 경우 소비자분쟁조정위원회의 조정에 따릅니다.
                소송이 필요한 경우 회사 소재지 관할 법원을 전속 관할 법원으로 합니다.
              </p>
              <p>
                <strong>제21조 (준거법)</strong><br />
                본 약관은 대한민국 법령에 따라 해석됩니다.
              </p>
              <div className="bg-[#f8faf9] border border-[#d0e8da] rounded-xl p-5 mt-4">
                <p className="font-semibold text-gray-700 mb-2">고객센터</p>
                <p className="mb-1">이메일: support@greeneat.kr</p>
                <p>영업시간: 평일 10:00 ~ 18:00 (점심 12:00 ~ 13:00 제외)</p>
              </div>
            </div>
          </section>

          <p className="text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
            본 약관은 2026년 5월 21일부터 시행됩니다.
          </p>
        </article>
      </div>
    </div>
  )
}
