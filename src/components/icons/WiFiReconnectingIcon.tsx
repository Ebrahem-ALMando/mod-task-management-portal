interface WiFiReconnectingIconProps {
  className?: string;
}

export function WiFiReconnectingIcon({ className }: WiFiReconnectingIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bottom wave - appears first */}
      <path 
        d="M12 20h.01" 
        className="wifi-wave wifi-wave-1"
      />
      {/* Second wave */}
      <path 
        d="M8.5 16.429a5 5 0 0 1 7 0" 
        className="wifi-wave wifi-wave-2"
      />
      {/* Third wave */}
      <path 
        d="M5 12.859a10 10 0 0 1 5.17-2.69" 
        className="wifi-wave wifi-wave-3"
      />
      {/* Top waves */}
      <path 
        d="M19 12.859a10 10 0 0 0-2.007-1.523" 
        className="wifi-wave wifi-wave-4"
      />
      <path 
        d="M2 8.82a15 15 0 0 1 4.177-2.643" 
        className="wifi-wave wifi-wave-5"
      />
      <path 
        d="M22 8.82a15 15 0 0 0-11.288-3.764" 
        className="wifi-wave wifi-wave-6"
      />
    </svg>
  );
}

