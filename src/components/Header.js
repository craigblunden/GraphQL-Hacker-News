import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <h1>Hacker News</h1>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">new</Link>
              </li>
              <li className="nav-item">
                <Link to="/top" className="nav-link">top</Link>
              </li>
              <li className="nav-item">
                <Link to="/search" className="nav-link">search</Link>
              </li>
            {authToken && (
              <li className="nav-item">
                <Link to="/create" className="nav-link">submit</Link>
              </li>
            )}
            
            {authToken ? (
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    localStorage.removeItem('email')
                    this.props.history.push(`/`)
                  }}
                >
                  logout
                </a>
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
    )
  }
}

export default withRouter(Header)