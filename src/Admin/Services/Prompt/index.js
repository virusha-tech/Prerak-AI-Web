import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Button, Tooltip } from "@mui/material";
import Select from "react-select";
import User from "../../../assets/User.png";
import styled from "styled-components";

const serviceCardFields = [
  {
    title: "Character Prompt",
    attr: "prompt",
    value: "",
    required: true,
    type: "textArea",
    rows: 8
  },
  {
    title: "Character Starting Sentence",
    attr: "characterStartingSentence",
    value: "",
    placeholder: "Enter your character starting Sentence",
    required: true,
    type: "textArea",
    rows: 4
  }
];

const PromptService = ({ postServiceDetails, currentServiceId, store }) => {
  const [service, setService] = useState({});
  const [img, setImage] = useState(null);
  const [serviceError, setServiceError] = useState({});

  //   useEffect(() => {
  //     async function fetchData() {
  //       if (currentServiceId) {
  //         const resp = await store.api.get(`/services/${currentServiceId}`);
  //         const {
  //           category = "",
  //           title = "",
  //           desc = "",
  //           file = "",
  //           isExecutionAvailable = "",
  //           isTrackingAvailable = "",
  //           isFreelyAvailable = ""
  //         } = resp.data;
  //         setImage(file);
  //         setService({
  //           category,
  //           title,
  //           desc,
  //           isExecutionAvailable: String(isExecutionAvailable),
  //           isTrackingAvailable: String(isTrackingAvailable),
  //           isFreelyAvailable: String(isFreelyAvailable)
  //         });
  //       }
  //     }
  //     fetchData();
  //   }, [currentServiceId]);

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
      formData.append(key, service[key]);
    }
    console.log(formData);
    // postServiceDetails(formData);
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
    rows,
    isMulti = false
  }) => {
    switch (type) {
      case "textArea":
        return (
          <>
            <label
              htmlFor={attr}
              className="relative transition text-gray-600 focus-within:text-gray-800 block"
            >
              <textarea
                rows={rows || 3}
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

  console.log("service", service);
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
                      isMulti: field.isMulti ?? false,
                      rows: field.rows || 3
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
    flex: 1;
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

  /* .right {
    flex: 0.4;
    display: flex;
    min-height: 200px;
    align-self: flex-start;
    margin-top: 36px;
    justify-content: space-around;
  } */

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

export default PromptService;
