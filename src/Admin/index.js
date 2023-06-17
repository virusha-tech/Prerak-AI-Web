import React from "react";
import styled from "styled-components";
import { AdminMenuList } from "../config";
import Services from "./Services/index";
import AdminServiceDB from "./Services/Table/index";
import { Link, Route } from "react-router-dom";

function Admin() {
  return (
    <AdminWrapper>
      <SidebarWrapper>
        <Sidebar>
          {AdminMenuList.map(({ label, to }) => {
            return (
              <MenuItem key={label} to={to}>
                <MenuItemImg
                  src={require(`../assets/${label}.svg`).default}
                  alt={`${label} Logo`}
                  width={label === "Community" || label === "Feed" ? 24 : 18}
                />
                <MenuItemLabel>{label}</MenuItemLabel>
              </MenuItem>
            );
          })}
        </Sidebar>
      </SidebarWrapper>
      <MainContent>
        <Route
          path="/admin/c2f269ef-f0f2-475b-a658-7f166e0b6749/create/:id"
          exact
          component={Services}
        />
        <Route
          path={`/admin/c2f269ef-f0f2-475b-a658-7f166e0b6749/services/create`}
          exact
          component={Services}
        />
        <Route
          path={`/admin/c2f269ef-f0f2-475b-a658-7f166e0b6749/services`}
          exact
          component={AdminServiceDB}
        />
      </MainContent>
    </AdminWrapper>
  );
}

export default Admin;

const AdminWrapper = styled.div`
  display: flex;
  height: 100%;
  color: white;
`;

const SidebarWrapper = styled.div`
  width: 86px;
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

const MenuItem = styled(Link)`
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
  fill: white;
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-x: hidden;
  height: 88vh;
  padding: 16px 8px 8px;
`;
