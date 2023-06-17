import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

export const intToString = n => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "k";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "m";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "b";
  if (n >= 1e12) return +(n / 1e12) + "t";
};

function ChipSlider({ characters, selectedChipIndex }) {
  const leftArrowRef = useRef();
  const rightArrowRef = useRef();
  const filterWrapperRef = useRef();
  const [state, setState] = useState({});
  const history = useHistory();

  useEffect(() => {
    const filtersWrapperRectangle = filterWrapperRef.current.getBoundingClientRect();
    const filtersArr = filterWrapperRef.current.children;

    setState({
      filtersArr,
      filtersWrapperRectangle
    });
    setArrowVisibility({
      filtersArr,
      filtersWrapperRectangle
    });

    filterWrapperRef.current.addEventListener("scroll", () => {
      const filtersWrapperRectangle = filterWrapperRef.current.getBoundingClientRect();
      const filtersArr = filterWrapperRef.current.children;
      setArrowVisibility({
        filtersArr,
        filtersWrapperRectangle
      });
    });
  }, []);

  useEffect(() => {
    filterWrapperRef.current.scrollLeft = 0;
  }, [selectedChipIndex]);
  const getFirstVisibleElement = (direction = "left") => {
    var viewportWidth = filterWrapperRef.current.clientWidth; // Width of the viewport
    var elements = filterWrapperRef.current.getElementsByClassName(
      "filters-slider__filter"
    ); // Get all elements in the document
    if (direction === "left") {
      for (let i = 0; i <= elements.length - 1; i++) {
        let element = elements[i];
        let rect = element.getBoundingClientRect(); // Get the element's position relative to the viewport
        const relativeLeft = rect.left - state.filtersWrapperRectangle.left;

        // Check if the element is visible within the viewport
        if (relativeLeft >= 0 && relativeLeft + rect.width <= viewportWidth) {
          return i;
        }
      }
      return null; // No visible element found
    } else {
      // Loop through the elements in reverse order
      for (let i = elements.length - 1; i >= 0; i--) {
        let element = elements[i];
        let rect = element.getBoundingClientRect(); // Get the element's position relative to the viewport
        const relativeLeft = rect.left - state.filtersWrapperRectangle.left;

        // Check if the right edge of the element is within the viewport width
        if (relativeLeft + rect.width <= viewportWidth) {
          return i; // Return the last visible element
        }
      }
      return null; // No visible element found
    }
  };

  const moveLeft = () => {
    let leftMostVisibleElementIndex = getFirstVisibleElement("left");
    let slideValue = 0;
    if (state.filtersArr[leftMostVisibleElementIndex - 1]?.offsetWidth) {
      slideValue +=
        state.filtersArr[leftMostVisibleElementIndex - 1]?.offsetWidth + 8; // +8 is Flex-gap
    }

    if (state.filtersArr[leftMostVisibleElementIndex - 2]?.offsetWidth) {
      slideValue +=
        state.filtersArr[leftMostVisibleElementIndex - 2]?.offsetWidth + 8;
    }

    if (filterWrapperRef.current.scrollLeft >= slideValue) {
      filterWrapperRef.current.scrollLeft -= slideValue;
    } else {
      filterWrapperRef.current.scrollLeft = 0;
    }
    setArrowVisibility(state);
  };

  const moveRight = () => {
    let rightMostVisibleElementIndex = getFirstVisibleElement("right");
    let slideValue = 0;

    if (state.filtersArr[rightMostVisibleElementIndex + 1]?.offsetWidth) {
      slideValue +=
        state.filtersArr[rightMostVisibleElementIndex + 1]?.offsetWidth + 8; // +8 is Flex-gap
    }

    if (state.filtersArr[rightMostVisibleElementIndex + 2]?.offsetWidth) {
      slideValue +=
        state.filtersArr[rightMostVisibleElementIndex + 2]?.offsetWidth + 8;
    }

    const scrollDiff =
      filterWrapperRef.current.scrollWidth -
      (filterWrapperRef.current.scrollLeft +
        filterWrapperRef.current.clientWidth);

    if (scrollDiff > slideValue) {
      filterWrapperRef.current.scrollLeft += slideValue;
    } else {
      filterWrapperRef.current.scrollLeft += scrollDiff;
    }
    setArrowVisibility(state);
  };

  const setArrowVisibility = ({ filtersArr, filtersWrapperRectangle }) => {
    if (window.innerWidth > 768) {
      const scrollDiff =
        filterWrapperRef.current.scrollWidth -
        (filterWrapperRef.current.scrollLeft +
          filterWrapperRef.current.clientWidth);
      if (filterWrapperRef.current.scrollLeft === 0) {
        leftArrowRef.current.style.display = "none";
      } else {
        leftArrowRef.current.style.display = "flex";
      }

      if (scrollDiff < 10) {
        rightArrowRef.current.style.display = "none";
      } else {
        rightArrowRef.current.style.display = "flex";
      }
    }
  };

  const handleCategoryClick = ({ _id }) => {
    history.push(`/chat/${_id}`);
  };
  return (
    <FilterSlider>
      <FilterSliderWrapper ref={filterWrapperRef}>
        {characters?.map((character, index) => {
          return (
            <StyledPill
              key={character._id}
              className="filters-slider__filter"
              onClick={() => handleCategoryClick(character, index)}
            >
              <CharacterPrimaryInformatoin>
                <StyledImage src={`${character.characterProfileImage}`} />
                <CharacterName>{character.characterName}</CharacterName>
                <CharacterTitle>{character.characterTitle}</CharacterTitle>
              </CharacterPrimaryInformatoin>
              <CharacterSecondaryInformation>
                <CharacterOwner>
                  {"@ " + character.characterOwnerName}
                </CharacterOwner>
                <CharacterViewCount>
                  {intToString(character.characterViewsCount)}
                </CharacterViewCount>
              </CharacterSecondaryInformation>
            </StyledPill>
          );
        })}
      </FilterSliderWrapper>
      <LeftArrow
        ref={leftArrowRef}
        className="filters-slider__navArea  filters-slider__leftArrow"
      >
        <div className="filters-slider__nav" onClick={moveLeft}>
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <div className="filters-slider__filterGradient" />
      </LeftArrow>
      <RightArrow
        ref={rightArrowRef}
        className="filters-slider__navArea  filters-slider__rightArrow"
      >
        <div className="filters-slider__filterGradient" />
        <div className="filters-slider__nav" onClick={moveRight}>
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </RightArrow>
    </FilterSlider>
  );
}

const FilterSlider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  margin-top: 8px;
`;
const FilterSliderWrapper = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  gap: 0.5rem;
  align-items: stretch;
  flex: 1;
  transition: transform 0.3s ease-in-out;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const LeftArrow = styled.div`
  width: 3rem;
  display: flex;
  align-items: center;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  z-index: 1;
  left: 0;
  color: #fffefe;
  height: 100%;
  background-color: transparent;
  display: none;

  .filters-slider__nav {
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 2.25rem;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    background-color: ${({ theme }) => {
      return theme.primary;
    }};
  }

  display: block;
  @media only screen and (max-width: 576px) {
    display: none;
  }

  .filters-slider__filterGradient {
    height: 100%;
    width: 31;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      #fffefe 33.87%
    );
  }
`;
const RightArrow = styled.div`
  display: block;
  width: 3rem;
  display: flex;
  align-items: center;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  z-index: 1;
  right: 0;
  color: #fffefe;
  height: 100%;
  background-color: transparent;
  display: none;

  .filters-slider__nav {
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 2.25rem;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    background-color: ${({ theme }) => {
      return theme.primary;
    }};
  }
  @media only screen and (max-width: 576px) {
    display: none;
  }

  .filters-slider__filterGradient {
    height: 100%;
    width: 31;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      #fffefe 33.87%
    );
  }
`;

export const StyledPill = styled.button`
  border: 1px solid #384455;
  border-radius: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#3A36DB" : "#2b3441")};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px 8px 8px;
  flex: 0 0 200px;
  justify-content: space-between;
  gap: 16px;

  &:hover {
    background-color: rgb(57, 59, 59) !important;
  }
`;

export const StyledImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 1px solid #06152b;
  object-fit: cover;
`;
export const CharacterName = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  margin-top: 8px;
`;
export const CharacterTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #888888;
  margin-top: 4px;
`;
export const CharacterOwner = styled.div`
  font-style: italic;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: #888888;
`;
export const CharacterViewCount = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  color: #888888;
`;

export const CharacterSecondaryInformation = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CharacterPrimaryInformatoin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ChipSlider;
