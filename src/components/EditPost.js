import React, { Component } from "react"
import { Query } from "react-apollo"
import { gql } from "apollo-boost"

class EditPost extends Component {
  
  state = {
    description: '',
    url: ''
  }

  render(){

      const id = this.props.match.params.id;

      return (
        <Query query={POST_QUERY} variables={{id}}>
          {({ loading, error, data }) => {

            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <div className="container">
                <div className="row">
                  <form> 
                    <div className="form-group">
                      <label htmlFor="editDescription">Description</label>
                      <input
                        id="editDescription"
                        className="form-control"
                        value={this.state.description || data.link.description}
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
                        value={this.state.url || data.link.url}
                        onChange={e => this.setState({ url: e.target.value })}
                        type="text"
                        placeholder="The URL for the link"
                      />
                    </div>
                    <button type="submit" onSubmit={() => this._EditPost()}>Submit</button>
                  </form>
                </div>
              </div>
            )
          }
        }
      </Query>
    )
  }
  _EditPost = async (e) => {
    e.preventDefault();
    const { id, description, url } = this.state
    await this.props.postQuery({
      variables: {
        id: this.match.params.id
      },
    })
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



export default EditPost