import React, { Component } from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import CompanyLogo from "../assets/Logo.svg";

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <FooterLeft>
          <img src={CompanyLogo} alt="Company Logo" width={88} height={20} />
        </FooterLeft>
        <FooterRight>© 2023 Prerak.ai All rights reserved.</FooterRight>
      </FooterContainer>
    );
  }
}

export default withRouter(Footer);

const FooterContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => {
    return theme.primary;
  }};
  height: 58px;
  padding: 0px 32px;
  align-items: center;
  border-top: 1px solid #384455;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  @media only screen and (max-width: 600px) {
    padding: 8px 10px;
  }
`;
const FooterLeft = styled.div`
  flex: 1;
`;

const FooterRight = styled.div`
  color: #667085;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  @media only screen and (max-width: 600px) {
    flex: 0.5;
    white-space: nowrap;
    font-size: 14px;
  }
`;
