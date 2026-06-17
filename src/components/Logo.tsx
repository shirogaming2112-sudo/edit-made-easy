import blackLogo from '@/assets/cyberbacker-logo.png';
import whiteLogo from '@/assets/cyberbacker-logo-white.png';

interface LogoProps {
  className?: string;
  variant?: 'black' | 'white';
}

const Logo = ({ className = 'h-14 w-auto', variant = 'white' }: LogoProps) => {
  const src = variant === 'black' ? blackLogo : whiteLogo;
  return <img src={src} alt="Cyberbacker" className={className} />;
};

export default Logo;
