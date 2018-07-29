import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'

class Post extends Component {
  state = {
    hasVote: false,
    isLoggedIn: false,
    isEditor: false,
  }

  componentDidMount = () => {
    this._hasVoted();
    this._isEditor()
    this._isLoggedIn()
  }

  render() {
    let { hasVote, isLoggedIn, isEditor } = this.state
    return (
      <div className="col col-12">
        <div className="card mb-4">
          <div className="card-body">
            <div className="card-title"><h3>{this.props.index + 1}.</h3></div>
            <div className="card-text">
              <div>
                {this.props.link.description}
              </div>
              <div>
                {this.props.link.url}
              </div>
            </div>
            <div className="">
              {this.props.link.votes.length} votes | by{' '}
              {this.props.link.postedBy
                ? this.props.link.postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(this.props.link.createdAt)}
            </div>
            <div>
              {isLoggedIn && (
                hasVote
                ? (
                    <a role="button" className="btn btn-primary" onClick={() => this._removeVoteForLink()}>
                      Down
                    </a>
                  )
                : (
                  <a role="button" className="btn btn-warning" onClick={() => this._voteForLink()}>
                    Up
                  </a>
                  )
              )}
              {isLoggedIn && isEditor && (
                <Link to={'/edit/'+this.props.link.id} className="btn btn-success">Edit</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _isLoggedIn = () => {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    
    if(authToken) {
      this.setState({
        "isLoggedIn": true
      })
    }
  }

  _isEditor = () => {
    const postUser = this.props.link.postedBy.email
    const loggedInUserEmail = localStorage.getItem('email')

    if (postUser === loggedInUserEmail){
      this.setState({
        "isEditor": true
      })
    } 
  }

  _hasVoted = () => {
    
    const votes = this.props.link.votes
    const loggedinUserEmail = localStorage.getItem('email')

    votes.forEach(vote => {
      if (vote.user.email === loggedinUserEmail){
        this.setState({
          "hasVote": true
        })
      } 
    })
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, linkId)
        this.setState({
          "hasVote": true
        })
      },
    })
  }

  _removeVoteForLink = async () => {
    const votes = this.props.link.votes
    const loggedinUserEmail = localStorage.getItem('email')
    let linkId = ""
    votes.forEach(vote => {
      if (vote.user.email === loggedinUserEmail){
        linkId = vote.id
      } 
    })
    
    await this.props.removeVoteMutation({
      variables: {
        linkId,
      },
    })
  }
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`

const REMOVE_VOTE_MUTATION = gql`
  mutation RemoveVoteMutation($linkId: ID!) {
    deleteVote( where:{
      id: $linkId
    }){
      id
    }
  }
`

export default compose(
  graphql(VOTE_MUTATION, {name: 'voteMutation'}),
  graphql(REMOVE_VOTE_MUTATION, {name: 'removeVoteMutation'}),
)(Post)