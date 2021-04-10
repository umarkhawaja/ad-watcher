import "../../../node_modules/video-react/dist/video-react.css";
import { Player, Shortcut, ControlBar, BigPlayButton } from "video-react";
import Axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import {
  UncontrolledDropdown,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import "./Welcome.css";
import { withRouter } from "react-router-dom";

function Welcome(props) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
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
        console.log(err);
      });
  }, [props.authToken]);
  const fetchData = useCallback(async () => {
    await Axios.get("/api/posts/all", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setPosts(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
        props.history.push("/login");
      });
  }, [props.authToken, props.history]);
  const fetchWallet = useCallback(async () => {
    await Axios.get("/api/wallets", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.authToken]);

  useEffect(() => {
    fetchData();
    fetchUser();
    fetchWallet();
  }, [fetchData, fetchUser, fetchWallet]);

  const deletePost = async (post) => {
    await Axios.delete(`/api/posts/delete/${post._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        alert("post deleted");
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="posts-home">
      {wallet ? (
        <Button
          style={{ maxWidth: "200px", margin: "7px" }}
          className="btn-dark"
          onClick={() => {}}
        >
          Credits: {wallet.credits}
        </Button>
      ) : (
        <></>
      )}

      <Button
        style={{ maxWidth: "200px", margin: "7px" }}
        className="btn-dark"
        onClick={() => {
          props.history.push("/create-post");
        }}
      >
        Create Post
      </Button>
      <Button
        style={{ maxWidth: "200px", margin: "7px" }}
        className="btn-dark"
        onClick={() => {
          props.setLoggedIn(false);
          props.setSignUpCall(false);
          props.setAuth("");
          props.history.push("/login");
        }}
      >
        Log Out
      </Button>
      {posts.length !== 0 ? (
        <ul>
          {posts.map((post) => (
            <li
              key={post._id}
              style={{
                listStyle: "none",
              }}
            >
              <div className="container">
                <Card
                  contextMenu="none"
                  onContextMenu={(e) => e.preventDefault()}
                  className="post-card"
                  style={{
                    background: "rgba(180,180,180,0.9",
                  }}
                >
                  <CardBody>
                    <CardTitle tag="h3">
                      {post.author}
                      <UncontrolledDropdown className="float-right">
                        <DropdownToggle caret></DropdownToggle>
                        <DropdownMenu>
                          {post.author === user.user_name ? (
                            <>
                              <DropdownItem
                                className="btn btn-secondary"
                                onClick={() => {
                                  deletePost(post);
                                }}
                              >
                                Delete
                              </DropdownItem>
                              <DropdownItem
                                className="btn btn-secondary"
                                onClick={() =>
                                  props.history.push(`/update-post/${post._id}`)
                                }
                              >
                                Update
                              </DropdownItem>
                            </>
                          ) : (
                            <DropdownItem>Report</DropdownItem>
                          )}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </CardTitle>

                    <CardSubtitle
                      tag="h6"
                      className="mt-2 mb-2 "
                      style={{ textColor: "gray" }}
                    >
                      CREDITS: {post.credits}
                    </CardSubtitle>

                    <CardText>{post.body}</CardText>
                  </CardBody>
                  {post.filepath.indexOf("video") >= 0 ? (
                    <>
                      <Player
                        contextMenu="none"
                        id="postContent"
                        playsInLine
                        src={post.filepath}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <BigPlayButton position="center" />
                        <ControlBar
                          disableDefaultControls={true}
                          disableCompletely={true}
                        />
                        <Shortcut clickable={false} dblclickable={false} />
                      </Player>
                    </>
                  ) : (
                    <CardImg
                      className="image-fluid"
                      style={{
                        maxHeight: "800px",
                      }}
                      width="auto"
                      height="100%"
                      src={post.filepath}
                      alt="productimagehere"
                    />
                  )}
                </Card>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Card
          className="post-card"
          style={{
            background: "rgba(180,180,180,0.9",
          }}
        >
          <CardBody>
            <CardTitle tag="h4">Fetching Posts</CardTitle>
            <CardSubtitle
              tag="h6"
              className="mt-2 mb-2 "
              style={{ textColor: "gray" }}
            >
              Create a post of your own by clicking create post
            </CardSubtitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default withRouter(Welcome);
