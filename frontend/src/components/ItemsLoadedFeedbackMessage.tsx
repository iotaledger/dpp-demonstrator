import { REQUEST_SIZE_LIMIT } from "@/utils/constants";

function ItemsLoadedFeedbackMessage({ size }: { size: number }) {
  const feedbackMessage = () => {
    if (size < REQUEST_SIZE_LIMIT) {
      return `All ${size} transactins shown`;
    } else {
      return `All ${size} latest transactions shown`;
    }
  };
  return <div className='py-2 text-center text-sm text-gray-500'>{feedbackMessage()}</div>;
}
export default ItemsLoadedFeedbackMessage;
