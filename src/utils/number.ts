export const formatCurrency = (amount: number, currency = 'KRW') => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}
// 사용: formatCurrency(10000) -> "₩10,000"
