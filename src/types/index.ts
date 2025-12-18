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

// Github Stats (general summary)
export interface Stats {
  stars: number
  totalCommits: number
  totalRepos: number
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

// GitHub GraphQL Response (extended)
// To support monthly metrics
export interface GitHubStatsResponse {
  data: {
    user: {
      // --- Existing data ---
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
      repositories: {
        totalCount: number
        nodes: {
          name: string
          stargazers: {
            totalCount: number
          }
        }[]
      }

      // New fields for monthly metrics
      issues: {
        pageInfo: {
          hasNextPage: boolean
          endCursor: string | null
        }
        nodes: {
          number: number
          createdAt: string
          closedAt: string | null
          state: "OPEN" | "CLOSED"
          repository: {
            name: string
          }
        }[]
      }
      pullRequestsDetailed: {
        pageInfo: {
          hasNextPage: boolean
          endCursor: string | null
        }
        nodes: {
          number: number
          createdAt: string
          mergedAt: string | null
          closedAt: string | null
          state: "OPEN" | "CLOSED" | "MERGED"
          repository: {
            name: string
          }
        }[]
      }
      repositoriesDetailed: {
        pageInfo: {
          hasNextPage: boolean
          endCursor: string | null
        }
        nodes: {
          name: string
          createdAt: string
          stargazerCount: number
        }[]
      }
      starredRepositories: {
        pageInfo: {
          hasNextPage: boolean
          endCursor: string | null
        }
        edges: {
          starredAt: string
          node: {
            name: string
            owner: {
              login: string
            }
          }
        }[]
      }
    }
  }

  errors?: Array<{
    message: string
  }>
}

export interface MonthlyStats {
  issues: Record<string, number>
  prs: Record<string, number>
  repos: Record<string, number>
  stars: Record<string, number>
}

// Response specific for the MonthlyStats query
export interface GitHubMonthlyStatsResponse {
  data: {
    user: {
      issues: {
        nodes: {
          createdAt: string
        }[]
      }
      pullRequests: {
        nodes: {
          createdAt: string
        }[]
      }
      repositories: {
        nodes: {
          createdAt: string
        }[]
      }
      starredRepositories: {
        edges: {
          starredAt: string
        }[]
      }
    }
  }
  errors?: Array<{
    message: string
  }>
}
