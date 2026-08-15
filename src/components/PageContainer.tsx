import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  scrollable?: boolean
}

export function PageContainer({ children, scrollable = true }: PageContainerProps) {
  return (
    <div
      className={`flex-1 bg-gray-50 ${scrollable ? 'overflow-y-auto' : ''}`}
    >
      <div className="px-4 py-4 space-y-3">
        {children}
      </div>
    </div>
  )
}
