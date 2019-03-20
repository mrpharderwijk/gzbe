// Do not move or remove the @dynamic comment!
// @dynamic
export class ObjectHelper {
  /**
   * Checks if the path is accessible and not `undefined`.
   *
   * You should still get the value yourself without using dynamic code/strings, because that would prevent compiler errors from showing.
   * Back in the day, lodash/underscore provided a _.get to 'safely' get a value from an object or array.
   * Ramda has something for this as well called path.
   * This was great when we didn't compile our code yet, but since we're using Typescript now, that actually prevents
   * the compiler from properly detecting issues in your code.
   *
   * We all want to prevent code like this, which is where these functions come from:
   * ```ts
   * if (someObj && someObj.items && someObj.items[0] && someObj.items[0].id) { }
   * ```
   *
   * We can still prevent it using ObjectHelper.hasPath in below example.
   *
   * Example:
   *
   * ```ts
   * // This is OK
   * if (ObjectHelper.hasPath(someObj, 'items[0].id')) {
   *   return someObj.items[0].id; // << compiler would still warn if this is wrong
   * }
   * ```
   *
   * As you can see, the compiler still checks if someObj.items[0].id could indeed exist at all using type checking.
   * But if you also get the value dynamically, see below example, type checking cannot be done:
   *
   * ```ts
   * // This is NOT OK!
   * if (ObjectHelper.hasPath(someObj, 'items[0].id')) {
   *   return someWeirdDynamicGetSafeFunction(someObj, 'items[0].id'); // << compiler can't check this
   * }
   * ```
   *
   * So please do NOT add a hasValue/getValue/getSafe/getPath or whatever function here or anywhere else.
   * It's a little more code perhaps, but always get values from objects the 'hard way'.
   *
   * @param object
   * @param path
   */
  static hasPath(object: Object, path: string) {
    let result = false;

    try {
      const steps = this._pdGetPathFromString(path);
      let currentObject = object;

      steps.forEach(step => {
        currentObject = currentObject[step];
      });

      if (currentObject !== undefined) {
        result = true;
      }
    } catch (exception) {
      // Ignore the exception
    }

    return result;
  }

  /**
   * Checks if the given object is empty by checking its keys and if the property exists
   * @param obj
   */
  static isEmpty(obj: any): boolean {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  /**
   * Checks if the given parameter is a javascript object
   * As seen on: https://vanillajstoolkit.com/helpers/isplainobject/
   * @param obj
   */
  static isPlainObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * Returns the size of an object by number of properties
   * As seen on: https://stackoverflow.com/questions/5223/length-of-a-javascript-object
   * @param obj
   */
  static size(obj: any): number {
    return Object.keys(obj).length;
  }

  static values(obj: any) {
    if (Object.keys(obj).length) {
      return Object.keys(obj).reduce((accArr, currProp) => {
        return obj[currProp] ? accArr.concat(obj[currProp]) : accArr;
      }, []);
    }
  }

  static toArray(obj: any): any[] {
    if (!obj) {
      return;
    }
    return Object.keys(obj).map(key => obj[key]);
  }

  // Expands a JSON path into an array of 'steps' to take.
  private static _pdGetPathFromString(path: string) {
    const steps: string[] = [];
    // Borrowed this regexp from Lodash.
    const propertyRegexp = new RegExp(
      /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    );
    let match: RegExpExecArray;

    do {
      match = propertyRegexp.exec(path);
      if (match && match[0]) {
        if (match[0].startsWith('[') && match[0].endsWith(']')) {
          steps.push(match[0].substring(1, match[0].length - 1));
        } else {
          steps.push(match[0]);
        }
      }
    } while (match !== null);

    return steps;
  }
}
