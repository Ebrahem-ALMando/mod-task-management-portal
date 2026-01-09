"use client"



export function BackgroundPattern() {
  return (
    <>
      {/* Background pattern layer */}
      <div 
        className="fixed inset-0 bg-pattern pointer-events-none" 
        aria-hidden="true"
      />
      
      {/* Background overlay for readability */}
      <div 
        className="fixed inset-0 bg-pattern-overlay pointer-events-none" 
        aria-hidden="true"
      />
    </>
  )
}
