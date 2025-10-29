'use client';

import React from 'react';

interface RolesGridProps {
  children: React.ReactNode;
}

/**
 * Example:
 * <RolesGrid>
 *   <RoleItem
 *     icon="data:image/svg+xml,%3csvg%20width='25'%20height='25'%20viewBox='0%200%2025%2025'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_666_30769)'%3e%3cpath%20d='M3.679%2016.3383L4.714%205.46633H9.464L10.336%2014.6153M8.505%201.85533C9.53722%201.83566%2010.5607%202.04787%2011.5%202.47633C18.929%205.64833%2022%201.73633%2022%201.73633M1.25%2024.2163H23.75V12.5763C23.7497%2012.4071%2023.7107%2012.2402%2023.6361%2012.0884C23.5614%2011.9366%2023.453%2011.8038%2023.3192%2011.7003C23.1854%2011.5967%2023.0296%2011.5252%2022.8639%2011.491C22.6982%2011.4569%2022.5269%2011.4611%2022.363%2011.5033L2%2016.7763C1.7854%2016.832%201.59538%2016.9573%201.4598%2017.1328C1.32423%2017.3082%201.25078%2017.5236%201.251%2017.7453L1.25%2024.2163Z'%20stroke='%232563F5'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M11.75%2020.2178H10.25M6.75%2020.2178H5.25M20.25%2024.2188H15.25V19.7188C15.25%2019.4535%2015.3554%2019.1992%2015.5429%2019.0116C15.7304%2018.8241%2015.9848%2018.7188%2016.25%2018.7188H19.25C19.5152%2018.7188%2019.7696%2018.8241%2019.9571%2019.0116C20.1446%2019.1992%2020.25%2019.4535%2020.25%2019.7188V24.2188Z'%20stroke='%232563F5'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_666_30769'%3e%3crect%20width='24'%20height='24'%20fill='white'%20transform='translate(0.5%200.976562)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
 *     title="Manufacturer"
 *     description="Manufacturers create the passport and anchor core product data; compliance for them is mostly an obligation"
 *     delay={0.4}
 *     opacity={100}
 *     translateX={0}
 *   />
 * </RolesGrid>
 */
export const RolesGrid: React.FC<RolesGridProps> = ({ children }) => {
  return (
    <div
      className='grid grid-cols-1 md:grid-cols-2 justify-items-start items-center gap-1 md:gap-2 max-w-5xl pb-6 md:pb-0 mx-auto opacity-0 translate-y-4 opacity-100 translate-y-0'
      style={{ transition: 'opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s' }}
    >
      {children}
    </div>
  );
};
