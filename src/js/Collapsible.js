import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Collapsible extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.myPanelRef = React.createRef();
  }

  state = {
    isExpanded: false,
  };

  handleToggle = e => {
    e.preventDefault();

    console.log(this.myPanelRef.current.clientHeight);

    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded,
      height: this.myPanelRef.current.clientHeight,
    });
  };

  render() {
    const { title, children } = this.props;
    const { isExpanded, height } = this.state;
    const currentHeight = isExpanded ? height : 0;
    return (
      <div
        className={`panel ${isExpanded ? 'is-expanded' : ''}`}
        onClick={e => this.handleToggle(e)}
      >
        <div className="panel-heading">
          <h2>{title}</h2>
        </div>
        <div className="panel-collapse" style={{ height: currentHeight }}>
          <div className="panel-body" ref={this.myPanelRef}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
