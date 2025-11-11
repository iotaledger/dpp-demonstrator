/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import i18next from 'i18next';
import Backend from 'i18next-http-backend';

i18next.use(Backend).init({
  backend: {
    loadPath: '/locales/{{lng}}.json',
  },
  defaultNS: false,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
export default i18next;
