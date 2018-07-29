import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import Post from './Post'

import { LINKS_PER_PAGE } from '../constants'

class PostList extends Component {

  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
  }

  render() {

    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error: {this.props.feedQuery.error.message}</div>
    }

    const isTopPage = this.props.location.pathname.includes('top')
    const linksToRender = this._getLinksToRender(isTopPage)
    const page = parseInt(this.props.match.params.page, 10) 

    return (
      <div className="col col-sm-5">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">new</Link>
          </li>
          <li className="nav-item">
            <Link to="/top" className="nav-link">top</Link>
          </li>
        </ul>
        <div className="">
          {linksToRender.map((link, index) => (
            <Post
              key={link.id}
              updateStoreAfterVote={this._updateCacheAfterVote}
              index={index}
              link={link}
            />
          ))}
        </div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><button className="page-link" onClick={() => this._previousPage()}>Previous</button></li>
            <li className="page-item"><button className="page-link" onClick={() => this._nextPage()}>Next</button></li>
          </ul>
        </nav>
    </div>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isTopPage = this.props.location.pathname.includes('top')
    const page = parseInt(this.props.match.params.page, 10) || 1
    const skip = isTopPage ? 0 : (page - 1) * LINKS_PER_PAGE
    const first = isTopPage ? 100 : LINKS_PER_PAGE
    const orderBy = isTopPage ? null : 'createdAt_DESC'
    const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLink {
            node {
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
                  id,
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
        const result = {
          ...previous,
          feed: {
            links: newAllLinks
          },
        }
        return result
      },
    })
  }

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
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
              user {
                id
              }
            }
          }
        }
      `,
    })
  }

  _getLinksToRender = (isTopPage) => {
    if (isTopPage) {
      const rankedLinks = this.props.feedQuery.feed.links.slice()
      rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
      return rankedLinks
    }
    return this.props.feedQuery.feed.links
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      console.log("next page")
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }
  
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      console.log("prev page")
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

}

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
          email
        }
        votes {
          id
          user {
            id
            email
          }
        }
      }
    }
  }
`

export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: ownProps => {
    let page = 1;
    // ownProps.match.params.page ? page =  parseInt(ownProps.match.params.page, 10) : page = 1
    // const isNewPage = ownProps.location.pathname.includes('new')
    const isNewPage = true;
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
})(PostList)