import React, { Component } from "react";
import "../styles/CaseOverview.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ItemCard from "../components/ItemCard";
import utils from "../libs/utils";
import { sortBy, sumBy, map, maxBy } from "lodash";
import CountUp from "react-countup";
import { Button, Intent } from "@blueprintjs/core";
import OpenCase from "../components/OpenCaseModal";
import LazyComponent from "react-component-lazy";

class CaseOverview extends Component {
  constructor(props) {
    super();
    var box = props.boxes[parseInt(--props.match.params.boxid)];
    box.items = sortBy(box.items, "suggested_price").reverse();
    var stats = props.stats.allTime.cases[box.id];
    stats.bestUnboxed = maxBy(stats.items.name, "totalValue");
    this.state = {
      isOpen: false,
      selectedBox: {},
      stats: stats || { opened: 0, totalValue: 0 },
      box
    };
  }

  openDialog() {
    this.setState({ isOpen: true });
  }

  closeDialog() {
    this.setState({ isOpen: false });
  }

  sendKeyRequest(caseid, amount) {
    return this.props
      .callAction("createCaseOpenOffer", {
        caseid,
        amount
      })
      .then(offer => {
        if (!offer) return;
        this.props.AppToaster.show({
          action: {
            href: offer.url,
            target: "_blank",
            text: <strong>View Offer</strong>
          },
          intent: "success",
          message: `Successfully created offer!`,
          timeout: 30 * 1000
        });
        this.props.history.push(`/pending`);
        this.closeDialog();
      });
  }

  render() {
    return (
      <div className="CaseOverview-wrapper">
        <div className="CaseOverview-header">
          <div className="CaseOverview-header-content">
            <img
              className="CaseOverview-caseImage"
              src={this.state.box.image["300px"]}
              alt={this.state.box.name}
            />
            <div className="CaseOverview-details">
              <span className="CaseOverview-details-caseName">
                {this.state.box.name}
              </span>

              <span className="CaseOverview-details-caseValue">
                <b>Best Possible Item:</b> {this.state.box.bestItem.name} -{" "}
                <CountUp
                  prefix="$"
                  separator=","
                  decimals={2}
                  end={this.state.box.bestItem.suggested_price / 100}
                />
              </span>
              <span className="CaseOverview-details-caseValue">
                <b>Worst Possible Item:</b> {this.state.box.worstItem.name} -{" "}
                <CountUp
                  prefix="$"
                  separator=","
                  decimals={2}
                  end={this.state.box.worstItem.suggested_price / 100}
                />
              </span>
              <span className="CaseOverview-details-caseValue">
                <b>Times Opened:</b> <CountUp end={this.state.stats.opened} />
              </span>
              <span className="CaseOverview-details-caseValue">
                <b>Total Rewarded:</b>{" "}
                <CountUp
                  prefix="$"
                  separator=","
                  decimals={2}
                  end={this.state.stats.totalValue}
                />
              </span>
              <span className="CaseOverview-details-caseValue">
                <b>Average ROI:</b>{" "}
                <CountUp
                  prefix="$"
                  separator=","
                  decimals={2}
                  end={this.state.stats.totalValue / this.state.stats.opened}
                />
              </span>

              <div className="CaseOverview-details-itemstats">
                <div className="CaseOverview-details-type">
                  <h3>Odds of Item Type</h3>
                  {map(this.state.stats.items.type, (stat, key) => {
                    return (
                      <div>
                        <b> {key}: </b>
                        <CountUp
                          decimals={2}
                          end={(stat.opened / this.state.stats.opened) * 100}
                        />
                        %
                      </div>
                    );
                  })}
                </div>

                <div className="CaseOverview-details-rarity">
                  <h3>Odds of Item Rarity</h3>
                  {map(this.state.stats.items.rarity, (stat, key) => {
                    return (
                      <div>
                        <b> {key}: </b>
                        <CountUp
                          decimals={2}
                          end={(stat.opened / this.state.stats.opened) * 100}
                        />
                        %
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="CaseOverview-buy">
            <OpenCase
              isOpen={this.state.isOpen}
              handleClose={this.closeDialog.bind(this)}
              box={this.state.box}
              buyCases={this.sendKeyRequest.bind(this)}
            />
            <Button
              className="CaseOverview-buyButton"
              large={true}
              intent={Intent.PRIMARY}
              text="PURCHASE THIS CASE"
              icon="cart"
              onClick={e => {
                this.openDialog();
              }}
            />
          </div>
        </div>
        <div className="CaseOverview-body">
          <div className="CaseOverview-body-title">
            This case contains {this.state.box.items.length} items valued at{" "}
            <CountUp
              prefix="$"
              separator=","
              decimals={2}
              end={sumBy(this.state.box.items, "suggested_price") / 100}
            />
          </div>
          <div className="CaseOverview-body-caseItems">
            {this.state.box.items.map(item => {
              item = utils.processItem(item);

              return (
                <LazyComponent>
                  <ItemCard {...item} />
                </LazyComponent>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default CaseOverview;
