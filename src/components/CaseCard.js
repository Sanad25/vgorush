import React, { Component } from "react";
import "../styles/CaseCard.css";
import { Card, Elevation } from "@blueprintjs/core";

class CaseCard extends Component {
  render() {
    var { box } = this.props;
    return (
      <div className="CaseCard-wrapper">
        <Card
          key={box.id}
          interactive={true}
          elevation={Elevation.ONE}
          className="CaseCard-card"
          {...this.props}
        >
          <div className="CaseCard-content">
            <div className="CaseCard-title">{box.name}</div>
            <img
              className="CaseCard-image"
              src={box.image["300px"]}
              alt={box.name}
            />
            <div className="CaseCard-opened">
              <b>Total Opened:</b> {box.openCount}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default CaseCard;
