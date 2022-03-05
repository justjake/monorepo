import { NotionClient } from "..";

let done: Promise<void> = Promise.resolve();

export interface ExampleContext {
  name: string;
  notion: NotionClient;
  database_id: string;
}

export function runExample(
  module: NodeJS.Module,
  name: string,
  fn: (context: ExampleContext) => void | Promise<void>
) {
  if (module !== require.main) {
    console.error('Skipping example "' + name + '" because it is not the main module.');
    return;
  }

  const notion = new NotionClient({
    auth: process.env.NOTION_SECRET,
  });

  const exampleContext: ExampleContext = {
    notion,
    name,
    database_id: process.env.NOTION_DATABASE_ID || "No NOTION_DATABASE_ID",
  };

  console.error("Running example: " + name);
  done.then(() => {
    done = (async function nextExample() {
      const begin = Date.now();
      try {
        await fn(exampleContext);
        const end = Date.now();
        console.error(`Example completed: ${name} in`, end - begin, "ms");
      } catch (error) {
        console.error("Example failed:", name, "error: ", error);
      }
    })();
  });
}
