import { Block, getBlockData, RichText } from '..';

function getBlockTextContentBefore(block: Block): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.text;
    case 'heading_1':
      return block.heading_1.text;
    case 'heading_2':
      return block.heading_2.text;
    // ... etc, for many more block types
    default:
      throw new Error(`unknown block type: ${block.type}`);
  }
}

function getBlockTextContentAfter(block: Block): RichText[] {
  const blockData = getBlockData(block);
  const results: RichText[] = [];
  if ('text' in blockData) {
    results.push(blockData.text);
  }
  if ('caption' in blockData) {
    results.push(blockData.caption);
  }
  // Done.
  return results;
}

function getBlockTextContentAfterExhaustive(
  block: Block
): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph': // Fall-through for blocks with only text
    case 'heading_1':
    case 'heading_2': // ... etc
      return getBlockData(block).text;
    case 'image':
      return getBlockData(block).caption;
    case 'code':
      return [getBlockData(block).text, getBlockData(block).caption];
    // ... etc, for many more block types
    default:
      throw new Error(`unknown block type: ${block.type}`);
  }
}
