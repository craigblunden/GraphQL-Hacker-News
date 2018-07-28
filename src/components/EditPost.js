import React, { Component } from "react"
import { compose, graphql } from "react-apollo"
import { gql } from "apollo-boost"

class EditPost extends Component {
  
  state = {
    description: '',
    url: '',
    id: this.props.match.params.id
  }

  render(){

    if (this.props.GetPostQuery && this.props.GetPostQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.GetPostQuery && this.props.GetPostQuery.error) {
      return <div>Error: {this.props.GetPostQuery.error.message}</div>
    }

    return (
      <div className="container">
        <div className="row">
          <form onSubmit={this._EditPost}> 
            <div className="form-group">
              <label htmlFor="editDescription">Description</label>
              <input
                id="editDescription"
                className="form-control"
                value={this.state.description || this.props.GetPostQuery.link.description}
                onChange={e => this.setState({ description: e.target.value })}
                type="text"
                placeholder="A description for the link"
              />
            </div>
            <div className="form-group">
              <label htmlFor="editLink">Link</label>
              <input
                id="editLink"
                className="form-control"
                value={this.state.url || this.props.GetPostQuery.link.url}
                onChange={e => this.setState({ url: e.target.value })}
                type="text"
                placeholder="The URL for the link"
              />
            </div>
            <button type="submit" >Submit</button>
          </form>
        </div>
      </div>
    )
  }

  _GetPost = async () => {

    const { id, description, url } = this.state

    const post = await this.props.GetPostQuery({
      variables: {
        id,
        description,
        url,
      },
    })
  }
  _EditPost = async (e) => {
    e.preventDefault();

    const { id, description, url } = this.state
    const {propsUrl, propsDescription} = this.props.GetPostQuery.link
    await this.props.editPostMutation({
      variables: {
        id,
        url: url || propsUrl,
        description: description || propsDescription
      },
    })
  }
}

const EDIT_POST = gql`
  mutation editPostMutation($id: ID!, $url: String!, $description: String!) {
    updateLink (
      where: {id: $id},
      data: {
        description: $description,
        url: $url
      }
    ){
      url,
      description,
    }
  }
`

const GET_POST = gql`
  query GetPostQuery($id: ID!) {
  link(where:{
    id: $id}
  ){
    id,
    description,
    url
  } 
}
`

export default compose(
  graphql(EDIT_POST, { name: 'editPostMutation' }),
  graphql(GET_POST, {
    name: 'GetPostQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    })
  }),
  // graphql(gql`mutation (...) { ... }`, { name: 'deleteTodo' }),
)(EditPost);