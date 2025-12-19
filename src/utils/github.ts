// src/utils/github.ts
/* eslint-disable node/prefer-global/process */
import type { GitHubMonthlyStatsResponse, GitHubStatsResponse, MonthlyStats, Stats } from "@/types"

const GITHUB_GRAPHQL = "https://api.github.com/graphql"

const GITHUB_STATS_QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
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
      pullRequests {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      repositories(ownerAffiliations: OWNER, first: 100) {
        totalCount
        nodes {
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`

const MONTHLY_STATS_QUERY = `
  query MonthlyStats($login: String!) {
    user(login: $login) {
      issues(first: 100, orderBy: { field: CREATED_AT, direction: ASC }) { nodes { createdAt } }
      pullRequests(first: 100, orderBy: { field: CREATED_AT, direction: ASC }) { nodes { createdAt } }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: CREATED_AT, direction: ASC }) { nodes { createdAt } }
      starredRepositories(first: 100, orderBy: { field: STARRED_AT, direction: ASC }) { edges { starredAt } }
    }
  }
`
// Group dates by month
function groupByMonth(dates: string[]) {
  const map: Record<string, number> = {}
  for (const date of dates) {
    const month = date.slice(0, 7)
    map[month] = (map[month] || 0) + 1
  }
  return map
}

/**
 * githubGraphQL - function to make a GraphQL request to GitHub
 * @param query - GraphQL query to execute
 * @param variables - variables to pass to the query
 * @returns - response from GitHub
 */
export async function githubGraphQL<T = any>(query: string, variables?: Record<string, any>) {
  const token = process.env.GITHUB_API_TOKEN
  if (!token) {
    throw new Error("GITHUB_API_TOKEN not set")
  }

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub responded with ${res.status}: ${text}`)
  }

  const json = await res.json() as any
  if (json?.errors && json.errors.length > 0) {
    const msg = (json.errors as any[]).map((e: any) => e.message).join("; ")
    throw new Error(`GitHub GraphQL errors: ${msg}`)
  }

  return json as { data: T }
}

/**
 * fetchStats - function to fetch GitHub stats for a user
 * @param login - GitHub username
 * @returns - stats for the user
 */
export async function fetchStats(login = "marprezd"): Promise<Stats | null> {
  const { data } = await githubGraphQL<GitHubStatsResponse["data"]>(GITHUB_STATS_QUERY, { login })
  const user = (data as any).user
  if (!user) {
    return null
  }

  const stars = (user.repositories?.nodes ?? []).reduce((acc: number, repo: any) => acc + (repo?.stargazers?.totalCount ?? 0), 0)

  const totalCommits = (user.contributionsCollection?.totalCommitContributions ?? 0) + (user.contributionsCollection?.restrictedContributionsCount ?? 0)

  return {
    stars,
    totalCommits,
    totalRepos: user.repositories?.totalCount ?? 0,
    prs: user.pullRequests?.totalCount ?? 0,
    issues: (user.openIssues?.totalCount ?? 0) + (user.closedIssues?.totalCount ?? 0),
    contributionCalendar: user.contributionsCollection?.contributionCalendar ?? { totalContributions: 0, weeks: [] },
  }
}

/**
 * fetchMonthlyStats - function to fetch GitHub monthly stats for a user
 * @param login - GitHub username
 * @returns - monthly stats for the user
 */
export async function fetchMonthlyStats(login = "marprezd"): Promise<MonthlyStats> {
  const { data } = await githubGraphQL<GitHubMonthlyStatsResponse["data"]>(MONTHLY_STATS_QUERY, { login })
  const user = (data as any).user
  const issuesDates = (user.issues?.nodes ?? []).map((n: any) => n.createdAt)
  const prsDates = (user.pullRequests?.nodes ?? []).map((n: any) => n.createdAt)
  const reposDates = (user.repositories?.nodes ?? []).map((n: any) => n.createdAt)
  const starsDates = (user.starredRepositories?.edges ?? []).map((e: any) => e.starredAt)

  return {
    issues: groupByMonth(issuesDates),
    prs: groupByMonth(prsDates),
    repos: groupByMonth(reposDates),
    stars: groupByMonth(starsDates),
  }
}
