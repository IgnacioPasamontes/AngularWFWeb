import { Injectable } from '@angular/core';
import * as CkEditor5 from '../assets/js/ckeditor5/ckeditor.js';
@Injectable()
export class CkEditor {
  public ClassicEditor = CkEditor5.ClassicEditor;
  public InlineEditor = CkEditor5.InlineEditor;
}
