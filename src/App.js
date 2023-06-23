import styled, { ThemeProvider } from "styled-components";
import React, { Component } from "react";

import { Provider } from "mobx-react";
import { observer } from "mobx-react";
import AppStore from "./store";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider
} from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";

import { NotificationContainer } from "react-notifications";

import "./App.scss";

import HomePage from "./HomePage";
import Header from "./Header/index";
import ChatPage from "./ChatPage/index";
import Footer from "./Footer/index";
import Admin from "./Admin/index";

if (!window.store) {
  window.store = new AppStore();
}

// Define what main theme will look like
const theme = {
  primary: "#06152B", // #cb1313
  primary_gradient: "linear-gradient(0deg, #04adb4, #04adb4)",
  secondary_gradient: "linear-gradient(0deg, #05bbc2, #05bbc2)",
  gray: "#475467",
  personal: "#2CB082",
  professional: "#D99F21",
  business: "#336EE9",
  programming: "red",
  background: "#06152B",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#00C4CC",
  headerFontColor: "#FFFFFF",
  headerFontSize: "18px",
  botBubbleColor: "#333337",
  botFontColor: "#FFFFFF",
  userBubbleColor: "#FFFFFF",
  userFontColor: "#000000"
};

const materialtheme = createTheme({
  palette: {
    primary: {
      main: "#06152B" // #cb1313
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});

@observer
class App extends Component {
  //   state = {
  //     isAdmin: window.store.profile.accountType === "admin"
  //   };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={materialtheme}>
          <Provider store={window.store}>
            <AppWrapper>
              <Router>
                <Header />
                <Switch>
                  <Route path="/admin/c2f269ef-f0f2-475b-a658-7f166e0b6749">
                    <Admin />
                  </Route>
                  <Route path="/chat/:heroname/:id" exact>
                    <ChatPage />
                  </Route>
                  <Route path="/:id" exact>
                    <HomePage />
                  </Route>
                  <Route path="/" exact>
                    <HomePage />
                  </Route>

                  {/* <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} /> */}
                  {/* <Route component={NotFound} /> */}
                  <Route path="*">
                    <Redirect to="/" />
                  </Route>
                </Switch>
              </Router>
            </AppWrapper>
          </Provider>
          <NotificationContainer />
        </MuiThemeProvider>
      </ThemeProvider>
    );
  }
}

const AppWrapper = styled.div`
  /* min-height: 100vh; */
  display: flex;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: hidden;
  flex-direction: column;
  background-color: ${({ theme }) => {
    return theme.primary;
  }};
`;

// function PrivateRoute({ isAdmin, children, ...rest }) {
//   if (!children) {
//     if (!isAdmin) {
//       return (
//         <Redirect
//           to={{
//             pathname: "/login"
//           }}
//         />
//       );
//     }
//     return <Route {...rest} />;
//   }
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         isAdmin ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: location }
//             }}
//           />
//         )
//       }
//     />
//   );
// }

export default App;
