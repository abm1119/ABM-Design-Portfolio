import { type CSSProperties } from 'react';

interface AbmLogoIconProps {
  width?: number;
  height?: number;
  style?: CSSProperties;
  className?: string;
}

export default function AbmLogoIcon({ 
  width = 400, 
  height = 400,
  style,
  className
}: AbmLogoIconProps) {
  return (
    <img 
      src="/abmlogo.svg"
      alt="ABM Design Logo"
      width={width}
      height={height}
      style={style}
      className={className}
    />
  );
}