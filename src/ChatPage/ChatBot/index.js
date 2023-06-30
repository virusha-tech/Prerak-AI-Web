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
    let response = await this.props.store.api.post("/ai/subsequentQuestion", {
      conversation: [
        ...toJS(this.props.store.chatLogs),
        {
          role: "user",
          content:
            this.props.previousStep.value ||
            this.props.steps?.sampleQuestion?.metadata?.initialQuestion
        }
      ]
    });
    this.props.store.setChatLogs([
      {
        role: "user",
        content:
          this.props.previousStep.value ||
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
class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      answer: "",
      trigger: false
    };
    this.handleNextStep = this.handleNextStep.bind(this);
  }

  async componentDidMount() {
    let response = await this.props.store.api.post("/ai/subsequentQuestion", {
      conversation: [
        ...toJS(this.props.store.chatLogs),
        {
          role: "user",
          content:
            'Based on the above context, provide me only 3 single line questions as a first person in the form of JSON stringify array with no indendation attached. Sample response format: ["What is your approach to maintaining a strict fitness routine?", "How do you blend cardio and weight training exercises in your workout?", "What made the 2011 World Cup final a memorable experience for you?"]'
        }
      ]
    });

    this.setState({
      loading: false,
      answer: JSON.parse(response.data.answer),
      trigger: true
    });
  }

  handleNextStep(question) {
    this.props.triggerNextStep({
      value: question,
      trigger: "suggest"
    });
  }

  render() {
    return (
      <>
        {this.state.loading ? (
          <div class="typing-loader"></div>
        ) : (
          <SuggestionWrapper>
            <Header>Click on any of the suggestions below.</Header>
            <SampleQuestions>
              {this.state.answer.map(question => {
                return (
                  <div
                    key={question}
                    onClick={() => this.handleNextStep(question)}
                  >
                    {question}
                  </div>
                );
              })}
            </SampleQuestions>
          </SuggestionWrapper>
        )}
      </>
    );
  }
}

const SuggestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;
const Header = styled.div`
  color: white;
  text-transform: uppercase;
  @media only screen and (max-width: 620px) {
    font-size: 12px;
  }
`;

const SampleQuestions = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  gap: 20px;

  @media only screen and (max-width: 620px) {
    display: flex;
    gap: 8px;
    flex-direction: column;
  }

  > div {
    flex-basis: 33.33%;
    word-wrap: break-word;
    margin-bottom: 6px;
    line-height: 20px;
    position: relative;
    padding: 10px 20px;
    border-radius: 25px;
    background: white;
    background: #333337;
    border-radius: 18px 18px 18px 0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    color: #ffffff;
    display: inline-block;
    font-size: 14px;
    max-width: 50%;
    margin: 0 0 10px 0;
    overflow: hidden;
    position: relative;
    padding: 12px;
    cursor: pointer;
    text-decoration: underline;
    @media only screen and (max-width: 620px) {
      max-width: 100%;
      flex-basis: 100%;
    }
  }
`;

@inject("store")
@observer
class Bot extends React.Component {
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
          component: <InitalQuestion suggestion={this.props.initialQuestion} />,
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
          validator: value => {
            if (!value.length) {
              return "Please enter text first..";
            }
            return true;
          },
          user: true,
          asMessage: true,
          metadata: {
            triggerNext: "answer"
          },
          trigger: "help"
        },
        {
          id: "help",
          replace: true,
          component: <Help />,
          waitAction: true
        },
        {
          id: "suggestions",
          component: <Suggestions />,
          waitAction: true,
          replace: true
        },
        {
          id: "suggest",
          component: <SelectedSuggestion />,
          waitAction: true
        }
      ];
    }
    return [
      {
        id: "1",
        message: `${this.props.startingSentence} Type "help" if you need some suggestion questions to ask.`,
        trigger: "question"
      },
      {
        id: "question",
        user: true,
        validator: value => {
          if (!value.length) {
            return "Please enter text first..";
          }
          return true;
        },
        metadata: {
          triggerNext: "answer"
        },
        trigger: "help"
      },
      {
        id: "help",
        replace: true,
        component: <Help />,
        waitAction: true
      },
      {
        id: "suggestions",
        component: <Suggestions />,
        waitAction: true,
        replace: true
      },
      {
        id: "suggest",
        component: <SelectedSuggestion />,
        waitAction: true
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
          placeholder="Type Message or Help"
          hideHeader={true}
          contentStyle={contentStyle}
          steps={this.getBotSteps()}
        />
      </ContextChatBotWrapper>
    );
  }
}

class InitalQuestion extends React.Component {
  render() {
    return <h1 style={{ color: "white" }}>{this.props.suggestion}</h1>;
  }
}

class SelectedSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.message = this.props.steps.suggestions.value;
  }
  componentDidMount() {
    this.props.triggerNextStep({ value: this.message, trigger: "answer" });
  }
  render() {
    return <h1 style={{ color: "white" }}>{this.message}</h1>;
  }
}
class Help extends React.Component {
  componentWillMount() {
    const { previousStep } = this.props;
    const { metadata = {} } = previousStep;
    const trigger =
      previousStep.value.toLowerCase() === "help"
        ? "suggestions"
        : metadata.triggerNext;

    this.props.triggerNextStep({ trigger });
  }

  render() {
    return <HelpWrapper />;
  }
}

const HelpWrapper = styled.div``;

export default Bot;
const ContextChatBotWrapper = styled.div`
  height: 100%;
  .rsc {
    height: 100%;
  }
`;
