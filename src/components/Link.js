import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'

class Link extends Component {
  state = {
    hasVote: false,
    isLoggedIn: false,
  }

  componentDidMount = () => {
    this._hasVoted();
    this._isLoggedIn();
  }

  render() {
    const { hasVote, isLoggedIn } = this.state
    return (
      <div className="col col-12 col-sm-6 col-md-4">
        <div className="card mb-4">
          <div className="card-body">
            <div className="card-title"><h3>{this.props.index + 1}.</h3></div>
            <div className="card-text">
              <div>
                {this.props.link.description}
              </div>
              <div>
                ({this.props.link.url})
              </div>
            </div>
            <div className="">
              {this.props.link.votes.length} votes | by{' '}
              {this.props.link.postedBy
                ? this.props.link.postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(this.props.link.createdAt)}
            </div>
            {isLoggedIn && (
              hasVote
              ? (
                  <button className="btn btn-primary" onClick={() => this._removeVoteForLink()}>
                    Down
                  </button>
                )
              : (
                <button className="btn btn-warning" onClick={() => this._voteForLink()}>
                  Up
                </button>
                )
            )}
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
)(Link)