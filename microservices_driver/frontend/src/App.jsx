import React, { useState } from "react";
import TopAppBar from "./components/TopAppBar";
import BottomNavBar from "./components/BottomNavBar";
import P1_Login from "./pages/P1_Login";
import P2_Dashboard from "./pages/P2_Dashboard";
import P3_TaskList from "./pages/P3_TaskList";
import P4_TaskDetail from "./pages/P4_TaskDetail";
import P5_TempMonitor from "./pages/P5_TempMonitor";
import P6_ExceptionReport from "./pages/P6_ExceptionReport";
import P7_Signature from "./pages/P7_Signature";
import P8_Profile from "./pages/P8_Profile";

const pagesWithNav = ["dashboard", "tasklist", "taskdetail", "tempmonitor", "signature", "profile"];
const pagesWithTopBar = ["dashboard", "tasklist", "taskdetail", "tempmonitor", "profile", "signature"];

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const navigate = (page) => setCurrentPage(page);

  const renderPage = () => {
    const pages = {
      login: { comp: P1_Login },
      dashboard: { comp: P2_Dashboard },
      tasklist: { comp: P3_TaskList },
      taskdetail: { comp: P4_TaskDetail },
      tempmonitor: { comp: P5_TempMonitor },
      exception: { comp: P6_ExceptionReport },
      signature: { comp: P7_Signature },
      profile: { comp: P8_Profile },
    };
    const Page = pages[currentPage]?.comp || P1_Login;
    return React.createElement(Page, { onNavigate: navigate });
  };

  return React.createElement("div", { className: "min-h-screen bg-background text-on-surface flex flex-col" },
    pagesWithTopBar.includes(currentPage) ? React.createElement(TopAppBar, { page: currentPage }) : null,
    React.createElement("main", { className: "flex-1" }, renderPage()),
    pagesWithNav.includes(currentPage) ? React.createElement(BottomNavBar, { currentPage, onNavigate: navigate }) : null
  );
}
