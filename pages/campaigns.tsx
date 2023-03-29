
// @ts-ignore
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
    labels: ['Drivers', 'Riders'],
    datasets: [
      {
        label: '# of Votes',
        data: [21, 31],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
         
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
         
        ],
        borderWidth: 1,
      },
    ],
  };

  const _doughnutData2 = {
    labels: ['Drivers', 'Riders'],
    datasets: [
      {
        label: '# of Votes',
        data: [6855, 8896],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
         
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
         
        ],
        borderWidth: 1,
      },
    ],
  };


  const _doughnutData3 = {
    labels: ['Drivers', 'Riders'],
    datasets: [
      {
        label: '# of Votes',
        data: [184, 201],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
         
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
         
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

    <div className="container-scroller">
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a className="navbar-brand brand-logo" href="index.html"><img src="images/logo.svg" alt="logo"/></a>
          <a className="navbar-brand brand-logo-mini" href="index.html"><img src="images/logo-mini.svg" alt="logo"/></a>
          <button className="navbar-toggler navbar-toggler align-self-center d-none d-lg-flex" type="button" data-toggle="minimize">
            <span className="typcn typcn-th-menu"></span>
          </button>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item  d-none d-lg-flex">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>
            <li className="nav-item  d-none d-lg-flex">
              <a className="nav-link " href="#">
                Campaigns
              </a>
            </li>
            <li className="nav-item  d-none d-lg-flex">
              <a className="nav-link" href="#">
                Support
              </a>
            </li>
          </ul>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item d-none d-lg-flex  mr-2">
              <a className="nav-link" href="#">
                Help
              </a>
            </li>
            <li className="nav-item dropdown d-flex">
              <a className="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" href="#" data-toggle="dropdown">
                <i className="typcn typcn-message-typing"></i>
                <span className="count bg-success">2</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
                <p className="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    {/* <img src="images/faces/face4.jpg" alt="image" className="profile-pic"> */}
                  </div>
                  <div className="preview-item-content flex-grow">
                    <h6 className="preview-subject ellipsis font-weight-normal">David Grey
                    </h6>
                    <p className="font-weight-light small-text mb-0">
                      The meeting is cancelled
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    {/* <img src="images/faces/face2.jpg" alt="image" className="profile-pic"> */}
                  </div>
                  <div className="preview-item-content flex-grow">
                    <h6 className="preview-subject ellipsis font-weight-normal">Tim Cook
                    </h6>
                    <p className="font-weight-light small-text mb-0">
                      New product launch
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    {/* <img src="images/faces/face3.jpg" alt="image" className="profile-pic"> */}
                  </div>
                  <div className="preview-item-content flex-grow">
                    <h6 className="preview-subject ellipsis font-weight-normal"> Johnson
                    </h6>
                    <p className="font-weight-light small-text mb-0">
                      Upcoming board meeting
                    </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown  d-flex">
              <a className="nav-link count-indicator dropdown-toggle d-flex align-items-center justify-content-center" id="notificationDropdown" href="#" data-toggle="dropdown">
                <i className="typcn typcn-bell mr-0"></i>
                <span className="count bg-danger">2</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-success">
                      <i className="typcn typcn-info-large mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">Application Error</h6>
                    <p className="font-weight-light small-text mb-0">
                      Just now
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-warning">
                      <i className="typcn typcn-cog mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">Settings</h6>
                    <p className="font-weight-light small-text mb-0">
                      Private message
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-info">
                      <i className="typcn typcn-user-outline mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">New user registration</h6>
                    <p className="font-weight-light small-text mb-0">
                      2 days ago
                    </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle  pl-0 pr-0" href="#" data-toggle="dropdown" id="profileDropdown">
                <i className="typcn typcn-user-outline mr-0"></i>
                <span className="nav-profile-name">Kenneth Useman</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                <a className="dropdown-item">
                <i className="typcn typcn-cog text-primary"></i>
                Settings
                </a>
                <a className="dropdown-item">
                <i className="typcn typcn-power text-primary"></i>
                Logout
                </a>
              </div>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span className="typcn typcn-th-menu"></span>
          </button>
        </div>
      </nav>
      <div className="container-fluid page-body-wrapper">
        <div className="theme-setting-wrapper">
          <div id="settings-trigger"><i className="typcn typcn-cog-outline"></i></div>
          <div id="theme-settings" className="settings-panel">
            <i className="settings-close typcn typcn-delete-outline"></i>
            <p className="settings-heading">SIDEBAR SKINS</p>
            <div className="sidebar-bg-options" id="sidebar-light-theme">
              <div className="img-ss rounded-circle bg-light border mr-3"></div>
              Light
            </div>
            <div className="sidebar-bg-options selected" id="sidebar-dark-theme">
              <div className="img-ss rounded-circle bg-dark border mr-3"></div>
              Dark
            </div>
            <p className="settings-heading mt-2">HEADER SKINS</p>
            <div className="color-tiles mx-0 px-4">
              <div className="tiles success"></div>
              <div className="tiles warning"></div>
              <div className="tiles danger"></div>
              <div className="tiles primary"></div>
              <div className="tiles info"></div>
              <div className="tiles dark"></div>
              <div className="tiles default border"></div>
            </div>
          </div>
        </div>
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav" style={{position:"fixed"}}>
          <li className="nav-item">
            <div className="d-flex sidebar-profile">
              <div className="sidebar-profile-image">
                {/* <img src="images/faces/face29.png" alt="image"> */}
                <span className="ml-4 sidebar-status-indicator"></span>
              </div>
              <div className="sidebar-profile-name">
                <p className="sidebar-name">
                  Kenneth Useman
                </p>
                <p className="sidebar-designation">
                  Welcome
                </p>
              </div>
            </div>
            <div className="nav-search">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Type to search..." /> 
                <div className="input-group-append">
                  <span className="input-group-text" id="search">
                    <i className="typcn typcn-zoom"></i>
                  </span>
                </div>
              </div>
            </div>
            <p className="sidebar-menu-title">Dash menu</p>
          </li>
          <li className="nav-item">
            <a className="nav-link">
              <i className="typcn typcn-device-desktop menu-icon"></i>
              <span className="menu-title"><Link href="/" >Dashboard: Sanlam </Link> <span className="badge badge-primary ml-3">2</span></span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse"  aria-expanded="false" aria-controls="ui-basic">
              <i className="typcn typcn-briefcase menu-icon"></i>
              <span className="menu-title"><Link href="/campaigns" >Campaigns</Link></span>
              <i className="typcn typcn-chevron-right menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-basic">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/buttons.html">Buttons</a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/dropdowns.html">Dropdowns</a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/typography.html">Typography</a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse"  aria-expanded="false" aria-controls="form-elements">
              <i className="typcn typcn-film menu-icon"></i>
              <span className="menu-title"><Link href="/budget" >Costs/Forecast </Link></span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="form-elements">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"><a className="nav-link" href="pages/forms/basic_elements.html">Basic Elements</a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" aria-expanded="false" aria-controls="charts">
              <i className="typcn typcn-chart-pie-outline menu-icon"></i>
              <span className="menu-title"><Link href="/reports" >Reports</Link></span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="charts">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/charts/chartjs.html">ChartJs</a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" aria-expanded="false" aria-controls="tables">
              <i className="typcn typcn-th-small-outline menu-icon"></i>
              <span className="menu-title"><Link href="/targets" >Targets</Link></span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="tables">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/tables/basic-table.html">Basic table</a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
          <a className="nav-link" data-toggle="collapse"  aria-expanded="false" aria-controls="tables">
              <i className="typcn typcn-compass menu-icon"></i>
              <span className="menu-title"> <Link href="/geo" >Geographic data </Link></span>
              <i className="menu-arrow"></i>
           </a>
            <div className="collapse" id="icons">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/icons/mdi.html">Mdi icons</a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
              <i className="typcn typcn-user-add-outline menu-icon"></i>
              <span className="menu-title">Preferences</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="auth">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/samples/login.html"> Login </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/register.html"> Register </a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#error" aria-expanded="false" aria-controls="error">
              <i className="typcn typcn-globe-outline menu-icon"></i>
              <span className="menu-title">Support</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="error">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/error-500.html"> 500 </a></li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="pages/documentation/documentation.html">
              <i className="typcn typcn-document-text menu-icon"></i>
              <span className="menu-title">Documentation</span>
            </a>
          </li>
        </ul>
        {/* <ul className="sidebar-legend" style={{position:"fixed"}}>
          <li>
            <p className="sidebar-menu-title">Campaigns</p>
          </li>
          <li className="nav-item"><a href="#" className="nav-link">#Sanlam Glacier</a></li>
          <li className="nav-item"><a href="#" className="nav-link">#Sanlam Sanport</a></li>
          <li className="nav-item"><a href="#" className="nav-link">#Sanlam Sky</a></li>
        </ul> */}
      </nav>
        {/* <!-- partial --> */}
        <div className="main-panel">
          <div className="content-wrapper">
            {/* <div className="row">
              <div className="col-sm-6">
                <h3 className="mb-0 font-weight-bold">Kenneth Osborne</h3>
                <p>Your last login: 21h ago from newzealand.</p>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center justify-content-md-end">
                  <div className="mb-3 mb-xl-0 pr-1">
                      <div className="dropdown">
                        <button className="btn bg-white btn-sm dropdown-toggle btn-icon-text border mr-2" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="typcn typcn-calendar-outline mr-2"></i>Last 7 days
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuSizeButton3" data-x-placement="top-start">
                          <h6 className="dropdown-header">Last 14 days</h6>
                          <a className="dropdown-item" href="#">Last 21 days</a>
                          <a className="dropdown-item" href="#">Last 28 days</a>
                        </div>
                      </div>
                  </div>
                  <div className="pr-1 mb-3 mr-2 mb-xl-0">
                    <button type="button" className="btn btn-sm bg-white btn-icon-text border"><i className="typcn typcn-arrow-forward-outline mr-2"></i>Export</button>
                  </div>
                  <div className="pr-1 mb-3 mb-xl-0">
                    <button type="button" className="btn btn-sm bg-white btn-icon-text border"><i className="typcn typcn-info-large-outline mr-2"></i>info</button>
                  </div>
                </div>
              </div>
            </div> */}
                   <div className="row">
            <div className="col-xl-3 d-flex grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-eye mr-1"></i> Impressions</h4>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                         
                          <div className="col-12">
                            <div className="d-md-flex mb-4">
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total impressions</h5>
                                <h1 classNameName="text-primary mb-1 font-weight-bold">69,850</h1>
                              </div>
                              <div>
                                <button type="button" className="btn btn-xs btn-light mr-1">Day</button>
                                <button type="button" className="btn btn-primary btn-xs mr-1">Week</button>
                                <button type="button" className="btn btn-xs btn-light">Month</button>
                              </div>
                            </div>
                            <div className="row">
                        <div className="col-12">
                            <div className="d-md-flex mb-4">

                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Drivers</h5>
                                <h1 style={{fontSize:"2em"}} className="text-primary mb-1 font-weight-bold">21</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Riders</h5>
                                <h1 style={{fontSize:"2em"}} className="text-primary mb-1 font-weight-bold">31</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total</h5>
                                <h1 style={{fontSize:"2em"}} className="text-primary mb-1 font-weight-bold">52</h1>
                              </div>
                             
                            </div>
                            {/* <Line options={options} data={_data}/> */}
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
              <div className="col-xl-3 d-flex grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-world mr-1"></i>Distance</h4>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                        <div className="col-12">
                            <div className="d-md-flex mt-4">

                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total Kms covered</h5>
                                <h1 style={{fontSize:"3em"}} className="text-secondary mb-1 font-weight-bold">16,221</h1>
                              </div>
                             
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                          </div>
                        </div>
                        <div className="row">
                        <div className="col-12">
                            <div className="d-md-flex mb-4">

                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Drivers kms</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">6855</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Riders kms</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">8896</h1>
                              </div>
                             
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                          </div>
                        </div>
                        <div className="row">
                        <div className="col-12">
                            <div className="d-md-flex mb-4">

                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Drivers km/day</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">26</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Riders km/day</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">32</h1>
                              </div>
                             
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                          </div>
                        </div>
                        <div className="row">
                        <div className="col-12">
                            <div className="d-md-flex mb-4">

                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Drivers hours in buffer zone</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">184</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Riders hours in buffer zone</h5>
                                <h1 style={{fontSize:"2em"}} className="text-secondary mb-1 font-weight-bold">201</h1>
                              </div>
                             
                            </div>
                            {/* <Line options={options} data={_data}/> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 d-flex grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-chart-pie mr-1"></i> Allocation</h4>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                          <div className="d-md-flex mb-2">
                            
                            <div className="mr-md-6 mb-2 mr-4" style={{width:"45%"}}>
                              <h5 className="mb-1">Active boards</h5>
                              <Doughnut data={_doughnutData}/>
                            </div>
                            <div className="mr-md-5 mb-4 ml-4">
                              <h5 className="mb-1">Total boards</h5>
                              <h1 className="text-warning mb-1 font-weight-bold">52</h1>
                              <h5 className="mb-1">Total Drivers</h5>
                              <h1 className="text-warning mb-1 font-weight-bold">21</h1>
                              <h5 className="mb-1">Total Riders</h5>
                              <h1 className="text-warning mb-1 font-weight-bold">31</h1>
                            </div>

                          </div>                           
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-12">
                            <div className="d-md-flex mb-2">
                              
                              <div className="mr-md-5 mb-4" style={{width:"35%"}}>
                                <h5 className="mb-1">Kms covered</h5>
                                <Doughnut data={_doughnutData2}/>
                              </div>
                              <div className="mr-md-5 mb-4" style={{width:"35%"}}>
                                <h5 className="mb-1">Hours in buffer</h5>
                                <Doughnut data={_doughnutData3}/>
                              </div>

                            </div>                           
                            </div>

                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 d-flex grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div>
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-group mr-1"></i>Visibility</h4>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            <div className="d-md-flex mb-4">
                            
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Active boards</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">52</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total Drivers</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">21</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total Riders</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">31</h1>
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
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-chart-line mr-1"></i>Buffer zones</h4>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            <div className="d-md-flex mb-4">
                            
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1"># of buffer</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">3</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Hours in buffer</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">19.5 </h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Total Effeciency</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">82%</h1>
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
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3"><i className="typcn typcn-chart-line mr-1"></i>Effectiveness</h4>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            <div className="d-md-flex mb-4">
                            
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Completion</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">82%</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Penetration</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">78%</h1>
                              </div>
                              <div className="mr-md-5 mb-4">
                                <h5 className="mb-1">Complaints</h5>
                                <h1 className="text-warning mb-1 font-weight-bold">0</h1>
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
            <div className="row  mt-3">
              <div className="col-xl-12 d-flex grid-margin stretch-card">
              <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3">Active campaigns</h4>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex">
                                {/* <img className="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> Campaign</div>
                                  <div className="font-weight-bold mt-1">Sanlam Sky</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div className="font-weight-bold  mt-1">55,000 ZAR </div>
                            </td>
                            <td>
                              Progress
                              <div className="font-weight-bold text-success  mt-1">68% </div>
                            </td>
                            <td>
                              Effeciency
                              <div className="font-weight-bold  mt-1">73% </div>
                            </td>
                            <td>
                              Riders
                              <div className="font-weight-bold  mt-1">9 </div>
                            </td>
                            <td>
                              Drivers
                              <div className="font-weight-bold  mt-1">4</div>
                            </td>
                            <td>
                              Assets
                              <div className="font-weight-bold  mt-1"><a href=""></a>view assets</div>
                            </td>
                            <td>
                              <button type="button" className="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex">
                                {/* <img className="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> Campaign</div>
                                  <div className="font-weight-bold mt-1">Sanlam Glacier</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div className="font-weight-bold  mt-1">52,000 ZAR </div>
                            </td>
                            <td>
                            Progress
                              <div className="font-weight-bold text-success  mt-1">68% </div>
                            </td>
                            <td>
                              Effeciency
                              <div className="font-weight-bold  mt-1">72% </div>
                            </td>
                            <td>
                              Riders
                              <div className="font-weight-bold  mt-1">12 </div>
                            </td>
                            <td>
                              Drivers
                              <div className="font-weight-bold  mt-1">6</div>
                            </td>
                            <td>
                              Assets
                              <div className="font-weight-bold  mt-1"><a href=""></a>view assets</div>
                            </td>
                            <td>
                              <button type="button" className="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr> 
                          <tr>
                            <td>
                              <div className="d-flex">
                                {/* <img className="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> Campaign</div>
                                  <div className="font-weight-bold mt-1">Sanlam Sanport</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div className="font-weight-bold  mt-1">52,000 ZAR </div>
                            </td>
                            <td>
                            Progress
                              <div className="font-weight-bold text-success  mt-1">68% </div>
                            </td>
                            <td>
                              Effeciency
                              <div className="font-weight-bold  mt-1">77% </div>
                            </td>
                            <td>
                              Riders
                              <div className="font-weight-bold mt-1">16 </div>
                            </td>
                            <td>
                              Drivers
                              <div className="font-weight-bold  mt-1">8</div>
                            </td>
                            <td>
                              Assets
                              <div className="font-weight-bold  mt-1"><a href=""></a>view assets</div>
                            </td>
                            <td>
                              <button type="button" className="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex">
                                {/* <img className="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> Campaign</div>
                                  <div className="font-weight-bold mt-1">SHA</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              Budget
                              <div className="font-weight-bold  mt-1">35,000 ZAR </div>
                            </td>
                            <td>
                            Progress
                              <div className="font-weight-bold text-success  mt-1">68% </div>
                            </td>
                            <td>
                              Effeciency
                              <div className="font-weight-bold mt-1">84% </div>
                            </td>
                            <td>
                              Riders
                              <div className="font-weight-bold  mt-1">5</div>
                            </td>
                            <td>
                              Drivers
                              <div className="font-weight-bold  mt-1">2</div>
                            </td>
                            <td>
                              Assets
                              <div className="font-weight-bold  mt-1"><a href=""></a>view assets</div>
                            </td>
                            <td>
                              <button type="button" className="btn btn-sm btn-secondary">view detail</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>              
            </div>




            <div className="row  mt-3">
              <div className="col-xl-9 d-flex grid-margin stretch-card">
              <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3">Closed campaigns</h4>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex">
                                {/* <img className="img-sm rounded-circle mb-md-0 mr-2" src="images/faces/face30.png" alt="profile image"> */}
                                <div>
                                  <div> No closed campaigns..</div>
                                  
                                </div>
                              </div>
                            </td>
                      
                          </tr>
                       
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>              
              <div className="col-xl-3 d-flex grid-margin stretch-card">
              <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between">
                      <h4 className="card-title mb-3">Campaigns by geographic area</h4>
                      <input type="text" className="form-control" placeholder="Type to search..." aria-label="search" aria-describedby="search"></input>
                    </div>
                    <div className="row  mt-6">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="d-flex justify-content-between mt-4 mb-4">
                              <div className="font-weight-medium">Campaign name</div>
                              <div className="font-weight-medium">Impressions</div>
                            </div>
                            <div className="d-flex justify-content-between mt-4 mb-4">
                              <div className="text-secondary font-weight-medium">Sandton, Sandton </div>
                              <div className="small">28 boards</div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                              <div className="text-secondary font-weight-medium">Rosebank, Sandton</div>
                              <div className="small">13 boards</div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                              <div className="text-secondary font-weight-medium">Hydepark, Sandton</div>
                              <div className="small">9 boards</div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
     
     

            </div>

          </div>
          <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
              <span className="text-center text-sm-left d-block d-sm-inline-block">Copyright © <a href="https://www.webparam.org/" >webparam.org</a> 2022</span>
            </div>
          </footer>
        </div>
      </div>
    </div>

    {/* <div classNameName={styles.container}> */}
      {/* <Head>
        <title>Geolocation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main classNameName={styles.main}>
        <h1 classNameName={styles.title}>Shadow v2.12</h1>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/> */}
        {/* <div classNameName={styles.map}>
          <MapWithNoSSR
            coords={lngLatCoords}
            lastPosition={lastPosition}
            markers={latLngMarkerPositions}
            latestTimestamp={latestTimestamp}
          />
        </div> */}
        {/* <div classNameName={styles.grid}>
          <TempChart tempData={tempData} />
        </div> */}
        {/* <div classNameName={styles.grid}>
          <VoltageChart voltageData={voltageData} />
        </div> */}
        {/* <div classNameName={styles.grid}>
          <EventTable columns={columns} data={eventTableData} />
        </div>
      </main>
      <footer classNameName={styles.footer}></footer>
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
