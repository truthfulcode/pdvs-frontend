import { gql } from "@apollo/client";

export const GQLs = {
  PROPOSALS: gql`
    query {
      proposals(
        first: 20
        skip: 0
        where: { space_in: ["yam.eth"], state: "closed" }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        scores
        scores_by_strategy
        scores_total
        scores_updated
        author
        space {
          id
          name
        }
      }
    }
  `,
  PROPOSAL: gql`
    query {
      proposal(id: "QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS") {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        created
        scores
        scores_by_strategy
        scores_total
        scores_updated
        plugins
        network
        strategies {
          name
          network
          params
        }
        space {
          id
          name
        }
      }
    }
  `,
  VOTES: gql`
    query {
      votes(
        first: 1000
        skip: 0
        where: { proposal: "QmPvbwguLfcVryzBRrbY4Pb9bCtxURagdv1XjhtFLf3wHj" }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        voter
        vp
        vp_by_strategy
        vp_state
        created
        proposal {
          id
        }
        choice
        space {
          id
        }
      }
    }
  `,
  VOTE: gql`
    query {
      vote(id: "QmeU7ct9Y4KLrh6F6mbT1eJNMkeQKMSnSujEfMCfbRLCMp") {
        id
        voter
        vp
        vp_by_strategy
        vp_state
        created
        proposal {
          id
        }
        choice
        space {
          id
        }
      }
    }
  `,
};
