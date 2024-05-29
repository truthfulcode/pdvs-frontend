import { SNAPSHOT_GRAPHQL_PROD } from "@/utils/constants";
import { ApolloClient, gql } from "@apollo/client";
import { cache } from "./cache";
import { GQLs } from "./gqlQueries";

export class SnapshotGraphQL {
  private client = new ApolloClient({
    cache,
    uri: SNAPSHOT_GRAPHQL_PROD,
  });
  async getProposals() {
    let res = await this.client.query({
      query: GQLs.PROPOSALS,
    });
    return res.error
      ? null
      : res.data["proposals"].map((p: any) => {
          return {
            id: p["id"],
            title: p["title"],
            body: p["body"],
            choices: p["choices"],
            start: p["start"],
            end: p["end"],
            snapshot: p["snapshot"],
            state: p["state"],
          };
        });
  }

  async getProposal() {
    let res = await this.client.query({
      query: GQLs.PROPOSAL,
    });
    const p = res.data["proposal"];
    return res.error
      ? null
      : {
          id: p["id"],
          title: p["title"],
          body: p["body"],
          choices: p["choices"],
          start: p["start"],
          end: p["end"],
          snapshot: p["snapshot"],
          state: p["state"],
        };
  }

  // TODO pass id
  async getVotes() {
    let res = await this.client.query({
      query: GQLs.VOTES,
    });
    return res.error
      ? null
      : res.data["votes"].map((p: any) => {
          return {
            id: p["id"],
            voter: p["voter"],
            created: p["created"],
            proposal: p["proposal"],
            choice: p["choice"],
          };
        });
  }

  // TODO pass id
  async getVote() {
    let res = await this.client.query({
      query: GQLs.VOTE,
    });
    const p = res.data["vote"];
    return res.error
      ? null
      : {
          id: p["id"],
          voter: p["voter"],
          created: p["created"],
          proposal: p["proposal"],
          choice: p["choice"],
        };
  }
}
