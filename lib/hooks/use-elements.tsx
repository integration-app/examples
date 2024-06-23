import { useState } from 'react'
import { useIntegrationApp } from '@integration-app/react'
import { PaginationResponse } from '@integration-app/sdk'
import useSWRInfinite from 'swr/infinite'
import qs from 'query-string'

export function useElements<Item>(route: string, query: any = {}) {
  const integrationApp = useIntegrationApp()

  const limit = query.limit ?? 25

  // Add token hash to keys to make sure that the cache is invalidated when the token changes
  const tokenHash = hashCode(integrationApp.token)

  function getKey(
    page: number,
    previousPageData: PaginationResponse<Item> | null,
  ) {
    // first page, we don't have `previousPageData`
    if (page === 0)
      return `/${route}?${qs.stringify({
        ...query,
        limit,
        hash: tokenHash,
      })}`

    // reached the end
    /* FIXME: strictNullCheck temporary fix */
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (previousPageData.items?.length < limit) return null

    return `/${route}?${qs.stringify({
      ...query,
      limit,
      /* FIXME: strictNullCheck temporary fix */
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      cursor: previousPageData.cursor,
      hash: tokenHash,
    })}`
  }

  const [loadingMore, setIsLoadingMore] = useState(false)

  const { data, size, setSize, isLoading, error, mutate, isValidating } =
    useSWRInfinite<PaginationResponse<Item>>(getKey, (url) =>
      integrationApp.get(url),
    )

  const items = data ? data.map((page) => page.items).flat() : []

  const loading = isLoading
  const refreshing = isValidating

  async function loadMore() {
    /* FIXME: strictNullCheck temporary fix */
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const hasMoreToLoad = data[size - 1]?.items?.length === limit

    if (hasMoreToLoad) {
      setIsLoadingMore(true)
      await setSize(size + 1)
      setIsLoadingMore(false)
    }
  }

  async function refresh() {
    await mutate()
  }

  return {
    items,

    refresh,
    refreshing,

    loadMore,
    loadingMore,

    loading,

    error,
  }
}

/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
function hashCode(s: string | undefined) {
  if (!s) {
    return 0
  }
  const l = s.length
  let h = 0,
    i = 0
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0
  return h
}
