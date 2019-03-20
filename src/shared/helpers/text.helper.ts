// Do not move or remove the @dynamic comment!
// @dynamic
export class TextHelper {
  static truncate(text: string, maxLength: number, useWordBoundary = false) {
    return text
      .split(' ')
      .splice(0, maxLength)
      .join(' ');
  }
}
