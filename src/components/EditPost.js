import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'

class EditPost extends Component {
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
        <button onClick={() => this._EditPost()}>Submit</button>
      </div>
    )
  }

  _EditPost = async () => {
    const { description, url } = this.state
    await this.props.postQuery({
      variables: {
        description,
        url,
      },
    })
  }

}

const POST_QUERY = gql`
  query postQuery($ID: ID!) {
    link(id: "cjjwqx70bzmek0b022dwd8qf1") {
      id
      url
      description
    }
  }
`

export default graphql(POST_QUERY, { name: 'postQuery' })(EditPost)