import React from "react";
import { toJS } from "mobx";
import styled from "styled-components";
import { Link } from "react-router-dom";
import slug from "slug";

class SampleQuestions extends React.Component {
  render() {
    return (
      <GridWrapper>
        {this.props.characters.map(character => {
          return (
            <SampleQuestionsCard>
              <CharacterInfo>
                <img src={character.characterProfileImage} alt="Character" />
                <div>
                  <span>{character.characterName}</span>
                  <p>Try saying:</p>
                </div>
              </CharacterInfo>
              <CharacterQuestions>
                {JSON.parse(character.sampleQuestions)
                  .splice(0, 3)
                  .map(({ label }) => {
                    return (
                      <Link
                        to={`/chat/${slug(character.characterName)}/${
                          character._id
                        }?initialQuestion=${label}`}
                      >
                        {label}
                      </Link>
                    );
                  })}
              </CharacterQuestions>
            </SampleQuestionsCard>
          );
        })}
      </GridWrapper>
    );
  }
}

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; /* Divides the grid into 4 equal columns */
  grid-gap: 40px; /* Adds a gap of 10 pixels between columns */
  align-items: stretch;
  padding: 20px;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr; /* Divides the grid into 4 equal columns */
  }

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr 1fr; /* Divides the grid into 4 equal columns */
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr; /* Divides the grid into 4 equal columns */
  }
`;

const SampleQuestionsCard = styled.div`
  display: flex;
  flex-direction: column;
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 16px;
  span {
    color: #fff;
    font-size: 12px;
    font-family: Poppins;
    font-weight: 700;
    line-height: 20px;
  }
  p {
    color: #fff;
    font-size: 12px;
    font-family: Poppins;
    line-height: 20px;
  }
  img {
    width: 56px;
    height: 56px;
    border-radius: 118px;
    border: 1px solid grey;
  }
`;

const CharacterQuestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > a {
    border-radius: 8px;
    border: 1px solid #384455;
    background: #2b3441;
    padding: 4px 8px;
    color: #888;
    font-size: 14px;
    font-family: Poppins;
    font-weight: 500;
    line-height: 16px;
  }
`;

export default SampleQuestions;
