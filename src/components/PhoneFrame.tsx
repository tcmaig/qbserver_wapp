import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="bg-gray-200 flex items-center justify-center p-4">
      {/* Phone body - relative positioned anchor for portals */}
      <div id="phone-body" className="relative w-[390px] h-[844px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
        {/* Inner screen area (clips content to the phone shape) */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-[24px]">
          {children}
        </div>
      </div>
    </div>
  )
}
