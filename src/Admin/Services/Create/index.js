import styled from "styled-components";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Button, Tooltip } from "@mui/material";
import Select from "react-select";
import User from "../../../assets/User.png";
import { Editor } from "@tinymce/tinymce-react";

import {
  CharacterName,
  CharacterOwner,
  CharacterPrimaryInformatoin,
  CharacterSecondaryInformation,
  CharacterTitle,
  CharacterViewCount,
  StyledImage,
  StyledPill,
  intToString
} from "../../../molecules/CharacterSlider/index";
import { useEffect } from "react";

const customStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    border: "1px solid rgba(209, 213, 219)",
    boxShadow: "none",
    minHeight: "46px",
    "&:hover": {
      border: "1px solid rgba(156, 163, 175)"
    }
  }),
  menuPortal: (base, state) => ({
    ...base,
    zIndex: 50
  }),

  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "lightgray" : null,
      color: "black"
    };
  }
};

const serviceCardFields = [
  {
    title: "Character Image",
    attr: "file",
    value: "",
    type: "upload",
    required: true
  },
  {
    title: "Character Name",
    attr: "characterName",
    value: "",
    placeholder: "Enter your character name",
    required: true
  },
  {
    title: "Character Title",
    attr: "characterTitle",
    value: "",
    placeholder: "Enter your character title",
    required: true,
    type: "textArea" // will update
  },
  {
    title: "Character Description",
    attr: "characterDescription",
    value: "",
    type: "editor", // will update
    placeholder: "Enter your service description",
    required: true
  },
  //   CharacterOwnerName
  {
    title: "Character Owner Name",
    attr: "characterOwnerName",
    value: "",
    min: 1,
    placeholder: "Enter Owner Name",
    required: true
  },
  {
    title: "Character Category",
    attr: "characterCategory",
    value: "",
    min: 1,
    type: "dropdown",
    placeholder: "Select Character Category",
    required: true,
    isMulti: true
  },
  {
    title: "Character Weight",
    attr: "characterWeight",
    value: "",
    min: 1,
    type: "textArea",
    placeholder: "Enter Character Weight",
    required: true
  }
];

const categories = [
  "Bollywood Actors",
  "Bollywood Actresses",
  "Musicians",
  "Sports Personalities",
  "Television Personalities",
  "Fashion Icons",
  "Business Magnates",
  "Historical Figures",
  "Celebrity Chefs",
  "National Leaders",
  "YouTubers",
  "Comedians",
  "Authors",
  "Reel Characters"
];

const mapArraytoReactSelectorOptions = array => {
  return array.map(arr => {
    return {
      title: arr,
      value: arr,
      label: arr
    };
  });
};

const CreateService = ({ postServiceDetails, currentServiceId, store }) => {
  const [service, setService] = useState({});
  const [img, setImage] = useState(null);
  const [serviceError, setServiceError] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (currentServiceId) {
        const resp = await store.api.get(`/services/${currentServiceId}`);
        const {
          characterDescription = "",
          characterName = "",
          characterOwnerName = "",
          characterTitle = "",
          characterWeight = "",
          characterCategory = "[]",
          characterProfileImage = ""
        } = resp.data;
        setImage(characterProfileImage);
        setService({
          characterDescription,
          characterName,
          characterOwnerName,
          characterTitle,
          characterWeight,
          characterCategory: characterCategory
        });
      }
    }
    fetchData();
  }, [currentServiceId]);

  const onChange = async (key, event) => {
    if (key === "file") {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(event.value);
    }
    const value = event.value;

    setService(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
  };

  const handleClick = async () => {
    const formData = new FormData();
    for (var key in service) {
      if (key == "characterCategory") {
        formData.append(key, JSON.stringify(service[key]));
      } else {
        formData.append(key, service[key]);
      }
    }
    postServiceDetails(formData);
  };

  const renderCorrespondingInput = ({
    type,
    attr,
    placeholder,
    options,
    maxLength,
    error,
    value,
    values,
    isMulti = false
  }) => {
    switch (type) {
      case "dropdown":
        return (
          <>
            <Select
              isMulti={isMulti}
              name="colors"
              options={mapArraytoReactSelectorOptions(categories)}
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable={true}
              styles={{ ...customStyles }}
              onChange={val => onChange(attr, { value: val })}
              value={service[attr] || []}
            />
          </>
        );
      case "editor":
        return (
          <>
            <Editor
              apiKey={"iw7fjsx8t03sha9ygj6dj5q0bwjstmkcpn93mzq5wy3vq7dh"}
              value={service[attr] || ""}
              init={{
                height: 300,
                placeholder: "Charcter Long description",
                inline: false,
                menubar: false,
                branding: false,
                elementpath: false,
                resize: false,
                statusbar: false,
                forced_root_block: "",
                paste_as_text: true,
                contextmenu_never_use_native: false,
                contextmenu: "link bold pastetext",
                plugins: ["lists link paste contextmenu"]
                // toolbar: "bold bullist numlist link"
              }}
              onEditorChange={val => onChange(attr, { value: val })}
            />
          </>
        );

      case "textArea":
        return (
          <>
            <label
              htmlFor={attr}
              className="relative transition text-gray-600 focus-within:text-gray-800 block"
            >
              <textarea
                rows="3"
                name={attr}
                value={service[attr] || ""}
                id={attr}
                placeholder={placeholder}
                className={`outline-none focus:outline-none  bg-white rounded-md px-4 py-2 w-full border  focus:border-gray-400 ${
                  serviceError[attr] ? "border-red-400" : "border-gray-300"
                } font-regular mt-2 transition-all`}
                onChange={e => onChange(attr, e.target)}
              />
            </label>
          </>
        );
      case "upload":
        return (
          <div>
            <IconButton
              color="primary"
              className="justify-start"
              aria-label="upload picture"
              component="label"
              size="medium"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={e => onChange(attr, { value: e.target.files[0] })}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </IconButton>
          </div>
        );
      default:
        return (
          <>
            <label
              htmlFor={attr}
              className="relative transition text-gray-600 focus-within:text-gray-800 block"
            >
              <input
                name={attr}
                placeholder={placeholder}
                id={attr}
                value={service[attr] || ""}
                maxLength={maxLength || 80}
                className={`outline-none focus:outline-none  bg-white rounded-md px-4 py-2 w-full border  focus:border-gray-400 ${
                  serviceError[attr] ? "border-red-400" : "border-gray-300"
                } font-regular mt-2 transition-all`}
                onChange={e => onChange(attr, e.target)}
              />
            </label>
          </>
        );
    }
  };
  return (
    <Wrapper>
      <div className="left">
        <h1>Add New Character</h1>
        <div>
          {serviceCardFields.map((field, index) => {
            return (
              <div key={field.attr}>
                <FlexContainer>
                  <Label className="text-white-600 font-medium text-md">
                    {field.title}
                    {field.tooltipText ? (
                      <StyledTooltip
                        title={field.tooltipText}
                        placement="right-end"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                      </StyledTooltip>
                    ) : null}
                  </Label>
                  <div className="relative flex flex-col gap-y-3 justify-start">
                    {renderCorrespondingInput({
                      type: field.type,
                      options: field.options,
                      placeholder: field.placeholder,
                      attr: field.attr,
                      value: service[field.attr] || field.value,
                      maxLength: field.maxLength,
                      values: field.values,
                      isMulti: field.isMulti ?? false
                    })}
                    {serviceError[field.attr] && (
                      <div
                        className={`${
                          serviceError[field.attr]
                            ? "text-red-400"
                            : "text-gray-400"
                        } text-sm transition-all line mt-1`}
                      >
                        {serviceError[field.attr]}
                      </div>
                    )}
                  </div>
                </FlexContainer>
                <HorizontalRule
                  isLast={index === serviceCardFields.length - 1}
                />
              </div>
            );
          })}
        </div>
        <div className="action_btns">
          <Button variant="contained" onClick={() => handleClick()}>
            Save Draft
          </Button>
        </div>
      </div>
      <div className="right">
        <StyledPill
          className="filters-slider__filter"
          //   onClick={() => handleCategoryClick(character, index)}
        >
          <CharacterPrimaryInformatoin>
            <StyledImage src={img ?? User} />
            <CharacterName>
              {service?.["characterName"] ?? "{{Character Name}}"}
            </CharacterName>
            <CharacterTitle>
              {service?.["characterTitle"] ?? "{{Character Title}}"}
            </CharacterTitle>
          </CharacterPrimaryInformatoin>
          <CharacterSecondaryInformation>
            <CharacterOwner>
              {service?.["characterOwnerName"]
                ? `@${service?.["characterOwnerName"]}`
                : "{{User Name}}"}
            </CharacterOwner>
            <CharacterViewCount>0</CharacterViewCount>
          </CharacterSecondaryInformation>
        </StyledPill>
        {/* <Tool
            key={"Title"}
            group={service.category || "Category"}
            title={service.title || "tool.title"}
            to={"tool.to"}
            Icon={img}
            desc={service.desc || "Description"}
            fromColor={"gray-500"}
            toColor={"gray-500"}
            isComingSoon={true}
          /> */}
      </div>
    </Wrapper>
  );
};

const FlexContainer = styled.div`
  display: flex;

  > label {
    flex: 0.4;
  }
  > div {
    flex: 0.6;
  }

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    label {
      flex: 1;
    }
    > div {
      flex: 1;
    }
  }
`;
const Wrapper = styled.div`
  display: flex;
  margin: 40px 38px;

  .left {
    flex: 0.6;
    color: white;
    .action_btns {
      display: flex;
      justify-content: flex-end;
      gap: 25px;
    }
    h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 30px;
      line-height: 38px;
    }

    > div {
      margin: 50px;
    }
  }

  .right {
    flex: 0.4;
    display: flex;
    min-height: 200px;
    align-self: flex-start;
    margin-top: 36px;
    justify-content: space-around;
  }

  @media only screen and (max-width: 900px) {
    flex-direction: column;
    gap: 12px;
    margin: 0px;

    .right {
      flex: 1;
    }
    .left {
      flex: 1;
    }
  }
`;

const HorizontalRule = styled.div`
  height: ${props => (props.isLast ? "0px" : "1px")};
  background: #eaecf0;
  margin: 30px 0px;
`;

const StyledTooltip = styled(Tooltip)`
  margin-left: 10px;
  position: relative;
  top: -10px;
`;

const Label = styled.label`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: white;
`;

export default CreateService;
