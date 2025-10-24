import type { Post } from "@velite/content"
import type { FuseResult, IFuseOptions } from "fuse.js"
import type { ReactNode } from "react"
import { Mark } from "@mantine/core"
import Fuse from "fuse.js"
import { createElement } from "react"

// Type for search results with highlighting information
export interface SearchResult extends Post {
  matches?: ReadonlyArray<{
    key: string
    value: string
    indices: ReadonlyArray<[number, number]>
  }>
  score?: number
}

// Fuse.js configuration for optimized fuzzy search
const FUSE_OPTIONS: IFuseOptions<Post> = {
  keys: [
    { name: "title", weight: 2.5 }, // Most important - increased weight
    { name: "excerpt", weight: 1.5 }, // Important for content matching
    { name: "tags", weight: 2 }, // Important for categorization
    { name: "categories", weight: 2 }, // Important for categorization
    { name: "slug", weight: 1 }, // Added for URL matching
  ],
  threshold: 0.3, // Stricter matching threshold
  ignoreLocation: true, // Better for multi-language content
  minMatchCharLength: 3, // Reduced to support shorter search terms
  includeMatches: true, // Required for highlighting
  shouldSort: true, // Sort by relevance
  includeScore: true, // Include score for better filtering
  distance: 100, // Increased for better fuzzy matching
  useExtendedSearch: true, // Enable extended search capabilities
}

/**
 * Creates a new Fuse instance with the provided posts
 * @param posts Array of posts to search through
 * @returns Fuse instance configured with posts and options
 */
export function createSearchIndex(posts: Post[]): Fuse<Post> {
  return new Fuse(posts, FUSE_OPTIONS)
}

/**
 * Performs a fuzzy search on the provided Fuse instance
 * @param fuse Fuse instance to search with
 * @param query Search query string
 * @param limit Optional limit for number of results
 * @returns Array of search results with match information
 */
export function searchPosts(
  fuse: Fuse<Post>,
  query: string,
  limit: number = 10,
): SearchResult[] {
  if (!query?.trim() || query.trim().length < 2) {
    return []
  }

  const results = fuse.search(query, { limit })

  return results.map((result: FuseResult<Post>) => ({
    ...result.item,
    matches: result.matches?.map(match => ({
      key: match.key || "",
      value: match.value || "",
      indices: match.indices as ReadonlyArray<[number, number]>,
    })),
    score: result.score,
  }))
}

/**
 * Highlights matching text in the search results
 * @param text The text to highlight matches in
 * @param matches Array of match indices from Fuse.js
 * @returns Array of strings and React nodes with highlighted matches
 */
export function highlightMatches(
  text: string,
  matches?: ReadonlyArray<{ indices: ReadonlyArray<[number, number]> }>,
): (string | ReactNode)[] {
  if (!text || !matches?.length)
    return [text]

  // Get all match ranges and sort them, removing overlaps
  const ranges = matches
    .flatMap(match => match.indices.map(([start, end]) => ({ start, end })))
    .sort((a, b) => a.start - b.start)
    .reduce((acc: Array<{ start: number, end: number }>, curr) => {
      const prev = acc[acc.length - 1]
      if (!prev || curr.start > prev.end) {
        acc.push(curr)
      }
      else if (curr.end > prev.end) {
        prev.end = curr.end
      }
      return acc
    }, [])

  const result: (string | ReactNode)[] = []
  let lastIndex = 0

  ranges.forEach(({ start, end }, index) => {
    // Add text before the match
    if (start > lastIndex) {
      result.push(text.substring(lastIndex, start))
    }

    // Add the matched text with highlight (use createElement since this file is .ts)
    result.push(
      createElement(Mark, { color: "cyan", key: index }, text.substring(start, end + 1)),
    )

    lastIndex = end + 1
  })

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex))
  }

  return result
}

/**
 * Formats a search result excerpt with context around matched terms
 * @param text The full text to extract excerpt from
 * @param matches Array of match indices
 * @param contextLength Number of characters to include around matches
 * @returns Formatted excerpt with context
 */
export function formatSearchExcerpt(
  text: string,
  matches?: ReadonlyArray<{ indices: ReadonlyArray<[number, number]> }>,
  contextLength: number = 100,
): string {
  if (!text || !matches?.length)
    return text

  const firstMatch = matches[0].indices[0][0]
  const start = Math.max(0, firstMatch - contextLength)
  const end = Math.min(text.length, firstMatch + contextLength)

  let excerpt = text.substring(start, end)
  if (start > 0)
    excerpt = `...${excerpt}`
  if (end < text.length)
    excerpt = `${excerpt}...`

  return excerpt
}

/**
 * Filters search results by score threshold
 * @param results Array of search results
 * @param threshold Maximum score threshold (lower is better)
 * @returns Filtered array of search results
 */
export function filterSearchResults(
  results: SearchResult[],
  threshold: number = 0.5,
): SearchResult[] {
  return results.filter(result => result.score !== undefined && result.score < threshold)
}
