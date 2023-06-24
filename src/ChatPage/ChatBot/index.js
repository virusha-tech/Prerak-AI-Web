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
  height: "inherit",
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
    // console.log(this.props.steps.question.value)
    let response = await this.props.store.api.post("/ai/subsequentQuestion", {
      conversation: [
        ...toJS(this.props.store.chatLogs),
        {
          role: "user",
          content:
            this.props.steps?.question?.value ||
            this.props.steps?.sampleQuestion?.metadata?.initialQuestion
        }
      ]
    });
    this.props.store.setChatLogs([
      {
        role: "user",
        content:
          this.props.steps?.question?.value ||
          this.props.steps?.sampleQuestion?.metadata?.initialQuestion
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
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getBotSteps = this.getBotSteps.bind(this);
    this.props.store.initializeChatLogs([
      {
        role: "system",
        content: this.props.initialContext
      }
    ]);
  }

  getBotSteps() {
    if (this.props.initialQuestion) {
      return [
        {
          id: "sampleQuestion",
          component: <div>{this.props.initialQuestion}</div>,
          metadata: {
            initialQuestion: this.props.initialQuestion
          },
          trigger: "answer"
        },
        {
          id: "answer",
          component: <Answer />,
          waitAction: true,
          trigger: "question",
          asMessage: true
        },
        {
          id: "question",
          user: true,
          asMessage: true,
          trigger: "answer"
        }
      ];
    }
    return [
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
    ];
  }

  render() {
    return (
      <ContextChatBotWrapper className="chatbotwrapper">
        <ChatBot
          recognitionEnable={true}
          botDelay={0}
          customDelay={0}
          style={{ height: "100%" }}
          // inputStyle={{
          //   "border-radius": "0px",
          //   background: "#2B3441",
          //   border: "1px solid #384455",
          //   "border-radius": "8px",
          //   color: "#FFFFFF"
          // }}
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
          steps={this.getBotSteps()}
        />
      </ContextChatBotWrapper>
    );
  }
}

export default Bot;
const ContextChatBotWrapper = styled.div`
  height: 100%;
  .rsc {
    height: 100%;
  }
`;
