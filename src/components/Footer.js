/*source: https://www.devwares.com/docs/contrast/react/components/footer/*/

import React from 'react';
import { CDBBox, CDBFooter, CDBBtn, CDBIcon} from 'cdbreact';

export const Footer = () => {
  return (
    <CDBFooter className="shadow">
      <CDBBox
        display="flex"
        justifyContent="between"
        alignItems="center"
        className="mx-auto py-4 flex-wrap"
        style={{ width: '80%' }}
      >
        <CDBBox display="flex" alignItems="center">
          <a href="/" className="d-flex align-items-center p-0 text-dark">
            <img
              alt="logo"
              src="/images/furniture_logo.png"
              width="80px"
            />
            <span className="ml-4 h5 mb-0 font-weight-bold">Once Upon A Furniture</span>
          </a>
        </CDBBox>
        <CDBBox>
          <small className="ml-2">&copy; Peter in Raincouver, 2022. All rights reserved.</small>
        </CDBBox>
      </CDBBox>
    </CDBFooter>
  );
};

export default Footer;