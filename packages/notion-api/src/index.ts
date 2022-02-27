/**
 * @module
 * @packageDocumentation
 *
 * Module `@jitl/notion-api` provides extensions and helpers for the official
 * Notion public API.
 *
 * This library uses `@notionhq/client` as a peer dependency for both types and
 * to re-use the official client.
 *
 * The library is broadly separated into distinct feature sets:
 *
 * - A set of helpers for working with the Notion API. This includes
 *   common types derived from the API's response types, and some iteration helpers
 *   for fetching content. See the file [./lib/notion-api.ts](./lib/notion-api.ts)
 *   for details.
 *
 * - A content management system supporting functions for downloading and
 *   caching content from a Notion database. The high-level interface for these
 *   features is the [[CMS]] class in the file
 *   [./lib/content-management-system.ts](./lib/content-management-system.ts), but
 *   related lower-level tools for working with Notion assets are also exported.
 */
export * from './lib/notion-api';
export * from './lib/content-management-system';
export * from './lib/assets';
export * from './lib/cache';
export * from './lib/backlinks';
