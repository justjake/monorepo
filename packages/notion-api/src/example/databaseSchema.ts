import {
  databaseSchemaDiffToString,
  diffDatabaseSchemas,
  getPropertyValue,
  inferDatabaseSchema,
  isFullPage,
  iteratePaginatedAPI,
  NotionClient,
  richTextAsPlainText,
} from '..';
import { getAllProperties } from '../lib/notion-api';
import { databaseFilterBuilder } from '../lib/query';
import { runExample } from './exampleHelpers';

console.log('database schema');

runExample(module, 'Database schemas', async ({ notion, database_id, page_id }) => {
  const mySchema = inferDatabaseSchema({
    Title: { type: 'title' },
    SubTitle: { type: 'rich_text', name: 'Subtitle' },
    PublishedDate: { type: 'date', name: 'Published Date' },
    IsPublished: {
      type: 'checkbox',
      name: 'Show In Production',
      id: 'asdf123',
    },
  });

  // inferDatabaseSchema infers a concrete type with the same shape as the input,
  // so you can reference properties easily. It also adds `name` to each [[PropertySchema]]
  // based on the key name.
  console.log(mySchema.Title.name); // "Title"

  // You can use the properties in the inferred schema to access the corresponding
  // property value on a Page.
  for await (const page of iteratePaginatedAPI(notion.databases.query, {
    database_id,
  })) {
    if (isFullPage(page)) {
      const titleRichText = getPropertyValue(page, mySchema.Title);
      console.log('Title: ', richTextAsPlainText(titleRichText));
      const isPublished = getPropertyValue(page, mySchema.IsPublished);
      console.log('Is published: ', isPublished);
    }
  }

  // Print schema differences between our literal and the API.
  const database = await notion.databases.retrieve({ database_id });
  const diffs = diffDatabaseSchemas({ before: mySchema, after: database.properties });
  for (const change of diffs) {
    console.log(
      databaseSchemaDiffToString(change, { beforeName: 'mySchema', afterName: 'API database' })
    );
  }

  // Sketch
  const db = databaseFilterBuilder(mySchema);
  notion.databases.query({
    database_id,
    filter: db.or(db.IsPublished.equals(true), db.PublishedDate.after('2020-01-01')),
  });
  db.IsPublished.schema.id;

  const page = await notion.pages.retrieve({ page_id });
  if (isFullPage(page)) {
    const props = getAllProperties(page, db.schema);
    console.log(props.Title);
  }
});
