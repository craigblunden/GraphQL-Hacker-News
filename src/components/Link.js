import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="col-sm-6">
        <div className="card">
          <div className="card-body">
            <div className="card-title"><h3>{this.props.index + 1}.</h3></div>
            <div className="card-text">
              {this.props.link.description} ({this.props.link.url})
            </div>
            <div className="">
              {this.props.link.votes.length} votes | by{' '}
              {this.props.link.postedBy
                ? this.props.link.postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(this.props.link.createdAt)}
            </div>
            {authToken && (
              <button className="btn btn-primary" onClick={() => this._voteForLink()}>
                ▲
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, linkId)
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

export default graphql(VOTE_MUTATION, {
  name: 'voteMutation',
})(Link)