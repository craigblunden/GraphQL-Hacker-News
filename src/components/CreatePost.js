import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import { FEED_QUERY } from './PostList'
import { LINKS_PER_PAGE } from '../constants'

class CreatePost extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className="">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createPost()}>Submit</button>
      </div>
    )
  }

  _createPost = async () => {
    const { description, url } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url,
      },
      update: (store, { data: { post } }) => {
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy },
        })
        data.feed.links.splice(0, 0, post)
        data.feed.links.pop()
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        })
      },
    })
    this.props.history.push(`/new/1`)
  }

}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreatePost)