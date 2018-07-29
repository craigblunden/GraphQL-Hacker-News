import React, { Component } from 'react'
// import PropTypes from 'prop-types'

export default class Sidebar extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }

  render() {
    return (
      <div className="col col-sm-3">
        <div className="card">
          <img src="" alt="profile" className="card-img-left" />
          <div className="card-body">
            <h4 className="card-title">Craig Blunden</h4>
            <div className="card-text">@craigblunden</div>
          </div>
        </div>
      </div>
    )
  }
}
