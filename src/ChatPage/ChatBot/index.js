import React from "react";
import { observer, inject } from "mobx-react";
import styled from "styled-components";
import ChatBot, { Loading } from "react-simple-chatbot";
import { toJS } from "mobx";

import User from "../../assets/User.png";

const contentStyle = {
  fontSize: "16px",
  padding: "10px",
  scrollbarWidth: 0,
  height: "90%",
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
  "::-webkit-scrollbar": { width: 0 }
};

@inject("store")
@observer
class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      answer: "",
      trigger: false
    };
  }

  async componentDidMount() {
    let response = await this.props.store.api.post("/ai/subsequentQuestion", {
      conversation: [
        ...toJS(this.props.store.chatLogs),
        {
          role: "user",
          content: this.props.steps.question.value
        }
      ]
    });
    this.props.store.setChatLogs([
      {
        role: "user",
        content: this.props.steps.question.value
      },
      {
        role: "assistant",
        content: response.data.answer
      }
    ]);

    this.setState(
      {
        loading: false,
        answer: response.data.answer,
        trigger: true
      },
      () => {
        this.props.triggerNextStep();
      }
    );
  }
  render() {
    return (
      <StyledContainer>
        {this.state.loading ? <Loading /> : this.state.answer}
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div``;

@inject("store")
@observer
class Bot extends React.Component {
  componentDidMount() {
    this.props.store.initializeChatLogs([
      {
        role: "system",
        content: this.props.initialContext
      }
    ]);
  }

  render() {
    console.log("props", this.props.characterProfileImage);
    return (
      <ContextChatBotWrapper className="chatbotwrapper">
        <ChatBot
          //   recognitionEnable={true}
          style={{ height: "100%" }}
          inputStyle={{
            "border-radius": "0px",
            background: "#2B3441",
            border: "1px solid #384455",
            "border-radius": "8px",
            color: "#FFFFFF"
          }}
          submitButtonStyle={{
            fill: "#FFFFFF",
            height: "96%"
          }}
          botAvatar={
            this.props.characterProfileImage ||
            "https://characterai.io/i/400/static/avatars/uploaded/2023/3/22/wauTE4MCQMS1eH0hbhnsZC0QccC6yo05MQmlnvF_Syg.webp"
          }
          width="100%"
          userAvatar={User}
          headerTitle={"Plannr AI Bot"}
          placeholder="Type Message..."
          hideHeader={true}
          contentStyle={contentStyle}
          steps={[
            {
              id: "1",
              message: this.props.startingSentence,
              trigger: "question"
            },
            {
              id: "question",
              user: true,
              trigger: "answer"
            },
            {
              id: "answer",
              component: <Answer />,
              waitAction: true,
              trigger: "question",
              asMessage: true
            }
          ]}
        />
      </ContextChatBotWrapper>
    );
  }
}

export default Bot;
const ContextChatBotWrapper = styled.div`
  height: 80vh;
  .rsc {
    height: 100%;
  }
`;
