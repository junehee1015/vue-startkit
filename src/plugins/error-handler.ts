import type { App } from 'vue'

export const setupErrorHandler = (app: App) => {
  // Vue 내부 에러 (컴포넌트 라이프사이클, 렌더링, 이벤트 핸들러 등)
  app.config.errorHandler = (err, instance, info) => {
    console.group('%c🚨 [Vue Global Error]', 'color: red; font-weight: bold; font-size: 14px;')
    console.error('Error:', err)
    console.error('Info:', info)
    console.error('Component Instance:', instance)
    console.groupEnd()
  }

  // 비동기 에러
  // try/catch로 잡지 못한 Promise 에러가 발생했을 때 호출됩니다.
  window.addEventListener('unhandledrejection', (event) => {
    console.group(
      '%c🚨 [Unhandled Promise Rejection]',
      'color: orange; font-weight: bold; font-size: 14px;',
    )
    console.error('Reason:', event.reason)
    console.groupEnd()
  })

  // 글로벌 런타임 에러 (문법 에러, 리소스 로드 실패 등)
  window.addEventListener('error', (event) => {
    console.group('%c🚨 [Global Sync Error]', 'color: darkred; font-weight: bold; font-size: 14px;')
    console.error('Message:', event.message)
    console.error('File:', event.filename)
    console.error('Line/Col:', `${event.lineno}:${event.colno}`)
    console.error('Error Object:', event.error)
    console.groupEnd()
  })
}
