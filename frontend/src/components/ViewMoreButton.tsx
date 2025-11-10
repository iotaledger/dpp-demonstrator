import { VIEW_MORE_BUTTON } from '@/contents/common';

interface ViewMoreButtonProps {
  amountToReveal: number;
  isDisabled: boolean;
  onClick: () => void;
}

const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({
  amountToReveal: amount,
  isDisabled,
  onClick,
}) => (
  <button
    className='focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 svelte-1u9y1q3 inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 py-2 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
    onClick={onClick}
    disabled={isDisabled}
  >
    {`${VIEW_MORE_BUTTON.content.text} (${amount})`}
  </button>
);
export default ViewMoreButton;
