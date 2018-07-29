import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import PostList from './PostList'
import Sidebar from './Sidebar'

export class Home extends Component {

  render() {
    return (
      <div className="row">
        <Sidebar /> 
        <PostList />
      </div>
    )
  }
}

export default Home
