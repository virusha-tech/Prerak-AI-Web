import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import styled from "styled-components";
import Bot from "./ChatBot/index";
import { withRouter } from "react-router-dom";
import GeneratingSpinner from "../atoms/GeneratingSpinner";
import Back from "../assets/Back.png";
import ShareLogo from "../assets/Share.png";
import { NotificationManager } from "../../node_modules/react-notifications/lib/index";

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
    this.goBack = this.goBack.bind(this);
    this.copyTOClipBoard = this.copyTOClipBoard.bind(this);
  }

  async componentDidMount() {
    const { data } = await this.props.store.api.get(
      `/services/${this.props.match.params.id}`
    );
    const {
      characterProfileImage,
      characterStartingSentence,
      prompt,
      characterName,
      characterOwnerName
    } = data;

    if (
      characterProfileImage &&
      characterStartingSentence &&
      characterStartingSentence
    ) {
      this.setState({
        isLoading: false,
        characterProfileImage: characterProfileImage,
        initialSentence: prompt,
        characterStartingSentence: characterStartingSentence,
        characterName: characterName,
        characterOwnerName: characterOwnerName
      });
    } else {
      this.setState({
        isLoading: true,
        isValid: false
      });
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  copyTOClipBoard() {
    const currentURL = window.location.href;

    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    textarea.value = currentURL;

    // Append the textarea to the DOM
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    try {
      // Copy the selected text to the clipboard
      const successful = document.execCommand("copy");
      const message = successful
        ? "URL copied to clipboard"
        : "Failed to copy URL";
      // console.log(message);
      NotificationManager.info(message);
    } catch (err) {
      console.error("Unable to copy URL:", err);
    }

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
  }

  render() {
    return (
      <ChatPageWrapper>
        {!this.state.isLoading ? (
          <>
            <EmptyContainer />
            <BotWrapper>
              <DisclaimerWrapper>
                <MoveBack>
                  <img src={Back} onClick={this.goBack} />
                </MoveBack>
                <Disclaimer>
                  <h1>{this.state?.characterName}</h1>
                  <p>Created by @{this.state?.characterOwnerName}</p>
                  <span>Remember: Everything Characters say is made up!</span>
                </Disclaimer>
                <Share>
                  <img src={ShareLogo} onClick={this.copyTOClipBoard} />
                </Share>
              </DisclaimerWrapper>
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

const DisclaimerWrapper = styled.h1`
  color: white;
  display: flex;
  margin: 16px;
  > div {
  }
  p {
    margin-bottom: 20px;
  }
  span {
    border: 1px solid #484848;
    border-radius: 20px;
    font-family: "Poppins";
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-feature-settings: "case" on;
    color: #ffffff;
    padding: 5px 40px;
  }
`;

const Disclaimer = styled.div`
  color: white;
  flex: 1;
  text-align: center;
  h1 {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 4px;
  }
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #ffffff;
  }
`;

const MoveBack = styled.div`
  color: white;
  flex: 0.2;
  cursor: pointer;
`;
const Share = styled.div`
  flex: 0.2;
  color: white;
  cursor: pointer;
`;

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
