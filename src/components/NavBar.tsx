import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface NavBarProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  backgroundColor?: string
  leftElement?: ReactNode
  rightElement?: ReactNode
  centerElement?: ReactNode
}

export function NavBar({ title, showBack, onBack, backgroundColor = '#ffffff', leftElement, rightElement, centerElement }: NavBarProps) {
  return (
    <div
      className="grid grid-cols-[1fr_minmax(0,2fr)_1fr] items-center h-[44px] px-4 text-base font-semibold text-gray-900 border-b border-gray-100"
      style={{ backgroundColor }}
    >
      {/* Left: back button 或自定义元素 */}
      <div className="justify-self-start">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 text-sm text-gray-600 active:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>返回</span>
          </button>
        ) : (
          leftElement
        )}
      </div>

      {/* Center: title or custom element */}
      {centerElement || (
        <span className="select-none truncate text-center min-w-0">
          {title}
        </span>
      )}

      {/* Right: capsule */}
      <div className="justify-self-end">
        {rightElement}
      </div>
    </div>
  )
}
