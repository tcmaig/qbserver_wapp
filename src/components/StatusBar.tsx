export function StatusBar() {
  const now = new Date()
  const time = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="flex items-center justify-between px-6 h-[44px] bg-white text-xs font-medium text-gray-900">
      <span className="font-semibold">{time}</span>
      <svg width="48" height="12" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" className="text-gray-900">
        <title id="title">iPhone Wi-Fi and battery status icons</title>
        <desc id="desc">iOS-style Wi-Fi and full battery indicators. Color is controlled by currentColor.</desc>
        <g id="wifi" fill="currentColor">
          <path d="M0.2007 3.0805C4.3154-0.9907 10.9879-0.9907 15.1026 3.0805C15.3445 3.3199 15.3485 3.7097 15.1115 3.9541L14.1965 4.8977C13.9676 5.1338 13.593 5.1377 13.3593 4.9067C10.2082 1.7935 5.0951 1.7935 1.944 4.9067C1.7103 5.1377 1.3357 5.1338 1.1068 4.8977L0.1918 3.9541C-0.0452 3.7097 -0.0412 3.3199 0.2007 3.0805Z"/>
          <path d="M2.8738 5.8372C5.514 3.2806 9.7893 3.2806 12.4295 5.8372C12.678 6.0779 12.6834 6.4734 12.4416 6.7208L11.5267 7.6566C11.3018 7.8866 10.9351 7.892 10.7037 7.6688C9.0187 6.0433 6.2846 6.0433 4.5996 7.6688C4.3682 7.892 4.0015 7.8866 3.7766 7.6566L2.8617 6.7208C2.6199 6.4734 2.6253 6.0779 2.8738 5.8372Z"/>
          <path d="M5.5738 8.5968C6.7274 7.505 8.5759 7.505 9.7295 8.5968C9.99 8.8435 9.997 9.2558 9.7451 9.5112L8.0628 11.2167C7.835 11.4476 7.4683 11.4476 7.2405 11.2167L5.5582 9.5112C5.3063 9.2558 5.3133 8.8435 5.5738 8.5968Z"/>
        </g>
        <g id="battery">
          <rect x="22.5" y="0.5" width="22" height="11" rx="3.1667" stroke="currentColor" strokeOpacity="0.35"/>
          <path d="M45.5 4V8C46.3047 7.6612 46.8333 6.8731 46.8333 6C46.8333 5.1269 46.3047 4.3388 45.5 4Z" fill="currentColor" fillOpacity="0.40"/>
          <rect x="24" y="2" width="19" height="8" rx="1.3333" fill="currentColor"/>
        </g>
      </svg>
    </div>
  )
}
