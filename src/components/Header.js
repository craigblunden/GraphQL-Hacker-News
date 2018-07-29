import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="wrapper-header">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="row">
                <div className="col col-sm-2">
                  <Link to="/"><h1>HN</h1></Link>
                </div>
                <div className="col col-sm-6">
                  <form className="form-inline">
                    <div class="form-group">
                      <label className="sr-only" htmlFor="searchBar">Search</label>
                      <input type="email" class="form-control" id="searchBar" aria-describedby="Search" placeholder="Graph QL" />
                      <Link to="/search" className="nav-link">search</Link>
                    </div>
                  </form>
                </div>
                <div className="col col-sm-3">
                  <ul className="nav">
                  {authToken && (
                    <li className="nav-item">
                      <Link to="/create" className="nav-link">submit</Link>
                    </li>
                  )}
                  
                  {authToken ? (
                    <li className="nav-item">
                      <Link to="/" className="nav-link" onClick={this._logout}>logout</Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link to="/login" className="nav-link">login</Link>
                    </li>
                  )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _logout = (e) => {
    e.preventDefault();
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem('email')
    this.props.history.push(`/`)
  }
}

export default withRouter(Header)