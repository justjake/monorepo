import {
  getPropertyValue,
  inferDatabaseSchema,
  isFullPage,
  iteratePaginatedAPI,
  NotionClient,
  richTextAsPlainText,
} from '..';

async function schemaExample(notion: NotionClient, database_id: string) {
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
}
