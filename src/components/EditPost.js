import React, { Component } from "react"
import { Query } from "react-apollo"
import { gql } from "apollo-boost"

class EditPost extends Component {
  render(){
      const id = this.props.match.params.id;
      return (
        <Query query={POST_QUERY} variables={{id}}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            console.log(this)
            return (
              <div>
                <div className="">
                  <input
                    className="mb2"
                    value={data.link.description}
                    onChange={e => this.setState({ description: e.target.value })}
                    type="text"
                    placeholder="A description for the link"
                  />
                  <input
                    className="mb2"
                    value={data.link.url}
                    onChange={e => this.setState({ url: e.target.value })}
                    type="text"
                    placeholder="The URL for the link"
                  />
                </div>
                <button onClick={() => this._EditPost()}>Submit</button>
              </div>
            )
          }
        }
      </Query>
    )
  }
}

const POST_QUERY = gql`
  query link($id: ID!) {
  link(where:{
    id: $id}
  ){
    id,
    description,
    url
  } 
}
`

const _EditPost = async () => {
  const { id, description, url } = this.state
  await this.props.postQuery({
    variables: {
      id: this.match.params.id
    },
  })
}

export default EditPost