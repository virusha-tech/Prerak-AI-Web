import React, { Component } from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { EnhancedTable } from "./DB.js";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import GeneratingSpinner from "../../../atoms/GeneratingSpinner";

function createData(
  characterName,
  characterOwnerName,
  updatedAt,
  currentStatus,
  id,
  isDraft,
  isLocked,
  characterWeight
) {
  return {
    characterName,
    characterOwnerName,
    currentStatus,
    id,
    isDraft,
    isLocked,
    updatedAt: moment(updatedAt).format("D MMM, YYYY"),
    characterWeight: +characterWeight
  };
}
@inject("store")
@observer
class AdminServiceDB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      count: 0,
      isLoading: true
    };

    this.handleNewService = this.handleNewService.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleLockClick = this.handleLockClick.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentDidMount() {
    const getAllServices = async () => {
      const services = await this.props.store.api.get(
        `/services?page=1&pageSize=10`
      );
      const rows = services.data.docs.map(service => {
        const {
          characterName,
          characterOwnerName,
          updatedAt,
          currentStatus,
          _id: id,
          isDraft,
          isLocked,
          characterWeight
        } = service;

        return createData(
          characterName,
          characterOwnerName,
          updatedAt,
          currentStatus,
          id,
          isDraft,
          isLocked,
          characterWeight
        );
      });
      this.setState({
        rows,
        isLoading: false,
        count: services.data.count
      });
    };
    getAllServices();
  }

  async handleDeleteClick(id) {
    localStorage.removeItem("service_id");
    await this.props.store.api.post(`/services/${id}`);
    this.props.history.go(0);
  }

  async handleChangePage(pageNumber, pageSize = 10, cb) {
    const services = await this.props.store.api.get(
      `/services?page=${pageNumber + 1}&pageSize=${pageSize}`
    );

    const rows = services.data.docs.map(service => {
      console.log(service, service);
      const {
        characterName,
        characterOwnerName,
        updatedAt,
        currentStatus,
        _id: id,
        isDraft,
        isLocked,
        characterWeight
      } = service;

      return createData(
        characterName,
        characterOwnerName,
        updatedAt,
        currentStatus,
        id,
        isDraft,
        isLocked,
        characterWeight
      );
    });
    this.setState(
      {
        rows,
        isLoading: false,
        count: services.data.count
      },
      () => {
        cb();
      }
    );
  }

  handleNewService() {
    localStorage.removeItem("service_id");
    this.props.history.push("services/create");
  }

  async handleSwitchChange(index) {
    const formData = new FormData();
    formData.append("id", index);
    const updatedRows = this.state.rows.map(item => {
      const { id, isDraft } = item;
      if (id === index) {
        formData.append("isDraft", !isDraft);
        return { ...item, isDraft: !isDraft };
      } else {
        return item;
      }
    });
    this.setState({
      rows: updatedRows
    });

    await this.props.store.api.post("/services", formData, {
      "Content-Type": "multipart/form-data"
    });
    NotificationManager.info("Changes Saved");
    await this.props.store.refreshCharacters();
  }

  async handleLockClick(index, msg) {
    const formData = new FormData();
    formData.append("id", index);
    const updatedRows = this.state.rows.map(item => {
      const { id } = item;
      if (id === index) {
        if (msg === "unlock") {
          formData.append("isLocked", false);
          return { ...item, isLocked: false };
        } else {
          formData.append("isLocked", true);
          return { ...item, isLocked: true };
        }
      } else {
        return item;
      }
    });
    await this.props.store.api.post("/services", formData, {
      "Content-Type": "multipart/form-data"
    });
    NotificationManager.info("Changes Saved");
    this.setState({
      rows: updatedRows
    });
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <GeneratingSpinner showLoader={true}>
            Finding your services...
          </GeneratingSpinner>
        ) : (
          <>
            <ActionButtonWrapper>
              <StyledButton
                onClick={this.handleNewService}
                variant="outlined"
                startIcon={
                  <svg
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                Add New Service
              </StyledButton>
            </ActionButtonWrapper>
            <Wrapper>
              <StyledHeader>Service</StyledHeader>
              <EnhancedTable
                rows={this.state.rows}
                count={this.state.count}
                handleLockClick={this.handleLockClick}
                handleChangePage={this.handleChangePage}
                handleSwitchChange={this.handleSwitchChange}
                handleDeleteClick={this.handleDeleteClick}
              />
            </Wrapper>
          </>
        )}
      </div>
    );
  }
}

const StyledHeader = styled.h1`
  color: white !important;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const ActionButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px;
`;
const Wrapper = styled.div`
  margin: 10px;
  h1 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 18px;
    color: #344054;
    margin-bottom: 20px;
  }
`;
const StyledButton = styled(Button)`
  color: white !important;
  border: 1px solid white !important;
  cursor: pointer;
  &:hover {
    color: white !important;
    border: 1px solid white !important;
  }
`;
export default withRouter(AdminServiceDB);
