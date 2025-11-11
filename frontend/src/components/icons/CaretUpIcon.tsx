/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx } from 'clsx';

interface CaretUpProps {
  className?: string;
}

const CaretUpIcon: React.FC<CaretUpProps> = ({ className }) => (
  <svg
    className={clsx(['h-4 w-4', className && className])}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m18 15-6-6-6 6' />
  </svg>
);
export default CaretUpIcon;
