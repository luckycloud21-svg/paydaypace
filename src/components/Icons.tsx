import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function BaseIcon({ size = 22, children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function ArrowLeft(props: IconProps) { return <BaseIcon {...props}><path d="m15 18-6-6 6-6" /></BaseIcon>; }
export function ArrowRight(props: IconProps) { return <BaseIcon {...props}><path d="m9 18 6-6-6-6" /></BaseIcon>; }
export function ChevronDown(props: IconProps) { return <BaseIcon {...props}><path d="m6 9 6 6 6-6" /></BaseIcon>; }
export function Check(props: IconProps) { return <BaseIcon {...props}><path d="m5 12 4 4L19 6" /></BaseIcon>; }
export function Plus(props: IconProps) { return <BaseIcon {...props}><path d="M12 5v14M5 12h14" /></BaseIcon>; }
export function MoreHorizontal(props: IconProps) { return <BaseIcon {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></BaseIcon>; }
export function Settings(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10 5 L10.5 2.5 L13.5 2.5 L14 5 L15.54 5.64 L17.66 4.22 L19.78 6.34 L18.36 8.46 L19 10 L21.5 10.5 L21.5 13.5 L19 14 L18.36 15.54 L19.78 17.66 L17.66 19.78 L15.54 18.36 L14 19 L13.5 21.5 L10.5 21.5 L10 19 L8.46 18.36 L6.34 19.78 L4.22 17.66 L5.64 15.54 L5 14 L2.5 13.5 L2.5 10.5 L5 10 L5.64 8.46 L4.22 6.34 L6.34 4.22 L8.46 5.64 Z" />
      <circle cx="12" cy="12" r="3.2" />
    </BaseIcon>
  );
}
export function Calendar(props: IconProps) { return <BaseIcon {...props}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 9h17" /></BaseIcon>; }
export function Share(props: IconProps) { return <BaseIcon {...props}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></BaseIcon>; }
export function Trash(props: IconProps) { return <BaseIcon {...props}><path d="M4 7h16M10 11v5M14 11v5M6.5 7l.7 12.2a1.7 1.7 0 0 0 1.7 1.6h6.2a1.7 1.7 0 0 0 1.7-1.6L17.5 7M9 7V4.5h6V7" /></BaseIcon>; }
export function Edit(props: IconProps) { return <BaseIcon {...props}><path d="m14.5 5.5 4 4M5 19l3.2-.7L19 7.5a1.8 1.8 0 0 0-2.5-2.5L5.7 15.8 5 19Z" /></BaseIcon>; }
export function Wallet(props: IconProps) { return <BaseIcon {...props}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" /><path d="M4 7h12.5a2.5 2.5 0 0 1 0 5H4M16.5 9.5h.1" /></BaseIcon>; }
export function Spark(props: IconProps) { return <BaseIcon {...props}><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></BaseIcon>; }
export function Info(props: IconProps) { return <BaseIcon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7.5v.1" /></BaseIcon>; }
