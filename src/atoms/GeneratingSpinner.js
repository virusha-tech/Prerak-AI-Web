import * as React from "react";
import { CircularProgress, Box } from "@mui/material";
import styled from "styled-components";

// import LoaderBulb from "./../../assets/bulb.jpeg";

export default function GeneratingSpinner(props) {
  return (
    <Box
      sx={{ display: "flex" }}
      style={{ display: "grid", placeItems: "center", height: "70vh" }}
    >
      <Center>
        {props.showLoader ? (
          <CircularProgress size={80} color="primary" />
        ) : null}
        {/* <img src={LoaderBulb} width="100" alt="loader_logo" /> */}
        {props.children ?? (
          <div>
            <p style={{ textAlign: "center" }}>
              "Awesome! Plannr AI is whipping up your personalized plan.
            </p>
            <p style={{ textAlign: "center" }}>
              Hang tight, it usually only takes 2-3 mins. Remember, good things
              come to those who wait! 🚀"
            </p>
          </div>
        )}
      </Center>
    </Box>
  );
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;
