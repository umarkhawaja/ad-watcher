import React, { useState, useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import { Card } from "reactstrap";

function CreditRequests(props) {
  const [user, setUser] = useState();
  const [creditRequests, setCreditRequests] = useState();
  const [currentRequest, setCurrentRequest] = useState();
  const [wallet, setWallet] = useState();

  const fetchUser = useCallback(async () => {
    await Axios.get("/api/posts/user", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  const fetchCreditRequests = useCallback(async () => {
    await Axios.get("/api/creditRequests/", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setCreditRequests(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    fetchCreditRequests();
    if (user && user.user_name !== "administrator") {
      alert("Unautrhorized, redirecting");
      props.history.push("/");
    }
  }, [fetchUser, user, props, fetchCreditRequests, currentRequest]);

  const deleteCRequest = async (req) => {
    await Axios.delete(`/api/creditRequests/delete/${req._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {});
  };

  const deleteUpdateCRequest = async (req) => {
    await Axios.get(`/api/wallets/${req.user_id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
        setWallet((wallet) => {
          wallet.credits = (
            parseInt(wallet.credits) + parseInt(req.amount)
          ).toString();
          console.log(wallet);
          Axios.patch(`/api/wallets/update/${wallet._id}`, wallet, {
            headers: {
              Authorization: `${props.authToken}`,
            },
          })
            .then((res) => {})
            .catch((err) => {});
          return wallet;
        });
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });

    await Axios.delete(`/api/creditRequests/delete/${req._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {});
  };

  return (
    <div className="container card-containerap">
      <Card className="card shadow col-12 text-center  mt-3 mb-3">
        <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n4 mr-n4 mb-n1 text-center">
          <span>Credit Requests</span>
        </h1>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {creditRequests &&
                creditRequests.map((cRequest) => (
                  <li
                    key={cRequest._id}
                    className="alert-success pb-3 mt-3 mb-3"
                  >
                    <label className="card-body w-75 h-auto">
                      <span className="font-weight-bold">
                        {cRequest.user_id}
                      </span>{" "}
                      has requested{" "}
                      <span className="font-weight-bold">
                        {cRequest.amount}
                      </span>{" "}
                      credits by performing a transaction with{" "}
                      <span className="font-weight-bold">
                        ID: {cRequest.transaction_id}
                      </span>
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button
                        className="btn btn-success m-2"
                        onClick={() => {
                          setCurrentRequest(cRequest);
                          setCurrentRequest((req) => {
                            deleteUpdateCRequest(req);
                            return req;
                          });
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => {
                          setCurrentRequest(cRequest);
                          setCurrentRequest((currentRequest) => {
                            deleteCRequest(currentRequest);
                            return currentRequest;
                          });
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(CreditRequests);
