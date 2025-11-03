// src/utils/gitHubStats.ts
import type { GitHubStatsResponse, Stats } from "@/types"
import process from "node:process"

// Get github api token from environment variable
const githubApi: string = process.env.GITHUB_API_TOKEN || ""

/*
 * Get github stats
 *
 * @returns {Promise<Stats | null>} - The stats from github
 */
export async function getGitHubStats() {
  const reposResponse = await fetch("https://api.github.com/graphql", {
    next: { revalidate: 60 * 60 * 4 },
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `bearer ${githubApi}`,
    },
    body: JSON.stringify({
      query: `
        query userInfo($login: String!) {
          user(login: $login) {
            name
            login
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
              totalCommitContributions
              restrictedContributionsCount
            }
            repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
              totalCount
            }
            pullRequests {
              totalCount
            }
            openIssues: issues(states: OPEN) {
              totalCount
            }
            closedIssues: issues(states: CLOSED) {
              totalCount
            }
            followers {
              totalCount
            }
            repositories(ownerAffiliations: OWNER, first: 100) {
              totalCount,
              nodes {
                name
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
        `,
      variables: {
        login: "marprezd",
      },
    }),
  })

  if (!reposResponse.ok) {
    return null
  }

  const data = (await reposResponse.json()) as GitHubStatsResponse
  const { user } = data.data

  let count = 0

  user.repositories.nodes.forEach(
    (repo: { stargazers: { totalCount: number } }) => {
      count += repo.stargazers.totalCount
    },
  )

  return {
    stars: count,
    totalCommits:
      user.contributionsCollection.totalCommitContributions
      + user.contributionsCollection.restrictedContributionsCount,
    totalRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    contributions: user.repositoriesContributedTo.totalCount,
    prs: user.pullRequests.totalCount,
    issues: user.openIssues.totalCount + user.closedIssues.totalCount,
    contributionCalendar: user.contributionsCollection.contributionCalendar,
  } as Stats
}
