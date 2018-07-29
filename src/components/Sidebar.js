import React, { Component } from 'react'
// import PropTypes from 'prop-types'

export default class Sidebar extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }

  render() {
    return (
      <div className="col col-sm-3">
        <div className="card flex-row flex-wrap wrapper-account">
          <div className="card-header border-0">
            <img width="50px" src="/img/profile.jpeg" alt="profile" className="card-img-left rounded-circle" />
          </div>
          <div className="card-block px-2 py-1">
            <h4 className="card-title">Craig Blunden</h4>
            <div className="card-text">@craigblunden</div>
          </div>
        </div>
      </div>
    )
  }
}
