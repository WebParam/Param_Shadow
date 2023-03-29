// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import dayjs from "dayjs";
import { fetchNotecardData } from "../src/lib/notecardData";
import TempChart from "../src/components/TempChart";
import VoltageChart from "../src/components/VoltageChart";
import { convertCelsiusToFahrenheit } from "../src/util/helpers";
import EventTable from "../src/components/EventTable";
import styles from "../styles/Home.module.scss";
import { FaFilter } from 'react-icons/fa';
import { Line,Doughnut ,Bar} from 'react-chartjs-2';
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  BarElement,
  Legend,
} from 'chart.js';

type dataProps = {
  uid: string;
  device_uid: string;
  file: string;
  captured: string;
  received: string;
  body: {
    temperature: number;
    voltage: number;
    status: string;
  };
  tower_location?: {
    when: string;
    latitude: number;
    longitude: number;
  };
  gps_location: {
    latitude: number;
    longitude: number;
  };
};

export default function Home({ data }: { data: dataProps[] }) {
  // needed to make the Leaflet map render correctly
  const MapWithNoSSR = dynamic(() => import("../src/components/MapHotspot"), {
    ssr: false,
  });

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    // Legend
  );
  const [lngLatCoords, setLngLatCoords] = useState<number[][]>([]);
  const [lastPosition, setLastPosition] = useState<[number, number]>([
    33.82854810044288, -84.32526648205214,
  ]);
  const [latestTimestamp, setLatestTimestamp] = useState<string>("");
  const [latLngMarkerPositions, setLatLngMarkerPositions] = useState<
    [number, number][]
  >([]);
  const [tempData, setTempData] = useState<
    { date: string; shortenedDate: string; temp: number }[]
  >([]);

  const [voltageData, setVoltageData] = useState<
    { date: string; shortenedDate: string; voltage: number }[]
  >([]);
  const [eventTableData, setEventTableData] = useState<dataProps[]>([]);

  <style>

    
  </style>
  useEffect(() => {
    const lngLatArray: number[][] = [];
    const latLngArray: [number, number][] = [];
    const temperatureDataArray: {
      date: string;
      shortenedDate: string;
      temp: number;
    }[] = [];
    const voltageDataArray: {
      date: string;
      shortenedDate: string;
      voltage: number;
    }[] = [];
    if (data && data.length > 0) {
      const eventData = [...data].reverse();
      setEventTableData(eventData);
      data
        .sort((a, b) => {
          return Number(a.captured) - Number(b.captured);
        })
        .map((event) => {
          let lngLatCoords: number[] = [];
          let latLngCoords: [number, number] = [0, 1];
          console.log("eve", event)
          const temperatureObj = {
            date: dayjs(event.captured).format("MMM D, YYYY h:mm A"),
            shortenedDate: dayjs(event.captured).format("MM/DD/YYYY"),
            temp: Number(convertCelsiusToFahrenheit(event.temperature)),
          };
          temperatureDataArray.push(temperatureObj);
          const voltageObj = {
            date: dayjs(event.captured).format("MMM D, YYYY h:mm A"),
            shortenedDate: dayjs(event.captured).format("MM/DD/YYYY"),
            voltage: Number(event.voltage.toFixed(2)),
          };
          voltageDataArray.push(voltageObj);
          if (event.gps_location !== null) {
            lngLatCoords = [
              event.gps_location?.longitude,
              event.gps_location?.latitude,
            ];
            latLngCoords = [
              event.gps_location?.latitude,
              event.gps_location?.longitude,
            ];
          } else if (event.tower_location) {
            lngLatCoords = [
              event.tower_location?.longitude,
              event.tower_location?.latitude,
            ];
            latLngCoords = [
              event.tower_location?.latitude,
              event.tower_location?.longitude,
            ];
          }
          lngLatArray.push(lngLatCoords);
          latLngArray.push(latLngCoords);
        });
      const lastEvent = data.at(-1);
      console.log(lastEvent)
      let lastCoords: [number, number] = [0, 1];
      if (lastEvent && lastEvent.gps_location !== null) {
        lastCoords = [
          lastEvent.gps_location.latitude,
          lastEvent.gps_location.longitude,
        ];
      } else if (lastEvent && lastEvent.tower_location) {
        lastCoords = [
          lastEvent.tower_location.latitude,
          lastEvent.tower_location.longitude,
        ];
      }
      setLastPosition(lastCoords);
      const timestamp = dayjs(lastEvent?.captured).format("MMM D, YYYY h:mm A");
      setLatestTimestamp(timestamp);
    }
    setLngLatCoords(lngLatArray);
    setLatLngMarkerPositions(latLngArray);
    console.log("te", temperatureDataArray);
    const tempArr = [
      {
          "date": "Nov 27, 2022 5:00 AM",
          "shortenedDate": "5:00",
          "temp": 0
      },
      {
          "date": "Nov 27, 2022 5:30 AM",
          "shortenedDate": "5:30",
          "temp": 5
      },
      {
          "date": "Nov 27, 2022 6:00 AM",
          "shortenedDate": "6:00",
          "temp": 11
      },
      {
          "date": "Nov 27, 2022 6:30 AM",
          "shortenedDate": "6:30",
          "temp": 13
      },
      {
          "date": "Nov 27, 2022 7:00 AM",
          "shortenedDate": "7:00",
          "temp": 21
      },
      {
        "date": "Nov 27, 2022 7:30 AM",
        "shortenedDate": "7:30",
        "temp": 25
      },
      {
      "date": "Nov 27, 2022 8:00 AM",
      "shortenedDate": "8:00",
      "temp": 25
      },
      {
          "date": "Nov 27, 2022 8:30 AM",
          "shortenedDate": "8:30",
          "temp": 27
      },
      {
        "date": "Nov 27, 2022 9:00 AM",
        "shortenedDate": "9:00",
        "temp": 13
      },
      {
          "date": "Nov 27, 2022 9:30 AM",
          "shortenedDate": "9:30",
          "temp": 21
      },
      {
        "date": "Nov 27, 2022 10:00 AM",
        "shortenedDate": "10:00",
        "temp": 18
      },
      {
      "date": "Nov 27, 2022 10:30 AM",
      "shortenedDate": "10:30",
      "temp": 11
      },
      {
          "date": "Nov 27, 2022 8:30 AM",
          "shortenedDate": "11:00",
          "temp": 5
      },
      {
        "date": "Nov 27, 2022 10:00 AM",
        "shortenedDate": "11:30",
        "temp": 2
      },
      {
      "date": "Nov 27, 2022 10:30 AM",
      "shortenedDate": "12:00",
      "temp": 18
      },
      {
          "date": "Nov 27, 2022 8:30 AM",
          "shortenedDate": "12:30",
          "temp": 21
      },
      {
        "date": "Nov 27, 2022 10:00 AM",
        "shortenedDate": "13:00",
        "temp": 25
      },
      {
      "date": "Nov 27, 2022 10:30 AM",
      "shortenedDate": "13:30",
      "temp": 19
      },
      {
          "date": "Nov 27, 2022 8:30 AM",
          "shortenedDate": "14:00",
          "temp": 4
      },
  ];
    setTempData(tempArr);
    setVoltageData(voltageDataArray);
  }, [data]);


  interface row {
    [row: { string }]: any;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Latest Events",
        columns: [
          {
            Header: "Date",
            accessor: "captured",
            Cell: (props: { value: string }) => {
              const tidyDate = dayjs(props.value).format("MMM D, YY h:mm A");
              return <span>{tidyDate}</span>;
            },
          },
          // {
          //   Header: "Voltage",
          //   accessor: "body.voltage",
          //   Cell: (props: { value: string }) => {
          //     const tidyVoltage = Number(props.value).toFixed(2);
          //     return <span>{tidyVoltage}V</span>;
          //   },
          // },
          {
            Header: "Heartbeat",
            accessor: "status",
          },
          {
            Header: "GPS Location",
            accessor: "gps_location",
            Cell: (row) => {
              console.log("rp", row)
              return (
                <span>
                  {row.row.original.gps_location.latitude.toFixed(6)}
                  &#176;,&nbsp;
                  {row.row.original.gps_location.longitude.toFixed(6)}&#176;
                </span>
              );
            },
          },
          {
            Header: "Cell Tower Location",
            accessor: "tower_location",
            Cell: (row) => {
              return (
                <span>
                  {row.row.original.tower_location.latitude.toFixed(3)}
                  &#176;,&nbsp;
                  {row.row.original.tower_location.longitude.toFixed(3)}&#176;
                </span>
              );
            },
          },
        ],
      },
    ],
    []
  );
  const labels = ['','','','',''];

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'probability'
        }
      }]
      
    },
    plugins: {
      legend: {
        display: false
      }
    },
  };
  
   const _data = {
    labels,
    datasets: [
      {
        label: '',
        data: [0,1200,1700,2100,4100,2900],
        borderColor: 'rgb(255, 99, 132)',
        // backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      
    ],
  };
  
  const _doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  //bar graph
  const barOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display:true
      },
      title: {
        display: true,
        text: 'Total impressions',
      },
    },
  };
  
  // const barLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const barLabels =  ['','','','',''];
  // const _barData =[0,2,0,15,23,45,52];
  // const _barData2 =[0,0,0,0,0,0,63,78,104,95,62,45];
  const barData = {
    labels:['Jan','Feb','Mar','Apr','May','June', 'July','Aug', 'Sep*','Oct*','Nov*'],
    datasets: [
      {
        label: 'Dataset 2',
        data: [5,15,38,89,103,170,205,0,0,0,0],
        backgroundColor: 'rgba(33, 162, 235, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [0,0,0,0,0,0,0,257,0,0,0],
        backgroundColor: 'rgba(219, 10, 91,0.5)',
      },
      {
        label: 'Dataset 2',
        data: [0,0,0,0,0,0,0,0,306,388,406],
        backgroundColor: 'rgba(144, 238, 144, 0.5)',
      },
    ],
  };
  //end bar graph

  return (
<>

    <div class="container-scroller">
      <nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a class="navbar-brand brand-logo" href="index.html"><img src="images/logo.svg" alt="logo"/></a>
          <a class="navbar-brand brand-logo-mini" href="index.html"><img src="images/logo-mini.svg" alt="logo"/></a>
          <button class="navbar-toggler navbar-toggler align-self-center d-none d-lg-flex" type="button" data-toggle="minimize">
            <span class="typcn typcn-th-menu"></span>
          </button>
        </div>
        <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul class="navbar-nav mr-lg-2">
            <li class="nav-item  d-none d-lg-flex">
              <a class="nav-link active" href="#">
                Home
              </a>
            </li>
            <li class="nav-item  d-none d-lg-flex">
              {/* <a  href="#"> */}
              <Link className="nav-link" href="/campaigns">
                Campaign
                </Link>
              {/* </a> */}
            </li>
            <li class="nav-item  d-none d-lg-flex">
              <a class="nav-link" href="#">
                Support
              </a>
            </li>
          </ul>
          <ul class="navbar-nav navbar-nav-right">
            <li class="nav-item d-none d-lg-flex  mr-2">
              <a class="nav-link" href="#">
                Help
              </a>
            </li>
            <li class="nav-item dropdown d-flex">
              <a class="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" href="#" data-toggle="dropdown">
                <i class="typcn typcn-message-typing"></i>
                <span class="count bg-success">2</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
                <p class="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    {/* <img src="images/faces/face4.jpg" alt="image" class="profile-pic"> */}
                  </div>
                  <div class="preview-item-content flex-grow">
                    <h6 class="preview-subject ellipsis font-weight-normal">David Grey
                    </h6>
                    <p class="font-weight-light small-text mb-0">
                      The meeting is cancelled
                    </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    {/* <img src="images/faces/face2.jpg" alt="image" class="profile-pic"> */}
                  </div>
                  <div class="preview-item-content flex-grow">
                    <h6 class="preview-subject ellipsis font-weight-normal">Tim Cook
                    </h6>
                    <p class="font-weight-light small-text mb-0">
                      New product launch
                    </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    {/* <img src="images/faces/face3.jpg" alt="image" class="profile-pic"> */}
                  </div>
                  <div class="preview-item-content flex-grow">
                    <h6 class="preview-subject ellipsis font-weight-normal"> Johnson
                    </h6>
                    <p class="font-weight-light small-text mb-0">
                      Upcoming board meeting
                    </p>
                  </div>
                </a>
              </div>
            </li>
            <li class="nav-item dropdown  d-flex">
              <a class="nav-link count-indicator dropdown-toggle d-flex align-items-center justify-content-center" id="notificationDropdown" href="#" data-toggle="dropdown">
                <i class="typcn typcn-bell mr-0"></i>
                <span class="count bg-danger">2</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <p class="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-success">
                      <i class="typcn typcn-info-large mx-0"></i>
                    </div>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal">Application Error</h6>
                    <p class="font-weight-light small-text mb-0">
                      Just now
                    </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-warning">
                      <i class="typcn typcn-cog mx-0"></i>
                    </div>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal">Settings</h6>
                    <p class="font-weight-light small-text mb-0">
                      Private message
                    </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <div class="preview-icon bg-info">
                      <i class="typcn typcn-user-outline mx-0"></i>
                    </div>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal">New user registration</h6>
                    <p class="font-weight-light small-text mb-0">
                      2 days ago
                    </p>
                  </div>
                </a>
              </div>
            </li>
            <li class="nav-item nav-profile dropdown">
              <a class="nav-link dropdown-toggle  pl-0 pr-0" href="#" data-toggle="dropdown" id="profileDropdown">
                <i class="typcn typcn-user-outline mr-0"></i>
                <span class="nav-profile-name">Kenneth Useman</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                <a class="dropdown-item">
                <i class="typcn typcn-cog text-primary"></i>
                Settings
                </a>
                <a class="dropdown-item">
                <i class="typcn typcn-power text-primary"></i>
                Logout
                </a>
              </div>
            </li>
          </ul>
          <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span class="typcn typcn-th-menu"></span>
          </button>
        </div>
      </nav>
      <div class="container-fluid page-body-wrapper">
        <div class="theme-setting-wrapper">
          <div id="settings-trigger"><i class="typcn typcn-cog-outline"></i></div>
          <div id="theme-settings" class="settings-panel">
            <i class="settings-close typcn typcn-delete-outline"></i>
            <p class="settings-heading">SIDEBAR SKINS</p>
            <div class="sidebar-bg-options" id="sidebar-light-theme">
              <div class="img-ss rounded-circle bg-light border mr-3"></div>
              Light
            </div>
            <div class="sidebar-bg-options selected" id="sidebar-dark-theme">
              <div class="img-ss rounded-circle bg-dark border mr-3"></div>
              Dark
            </div>
            <p class="settings-heading mt-2">HEADER SKINS</p>
            <div class="color-tiles mx-0 px-4">
              <div class="tiles success"></div>
              <div class="tiles warning"></div>
              <div class="tiles danger"></div>
              <div class="tiles primary"></div>
              <div class="tiles info"></div>
              <div class="tiles dark"></div>
              <div class="tiles default border"></div>
            </div>
          </div>
        </div>
        <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav" style={{position:"fixed"}}>
          <li class="nav-item">
            <div class="d-flex sidebar-profile">
              <div class="sidebar-profile-image">
                {/* <img src="images/faces/face29.png" alt="image"> */}
                <span class="ml-4 sidebar-status-indicator"></span>
              </div>
              <div class="sidebar-profile-name">
                <p class="sidebar-name">
                  Kenneth Useman
                </p>
                <p class="sidebar-designation">
                  Welcome
                </p>
              </div>
            </div>
            <div class="nav-search">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Type to search..." /> 
                <div class="input-group-append">
                  <span class="input-group-text" id="search">
                    <i class="typcn typcn-zoom"></i>
                  </span>
                </div>
              </div>
            </div>
            <p class="sidebar-menu-title">Dash menu</p>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="index.html">
              <i class="typcn typcn-device-desktop menu-icon"></i>
              <span class="menu-title">Dashboard: Sanlam <span class="badge badge-primary ml-3">2</span></span>
            </a>
          </li>
          <li class="nav-item">
            <a className="nav-link" data-toggle="collapse" href="/campaigns" aria-expanded="false" aria-controls="ui-basic">
              <i class="typcn typcn-briefcase menu-icon"></i>
              <span class="menu-title">Campaigns</span>
              <i class="typcn typcn-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-basic">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/ui-features/buttons.html">Buttons</a></li>
                <li class="nav-item"> <a class="nav-link" href="pages/ui-features/dropdowns.html">Dropdowns</a></li>
                <li class="nav-item"> <a class="nav-link" href="pages/ui-features/typography.html">Typography</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
              <i class="typcn typcn-film menu-icon"></i>
              <span class="menu-title">Costs/Forecast</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="form-elements">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"><a class="nav-link" href="pages/forms/basic_elements.html">Basic Elements</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#charts" aria-expanded="false" aria-controls="charts">
              <i class="typcn typcn-chart-pie-outline menu-icon"></i>
              <span class="menu-title">Reports</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="charts">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/charts/chartjs.html">ChartJs</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#tables" aria-expanded="false" aria-controls="tables">
              <i class="typcn typcn-th-small-outline menu-icon"></i>
              <span class="menu-title">Targets</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="tables">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/tables/basic-table.html">Basic table</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#icons" aria-expanded="false" aria-controls="icons">
              <i class="typcn typcn-compass menu-icon"></i>
              <span class="menu-title">Geographic data</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="icons">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/icons/mdi.html">Mdi icons</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
              <i class="typcn typcn-user-add-outline menu-icon"></i>
              <span class="menu-title">Preferences</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="auth">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/samples/login.html"> Login </a></li>
                <li class="nav-item"> <a class="nav-link" href="pages/samples/register.html"> Register </a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#error" aria-expanded="false" aria-controls="error">
              <i class="typcn typcn-globe-outline menu-icon"></i>
              <span class="menu-title">Support</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="error">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
                <li class="nav-item"> <a class="nav-link" href="pages/samples/error-500.html"> 500 </a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="pages/documentation/documentation.html">
              <i class="typcn typcn-document-text menu-icon"></i>
              <span class="menu-title">Documentation</span>
            </a>
          </li>
        </ul>
        {/* <ul class="sidebar-legend" style={{position:"fixed"}}>
          <li>
            <p class="sidebar-menu-title">Campaigns</p>
          </li>
          <li class="nav-item"><a href="#" class="nav-link">#Sanlam Glacier</a></li>
          <li class="nav-item"><a href="#" class="nav-link">#Sanlam Sanport</a></li>
          <li class="nav-item"><a href="#" class="nav-link">#Sanlam Sky</a></li>
        </ul> */}
      </nav>
        {/* <!-- partial --> */}
        <div class="main-panel">
          <div class="content-wrapper">
            {/* <div class="row">
              <div class="col-sm-6">
                <h3 class="mb-0 font-weight-bold">Kenneth Osborne</h3>
                <p>Your last login: 21h ago from newzealand.</p>
              </div>
              <div class="col-sm-6">
                <div class="d-flex align-items-center justify-content-md-end">
                  <div class="mb-3 mb-xl-0 pr-1">
                      <div class="dropdown">
                        <button class="btn bg-white btn-sm dropdown-toggle btn-icon-text border mr-2" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="typcn typcn-calendar-outline mr-2"></i>Last 7 days
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuSizeButton3" data-x-placement="top-start">
                          <h6 class="dropdown-header">Last 14 days</h6>
                          <a class="dropdown-item" href="#">Last 21 days</a>
                          <a class="dropdown-item" href="#">Last 28 days</a>
                        </div>
                      </div>
                  </div>
                  <div class="pr-1 mb-3 mr-2 mb-xl-0">
                    <button type="button" class="btn btn-sm bg-white btn-icon-text border"><i class="typcn typcn-arrow-forward-outline mr-2"></i>Export</button>
                  </div>
                  <div class="pr-1 mb-3 mb-xl-0">
                    <button type="button" class="btn btn-sm bg-white btn-icon-text border"><i class="typcn typcn-info-large-outline mr-2"></i>info</button>
                  </div>
                </div>
              </div>
            </div> */}
            <div class="row  mt-3">
              <div class="col-xl-4 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Campaigns by Channel</h4>
                      <div className="col-sm-9 col-md-6 col-lg-5">
                      <p ><span className="mt-1 mr-2 text-right" >Filter channel</span><FaFilter/> </p>
                    </div>
                    </div>
                    <input type="text" class="form-control" placeholder="Type to search..." aria-label="search" aria-describedby="search"></input>
                    
                    <br/>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          {/* <div class="col-lg-6">
                            <div id="circleProgress6" class="progressbar-js-circle rounded p-3"></div>
                          </div> */}
                          <div class="col-lg-6 float-left">
                          <h6 class="card-title mb-3">Motorycyle</h6>
                            <ul class="session-by-channel-legend">
                              {/* <li>
                                <div>eToyota One(3)</div>
                                <div>4(100%)</div>
                              </li> */}
                                <li>
                                <div>Sanlam Sky(18)</div>
                                <div>12(100%)</div>
                              </li>
                              <li>
                                <div>Sanlam Sanport(12)</div>
                                <div>12(100%)</div>
                              </li>
                              <li>
                                <div>Sanlam Glacier(23)</div>
                                <div>2(70%)</div>
                              </li>
                              <li>
                                <div>SHA Insurance(3)</div>
                                <div>7(100%)</div>
                              </li>
                              {/* <li>
                                <div>UberZA(3)</div>
                                <div>6(70%)</div>
                              </li> */}
                            </ul>
                          </div>
                          <div class="col-lg-6 float-left">
                          <h5 class="card-title mb-3">Taxi</h5>
                            <ul class="session-by-channel-legend">
                              {/* <li>
                                <div>eToyota One(3)</div>
                                <div>4(100%)</div>
                              </li> */}
                              <li>
                                <div>Sanlam Sanport(12)</div>
                                <div>12(100%)</div>
                              </li>
                              <li>
                                <div>Sanlam Glacier(233)</div>
                                <div>2(100%)</div>
                              </li>
                              <li>
                                <div>SHA Insurance(3)</div>
                                <div>7(100%)</div>
                              </li>
                              {/* <li>
                                <div>UberZA(3)</div>
                                <div>6(70%)</div>
                              </li> */}
                            </ul>
                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>              
              <div class="col-xl-5 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Campaign Activity</h4>
                      <br/> <br/>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                        <div style={{width:"100%"}} >
                          {/* <TempChart tempData={tempData} /> */}
                          <Bar options={barOptions} data={barData} />
                          <small>*estimated</small>

                        </div>
                          {/* <div class="col-sm-12">
                            <div class="d-flex justify-content-between mb-4">
                              <div>Uptime</div>
                              <div class="text-muted">195 Days, 8 hours</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div>First Seen</div>
                              <div class="text-muted">23 Sep 2019, 2.04PM</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div>Collected time</div>
                              <div class="text-muted">23 Sep 2019, 2.04PM</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div>Memory space</div>
                              <div class="text-muted">168.3GB</div>
                            </div>
                            <div class="progress progress-md mt-4">
                              <div class="progress-bar bg-success" role="progressbar" 
                              // style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                              ></div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Geographic data</h4>
                      <i class="typcn typcn typcn-chevron-left"></i>
                      <i class="typcn typcn typcn-chevron-right"></i>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                         
                          <div class="col-12 mt-4">
                            <div class="d-md-flex mb-2">
                              <div class="mr-md-5 mb-2">
                                <h4 class="mb-1"><i class="typcn typcn-globe-outline mr-1"></i>Rosebank, Sandton (15 drivers)</h4>
                                <h1 style={{fontSize:"3em"}} className="float-left text-primary font-weight-bold"><i class="typcn typcn-weather-partly-sunny mr-1"></i></h1>
                                <h3 className="float-left text-primary mt-3 font-weight-bold">22&deg;C </h3>
                                <h3 className="float-left text-primary mt-3 ml-3 font-weight-bold">26H/13L <i class="typcn typcn-thermometer mr-1"></i></h3>
                              </div>
                              {/* <Doughnut data={_data}/> */}
                            </div>
                            
                          </div> 
                          <div class="col-12">
                            <div class="d-md-flex mb-2">
                              <div class="mr-md-5 mb-2">
                                <h4 class="mb-1"><i class="typcn typcn-globe-outline mr-1"></i>Hyde park, Sandton (19 drivers)</h4>
                                <h1 style={{fontSize:"3em"}} className="float-left text-primary font-weight-bold"><i class="typcn typcn-weather-partly-sunny mr-1"></i></h1>
                                <h3 className="float-left text-primary mt-3 font-weight-bold">22&deg;C </h3>
                                <h3 className="float-left text-primary mt-3 ml-3 font-weight-bold">26H/13L <i class="typcn typcn-thermometer mr-1"></i></h3>
                              </div>
                              {/* <Doughnut data={_data}/> */}
                            </div>
                            
                          </div> 
                          <div class="col-12">
                            <div class="d-md-flex mb-4">
                              <div class="mr-md-5">
                                <h4 class="mb-1"><i class="typcn typcn-globe-outline mr-1"></i>Sea Point, Cape Town (16 drivers)</h4>
                                <h1 style={{fontSize:"3em"}} className="float-left text-primary font-weight-bold"><i class="typcn typcn-weather-sunny mr-1"></i></h1>
                                <h3 className="float-left text-primary mt-3 font-weight-bold">19&deg;C </h3>
                                <h3 className="float-left text-primary mt-3 ml-3 font-weight-bold">24H/18L <i class="typcn typcn-thermometer mr-1"></i></h3>
                              </div>
                              {/* <Doughnut data={_data}/> */}
                            </div>
                            
                          </div>                      

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>




            <div class="row">
            <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3"><i class="typcn typcn-eye mr-1"></i> Impressions</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                         
                          <div class="col-12">
                            <div class="d-md-flex mb-4">
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Total impressions</h5>
                                <h1 className="text-primary mb-1 font-weight-bold">23,342</h1>
                              </div>
                              <div>
                                <button type="button" class="btn btn-xs btn-light mr-1">Day</button>
                                <button type="button" class="btn btn-primary btn-xs mr-1">Week</button>
                                <button type="button" class="btn btn-xs btn-light">Month</button>
                              </div>
                            </div>
                            
                            <Line options={options} data={_data}/>
                          </div> 

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>             
              <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3"><i class="typcn typcn-world mr-1"></i>Distance</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                        <div class="col-12">
                            <div class="d-md-flex mb-4">

                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Total Km's covered</h5>
                                <h1 class="text-secondary mb-1 font-weight-bold">13,221</h1>
                              </div>
                              <div>
                                <button type="button" class="btn btn-xs btn-primary btn-light mr-1">Day</button>
                                <button type="button" class="btn btn-primary btn-xs mr-1">Week</button>
                                <button type="button" class="btn btn-xs btn-light">Month</button>
                              </div>
                            </div>
                            <Line options={options} data={_data}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3"><i class="typcn typcn-chart-pie mr-1"></i> Allocation</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-12">
                            <div class="d-md-flex mb-4">
                             
                              <div class="mr-md-5">
                                <h5 class="mb-1">Current allocation</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">100%</h1>
                              </div>
                            </div>
                            <div className="ml-5" style={{height:"200px"}}>
                            <Doughnut data={_doughnutData}/>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div>
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3"><i class="typcn typcn-group mr-1"></i>Visibility</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-12">
                            <div class="d-md-flex mb-4">
                            
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Active boards</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">52</h1>
                              </div>
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Total Drivers</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">52</h1>
                              </div>
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Total Riders</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">52</h1>
                              </div>
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                            {/* <Doughnut data={_doughnutData}/> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div>
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3"><i class="typcn typcn-chart-line mr-1"></i>Effeciency</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-12">
                            <div class="d-md-flex mb-4">
                            
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Completion</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">82%</h1>
                              </div>
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Penetration</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">78%</h1>
                              </div>
                              <div class="mr-md-5 mb-4">
                                <h5 class="mb-1">Complaints</h5>
                                <h1 class="text-warning mb-1 font-weight-bold">0</h1>
                              </div>
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                            {/* <Doughnut data={_doughnutData}/> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  
                  </div>
                </div>
              </div>

            </div>



            <div class="row">
              <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Campaigns by geographic area</h4>
                      <input type="text" class="form-control" placeholder="Type to search..." aria-label="search" aria-describedby="search"></input>
                    </div>
                    <div class="row  mt-6">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-sm-12">
                            <div class="d-flex justify-content-between mt-4 mb-4">
                              <div class="font-weight-medium">Campaign name</div>
                              <div class="font-weight-medium">Impressions</div>
                            </div>
                            <div class="d-flex justify-content-between mt-4 mb-4">
                              <div class="text-secondary font-weight-medium">Sanlam Glacier: Motorcycle </div>
                              <div class="small">32K</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div class="text-secondary font-weight-medium">Sanlam Glacier: Taxi</div>
                              <div class="small">28K</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div class="text-secondary font-weight-medium">Sanlam Sanport: Motorcycle</div>
                              <div class="small">16K	</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div class="text-secondary font-weight-medium">Sanlam Sanport: Taxi </div>
                              <div class="small">23K</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div class="text-secondary font-weight-medium">Sanlam Sky: Taxi</div>
                              <div class="small">19K</div>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                              <div class="text-secondary font-weight-medium">SHA Insurance: Motorcycle</div>
                              <div class="small">42K</div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="text-secondary font-weight-medium">SHA Insurance: Taxi</div>
                                <div class="small">35K</div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-9 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Target map</h4>
                      <div className="col-md-4 float-right">
                      <button type="button" class="float-right btn btn-sm btn-primary ml-2">Johannesburg</button>
                      <button type="button" class="float-right btn btn-sm btn-light">Cape town</button>
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-12" style={{height:"500px"}}>
                        {/* <div class="d-md-flex mb-4">
                          <div class="mr-md-5 mb-4">
                            <h5 class="mb-1"><i class="typcn typcn-globe-outline mr-1"></i>Online</h5>
                            <h2 class="text-primary mb-1 font-weight-bold">23,342</h2>
                          </div>
                          <div class="mr-md-5 mb-4">
                            <h5 class="mb-1"><i class="typcn typcn-archive mr-1"></i>Offline</h5>
                            <h2 class="text-secondary mb-1 font-weight-bold">13,221</h2>
                          </div>
                          <div class="mr-md-5 mb-4">
                            <h5 class="mb-1"><i class="typcn typcn-tags mr-1"></i>Marketing</h5>
                            <h2 class="text-warning mb-1 font-weight-bold">1,542</h2>
                          </div>
                        </div> */}
                         <div className={styles.map}>
                          <MapWithNoSSR
                            coords={lngLatCoords}
                            lastPosition={lastPosition}
                            markers={latLngMarkerPositions}
                            latestTimestamp={latestTimestamp}
                          />
                        </div>
                        <canvas id="salesanalyticChart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div class="col-xl-3 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Card Title</h4>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="mb-5">
                          <div class="mr-1">
                            <div class="text-info mb-1">
                              Total Earning
                            </div>
                            <h2 class="mb-2 mt-2 font-weight-bold">287,493$</h2>
                            <div class="font-weight-bold">
                              1.4%  Since Last Month
                            </div>
                          </div>
                          
                          <div class="mr-1">
                            <div class="text-info mb-1">
                              Total Earning
                            </div>
                            <h2 class="mb-2 mt-2  font-weight-bold">87,493</h2>
                            <div class="font-weight-bold">
                              5.43%  Since Last Month
                            </div>
                          </div>
                        </div>
                        <canvas id="barChartStacked"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              
            </div>
            <div class="row">
              <div class="col-lg-12 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Impressions / Budget</h4>
                    </div>
                    <div class="row">
                      <div class="col-lg-9">
                        <div class="d-sm-flex justify-content-between">
                          <div class="dropdown">
                            <button class="btn bg-white btn-sm dropdown-toggle btn-icon-text pl-0" type="button" id="dropdownMenuSizeButton4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Mon,1 Oct 2019 - Tue,2 Oct 2019
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuSizeButton4" data-x-placement="top-start">
                              <h6 class="dropdown-header">Mon,17 Oct 2019 - Tue,25 Oct 2019</h6>
                              <a class="dropdown-item" href="#">Tue,18 Oct 2019 - Wed,26 Oct 2019</a>
                              <a class="dropdown-item" href="#">Wed,19 Oct 2019 - Thu,26 Oct 2019</a>
                            </div>
                          </div>
                          <div>
                            <button type="button" class="btn btn-sm btn-primary mr-2">Today</button>
                            <button type="button" class="btn btn-sm btn-light mr-2">Week</button>
                            <button type="button" class="btn btn-sm btn-light">Month</button>
                          </div>
                        </div>
                        <div class="chart-container mt-4">
                          {/* <canvas id="ecommerceAnalytic"></canvas> */}
                          <TempChart tempData={tempData} />
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="text-success font-weight-bold">Impressions</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">Last week</div>
                            <div class="text-muted">56,8K</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">This week</div>
                            <div class="text-muted">15.3K</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">30 day peak  (Tuesday 5th)</div>
                            <div class="text-muted">17.1K </div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">Total impressions</div>
                            <div class="text-muted">168.3K</div>
                          </div>
                          
                        </div>
                        {/* <hr> */}
                        <div class="mt-4">
                          <div class="d-flex justify-content-between mb-3">
                            <div class="text-success font-weight-bold">Budget forecast</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">Last week</div>
                            <div class="text-muted">25,160 ZAR</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">Today</div>
                            <div class="text-muted">2,810 ZAR</div>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <div class="font-weight-medium">This week (est.)</div>
                            <div class="text-muted">~33,120 ZAR</div>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div class="font-weight-medium">This month(est.)</div>
                            <div class="text-muted">~135,080 ZAR</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between mb-4">
                      <h4 class="card-title mb-3">Targets</h4>
                    </div>
                    <div class="mt-2">
                      <div class="d-flex justify-content-between">
                        <small>Impressions</small>
                        <small>80.5%</small>
                      </div>
                      <div class="progress progress-md  mt-2">
                        <div class="progress-bar bg-secondary" role="progressbar" 
                         style={{width: "80%"}}
                        ></div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="d-flex justify-content-between">
                        <small>Effeciency</small>
                        <small>78.2%</small>
                      </div>
                      <div class="progress progress-md  mt-2">
                        <div class="progress-bar bg-warning" role="progressbar" 
                        style={{width: "78%"}}
                        ></div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="d-flex justify-content-between">
                        <small>Complaints</small>
                        <small>100% (0)</small>
                      </div>
                      <div class="progress progress-md mt-2">
                        <div class="progress-bar bg-success" role="progressbar" 
                         style={{width: "100%"}}
                        ></div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="d-flex justify-content-between">
                        <small>Conversions</small>
                        <small>not configured</small>
                      </div>
                      <div class="progress progress-md mt-2">
                        <div class="progress-bar" role="progressbar" 
                         style={{width: "0%"}}
                        ></div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="d-flex justify-content-between">
                        <small>Budget</small>
                        <small>39%</small>
                      </div>
                      <div class="progress progress-md mt-2">
                        <div class="progress-bar bg-error" role="progressbar" 
                         style={{width: "39%"}}
                        ></div>
                      </div>
                    </div>
                    {/* <canvas id="salesTopChart"></canvas> */}
                  </div>
                </div>
              </div>
              <div class="col-lg-8 d-flex grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between">
                      <h4 class="card-title mb-3">Project status</h4>
                    </div>
                    <div class="table-responsive">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>
                              <div class="d-flex">
                                {/* <img class="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> Campaign</div>
                                  <div class="font-weight-bold mt-1">Sanlam Glacier</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div class="font-weight-bold  mt-1">55,000 ZAR </div>
                            </td>
                            <td>
                              Status
                              <div class="font-weight-bold text-success  mt-1">68% </div>
                            </td>
                            <td>
                              Deadline
                              <div class="font-weight-bold  mt-1">07 Nov 2022</div>
                            </td>
                            <td>
                              <button type="button" class="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="d-flex">``
                                {/* <img class="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face31.png" alt="profile image"> */}
                                <div>
                                  <div> Company</div>
                                  <div class="font-weight-bold  mt-1">Sanlam Sanport</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div class="font-weight-bold  mt-1">58,000 ZAR  </div>
                            </td>
                            <td>
                              Status
                              <div class="font-weight-bold text-success  mt-1">70% </div>
                            </td>
                            <td>
                              Deadline
                              <div class="font-weight-bold  mt-1">08 Nov 2022</div>
                            </td>
                            <td>
                              <button type="button" class="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="d-flex">
                                {/* <img class="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face32.png" alt="profile image"> */}
                                <div>
                                  <div> Company</div>
                                  <div class="font-weight-bold  mt-1">Sanlam Sky </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div class="font-weight-bold  mt-1">35,000 ZAR</div>
                            </td>
                            <td>
                              Status
                              <div class="font-weight-bold text-success  mt-1">87% </div>
                            </td>
                            <td>
                              Deadline
                              <div class="font-weight-bold  mt-1">11 Nov 2022</div>
                            </td>
                            <td>
                              <button type="button" class="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="d-flex">
                                {/* <img class="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face33.png" alt="profile image"> */}
                                <div>
                                  <div> Company</div>
                                  <div class="font-weight-bold  mt-1">SHA Insurance </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div class="font-weight-bold  mt-1">65,000 ZAR </div>
                            </td>
                            <td>
                              Status
                              <div class="font-weight-bold text-success  mt-1">75% </div>
                            </td>
                            <td>
                              Deadline
                              <div class="font-weight-bold  mt-1">26 Nov 2022</div>
                            </td>
                            <td>
                              <button type="button" class="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="d-sm-flex justify-content-center justify-content-sm-between">
              <span class="text-center text-sm-left d-block d-sm-inline-block">Copyright © <a href="https://www.webparam.org/" target="_blank">webparam.org</a> 2022</span>
            </div>
          </footer>
        </div>
      </div>
    </div>

    {/* <div className={styles.container}> */}
      {/* <Head>
        <title>Geolocation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Shadow v2.12</h1>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/> */}
        {/* <div className={styles.map}>
          <MapWithNoSSR
            coords={lngLatCoords}
            lastPosition={lastPosition}
            markers={latLngMarkerPositions}
            latestTimestamp={latestTimestamp}
          />
        </div> */}
        {/* <div className={styles.grid}>
          <TempChart tempData={tempData} />
        </div> */}
        {/* <div className={styles.grid}>
          <VoltageChart voltageData={voltageData} />
        </div> */}
        {/* <div className={styles.grid}>
          <EventTable columns={columns} data={eventTableData} />
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div> */}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  /* we're able to use Nextjs's ISR (incremental static regneration) 
  revalidate functionality to re-fetch updated map coords and re-render one a regular interval */
  const data = [{
    "bearing": 194.8890307950282,
    "distance": 5.591816976119877,
    "seconds": 36,
    "hdop": 1,
    "temperature": 19,
    "time": 1598560691,
    "usb": true,
    "velocity": 0.014337992246461224,
    "voltage": 4.727260437757979,
    status:"idle",
    "gps_location":{longitude: 27.9622222,latitude:-26.1311111
    },
    original:{longitude: 27.9622222,latitude: -26.1311111
    },
    tower_location:{longitude: 27.9622222,latitude: -26.1311111
    },
     }, {
      "bearing": 194.8890307950282,
      "distance": 5.591816976119877,
      "seconds": 36,
      "hdop": 1,
      "temperature": 22,
      "time": 1598560691,
      "usb": true,
      "velocity": 0.014337992246461224,
      "voltage": 4.727260437757979,
      status:"moving",
      "gps_location":{longitude: 27.9522222,latitude:-26.1911111
      
      },
      original:{longitude: 27.9522222,latitude: -26.1911111
      },
      tower_location:{longitude: 27.9522222,latitude: -26.1911111
      },
       },{
        "bearing": 194.8890307950282,
        "distance": 5.591816976119877,
        "seconds": 36,
        "hdop": 1,
        "temperature": 15,
        "time": 1598560691,
        "usb": true,
        "velocity": 0.014337992246461224,
        "voltage": 4.727260437757979,
        status:"idle",
        "gps_location":{longitude: 27.9422222,latitude:-26.2311111
        },
        original:{longitude: 27.9422222,latitude: -26.2311111
        },
        tower_location:{longitude: 27.9422222,latitude: -26.2311111
        },
         }];

  return { props: { data }, revalidate: 120 };
};
