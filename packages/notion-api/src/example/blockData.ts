import { Block, getBlockData, RichText } from '..';

function getBlockTextContentBefore(block: Block): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text;
    case 'heading_1':
      return block.heading_1.rich_text;
    case 'heading_2':
      return block.heading_2.rich_text;
    // ... etc, for many more block types
    default:
      throw new Error(`unknown block type: ${block.type}`);
  }
}

function getBlockTextContentAfter(block: Block): RichText[] {
  const blockData = getBlockData(block);
  const results: RichText[] = [];
  if ('rich_text' in blockData) {
    results.push(blockData.rich_text);
  }
  if ('caption' in blockData) {
    results.push(blockData.caption);
  }
  // Done.
  return results;
}

function getBlockTextContentAfterExhaustive(block: Block): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph': // Fall-through for blocks with only rich_text
    case 'heading_1':
    case 'heading_2': // ... etc
      return getBlockData(block).rich_text;
    case 'image':
      return getBlockData(block).caption;
    case 'code':
      return [getBlockData(block).rich_text, getBlockData(block).caption];
    // ... etc, for many more block types
    default:
      throw new Error(`unknown block type: ${block.type}`);
  }
}
