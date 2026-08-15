export function CapsuleButton() {
  return (
    <div>
      <svg
        width="80"
        height="29"
        viewBox="0 0 174 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* 胶囊背景 */}
        <rect
          x="1"
          y="1"
          width="172"
          height="62"
          rx="31"
          fill="rgba(255,255,255,0.92)"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
        />

        {/* 分隔线 */}
        <path
          d="M87 14V50"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2"
        />

        {/* 更多：三个圆点 */}
        <circle cx="35" cy="32" r="4" fill="#000" />
        <circle cx="47" cy="32" r="4" fill="#000" />
        <circle cx="59" cy="32" r="4" fill="#000" />

        {/* 关闭/小程序圆形按钮 */}
        <circle
          cx="130"
          cy="32"
          r="12"
          stroke="#000"
          strokeWidth="4"
        />
        <circle cx="130" cy="32" r="4" fill="#000" />
      </svg>
    </div>
  )
}
