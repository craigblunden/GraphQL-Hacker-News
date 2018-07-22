import React, { Component } from 'react'
import Header from './Header'
import { Switch, Route, Redirect } from 'react-router-dom'

import PostList from './PostList'
import CreatePost from './CreatePost'
import EditPost from './EditPost'
import Login from './Login'
import Search from './Search'

class App extends Component {
  render() {
    return (
      <div className="">
        <Header />
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/new/1' />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/create" component={CreatePost} />
          <Route path="/edit/:id" component={EditPost} />
          <Route exact path='/search' component={Search}/>
          <Route exact path='/top' component={PostList} />
          <Route exact path='/new/:page' component={PostList} />
        </Switch>
      </div>
    )
  }
}

export default App