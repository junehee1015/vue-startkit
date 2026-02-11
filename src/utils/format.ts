/**
 * 날짜 포맷팅
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format)
}

/**
 * 날짜 시간 포맷팅
 */
export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 숫자를 3자리마다 콤마를 찍어 문자열로 변환 (예: 1000 -> "1,000")
 */
export const formatNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null || num === '') return '0'
  const n = typeof num === 'string' ? Number(num) : num
  return isNaN(n) ? '0' : n.toLocaleString('ko-KR')
}

/**
 * 금액 표시 (예: 10000 -> "₩10,000")
 */
export const formatCurrency = (amount: number, currency = 'KRW') => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * 전화번호 하이픈(-) 자동 추가 (01012345678 -> 010-1234-5678)
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  const cleanPhone = phone.replace(/[^0-9]/g, '')

  if (cleanPhone.length < 4) return cleanPhone
  if (cleanPhone.length < 7) return cleanPhone.replace(/(\d{3})(\d{1,})/, '$1-$2')
  if (cleanPhone.length < 11) return cleanPhone.replace(/(\d{3})(\d{3})(\d{1,})/, '$1-$2-$3')
  return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}
