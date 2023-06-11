import React, { Component } from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import Box from "@mui/material/Box";
import CreateService from "./Create/index";
import PromptService from "./Prompt/index";

const TabList = [
  {
    label: "Charcter Details",
    id: "characterDetails"
  },
  //   {
  //     label: "Sample Questions",
  //     id: "sampleQuestions"
  //   },
  {
    label: "Prompt",
    id: "prompt"
  }
];

@inject("store")
@observer
class AdminServices extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: "characterDetails",
      currentServiceId: null,
      lastSavedInfo: null
    };
  }

  async componentDidMount() {
    const service_id =
      this.props.match.params.id || localStorage.getItem("service_id");
    if (service_id) {
      this.setState({ currentServiceId: service_id });
    }
  }

  handleChange = id => {
    this.setState({
      activeTab: id
    });
  };

  renderSelectedTabComponent() {
    switch (this.state.activeTab) {
      case "characterDetails":
        return (
          <TabPanel value={this.state.activeTab} index={"characterDetails"}>
            {/* <CreateService
              postServiceDetails={this.postServiceDetails}
              currentServiceId={this.state.currentServiceId}
              store={this.props.store}
            /> */}
            <CreateService />
          </TabPanel>
        );
      default:
        return (
          <TabPanel value={this.state.activeTab} index={"prompt"}>
            <PromptService
              postServiceDetails={this.postServiceDetails}
              currentServiceId={this.state.currentServiceId}
              store={this.props.store}
            />
          </TabPanel>
        );
    }
  }

  render() {
    return (
      <div>
        <div>
          <TabContainer className="border-b border-gray-200 dark:border-gray-700">
            <Tabs className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              {TabList.map((tabItem, index) => {
                return (
                  <li className="mr-2" key={tabItem.id}>
                    <button
                      onClick={() => this.handleChange(tabItem.id)}
                      className={`inline-flex p-3 md:p-4 border-b-2 border-transparent  rounded-t-lg hover:text-white-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                        this.state.activeTab === tabItem.id ? "active" : ""
                      }`}
                    >
                      {tabItem.label}
                    </button>
                  </li>
                );
              })}
            </Tabs>
          </TabContainer>
          {this.renderSelectedTabComponent()}
        </div>
      </div>
    );
  }
}

export default withRouter(AdminServices);

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 600px) {
    display: none !important;
  }
`;

const Tabs = styled.ul`
  @media only screen and (max-width: 600px) {
    font-size: 0.675rem;
  }
  li button.active {
    color: ${({ theme }) => {
      return "white";
    }};
    border-bottom: ${({ theme }) => {
      return `2px solid white`;
    }};

    div {
      background-color: ${({ theme }) => {
        return theme.primary;
      }};
      color: white;
    }
  }
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <StyledContainer
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      //   style={{ background: "white" }}
    >
      {value === index && (
        <Box sx={{ p: 1 }} md={{ p: 3 }}>
          {children}
        </Box>
      )}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 6px;
  min-height: 70vh;
  max-height: 100vh;
`;
