import clsx from "clsx";

interface CaretDownProps {
  className?: string;
}

const CaretDownIcon: React.FC<CaretDownProps> = ({ className }) => (
  <svg className={clsx([
    'h-4 w-4',
    className && className])}
    fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='m6 9 6 6 6-6'
    />
  </svg>
);
export default CaretDownIcon;
