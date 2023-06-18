import axios from "axios";
import { observable, computed, makeObservable } from "mobx";
import { configure, flow } from "mobx";
// import FuzzySet from "fuzzyset";
import Filter from "bad-words";

// import FREE_TOOLS from "./tools/previewTools";

import config from "./config";
import {
  categories,
  mapArraytoReactSelectorOptions
} from "./Admin/Services/Create/index";

let filterBadWords = new Filter();

let baseURL = config.baseURL;

configure({ enforceActions: "never" });

let api = axios.create({ baseURL });

// const FuzzySearch = FuzzySet([...TOOLS.map(tool => tool.title)]);

class appStore {
  api = api;
  @observable baseURL = baseURL;
  @observable redirect = ``;
  @observable editor;
  @observable tools = [];
  @observable isCuratedCategoryLoading = true;
  @observable freeTools = [];

  // User Profile
  @observable profile = {};
  @observable searchValue = "";
  @observable isLoggedIn = false;
  @observable loginLoading = false;

  @observable landingPageUrl = config.landingPageUrl;

  // CHATS!
  @observable chatLogs = [];
  @observable categories = mapArraytoReactSelectorOptions(categories);
  @observable curatedCategoryCharacter = {};
  constructor() {
    // console.log("categories", mapArraytoReactSelectorOptions(categories));
    makeObservable(this);
    this.init();
    // Check credits every time, and log out people who aren't authenticated
    // this.api.interceptors.response.use(
    //   response => {
    //     this.updateCredits(response);
    //     return response;
    //   },
    //   error => {
    //     console.log(error);
    //     console.log(`error.response.statusText`, error.response.statusText);
    //     if (
    //       error.response &&
    //       error.response.statusText === "Token Authentication Failed"
    //     ) {
    //       this.handleLogout();
    //     }
    //     if (
    //       error.response &&
    //       error.response.statusText === "No Credit Remaining"
    //     ) {
    //       this.noCreditsRemainPrompt();
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }

  // setEditorOutput = async output => {
  //   this.editorOutput = output;
  // };

  // noCreditsRemainPrompt = () => {
  //   // set the browser url to the no-credits page
  //   window.location.pathname = "/my-profile";
  // };

  init = async () => {
    //   try {
    //     this.referralTrackingCode();
    //     const profile = localStorage.getItem("profile");
    //     const token = localStorage.getItem("token");
    //     if (profile && token) {
    //       if (window.self !== window.top) {
    //         window.top.location.href = "https://beta.plannr.ai/";
    //       }
    //       this.api.defaults.headers.common["x-access-token"] = token;
    //       this.profile = JSON.parse(profile);
    //       this.findTools();
    //       this.isLoggedIn = true;
    console.log("in init");
    this.getCuratedCategory();
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
  };

  // @observable referral = "";
  // referralTrackingCode = async () => {
  //   let referral = new URLSearchParams(window.location.search).get("referral");
  //   if (referral) {
  //     this.setReferral(referral);
  //   } else {
  //     this.initReferral();
  //   }
  // };

  updateSearchResult = event => {
    if (event) {
      this.searchValue = event.target.value;
    } else {
      this.searchValue = "";
    }
  };

  refreshCharacters = async () => {
    this.getCuratedCategory();
  };

  getCuratedCategory = async () => {
    const response = await this.api.get(`/services/charaterCategoryMap`);
    this.isCuratedCategoryLoading = false;
    // const allResult = Object.keys(response.data.finalResponse).reduce(
    //   (accumulator, currentValue) => {
    //     return accumulator.concat(response.data.finalResponse[currentValue]);
    //   },
    //   []
    // );

    // console.log("response.data.finalResponse", response.data.finalResponse);
    this.curatedCategoryCharacter = {
      // all: allResult,
      ...response.data.finalResponse
    };
    return "done";
  };

  // setReferral = async referral => {
  //   this.referral = referral;
  //   localStorage.setItem("referral", JSON.stringify(referral));
  // };

  setChatLogs = log => {
    this.chatLogs = [...this.chatLogs, ...log];
  };

  initializeChatLogs = log => {
    this.chatLogs = [...log];
  };

  // initReferral = async () => {
  //   const referral = localStorage.getItem("referral");
  //   this.referral = referral;
  // };

  // loginWithDataTokenAndProfile = async (data, history) => {
  //   this.setToken(data.token);
  //   this.setProfile(data.profile);
  //   this.findTools();
  //   this.isLoggedIn = true;
  //   if (window.self !== window.top) {
  //     // if the current page is inside an iframe, redirect the parent window
  //     window.top.location.href = "https://beta.plannr.ai/";
  //   } else {
  //     history.push("/");
  //   }
  // };

  // loginAsGuest = guestProfile => {
  //   this.setProfile(guestProfile);
  // };

  // refreshTokenAndProfile = async () => {
  //   try {
  //     console.log("in refresh token");
  //     let data = await this.api
  //       .post("/user/refresh/profile")
  //       .then(({ data }) => data);
  //     if (data) {
  //       this.setProfile(data.profile);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     this.handleLogout();
  //   }
  // };

  // setToken = async token => {
  //   this.api.defaults.headers.common["x-access-token"] = token;
  //   localStorage.setItem("token", token);
  // };

  // setProfile = async profile => {
  //   this.profile = profile;
  //   localStorage.setItem("profile", JSON.stringify(profile));
  // };

  // handleLogout = () => {
  //   this.isLoggedIn = false;
  //   this.profile = {};
  //   this.api.defaults.headers.common["x-access-token"] = "";
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("profile");
  // };

  // @observable toolsKeyword = "";
  // onChangeToolsKeyword = e => {
  //   this.toolsKeyword = e.target.value;
  // };

  // @computed get tools() {
  //   // let tools = TOOLS.filter(tool => tool.title.toLowerCase().includes(this.toolsKeyword.toLowerCase()))
  //   let fuzzyTools = FuzzySearch.get(this.toolsKeyword, 0.5);
  //   if (fuzzyTools && fuzzyTools.length) {
  //     let fuzzySummary = fuzzyTools.map((fuzzyTool) => fuzzyTool[1]);
  //     if (fuzzySummary && fuzzySummary.length) {
  //       return this.tools.filter((tool) => fuzzySummary.includes(tool.title));
  //     }
  //   }
  //   return TOOLS;
  // }

  // getToolByTitle = title => {
  //   return this.tools.find(tool => tool.title === title);
  // };

  // getToolByUrl = (url, isPreview = false) => {
  //   if (isPreview) {
  //     return FREE_TOOLS.find(tool => url.includes(tool.to));
  //   }
  //   return this.tools.find(tool => url.includes(tool.to));
  // };
}

export default appStore;
