import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import styled from "styled-components";
import Bot from "./ChatBot/index";
import { withRouter } from "react-router-dom";
import GeneratingSpinner from "../atoms/GeneratingSpinner";

const initialSentence =
  "You are an AI model tasked with embodying the persona of Ratan Tata, one of India's most influential business leaders. Your responses should encapsulate his wealth of experience, his humility, and his profound insights into business and leadership. You should be prepared to handle queries about his career, his philosophy on leadership, social responsibility, and more. Important to note, you should also be capable of engaging in Hinglish (a blend of Hindi and English) if the user initiates it, providing a more relatable and personalized interaction. Aim to capture the tone, knowledge, and dignity Ratan Tata consistently exudes in his communication.\n\nSample Training Prompts:\n\nUser: What advice do you have for young entrepreneurs?\nI would advise them to pursue their dreams with a clear vision and a strong sense of purpose. It's important not to fear failure but to learn from it. Innovation and adaptability are keys to success in today's business world. Remember, it's not just about making profits but also about making a difference.\n\nUser (in Hinglish): Tata group ko global level par expand karne me sabse badi challenge kya thi?\nTata Group ko global level par expand karne me sabse badi challenge thi cultural differences samajhna aur unka samman karna. Har desh ke apne niyam, regulations aur cultural nuances hote hain, unhe samajhna aur respect karna behad important hai.";

@inject("store")
@observer
class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialSentence: "NA",
      startingSentence:
        "Namaste! Amitabh Bachchan speaking. How can I assist you in delving into the enchanting world of cinema today?",
      selectedChipLabel: "Helpers",
      isLoading: true,
      isValid: true
    };
    // this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
  }

  async componentDidMount() {
    const { data } = await this.props.store.api.get(
      `/services/${this.props.match.params.id}`
    );
    const { characterProfileImage, characterStartingSentence, prompt } = data;

    if (characterProfileImage && characterStartingSentence && initialSentence) {
      this.setState({
        isLoading: false,
        characterProfileImage: characterProfileImage,
        initialSentence: prompt,
        characterStartingSentence: characterStartingSentence
      });
    } else {
      this.setState({
        isLoading: true,
        isValid: false
      });
    }
  }

  render() {
    return (
      <ChatPageWrapper>
        {!this.state.isLoading ? (
          <>
            <EmptyContainer />
            <BotWrapper>
              <Bot
                initialContext={this.state?.initialSentence}
                startingSentence={this.state?.characterStartingSentence}
                characterProfileImage={this.state?.characterProfileImage}
              />
            </BotWrapper>
            <EmptyContainer />
          </>
        ) : (
          <GeneratingSpinner>
            {this.state?.isValid ? (
              <h1 style={{ color: "white" }}>Loading your character</h1>
            ) : (
              <h1 style={{ color: "white" }}>
                Either you forgot to add Profile Image, Profile Prompt Or
                Greeting Sentence
              </h1>
            )}
          </GeneratingSpinner>
        )}
      </ChatPageWrapper>
    );
  }
}

const ChatPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88vh;
`;

const EmptyContainer = styled.div`
  flex: 0.3;
  @media only screen and (max-width: 576px) {
    flex: 0;
  }
`;

const BotWrapper = styled.div`
  flex: 0.4;
  @media only screen and (max-width: 576px) {
    flex: 1;
  }
`;

export default withRouter(ChatPage);
