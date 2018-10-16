import React, { Component } from "react";
import "../styles/Chat.css";
import CountUp from "react-countup";

import { AnchorButton, Tag } from "@blueprintjs/core";

import { FaTwitter, FaDiscord } from "react-icons/fa";

class Chat extends Component {
  scrollToBottom = () => {
    this.el.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  sendMessage(e) {
    if (e.key !== "Enter") return;
    this.props.callAction("sendChatMessage", {
      message: this.input.value
    });
    this.input.value = "";
  }

  render() {
    const { messages, stats, user } = this.props;
    return (
      <div className="Chat-wrapper">
        <div className="Chat-header">
          <div className="Chat-header-stats">
            <span>
              <b>Opened:</b>{" "}
              <CountUp separator="," end={stats.allTime.cases.opened} />{" "}
            </span>
            <span>
              <b>Rewarded:</b>{" "}
              <CountUp
                prefix="$"
                separator=","
                decimals={2}
                end={stats.allTime.cases.totalValue}
              />{" "}
            </span>
          </div>
          <div className="Chat-header-social">
            <AnchorButton
              minimal={true}
              icon={<FaTwitter />}
              target="_blank"
              href="https://twitter.com/VgoDogg"
            />
            <AnchorButton
              minimal={true}
              icon={<FaDiscord />}
              target="_blank"
              href="https://discord.gg/rhqgyxT"
            />
          </div>
        </div>
        <div className="Chat-body">
          {messages.map((message, index) => {
            var htmlMessage = { __html: message.message };
            return (
              <div className="Chat-message" key={message.id}>
                <div className="Chat-user">
                  <img
                    className="Chat-avatar"
                    src={message.user.avatarurl}
                    alt={message.user.username}
                  />
                  <div className="Chat-username">{message.user.username}</div>
                </div>
                <div
                  className="Chat-message-message"
                  dangerouslySetInnerHTML={htmlMessage}
                />
              </div>
            );
          })}
          {/* fake div to allow scroll to bottom... */}
          <div
            ref={el => {
              this.el = el;
            }}
          />
        </div>
        <div className="Chat-input-wrapper">
          <input
            disabled={!user}
            className="Chat-input"
            type="text"
            placeholder="Say something..."
            onKeyUp={this.sendMessage.bind(this)}
            ref={node => (this.input = node)}
          />
        </div>
      </div>
    );
  }
}

export default Chat;
