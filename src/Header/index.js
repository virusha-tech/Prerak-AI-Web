import React, { Component } from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import CompanyLogo from "../assets/Logo.svg";

@inject("store")
@observer
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: window.location.pathname.includes("admin"),
      isSearchHidden: window.location.pathname.includes("chat")
    };
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      // location is an object like window.location
      this.setState({
        isSearchHidden: location.pathname.includes("chat")
      });
    });
  }

  render() {
    return (
      <HeaderContiner isAdmin={false}>
        <HeaderLeft>
          <Link to="/">
            <img src={CompanyLogo} alt="Company Logo" />
          </Link>
        </HeaderLeft>
        {!this.state.isSearchHidden ? (
          <HeaderSearch>
            <input
              placeholder="search...."
              value={this.props.store.searchValue}
              onChange={this.props.store.updateSearchResult}
            />
            <SearchIcon
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </SearchIcon>
          </HeaderSearch>
        ) : null}
        <HeaderRight></HeaderRight>
      </HeaderContiner>
    );
  }
}

export default withRouter(Header);

const HeaderContiner = styled.div`
  display: flex;
  background-color: ${({ theme, isAdmin }) => {
    return !isAdmin ? theme.primary : "red";
  }};

  height: 6vh;
  padding: 8px 32px;
  align-items: center;
  border-bottom: 1px solid #384455;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;
const HeaderLeft = styled.div`
  flex: 0.3;
`;

const HeaderSearch = styled.div`
  flex: 0.3;
  opacity: 1;
  display: flex;
  padding: 8px 11px;
  border-radius: 9px;
  border: 1px solid grey;

  > input {
    background-color: transparent;
    border: none;
    outline: 0;
    color: #99b2c6;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;
    flex: 1;
    color: white;
  }
  svg {
    color: #99b2c6;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  @media only screen and (max-width: 576px) {
    display: none;
  }

  /* display: flex;
  align-items: center; */
`;

const HeaderRight = styled.div`
  flex: 0.3;
`;

const SearchIcon = styled.svg``;
