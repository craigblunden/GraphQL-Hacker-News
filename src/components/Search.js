import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import Post from './Post'

class Search extends Component {

  state = {
    links: [],
    filter: ""
  }

  componentDidMount = () => {
    this._getQueryValue()
  }

  render() {
    return (
      <div>
        {this.state.links.map((link, index) => <Post key={link.id} link={link} index={index}/>)}
      </div>
    )
  }

  _getQueryValue = () => {
    let query = window.location.search
    if(query.includes("?q")){
      this.setState({
        filter: query.substr(3)
      })
    }
    this._executeSearch()
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }

}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

export default withApollo(Search)