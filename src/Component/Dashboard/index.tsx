import Plot from "react-plotly.js";
import "./styles.css";
import moment from "moment";
import { useEffect, useState } from "react";
import DashboardService from "../../Services/DashboardService";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  IMonthCount,
  ICountryCount,
  IDomainCount,
} from "../../Utils/interface";
import { fetchTokensApiCall } from "../../Utils/helper";

interface IProps {}

const Dashboard = (props: IProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [totalFieldCount, setTotalFieldCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldCountByMonth, setFieldCountByMonth] = useState<Array<number>>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [fieldCountByCountry, setFieldCountByCountry] = useState<Array<number>>(
    []
  );
  const [fieldCountByDomain, setFieldCountByDomain] = useState<Array<number>>(
    []
  );
  const [countryNames, setCountryNames] = useState<Array<string>>([]);
  const [domainNames, setDomainNames] = useState<Array<string>>([]);

  const last12Months: Array<string> = [];
  for (let i = 0; i < 12; i++) {
    let monthName = moment().subtract(i, "months").format("MMMM");
    last12Months.unshift(monthName);
  }

  const getTotalFieldCount = async () => {
    setIsLoading(true);
    await fetchTokensApiCall();
    await DashboardService.getTotalFieldCount()
      .then((count) => {
        setTotalFieldCount(count);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };
  const getFieldCountByMonth = async () => {
    setIsLoading(true);
    await fetchTokensApiCall();
    await DashboardService.getFieldCountByMonth()
      .then((count) => {
        const data = last12Months.map((month) => {
          const monthData: IMonthCount = count.find((e: IMonthCount) => {
            if (e.month === month) {
              return e;
            }
          });
          if (monthData) {
            return monthData.count;
          } else return 0;
        });
        setFieldCountByMonth(data);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const getFieldCountByCountry = async () => {
    setIsLoading(true);
    await fetchTokensApiCall();
    await DashboardService.getFieldCountByCountry()
      .then((res) => {
        let count: Array<number> = [];
        let country: Array<string> = [];
        res.forEach((element: ICountryCount) => {
          count.push(element.count);
          country.push(element.country ?? "Other");
        });
        setCountryNames(country);
        setFieldCountByCountry(count);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const getFieldCountByDomain = async () => {
    setIsLoading(true);
    await fetchTokensApiCall();
    await DashboardService.getFieldCountByDomain()
      .then((res) => {
        let count: Array<number> = [];
        let domain: Array<string> = [];
        res.forEach((element: IDomainCount) => {
          count.push(element.count);
          domain.push(element.domain ?? "Other");
        });
        setDomainNames(domain);
        setFieldCountByDomain(count);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const fetchData = async () => {
    await getTotalFieldCount();
    await getFieldCountByMonth();
    await getFieldCountByCountry();
    await getFieldCountByDomain();
    setIsLoading(false);
  };

  useEffect(() => {
    if (totalFieldCount === 0) {
      fetchData();
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div className="spinner">
          <div className="spinner-border"></div>
        </div>
      )}
      <div id="dashboard">
        <div className="page-title-bar">
          <h1>Dashboard</h1>
          <div className="registered-count">
            <h4>Registered Fields: {totalFieldCount}</h4>
          </div>
        </div>
        <div className="back-btn">
          <p onClick={() => navigate(-1)}>{"<"} back</p>
        </div>
        <div className="charts">
          <Plot
            divId="month-chart"
            data={[
              {
                type: "bar",
                x: last12Months,
                y: fieldCountByMonth,
              },
            ]}
            layout={{
              title: "Registered Fields of last 12 month",
              yaxis: { fixedrange: true },
              xaxis: { fixedrange: true },
            }}
            config={{
              displayModeBar: false,
            }}
          />
          <Plot
            divId="country-chart"
            data={[
              {
                type: "pie",
                values: fieldCountByCountry,
                labels: countryNames,
              },
            ]}
            layout={{
              title: "Registered Fields Country",
              yaxis: { fixedrange: true },
              xaxis: { fixedrange: true },
            }}
            config={{
              displayModeBar: false,
            }}
          />
          <Plot
            divId="domain-chart"
            data={[
              {
                type: "pie",
                values: fieldCountByDomain,
                labels: domainNames,
              },
            ]}
            layout={{
              title: "Registered Fields Domain",
              yaxis: { fixedrange: true },
              xaxis: { fixedrange: true },
            }}
            config={{
              displayModeBar: false,
            }}
          />
        </div>
      </div>
      <ToastContainer className="p-3" position="top-end">
        <Toast
          bg="danger"
          onClose={() => setErrorMsg("")}
          autohide
          show={errorMsg !== ""}
          delay={3000}
        >
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="p-3">{errorMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Dashboard;
