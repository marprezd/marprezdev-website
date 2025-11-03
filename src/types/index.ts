// src/types/index.ts
// Wakapi
export interface WakapiSummaries {
  data: {
    data: [
      {
        grand_total: {
          hours: number
        }
        range: {
          start: string
        }
      },
    ]
    daily_average: {
      seconds: number
    }
    end: string
  }
}

export interface WakapiStats {
  data: {
    data: {
      total_seconds: number
      daily_average: number
      languages: [
        {
          name: string
          total_seconds: number
        },
      ]
      categories: [
        {
          name: string
          total_seconds: number
        },
      ]
    }
  }
}

// Github stats
export interface Stats {
  stars: number
  totalCommits: number
  totalRepos: number
  followers: number
  contributions: number
  prs: number
  issues: number
  contributionCalendar: {
    totalContributions: number
    weeks: {
      contributionDays: {
        date: string
        contributionCount: number
      }[]
    }[]
  }
}

export interface GitHubStatsResponse {
  data: {
    user: {
      name: string
      login: string
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: {
              date: string
              contributionCount: number
            }[]
          }[]
        }
      }
      repositoriesContributedTo: {
        totalCount: number
      }
      pullRequests: {
        totalCount: number
      }
      openIssues: {
        totalCount: number
      }
      closedIssues: {
        totalCount: number
      }
      followers: {
        totalCount: number
      }
      repositories: {
        totalCount: number
        nodes: {
          name: string
          stargazers: {
            totalCount: number
          }
        }[]
      }
    }
  }
}
