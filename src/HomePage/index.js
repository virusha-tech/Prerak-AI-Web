import React, { Component } from "react";
import styled from "styled-components";
import { MenuList } from "../config";
import ChipSlider from "../molecules/ChipSlider/index";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import CuractedCharacterSlider from "../molecules/CharacterSlider/index";
import GeneratingSpinner from "../atoms/GeneratingSpinner";
import Footer from "../Footer/index";

@inject("store")
@observer
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChipIndex: 0,
      selectedChipLabel: this.props.store.categories[0].value
    };
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
  }

  handleCategoryUpdate(category, index) {
    this.props.history.push(`/${category.value}`);
    this.props.store.updateSearchResult();
    this.setState({
      selectedChipIndex: index,
      selectedChipLabel: category.value
    });
  }

  componentDidMount() {
    this.props.store.categories.map((category, index) => {
      if (this.props.match.params.id === category.value) {
        this.setState({
          selectedChipIndex: index,
          selectedChipLabel: category.value
        });
      }
    });

    this.unlisten = this.props.history.listen((location, action) => {
      let isMatchFound = false;
      this.props.store.categories?.map((category, index) => {
        if (location.pathname.replace("/", "") === category.value) {
          isMatchFound = true;
          this.setState({
            selectedChipIndex: index,
            selectedChipLabel: category.value
          });
        }
      });
      if (!isMatchFound) {
        this.setState({
          selectedChipIndex: 0,
          selectedChipLabel: this.props.store.categories[0].value
        });
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <>
        <HomePageWrapper>
          <SidebarWrapper>
            <Sidebar>
              {MenuList.map(({ label }) => {
                return (
                  <MenuItem key={label}>
                    <MenuItemImg
                      src={require(`../assets/${label}.svg`).default}
                      alt={`${label} Logo`}
                      width={
                        label === "Community" || label === "Feed" ? 24 : 18
                      }
                    />
                    <MenuItemLabel>{label}</MenuItemLabel>
                  </MenuItem>
                );
              })}
            </Sidebar>
          </SidebarWrapper>
          <MainContent>
            <ChipSlider
              categories={this.props.store.categories}
              selectedChipIndex={this.state.selectedChipIndex}
              handleCategoryUpdate={this.handleCategoryUpdate}
            />
            {Object.keys(this.props.store.curatedCategoryCharacter).length ? (
              <CuractedCharacterSlider
                characters={this.props.store.curatedCategoryCharacter[
                  this.state.selectedChipLabel
                ]?.filter(character => {
                  return character.characterName
                    .toLowerCase()
                    .includes(this.props.store.searchValue.toLowerCase());
                })}
                selectedChipIndex={this.state.selectedChipIndex}
                handleClick={this.handleCharacterClick}
              />
            ) : (
              <GeneratingSpinner>Loading Characters...</GeneratingSpinner>
            )}
          </MainContent>
        </HomePageWrapper>
        <Footer />
      </>
    );
  }
}

const HomePageWrapper = styled.div`
  display: flex;
  height: 100%;
  color: white;
`;

const SidebarWrapper = styled.div`
  width: 86px;
  @media only screen and (max-width: 576px) {
    width: 0px;
    display: none;
  }
`;
const Sidebar = styled.div`
  flex: 0.1;
  background-color: ${({ theme }) => {
    return theme.primary;
  }};
  position: fixed;
  top: 60px;
  left: 0px;
  height: 100%;
`;

const MenuItem = styled.div`
  flex: 0.1;
  background-color: ${({ theme }) => {
    return theme.primary;
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 16px;
`;

const MenuItemLabel = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
  color: #ffffff;
`;

const MenuItemImg = styled.img`
  display: inline-block;
  object-fit: contain;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-x: hidden;
  padding: 16px 8px 8px;
`;

export default withRouter(HomePage);
