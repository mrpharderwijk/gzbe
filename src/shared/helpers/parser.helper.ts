/**
 * This parser from:
 * https://andrew.stwrt.ca/posts/js-xml-parsing/
 */
import { Article } from '../models/article/article.model';
import { ObjectHelper } from './object.helper';

// flattens an object (recursively!), similarly to Array#flatten
// e.g. flatten({ a: { b: { c: "hello!" } } }); // => "hello!"
function flatten(object) {
  const check =
    ObjectHelper.isPlainObject(object) && ObjectHelper.size(object) === 1;
  return check ? flatten(ObjectHelper.values(object)[0]) : object;
}

export function parse(xml) {
  const data = {};
  console.log(xml);
  // xml = ObjectHelper.toArray(xml.children)[0];

  const isText = xml.nodeType === 3;
  const isElement = xml.nodeType === 1;
  const body = xml.textContent && xml.textContent.trim();
  const hasChildren =
    ObjectHelper.hasPath(xml, 'children') &&
    ObjectHelper.toArray(xml.children).length;
  const hasAttributes =
    ObjectHelper.hasPath(xml, 'attributes') &&
    xml.attributes &&
    ObjectHelper.toArray(xml.attributes).length;

  // if it's text just return it
  if (isText) {
    return xml.nodeValue.trim();
  }

  // if it doesn't have any children or attributes, just return the contents
  if (!hasChildren && !hasAttributes) {
    return body;
  }

  // if it doesn't have children but _does_ have body content, we'll use that
  //
  if (!hasChildren && body.length) {
    data['text'] = body;
  }

  // if it's an element with attributes, add them to data.attributes
  if (isElement && hasAttributes) {
    const attributes = ObjectHelper.toArray(xml.attributes);
    data['attributes'] = attributes.reduce((accObj, name, index) => {
      const attr = attributes[index];
      accObj[attr.name] = attr.value;
      return accObj;
    }, {});
  }

  // recursively call #parse over children, adding results to data
  ObjectHelper.toArray(xml.children).forEach(child => {
    const name = child.nodeName;

    // if we've not come across a child with this nodeType, add it as an object
    // and return here
    if (!ObjectHelper.hasPath(data, name)) {
      data[name] = parse(child);
      return;
    }

    // if we've encountered a second instance of the same nodeType, make our
    // representation of it an array
    if (!Array.isArray(data[name])) {
      data[name] = [data[name]];
    }

    // and finally, append the new child
    data[name].push(parse(child));
  });

  // if we can, let's fold some attributes into the body
  if (ObjectHelper.hasPath(data, 'attributes')) {
    Object.keys(data['attributes']).forEach(attribute => {
      if (data[attribute] != null) {
        return;
      }
      data[attribute] = data['attributes'][attribute];
      delete data['attributes'][attribute];
    });
  }

  // if data['attributes'] is now empty, get rid of it
  if (ObjectHelper.isEmpty(data['attributes'])) {
    delete data['attributes'];
  }

  // simplify to reduce number of final leaf nodes and return
  return flatten(data);
}

export function formatArticle(article: Article) {
  article.isoDate = new Date(article.isoDate).toISOString();
  article.author =
    article.author || article['dc:creator'] || article['creator'];
  article.categories = article.categories || article['category'];
  if (typeof article.categories === 'string') {
    article.categories = [article.categories]; // tslint:disable-line
  }
  return article;
}
