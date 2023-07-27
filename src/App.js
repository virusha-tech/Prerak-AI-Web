import styled, { css, ThemeProvider } from "styled-components";
import React, { Component } from "react";

import { Provider } from "mobx-react";
import { observer } from "mobx-react";
import AppStore from "./store";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import { withRouter } from "react-router-dom";
import Box from "@mui/material/Box";

import { NotificationContainer } from "react-notifications";

import "./App.scss";

import HomePage from "./HomePage";
import Header from "./Header/index";
import ChatPage from "./ChatPage/index";
import Footer from "./Footer/index";
import Admin from "./Admin/index";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
if (!window.store) {
  window.store = new AppStore();
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  "padding-top": "16px",

  "@media screen and (max-width:600px)": {
    width: "90%",
    p: 2,
  },
};

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
  userFontColor: "#000000",
};

const materialtheme = createTheme({
  palette: {
    primary: {
      main: "#06152B", // #cb1313
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChatScreen: window.location.pathname.includes("chat"),
      isDisClaimerModalOpen: false,
    };
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      // location is an object like window.location
      this.setState({
        isChatScreen: location.pathname.includes("chat"),
      });
    });

    const currDate = new Date().getTime();
    if (
      localStorage.getItem(`lastShown`) &&
      currDate - localStorage.getItem(`lastShown`) < 24 * 60 * 60 * 1000
    ) {
      this.setState({
        isDisClaimerModalOpen: false,
      });
    } else {
      this.setState({
        isDisClaimerModalOpen: true,
      });
    }
  }

  handleModalClose() {
    localStorage.setItem("lastShown", new Date().getTime());
    this.setState({
      isDisClaimerModalOpen: false,
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={materialtheme}>
          <Provider store={window.store}>
            <AppWrapper
              className="appWrapper"
              isChatScreen={this.state.isChatScreen}
            >
              <Header />
              <Modal
                open={this.state.isDisClaimerModalOpen}
                onClose={this.handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div
                    style={{
                      display: "flex",
                      "justify-content": "space-between",
                      padding: "0px 0px",
                      "padding-bottom": "20px",
                      "padding-top": "-10px",
                    }}
                  >
                    <h1 style={{ fontSize: "20px",fontWeight:'bold' }}>Disclaimer</h1>
                    <span
                      style={{
                        cursor: "pointer",
                        border: "1px solid black",
                        "border-radius": "50%",
                        padding: "1px",
                        width: "28px",
                        height: "28px",
                      }}
                      onClick={this.handleModalClose}
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </div>

                  <Typography
                    id="modal-modal-title"
                    style={{ textAlign: "center" }}
                  >
                    All characters and interactions on this platform are
                    AI-generated and purely fictional. The views expressed by
                    these virtual characters do not represent the beliefs of
                    real individuals or figures. Prerak AI is for entertainment
                    purposes only.
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Enjoy the interactive conversations responsibly,
                    understanding that they are a product of advanced technology
                    and not real endorsements.
                  </Typography>
                </Box>
              </Modal>

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

  flex-direction: column;
  background-color: ${({ theme }) => {
    return theme.primary;
  }};
  min-height: 100vh;

  ${(props) =>
    props.isChatScreen &&
    css`
      /* CSS block for variant="primary" */
      position: absolute;
      min-height: initial;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      overflow: hidden;
    `}
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

export default withRouter(App);
