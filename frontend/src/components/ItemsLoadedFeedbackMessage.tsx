import { ITEMS_LOADED_FEEDBACK_MESSAGE } from '@/contents/common';
import { replaceComponents } from '@/utils/common';
import { REQUEST_SIZE_LIMIT } from '@/utils/constants';

function ItemsLoadedFeedbackMessage({ size }: { size: number }) {
  return <div className='py-2 text-center text-sm text-gray-500'>{feedbackMessage()}</div>;

  function feedbackMessage(): React.ReactNode[] {
    if (size < REQUEST_SIZE_LIMIT) {
      return replaceComponents(ITEMS_LOADED_FEEDBACK_MESSAGE.content.allTransactionsShown, [
        size,
      ]) as React.ReactNode[];
    } else {
      return replaceComponents(ITEMS_LOADED_FEEDBACK_MESSAGE.content.latestTransactionsShown, [
        size,
      ]) as React.ReactNode[];
    }
  }
}
export default ItemsLoadedFeedbackMessage;
