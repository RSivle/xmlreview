
import { NewsItem, NewsItemMetadata } from '../types';

export const parseXMLFile = async (file: File): Promise<NewsItem> => {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error(`Invalid XML structure in ${file.name}`);
  }

  const newsitem = xmlDoc.querySelector('newsitem');
  if (!newsitem) {
    throw new Error(`No <newsitem> tag found in ${file.name}`);
  }

  const getText = (selector: string) => xmlDoc.querySelector(selector)?.textContent?.trim() || 'N/A';
  const getAttr = (selector: string, attr: string) => xmlDoc.querySelector(selector)?.getAttribute(attr) || 'N/A';

  const metadata: NewsItemMetadata = {
    language: getText('language'),
    mediaType: getText('mediatype'),
    source: {
      name: getAttr('source', 'name'),
      country: getAttr('source', 'country'),
    },
    docDate: getAttr('docdate', 'local'),
    physicalPosition: getAttr('physical_position', 'page'),
    logicalPosition: {
      value: getAttr('logical_position', 'value'),
      type: getAttr('logical_position', 'type'),
    }
  };

  return {
    id: crypto.randomUUID(),
    filename: file.name,
    headline: getText('headline'),
    subheadline: getText('subheadline'),
    story: getText('story'),
    metadata
  };
};
