import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { asyncIterableToArray, isFullPage, iteratePaginatedAPI, NotionClient, Page } from '..';

declare const notion: NotionClient;
declare const databaseId: string;

async function iterateDB() {
  for await (const page of iteratePaginatedAPI(notion.databases.query, {
    database_id: databaseId,
  })) {
    if (isFullPage(page)) {
      // TODO
    }
  }
}

declare const getNotionClient: () => NotionClient;
declare const logger: typeof console;

/**
 * Query all pages and return all records from a Notion database object
 *  Will log a warning if database has no records
 * @param parameters To specify database id, control sorting, filtering and
 *   pagination, directly using Notion's sdk types
 * @returns A list of all the results from the database or an empty array
 */
const queryAll = async (parameters: QueryDatabaseParameters): Promise<Page[]> => {
  const params: typeof parameters = { ...parameters };
  const resultsWithPartialPages = await asyncIterableToArray(
    // getNotionClient() returns an authenticated instance of the notion SDK
    iteratePaginatedAPI(getNotionClient().databases.query, parameters)
  );

  // Filter out partial pages
  const fullPages = resultsWithPartialPages.filter(isFullPage);

  if (!fullPages.length) {
    logger.warn(`No results found in database ${params.database_id}`);
  }
  return fullPages;
};
