import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import GeneratingSpinner from "../../../atoms/GeneratingSpinner";

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

var options = {
  disableFields: [
    "autocomplete",
    "button",
    "file",
    "header",
    "hidden",
    "number",
    "select",
    "dateRange",
    "date",
    "hidden",
    "text",
    "radio-group",
    "checkbox-group",
    "textarea"
  ],
  disabledActionButtons: ["data", "clear", "save"],
  controlOrder: ["paragraph"],
  disabledAttrs: [
    "access",
    "value",
    "style",
    "inline",
    "other",
    "step",
    "name",
    "subtype",
    "toggle",
    "className"
  ]
};

function PlaceholderQuestionsService({
  postServiceDetails,
  currentServiceId,
  store
}) {
  const formBuilderRef = useRef(null);
  const [isformBuilderAvailable, setFormBuilderAvailable] = useState(false);

  useEffect(() => {
    debugger;
    let newOptions = { ...options };
    async function fetchData() {
      if (currentServiceId) {
        const resp = await store.api.get(`/services/${currentServiceId}`);
        const { sampleQuestions = "[]" } = resp.data;
        console.log("sampleQuestions", JSON.parse(sampleQuestions));

        if (JSON.parse(sampleQuestions).length) {
          newOptions = {
            ...newOptions,
            formData: sampleQuestions
          };
        }
      }

      window.jQuery(function($) {
        const fbEditor = document.getElementById("fb-editor");
        formBuilderRef.current = $(fbEditor).formBuilder(newOptions);
        setFormBuilderAvailable(true);
      });
    }
    fetchData();
  }, []);

  const handleSave = () => {
    const result = formBuilderRef.current.actions.save();
    const mappedRes = result.map(res => {
      return {
        ...res,
        value: "",
        error: "",
        attr: toCamelCase(res.label)
      };
    });
    const formData = new FormData();
    formData.append("sampleQuestions", JSON.stringify(mappedRes));
    postServiceDetails(formData);
  };

  const handleClear = () => {
    if (!formBuilderRef.current.actions.getData().length) {
      window.alert("There are no fields to clear");
      return;
    } else {
      const isConfirm = window.confirm(
        "Are you sure you want to clear all fields?"
      );
      if (isConfirm) {
        formBuilderRef.current.actions.clearFields();
      }
    }
  };

  return (
    <Wrapper>
      <div>
        <h1>Add Form Fields</h1>
        <div id="fb-editor"></div>
        {isformBuilderAvailable ? (
          <>
            <ActionBtnWrapper className="action_btns">
              <Button variant="contained" type="button" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="contained" type="button" onClick={handleSave}>
                Save
              </Button>
            </ActionBtnWrapper>
          </>
        ) : (
          <GeneratingSpinner showLoader={true}>
            Loading Plan Input Fields Editor...
          </GeneratingSpinner>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 40px 38px;
  background: white;
  color: black;
  h1 {
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 38px;
    color: #101828;
  }
  #fb-editor {
    margin: 50px 0pc 30px;
  }
`;

const ActionBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 25px;
`;

export default PlaceholderQuestionsService;
